function defaultBody() {
  return {
    head:     { hp: 100, max: 100 },
    torso:    { hp: 100, max: 100 },
    leftArm:  { hp: 100, max: 100 },
    rightArm: { hp: 100, max: 100 },
    leftLeg:  { hp: 100, max: 100 },
    rightLeg: { hp: 100, max: 100 },
  };
}

// Новое: состояния для каждой части тела
function defaultConditions() {
  const body = ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
  const cond = {};
  for (const part of body) {
    cond[part] = {
      bleeding: false,
      fracture: false,
      infected: false,
      concussion: false,
      burn: false,
      shrapnel: false,
    };
  }
  return cond;
}

function defaultSurvival() {
  return {
    hunger: 80,     // 0 = смерть
    thirst: 80,
    energy: 100,    // сон
    lastMealDay: 1,
    lastDrinkDay: 1,
    lastSleepDay: 1,
  };
}

function defaultSanity() {
  return {
    sanity: 100,        // 0 = срыв
    stress: 0,          // 0..100
    killsToday: 0,
    nightmares: 0,      // счётчик
    hallucinations: false,
    lastResetDay: 1,
  };
}

function defaultDependencies() {
  return {
    nicotine: 0,        // 0..100
    alcohol: 0,
    stimulants: 0,
    opiates: 0,
    // активные эффекты
    activeEffects: [],  // [{id, name, until, type, value}]
    withdrawal: null,   // {type, until} если в ломке
  };
}

function defaultState() {
  return {
    version: '2.0.0',
    seed: null,
    city: null,
    player: {
      name: 'Безымянный',
      side: null,
      gangName: null,
      money: 150,
      reputation: 0,
      heat: 0,
      level: 1,
      xp: 0,
      xpNext: 100,
      stats: { strength: 5, agility: 5, charisma: 5, shooting: 5, stealth: 5, endurance: 5 },
      perks: [],
      body: defaultBody(),
      portrait: null,
      conditions: defaultConditions(),   // NEW
      survival: defaultSurvival(),       // NEW
      sanity: defaultSanity(),           // NEW
      dependencies: defaultDependencies(),
      barVisitsToday: 0,
      workToday: 0,
      casinoToday: 0,
      casinoSession: null,
      restaurantToday: 0,
      pokerGamesToday: 0,
      idleHistory: [],
      idleEventsToday: 0,
      lastCopEventDay: 0,
      zoneVisitsToday: 0,// NEW
      story: null,
      preferences: null,
      knownPrefs: { cig: false, alc: false },
      relationship: { lily: null, evelyn: null, vivian: null },
      currentWeaponId: null,
      armor: 'armor_none',
      currentOutfit: 'outfit_drifter',
      ownedOutfits: ['outfit_drifter'],
      inventory: {
        ammo: {},
        food: 1,        // NEW: еда
        water: 1,       // NEW: вода
        cigs: 0,
        cigs_inv: { camel: 0, marlboro: 0, lucky: 0 },        // NEW: сигареты
        alcohol: 0,
        alc_inv: { whiskey: 0, vodka: 0, rum: 0 },     // NEW: бутылки
        drugs: {},      // NEW: {drugId: quantity}
        medicine: { bandages: 1, tourniquet: 0, splint: 0, painkillers: 0, antibiotics: 0, adrenaline: 0, medkit: 0, vitamins: 0, stimulant_med: 0, detox: 0 },
        ownedArmor: ['armor_none'], // NEW
      },
      usedNames: [],
      lifetime: { kills: 0, moneyEarned: 0, missionsDone: 0, daysSurvived: 0, deaths: 0, overdoses: 0, breakdowns: 0 },
      personalEnemies: [],
    },
    time: { day: 1, hour: 8, maxHour: 23 },
    zones: [],
    factions: [],
    npcs: [],
    economy: { prices: {}, shortages: [], drugPrices: {} },
    building: {
      level: 1,
      modules: {
        armory:   { level: 0, upgradeUntil: null },
        workshop: { level: 0, upgradeUntil: null },
        medbay:   { level: 0, upgradeUntil: null },
        barracks: { level: 0, upgradeUntil: null },
        casino:   { level: 0, upgradeUntil: null },
      },
    },
    businesses: [],
    mercenaries: { pool: [], active: [], poolResetDay: 1 },
    weapons: { owned: [], durability: {}, forSale: [] },
    cars: { owned: [], forSale: [] },
    quests: { available: [], active: [], completed: [], failed: [], dailyReset: 1 },
    events: { pending: [] },
    combat: null,
    poker: null,
    mayor: null,
    politics: { playerInfluence: 0, lobbyUntil: 0 },
    flags: {},
    deathCount: 0,
  };
}

const State = defaultState();

State.reset = function () {
  Object.keys(State).forEach(k => { if (k !== 'reset') delete State[k]; });
  Object.assign(State, defaultState());
};
