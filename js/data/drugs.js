const DrugData = {
  // ═══ СИГАРЕТЫ ═══
  cigarettes: {
    id: 'cigarettes',
    name: 'Сигареты',
    category: 'nicotine',
    price: 50,
    stackPrice: 50,
    desc: 'Дешёвый способ забыть, что ты жив.',
    useTime: 0.25,
    effects: { stress: -10, charisma: +2, duration: 2 },
    addictionGain: 8,
    withdrawalPenalty: { shooting: -2, endurance: -2, log: 'Руки трясутся. Хочется курить.' },
    overdoseChance: 0,
  },

  // ═══ АЛКОГОЛЬ ═══
  alcohol: {
    id: 'alcohol',
    name: 'Бутылка дешёвого виски',
    category: 'alcohol',
    price: 150,
    desc: 'Пахнет как растворитель. Пьётся как вода.',
    useTime: 0.5,
    effects: { stress: -20, painkiller: 30, accuracy: -0.10, charisma: +3, duration: 4 },
    addictionGain: 12,
    withdrawalPenalty: { shooting: -3, agility: -2, log: 'Тремор. Мир плывёт без причины.' },
    overdoseChance: 0,
  },

  // ═══ СТИМУЛЯТОРЫ ═══
  cocaine: {
    id: 'cocaine',
    name: 'Кокаин',
    category: 'stimulants',
    price: 400,
    desc: 'Белый порошок. Сердце бьётся быстрее, чем нужно.',
    useTime: 0.25,
    effects: { stress: -15, shooting: +15, energy: +30, agility: +10, duration: 6 },
    crash: { shooting: -15, energy: -40, sanity: -10, duration: 12 },
    addictionGain: 25,
    withdrawalPenalty: { shooting: -5, agility: -4, energy: -20, log: 'Ломка. Тело чужое.' },
    overdoseChance: 0.10,
    overdoseThreshold: 50,
  },
  amphetamine: {
    id: 'amphetamine',
    name: 'Амфетамин',
    category: 'stimulants',
    price: 250,
    desc: 'Ты не устанешь. Пока не упадёшь.',
    useTime: 0.25,
    effects: { energy: +50, shooting: +8, endurance: +5, stress: +5, duration: 8 },
    crash: { energy: -60, sanity: -8, duration: 12 },
    addictionGain: 20,
    withdrawalPenalty: { endurance: -4, energy: -25, log: 'Слабость. Хочется спать и не проснуться.' },
    overdoseChance: 0.08,
    overdoseThreshold: 45,
  },

  // ═══ ОПИАТЫ ═══
  heroin: {
    id: 'heroin',
    name: 'Героин',
    category: 'opiates',
    price: 500,
    desc: 'Боль уходит. Всё уходит. Это и есть проблема.',
    useTime: 0.5,
    effects: { stress: -40, sanity: +20, painkiller: 100, accuracy: -0.15, duration: 8 },
    crash: { sanity: -15, stress: +20, duration: 8 },
    addictionGain: 35,
    withdrawalPenalty: { shooting: -8, agility: -8, sanity: -15, endurance: -5, log: 'Ломка. Ты готов на всё. Буквально на всё.' },
    overdoseChance: 0.15,
    overdoseThreshold: 40,
  },
  morphine: {
    id: 'morphine',
    name: 'Морфин',
    category: 'opiates',
    price: 300,
    desc: 'Медицинский. На бумаге. На деле — та же дорога.',
    useTime: 0.25,
    effects: { painkiller: 80, sanity: +10, stress: -15, duration: 6 },
    crash: { sanity: -8, duration: 6 },
    addictionGain: 25,
    withdrawalPenalty: { agility: -5, sanity: -10, log: 'Тело просит. Ты не можешь отказать.' },
    overdoseChance: 0.12,
    overdoseThreshold: 45,
  },
};

DrugData.find = (id) => DrugData[id] || null;
DrugData.list = () => Object.values(DrugData).filter(d => d.id);
