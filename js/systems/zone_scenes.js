const ZoneSystem = {
  getRandomScene(zoneId) {
    if (!State.player.zoneHistory) State.player.zoneHistory = [];
    const p = State.player;

    if ((p.zoneVisitsToday || 0) >= 2) {
      return { 
        id: 'limit_reached', 
        title: 'Пустая улица', 
        desc: 'Ты уже дважды обшарил этот район сегодня. Здесь больше нечего ловить. Только дождь и пустые окна.', 
        choices: [ { text: 'Уйти', action: 'none', log: 'Ты возвращаешься на центральную улицу.' } ] 
      };
    }

    // 30% шанс встретить мирного жителя
    if (Utils.chance(0.30) && zoneId && typeof CiviliansSystem !== 'undefined') {
      const civScene = CiviliansSystem.createScene(zoneId);
      if (civScene) {
        State.player.currentCivilian = civScene;
        return civScene;
      }
    }

    // 🚨 25% шанс случайного нападения
    if (Utils.chance(0.25)) {
      return { 
        id: 'ambush', 
        title: 'Засада!', 
        desc: 'Ты слышишь шаги за спиной. Слишком поздно. Из тени выходят двое. У одного в руках бита, у другого — пушка. Разговор не предполагается.', 
        choices: [ 
          { text: 'Приготовить оружие', action: 'start_ambush', log: 'Ты выхватываешь ствол. Время замедляется.' },
          { text: 'Попытаться убежать', action: 'try_flee_ambush', log: 'Ты бросаешься в переулок, но они бегут за тобой.' }
        ] 
      };
    }

    let available = ZoneScenes.filter(s => !p.zoneHistory.includes(s.id));

    if (available.length === 0) {
      return { 
        id: 'empty_zone', 
        title: 'Тишина', 
        desc: 'Ты обходишь квартал, но всё тихо. Слишком тихо. Обычно это значит, что кто-то готовит большую облаву.', 
        choices: [ { text: 'Уйти', action: 'none', log: 'Ты растворяешься в тумане.' } ] 
      };
    }
    return Utils.pick(available);
  },

  resolve(sceneId, choiceIndex) {
    if (sceneId === 'limit_reached' || sceneId === 'empty_zone') {
      return Engine.go('zones');
    }

    // Обработка мирного жителя
    if (sceneId === 'civilian_encounter') {
      State.player.zoneVisitsToday = (State.player.zoneVisitsToday || 0) + 1;
      const scene = State.player.currentCivilian;
      if (scene && typeof CiviliansSystem !== 'undefined') {
        CiviliansSystem.resolveByIndex(scene, choiceIndex);
      } else {
        Engine.go('zones');
      }
      return;
    }

    // Обработка засады
    if (sceneId === 'ambush') {
      State.player.zoneVisitsToday = (State.player.zoneVisitsToday || 0) + 1;
      if (choiceIndex === 0) {
        // Принять бой
        const enemyLevel = State.player.level + 1;
        const enemy = Combat.spawnEnemy(enemyLevel, { affiliation: 'independent' });
        enemy.role = 'Уличный грабитель';
        enemy.loot.money = Utils.rnd(150, 300);
        Time.spend(1, 'Ты вступаешь в перестрелку.');
        if (State.player && State.city) {
          Combat.start(enemy, { type: 'ambush', returnScreen: 'zones' });
        }
        return;
      } else {
        // Попытка убежать (шанс 50%)
        if (Utils.chance(0.5)) {
          Engine.log('Ты успеваешь скрыться в тумане. Они теряют тебя.', 'good');
          Engine.go('zones');
        } else {
          Engine.log('Они догоняют. Бой неизбежен.', 'bad');
          const enemyLevel = State.player.level + 1;
          const enemy = Combat.spawnEnemy(enemyLevel, { affiliation: 'independent' });
          enemy.role = 'Уличный грабитель';
          Combat.start(enemy, { type: 'ambush', returnScreen: 'zones' });
        }
        return;
      }
    }

    const scene = ZoneScenes.find(s => s.id === sceneId);
    if (!scene) return;
    const choice = scene.choices[choiceIndex];
    if (!choice) return;

    if (!State.player.zoneHistory.includes(sceneId)) State.player.zoneHistory.push(sceneId);
    State.player.zoneVisitsToday = (State.player.zoneVisitsToday || 0) + 1;

    let logText = choice.log || 'Ты уходишь.';
    
    if (choice.action === 'random_loot') {
      if (Utils.chance(0.7)) {
        Economy.earn(120, 'Находка в тайнике');
        State.player.inventory.ammo.ammo_pistol = (State.player.inventory.ammo.ammo_pistol || 0) + 10;
        logText = choice.log_success;
      } else {
        State.player.body.torso.hp = Math.max(1, State.player.body.torso.hp - 20);
        logText = choice.log_fail;
      }
    } else if (choice.action === 'steal_corpse') {
      if (Utils.chance(0.8)) {
        Economy.earn(250, 'Часы с трупа');
        Economy.changeHeat(5, 'Ограбление мертвеца');
        logText = choice.log_success;
      } else {
        Economy.changeHeat(15, 'Копы');
        logText = choice.log_fail;
      }
    } else if (choice.action === 'earn_rep') {
      Economy.changeRep(4, 'Сотрудничество');
    } else if (choice.action === 'fight_tail') {
      if (Utils.chance(0.6)) {
        Economy.earn(100, 'Информация хвоста');
        Economy.changeHeat(-10, 'Сброс хвоста');
        logText = choice.log_success;
      } else {
        State.player.body.torso.hp = Math.max(1, State.player.body.torso.hp - 35);
        logText = choice.log_fail;
      }
    } else if (choice.action === 'reduce_heat') {
      Economy.changeHeat(-15, 'Ушёл от слежки');
    } else if (choice.action === 'buy_medkit') {
      if (!Economy.spend(choice.value, 'Покупка у дилера')) { Engine.log('Не хватает денег.', 'warn'); return; }
      State.player.inventory.medicine.bandages = (State.player.inventory.medicine.bandages || 0) + 2;
      State.player.inventory.medicine.painkillers = (State.player.inventory.medicine.painkillers || 0) + 1;
    } else if (choice.action === 'rob_dealer') {
      if (Utils.chance(0.5)) {
        Economy.earn(150, 'Ограбление дилера');
        State.player.inventory.drugs.cocaine = (State.player.inventory.drugs.cocaine || 0) + 1;
        logText = choice.log_success;
      } else {
        State.player.body.torso.hp = Math.max(1, State.player.body.torso.hp - 40);
        logText = choice.log_fail;
      }
    } else if (choice.action === 'give_money') {
      if (!Economy.spend(choice.value, 'Подаяние')) { Engine.log('Не хватает денег.', 'warn'); return; }
      Economy.changeRep(2, 'Доброе дело');
    } else if (choice.action === 'bribe_cop') {
      if (choice.requires && choice.requires.money && State.player.money < choice.requires.money) { Engine.log('Не хватает денег на взятку.', 'warn'); return; }
      if (!Economy.spend(choice.value, 'Взятка копам')) { Engine.log('Не хватает денег на взятку.', 'warn'); return; }
      Economy.changeHeat(-10, 'Копы довольны');
    } else if (choice.action === 'show_rep') {
      if (State.player.reputation > 20) {
        Economy.changeHeat(-5, 'Уважают');
        logText = choice.log_success;
      } else {
        Economy.changeHeat(15, 'Копы достают');
        logText = choice.log_fail;
        State.player.body.torso.hp = Math.max(1, State.player.body.torso.hp - 10);
      }
    } else if (choice.action === 'fight_cop') {
      const enemy = Combat.spawnEnemy(State.player.level + 2, { affiliation: 'independent' });
      enemy.role = 'Полицейский';
      enemy.loot.money = Utils.rnd(100, 200);
      enemy.loot.weaponId = 'pistol_m1911';
      Economy.changeHeat(30, 'Нападение на копа');
      Time.spend(1, 'Ты нападаешь на копа.');
      if (State.player && State.city) Combat.start(enemy, { type: 'ambush', returnScreen: 'zones' });
      return;
    } else if (choice.action === 'hide_cops') {
      if (Utils.chance(0.6)) {
        Economy.changeHeat(-15, 'Ты скрылся');
        logText = choice.log_success;
      } else {
        Economy.changeHeat(20, 'Тебя заметили');
        logText = choice.log_fail;
        const enemy = Combat.spawnEnemy(State.player.level + 1, { affiliation: 'independent' });
        enemy.role = 'Полицейский';
        Time.spend(1, 'Тебя заметили.');
        if (State.player && State.city) Combat.start(enemy, { type: 'ambush', returnScreen: 'zones' });
        return;
      }
    } else if (choice.action === 'help_cops') {
      Economy.earn(300, 'Помощь полиции');
      Economy.changeRep(-8, 'Ты стукач');
      Economy.changeHeat(-20, 'Копы довольны');
    } else if (choice.action === 'fight_cops') {
      Economy.changeHeat(50, 'Стрельба по копам');
      logText = 'Ты стреляешь в воздух и бежишь. Город запомнит это.';
    } else if (choice.action === 'help_civilian') {
      if (Utils.chance(0.5)) {
        Economy.changeRep(5, 'Доброе дело');
        logText = choice.log_success;
      } else {
        State.player.body.torso.hp = Math.max(1, State.player.body.torso.hp - 25);
        logText = choice.log_fail;
      }
    } else if (choice.action === 'rob_drunk_cops') {
      if (Utils.chance(0.6)) {
        Economy.earn(400, 'Ограбление копов');
        Economy.changeHeat(25, 'Копы в ярости');
        State.weapons.owned.push('pistol_m1911');
        logText = choice.log_success;
      } else {
        Economy.changeHeat(35, 'Нападение на копа');
        State.player.body.torso.hp = Math.max(1, State.player.body.torso.hp - 30);
        logText = choice.log_fail;
      }
    }

    Time.spend(1);
    if (!State.player || !State.city) return;
    Engine.log(logText, 'good');
    Save.save();
    Engine.go('zones');
  }
};
