const EventData = {
  templates: [
    { id: 'corpse_note', title: 'Труп с запиской',
      desc: 'В переулке — тело. В кармане записка с твоим именем. Дождь смывает чернила, но ты успеваешь прочитать.',
      choices: [
        { text: 'Забрать бумажник', effect: 'corpse_wallet' },
        { text: 'Позвонить в полицию', effect: 'corpse_police' },
        { text: 'Уйти. Не твоё дело.', effect: 'corpse_ignore' },
      ] },
    { id: 'witness', title: 'Свидетель',
      desc: 'Кто-то видел твоё последнее дело. Он стоит у стены, курит и смотрит прямо на тебя.',
      choices: [
        { text: 'Заплатить ($300)', effect: 'witness_pay', requires: { money: 300 } },
        { text: 'Запугать', effect: 'witness_intimidate' },
        { text: 'Убить', effect: 'witness_kill' },
      ] },
    { id: 'overdose_friend', title: 'Передозировка',
      desc: 'Знакомый в баре принял лишнего. Он синеет на глазах. Никто не подходит.',
      choices: [
        { text: 'Помочь (нужен медик)', effect: 'overdose_help' },
        { text: 'Уйти', effect: 'overdose_leave' },
      ] },
    { id: 'torture', title: 'Пытки',
      desc: 'Твои люди поймали стукача. Он уже не кричит. Они ждут тебя — посмотреть.',
      choices: [
        { text: 'Присутствовать', effect: 'torture_watch' },
        { text: 'Уйти', effect: 'torture_leave' },
      ] },
    { id: 'rats', title: 'Крысы',
      desc: 'На складе — тело твоего человека. Пальцы отрезаны. Рядом — дохлая крыса. Это послание.',
      choices: [
        { text: 'Похоронить', effect: 'rats_bury' },
        { text: 'Найти виновного', effect: 'rats_hunt' },
      ] },
    { id: 'moneylender', title: 'Ростовщик',
      desc: 'Он ждёт тебя у входа. «Долг. Или работа. Ты выберешь сам».',
      choices: [
        { text: 'Заплатить ($500)', effect: 'lender_pay', requires: { money: 500 } },
        { text: 'Согласиться на работу', effect: 'lender_work' },
      ] },
    { id: 'bad_water', title: 'Гнилая вода',
      desc: 'Ты пьёшь из крана. Вкус странный. Через час — тошнота.',
      choices: [
        { text: 'Терпеть', effect: 'water_endure' },
        { text: 'Вызвать врача ($200)', effect: 'water_doctor', requires: { money: 200 } },
      ] },
    { id: 'child_street', title: 'Ребёнок на районе',
      desc: 'Мальчишка лет десяти пытается украсть у тебя бумажник. Он голоден. Ты видишь это.',
      choices: [
        { text: 'Дать денег ($50)', effect: 'child_give', requires: { money: 50 } },
        { text: 'Отпустить', effect: 'child_ignore' },
        { text: 'Сдать копам', effect: 'child_police' },
      ] },
    { id: 'dog_hand', title: 'Собака с рукой',
      desc: 'Бродячий пёс тащит в зубах человеческую руку. Он смотрит на тебя. Ждёт.',
      choices: [
        { text: 'Прогнать', effect: 'dog_chase' },
        { text: 'Проследить за ним', effect: 'dog_follow' },
      ] },
    { id: 'whispers', title: 'Шёпот в стенах',
      desc: 'Ты слышишь голоса. Они говорят о тебе. Ты один в комнате.',
      choices: [
        { text: 'Слушать', effect: 'whispers_listen' },
        { text: 'Заткнуть уши', effect: 'whispers_ignore' },
      ] },
    { id: 'rot', title: 'Гниль',
      desc: 'В подвале пахнет так, что ты не решаешься спуститься. Что-то там есть.',
      choices: [
        { text: 'Спуститься', effect: 'rot_enter' },
        { text: 'Заколотить дверь', effect: 'rot_seal' },
      ] },
    { id: 'priest', title: 'Священник',
      desc: 'Человек в рясе останавливает тебя. «Я знаю, что ты сделал. Бог знает тоже. Но я — здесь».',
      choices: [
        { text: 'Слушать', effect: 'priest_listen' },
        { text: 'Уйти', effect: 'priest_leave' },
      ] },
  ],

  // Эффекты (применяются в EventsSystem)
  effects: {
    corpse_wallet:    { money: 120, sanity: -3,  log: 'Ты забираешь деньги. Он уже не против.', tone: 'warn' },
    corpse_police:    { heat: -5, sanity: -1,   log: 'Копы приехали. Тебя даже не спросили.', tone: 'info' },
    corpse_ignore:    { sanity: -1,             log: 'Ты уходишь. Ноги сами несут.', tone: 'info' },

    witness_pay:      { money: -300, heat: -5,  log: 'Он берёт деньги и исчезает.', tone: 'good' },
    witness_intimidate:{ sanity: -5, stress: +10, log: 'Он бледнеет. Кивает. Уходит.', tone: 'warn' },
    witness_kill:     { heat: +10, sanity: -12, kills: +1, money: 50, log: 'Он падает. Ты смотришь. Потом уходишь.', tone: 'bad' },

    overdose_help:    { money: -200, sanity: +5, log: 'Врач приезжает. Он выживет. Может быть.', tone: 'good' },
    overdose_leave:   { sanity: -8, log: 'Ты уходишь. Крики за спиной стихают.', tone: 'bad' },

    torture_watch:    { sanity: -15, stress: +20, rep: +3, log: 'Ты смотришь. Потом киваешь. Работа сделана.', tone: 'bad' },
    torture_leave:    { sanity: -5,  log: 'Ты не хочешь это видеть. Уходишь.', tone: 'warn' },

    rats_bury:        { sanity: -5, money: -100, log: 'Ты хоронишь его сам. Лопата тяжёлая.', tone: 'warn' },
    rats_hunt:        { heat: +5, sanity: -3, rep: +2, log: 'Ты начинаешь искать. Кто-то заплатит.', tone: 'warn' },

    lender_pay:       { money: -500, log: 'Он пересчитывает. Уходит молча.', tone: 'good' },
    lender_work:      { sanity: -20, money: +800, heat: +15, log: 'Ты делаешь, что он просит. Не помнишь, что именно.', tone: 'bad' },

    water_endure:     { hp: -15, sanity: -3, log: 'Тошнота отступает к утру. Ты выжил.', tone: 'bad' },
    water_doctor:     { money: -200, hp: +10, log: 'Врач качает головой. Промывает желудок.', tone: 'good' },

    child_give:       { money: -50, sanity: +5, rep: +2, log: 'Он берёт и убегает. Не оглядывается.', tone: 'good' },
    child_ignore:     { sanity: -2, log: 'Ты идёшь дальше. Ноги ватные.', tone: 'info' },
    child_police:     { rep: -3, sanity: -3, heat: -2, log: 'Копы забирают его. Он смотрит на тебя.', tone: 'bad' },

    dog_chase:        { sanity: -2, log: 'Пёс убегает. Рука остаётся на асфальте.', tone: 'warn' },
    dog_follow:       { sanity: -8, log: 'Ты находишь тело. Свежее. Ты запоминаешь место.', tone: 'bad' },

    whispers_listen:  { sanity: -8, stress: +15, log: 'Голоса говорят громче. Ты начинаешь понимать.', tone: 'bad' },
    whispers_ignore:  { stress: +5, log: 'Ты закрываешь уши. Шёпот не прекращается.', tone: 'warn' },

    rot_enter:        { sanity: -15, hp: -10, log: 'Ты видишь то, что не должен. Запах не уходит неделю.', tone: 'bad' },
    rot_seal:         { money: -50, sanity: -2, log: 'Ты заколачиваешь дверь. Но не забываешь.', tone: 'info' },

    priest_listen:    { sanity: +8, stress: -10, log: 'Ты слушаешь. Странно, но становится легче.', tone: 'good' },
    priest_leave:     { sanity: -2, log: 'Ты уходишь. Он смотрит в спину.', tone: 'info' },
  },
};
