// ═══ РАБОТА ═══
const WorkData = [
  {
    id: 'docker',
    name: 'Грузчик в порту',
    desc: 'Таскать ящики с утра до вечера. Спина отваливается, но платят наличными.',
    pay: 80,
    hours: 4,
    energyCost: 25,
    stressChange: -5,
    heatChange: 0,
    repChange: 0,
    injuryChance: 0.05,
    log: 'Ты таскаешь ящики. Пахнет рыбой и потом. Руки в ссадинах.'
  },
  {
    id: 'taxi',
    name: 'Таксист',
    desc: 'Возить пьяных и странных по ночному городу. Иногда — интересные пассажиры.',
    pay: 120,
    hours: 3,
    energyCost: 20,
    stressChange: -3,
    heatChange: 0,
    repChange: 0,
    injuryChance: 0.02,
    specialEvent: 'taxi_stranger',
    log: 'Ты крутишь баранку. Город проплывает за окном. Кто-то садится, кто-то выходит.'
  },
  {
    id: 'courier',
    name: 'Курьер',
    desc: 'Разносить пакеты по адресам. Не задавать вопросов. Не смотреть внутрь.',
    pay: 60,
    hours: 2,
    energyCost: 15,
    stressChange: -2,
    heatChange: 0,
    repChange: 1,
    injuryChance: 0.01,
    log: 'Ты разносишь пакеты. Адреса странные. Люди ещё страннее.'
  },
  {
    id: 'bouncer',
    name: 'Вышибала в баре',
    desc: 'Стоять у двери. Смотреть. Если кто-то буянит — выкидывать. Просто, но платят.',
    pay: 100,
    hours: 3,
    energyCost: 30,
    stressChange: -5,
    heatChange: 3,
    repChange: 3,
    injuryChance: 0.08,
    log: 'Ты стоишь у двери. Кто-то буянит. Ты выкидываешь. Кто-то ещё буянит.'
  }
];
