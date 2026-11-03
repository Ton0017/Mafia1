const WorldGen = {
  generate(playerName, side, gangName, chosenPortrait) {
    State.player.name = playerName;
    State.player.portrait = chosenPortrait || Sprites.randomAny();
    State.player.side = side;
    State.player.gangName = gangName;
    State.seed = Math.floor(Math.random() * 1e9);

    this._city();
    this._zones();
    this._factions();
    this._npcs();
    this._powerBalance();
    this._economy();
    this._playerStory();
    // Генерация предпочтений
    const cigs = ['camel', 'marlboro', 'lucky'];
    const alcs = ['whiskey', 'vodka', 'rum'];
    const favCig = Utils.pick(cigs);
    const favAlc = Utils.pick(alcs);
    
    State.player.preferences = {
      cig: favCig,
      cigHate: Utils.pick(cigs.filter(c => c !== favCig)),
      alc: favAlc,
      alcHate: Utils.pick(alcs.filter(a => a !== favAlc))
    };

    this._startingWeapons();
    this._startingQuests();
    // Бонусы prestige убраны — каждая жизнь с нуля

    if (typeof Politics !== 'undefined' && Politics.generateMayor) State.mayor = Politics.generateMayor();
    Save.save();
    Engine.log('Мир сгенерирован. Добро пожаловать в ' + State.city.name + '.', 'lore');
    Engine.log('Погода: ' + State.city.weather + '. ' + State.city.motto, 'lore');
  },

  // Хелпер: случайное имя с учётом пола (30% женщины)
  _randomName() {
    if (Utils.chance(0.3)) {
      return Utils.pick(Lore.femaleNames) + ' ' + Utils.pick(Lore.lastNames);
    }
    return Utils.pick(Lore.firstNames) + ' ' + Utils.pick(Lore.lastNames);
  },

  _city() {
    State.city = {
      name: Utils.pick(Lore.cityNames),
      weather: Utils.pick(Lore.weathers),
      motto: Utils.pick(Lore.mottos),
      news: []
    };
  },

  _zones() {
    const zones = [];
    for (let i = 0; i < 30; i++) {
      const t = Utils.pick(Lore.zoneTypes);
      const prefix = Utils.pick(Lore.zoneNamePrefixes);
      const suffix = Utils.pick(Lore.zoneNameSuffixes);
      const incomeMod = Utils.rnd(80, 120) / 100;
      zones.push({
        id: 'zone_' + i,
        name: prefix + ' ' + suffix,
        type: t.id,
        typeName: t.name,
        baseIncome: Math.round(t.baseIncome * incomeMod),
        income: Math.round(t.baseIncome * incomeMod),
        influence: t.influence,
        difficulty: t.difficulty,
        resource: Utils.pick(t.resources),
        ownerId: null,
        guards: 0,
        businesses: [],
      });
    }
    State.zones = zones;
  },

  _factions() {
    const count = Utils.rnd(5, 7);
    const usedRoots = [];
    const factions = [];
    for (let i = 0; i < count; i++) {
      let root;
      do { root = Utils.pick(Lore.factionRoots); } while (usedRoots.includes(root));
      usedRoots.push(root);
      const nameTemplate = Utils.pick(Lore.factionNameTemplates);
      const name = nameTemplate.replace('{0}', root);
      const leaderName = this._randomName();
      // Проверяем, женское ли имя (есть ли оно в femaleNames)
      const isFemaleLeader = Lore.femaleNames.some(fn => leaderName.startsWith(fn));
      const leader = {
        id: 'npc_leader_' + i,
        name: leaderName,
        role: isFemaleLeader ? 'Мадам «' + name + '»' : 'Дон «' + name + '»',
        factionId: 'fac_' + i,
        alive: true,
      };
      factions.push({
        id: 'fac_' + i,
        name: name,
        leaderId: leader.id,
        trait: Utils.pick(Lore.factionTraits),
        power: Utils.rnd(3, 8),
        relations: {},
        zones: 0,
        enemyId: null,
        mood: null,
        moodUntil: 0,
        influence: Utils.rnd(10, 30),
        allyWithPlayer: false,
        tradeDay: 0,
        threatDay: 0,
        jobDay: 0,
        mysteryDay: 0,
      });
      State.npcs.push(leader);
    }
    // Отношения
    for (const a of factions) {
      for (const b of factions) {
        if (a.id === b.id) continue;
        a.relations[b.id] = Utils.rnd(-30, 30);
      }
    }
    // Одна враждебная пара для остроты
    if (factions.length >= 2) {
      const a = factions[0], b = factions[1];
      a.relations[b.id] = -70;
      b.relations[a.id] = -70;
    }

    // 🚔 ДОБАВЛЯЕМ ПОЛИЦИЮ КАК ФРАКЦИЮ
    const policeFaction = {
      id: 'fac_police',
      name: 'Полицейский департамент',
      leaderId: 'npc_police_chief',
      trait: 'продажный',
      power: 8, // Полиция всегда сильна
      relations: {},
      zones: 0, // У полиции нет зон (они везде)
      enemyId: null,
        mood: null,
        moodUntil: 0,
        influence: Utils.rnd(10, 30),
      allyWithPlayer: false,
      tradeDay: 0, threatDay: 0, jobDay: 0, mysteryDay: 0,
      isPolice: true, // Специальный флаг
      influence: 50
    };
    
    // Лидер полиции
    const chief = {
      id: 'npc_police_chief',
      name: 'Комиссар ' + Utils.pick(Lore.lastNames),
      role: 'Начальник полиции',
      factionId: 'fac_police',
      alive: true
    };
    State.npcs.push(chief);

    // Полиция имеет нейтральные отношения со всеми бандами
    for (const f of factions) {
      policeFaction.relations[f.id] = -10;
      f.relations[policeFaction.id] = -10;
    }
    
    factions.push(policeFaction);
    State.factions = factions;
  },

  _npcs() {
    const extraRoles = [
      'Информатор', 'Торговец оружием', 'Врач без лицензии', 'Адвокат',
      'Бармен', 'Шестёрка', 'Скупщик краденого', 'Владелец казино',
      'Полицейский сержант', 'Журналист', 'Ростовщик', 'Старый друг',
      'Мадам борделя', 'Певица в баре', 'Вдова авторитета', 'Жена мэра', 'Гадалка'
    ];
    const shuffled = Utils.shuffle(extraRoles).slice(0, 10);
    for (const role of shuffled) {
      State.npcs.push({
        id: 'npc_' + Utils.uid(),
        name: this._randomName(),
        role: role,
        factionId: null,
        alive: true,
      });
    }
  },

  _powerBalance() {
    // Распределяем зоны по фракциям, но не даём одной >40%
    const maxPerFaction = Math.floor(30 * 0.4);
    const factionCounts = {};
    State.factions.forEach(f => factionCounts[f.id] = 0);

    for (const zone of State.zones) {
      // 30% шанс нейтрал
      if (Utils.chance(0.3)) { zone.ownerId = null; continue; }
      const available = State.factions.filter(f => factionCounts[f.id] < maxPerFaction);
      if (available.length === 0) { zone.ownerId = null; continue; }
      const f = Utils.pick(available);
      zone.ownerId = f.id;
      zone.guards = Utils.rnd(2, 6);
      factionCounts[f.id]++;
    }
    State.factions.forEach(f => { f.zones = factionCounts[f.id]; });
  },

  _economy() {
    const prices = {};
    for (const w of Weapons.list) {
      const mod = Utils.rnd(85, 115) / 100;
      prices[w.id] = Math.round(w.basePrice * mod);
    }
    const shortagePool = Utils.shuffle(Weapons.list.map(w => w.id)).slice(0, 2);
    State.economy = {
      prices: prices,
      shortages: shortagePool,  // эти дороже на 25%
    };
  },

  _playerStory() {
    const arch = Utils.pick(Lore.archetypes);
    if (!State.factions || State.factions.length === 0) return;
    const enemyFaction = State.factions[Math.floor(Math.random() * State.factions.length)];
    if (!enemyFaction) return;
    const otherFactions = State.factions.filter(f => f.id !== enemyFaction.id);
    const allyFaction = otherFactions.length > 0 ? Utils.pick(otherFactions) : null;
    const allyNpc = State.npcs.find(n => !n.factionId) || State.npcs[0];

    State.player.story = {
      archetypeId: arch.id,
      archetypeName: arch.name,
      backstory: arch.backstory,
      goal: arch.goal,
      enemyFactionId: enemyFaction.id,
      allyNpcId: allyNpc.id,
      mystery: 'Кто-то в этом городе держит все нити. Ты узнаешь кто. Рано или поздно.',
      flags: { mysteryStep: 0 },
    };
  },

  _applyPrestige() {
    if (typeof Prestige === 'undefined') return;
    const bonus = Prestige.getStartingBonuses();
    if (bonus.blood <= 0) return;

    State.player.money += bonus.bonusMoney;
    State.player.reputation += bonus.bonusReputation;
    State.player.lifetime.inheritedFromBlood = bonus.blood;

    if (bonus.bonusMoney > 0) {
      Engine.log('Кровь рода дала тебе $' + Utils.fmtMoney(bonus.bonusMoney) + ' на старт.', 'warn');
    }
    if (bonus.bonusReputation > 0) {
      Engine.log('Твоё имя уже знают. Репутация: +' + bonus.bonusReputation + '.', 'warn');
    }
    if (bonus.tradeDiscount > 0) {
      Engine.log('У торговцев скидка ' + Math.round(bonus.tradeDiscount * 100) + '% — фамилию помнят.', 'good');
    }
    State.flags.tradeDiscount = bonus.tradeDiscount;
    State.flags.inheritChance = bonus.inheritChance;

    // Шанс унаследовать оружие
    if (Utils.chance(bonus.inheritChance)) {
      const w = Utils.pick(Weapons.list.filter(x => x.rarity <= 2));
      if (w) {
        State.weapons.owned.push(w.id);
        State.player.currentWeaponId = w.id;
        const ammoType = Weapons.ammo.find(a => a.for.includes(w.category));
        if (ammoType) {
          State.player.inventory.ammo[ammoType.id] = (State.player.inventory.ammo[ammoType.id] || 0) + 40;
        }
        Engine.log('Унаследовано оружие: ' + w.name + ' (+40 патронов).', 'good');
      }
    }
  },

  _startingWeapons() {
    const starterId = Weapons.starter(State.player.side);
    const starterWeapon = Weapons.find(starterId);
    if (!starterId || !starterWeapon) {
      Engine.log('Не удалось выдать стартовое оружие.', 'warn');
      return;
    }
    State.player.currentWeaponId = starterId;
    State.weapons.owned.push(starterId);
    State.weapons.durability[starterId] = 100;

    // Стартовые патроны по типу (60 штук)
    const ammoType = Weapons.ammo.find(a => a.for.includes(starterWeapon.category));
    if (ammoType) {
      State.player.inventory.ammo[ammoType.id] = 60;
    }

    // Броня по стороне
    const starterArmorId = Weapons.starterArmor(State.player.side);
    if (starterArmorId && !State.player.inventory.ownedArmor.includes(starterArmorId)) {
      State.player.inventory.ownedArmor.push(starterArmorId);
    }
    State.player.armor = starterArmorId || 'armor_none';
  },

  _startingQuests() {
    const pool = Utils.shuffle(QuestData.templates).slice(0, 15);
    const quests = [];
    for (const tpl of pool) {
      const zone = Utils.pick(State.zones);
      const giver = Utils.pick(State.npcs);
      quests.push({
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
        daily: false,
        createdDay: State.time.day,
      });
    }
    State.quests.available = quests;
  },
};
