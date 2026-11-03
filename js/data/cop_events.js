// ═══ СОБЫТИЯ С КОПАМИ ═══
const CopEvents = [
  {
    id: 'knock_door',
    title: 'Стук в дверь',
    desc: 'В дверь стучат. Ты видишь в глазок двоих в штатском. У одного рука на кобуре. Они знают, что ты здесь.',
    requires: { minHeat: 50 },
    actions: [
      { id: 'bribe', text: 'Дать взятку', type: 'bribe' },
      { id: 'fight', text: 'Отстреливаться', type: 'fight', enemyCount: 2 },
      { id: 'surrender', text: 'Сдаться', type: 'surrender' }
    ]
  },
  {
    id: 'street_block',
    title: 'Перекрытая улица',
    desc: 'Полицейская машина перегородила переулок. Трое копов в бронежилетах. Один из них смотрит прямо на тебя.',
    requires: { minHeat: 70, minHour: 8, maxHour: 20 },
    actions: [
      { id: 'bribe', text: 'Дать взятку (дорого)', type: 'bribe', priceMod: 2 },
      { id: 'fight', text: 'Прорываться с боем', type: 'fight', enemyCount: 3 },
      { id: 'flee', text: 'Бежать', type: 'flee', fleeChance: 0.4 }
    ]
  },
  {
    id: 'planted_evidence',
    title: 'Подкинули улику',
    desc: 'К тебе подходит знакомый коп. «Парень, тебя хотят закрыть. Подбросили пакет с героином. Либо платишь мне, либо я надеваю на тебя наручники прямо сейчас».',
    requires: { minHeat: 30 },
    actions: [
      { id: 'bribe', text: 'Заплатить', type: 'bribe' },
      { id: 'fight', text: 'Убить его', type: 'fight', enemyCount: 1, extraHeat: 50 },
      { id: 'surrender', text: 'Сдаться', type: 'surrender' }
    ]
  }
];
