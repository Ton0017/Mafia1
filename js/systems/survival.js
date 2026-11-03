const Survival = {
  // Голод: −70 за 24 часа (примерно −3/час), 3 дня = смерть
  HUNGER_PER_HOUR: 2,
  THIRST_PER_HOUR: 3,
  ENERGY_PER_HOUR: 2,

  tick() {
    if (!State.player) return;
    const s = State.player.survival;
    if (!s) return;
    // #27: в тюрьме кормят, голод/жажда не падают
    if (State.player.flags && State.player.flags.inJail) return;

    if (!State.player.body || !State.player.body.torso) return;
    s.hunger = Math.max(0, s.hunger - this.HUNGER_PER_HOUR);
    s.thirst = Math.max(0, s.thirst - this.THIRST_PER_HOUR);
    s.energy = Math.max(0, s.energy - this.ENERGY_PER_HOUR);

    // Голод = 0: урон
    if (s.hunger <= 0) {
      State.player.body.torso.hp = Math.max(0, State.player.body.torso.hp - 1);
      if (Utils.chance(0.1)) Engine.log(Utils.pick(Lore.noir.hunger), 'bad');
    }
    // Жажда = 0: сильнее
    if (s.thirst <= 0) {
      State.player.body.torso.hp = Math.max(0, State.player.body.torso.hp - 2);
      if (Utils.chance(0.15)) Engine.log(Utils.pick(Lore.noir.thirst), 'bad');
    }
    // Энергия = 0: не убивает, но дебафф
    if (s.energy <= 0 && Utils.chance(0.05)) {
      Engine.log(Utils.pick(Lore.noir.exhaustion), 'warn');
    }

    // #34: смерть при ЛЮБОЙ критической части
    if (State.player.body.torso.hp <= 0 || State.player.body.head.hp <= 0) {
      Engine.log('Истощение доконало тебя.', 'bad');
      if (typeof DeathSystem !== 'undefined') DeathSystem.fullRestart();
      return;
    }
  },

  // Дебаффы для боя
  getCombatPenalties() {
    const pen = { accuracy: 0, agility: 0, log: [] };
    if (!State.player || !State.player.survival) return pen;
    const s = State.player.survival;

    if (s.hunger < 30) {
      pen.accuracy -= 0.10;
      pen.log.push('Голод ослабляет руку.');
    }
    if (s.hunger < 10) {
      pen.accuracy -= 0.10;
      pen.agility -= 3;
    }
    if (s.thirst < 30) {
      pen.accuracy -= 0.05;
    }
    if (s.thirst < 10) {
      pen.accuracy -= 0.10;
      pen.agility -= 3;
    }
    if (s.energy < 20) {
      pen.accuracy -= 0.15;
      pen.agility -= 4;
      pen.log.push('Ты валишься с ног.');
    }
    return pen;
  },

  // Действия
  eat(foodId = 'food') {
    if (!State.player || !State.player.inventory) return false;
    const inv = State.player.inventory;
    if (foodId === 'food') {
      if (!inv.food || inv.food <= 0) { Engine.log('Нечего есть.', 'warn'); return false; }
      // Проверяем возможность траты времени ДО списания еды
      if (!Time.canSpend(0.5)) { Engine.log('Слишком поздно. Иди спать.', 'warn'); return false; }
      inv.food--;
      State.player.survival.hunger = Math.min(100, State.player.survival.hunger + 25);
      State.player.survival.lastMealDay = State.time.day;
      Engine.log(Utils.pick(Lore.noir.actions.eat), 'good');
      Time.spend(0.5);
      Save.save();
      Engine.render();
      return true;
    }
    return false;
  },

  drink(whatId = 'water') {
    if (!State.player || !State.player.inventory) return false;
    const inv = State.player.inventory;
    if (whatId === 'water') {
      if (!inv.water || inv.water <= 0) { Engine.log('Нечего пить.', 'warn'); return false; }
      // Проверяем возможность траты времени ДО списания воды
      if (!Time.canSpend(0.25)) { Engine.log('Слишком поздно. Иди спать.', 'warn'); return false; }
      inv.water--;
      State.player.survival.thirst = Math.min(100, State.player.survival.thirst + 30);
      State.player.survival.lastDrinkDay = State.time.day;
      Engine.log(Utils.pick(Lore.noir.actions.drink), 'good');
      Time.spend(0.25);
      Save.save();
      Engine.render();
      return true;
    }
    if (whatId === 'alcohol') {
      return Drugs.use('alcohol');
    }
    return false;
  },

  // Закупка еды/воды в баре/магазине
  buyFood(quantity = 1) {
    if (!State.player || !State.player.inventory) return false;
    const price = 80 * quantity;
    if (!Time.canSpend(0.25)) { Engine.log('Слишком поздно. Иди спать.', 'warn'); return false; }
    if (!Economy.spend(price, 'Еда ×' + quantity)) return false;
    State.player.inventory.food += quantity;
    Engine.log(Utils.pick(Lore.noir.actions.buyFood), 'good');
    Time.spend(0.25);
    Save.save();
    Engine.render();
    return true;
  },

  buyWater(quantity = 1) {
    if (!State.player || !State.player.inventory) return false;
    const price = 30 * quantity;
    if (!Time.canSpend(0.25)) { Engine.log('Слишком поздно. Иди спать.', 'warn'); return false; }
    if (!Economy.spend(price, 'Вода ×' + quantity)) return false;
    State.player.inventory.water += quantity;
    Engine.log(Utils.pick(Lore.noir.actions.buyWater), 'good');
    Time.spend(0.25);
    Save.save();
    Engine.render();
    return true;
  },

  // Сон (расширенный)
  sleepRecover(hours) {
    if (!State.player || !State.player.survival) return;
    const s = State.player.survival;
    s.energy = Math.min(100, s.energy + hours * 12);
    // За ночь голод/жажда тоже падают (уже в tick)
  },
};
