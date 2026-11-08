// ═══ СИСТЕМА ТЮРЬМЫ ═══
// Срок как путешествие по сценам. Пока не пройдёшь все — не выйдешь.

const JailSystem = {
  start(days) {
    if (!State.player) return;
    days = Math.max(3, Math.min(14, Math.round(days || 3)));

    if (!State.player.flags) State.player.flags = {};
    State.player.flags.inJail = true;

    // Конфискация
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

    // Тело восстанавливается
    if (State.player.body) {
      for (const part of Object.keys(State.player.body)) {
        const bp = State.player.body[part];
        if (bp && typeof bp.max === 'number') bp.hp = bp.max;
      }
    }
    State.player.conditions = (typeof defaultConditions === 'function') ? defaultConditions() : {};
    State.player.diseases = [];

    const scenes = (typeof JailScenes !== 'undefined') ? JailScenes.generate(days) : [];

    if (!scenes || scenes.length === 0) {
      Engine.log('Тюрьма закрыта на ремонт. Тебя выпускают.', 'warn');
      State.player.flags.inJail = false;
      Time.advance(days * 24);
      if (!State.player || !State.city) return;
      Save.save();
      Engine.go('city');
      return;
    }

    State.jail = {
      days: days,
      scenes: scenes,
      index: 0,
      choices: []
    };

    Engine.log('— АРЕСТ —', 'bad');
    Engine.log('Наручники щёлкают. Тебя ведут в участок. Всё, что было — конфисковано.', 'bad');
    Engine.log('Срок: ' + days + ' ' + (days === 1 ? 'день' : days < 5 ? 'дня' : 'дней') + '.', 'warn');

    Save.save();
    Engine.go('jail');
  },

  _sceneParts(scene) {
    if (!scene) return { text: '', choices: null, name: null };
    const d = scene.data;
    if (typeof d === 'string') return { text: d, choices: null, name: scene.name || null };
    return { text: d.text || '', choices: d.choices || null, name: scene.name || null };
  },

  next() {
    if (!State.jail) return Engine.go('city');
    State.jail.index++;
    if (State.jail.index >= State.jail.scenes.length) {
      this.finish();
      return;
    }
    Save.save();
    Engine.render();
  },

  choose(choiceIdx) {
    if (!State.jail) return;
    const scene = State.jail.scenes[State.jail.index];
    const parts = this._sceneParts(scene);
    if (!parts.choices) return;
    const choice = parts.choices[choiceIdx];
    if (!choice) return;

    Engine.log(choice.log, 'lore');

    if (choice.effect === 'sellout') Economy.changeRep(-2, 'Сдал кого-то');
    else if (choice.effect === 'trust') Economy.changeRep(1, 'Свой среди своих');
    else if (choice.effect === 'intel') {
      if (!State.flags) State.flags = {};
      State.flags.jailIntel = (State.flags.jailIntel || 0) + 1;
    }

    State.jail.choices.push({ type: scene.type, effect: choice.effect });
    this.next();
  },

  finish() {
    if (!State.player || !State.jail) return;
    const days = State.jail.days;

    // Сбрасываем тюрьму ДО течения времени
    State.jail = null;
    State.player.flags.inJail = false;

    Time.advance(days * 24);

    // Если игрок умер от истощения во время срока, экран смерти уже вызван.
    // Останавливаемся, чтобы не перезаписать его экраном города.
    if (!State.player || !State.city || State.deathRecord) {
      return;
    }

    Economy.changeRep(-5, 'Сидел. Город помнит.');

    // 30% потеря зоны при 5+ днях
    if (days >= 5 && Utils.chance(0.3)) {
      const playerZones = (State.zones || []).filter(z => z.ownerId === 'player');
      if (playerZones.length > 0) {
        const lost = Utils.pick(playerZones);
        lost.ownerId = null;
        lost.guards = 1;
        Engine.log('Пока ты сидел, ' + lost.name + ' отошла. Не к кому-то. Просто отошла.', 'bad');
      }
    }

    Engine.log('Ты выходишь. На улице всё та же грязь. Но у тебя чистый лист. Пока.', 'lore');
    Save.save();
    Engine.go('city');
  },

  current() {
    if (!State.jail) return null;
    const scene = State.jail.scenes[State.jail.index];
    return scene ? this._sceneParts(scene) : null;
  }
};
