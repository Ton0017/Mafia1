const Weapons = {
  bodyMultByCategory: {
    pistol:   { head: 2.5, torso: 1.0, leftArm: 0.6, rightArm: 0.6, leftLeg: 0.7, rightLeg: 0.7 },
    revolver: { head: 2.6, torso: 1.0, leftArm: 0.6, rightArm: 0.6, leftLeg: 0.7, rightLeg: 0.7 },
    shotgun:  { head: 2.0, torso: 1.3, leftArm: 0.8, rightArm: 0.8, leftLeg: 0.8, rightLeg: 0.8 },
    smg:      { head: 2.3, torso: 1.0, leftArm: 0.6, rightArm: 0.6, leftLeg: 0.7, rightLeg: 0.7 },
    rifle:    { head: 3.0, torso: 1.1, leftArm: 0.5, rightArm: 0.5, leftLeg: 0.6, rightLeg: 0.6 },
    melee:    { head: 1.5, torso: 1.0, leftArm: 0.8, rightArm: 0.8, leftLeg: 0.8, rightLeg: 0.8 },
  },

  list: [
    // ═══ ПИСТОЛЕТЫ ═══
    { id:'pistol_pm',      name:'ПМ',                category:'pistol', damage:25, accuracy:0.45, range:8,  initiative:5, magazine:8,  reload:2, noise:7,  weight:0.7, basePrice:400,  rarity:1, twoHanded:false, desc:'Надёжный, скучный, дешёвый. Как большинство решений в этом городе.' },
    { id:'pistol_m1911',   name:'M1911',             category:'pistol', damage:32, accuracy:0.5, range:10, initiative:5, magazine:7,  reload:2, noise:8,  weight:1.1, basePrice:700,  rarity:1, twoHanded:false, desc:'Классика. Бьёт сильно, бьёт точно, бьёт громко.' },
    { id:'pistol_glock',   name:'Glock 17',          category:'pistol', damage:26, accuracy:0.52, range:10, initiative:6, magazine:17, reload:2, noise:8,  weight:0.9, basePrice:900,  rarity:2, twoHanded:false, desc:'Много патронов. Мало сантиментов.' },
    { id:'pistol_deagle',  name:'Desert Eagle',      category:'pistol', damage:55, accuracy:0.45, range:12, initiative:4, magazine:7,  reload:3, noise:10, weight:1.5, basePrice:2000, rarity:3, twoHanded:false, desc:'Для тех, кто хочет, чтобы услышали.' },
    { id:'pistol_tt',      name:'ТТ',                category:'pistol', damage:28, accuracy:0.48, range:9,  initiative:5, magazine:8,  reload:2, noise:8,  weight:0.8, basePrice:600,  rarity:1, twoHanded:false, desc:'Простой, злой. Всё, что нужно.' },

    // ═══ РЕВОЛЬВЕРЫ ═══
    { id:'revolver_colt',  name:'Colt Python',       category:'revolver', damage:45, accuracy:0.55, range:12, initiative:5, magazine:6, reload:3, noise:9, weight:1.2, basePrice:1200,  rarity:2, twoHanded:false, desc:'Шесть пуль. Шесть шансов передумать.' },
    { id:'revolver_saa',   name:'Single Action Army', category:'revolver', damage:42, accuracy:0.58, range:14, initiative:4, magazine:6, reload:4, noise:9, weight:1.1, basePrice:900,  rarity:1, twoHanded:false, desc:'Старая школа. Медленная, но точная.' },
    { id:'revolver_nagant',name:'Наган',             category:'revolver', damage:38, accuracy:0.52, range:11, initiative:5, magazine:7, reload:3, noise:8, weight:1.0, basePrice:850,  rarity:1, twoHanded:false, desc:'Русская школа. Тише, чем кажется.' },

    // ═══ ДРОБОВИКИ ═══
    { id:'shotgun_rem',    name:'Remington 870',     category:'shotgun', damage:90, accuracy:0.4, range:6,  initiative:3, magazine:6,  reload:3, noise:10, weight:3.2, basePrice:1600, rarity:2, twoHanded:true,  desc:'Разговор в упор. Не оставляет вопросов.' },
    { id:'shotgun_sawnoff',name:'Обрез',             category:'shotgun', damage:80, accuracy:0.35, range:4,  initiative:4, magazine:2,  reload:2, noise:10, weight:2.0, basePrice:800,  rarity:1, twoHanded:true,  desc:'Незаконно. Эффективно. Удобно под пиджаком.' },
    { id:'shotgun_spas',   name:'SPAS-12',           category:'shotgun', damage:105, accuracy:0.42, range:8,  initiative:4, magazine:8,  reload:3, noise:10, weight:4.0, basePrice:4600, rarity:4, twoHanded:true,  desc:'Аргумент, который не оспаривают.' },

    // ═══ ПП ═══
    { id:'smg_mp5',        name:'MP5',               category:'smg', damage:30, accuracy:0.45, range:15, initiative:5, magazine:30, reload:3, noise:9, weight:2.5, basePrice:2300, rarity:3, twoHanded:true, desc:'Быстро, чисто, профессионально.' },
    { id:'smg_thompson',   name:'Thompson',          category:'smg', damage:35, accuracy:0.42, range:16, initiative:4, magazine:30, reload:4, noise:10, weight:3.5, basePrice:2600, rarity:3, twoHanded:true, desc:'Времена сухого закона. Держи крепче.' },
    { id:'smg_uzi',        name:'Uzi',               category:'smg', damage:25, accuracy:0.4, range:10, initiative:6, magazine:25, reload:2, noise:9, weight:2.0, basePrice:1800, rarity:2, twoHanded:true, desc:'Дешёво, компактно, шумно.' },
    { id:'smg_ppsh',       name:'ППШ-41',            category:'smg', damage:32, accuracy:0.44, range:14, initiative:5, magazine:71, reload:4, noise:10, weight:3.8, basePrice:2100, rarity:2, twoHanded:true, desc:'Много свинца. Мало вопросов.' },

    // ═══ ВИНТОВКИ ═══
    { id:'rifle_mosin',    name:'Мосинка',           category:'rifle', damage:95, accuracy:0.6, range:40, initiative:3, magazine:5,  reload:4, noise:10, weight:4.0, basePrice:2000, rarity:2, twoHanded:true, desc:'Прошлый век. Но пуля не спрашивает дату.' },
    { id:'rifle_m14',      name:'M14',               category:'rifle', damage:70, accuracy:0.58, range:30, initiative:4, magazine:20, reload:3, noise:9, weight:3.5, basePrice:3200, rarity:3, twoHanded:true, desc:'Универсал. Хороша везде, идеальна нигде.' },
    { id:'sniper_svd',     name:'СВД',               category:'rifle', damage:110, accuracy:0.65, range:60, initiative:2, magazine:10, reload:4, noise:10, weight:5.0, basePrice:5800, rarity:4, twoHanded:true, desc:'Для тех, кто любит решать вопросы на расстоянии.' },
    { id:'rifle_ak',       name:'АК-47',             category:'rifle', damage:75, accuracy:0.5, range:25, initiative:5, magazine:30, reload:3, noise:10, weight:3.8, basePrice:3900, rarity:3, twoHanded:true, desc:'Говорит на всех языках. Понятно даже мёртвым.' },

    // ═══ ХОЛОДНОЕ ═══
    { id:'melee_knife',    name:'Нож',               category:'melee', damage:20, accuracy:0.85, range:1, initiative:7, magazine:999, reload:0, noise:1, weight:0.3, basePrice:150, rarity:1, twoHanded:false, desc:'Тихо. Близко. Лично.' },
    { id:'melee_brass',    name:'Кастет',            category:'melee', damage:15, accuracy:0.80, range:1, initiative:8, magazine:999, reload:0, noise:1, weight:0.5, basePrice:100,  rarity:1, twoHanded:false, desc:'Старый способ объяснить, кто прав.' },
    { id:'melee_axe',      name:'Топор',             category:'melee', damage:35, accuracy:0.65, range:1, initiative:4, magazine:999, reload:0, noise:2, weight:2.0, basePrice:250, rarity:1, twoHanded:true, desc:'Не спортивно. Зато убедительно.' },
    { id:'melee_bat',      name:'Бита',              category:'melee', damage:18, accuracy:0.75, range:1, initiative:6, magazine:999, reload:0, noise:2, weight:1.5, basePrice:80,  rarity:1, twoHanded:true, desc:'Грубо. Эффективно. Как всё в этом городе.' },
    { id:'melee_katana',   name:'Катана',            category:'melee', damage:40, accuracy:0.82, range:1, initiative:6, magazine:999, reload:0, noise:2, weight:2.5, basePrice:1600, rarity:3, twoHanded:true, desc:'Красиво. Смертельно. Одно и то же.' },
    { id:'melee_sharp',    name:'Заточка',           category:'melee', damage:12, accuracy:0.88, range:1, initiative:8, magazine:999, reload:0, noise:1, weight:0.2, basePrice:30,  rarity:1, twoHanded:false, desc:'Тюремная классика. Дёшево и сердито.' },
  ],

  // ═══ БРОНЯ ═══
  armor: [
    { id:'armor_none',    name:'Без брони',          defense:0,    weight:0,   basePrice:0,    rarity:1, desc:'Твоя кожа — твоя броня. Плохо.' },
    { id:'armor_leather', name:'Кожаная куртка',     defense:5,    weight:1.0, basePrice:800,  rarity:1, desc:'Не спасёт от пули. Но от ножа — да.' },
    { id:'armor_vest',    name:'Бронежилет',         defense:15,   weight:3.0, basePrice:3200, rarity:3, desc:'Тяжёлый. Жаркий. Живой.' },
    { id:'armor_heavy',   name:'Тяжёлая броня',      defense:25,   weight:6.0, basePrice:6500, rarity:4, desc:'Ты — танк. Медленный, но танк.' },
  ],

  // ═══ ПАТРОНЫ ═══
  ammo: [
    { id:'ammo_pistol',   name:'Патроны 9мм (×20)',    for:['pistol','smg'],  price:100,   rarity:1 },
    { id:'ammo_revolver', name:'Патроны .357 (×12)',   for:['revolver'],      price:150,  rarity:1 },
    { id:'ammo_shotgun',  name:'Патроны 12к (×10)',    for:['shotgun'],       price:250,  rarity:2 },
    { id:'ammo_rifle',    name:'Патроны 7.62 (×20)',   for:['rifle'],         price:400,  rarity:2 },
  ],

  find(id) { return this.list.find(w => w.id === id) || null; },
  findArmor(id) { return this.armor.find(a => a.id === id) || null; },
  random() { return this.list[Math.floor(Math.random() * this.list.length)]; },
  starter(side) { return side === 'police' ? 'pistol_m1911' : 'pistol_pm'; },
  starterArmor(side) { return side === 'police' ? 'armor_leather' : 'armor_none'; },
};
