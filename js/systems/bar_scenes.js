const BarSystem = {
  getRandomScene() {
    if (!State.player.barHistory) State.player.barHistory = [];
    const p = State.player;
    if ((p.barVisitsToday || 0) >= 2) {
      return { id: 'limit_reached', title: 'Бармен устал', desc: 'Бармен вытирает стакан грязной тряпкой. «Ты сегодня уже дважды тут всё обшарил. Иди, проветрись».', choices: [ { text: 'Уйти', action: 'none', log: 'Ты выходишь на улицу.' } ] };
    }
    // ═══ ПРИОРИТЕТ: СЛУХИ (repeatable) если сюжетные кончились ═══
    const story = BarScenes.filter(s => {
      if (s.repeatable) return false;
      if (p.barHistory.includes(s.id)) return false;
      if (s.requires) {
        if (s.requires.minHeat && p.heat < s.requires.minHeat) return false;
        if (s.requires.minMoney && p.money < s.requires.minMoney) return false;
        if (s.requires.minLevel && p.level < s.requires.minLevel) return false;
        if (s.requires.minHour && State.time.hour < s.requires.minHour) return false;
      }
      return true;
    });
    const rumors = BarScenes.filter(s => {
      if (!s.repeatable) return false;
      if (s.requires) {
        if (s.requires.minHeat && p.heat < s.requires.minHeat) return false;
        if (s.requires.minMoney && p.money < s.requires.minMoney) return false;
        if (s.requires.minLevel && p.level < s.requires.minLevel) return false;
        if (s.requires.minHour && State.time.hour < s.requires.minHour) return false;
      }
      return true;
    });
    
    // 60% сюжетная (если есть), иначе слух, иначе пустота
    if (story.length > 0 && Utils.chance(0.6)) return Utils.pick(story);
    if (rumors.length > 0) return Utils.pick(rumors);
    if (story.length > 0) return Utils.pick(story);
    
    return { id: 'empty_bar', title: 'Пустота', desc: 'Ты смотришь по сторонам. Те же лица. Тот же дым. Все истории в этом баре ты уже слышал. Ты заказываешь ещё одну бутылку.', choices: [ { text: 'Пить в одиночестве', action: 'drink_alone', log: 'Ты пьёшь, пока мир не станет размытым. Стресс уходит, но рассудок трещит по швам.' } ] };
  },
  resolve(sceneId, choiceIndex) {
    if (sceneId === 'limit_reached') return Engine.go('bar');
    if (sceneId === 'empty_bar') {
      if (State.player.flags && State.player.flags.inJail) {
        Engine.log('В камере нет бара. Только стены.', 'warn');
        return Engine.go('bar');
      }
      State.player.sanity.stress = Utils.clamp(State.player.sanity.stress - 20, 0, 100);
      State.player.sanity.sanity = Utils.clamp(State.player.sanity.sanity - 10, 0, 100);
      Time.spend(2, 'Ты сидишь в одиночестве, глядя в стакан.');
      if (!State.player || !State.city) return; // #57
      Save.save();
      return Engine.go('bar');
    }
    const scene = BarScenes.find(s => s.id === sceneId);
    if (!scene) return;
    const choice = scene.choices[choiceIndex];
    if (!choice) return;
    if (!scene.repeatable && !State.player.barHistory.includes(sceneId)) State.player.barHistory.push(sceneId);
    State.player.barVisitsToday = (State.player.barVisitsToday || 0) + 1;
    let logText = choice.log || 'Ты уходишь.';
    if (choice.action === 'reward_money') Economy.earn(choice.value, 'Сделка в баре');
    else if (choice.action === 'get_info') {
      Economy.changeHeat(-5, 'Информация о облаве');
      Economy.addXp(10);
      logText = choice.log;
    }
    else if (choice.action === 'steal_money') {
      if (Utils.chance(choice.risk || 0.5)) { Economy.earn(choice.value, 'Кража у копа'); logText = choice.log_success; }
      else { Economy.changeHeat(15, 'Кража у копа'); State.player.sanity.stress = Utils.clamp(State.player.sanity.stress + 20, 0, 100); logText = choice.log_fail; }
    } else if (choice.action === 'buy_rumor') {
      Economy.spend(choice.value, 'Покупка слуха');
      if (State.quests && State.quests.available) {
        // #61: одна зона для id и name
        const rumorZone = Utils.pick(State.zones);
        State.quests.available.push({ id: 'q_rumor_' + Utils.uid(), type: 'social', title: 'Слух из бара', desc: 'Информация, которую ты купил.', zoneId: rumorZone.id, zoneName: rumorZone.name, giverName: 'Женщина в красном', duration: 2, risk: 0.2, reward: { money: 400, xp: 50, rep: 5 }, daily: false, createdDay: State.time.day });
      }
    } else if (choice.action === 'heal_sanity') { Economy.spend(choice.value, 'Ночь с женщиной'); Sanity.onSex(); if (!State.flags) State.flags = {}; State.flags.showSexScene = true; }
    else if (choice.action === 'heal_hp') {
      if (!State.player || !State.player.body) return;
      if (!State.player.inventory) State.player.inventory = {};
      const cost = choice.value || 0;
      const heal = choice.healAmount || 25;
      if ((State.player.money || 0) < cost) { Engine.log('Не хватает денег на лечение.', 'warn'); return; }
      if (!Economy.spend(cost, 'Лечение у Доктора Сэма')) return;
      // Лечим самую раненую часть тела
      const parts = Object.keys(State.player.body).filter(k => {
        const bp = State.player.body[k];
        return bp && typeof bp.hp === 'number' && typeof bp.max === 'number' && bp.hp < bp.max;
      });
      if (parts.length === 0) {
        Engine.log('Раны уже зажили. Сэм пожимает плечами.', 'info');
        return;
      }
      parts.sort((a, b) => (State.player.body[a].hp / State.player.body[a].max) - (State.player.body[b].hp / State.player.body[b].max));
      const part = parts[0];
      const before = State.player.body[part].hp;
      State.player.body[part].hp = Math.min(State.player.body[part].max, before + heal);
      const healed = State.player.body[part].hp - before;
      Engine.log('Доктор Сэм обработал рану. ' + part + ' +' + healed + ' HP (было ' + before + ', стало ' + State.player.body[part].hp + ').', 'good');
      logText = choice.log || 'Он раскладывает инструменты. Больно. Но помогает.';
    }
    else if (choice.action === 'random_loot') {
      if (Utils.chance(0.6)) { Economy.earn(200, 'Лут'); State.weapons.owned.push('pistol_glock'); logText = choice.log_success; }
      else { State.player.body.torso.hp = Math.max(1, State.player.body.torso.hp - 40); State.player.conditions.head.concussion = true; logText = choice.log_fail; }
    } else if (choice.action === 'earn_rep') Economy.changeRep(3, 'Уважение');
    else if (choice.action === 'zone_capture') {
      const z = Utils.pick(State.zones);
      if (z.ownerId === null) { z.ownerId = 'player'; Economy.changeRep(5, 'Интрига'); logText = 'Ты захватываешь ' + z.name + '.'; }
      else Economy.earn(100, 'Подарок');
    } else if (choice.action === 'fight') {
      State.player.body.head.hp = Math.max(1, State.player.body.head.hp - 20);
      State.player.body.torso.hp = Math.max(1, State.player.body.torso.hp - 20);
      Economy.changeHeat(5, 'Драка');
    } else if (choice.action === 'reduce_heat') { Economy.spend(choice.value, 'Взятка'); Economy.changeHeat(-20, 'Тишина'); }
    else if (choice.action === 'rich_scam') {
      if (Utils.chance(0.6)) Economy.earn(300, 'Развод');
      else { Economy.changeHeat(10, 'Проблемы'); State.player.body.torso.hp = Math.max(1, State.player.body.torso.hp - 20); logText = choice.log_fail; }
    } else if (choice.action === 'buy_weapon') { if (!Economy.spend(choice.value, 'Оружие')) return; State.weapons.owned.push('pistol_tt'); logText = choice.log; }
    else if (choice.action === 'sell_info') { Economy.earn(200, 'Слух'); Economy.changeHeat(5, 'Стукачество'); }
    else if (choice.action === 'heal_stress') State.player.sanity.stress = Math.max(0, State.player.sanity.stress - 40);
    else if (choice.action === 'bribe_cop') {
      if (choice.requires && choice.requires.money && State.player.money < choice.requires.money) { Engine.log('Не хватает денег.', 'warn'); return; }
      Economy.spend(choice.value, 'Взятка копу');
      Economy.changeHeat(-15, 'Коп ушёл');
    } else if (choice.action === 'talk_cop') {
      if (State.player.reputation > 10) {
        Economy.changeHeat(-5, 'Договорились');
        logText = choice.log_success;
      } else {
        Economy.changeHeat(10, 'Коп заинтересовался');
        logText = choice.log_fail;
      }
    } else if (choice.action === 'hide_cops') {
      if (Utils.chance(0.5)) {
        Economy.changeHeat(-10, 'Скрылся');
        logText = choice.log_success;
      } else {
        Economy.changeHeat(20, 'Замечен');
        logText = choice.log_fail;
        // #60: affiliation police, не перезаписываем имя
        const enemy = Combat.spawnEnemy(State.player.level + 1, { affiliation: 'police' });
        Time.spend(1);
        if (!State.player || !State.city) return; // #57
        Combat.start(enemy, { type: 'ambush', returnScreen: 'bar' });
        return;
      }
    } else if (choice.action === 'bribe_raid') {
      if (choice.requires && choice.requires.money && State.player.money < choice.requires.money) { Engine.log('Не хватает денег.', 'warn'); return; }
      Economy.spend(choice.value, 'Взятка при облаве');
      Economy.changeHeat(-20, 'Копы ушли');
    } else if (choice.action === 'fight_cops') {
      Economy.changeHeat(50, 'Перестрелка с копами');
      logText = 'Ты стреляешь в их сторону. Это привлекает всё внимание города.';
    }

    Time.spend(1);
    if (!State.player || !State.city) return; // #57
    Engine.log(logText, 'good');
    Save.save();
    Engine.go('bar');
  }
};
