const Buildings = {
  modules: {
    armory: {
      name: 'Оружейка',
      desc: 'Место, где хранится то, о чём не говорят вслух.',
      baseCost: 2000,
      baseTime: 24,
      effects: {
        income: 0,
        unlocks: 'Доступ к оружию выше 2 редкости',
      },
    },
    workshop: {
      name: 'Мастерская',
      desc: 'Здесь чинят то, что официально не существует.',
      baseCost: 3000,
      baseTime: 36,
      effects: { income: 0, unlocks: 'Апгрейды оружия (фаза 3)' },
    },
    medbay: {
      name: 'Медпункт',
      desc: 'Врач без лицензии. Зато без вопросов.',
      baseCost: 1500,
      baseTime: 18,
      effects: { healPerSleep: 8 },
    },
    barracks: {
      name: 'Казарма',
      desc: 'Люди, готовые на всё. Почти на всё.',
      baseCost: 2500,
      baseTime: 30,
      effects: { mercSlots: 2 },
    },
    casino: {
      name: 'Казино',
      desc: 'Дом всегда в плюсе. Вопрос лишь в том, кто этот дом.',
      baseCost: 5000,
      baseTime: 48,
      effects: { income: 50 },
    },
  },

  businesses: {
    bar:        { name: 'Бар',          income: 90,  buyPrice: 1000,  desc: 'Слухи, виски, старые долги.' },
    stripclub:  { name: 'Стриптиз-бар', income: 180, buyPrice: 2000,  desc: 'Где политики забывают о морали.' },
    restaurant: { name: 'Ресторан',     income: 135, buyPrice: 1500,  desc: 'Хорошая кухня, тихие разговоры.' },
    gunship:    { name: 'Оружейный',    income: 165, buyPrice: 2400,  desc: 'Легально — на бумаге.' },
    casino:     { name: 'Казино',       income: 270, buyPrice: 4000,  desc: 'Дом всегда в плюсе.' },
    pawnshop:   { name: 'Ломбард',      income: 75,  buyPrice: 800,   desc: 'Всё имеет цену.' },
    brothel:    { name: 'Бордель',      income: 210, buyPrice: 2700,  desc: 'Информация иногда дороже денег.' },
    warehouse:  { name: 'Склад',        income: 120, buyPrice: 1700,  desc: 'Пусто. Пока.' },
  },

  moduleCost(moduleId, currentLevel) {
    const m = this.modules[moduleId];
    if (!m) return 0;
    return Utils.upgradeCost(m.baseCost, currentLevel + 1);
  },
  moduleTime(moduleId, currentLevel) {
    const m = this.modules[moduleId];
    if (!m) return 0;
    return Utils.upgradeTime(m.baseTime, currentLevel + 1);
  },
};
