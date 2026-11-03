// ═══ СИСТЕМА ДИАЛОГОВ ═══
const Dialogues = {
  // Хелпер: проверить, что игрок ещё жив после Time.spend
  alive() { return State.player && State.city; },

  getRelation(faction) {
    if (!faction || !faction.relations) return 0;
    return faction.relations.player || 0;
  },

  setRelation(faction, value) {
    if (!faction.relations) faction.relations = {};
    faction.relations.player = Utils.clamp(value, -100, 100);
  },

  adjustRelation(faction, delta) {
    this.setRelation(faction, this.getRelation(faction) + delta);
  },

  getGreeting(faction) {
    if (typeof DialogueData === 'undefined' || !DialogueData.greetings) return '«…»';
    const rel = this.getRelation(faction);
    let tone = 'neutral';
    if (rel < -30) tone = 'hostile';
    else if (rel < 10) tone = 'cold';
    else if (rel > 40) tone = 'warm';
    return Utils.pick(DialogueData.greetings[tone] || DialogueData.greetings.neutral);
  },

  // ═══ СОЮЗ ═══
  breakAlly(factionId) {
    if (!State.player) return;
    const faction = (State.factions || []).find(f => f.id === factionId);
    if (!faction || !faction.allyWithPlayer) return;
    
    faction.allyWithPlayer = false;
    this.adjustRelation(faction, -60);
    Economy.changeRep(-15, 'Предательство союзника');
    
    // 50% шанс что станут врагами
    if (Utils.chance(0.5)) {
      faction.enemyId = 'player';
      Engine.log('Ты предал ' + faction.name + '. Теперь они пойдут на всё.', 'bad');
    } else {
      Engine.log('Ты разрываешь союз с ' + faction.name + '. Они это запомнят.', 'warn');
    }
    
    Save.save();
  },

  proposeAlly(factionId) {
    if (!State.player || !State.player.stats) return { ok: false, text: 'Нет игрока' };
    const faction = (State.factions || []).find(f => f.id === factionId);
    if (!faction) return { ok: false, text: 'Фракция не найдена' };
    
    // Если фракция мертва (0 зон), с кем союз заключать?
    if (faction.zones <= 0 && !faction.isPolice) {
      return { ok: false, text: 'Их больше нет. С кем ты собираешься договариваться?' };
    }

    if (faction.allyWithPlayer) return { ok: false, text: Utils.pick(DialogueData.ally_status) };
    
    // Лимит союзов — максимум 2
    const currentAllies = State.factions.filter(f => f.allyWithPlayer && !f.isPolice);
    if (currentAllies.length >= 2) {
      return { ok: false, text: 'У тебя уже два союзника. Третий — это уже не союз, а цирк.' };
    }
    
    // Запрет: нельзя союз с врагом текущего союзника
    for (const ally of currentAllies) {
      if (!ally.relations) continue;
      const relWithNew = ally.relations[faction.id] || 0;
      if (relWithNew < -40) {
        return { ok: false, text: 'Они враждуют с твоим союзником ' + ally.name + '. Сначала разорви союз с ним, если хочешь договориться с этими.' };
      }
    }

    if (!Time.canSpend(0.5)) return { ok: false, text: 'Слишком поздно. Утро вечера мудренее.' };

    const rel = this.getRelation(faction);
    const cha = State.player.stats.charisma || 5;
    const rep = State.player.reputation || 0;
    
    let chance = 0.2 + cha / 30 + rel / 200;
    
    // Модификатор репутации (бонус за уважение)
    if (rep > 20) chance += 0.05;
    if (rep > 50) chance += 0.05;
    if (rep > 100) chance += 0.05;

    // Модификатор силы фракции (сильным союз не нужен)
    if (faction.power > 7) chance -= 0.1;

    // Модификатор характера/настроения
    const effTrait = (typeof Faction !== 'undefined') ? Faction.getEffectiveTrait(faction) : faction.trait;
    if (effTrait === 'агрессивный') chance -= 0.15;
    else if (effTrait === 'торговый') chance += 0.10;
    else if (effTrait === 'осторожный') chance -= 0.10; // осторожные боятся связываться

    // Если у тебя высокий Heat, им не нужны проблемы с копами
    if (State.player.heat > 50) chance -= 0.15;

    chance = Utils.clamp(chance, 0.05, 0.9);

    Time.spend(0.5);
    if (!this.alive()) return { ok: false, text: '' };

    if (Utils.chance(chance)) {
      faction.allyWithPlayer = true;
      if (State.politics) State.politics.playerInfluence += 5;
      this.adjustRelation(faction, 30);
      Economy.changeRep(5, 'Союз — это сила');
      Save.save();
      return { ok: true, text: Utils.pick(DialogueData.results.ally_yes) };
    } else {
      this.adjustRelation(faction, -15);
      Save.save();
      return { ok: false, text: Utils.pick(DialogueData.results.ally_no) };
    }
  },

  // ═══ ТОРГОВЛЯ ═══
  trade(factionId) {
    if (!State.player) return { ok: false, text: 'Нет игрока' };
    const faction = (State.factions || []).find(f => f.id === factionId);
    if (!faction) return { ok: false, text: 'Фракция не найдена' };

    const today = State.time.day;
    if (faction.tradeDay === today) {
      return { ok: false, text: 'Сегодня уже торговались. Приходи завтра.' };
    }
    if (!Time.canSpend(0.25)) {
      return { ok: false, text: 'Слишком поздно.' };
    }

    const rel = this.getRelation(faction);
    const chance = Utils.clamp(0.5 + rel / 200, 0.1, 0.9);
    faction.tradeDay = today;

    Time.spend(0.25);
    if (!this.alive()) return { ok: false, text: '' };

    if (Utils.chance(chance)) {
      let gold = 50 + Math.max(0, rel);
      // Бонус торгового характера
      const effTrait = (typeof Faction !== 'undefined') ? Faction.getEffectiveTrait(faction) : faction.trait;
      if (effTrait === 'торговый') gold = Math.round(gold * 1.5);
      else if (effTrait === 'агрессивный') gold = Math.round(gold * 0.7);
      Economy.earn(gold, 'Торговля: ' + faction.name);
      this.adjustRelation(faction, 5);
      Save.save();
      return { ok: true, text: Utils.pick(DialogueData.results.trade_yes) };
    } else {
      this.adjustRelation(faction, -5);
      Save.save();
      return { ok: false, text: Utils.pick(DialogueData.results.trade_no) };
    }
  },

  // ═══ УГРОЗА ═══
  threaten(factionId) {
    if (!State.player || !State.player.stats) return { ok: false, text: 'Нет игрока' };
    const faction = (State.factions || []).find(f => f.id === factionId);
    if (!faction) return { ok: false, text: 'Фракция не найдена' };
    
    if (faction.zones <= 0 && !faction.isPolice) {
      return { ok: false, text: 'У них ничего не осталось. Угрожать некому.' };
    }

    const today = State.time.day;
    if (faction.threatDay === today) return { ok: false, text: 'Сегодня уже давил на них. Приходи завтра.' };
    if (!Time.canSpend(0.25)) return { ok: false, text: 'Слишком поздно.' };
    if (State.player.heat >= 80) return { ok: false, text: 'Слишком высокий heat. Тебя самого ищут.' };

    const cha = State.player.stats.charisma || 5;
    const rep = State.player.reputation || 0;
    
    let chance = cha / 50 - faction.power / 20;

    // Бонус за репутацию (тебя боятся)
    if (rep > 30) chance += 0.1;
    if (rep > 80) chance += 0.1;

    // Бонус за оружие в руках
    const weapon = Weapons.find(State.player.currentWeaponId);
    if (weapon && (weapon.category === 'shotgun' || weapon.category === 'rifle')) {
      chance += 0.15; // С дробовиком убедительнее
    }

    // Модификатор настроения
    const effTrait = (typeof Faction !== 'undefined') ? Faction.getEffectiveTrait(faction) : faction.trait;
    if (effTrait === 'агрессивный') chance -= 0.15; // они злятся
    else if (effTrait === 'осторожный') chance += 0.15; // они боятся

    chance = Utils.clamp(chance, 0.1, 0.9);
    faction.threatDay = today;

    Time.spend(0.25);
    if (!this.alive()) return { ok: false, text: '' };

    if (Utils.chance(chance)) {
      const gold = faction.power * 100;
      Economy.earn(gold, 'Угроза: ' + faction.name);
      Economy.changeHeat(10, 'Угрожал фракции');
      this.adjustRelation(faction, -25);
      Save.save();
      return { ok: true, text: Utils.pick(DialogueData.results.threat_yes) };
    } else {
      this.adjustRelation(faction, -40);
      if (Utils.chance(0.3)) faction.enemyId = 'player';
      Save.save();
      return { ok: false, text: Utils.pick(DialogueData.results.threat_no) };
    }
  },

  // ═══ РАБОТА ═══
  askJob(factionId) {
    if (!State.player) return { ok: false, text: 'Нет игрока' };
    if (typeof QuestData === 'undefined' || !QuestData.templates) return { ok: false, text: 'Квесты недоступны.' };
    const faction = (State.factions || []).find(f => f.id === factionId);
    if (!faction) return { ok: false, text: 'Фракция не найдена' };

    // #132: 1 работа на фракцию в день
    const today = State.time.day;
    if (faction.jobDay === today) {
      return { ok: false, text: 'Он уже дал тебе работу на сегодня. Хватит.' };
    }

    if (!Time.canSpend(0.25)) return { ok: false, text: 'Слишком поздно.' };
    if (!State.zones || State.zones.length === 0) {
      return { ok: false, text: 'В городе нет зон для работы.' };
    }
    if (!State.quests || !State.quests.available) {
      return { ok: false, text: 'Список квестов недоступен.' };
    }

    const templates = QuestData.templates;
    const tpl = Utils.pick(templates);
    const zone = Utils.pick(State.zones);
    const leader = State.npcs.find(n => n.id === faction.leaderId);

    const quest = {
      id: 'q_faction_' + Utils.uid(),
      type: tpl.type,
      title: '[Фракция] ' + tpl.title,
      desc: tpl.desc,
      zoneId: zone.id,
      zoneName: zone.name,
      giverId: faction.leaderId,
      giverName: leader ? leader.name : faction.name,
      duration: QuestData.durations[tpl.type] || 3,
      risk: Math.min(0.9, tpl.risk + 0.05),
      reward: {
        money: Math.round(tpl.reward.money * 1.5),
        xp: tpl.reward.xp,
        rep: tpl.reward.rep,
      },
      deadline: null,
      daily: false,
      fromFaction: faction.id,
      createdDay: State.time.day,
    };

    // Лимит — не больше 3 фракционных квестов в available
    const factionQuests = State.quests.available.filter(q => q.fromFaction);
    if (factionQuests.length >= 3) {
      // Удаляем самый старый
      const oldest = factionQuests.sort((a, b) => (a.createdDay || 1) - (b.createdDay || 1))[0];
      State.quests.available = State.quests.available.filter(q => q.id !== oldest.id);
    }

    faction.jobDay = today;
    Time.spend(0.25);
    if (!this.alive()) return { ok: false, text: '' };

    State.quests.available.unshift(quest);
    this.adjustRelation(faction, 3);
    Save.save();
    return { ok: true, text: Utils.pick(DialogueData.results.job_yes) };
  },

  // ═══ ТАЙНА ═══
  askMystery(factionId) {
    if (!State.player) return { ok: false, text: 'Нет игрока' };
    const faction = (State.factions || []).find(f => f.id === factionId);
    if (!faction) return { ok: false, text: 'Фракция не найдена' };
    if (!State.player.story) return { ok: false, text: 'Ты ещё никто.' };
    if (!State.player.story.flags) State.player.story.flags = { mysteryStep: 0 };

    const today = State.time.day;
    if (faction.mysteryDay === today) {
      return { ok: false, text: 'Он уже говорил сегодня. Дай время.' };
    }
    if (this.getRelation(faction) < 0) {
      return { ok: false, text: 'Он не станет говорить с тобой. Слишком плохие отношения.' };
    }
    if (!Time.canSpend(0.25)) return { ok: false, text: 'Слишком поздно.' };

    // #127: проверка ДО Time.spend — если всё знаешь, не трать время
    const step = State.player.story.flags.mysteryStep || 0;
    if (step >= 5) {
      return { ok: false, text: 'Ты уже знаешь всё. Имя у тебя в голове.' };
    }

    faction.mysteryDay = today;
    Time.spend(0.25);
    if (!this.alive()) return { ok: false, text: '' };

    State.player.story.flags.mysteryStep = step + 1;
    Economy.addXp(50);
    this.adjustRelation(faction, 5);
    Save.save();

    if (step + 1 === 5) {
      return { ok: true, text: Utils.pick(DialogueData.results.mystery_full) + ' (' + DialogueData.mystery_steps[step] + ')' };
    }
    return { ok: true, text: Utils.pick(DialogueData.results.mystery_hint) + ' ' + DialogueData.mystery_steps[step] };
  },
};
