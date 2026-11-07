// ═══ ОДЕЖДА: 70-Е, КРАСИВЫЕ НАЗВАНИЯ ═══
const OutfitsData = {
  boutiques: [
    // ── ТИР 0: ДЕШЁВО ──
    {
      id: 'salvation',
      name: '«СПАСЕНИЕ»',
      desc: 'Армия спасения. Пожертвованные вещи. Пахнет чужой жизнью.',
      items: [
        { id: 'outfit_drifter',  name: 'The Drifter',  price: 30,  charisma: 0.5, rep: 1, tier: 0, desc: 'Твидовый пиджак с чужого плеча. Пахнет чужими надеждами и застарелым табаком. Брюки не по размеру, но в этом городе никто не смотрит на брюки.' },
        { id: 'outfit_wanderer', name: 'The Wanderer', price: 80,  charisma: 0.6, rep: 1, tier: 0, desc: 'Серый, потёртый, с заплаткой на локте. Ты носишь его третий год. Или его носил кто-то другой до тебя. Разницы уже нет.' }
      ]
    },
    {
      id: 'sears',
      name: '«СИР»',
      desc: 'Каталог Sears. Всё по почте. Дешёво и сердито.',
      items: [
        { id: 'outfit_catalogue', name: 'The Catalogue', price: 150, charisma: 0.7, rep: 2, tier: 0, desc: 'Стандартный крой из каталога Sears. Ничего лишнего. Как большинство жизней в этом городе, скроен по шаблону. Зато дёшево.' },
        { id: 'outfit_postman',   name: 'The Postman',   price: 250, charisma: 0.8, rep: 2, tier: 0, desc: 'Синий форменный. Добротный. В нём можно и на почту, и на дело. Никто не заподозрит человека в форме.' }
      ]
    },

    // ── ТИР 1: РАБОЧИЙ ──
    {
      id: 'penney',
      name: '«ПЕННИ»',
      desc: 'Универмаг J.C. Penney. Средний класс. Средний вкус.',
      items: [
        { id: 'outfit_clerk',   name: 'The Clerk',    price: 400, charisma: 0.9, rep: 3, tier: 1, desc: 'Серый в тонкую полоску. Лацканы широковаты, как в 70-х. Галстук из дешёвого шёлка. Ты человек в офисе, которого никто не запомнит. Это может спасти тебе жизнь.' },
        { id: 'outfit_salesman', name: 'The Salesman', price: 600, charisma: 0.9, rep: 3, tier: 1, desc: 'Коричневый вельвет. Мягкий, тёплый. В нём удобно уговаривать. И в нём удобно лгать. Ты продаёшь, и покупатель верит.' }
      ]
    },
    {
      id: 'montgomery',
      name: '«МОНТГОМЕРИ»',
      desc: 'Montgomery Ward. Старый универмаг. Крепкие вещи для крепких людей.',
      items: [
        { id: 'outfit_manager', name: 'The Manager', price: 800,  charisma: 1.0, rep: 4, tier: 1, desc: 'Тёмно-синий. Строгий. Ты человек, который считает чужие деньги. И берёт свои. Ткань плотная, крой уверенный. В таком не спрашивают. В таком решают.' },
        { id: 'outfit_foreman', name: 'The Foreman', price: 1100, charisma: 1.0, rep: 4, tier: 1, desc: 'Твидовый пиджак с кожаными заплатками на локтях. Пахнет машинным маслом и хорошим табаком. Практично. Солидно. Не для бала.' }
      ]
    },

    // ── ТИР 2: ГОРОДСКОЙ ──
    {
      id: 'woolworth',
      name: '«ВУЛВОРТ»',
      desc: 'Woolworth. Пятицентовик. Но костюмы уже приличные.',
      items: [
        { id: 'outfit_cityman',    name: 'The City Man', price: 1500, charisma: 1.1, rep: 5, tier: 2, desc: 'Серый двубортный. Широкие лацканы. Классика 70-х. В таком ходят те, кто хочет, чтобы их принимали за кого-то. Иногда — за кого-то большего.' },
        { id: 'outfit_businessman', name: 'The Businessman', price: 2000, charisma: 1.1, rep: 5, tier: 2, desc: 'Тёмно-коричневая тройка. С жилетом. Галстук красный, как кровь. Солидно. Дорого. И глаз не отведёшь.' }
      ]
    },
    {
      id: 'kresge',
      name: '«КРЕСДЖ»',
      desc: 'Kresge. Магазин с претензией. Уже не дёшево, но ещё не дорого.',
      items: [
        { id: 'outfit_broker',   name: 'The Broker',   price: 2800, charisma: 1.2, rep: 6, tier: 2, desc: 'Синий в тонкую полоску. Широкие плечи, клёш. Ты брокер. Или играешь его. Какая разница, если деньги настоящие?' },
        { id: 'outfit_attorney', name: 'The Attorney', price: 3500, charisma: 1.2, rep: 6, tier: 2, desc: 'Серый твид. Солидно и строго. В таком не спрашивают. В таком отвечают. И за ответы берут дорого.' }
      ]
    },

    // ── ТИР 3: ДОРОГОЙ ──
    {
      id: 'brooks',
      name: '«БРУК»',
      desc: 'Brooks Brothers. Американская классика. Здесь одевались отцы города.',
      items: [
        { id: 'outfit_aristocrat', name: 'The Aristocrat', price: 5000,  charisma: 1.3, rep: 7, tier: 3, desc: 'Саксония. Классический американский крой. Широкие лацканы, идеальная посадка. В таком одевались отцы города. Теперь — ты.' },
        { id: 'outfit_gentleman',  name: 'The Gentleman',  price: 7000,  charisma: 1.3, rep: 8, tier: 3, desc: 'Тёмно-серый двубортный. Для тех, кто принимает решения. И не сожалеет. Ткань струится, как виски в стакане.' }
      ]
    },
    {
      id: 'hart',
      name: '«ХАРТ»',
      desc: 'Hart Schaffner Marx. Костюмы для тех, кто знает толк. И имеет деньги.',
      items: [
        { id: 'outfit_consigliere', name: 'Il Consigliere', price: 10000, charisma: 1.4, rep: 9,  tier: 3, desc: 'Чёрный, с отливом. Тройка. Ты человек, который всегда рядом с Доном. И всегда знает больше, чем говорит. Это не одежда — это должность.' },
        { id: 'outfit_godfather',   name: 'Il Padrino',     price: 14000, charisma: 1.4, rep: 10, tier: 3, desc: 'Тёмно-бордовый. Тонкая шерсть, но выглядит как бархат. Ты крёстный отец. Может, не всей мафии. Но своей — точно.' }
      ]
    },

    // ── ТИР 4: ПРЕМИУМ ──
    {
      id: 'hickey',
      name: '«ХИКИ»',
      desc: 'Hickey Freeman. Премиум-класс. Для тех, кто не смотрит на ценник.',
      items: [
        { id: 'outfit_executive', name: 'Il Direttore',  price: 20000, charisma: 1.5, rep: 12, tier: 4, desc: 'Ручная работа. Твидовый пиджак. Пахнет деньгами и дорогим одеколоном. Ты исполнительный директор. Или тот, кто его купил.' },
        { id: 'outfit_president', name: 'Il Presidente', price: 28000, charisma: 1.5, rep: 14, tier: 4, desc: 'Тёмно-синий. Безупречный крой. Ты президент. Пусть и не страны. Но компании точно. И этого достаточно.' }
      ]
    },

    // ── ТИР 5: ЭЛИТА ──
    {
      id: 'oxford',
      name: '«ОКСФОРД»',
      desc: 'Oxxford. Чикагский дом. Элита. Закрытые двери, знакомства, связи.',
      items: [
        { id: 'outfit_senator',  name: 'Il Senatore',  price: 40000, charisma: 1.6, rep: 16, tier: 5, desc: 'Серый в тонкую полоску. Классика Oxxford. Ты сенатор. Или тот, кто покупает сенаторов. В этом городе разница невелика.' },
        { id: 'outfit_governor', name: 'Il Governatore', price: 55000, charisma: 1.6, rep: 18, tier: 5, desc: 'Тёмно-бордовый. Тяжёлая шерсть. Ты губернатор. Почти. И почти в Белом доме. Но пока — только в этом городе.' }
      ]
    },

    // ── ТИР 6: КУТЮР ──
    {
      id: 'polo',
      name: '«ПОЛО»',
      desc: 'Ralph Lauren. Основан в 1967-м. Настоящая Америка 70-х.',
      items: [
        { id: 'outfit_american', name: "L'Americain", price: 80000,  charisma: 1.7, rep: 20, tier: 6, desc: 'Ralph Lauren. Коричневый твид. Широкие лацканы. Клёш. Чистая Америка 70-х. Ты — воплощение стиля. И капитала.' },
        { id: 'outfit_magnat',   name: 'Le Magnat',   price: 120000, charisma: 1.8, rep: 25, tier: 6, desc: 'Сшит на заказ. Единственный в мире. Ты магнат. Нефть, сталь, деньги — неважно. Важно, что ты — на вершине.' }
      ]
    },

    // ── ТИР 7: АТЕЛЬЕ ──
    {
      id: 'atelier',
      name: '«АТЕЛЬЕ»',
      desc: 'Закрытое ателье. Не для всех. Только для тех, кого знают.',
      items: [
        { id: 'outfit_grandmaitre', name: 'Le Grand Maître', price: 150000, charisma: 1.8, rep: 30, tier: 7, desc: 'Французский шёлк. Париж. Ты — великий магистр. Всё, что ниже — просто публика. И ты знаешь это.' },
        { id: 'outfit_maestro',     name: 'Il Maestro',      price: 200000, charisma: 1.8, rep: 35, tier: 7, desc: 'Итальянская шерсть высшего сорта. Милан. Флоренция. Рим. Ты маэстро. Не музыки — жизни. И все это понимают.' }
      ]
    }
  ],

  findById(id) {
    for (const b of this.boutiques) {
      const item = b.items.find(i => i.id === id);
      if (item) return item;
    }
    return null;
  },

  getAll() {
    const out = [];
    for (const b of this.boutiques) {
      for (const item of b.items) {
        out.push({ ...item, boutiqueName: b.name, boutiqueId: b.id });
      }
    }
    return out;
  }
};
