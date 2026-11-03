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
    Engine.log('— АРЕСТ —', 'bad');
    Engine.log('Наручники щёлкают. Тебя ведут в участок. Всё, что было — конфисковано.', 'bad');

    // #27: ставим флаг "в тюрьме", чтобы голод/жажда/раны не убили
    if (!State.player.flags) State.player.flags = {};
    State.player.flags.inJail = true;

    // Восстанавливаем только стартовые вещи
    const starterId = Weapons.starter(State.player.side);
    State.player.money = 500;
    if (!State.weapons) State.weapons = { owned: [], durability: {}, forSale: [] };
    State.weapons.owned = [starterId];
    State.player.currentWeaponId = starterId;
    if (!State.weapons.durability) State.weapons.durability = {};
    State.weapons.durability[starterId] = 100;
    State.player.heat = 0;
    if (!State.player.inventory) State.player.inventory = {};
    State.player.inventory.ammo = {};
    State.player.inventory.ammo.ammo_pistol = 60;

    // Тело восстанавливается (тюрьма — это больница)
    if (State.player.body) {
      for (const part of Object.keys(State.player.body)) {
        const bp = State.player.body[part];
        if (bp && typeof bp.max === 'number') bp.hp = bp.max;
      }
    }
    State.player.conditions = (typeof defaultConditions === 'function') ? defaultConditions() : {};
    State.player.diseases = [];

    // Проходит 3 дня — с флагом inJail голод/жажда не убьют
    Engine.log('Ты проводишь в камере три дня. Ничего не происходит. Только стены.', 'lore');
    Time.advance(72); // 3 дня = 72 часа

    if (!State.player || !State.city) return;
    State.player.flags.inJail = false;
    Engine.log('Ты выходишь. На улице всё та же грязь. Но у тебя чистый лист.', 'lore');
    Save.save();
    Engine.go('city');
  }
};
