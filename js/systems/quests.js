const Quests = {
  MAX_ACTIVE: 5,

  // Масштабирование награды от уровня игрока
  calcReward(baseMoney, level) {
    const lvl = level || (State.player && State.player.level) || 1;
    let mult = 1 + lvl * 0.15;
    mult = Math.min(3, mult);  // потолок ×3
    return Math.round(baseMoney * mult);
  },

  // Множитель уровня для потенциально-опасных квестов
  isDangerous(q) {
    return q.dangerous === true;
  },

  // Пометить квест как «опасный» (для генерации)
  maybeDangerify(q) {
    if (!State.player) return;
    const lvl = State.player.level || 1;
    if (lvl < 8) return;  // до 8-го уровня нет опасных
    if (Utils.chance(0.3)) {
      q.dangerous = true;
      q.risk = Math.min(0.9, q.risk * 1.5);
      q.reward.money = Math.round(q.reward.money * 2);
      q.title = '[ОПАСНО] ' + q.title;
    }
  },

  accept(questId) {
    if (!State.quests) State.quests = { available: [], active: [], completed: [], failed: [], dailyReset: 1 };
    const q = State.quests.available.find(x => x.id === questId);
    if (!q) { Engine.log('Квест не найден.', 'warn'); return { ok: false, reason: 'Квест не найден' }; }
    if (State.quests.active.length >= this.MAX_ACTIVE) {
      Engine.log('Больше ' + this.MAX_ACTIVE + ' квестов не взять. Голова не резиновая.', 'warn');
      return { ok: false };
    }
    // #51: проверяем время ДО добавления
    if (!Time.canSpend(0.5)) {
      Engine.log('Слишком поздно. Возьми утром.', 'warn');
      return { ok: false };
    }
    State.quests.available = State.quests.available.filter(x => x.id !== questId);
    q.acceptedDay = State.time.day;
    q.acceptedAt = State.time.hour;
    State.quests.active.push(q);
    Engine.log('Квест принят: ' + q.title, 'good');
    Time.spend(0.5);
    if (!State.player || !State.city) return { ok: false };
    Save.save();
    Engine.go('quests');
    return { ok: true };
  },

  execute(questId) {
    if (!State.quests) State.quests = { available: [], active: [], completed: [], failed: [], dailyReset: 1 };
    const q = State.quests.active.find(x => x.id === questId);
    if (!q) return { ok: false, reason: 'Квест не найден' };

    if (q.type === 'combat') {
      if (!State.player || !State.player.level) return { ok: false, reason: 'Нет игрока' };
      // #G: опасный квест — враг +2 уровня
      try {
        const enemyLevel = State.player.level + (q.dangerous ? 2 : 0);
        const enemy = Combat.spawnEnemy(enemyLevel, { affiliation: 'independent' });
        if (q.dangerous) {
          enemy.loot.money = Math.round(enemy.loot.money * 1.5);
        }
        Engine.log('Ты готовишь оружие...', 'warn');
        const started = Combat.start(enemy, { type: 'quest', questId, returnScreen: 'quests' });
        if (!started) {
          Engine.log('Не удалось начать бой. Ты уже в перестрелке?', 'bad');
          return { ok: false, reason: 'Бой уже идёт' };
        }
        return { ok: true, combat: true };
      } catch (err) {
        Engine.log('КРИТИЧЕСКАЯ ОШИБКА БОЯ: ' + err.message, 'bad');
        console.error(err);
        return { ok: false, reason: err.message };
      }
    }

    if (!Time.spend(q.duration, 'Выполнение: ' + q.title)) {
      return { ok: false, reason: 'Слишком поздно' };
    }
    if (!State.player || !State.city) return { ok: false };

    let effectiveRisk = q.risk;
    if (typeof Perks !== 'undefined') {
      const mods = Perks.getModifiers();
      effectiveRisk = Math.max(0.02, effectiveRisk - (mods.questRiskReduction || 0));
    }

    if (Utils.chance(effectiveRisk)) {
      this.fail(questId, q.title);
    } else {
      this.reward(questId);
    }
    Engine.go('quests');
    return { ok: true };
  },

  reward(questId) {
    if (!State.quests) State.quests = { available: [], active: [], completed: [], failed: [], dailyReset: 1 };
    const q = State.quests.active.find(x => x.id === questId);
    if (!q) {
      Engine.log('Квест уже недоступен. Возможно, ты не дожил до награды.', 'warn');
      return;
    }
    let moneyBonus = 0;
    let repBonus = 0;
    if (typeof Perks !== 'undefined') {
      const mods = Perks.getModifiers();
      moneyBonus = mods.questMoneyBonus || 0;
      repBonus = mods.repPerQuest || 0;
    }
    // #G: масштабирование награды от уровня
    const scaledMoney = this.calcReward(q.reward.money);
    const finalMoney = Math.round(scaledMoney * (1 + moneyBonus));
    const finalRep = q.reward.rep + repBonus;

    Economy.earn(finalMoney, 'награда за «' + q.title + '»');
    Economy.addXp(q.reward.xp);
    Economy.changeRep(finalRep, 'репутация выросла');
    State.quests.active = State.quests.active.filter(x => x.id !== questId);
    State.quests.completed.push(q);
    if (!State.player.lifetime) State.player.lifetime = { kills: 0, moneyEarned: 0, missionsDone: 0, daysSurvived: 0, deaths: 0, overdoses: 0, breakdowns: 0 };
    State.player.lifetime.missionsDone++;
    Engine.log(Utils.pick(Lore.noir.actions.questWin) + ' (' + q.title + ')', 'good');
    Save.save();
  },

  fail(questId, reason) {
    if (!State.quests) State.quests = { available: [], active: [], completed: [], failed: [], dailyReset: 1 };
    const q = State.quests.active.find(x => x.id === questId);
    if (!q) return;
    Economy.changeRep(-3, 'Провал: ' + (reason || q.title));
    if (Utils.chance(0.5)) {
      const part = Utils.pick(['leftArm', 'rightArm', 'leftLeg', 'rightLeg']);
      const dmg = Utils.rnd(15, 35);
      if (State.player && State.player.body && State.player.body[part]) {
        State.player.body[part].hp = Math.max(0, State.player.body[part].hp - dmg);
      }
      const names = { leftArm: 'левая рука', rightArm: 'правая рука', leftLeg: 'левая нога', rightLeg: 'правая нога' };
      Engine.log(Utils.pick(Lore.noir.actions.questFail) + ' Тебе досталось: −' + dmg + ' HP (' + names[part] + ').', 'bad');
    }
    State.quests.active = State.quests.active.filter(x => x.id !== questId);
    State.quests.failed.push(q);
    Save.save();
  },

  resetDaily() {
    if (!State.quests) State.quests = { available: [], active: [], completed: [], failed: [], dailyReset: 1 };
    const today = State.time.day;
    // Убираем все daily
    State.quests.available = State.quests.available.filter(q => !q.daily);
    // TTL: стартовые и фракционные живут 3 дня, потом исчезают
    State.quests.available = State.quests.available.filter(q => {
      const created = q.createdDay || 1;
      return (today - created) < 3;
    });
    // Cap 15 — не больше
    if (State.quests.available.length > 15) {
      State.quests.available = State.quests.available.slice(-15);
    }
    this.generateDaily();
  },

  generateDaily() {
    // Проверяем, есть ли полиция в городе
    const police = State.factions.find(f => f.isPolice);
    
    // 30% шанс, что один из квестов будет от полиции
    if (police && Utils.chance(0.3)) {
      const copTemplates = [
        { type: 'stealth', title: 'Сдать мафию', desc: 'Копы ищут улики на одну из банд. За хорошую наводку они платят. И не задают вопросов.', risk: 0.2, reward: { money: 600, xp: 50, rep: -5 } },
        { type: 'social', title: 'Найти стукача', desc: 'В полиции работает «крот». Они хотят знать, кто это. Ты знаешь район, где он живёт.', risk: 0.3, reward: { money: 800, xp: 60, rep: -5 } },
        { type: 'combat', title: 'Совместный рейд', desc: 'Полиция проводит облаву. Им нужны люди, которые знают, как выбивать двери. Неофициально, конечно.', risk: 0.4, reward: { money: 1200, xp: 100, rep: -10 } }
      ];
      
      const tpl = Utils.pick(copTemplates);
      const zone = Utils.pick(State.zones);
      if (tpl && zone) {
      const newQuest = {
        id: 'q_cop_' + Utils.uid(),
        type: tpl.type,
        title: '[Полиция] ' + tpl.title,
        desc: tpl.desc,
        zoneId: zone.id,
        zoneName: zone.name,
        giverId: police.leaderId,
        giverName: 'Анонимный коп',
        duration: 3,
        risk: tpl.risk,
        reward: tpl.reward,
        deadline: null,
        daily: true,
        createdDay: State.time.day,
        fromFaction: police.id
      };
      State.quests.available.push(newQuest);
      }
    }

    const count = Utils.rnd(3, 5);
    const used = Utils.shuffle(QuestData.templates).slice(0, count);
    for (const tpl of used) {
      const zone = Utils.pick(State.zones);
      const giver = Utils.pick(State.npcs);
      if (!zone || !giver) continue;
      const newQuest = {
        id: 'q_' + Utils.uid(),
        type: tpl.type,
        title: tpl.title,
        desc: tpl.desc,
        zoneId: zone.id,
        zoneName: zone.name,
        giverId: giver.id,
        giverName: giver.name,
        duration: QuestData.durations[tpl.type] || 3,
        risk: tpl.risk,
        reward: { ...tpl.reward },
        deadline: null,
        daily: true,
        createdDay: State.time.day,
      };
      // #G: опасный квест?
      this.maybeDangerify(newQuest);
      State.quests.available.push(newQuest);
    }
  },

  tickDeadlines() { /* фаза 3 */ },
};
