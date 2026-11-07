// ═══ НОЧНОЙ ГОРОД ═══
const NightData = {
  // Ночь: 22:00 - 05:59
  isNight() {
    if (!State.time) return false;
    const h = State.time.hour;
    return h >= 22 || h < 6;
  },

  locations: [
    { id: 'stripclub', name: 'Розовая жемчужина', desc: 'Бархат, шампанское и женщины, которые умеют слушать. И брать деньги.', entry: 200 },
    { id: 'den',         name: 'Крысиная нора', desc: 'Подвал без окон. Пахнет химией и страхом. Здесь не задают вопросов.', entry: 0 },
    { id: 'market',      name: 'Чёрный рынок', desc: 'Подземный склад. Всё, что нельзя купить днём. За наличные, без чеков.', entry: 100 },
    { id: 'arena',       name: 'Яма', desc: 'Клетка под землёй. Кровь, ставки, крики. Здесь не выживают — здесь побеждают.', entry: 0 }
  ],

  // ═══ СТРИПТИЗ-БАР ═══
  stripClub: {
    drinks: [
      { id: 'champagne_night', name: 'Шампанское', price: 400, stress: -20, addiction: 8, log: 'Ты пьёшь шампанское. Пузырьки щекочут нос.' },
      { id: 'cocktail_night',  name: 'Коктейль',   price: 250, stress: -15, addiction: 6, log: 'Коктейль. Сладкий, крепкий. Мир становится мягче.' },
      { id: 'whiskey_night',   name: 'Виски',      price: 350, stress: -18, addiction: 10, log: 'Виски. Ты смотришь на сцену сквозь дым.' }
    ],
    dances: [
      { id: 'watch_show',  name: 'Посмотреть шоу', price: 100, sanity: +5, stress: -10, log: 'Ты смотришь. Музыка, свет, тела. На время забываешь о делах.' },
      { id: 'lap_dance',   name: 'Танец на коленях', price: 500, sanity: +10, stress: -25, log: 'Она садится тебе на колени. Пахнет духами и деньгами.' },
      { id: 'take_home',   name: 'Провести ночь ($1500)', price: 1500, sanity: +20, stress: -50, log: 'Ты уходишь с ней. Ночь. Забвение. Утро.' }
    ],
    waitresses: [
      { name: 'Кэнди',  trait: 'болтливая',   hint: 'Знает всех в городе' },
      { name: 'Анжелика', trait: 'тихая',      hint: 'Смотрит в оба' },
      { name: 'Рокси',   trait: 'дерзкая',    hint: 'Ищет спонсора' }
    ],
    waitressTopics: [
      'Кто в городе сейчас главный',
      'Где можно купить ствол',
      'Кто из копов берёт',
      'Кого ищет мафия'
    ]
  },

  // ═══ ПРИТОН ═══
  den: {
    drugs: [
      { id: 'cocaine',     name: 'Кокаин (доза)',   price: 200, log: 'Ты вдыхаешь. Мир становится резче.' },
      { id: 'amphetamine', name: 'Амфетамин (доза)', price: 150, log: 'Ты глотаешь. Усталость отступает.' },
      { id: 'heroin',      name: 'Героин (доза)',   price: 300, log: 'Игла входит. Тепло разливается по телу.' },
      { id: 'morphine',    name: 'Морфин (доза)',   price: 250, log: 'Свинцовое спокойствие. Боль уходит.' }
    ],
    npcs: [
      { type: 'junkie',  name: 'Сидящий у стены', desc: 'Трясётся. Глаза красные. Ищет дозу.',        action: 'Поговорить' },
      { type: 'dealer',  name: 'Тип с сумкой',    desc: 'Смотрит в оба. У него есть всё.',            action: 'Купить' },
      { type: 'info',    name: 'Человек без лица', desc: 'Стоит в тени. Только голос.',                action: 'Спросить' },
      { type: 'cop',     name: 'Странный посетитель', desc: 'Слишком чисто одет. Слишком внимателен.', action: 'Уйти' },
      { type: 'girl',    name: 'Потерянная',      desc: 'Сидит на полу. Ей всё равно.',                action: 'Помочь' }
    ]
  },

  // ═══ ЧЁРНЫЙ РЫНОК ═══
  market: {
    weapons: [
      { id: 'pistol_deagle', name: 'Desert Eagle «Винил»', baseId: 'pistol_deagle', price: 3500, bonus: 'silencer', desc: 'Чёрная, с гравировкой. Звук как винил — тихий и злой.' },
      { id: 'shotgun_sawnoff', name: 'Обрез «Тень»', baseId: 'shotgun_sawnoff', price: 2500, bonus: 'silencer', desc: 'Ствол короче, чем твой палец. Зато в упор — наверняка.' },
      { id: 'smg_thompson', name: 'Thompson «Гробовщик»', baseId: 'smg_thompson', price: 5000, bonus: 'damage', desc: 'Барабан на 100. Тяжёлый, как совесть.' },
      { id: 'sniper_svd',   name: 'СВД «Последний аргумент»', baseId: 'sniper_svd', price: 8000, bonus: 'accuracy', desc: 'Видит за километр. Не промахивается.' }
    ],
    specials: [
      { id: 'fake_passport',  name: 'Поддельный паспорт',  price: 3000, desc: 'Новое имя. Новая жизнь. Пока.' },
      { id: 'armor_heavy',    name: 'Тяжёлая броня',       price: 5000, desc: 'Тяжёлая, но живая. Один раз.' },
      { id: 'wiretap',        name: 'Прослушка',           price: 2000, desc: 'Устройство. Слушай, кто что говорит.' }
    ]
  },

  // ═══ АРЕНА ═══
  arena: {
    fights: [
      { id: 'amateur',  name: 'Новичок',   difficulty: 1, prize: 300,  desc: 'Парень с улицы. Руки как лопаты.' },
      { id: 'pro',      name: 'Профи',     difficulty: 3, prize: 1000, desc: 'Бывший боксёр. Бьёт точно.' },
      { id: 'champion', name: 'Чемпион',   difficulty: 5, prize: 3000, desc: 'Гора мышц. Шрамы. Смотрит без эмоций.' },
      { id: 'veteran',  name: 'Ветеран',   difficulty: 4, prize: 2000, desc: 'Хромой, но опытный. Знает все приёмы.' }
    ],
    bets: [500, 1000, 2000]
  }
};
