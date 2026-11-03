const MercData = {
  classes: [
    { id:'shooter',  name:'Стрелок',    desc:'Точный глаз, твёрдая рука.',           stats:{ shooting:8, health:6, loyalty:6, cunning:4, stealth:4 }, basePrice:1200, baseUpkeep:150 },
    { id:'medic',    name:'Медик',      desc:'Тот, кто латает дыры. Иногда — твои.', stats:{ shooting:4, health:7, loyalty:7, cunning:5, stealth:5 }, basePrice:1500, baseUpkeep:180 },
    { id:'driver',   name:'Водитель',   desc:'Уйдёт от погони. Или создаст её.',     stats:{ shooting:5, health:7, loyalty:6, cunning:6, stealth:5 }, basePrice:1000, baseUpkeep:130 },
    { id:'hacker',   name:'Хакер',      desc:'Взламывает не двери. Судьбы.',         stats:{ shooting:3, health:5, loyalty:5, cunning:8, stealth:6 }, basePrice:2000, baseUpkeep:220 },
    { id:'saboteur', name:'Диверсант',  desc:'Оставляет после себя только вопросы.', stats:{ shooting:5, health:6, loyalty:5, cunning:7, stealth:8 }, basePrice:1800, baseUpkeep:200 },
    { id:'thug',     name:'Громила',    desc:'Не нужен пистолет, если есть руки.',   stats:{ shooting:4, health:9, loyalty:6, cunning:3, stealth:3 }, basePrice:800,  baseUpkeep:110 },
  ],

  missionTypes: {
    guard:    { name:'Охрана',          baseTime:12, baseRisk:0.1, basePay:80,  desc:'Стоять. Смотреть. Не спать.' },
    patrol:   { name:'Патруль',         baseTime:8,  baseRisk:0.15,basePay:60,  desc:'Показать, чья это улица.' },
    steal:    { name:'Кража',           baseTime:6,  baseRisk:0.35,basePay:250, desc:'Войти тихо. Выйти богаче.' },
    raid:     { name:'Рейд',            baseTime:5,  baseRisk:0.45,basePay:400, desc:'Громко. Быстро. Эффективно.' },
    sabotage: { name:'Диверсия',        baseTime:4,  baseRisk:0.40,basePay:350, desc:'Оставить врага без козыря.' },
    scout:    { name:'Разведка',        baseTime:3,  baseRisk:0.05,basePay:50,  desc:'Знать. Это уже половина победы.' },
  },

  firstNames: ['Вито', 'Луиджи', 'Сонни', 'Бруно', 'Нино', 'Пеппе', 'Карло', 'Рокко', 'Сальви', 'Дон'],
  femaleNames: ['Кармела', 'Роза', 'Долорес', 'Мария', 'Лусия', 'Джанна', 'Сандра', 'Рита', 'Бонни', 'Клэр'],
  lastNames:  ['Моррелли', 'Страда', 'Риццо', 'Барзини', 'Тонино', 'Руссо', 'Гамбино', 'Бонанно', 'Капуто', 'Фальконе'],

  generateName(isFemale) {
    const pool = isFemale ? this.femaleNames : this.firstNames;
    return Utils.pick(pool) + ' ' + Utils.pick(this.lastNames);
  },
};
