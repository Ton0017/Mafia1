// ═══ СИСТЕМА СОБЫТИЙ С КОПАМИ ═══
const CopSystem = {
  // Проверка раз в день (вызывается из Time.onNewDay)
  roll() {
    if (!State.player || !State.city) return;
    if (State.player.lastCopEventDay === State.time.day) return; // уже было сегодня
    if ((State.player.heat || 0) < 30) return;
    if (State.combat && State.combat.active) return;

    // Шанс зависит от Heat и характера мэра
    let chance = Math.min(0.75, (State.player.heat || 0) / 150);
    if (typeof Politics !== 'undefined') {
      chance = Math.min(0.9, chance * Politics.getHeatModifier());
    }
    if (!Utils.chance(chance)) return;

    // Выбираем подходящее событие
    const h = State.time.hour;
    if (typeof CopEvents === 'undefined') return;
    const available = CopEvents.filter(e => {
      if (!e.requires) return true;
      if (e.requires.minHeat && State.player.heat < e.requires.minHeat) return false;
      if (e.requires.minHour && h < e.requires.minHour) return false;
      if (e.requires.maxHour && h > e.requires.maxHour) return false;
      return true;
    });

    if (available.length === 0) return;

    const event = Utils.pick(available);
    State.player.lastCopEventDay = State.time.day;
    Engine.go('copEvent', { eventId: event.id });
  },

  // Обработка действия
  resolve(eventId, actionId) {
    const event = CopEvents.find(e => e.id === eventId);
    if (!event) return Engine.go('city');

    const action = event.actions.find(a => a.id === actionId);
    if (!action) return Engine.go('city');

    if (action.type === 'bribe') this.bribe(event, action);
    else if (action.type === 'fight') this.fight(event, action);
    else if (action.type === 'flee') this.flee(event, action);
    else if (action.type === 'surrender') this.surrender();
  },

  // Взятка
  bribe(event, action) {
    let price = 500 + (State.player.heat * 20) + (State.player.level * 100);
    if (action.priceMod) price = Math.round(price * action.priceMod);

    if (typeof State.player.money !== 'number' || State.player.money < price) {
      Engine.log('У тебя нет $' + price + ' на взятку. Копы недовольны.', 'bad');
      // Автоматически — сдаться или драться, выбираем драку
      this.fight(event, { enemyCount: 2 });
      return;
    }

    Economy.spend(price, 'Взятка копам');
    Economy.changeHeat(-30, 'Копы ушли');
    Engine.log('Конверт исчезает в кармане. Они уходят. Пока.', 'good');
    Save.save();
    Engine.go('city');
  },

  // Бой
  fight(event, action) {
    const count = action.enemyCount || 2;
    const enemies = [];
    for (let i = 0; i < count; i++) {
      const level = (State.player.level || 1) + 2;
      // #26: НЕ перезаписываем имя и оружие — используем уникальные
      const enemy = Combat.spawnEnemy(level, { affiliation: 'police' });
      enemy.loot.money += Utils.rnd(100, 200);
      enemy.armor = 15; // копы в бронежилетах
      enemies.push(enemy);
    }

    // Берём первого как основного (Combat не поддерживает мульти-врагов)
    const mainEnemy = enemies[0];
    mainEnemy.loot.money = enemies.reduce((s, e) => s + e.loot.money, 0);

    Economy.changeHeat(action.extraHeat || 30, 'Стрельба по копам');
    Time.spend(1, 'Ты вступаешь в перестрелку с копами.');
    if (!State.player || !State.city) return;

    Combat.start(mainEnemy, { type: 'cop', returnScreen: 'city' });
  },

  // Побег
  flee(event, action) {
    const chance = action.fleeChance || 0.4;
    if (Utils.chance(chance)) {
      Engine.log('Ты растворяешься в переулках. Они теряют тебя.', 'good');
      Economy.changeHeat(-10, 'Ушёл от копов');
      Save.save();
      Engine.go('city');
    } else {
      Engine.log('Они замечают тебя. Бой неизбежен.', 'bad');
      this.fight(event, { enemyCount: 2 });
    }
  },

  // Арест
  surrender() {
    if (typeof JailSystem === 'undefined') {
      Engine.log('Тюрьма недоступна.', 'warn');
      return;
    }

    const heat = State.player.heat || 0;
    let days = 3;
    if (heat >= 90) days = 5;
    else if (heat >= 80) days = 4;
    if (State.flags && State.flags.killedCop) {
      days += 7;
      delete State.flags.killedCop;
    }

    JailSystem.start(days);
  }
};
