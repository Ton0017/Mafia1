const CiviliansData = {
  byZone: {
    slums: [
      { id: 'homeless', name: 'Бродяга', wealth: [5, 30], weapon: 'fists', resist: 0.2, desc: 'Оборванец в грязном пальто. Пахнет мочой и дешёвым вином.' },
      { id: 'drunk', name: 'Пьяница', wealth: [10, 50], weapon: 'fists', resist: 0.3, desc: 'Шатается из стороны в сторону. Бубнит что-то себе под нос.' }
    ],
    market: [
      { id: 'trader', name: 'Торговец', wealth: [50, 200], weapon: 'fists', resist: 0.4, desc: 'Лоток с фруктами. Глаза бегают, ищет покупателей.' },
      { id: 'pickpocket', name: 'Карманник', wealth: [20, 100], weapon: 'shiv', resist: 0.5, desc: 'Скользкий тип. Руки в карманах. Не просто так.' }
    ],
    port: [
      { id: 'sailor', name: 'Матрос', wealth: [30, 100], weapon: 'fists', resist: 0.5, desc: 'Пропах солью и рыбой. В глазах — усталость от долгих плаваний.' },
      { id: 'docker', name: 'Грузчик', wealth: [20, 80], weapon: 'fists', resist: 0.4, desc: 'Широкие плечи, тяжёлые руки. Таскает ящики с утра до ночи.' }
    ],
    downtown: [
      { id: 'clerk', name: 'Клерк', wealth: [50, 150], weapon: 'fists', resist: 0.1, desc: 'Серый костюм, портфель. Спешит на работу.' },
      { id: 'businessman', name: 'Бизнесмен', wealth: [100, 300], weapon: 'fists', resist: 0.2, desc: 'Дорогой костюм, золотые часы. Уверен, что мир вращается вокруг него.' }
    ],
    elite: [
      { id: 'rich', name: 'Богач', wealth: [200, 500], weapon: 'pistol', resist: 0.7, desc: 'Шёлковый галстук, туфли ручной работы. Охрана где-то рядом.' }
    ],
    industrial: [
      { id: 'worker', name: 'Рабочий', wealth: [20, 60], weapon: 'fists', resist: 0.3, desc: 'Спецовка в мазуте. Обед в бумажном пакете.' }
    ],
    residential: [
      { id: 'resident', name: 'Житель', wealth: [30, 100], weapon: 'fists', resist: 0.2, desc: 'С сумкой продуктов. Идёт домой к семье.' }
    ],
    cemetery: [
      { id: 'mourner', name: 'Скорбящий', wealth: [20, 80], weapon: 'fists', resist: 0.1, desc: 'Стоит у могилы. Не замечает никого вокруг.' }
    ],
    station: [
      { id: 'traveler', name: 'Приезжий', wealth: [50, 200], weapon: 'fists', resist: 0.2, desc: 'С чемоданом. Ищет, где остановиться.' }
    ],
    abandoned: [
      { id: 'junkie', name: 'Наркоман', wealth: [5, 30], weapon: 'shiv', resist: 0.4, desc: 'Трясётся. Глаза красные. Ищет дозу.' }
    ],
    suburbs: [
      { id: 'suburban', name: 'Обыватель', wealth: [30, 100], weapon: 'fists', resist: 0.2, desc: 'Простой человек. Ничего особенного.' }
    ],
    police: [],
    default: [
      { id: 'passer', name: 'Прохожий', wealth: [20, 80], weapon: 'fists', resist: 0.2, desc: 'Обычный человек. Спешит по своим делам.' }
    ]
  },

  getForZone(zoneType) {
    return this.byZone[zoneType] || this.byZone.default;
  },

  generate(zoneType) {
    const pool = this.getForZone(zoneType);
    if (pool.length === 0) return null;
    const tpl = Utils.pick(pool);
    const wealth = Utils.rnd(tpl.wealth[0], tpl.wealth[1]);
    return {
      id: 'civ_' + Utils.uid(),
      tplId: tpl.id,
      name: tpl.name,
      desc: tpl.desc,
      wealth: wealth,
      weapon: tpl.weapon,
      resist: tpl.resist
    };
  }
};
