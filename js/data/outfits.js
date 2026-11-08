// ═══ ОДЕЖДА: 70-Е, КРАСИВЫЕ НАЗВАНИЯ ═══
const OutfitsData = {
  boutiques: [
    // ── ТИР 0: ДЕШЁВО ──
    {
      id: 'salvation',
      name: '«СПАСЕНИЕ»',
      desc: 'Армия спасения. Пожертвованные вещи. Пахнет чужой жизнью.',
      items: [
        { id: 'outfit_drifter',  name: 'The Drifter',  price: 30,  charisma: 0.5, rep: 0, tier: 0, desc: 'Твидовый пиджак с чужого плеча. Пахнет чужими надеждами и застарелым табаком. Брюки не по размеру, но в этом городе никто не смотрит на брюки.' },
        { id: 'outfit_wanderer', name: 'The Wanderer', price: 80,  charisma: 0.6, rep: 0, tier: 0, desc: 'Серый, потёртый, с заплаткой на локте. Ты носишь его третий год. Или его носил кто-то другой до тебя. Разницы уже нет.' }
      ]
    },
    {
      id: 'sears',
      name: '«СИР»',
      desc: 'Каталог Sears. Всё по почте. Дешёво и сердито.',
      items: [
        { id: 'outfit_catalogue', name: 'The Catalogue', price: 150, charisma: 0.7, rep: 0, tier: 0, desc: 'Стандартный крой из каталога Sears. Ничего лишнего. Как большинство жизней в этом городе, скроен по шаблону. Зато дёшево.' },
        { id: 'outfit_postman',   name: 'The Postman',   price: 250, charisma: 0.8, rep: 0, tier: 0, desc: 'Синий форменный. Добротный. В нём можно и на почту, и на дело. Никто не заподозрит человека в форме.' }
      ]
    },

    // ── ТИР 1: РАБОЧИЙ ──
    {
      id: 'penney',
      name: '«ПЕННИ»',
      desc: 'Универмаг J.C. Penney. Средний класс. Средний вкус.',
      items: [
        { id: 'outfit_clerk',   name: 'The Clerk',    price: 400, charisma: 0.9, rep: 0, tier: 1, desc: 'Серый в тонкую полоску. Лацканы широковаты, как в 70-х. Галстук из дешёвого шёлка. Ты человек в офисе, которого никто не запомнит. Это может спасти тебе жизнь.' },
        { id: 'outfit_salesman', name: 'The Salesman', price: 600, charisma: 0.9, rep: 0, tier: 1, desc: 'Коричневый вельвет. Мягкий, тёплый. В нём удобно уговаривать. И в нём удобно лгать. Ты продаёшь, и покупатель верит.' }
      ]
    },
    {
      id: 'montgomery',
      name: '«МОНТГОМЕРИ»',
      desc: 'Montgomery Ward. Старый универмаг. Крепкие вещи для крепких людей.',
      items: [
        { id: 'outfit_manager', name: 'The Manager', price: 800,  charisma: 1.0, rep: 0, tier: 1, desc: 'Тёмно-синий. Строгий. Ты человек, который считает чужие деньги. И берёт свои. Ткань плотная, крой уверенный. В таком не спрашивают. В таком решают.' },
        { id: 'outfit_foreman', name: 'The Foreman', price: 1100, charisma: 1.0, rep: 0, tier: 1, desc: 'Твидовый пиджак с кожаными заплатками на локтях. Пахнет машинным маслом и хорошим табаком. Практично. Солидно. Не для бала.' }
      ]
    },

    // ── ТИР 2: ГОРОДСКОЙ ──
    {
      id: 'woolworth',
      name: '«ВУЛВОРТ»',
      desc: 'Woolworth. Пятицентовик. Но костюмы уже приличные.',
      items: [
        { id: 'outfit_cityman',    name: 'The City Man', price: 1500, charisma: 1.1, rep: 0, tier: 2, desc: 'Серый двубортный. Широкие лацканы. Классика 70-х. В таком ходят те, кто хочет, чтобы их принимали за кого-то. Иногда — за кого-то большего.' },
        { id: 'outfit_businessman', name: 'The Businessman', price: 2000, charisma: 1.1, rep: 0, tier: 2, desc: 'Тёмно-коричневая тройка. С жилетом. Галстук красный, как кровь. Солидно. Дорого. И глаз не отведёшь.' }
      ]
    },
    {
      id: 'kresge',
      name: '«КРЕСДЖ»',
      desc: 'Kresge. Магазин с претензией. Уже не дёшево, но ещё не дорого.',
      items: [
        { id: 'outfit_broker',   name: 'The Broker',   price: 2800, charisma: 1.2, rep: 0, tier: 2, desc: 'Синий в тонкую полоску. Широкие плечи, клёш. Ты брокер. Или играешь его. Какая разница, если деньги настоящие?' },
        { id: 'outfit_attorney', name: 'The Attorney', price: 3500, charisma: 1.2, rep: 0, tier: 2, desc: 'Серый твид. Солидно и строго. В таком не спрашивают. В таком отвечают. И за ответы берут дорого.' }
      ]
    },

    // ── ТИР 3: ДОРОГОЙ ──
    {
      id: 'brooks',
      name: '«БРУК»',
      desc: 'Brooks Brothers. Американская классика. Здесь одевались отцы города.',
      items: [
        { id: 'outfit_aristocrat', name: 'The Aristocrat', price: 5000,  charisma: 1.3, rep: 0, tier: 3, desc: 'Саксония. Классический американский крой. Широкие лацканы, идеальная посадка. В таком одевались отцы города. Теперь — ты.' },
        { id: 'outfit_gentleman',  name: 'The Gentleman',  price: 7000,  charisma: 1.3, rep: 0, tier: 3, desc: 'Тёмно-серый двубортный. Для тех, кто принимает решения. И не сожалеет. Ткань струится, как виски в стакане.' }
      ]
    },
    {
      id: 'hart',
      name: '«ХАРТ»',
      desc: 'Hart Schaffner Marx. Костюмы для тех, кто знает толк. И имеет деньги.',
      items: [
        { id: 'outfit_consigliere', name: 'Il Consigliere', price: 10000, charisma: 1.4, rep: 0,  tier: 3, desc: 'Чёрный, с отливом. Тройка. Ты человек, который всегда рядом с Доном. И всегда знает больше, чем говорит. Это не одежда — это должность.' },
        { id: 'outfit_godfather',   name: 'Il Padrino',     price: 14000, charisma: 1.4, rep: 0, tier: 3, desc: 'Тёмно-бордовый. Тонкая шерсть, но выглядит как бархат. Ты крёстный отец. Может, не всей мафии. Но своей — точно.' }
      ]
    },

    // ── ТИР 4: ПРЕМИУМ ──
    {
      id: 'hickey',
      name: '«ХИКИ»',
      desc: 'Hickey Freeman. Премиум-класс. Для тех, кто не смотрит на ценник.',
      items: [
        { id: 'outfit_executive', name: 'Il Direttore',  price: 20000, charisma: 1.5, rep: 0, tier: 4, desc: 'Ручная работа. Твидовый пиджак. Пахнет деньгами и дорогим одеколоном. Ты исполнительный директор. Или тот, кто его купил.' },
        { id: 'outfit_president', name: 'Il Presidente', price: 28000, charisma: 1.5, rep: 0, tier: 4, desc: 'Тёмно-синий. Безупречный крой. Ты президент. Пусть и не страны. Но компании точно. И этого достаточно.' }
      ]
    },

    // ── ТИР 5: ЭЛИТА ──
    {
      id: 'oxford',
      name: '«ОКСФОРД»',
      desc: 'Oxxford. Чикагский дом. Элита. Закрытые двери, знакомства, связи.',
      items: [
        { id: 'outfit_senator',  name: 'Il Senatore',  price: 40000, charisma: 1.6, rep: 0, tier: 5, desc: 'Серый в тонкую полоску. Классика Oxxford. Ты сенатор. Или тот, кто покупает сенаторов. В этом городе разница невелика.' },
        { id: 'outfit_governor', name: 'Il Governatore', price: 55000, charisma: 1.6, rep: 0, tier: 5, desc: 'Тёмно-бордовый. Тяжёлая шерсть. Ты губернатор. Почти. И почти в Белом доме. Но пока — только в этом городе.' }
      ]
    },

    // ── ТИР 6: КУТЮР ──
    {
      id: 'polo',
      name: '«ПОЛО»',
      desc: 'Ralph Lauren. Основан в 1967-м. Настоящая Америка 70-х.',
      items: [
        { id: 'outfit_american', name: "L'Americain", price: 80000,  charisma: 1.7, rep: 0, tier: 6, desc: 'Ralph Lauren. Коричневый твид. Широкие лацканы. Клёш. Чистая Америка 70-х. Ты — воплощение стиля. И капитала.' },
        { id: 'outfit_magnat',   name: 'Le Magnat',   price: 120000, charisma: 1.8, rep: 0, tier: 6, desc: 'Сшит на заказ. Единственный в мире. Ты магнат. Нефть, сталь, деньги — неважно. Важно, что ты — на вершине.' }
      ]
    },

    // ── ТИР 7: АТЕЛЬЕ ──
    {
      id: 'atelier',
      name: '«АТЕЛЬЕ»',
      desc: 'Закрытое ателье. Не для всех. Только для тех, кого знают.',
      items: [
        { id: 'outfit_grandmaitre', name: 'Le Grand Maître', price: 150000, charisma: 1.8, rep: 0, tier: 7, desc: 'Французский шёлк. Париж. Ты — великий магистр. Всё, что ниже — просто публика. И ты знаешь это.' },
        { id: 'outfit_maestro',     name: 'Il Maestro',      price: 200000, charisma: 1.8, rep: 0, tier: 7, desc: 'Итальянская шерсть высшего сорта. Милан. Флоренция. Рим. Ты маэстро. Не музыки — жизни. И все это понимают.' }
      ]
    },

    // ── АКСЕССУАРЫ ──
    {
      id: 'accessories',
      name: '«ЛАВКА СТАРЬЯ»',
      desc: 'Часы, флаконы, безделушки. Всё с чужого плеча. Или с чужой руки.',
      items: [
        // ═══ ЧАСЫ ═══
        { id: 'acc_watch_timex',    name: 'Timex',              price: 100,    type: 'accessory', slot: 'watch', rep: 0,  charisma: 0.0, desc: 'Тикают. Иногда отстают. Ты не чинишь — так проще врать о времени.' },
        { id: 'acc_watch_casio',    name: 'Casio',              price: 250,    type: 'accessory', slot: 'watch', rep: 0,  charisma: 0.0, desc: 'Из будущего. На самом деле подделка. Но копы не разбираются.' },
        { id: 'acc_watch_seiko',    name: 'Seiko',              price: 800,    type: 'accessory', slot: 'watch', rep: 0,  charisma: 0.1, desc: 'Японские. Точные. Скучные. Как большинство честных людей в этом городе.' },
        { id: 'acc_watch_citizen',  name: 'Citizen',            price: 1500,   type: 'accessory', slot: 'watch', rep: 0,  charisma: 0.15, desc: 'Снял с трупа. Идут точно. Он тоже шёл точно. Пока не перестал.' },
        { id: 'acc_watch_bulova',   name: 'Bulova',             price: 2500,   type: 'accessory', slot: 'watch', rep: 0,  charisma: 0.2, desc: 'Америка. Сталь. Надёжность. Три вещи, которых тебе не хватает.' },
        { id: 'acc_watch_omega',    name: 'Omega',              price: 9000,   type: 'accessory', slot: 'watch', rep: 0,  charisma: 0.3, desc: 'На внутренней крышке — чужая гравировка. Ты не знаешь, кого. Он уже ищет.' },
        { id: 'acc_watch_rolex',    name: 'Rolex',              price: 18000,  type: 'accessory', slot: 'watch', rep: 0,  charisma: 0.4, desc: 'Золотой. Тяжёлый. Копы смотрят на него дольше, чем на твоё лицо.' },
        { id: 'acc_watch_cartier',  name: 'Cartier',            price: 35000,  type: 'accessory', slot: 'watch', rep: 0,  charisma: 0.5, desc: 'Франция. Квадратный циферблат. В таком не спрашивают время. В таком его назначают.' },
        { id: 'acc_watch_vacheron', name: 'Vacheron Constantin', price: 60000, type: 'accessory', slot: 'watch', rep: 0, charisma: 0.55, desc: 'Ты не купил их. Ты их унаследовал. Или отнял у того, кто унаследовал.' },
        { id: 'acc_watch_patek',    name: 'Patek Philippe',     price: 100000, type: 'accessory', slot: 'watch', rep: 0, charisma: 0.6, desc: 'Ты не покупаешь такие часы. Ты их наследуешь. Или забираешь у того, кто наследовал.' },

        // ═══ ПАРФЮМ ═══
        { id: 'acc_scent_troynoy',  name: '«Тройной»',          price: 100,    type: 'accessory', slot: 'scent', rep: 0, charisma: 0.0, desc: 'Пахнет отцом. Ты не любил отца. Но покупаешь.' },
        { id: 'acc_scent_shipr',    name: '«Шипр»',             price: 150,    type: 'accessory', slot: 'scent', rep: 0, charisma: 0.0, desc: 'Пахнет казармой. Или тюрьмой. Ты не помнишь, где именно.' },
        { id: 'acc_scent_moskva',   name: '«Красная Москва»',   price: 200,    type: 'accessory', slot: 'scent', rep: 0, charisma: 0.05, desc: 'Бабушкин. Женщина в баре внезапно улыбается. Ты не понимаешь почему. Она тоже.' },
        { id: 'acc_scent_oldspice', name: 'Old Spice',          price: 600,    type: 'accessory', slot: 'scent', rep: 0, charisma: 0.2, desc: 'Пахнет морем, которого ты не видел. И мужчиной, которым ты не стал.' },
        { id: 'acc_scent_brut',     name: 'Brut',               price: 900,    type: 'accessory', slot: 'scent', rep: 0, charisma: 0.2, desc: 'Простой. Чесный. Пахнет как большинство — ничем. Или всем сразу.' },
        { id: 'acc_scent_tabac',    name: 'Tabac',              price: 1500,   type: 'accessory', slot: 'scent', rep: 0, charisma: 0.25, desc: 'Табак и кожа. Пахнет кабинетом, которого у тебя нет. И решением, которое ты не принял.' },
        { id: 'acc_scent_aramis',   name: 'Aramis',             price: 2800,   type: 'accessory', slot: 'scent', rep: 0, charisma: 0.3, desc: 'Дорогой. Уверенный. Пахнет человеком, который знает, что делает. Ты им притворяешься.' },
        { id: 'acc_scent_chanel',   name: 'Chanel No.5',        price: 4000,   type: 'accessory', slot: 'scent', rep: 0, charisma: 0.5, desc: 'Женщины оборачиваются. Потом смотрят на тебя. Потом жалеют, что обернулись.' },
        { id: 'acc_scent_dior',     name: 'Dior Eau Sauvage',   price: 12000,  type: 'accessory', slot: 'scent', rep: 0, charisma: 0.55, desc: 'Франция. Свежесть. В этом городе пахнет как обещание, которое не сдержат.' },
        { id: 'acc_scent_guerlain', name: 'Guerlain',           price: 35000,  type: 'accessory', slot: 'scent', rep: 0, charisma: 0.6, desc: 'Императорский дом. Пахнет историей. Твоя история закончится раньше, чем флакон.' },

        // ═══ ОЧКИ ═══
        { id: 'acc_glasses_dark',   name: 'Тёмные очки',        price: 100,    type: 'accessory', slot: 'glasses', rep: 0, charisma: 0.1, desc: 'Не видно глаз. Не видно лжи. Иногда помогает. Иногда — мешает.' },
        { id: 'acc_glasses_wayfarer', name: 'Ray-Ban Wayfarer', price: 800,    type: 'accessory', slot: 'glasses', rep: 0, charisma: 0.2, desc: 'Америка. Классика. В таких ходили все — от президентов до грабителей. Разницы уже нет.' },
        { id: 'acc_glasses_aviator', name: 'Ray-Ban Aviator',   price: 1200,   type: 'accessory', slot: 'glasses', rep: 0, charisma: 0.25, desc: 'Лётчицкие. Ты не лётчик. Но в них чувствуешь себя выше.' },
        { id: 'acc_glasses_persol', name: 'Persol',             price: 3500,   type: 'accessory', slot: 'glasses', rep: 0, charisma: 0.3, desc: 'Италия. Роговая оправа. Ты выглядишь умным. Может, ты и есть. Может, просто хорошо притворяешься.' },
        { id: 'acc_glasses_cartier', name: 'Cartier',           price: 25000,  type: 'accessory', slot: 'glasses', rep: 0, charisma: 0.45, desc: 'Золото. Стекло. Копы смотрят на оправу дольше, чем на твоё лицо. И это хорошо.' },
        { id: 'acc_glasses_dunhill', name: 'Dunhill',           price: 45000,  type: 'accessory', slot: 'glasses', rep: 0, charisma: 0.5, desc: 'Англия. Оправа ручной работы. На тебя смотрят иначе. Не как на человека. Как на витрину.' },

        // ═══ ЗАЖИГАЛКИ ═══
        { id: 'acc_lighter_disposable', name: 'Одноразовая',    price: 100,    type: 'accessory', slot: 'lighter', rep: 0, charisma: 0.0, desc: 'Щёлкает тихо. Как надо. Умрёт раньше тебя. Или одновременно.' },
        { id: 'acc_lighter_zippo',  name: 'Zippo',              price: 1200,   type: 'accessory', slot: 'lighter', rep: 0, charisma: 0.2, desc: 'Щелчок слышно в тишине. Иногда это единственное, что слышно.' },
        { id: 'acc_lighter_zippo_engraved', name: 'Zippo с гравировкой', price: 2500, type: 'accessory', slot: 'lighter', rep: 0, charisma: 0.25, desc: 'Гравировка: «Тому, кто вернётся». Вернулся кто-то другой. Ты купил у него.' },
        { id: 'acc_lighter_dunhill', name: 'Dunhill Rollagas',  price: 8000,   type: 'accessory', slot: 'lighter', rep: 0, charisma: 0.35, desc: 'Англия. Золото. Мягкий щелчок. Так щёлкают, когда уверены в следующей секунде.' },
        { id: 'acc_lighter_cartier', name: 'Cartier',           price: 25000,  type: 'accessory', slot: 'lighter', rep: 0, charisma: 0.45, desc: 'Франция. Ты не прикуриваешь — ты делаешь одолжение.' },
        { id: 'acc_lighter_dupont', name: 'S.T. Dupont',        price: 50000,  type: 'accessory', slot: 'lighter', rep: 0, charisma: 0.5, desc: 'Париж. Ты мог бы купить машину. Ты купил зажигалку. И все это понимают.' },

        // ═══ ТРОСТИ ═══
        { id: 'acc_cane_wood',      name: 'Деревянная трость',  price: 100,    type: 'accessory', slot: 'cane', rep: 0, charisma: 0.1, desc: 'Ты не хромаешь. Но с ней тебя пропускают вперёд. Люди уважают хромых.' },
        { id: 'acc_cane_silver',    name: 'Серебряный набалдашник', price: 12000, type: 'accessory', slot: 'cane', rep: 0, charisma: 0.4, desc: 'Серебро тяжёлое. Голова тяжёлая. Иногда это одно и то же.' },
        { id: 'acc_cane_sword',     name: 'Трость со стилетом', price: 30000,  type: 'accessory', slot: 'cane', rep: 0, charisma: 0.5, desc: '«Трость». Охранник не проверяет. Ты понял.' },
        { id: 'acc_cane_ebony',     name: 'Эбеновая с золотом', price: 50000,  type: 'accessory', slot: 'cane', rep: 0, charisma: 0.55, desc: 'Ты не опираешься на неё. Ты её носишь. Разница огромная. И все это понимают.' },
        { id: 'acc_cane_diamond',   name: 'С бриллиантом',      price: 80000,  type: 'accessory', slot: 'cane', rep: 0, charisma: 0.65, desc: 'Камень в набалдашнике. Ты не знаешь, настоящий ли. Но все верят, что настоящий.' },
        { id: 'acc_cane_unique',    name: 'Le Bâton du Maître', price: 100000, type: 'accessory', slot: 'cane', rep: 0, charisma: 0.7, desc: 'Единственная в мире. Сделана для одного человека. Он умер. Теперь она твоя.' }
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
