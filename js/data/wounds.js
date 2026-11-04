const WoundData = {
  // ═══ СОСТОЯНИЯ ═══
  conditions: {
    bleeding: {
      name: 'Кровотечение',
      icon: '*',
      desc: 'Кровь не останавливается. Ты слабеешь.',
      tickEffect: { hpLoss: 3, part: 'torso' },
      statPenalty: { strength: -2, endurance: -2 },
      treatWith: 'bandages',
      treatTime: 1,
      healDays: 0,
      treatLog: 'Ты перетягиваешь рану. Кровь останавливается — пока.',
    },
    fracture: {
      name: 'Перелом',
      icon: '#',
      desc: 'Кость сломана. Конечность почти не слушается.',
      tickEffect: { hpLoss: 0 },
      statPenalty: { agility: -5, strength: -3, shooting: -3 },
      partPenalty: true, // конечность «мертва» для боя
      treatWith: 'splint',
      treatTime: 2,
      healDays: 3,
      treatLog: 'Ты накладываешь шину. Боль дикая, но кость встанет.',
    },
    infected: {
      name: 'Инфекция',
      icon: '†',
      desc: 'Рана гниёт. Жар. Тошнота.',
      tickEffect: { hpLoss: 4, part: 'torso' },
      statPenalty: { endurance: -4, charisma: -2, shooting: -2 },
      treatWith: 'antibiotics',
      treatTime: 1,
      healDays: 2,
      treatLog: 'Антибиотики. Горечь во рту. Может, выживешь.',
    },
    concussion: {
      name: 'Контузия',
      icon: '%',
      desc: 'Звон в ушах. Всё двоится.',
      tickEffect: { hpLoss: 0 },
      statPenalty: { shooting: -5, agility: -3, charisma: -2 },
      treatWith: null, // только время
      treatTime: 0,
      healDays: 1,
      treatLog: 'Нужен покой. И тишина.',
    },
    burn: {
      name: 'Ожог',
      icon: '^',
      desc: 'Кожа стянута, мясо красное.',
      tickEffect: { hpLoss: 2, part: 'torso' },
      statPenalty: { charisma: -3, endurance: -2 },
      treatWith: 'bandages',
      treatTime: 1,
      healDays: 2,
      treatLog: 'Ты накладываешь повязку. Пахнет палёным.',
    },
    shrapnel: {
      name: 'Осколки',
      icon: '&',
      desc: 'Металл в теле. Каждое движение — боль.',
      tickEffect: { hpLoss: 1 },
      statPenalty: { agility: -2, endurance: -2 },
      treatWith: 'bandages',
      treatTime: 2,
      healDays: 1,
      treatLog: 'Ты вытаскиваешь осколки. Некоторые — слишком глубоко.',
    },
  },

  // ═══ ЛЕЧЕНИЕ ═══
  medicine: {
    bandages:    { name: 'Бинт',           price: 50,  healsHp: 5, treatConditions: ['bleeding', 'burn', 'shrapnel'], desc: 'Останавливает кровь, прикрывает рану. На один раз.' },
    tourniquet:  { name: 'Жгут',           price: 120, healsHp: 0,  treatConditions: ['bleeding'], healStopsBleed: true, desc: 'Останавливает кровотечение немедленно. Но конечность может отмереть через сутки.' },
    splint:      { name: 'Шина',           price: 120, healsHp: 3,  treatConditions: ['fracture'], desc: 'Фиксирует кость. Больно, но необходимо.' },
    painkillers: { name: 'Обезболивающее', price: 80,  healsHp: 0,  painkiller: 50, duration: 3, desc: 'Убирает боль. Не лечит. Не превышай дозу.' },
    antibiotics: { name: 'Антибиотики',    price: 200, healsHp: 8, treatConditions: ['infected'], desc: 'Убивает заразу. Медленно.' },
    adrenaline:  { name: 'Адреналин',      price: 300, healsHp: 0,  combatBoost: { initiative: +30, duration: 1 }, sanityCost: 15, desc: 'Сердце колотится. Страх уходит. Ненадолго.' },
    medkit:      { name: 'Аптечка',        price: 400, healsHp: 15, treatAll: true, desc: 'Полный набор. Дорого. Надёжно.' },
    vitamins:    { name: 'Витамины',       price: 150, healsHp: 0,  energyBoost: 15, desc: 'Поддержка. Ненадолго.' },
    stimulant_med: { name: 'Медицинский стимулятор', price: 250, healsHp: 0, energyBoost: 30, sanityCost: 5, desc: 'Для тех, кто не может позволить себе устать.' },
    detox:       { name: 'Детокс-капельница', price: 2000, healsHp: -20, desc: 'Выводит токсины из крови. Больно. Дорого. Эффективно — сбрасывает все зависимости.' },
  },

  // ═══ КАК ПОЛУЧИТЬ ТРАВМУ (шансы при уроне) ═══
  // При уроне в часть тела, проверяем шанс травмы
  injuryChance: {
    head:     { concussion: 0.20, bleeding: 0.10 },
    torso:    { bleeding: 0.25, infected: 0.05 },
    leftArm:  { fracture: 0.15, bleeding: 0.15 },
    rightArm: { fracture: 0.15, bleeding: 0.15 },
    leftLeg:  { fracture: 0.20, bleeding: 0.10 },
    rightLeg: { fracture: 0.20, bleeding: 0.10 },
  },

  // Порог урона для травмы — если урон меньше, шанс = 0
  injuryMinDamage: 20,
};
