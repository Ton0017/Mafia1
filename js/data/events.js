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

    // ═══ БЛОК 1: ТРУПЫ ═══
    { id: 'body_alley', title: 'Труп в переулке', desc: 'Тело молодого парня. Дырка в затылке. Бумажник на месте — значит, это не ограбление. Кто-то хотел, чтобы ты это увидел.', choices: [
      { text: 'Обыскать', effect: 'body_alley_search' },
      { text: 'Уйти', effect: 'body_alley_leave' },
      { text: 'Вызвать копов', effect: 'body_alley_cops' }
    ] },
    { id: 'body_river', title: 'Утопленник', desc: 'Река выбросила тело на берег. Оно пролежало там дня три. Лицо не узнать, но на руке — татуировка одной из Семей.', choices: [
      { text: 'Сообщить Семье', effect: 'body_river_family' },
      { text: 'Забрать кольцо', effect: 'body_river_ring' },
      { text: 'Просто уйти', effect: 'body_river_leave' }
    ] },
    { id: 'body_car', title: 'Машина с телом', desc: 'На стоянке стоит Кадиллак. Внутри — мужчина в костюме. Он сидит ровно, будто уснул. Но он не спит.', choices: [
      { text: 'Обыскать салон', effect: 'body_car_search' },
      { text: 'Сжечь машину', effect: 'body_car_burn' },
      { text: 'Не трогать', effect: 'body_car_leave' }
    ] },
    { id: 'body_hanging', title: 'Висельник', desc: 'На фонаре висит человек. Табличка на груди: "Стукач". Это твоя улица. Это твоя проблема.', choices: [
      { text: 'Снять тело', effect: 'body_hanging_cut' },
      { text: 'Найти, кто это сделал', effect: 'body_hanging_hunt' },
      { text: 'Не вмешиваться', effect: 'body_hanging_ignore' }
    ] },
    { id: 'body_burn', title: 'Сожжённое тело', desc: 'Пепелище в заброшенном доме. Среди золы — обугленный труп. Кто-то очень старался, чтобы его не опознали.', choices: [
      { text: 'Поискать улики', effect: 'body_burn_evidence' },
      { text: 'Забрать золото с зубов', effect: 'body_burn_gold' },
      { text: 'Уйти', effect: 'body_burn_leave' }
    ] },
    { id: 'body_two', title: 'Два трупа', desc: 'На складе — двое. Оба с пистолетами. Оба мертвы. Между ними — открытый чемодан с деньгами. Кажется, они убили друг друга.', choices: [
      { text: 'Забрать деньги', effect: 'body_two_money' },
      { text: 'Обыскать карманы', effect: 'body_two_search' },
      { text: 'Вызвать копов анонимно', effect: 'body_two_cops' }
    ] },
    { id: 'body_grave', title: 'Свежая могила', desc: 'На кладбище земля ещё не улеглась. Кто-то закопал что-то недавно. И это "что-то" вряд ли мертвец в гробу.', choices: [
      { text: 'Раскопать', effect: 'body_grave_dig' },
      { text: 'Пометить место', effect: 'body_grave_mark' },
      { text: 'Уйти', effect: 'body_grave_leave' }
    ] },
    { id: 'body_cops', title: 'Коп над трупом', desc: 'Патрульный стоит над телом. Он тебя не заметил. Пока. Что он делает здесь в три часа ночи?', choices: [
      { text: 'Подойти', effect: 'body_cops_approach' },
      { text: 'Проследить', effect: 'body_cops_follow' },
      { text: 'Уйти', effect: 'body_cops_leave' }
    ] },
    { id: 'body_msg', title: 'Сообщение на стене', desc: 'Кто-то написал кровью на кирпичной стене: "СЛЕДУЮЩИЙ — ТЫ". Почерк тебе незнаком. Но он знает, где ты живёшь.', choices: [
      { text: 'Стереть надпись', effect: 'body_msg_erase' },
      { text: 'Оставить как есть', effect: 'body_msg_keep' },
      { text: 'Искать того, кто написал', effect: 'body_msg_hunt' }
    ] },
    { id: 'body_familiar', title: 'Знакомый в гробу', desc: 'Похороны. Закрытый гроб. Ты знаешь, кто внутри — это был твой человек. Но кто-то настаивал на закрытом гробе. Почему?', choices: [
      { text: 'Открыть гроб', effect: 'body_familiar_open' },
      { text: 'Спросить у семьи', effect: 'body_familiar_ask' },
      { text: 'Уйти тихо', effect: 'body_familiar_leave' }
    ] },

    // ═══ БЛОК 1: КОПЫ ═══
    { id: 'cop_pullover', title: 'Коп просит остановиться', desc: 'Ты идёшь по улице. Патрульная машина останавливается. Коп выходит. "Документы, парень".', choices: [
      { text: 'Дать взятку', effect: 'cop_pullover_bribe' },
      { text: 'Убежать', effect: 'cop_pullover_run' },
      { text: 'Стоять спокойно', effect: 'cop_pullover_calm' }
    ] },
    { id: 'cop_raid_early', title: 'Облава на рассвете', desc: 'В пять утра стук в дверь. Не твоя квартира. Но и не чужая. Копы в соседнем доме. У тебя минута.', choices: [
      { text: 'Выпрыгнуть в окно', effect: 'cop_raid_early_jump' },
      { text: 'Спрятаться в подвале', effect: 'cop_raid_early_hide' },
      { text: 'Открыть дверь копам', effect: 'cop_raid_early_open' }
    ] },
    { id: 'cop_undercover', title: 'Под прикрытием', desc: 'В бар зашёл новый человек. Слишком чисто одет. Слишком внимательно смотрит. Кажется, он коп. Но как это доказать?', choices: [
      { text: 'Проверить его', effect: 'cop_undercover_check' },
      { text: 'Уйти из бара', effect: 'cop_undercover_leave' },
      { text: 'Подкупить его', effect: 'cop_undercover_bribe' }
    ] },
    { id: 'cop_detective', title: 'Детектив в участке', desc: 'Тебя вызывают "поговорить". Не арестовывают. Просто поговорить. В комнате — двое. Один ведёт протокол. Второй смотрит на тебя.', choices: [
      { text: 'Молчать', effect: 'cop_detective_silent' },
      { text: 'Рассказать всё', effect: 'cop_detective_talk' },
      { text: 'Потребовать адвоката', effect: 'cop_detective_lawyer' }
    ] },
    { id: 'cop_tip', title: 'Анонимный звонок', desc: 'Телефон звонит. Голос говорит: "Завтра облава на складе в порту. Если хочешь сохранить товар — вывези сегодня". Слишком удобно?', choices: [
      { text: 'Вывезти товар', effect: 'cop_tip_move' },
      { text: 'Игнорировать', effect: 'cop_tip_ignore' },
      { text: 'Проверить, кто звонил', effect: 'cop_tip_check' }
    ] },
    { id: 'cop_bribe_offer', title: 'Коп хочет денег', desc: 'Патрульный подходит к тебе на улице. "У тебя есть что-то, что меня интересует. И это не в кармане". Он улыбается.', choices: [
      { text: 'Заплатить', effect: 'cop_bribe_offer_pay' },
      { text: 'Отказаться', effect: 'cop_bribe_offer_refuse' },
      { text: 'Пригрозить', effect: 'cop_bribe_offer_threat' }
    ] },
    { id: 'cop_evidence', title: 'Улика в участке', desc: 'В полиции есть папка с твоим именем. Кто-то из копов её видел. Он предлагает "помочь" за деньги.', choices: [
      { text: 'Заплатить', effect: 'cop_evidence_pay' },
      { text: 'Убить копа', effect: 'cop_evidence_kill' },
      { text: 'Найти другого копа', effect: 'cop_evidence_other' }
    ] },
    { id: 'cop_raid_heavy', title: 'Тяжёлая облава', desc: 'Пять машин у здания. ОМОН. Собаки. Это за тобой. У тебя есть минута, чтобы решить, что делать.', choices: [
      { text: 'Сдаться', effect: 'cop_raid_heavy_surrender' },
      { text: 'Прорываться с боем', effect: 'cop_raid_heavy_fight' },
      { text: 'Скрыться в дыму', effect: 'cop_raid_heavy_smoke' }
    ] },
    { id: 'cop_leader', title: 'Начальник полиции', desc: 'Тебя приглашают на встречу. В кабинете — сам начальник. "Я не арестовываю тебя, потому что ты мне полезен. Пока".', choices: [
      { text: 'Согласиться работать', effect: 'cop_leader_work' },
      { text: 'Отказаться', effect: 'cop_leader_refuse' },
      { text: 'Заплатить ему', effect: 'cop_leader_bribe' }
    ] },
    { id: 'cop_truck_stop', title: 'Проверка грузовика', desc: 'Твой грузовик останавливают на посту. Коп обходит его кругом. Он знает, что внутри.', choices: [
      { text: 'Заплатить', effect: 'cop_truck_stop_pay' },
      { text: 'Уехать с боем', effect: 'cop_truck_stop_fight' },
      { text: 'Сдаться', effect: 'cop_truck_stop_surrender' }
    ] },

    // ═══ БЛОК 1: ДЕНЬГИ ═══
    { id: 'money_briefcase', title: 'Чемодан с деньгами', desc: 'В заброшенном доме ты находишь чемодан. Внутри — пачки наличных. Много. Слишком много. На крышке — инициалы.', choices: [
      { text: 'Забрать', effect: 'money_briefcase_take' },
      { text: 'Оставить', effect: 'money_briefcase_leave' },
      { text: 'Найти хозяина', effect: 'money_briefcase_owner' }
    ] },
    { id: 'money_poker', title: 'Странная игра', desc: 'Тебя приглашают в закрытый клуб. Игра в покер. Все игроки — с большими деньгами. Они хотят, чтобы ты сел за стол.', choices: [
      { text: 'Играть', effect: 'money_poker_play' },
      { text: 'Отказаться', effect: 'money_poker_refuse' },
      { text: 'Спросить правила', effect: 'money_poker_ask' }
    ] },
    { id: 'money_debt', title: 'Долг из прошлого', desc: 'Человек, которого ты не помнишь, требует долг. Говорит, ты должен ему ещё с прошлой жизни. Сумма — немалая.', choices: [
      { text: 'Заплатить', effect: 'money_debt_pay' },
      { text: 'Убить его', effect: 'money_debt_kill' },
      { text: 'Игнорировать', effect: 'money_debt_ignore' }
    ] },
    { id: 'money_laundry', title: 'Прачечная', desc: 'Кто-то предлагает "отмыть" твои деньги через несколько бизнесов. Комиссия — 20%. Гарантии — никаких.', choices: [
      { text: 'Согласиться', effect: 'money_laundry_accept' },
      { text: 'Отказаться', effect: 'money_laundry_refuse' },
      { text: 'Узнать подробности', effect: 'money_laundry_ask' }
    ] },
    { id: 'money_tip', title: 'Наводка на сейф', desc: 'Человек в баре шепчет: "У одного типа в центре сейф с деньгами. Его нет дома всю неделю". Он смотрит на тебя.', choices: [
      { text: 'Проверить', effect: 'money_tip_check' },
      { text: 'Отказаться', effect: 'money_tip_refuse' },
      { text: 'Допросить его', effect: 'money_tip_interrogate' }
    ] },
    { id: 'money_scam', title: 'Слишком выгодная сделка', desc: 'Тебе предлагают вложить деньги в "верное дело". Возврат в два раза за неделю. Всё выглядит слишком хорошо.', choices: [
      { text: 'Вложить', effect: 'money_scam_invest' },
      { text: 'Отказаться', effect: 'money_scam_refuse' },
      { text: 'Узнать побольше', effect: 'money_scam_investigate' }
    ] },
    { id: 'money_cash', title: 'Мешок наличных', desc: 'На пороге твоей двери — мешок с деньгами. Без записки. Без имени. Кто-то даёт тебе деньги. И этот кто-то не хочет быть узнанным.', choices: [
      { text: 'Забрать', effect: 'money_cash_take' },
      { text: 'Выбросить', effect: 'money_cash_throw' },
      { text: 'Найти отправителя', effect: 'money_cash_trace' }
    ] },
    { id: 'money_stolen', title: 'Украденные деньги', desc: 'Ты находишь пачку денег. На купюрах — свежие следы крови. Это не просто деньги. Это чей-то долг.', choices: [
      { text: 'Взять', effect: 'money_stolen_take' },
      { text: 'Оставить', effect: 'money_stolen_leave' },
      { text: 'Спросить у знающих', effect: 'money_stolen_ask' }
    ] },
    { id: 'money_business', title: 'Бизнес в аренду', desc: 'Владелец одного из бизнесов хочет сдать дело "под крышу". Он платит вперёд. Но у него проблемы с полицией.', choices: [
      { text: 'Согласиться', effect: 'money_business_accept' },
      { text: 'Отказаться', effect: 'money_business_refuse' },
      { text: 'Проверить его', effect: 'money_business_check' }
    ] },
    { id: 'money_counterfeit', title: 'Фальшивые деньги', desc: 'Ты получаешь деньги за работу. Купюры выглядят нормально, но что-то не так. Ты чувствуешь это на пальцах.', choices: [
      { text: 'Принять', effect: 'money_counterfeit_accept' },
      { text: 'Отказаться', effect: 'money_counterfeit_refuse' },
      { text: 'Найти, кто их делает', effect: 'money_counterfeit_trace' }
    ] },

    // ═══ БЛОК 1: ЖЕНЩИНЫ ═══
    { id: 'women_flirt', title: 'Женщина в баре', desc: 'Она смотрит на тебя. Долго. Слишком долго. Потом улыбается. Подойти или нет?', choices: [
      { text: 'Подойти', effect: 'women_flirt_approach' },
      { text: 'Уйти', effect: 'women_flirt_leave' },
      { text: 'Наблюдать', effect: 'women_flirt_watch' }
    ] },
    { id: 'women_letter', title: 'Письмо от неё', desc: 'Ты получаешь письмо. Почерк женский. Без подписи. Внутри — фото и адрес. Что она хочет?', choices: [
      { text: 'Пойти по адресу', effect: 'women_letter_go' },
      { text: 'Сжечь письмо', effect: 'women_letter_burn' },
      { text: 'Игнорировать', effect: 'women_letter_ignore' }
    ] },
    { id: 'women_ex', title: 'Бывшая на пороге', desc: 'Она стоит на пороге. Платье мокрое от дождя. Она не говорит, зачем пришла. Просто стоит.', choices: [
      { text: 'Впустить', effect: 'women_ex_enter' },
      { text: 'Закрыть дверь', effect: 'women_ex_close' },
      { text: 'Спросить, что нужно', effect: 'women_ex_ask' }
    ] },
    { id: 'women_cry', title: 'Слёзы в темноте', desc: 'Ты слышишь плач в переулке. Женщина. Она сидит на ступеньках и плачет. Кто-то обидел её. Или она сама.', choices: [
      { text: 'Подойти', effect: 'women_cry_approach' },
      { text: 'Пройти мимо', effect: 'women_cry_leave' },
      { text: 'Позвать на помощь', effect: 'women_cry_call' }
    ] },
    { id: 'women_gift', title: 'Подарок', desc: 'Кто-то оставил на твоём столе подарок. Шёлковый платок. Женский. С запиской: "Спасибо за прошлую ночь". Ты не помнишь прошлой ночи.', choices: [
      { text: 'Найти её', effect: 'women_gift_find' },
      { text: 'Выбросить', effect: 'women_gift_throw' },
      { text: 'Спросить у бармена', effect: 'women_gift_ask' }
    ] },
    { id: 'women_jealous', title: 'Ревность', desc: 'Одна из твоих женщин узнала о другой. Она ждёт тебя у входа. В её глазах — не гнев. Хуже.', choices: [
      { text: 'Поговорить', effect: 'women_jealous_talk' },
      { text: 'Уйти', effect: 'women_jealous_leave' },
      { text: 'Соврать', effect: 'women_jealous_lie' }
    ] },
    { id: 'women_danger', title: 'Она в опасности', desc: 'Звонок. Голос — её. "Они у меня. Приходи". И гудки. Ты знаешь адрес. Ты знаешь, кто это.', choices: [
      { text: 'Броситься на помощь', effect: 'women_danger_rush' },
      { text: 'Вызвать копов', effect: 'women_danger_cops' },
      { text: 'Собрать людей', effect: 'women_danger_crew' }
    ] },
    { id: 'women_proposal', title: 'Предложение', desc: 'Она хочет большего. Не просто ночь. Не просто свидание. Она хочет быть с тобой. Навсегда. Это пугает.', choices: [
      { text: 'Согласиться', effect: 'women_proposal_yes' },
      { text: 'Отказаться', effect: 'women_proposal_no' },
      { text: 'Попросить время', effect: 'women_proposal_time' }
    ] },
    { id: 'women_witness', title: 'Она видела', desc: 'Одна из женщин видела, как ты убивал. Она молчит. Но её глаза говорят: "Я знаю". Что делать?', choices: [
      { text: 'Заплатить за молчание', effect: 'women_witness_pay' },
      { text: 'Пригрозить', effect: 'women_witness_threat' },
      { text: 'Довериться ей', effect: 'women_witness_trust' }
    ] },
    { id: 'women_enemy', title: 'Женщина врага', desc: 'Жена твоего врага хочет встретиться. Наедине. Она говорит: "Я знаю всё. И хочу помочь".', choices: [
      { text: 'Встретиться', effect: 'women_enemy_meet' },
      { text: 'Отказаться', effect: 'women_enemy_refuse' },
      { text: 'Проверить её', effect: 'women_enemy_check' }
    ] },

    // ═══ БЛОК 1: ПАРАНОЙЯ ═══
    { id: 'paranoia_follow', title: 'Хвост', desc: 'Ты замечаешь: за тобой идут. Один человек в сером плаще. Уже третий квартал. Он не скрывается.', choices: [
      { text: 'Развернуться и напасть', effect: 'paranoia_follow_attack' },
      { text: 'Петлять по улицам', effect: 'paranoia_follow_lose' },
      { text: 'Завести в ловушку', effect: 'paranoia_follow_trap' }
    ] },
    { id: 'paranoia_mirror', title: 'Отражение', desc: 'В зеркале — ты. Но что-то не так. Отражение двигается чуть медленнее. Или это твои нервы?', choices: [
      { text: 'Разбить зеркало', effect: 'paranoia_mirror_break' },
      { text: 'Отвернуться', effect: 'paranoia_mirror_ignore' },
      { text: 'Смотреть дальше', effect: 'paranoia_mirror_stare' }
    ] },
    { id: 'paranoia_voice', title: 'Голос в голове', desc: 'Ты слышишь голос. Он говорит: "Они все знают. Они все хотят тебя убить". Голос звучит как твой.', choices: [
      { text: 'Слушать', effect: 'paranoia_voice_listen' },
      { text: 'Заглушить алкоголем', effect: 'paranoia_voice_drink' },
      { text: 'Игнорировать', effect: 'paranoia_voice_ignore' }
    ] },
    { id: 'paranoia_shadow', title: 'Тень в окне', desc: 'Напротив твоего дома — тень в окне. Она появляется каждую ночь. Исчезает к утру. Кто это?', choices: [
      { text: 'Пойти и проверить', effect: 'paranoia_shadow_check' },
      { text: 'Закрыть шторы', effect: 'paranoia_shadow_hide' },
      { text: 'Наблюдать', effect: 'paranoia_shadow_watch' }
    ] },
    { id: 'paranoia_note', title: 'Записка', desc: 'Ты находишь записку в кармане. Ты не клал её туда. Почерк — твой. "Беги. Они уже здесь".', choices: [
      { text: 'Искать, кто подложил', effect: 'paranoia_note_find' },
      { text: 'Бежать', effect: 'paranoia_note_run' },
      { text: 'Игнорировать', effect: 'paranoia_note_ignore' }
    ] },
    { id: 'paranoia_double', title: 'Двойник', desc: 'Кто-то похожий на тебя ходит по городу. Он говорит твоим голосом. Он делает то, что ты бы сделал.', choices: [
      { text: 'Найти его', effect: 'paranoia_double_find' },
      { text: 'Убить его', effect: 'paranoia_double_kill' },
      { text: 'Не обращать внимания', effect: 'paranoia_double_ignore' }
    ] },
    { id: 'paranoia_radio', title: 'Радио', desc: 'Радио включилось само. Играет музыка. Потом — голос: "Мы знаем, что ты слушаешь". Это шутка?', choices: [
      { text: 'Выключить', effect: 'paranoia_radio_off' },
      { text: 'Слушать дальше', effect: 'paranoia_radio_listen' },
      { text: 'Разбить радио', effect: 'paranoia_radio_break' }
    ] },
    { id: 'paranoia_knock', title: 'Стук ночью', desc: 'В дверь стучат. Три раза. Потом тишина. Потом снова. В глазок никого не видно.', choices: [
      { text: 'Открыть', effect: 'paranoia_knock_open' },
      { text: 'Игнорировать', effect: 'paranoia_knock_ignore' },
      { text: 'Взять оружие', effect: 'paranoia_knock_arm' }
    ] },
    { id: 'paranoia_footsteps', title: 'Шаги за спиной', desc: 'Ты слышишь шаги. Они синхронны с твоими. Ты останавливаешься — они останавливаются. Ты идёшь — идут они.', choices: [
      { text: 'Резко обернуться', effect: 'paranoia_footsteps_turn' },
      { text: 'Ускорить шаг', effect: 'paranoia_footsteps_run' },
      { text: 'Зайти в бар', effect: 'paranoia_footsteps_hide' }
    ] },
    { id: 'paranoia_wall', title: 'Надпись на стене', desc: 'На стене твоей квартиры — надпись. Ты не писал её. И не впускал никого. "ОНИ ЗДЕСЬ".', choices: [
      { text: 'Стереть', effect: 'paranoia_wall_erase' },
      { text: 'Проверить квартиру', effect: 'paranoia_wall_search' },
      { text: 'Переехать', effect: 'paranoia_wall_move' }
    ] },

    // ═══ БЛОК 2: БОЛЕЗНИ И ТЕЛО ═══
    { id: 'ill_fever', title: 'Жар', desc: 'Ты просыпаешься в холодном поту. Горло горит, голова раскалывается. Это не простуда. Это что-то хуже.', choices: [
      { text: 'Перетерпеть', effect: 'ill_fever_endure' },
      { text: 'Купить лекарства', effect: 'ill_fever_meds' },
      { text: 'Найти врача', effect: 'ill_fever_doctor' }
    ] },
    { id: 'ill_cough', title: 'Кровавый кашель', desc: 'Ты кашляешь. На платке — кровь. Немного. Но этого хватает, чтобы понять: что-то не так с лёгкими.', choices: [
      { text: 'Игнорировать', effect: 'ill_cough_ignore' },
      { text: 'Пойти в аптеку', effect: 'ill_cough_meds' },
      { text: 'Бросить курить (временно)', effect: 'ill_cough_quit' }
    ] },
    { id: 'ill_wound', title: 'Гноящаяся рана', desc: 'Рана от старой пули снова открылась. Края красные, кожа горячая. Инфекция пошла в кровь.', choices: [
      { text: 'Промыть водкой', effect: 'ill_wound_vodka' },
      { text: 'К врачу', effect: 'ill_wound_doctor' },
      { text: 'Отрезать', effect: 'ill_wound_cut' }
    ] },
    { id: 'ill_migraine', title: 'Мигрень', desc: 'Голова болит так, что свет режет глаза. Каждый звук — как удар молота. Ты не можешь думать.', choices: [
      { text: 'Таблетки', effect: 'ill_migraine_pills' },
      { text: 'Тёмная комната', effect: 'ill_migraine_dark' },
      { text: 'Виски', effect: 'ill_migraine_whiskey' }
    ] },
    { id: 'ill_tooth', title: 'Зубная боль', desc: 'Зуб ноет третий день. Ты уже не помнишь, когда спал нормально. Нужно что-то решать.', choices: [
      { text: 'Вырвать самому', effect: 'ill_tooth_pull' },
      { text: 'К дантисту', effect: 'ill_tooth_dentist' },
      { text: 'Заглушить алкоголем', effect: 'ill_tooth_drink' }
    ] },
    { id: 'ill_stomach', title: 'Резь в животе', desc: 'Что-то не то съел. Живот крутит так, что ты не можешь стоять прямо. Это не просто расстройство.', choices: [
      { text: 'Переждать', effect: 'ill_stomach_wait' },
      { text: 'Активированный уголь', effect: 'ill_stomach_coal' },
      { text: 'Скорую', effect: 'ill_stomach_ambulance' }
    ] },
    { id: 'ill_exhausted', title: 'Полное истощение', desc: 'Ты не спал три дня. Глаза не фокусируются, руки дрожат, в ушах звенит. Ещё немного — и ты упадёшь.', choices: [
      { text: 'Найти кровать', effect: 'ill_exhausted_sleep' },
      { text: 'Кофеин', effect: 'ill_exhausted_caffeine' },
      { text: 'Кокаин', effect: 'ill_exhausted_cocaine' }
    ] },
    { id: 'ill_heart', title: 'Сердечный приступ', desc: 'Боль в груди. Рука немеет. Ты падаешь на колени посреди улицы. Прохожие обходят.', choices: [
      { text: 'Звать на помощь', effect: 'ill_heart_call' },
      { text: 'Таблетки', effect: 'ill_heart_pills' },
      { text: 'Ползти домой', effect: 'ill_heart_crawl' }
    ] },
    { id: 'ill_allergy', title: 'Аллергия', desc: 'Кожа покрывается пятнами. Дышать всё труднее. Ты не знаешь, что вызвало это — но это не пройдёт само.', choices: [
      { text: 'Антигистамин', effect: 'ill_allergy_pill' },
      { text: 'В больницу', effect: 'ill_allergy_hospital' },
      { text: 'Терпеть', effect: 'ill_allergy_endure' }
    ] },
    { id: 'ill_vision', title: 'Тёмные пятна', desc: 'В глазах вспыхивают тёмные пятна. Ты видишь их всё чаще. Врач сказал бы — давление. Но у тебя нет врача.', choices: [
      { text: 'Отдохнуть', effect: 'ill_vision_rest' },
      { text: 'Капли', effect: 'ill_vision_drops' },
      { text: 'Игнорировать', effect: 'ill_vision_ignore' }
    ] },

    // ═══ БЛОК 2: ПОГОДА ═══
    { id: 'weather_storm', title: 'Гроза', desc: 'Молнии бьют по городу. Гром заглушает всё. Ливень такой, что не видно кончика сигареты.', choices: [
      { text: 'Переждать в баре', effect: 'weather_storm_bar' },
      { text: 'Идти под дождём', effect: 'weather_storm_walk' },
      { text: 'Скрыться в подвале', effect: 'weather_storm_shelter' }
    ] },
    { id: 'weather_fog', title: 'Густой туман', desc: 'Туман такой густой, что ты не видишь собственных ног. В таком тумане легко потеряться. И легко потерять кого-то другого.', choices: [
      { text: 'Идти по памяти', effect: 'weather_fog_memory' },
      { text: 'Остаться на месте', effect: 'weather_fog_wait' },
      { text: 'Следовать за звуком', effect: 'weather_fog_follow' }
    ] },
    { id: 'weather_heat', title: 'Жара', desc: 'Асфальт плавится. Воздух густой, как сироп. Даже дышать больно. И это только утро.', choices: [
      { text: 'В бар с кондиционером', effect: 'weather_heat_bar' },
      { text: 'Много воды', effect: 'weather_heat_water' },
      { text: 'Просто терпеть', effect: 'weather_heat_endure' }
    ] },
    { id: 'weather_cold', title: 'Мороз', desc: 'Минус десять. Ветер с моря пронизывает до костей. Пальцы не гнутся. Ты слишком легко одет.', choices: [
      { text: 'Зайти в бар', effect: 'weather_cold_bar' },
      { text: 'Купить пальто', effect: 'weather_cold_coat' },
      { text: 'Быстро идти', effect: 'weather_cold_walk' }
    ] },
    { id: 'weather_rain', title: 'Дождь', desc: 'Дождь идёт третий день. Всё мокрое, всё серое. Люди злые. Копы на взводе. Ты тоже.', choices: [
      { text: 'Под навесом', effect: 'weather_rain_cover' },
      { text: 'Идти по лужам', effect: 'weather_rain_walk' },
      { text: 'В бар за виски', effect: 'weather_rain_bar' }
    ] },
    { id: 'weather_wind', title: 'Штормовой ветер', desc: 'Ветер срывает вывески, ломает зонты, валит людей с ног. Слышны сирены. Где-то пожар.', choices: [
      { text: 'Помочь тушить', effect: 'weather_wind_help' },
      { text: 'Уйти подальше', effect: 'weather_wind_leave' },
      { text: 'Наблюдать', effect: 'weather_wind_watch' }
    ] },
    { id: 'weather_sun', title: 'Редкое солнце', desc: 'Впервые за месяц — солнце. Люди улыбаются. Город кажется почти нормальным. Тебе это не нравится.', choices: [
      { text: 'Прогуляться', effect: 'weather_sun_walk' },
      { text: 'Остаться в тени', effect: 'weather_sun_shade' },
      { text: 'В бар', effect: 'weather_sun_bar' }
    ] },
    { id: 'weather_snow', title: 'Первый снег', desc: 'Снег валит хлопьями. Всё белое. Красиво. Но в этом городе красивое всегда опасно.', choices: [
      { text: 'Поймать снежинку', effect: 'weather_snow_catch' },
      { text: 'Сделать снежок', effect: 'weather_snow_snowball' },
      { text: 'Смотреть в окно', effect: 'weather_snow_window' }
    ] },
    { id: 'weather_hail', title: 'Град', desc: 'Градины размером с горошину бьют по голове, по плечам, по машинам. Нужно срочно найти укрытие.', choices: [
      { text: 'Бежать в подъезд', effect: 'weather_hail_stairs' },
      { text: 'Под навес бара', effect: 'weather_hail_bar' },
      { text: 'Продолжать идти', effect: 'weather_hail_walk' }
    ] },
    { id: 'weather_blackout', title: 'Отключение света', desc: 'Во всём квартале погас свет. Только свечи в окнах. И тени в переулках.', choices: [
      { text: 'Проверить округу', effect: 'weather_blackout_scout' },
      { text: 'Остаться дома', effect: 'weather_blackout_home' },
      { text: 'Свечи и виски', effect: 'weather_blackout_candles' }
    ] },

    // ═══ БЛОК 2: ФРАКЦИИ ═══
    { id: 'faction_message', title: 'Сообщение от Синдиката', desc: 'Под дверью — записка с печатью Синдиката. "Есть предложение. Ждём в полночь". Без подписи.', choices: [
      { text: 'Пойти', effect: 'faction_message_go' },
      { text: 'Сжечь', effect: 'faction_message_burn' },
      { text: 'Отправить своих', effect: 'faction_message_crew' }
    ] },
    { id: 'faction_war', title: 'Война на улицах', desc: 'Две банды сошлись. Перестрелка в самом центре города. Копы не едут. Это твоя проблема тоже.', choices: [
      { text: 'Вмешаться', effect: 'faction_war_join' },
      { text: 'Скрыться', effect: 'faction_war_hide' },
      { text: 'Наблюдать', effect: 'faction_war_watch' }
    ] },
    { id: 'faction_defector', title: 'Перебежчик', desc: 'Человек из вражеской фракции хочет перейти к тебе. У него есть информация. И свои цели.', choices: [
      { text: 'Принять', effect: 'faction_defector_take' },
      { text: 'Отказать', effect: 'faction_defector_refuse' },
      { text: 'Допросить', effect: 'faction_defector_interrogate' }
    ] },
    { id: 'faction_offer', title: 'Предложение от врага', desc: 'Глава враждебной фракции хочет переговоров. Не убийства. Именно переговоров. Слишком подозрительно.', choices: [
      { text: 'Встретиться', effect: 'faction_offer_meet' },
      { text: 'Отказаться', effect: 'faction_offer_refuse' },
      { text: 'Прийти с оружием', effect: 'faction_offer_armed' }
    ] },
    { id: 'faction_betrayal', title: 'Предательство', desc: 'Твой человек передал информацию врагу. Он это сделал не ради денег. Он это сделал ради страха.', choices: [
      { text: 'Простить', effect: 'faction_betrayal_forgive' },
      { text: 'Убить', effect: 'faction_betrayal_kill' },
      { text: 'Использовать', effect: 'faction_betrayal_use' }
    ] },
    { id: 'faction_alliance', title: 'Предложение о союзе', desc: 'Другая фракция хочет союза. Против третьей. Классическая схема. Вопрос: кто предаст первым?', choices: [
      { text: 'Согласиться', effect: 'faction_alliance_accept' },
      { text: 'Отказаться', effect: 'faction_alliance_refuse' },
      { text: 'Тянуть время', effect: 'faction_alliance_delay' }
    ] },
    { id: 'faction_territory', title: 'Границы', desc: 'Они перешли границу твоей территории. Ничего не сделали. Просто прошлись. Демонстрация.', choices: [
      { text: 'Ответить тем же', effect: 'faction_territory_return' },
      { text: 'Стрелять', effect: 'faction_territory_shoot' },
      { text: 'Игнорировать', effect: 'faction_territory_ignore' }
    ] },
    { id: 'faction_leader', title: 'Лидер клана', desc: 'Сам глава одного из кланов хочет поговорить. Не через посредников. Напрямую. Это либо честь, либо ловушка.', choices: [
      { text: 'Встретиться на нейтральной', effect: 'faction_leader_neutral' },
      { text: 'У себя', effect: 'faction_leader_home' },
      { text: 'Отказаться', effect: 'faction_leader_refuse' }
    ] },
    { id: 'faction_young', title: 'Молодая банда', desc: 'Новая банда на районе. Дерзкая. Молодая. Они не знают правил. И это проблема.', choices: [
      { text: 'Научить', effect: 'faction_young_teach' },
      { text: 'Уничтожить', effect: 'faction_young_crush' },
      { text: 'Поговорить', effect: 'faction_young_talk' }
    ] },
    { id: 'faction_rumor', title: 'Слух о предателе', desc: 'Говорят, в твоей фракции есть крыса. Не от своих. От чужих. Но слух обычно имеет основание.', choices: [
      { text: 'Искать', effect: 'faction_rumor_hunt' },
      { text: 'Игнорировать', effect: 'faction_rumor_ignore' },
      { text: 'Распустить свой слух', effect: 'faction_rumor_counter' }
    ] },

    // ═══ БЛОК 2: ЖИВОТНЫЕ ═══
    { id: 'animal_dog', title: 'Бродячий пёс', desc: 'Собака смотрит на тебя. Голодная. Рёбра торчат. Она не рычит, но и не уходит.', choices: [
      { text: 'Покормить', effect: 'animal_dog_feed' },
      { text: 'Прогнать', effect: 'animal_dog_chase' },
      { text: 'Забрать к себе', effect: 'animal_dog_take' }
    ] },
    { id: 'animal_cat', title: 'Чёрный кот', desc: 'Кот сидит на пороге. Смотрит прямо на тебя. В этом городе суеверия имеют вес.', choices: [
      { text: 'Погладить', effect: 'animal_cat_pet' },
      { text: 'Прогнать', effect: 'animal_cat_chase' },
      { text: 'Не обращать внимания', effect: 'animal_cat_ignore' }
    ] },
    { id: 'animal_rats', title: 'Крысы', desc: 'В подвале крысы. Много. Они не боятся света. Значит, они уже давно здесь.', choices: [
      { text: 'Травить', effect: 'animal_rats_poison' },
      { text: 'Сжечь', effect: 'animal_rats_burn' },
      { text: 'Найти, откуда идут', effect: 'animal_rats_trace' }
    ] },
    { id: 'animal_pigeons', title: 'Голуби', desc: 'Стая голубей на площади. Среди них — белый. В этом городе белое всегда заметно.', choices: [
      { text: 'Посмотреть, куда полетит', effect: 'animal_pigeons_watch' },
      { text: 'Спугнуть', effect: 'animal_pigeons_scare' },
      { text: 'Пройти мимо', effect: 'animal_pigeons_ignore' }
    ] },
    { id: 'animal_snake', title: 'Змея', desc: 'В подвале змея. Не ядовитая. Но она здесь, и это значит, что кто-то её принёс.', choices: [
      { text: 'Убить', effect: 'animal_snake_kill' },
      { text: 'Поймать', effect: 'animal_snake_catch' },
      { text: 'Оставить', effect: 'animal_snake_leave' }
    ] },
    { id: 'animal_horse', title: 'Лошадь', desc: 'На окраине — лошадь. Заблудилась. Или её оставили. В городе, где машины, лошадь — это странно.', choices: [
      { text: 'Забрать', effect: 'animal_horse_take' },
      { text: 'Покормить', effect: 'animal_horse_feed' },
      { text: 'Позвонить копам', effect: 'animal_horse_cops' }
    ] },
    { id: 'animal_owl', title: 'Сова', desc: 'Сова сидит на фонаре. Смотрит на тебя. Ночью. В городе. Это редкость. И это что-то значит.', choices: [
      { text: 'Смотреть в ответ', effect: 'animal_owl_stare' },
      { text: 'Прогнать', effect: 'animal_owl_chase' },
      { text: 'Не обращать внимания', effect: 'animal_owl_ignore' }
    ] },
    { id: 'animal_fish', title: 'Рыба', desc: 'На рынке — рыба. Необычная. Слишком большая. Пахнет странно. Продавец говорит: "Из закрытого озера".', choices: [
      { text: 'Купить', effect: 'animal_fish_buy' },
      { text: 'Спросить о озере', effect: 'animal_fish_ask' },
      { text: 'Пройти мимо', effect: 'animal_fish_ignore' }
    ] },
    { id: 'animal_crow', title: 'Ворон', desc: 'Ворон на кладбище. Смотрит на тебя. Не улетает. Вороны — это вестники.', choices: [
      { text: 'Посмотреть, куда полетит', effect: 'animal_crow_follow' },
      { text: 'Бросить камень', effect: 'animal_crow_throw' },
      { text: 'Игнорировать', effect: 'animal_crow_ignore' }
    ] },
    { id: 'animal_moth', title: 'Мотыльки', desc: 'Миллионы мотыльков у фонаря. Они бьются о стекло, падают, поднимаются снова. Ты понимаешь их.', choices: [
      { text: 'Погасить фонарь', effect: 'animal_moth_light_off' },
      { text: 'Смотреть', effect: 'animal_moth_watch' },
      { text: 'Уйти', effect: 'animal_moth_leave' }
    ] },

    // ═══ БЛОК 2: ГОРОДСКАЯ ЖИЗНЬ ═══
    { id: 'city_musician', title: 'Уличный музыкант', desc: 'Саксофонист играет на углу. Красиво. Печально. Ты стоишь и слушаешь. Впервые за день — не хочется никого убивать.', choices: [
      { text: 'Дать денег', effect: 'city_musician_tip' },
      { text: 'Слушать', effect: 'city_musician_listen' },
      { text: 'Пройти мимо', effect: 'city_musician_ignore' }
    ] },
    { id: 'city_preacher', title: 'Проповедник', desc: 'Он стоит на ящике и кричит про конец света. Прохожие смеются. Ты — нет. Ты слушаешь.', choices: [
      { text: 'Дать денег', effect: 'city_preacher_give' },
      { text: 'Слушать', effect: 'city_preacher_listen' },
      { text: 'Спросить его', effect: 'city_preacher_ask' }
    ] },
    { id: 'city_kid', title: 'Мальчишка с газетой', desc: '"Свежий выпуск! Кровь на Приморской! Свежий выпуск!" Мальчишка лет двенадцати. Глаза уже мёртвые.', choices: [
      { text: 'Купить газету', effect: 'city_kid_buy' },
      { text: 'Дать денег без газеты', effect: 'city_kid_give' },
      { text: 'Пройти мимо', effect: 'city_kid_ignore' }
    ] },
    { id: 'city_beggar', title: 'Попрошайка', desc: 'Старик в лохмотьях протягивает руку. Он не просит денег. Он просто протягивает руку. И смотрит.', choices: [
      { text: 'Дать денег', effect: 'city_beggar_give' },
      { text: 'Купить ему еду', effect: 'city_beggar_food' },
      { text: 'Пройти мимо', effect: 'city_beggar_ignore' }
    ] },
    { id: 'city_prostitute', title: 'Женщина на углу', desc: 'Она стоит под фонарём. Курит. Смотрит на проезжающие машины. Она уже видела всё в этом городе.', choices: [
      { text: 'Подойти', effect: 'city_prostitute_approach' },
      { text: 'Дать денег', effect: 'city_prostitute_give' },
      { text: 'Пройти мимо', effect: 'city_prostitute_ignore' }
    ] },
    { id: 'city_drunk', title: 'Пьяный в переулке', desc: 'Он лежит в луже. Бутылка рядом. Он бормочет чьё-то имя. Он жив. Пока.', choices: [
      { text: 'Помочь', effect: 'city_drunk_help' },
      { text: 'Обчистить', effect: 'city_drunk_rob' },
      { text: 'Пройти мимо', effect: 'city_drunk_ignore' }
    ] },
    { id: 'city_wedding', title: 'Свадьба', desc: 'В церкви — свадьба. Не твоя. Но музыканты играют так, что ты останавливаешься. Это красиво. И это ненадолго.', choices: [
      { text: 'Зайти', effect: 'city_wedding_enter' },
      { text: 'Послушать снаружи', effect: 'city_wedding_listen' },
      { text: 'Пройти мимо', effect: 'city_wedding_ignore' }
    ] },
    { id: 'city_funeral', title: 'Похороны', desc: 'Процессия движется к кладбищу. Закрытый гроб. Никто не плачет. Это странно.', choices: [
      { text: 'Присоединиться', effect: 'city_funeral_join' },
      { text: 'Спросить, кто умер', effect: 'city_funeral_ask' },
      { text: 'Пройти мимо', effect: 'city_funeral_ignore' }
    ] },
    { id: 'city_market', title: 'Рынок', desc: 'Торговцы кричат, продают, торгуются. Кто-то украл кошелёк. Кто-то его вернул. Всё как обычно.', choices: [
      { text: 'Купить еды', effect: 'city_market_food' },
      { text: 'Найти карманника', effect: 'city_market_find' },
      { text: 'Наблюдать', effect: 'city_market_watch' }
    ] },
    { id: 'city_fire', title: 'Пожар', desc: 'Здание горит. Пожарные не едут — это район, куда они не суются. Люди выбегают с вещами. Кто-то остался внутри.', choices: [
      { text: 'Спасать', effect: 'city_fire_rescue' },
      { text: 'Смотреть', effect: 'city_fire_watch' },
      { text: 'Уйти', effect: 'city_fire_leave' }
    ] },

    // ═══ БЛОК 3: ВОЙНЫ БАНД ═══
    { id: 'war_convoy', title: 'Конвой', desc: 'Колонна из трёх машин перевозит товар конкурентов. Охраны мало. Ты знаешь маршрут.', choices: [
      { text: 'Напасть', effect: 'war_convoy_attack' },
      { text: 'Сообщить копам', effect: 'war_convoy_cops' },
      { text: 'Пропустить', effect: 'war_convoy_ignore' }
    ] },
    { id: 'war_sniper', title: 'Снайпер на крыше', desc: 'Кто-то засел на крыше и методично отстреливает твоих людей. Ты видишь блик оптики.', choices: [
      { text: 'Зайти сзади', effect: 'war_sniper_flank' },
      { text: 'Вызвать огонь', effect: 'war_sniper_fire' },
      { text: 'Уйти', effect: 'war_sniper_leave' }
    ] },
    { id: 'war_molotov', title: 'Коктейль Молотова', desc: 'В окно твоего бара летит бутылка с зажигательной смесью. Пламя охватывает стену.', choices: [
      { text: 'Тушить', effect: 'war_molotov_fire' },
      { text: 'Бежать', effect: 'war_molotov_run' },
      { text: 'Искать нападавшего', effect: 'war_molotov_hunt' }
    ] },
    { id: 'war_boss', title: 'Враг на районе', desc: 'Глава враждебной банды замечен в твоем районе. Без охраны. Это шанс.', choices: [
      { text: 'Убить', effect: 'war_boss_kill' },
      { text: 'Захватить', effect: 'war_boss_capture' },
      { text: 'Проследить', effect: 'war_boss_follow' }
    ] },
    { id: 'war_bomb', title: 'Бомба', desc: 'Под сиденьем машины найдено взрывное устройство. Таймер тикает.', choices: [
      { text: 'Обезвредить', effect: 'war_bomb_defuse' },
      { text: 'Выпрыгнуть', effect: 'war_bomb_jump' },
      { text: 'Отогнать', effect: 'war_bomb_drive' }
    ] },
    { id: 'war_truce', title: 'Перемирие', desc: 'Две банды сели за стол переговоров. Ты — посредник. Если начнётся стрельба, виноват будешь ты.', choices: [
      { text: 'Мир', effect: 'war_truce_peace' },
      { text: 'Спровоцировать', effect: 'war_truce_provoke' },
      { text: 'Убить обоих', effect: 'war_truce_kill' }
    ] },
    { id: 'war_armored', title: 'Бронированный грузовик', desc: 'Машина инкассаторов с деньгами конкурентов. Тяжёлая броня, но люди внутри не ожидают нападения.', choices: [
      { text: 'Взрывчатка', effect: 'war_armored_explosive' },
      { text: 'Заблокировать', effect: 'war_armored_block' },
      { text: 'Не связываться', effect: 'war_armored_ignore' }
    ] },
    { id: 'war_hostage', title: 'Заложник', desc: 'Твои люди взяли заложника. Он сын прокурора. Ты знаешь, что делать с такими.', choices: [
      { text: 'Требовать выкуп', effect: 'war_hostage_ransom' },
      { text: 'Отпустить', effect: 'war_hostage_release' },
      { text: 'Убить', effect: 'war_hostage_kill' }
    ] },
    { id: 'war_driveby', title: 'Драйв-бай', desc: 'Машина проносится мимо, поливая всё свинцом. Тебя задело.', choices: [
      { text: 'Открыть ответный огонь', effect: 'war_driveby_return' },
      { text: 'Спрятаться', effect: 'war_driveby_hide' },
      { text: 'Запомнить номер', effect: 'war_driveby_plate' }
    ] },
    { id: 'war_flame', title: 'Поджог', desc: 'Твой склад горит. Кто-то поджёг его со всех сторон. Пламя видно с другого конца города.', choices: [
      { text: 'Спасать товар', effect: 'war_flame_save' },
      { text: 'Спасать людей', effect: 'war_flame_people' },
      { text: 'Позвонить в пожарную', effect: 'war_flame_call' }
    ] },

    // ═══ БЛОК 3: ОРУЖИЕ ═══
    { id: 'wpn_case', title: 'Чемодан с оружием', desc: 'В заброшенном доме ты находишь чемодан. Внутри — новый пистолет с глушителем. Ещё в масле.', choices: [
      { text: 'Забрать', effect: 'wpn_case_take' },
      { text: 'Продать', effect: 'wpn_case_sell' },
      { text: 'Оставить', effect: 'wpn_case_leave' }
    ] },
    { id: 'wpn_broken', title: 'Осечка', desc: 'В самый ответственный момент твоего пистолета подводит. Ты слышишь щелчок вместо выстрела.', choices: [
      { text: 'Чинить', effect: 'wpn_broken_fix' },
      { text: 'Выбросить', effect: 'wpn_broken_throw' },
      { text: 'Бросить в врага', effect: 'wpn_broken_throw_weapon' }
    ] },
    { id: 'wpn_custom', title: 'Кастомный ствол', desc: 'Оружейник предлагает тебе уникальную сборку. Она будет стрелять лучше любого серийного.', choices: [
      { text: 'Купить', effect: 'wpn_custom_buy' },
      { text: 'Отказаться', effect: 'wpn_custom_refuse' },
      { text: 'Забрать бесплатно', effect: 'wpn_custom_take' }
    ] },
    { id: 'wpn_cache', title: 'Тайник', desc: 'На старом складе спрятана партия автоматов. Владелец умер год назад. Ты знаешь, где это.', choices: [
      { text: 'Забрать', effect: 'wpn_cache_take' },
      { text: 'Продать', effect: 'wpn_cache_sell' },
      { text: 'Оставить', effect: 'wpn_cache_leave' }
    ] },
    { id: 'wpn_silencer', title: 'Глушитель', desc: 'Знакомый предлагает глушитель. Дешёво. Но что-то в его предложении кажется подозрительным.', choices: [
      { text: 'Купить', effect: 'wpn_silencer_buy' },
      { text: 'Проверить', effect: 'wpn_silencer_check' },
      { text: 'Отказаться', effect: 'wpn_silencer_refuse' }
    ] },
    { id: 'wpn_cop_gun', title: 'Коповский ствол', desc: 'На месте перестрелки ты находишь пистолет с номером, который сдал бы на экспертизу любой коп.', choices: [
      { text: 'Забрать', effect: 'wpn_cop_gun_take' },
      { text: 'Подбросить', effect: 'wpn_cop_gun_plant' },
      { text: 'Выбросить', effect: 'wpn_cop_gun_throw' }
    ] },
    { id: 'wpn_explosives', title: 'Взрывчатка', desc: 'В багажнике — связка динамита. Осталась от каких-то старых дел. Таймер был отключён.', choices: [
      { text: 'Оставить', effect: 'wpn_explosives_keep' },
      { text: 'Продать', effect: 'wpn_explosives_sell' },
      { text: 'Уничтожить', effect: 'wpn_explosives_destroy' }
    ] },
    { id: 'wpn_blackmarket', title: 'Чёрный рынок', desc: 'В подвале продают всё, что стреляет. Тебе предлагают снайперскую винтовку без лицензии.', choices: [
      { text: 'Купить', effect: 'wpn_blackmarket_buy' },
      { text: 'Торговаться', effect: 'wpn_blackmarket_bargain' },
      { text: 'Ограбить', effect: 'wpn_blackmarket_rob' }
    ] },
    { id: 'wpn_ammo', title: 'Редкие патроны', desc: 'Кто-то продаёт пули, которые пробивают бронежилеты. Такие не купишь в обычном магазине.', choices: [
      { text: 'Купить', effect: 'wpn_ammo_buy' },
      { text: 'Узнать, откуда они', effect: 'wpn_ammo_ask' },
      { text: 'Отказаться', effect: 'wpn_ammo_refuse' }
    ] },
    { id: 'wpn_jam', title: 'Клинок в стволе', desc: 'Пистолет заклинило. Ты дёргаешь затвор, но безрезультатно. Враги приближаются.', choices: [
      { text: 'Чинить', effect: 'wpn_jam_fix' },
      { text: 'Драться кулаками', effect: 'wpn_jam_fight' },
      { text: 'Бежать', effect: 'wpn_jam_run' }
    ] },

    // ═══ БЛОК 3: МАШИНЫ ═══
    { id: 'car_stolen', title: 'Угнанная тачка', desc: 'У тротуара стоит Кадиллак. Ключи в замке. Владельца нет. Или он скоро вернётся.', choices: [
      { text: 'Угнать', effect: 'car_stolen_steal' },
      { text: 'Подождать', effect: 'car_stolen_wait' },
      { text: 'Проверить', effect: 'car_stolen_check' }
    ] },
    { id: 'car_race', title: 'Уличная гонка', desc: 'На светофоре рядом с тобой останавливается Мустанг. Водитель смотрит на тебя с вызовом.', choices: [
      { text: 'Гонять', effect: 'car_race_race' },
      { text: 'Игнорировать', effect: 'car_race_ignore' },
      { text: 'Стрелять', effect: 'car_race_shoot' }
    ] },
    { id: 'car_bomb', title: 'Бомба в машине', desc: 'Ты заводишь двигатель. Под сиденьем что-то щёлкает. Ты видишь красный огонёк.', choices: [
      { text: 'Выйти', effect: 'car_bomb_exit' },
      { text: 'Гнать', effect: 'car_bomb_drive' },
      { text: 'Искать', effect: 'car_bomb_search' }
    ] },
    { id: 'car_tire', title: 'Прокол', desc: 'Посреди промзоны у тебя спускает колесо. Ночью. В одиночестве.', choices: [
      { text: 'Менять', effect: 'car_tire_fix' },
      { text: 'Идти пешком', effect: 'car_tire_walk' },
      { text: 'Ждать', effect: 'car_tire_wait' }
    ] },
    { id: 'car_custom', title: 'Салон', desc: 'Владелец салона предлагает тебе "неучтённую" машину из своей коллекции.', choices: [
      { text: 'Купить', effect: 'car_custom_buy' },
      { text: 'Угнать', effect: 'car_custom_steal' },
      { text: 'Отказаться', effect: 'car_custom_refuse' }
    ] },
    { id: 'car_chopshop', title: 'Разборка', desc: 'Ты находишь подпольную разборку. Здесь исчезают машины со всего города. И твои тоже.', choices: [
      { text: 'Сжечь', effect: 'car_chopshop_burn' },
      { text: 'Договориться', effect: 'car_chopshop_deal' },
      { text: 'Ограбить', effect: 'car_chopshop_rob' }
    ] },
    { id: 'car_chase', title: 'Погоня', desc: 'В зеркалах заднего вида — мигалки. Копы хотят поговорить. Ты не хочешь.', choices: [
      { text: 'Уходить', effect: 'car_chase_escape' },
      { text: 'Остановиться', effect: 'car_chase_stop' },
      { text: 'Стрелять', effect: 'car_chase_shoot' }
    ] },
    { id: 'car_crash', title: 'Авария', desc: 'Водитель впереди резко тормозит. Ты врезаешься. Из машины выходят трое.', choices: [
      { text: 'Извиниться', effect: 'car_crash_apologize' },
      { text: 'Заплатить', effect: 'car_crash_pay' },
      { text: 'Драться', effect: 'car_crash_fight' }
    ] },
    { id: 'car_engine', title: 'Двигатель сдох', desc: 'Машина глохнет на полном ходу. Посреди опасного района. Тебе нужно срочно убраться.', choices: [
      { text: 'Ремонтировать', effect: 'car_engine_fix' },
      { text: 'Бросить', effect: 'car_engine_abandon' },
      { text: 'Угнать другую', effect: 'car_engine_steal' }
    ] },
    { id: 'car_jack', title: 'Карджеккинг', desc: 'На перекрёстке в твою машину стучат. Человек с пистолетом хочет "поговорить".', choices: [
      { text: 'Дать по газам', effect: 'car_jack_escape' },
      { text: 'Отдать ключи', effect: 'car_jack_give' },
      { text: 'Драться', effect: 'car_jack_fight' }
    ] },

    // ═══ БЛОК 3: ПОКЕР И АЗАРТ ═══
    { id: 'pkr_highstakes', title: 'Высокие ставки', desc: 'За столом — люди с толстыми кошельками. Игра идёт на большие деньги. Ты можешь сесть.', choices: [
      { text: 'Сесть', effect: 'pkr_highstakes_play' },
      { text: 'Наблюдать', effect: 'pkr_highstakes_watch' },
      { text: 'Уйти', effect: 'pkr_highstakes_leave' }
    ] },
    { id: 'pkr_dice', title: 'Кости', desc: 'В переулке играют в кости. Кажется, кости не простые. Ты видишь, как один из игроков подкручивает.', choices: [
      { text: 'Сорвать игру', effect: 'pkr_dice_expose' },
      { text: 'Присоединиться', effect: 'pkr_dice_join' },
      { text: 'Пройти мимо', effect: 'pkr_dice_leave' }
    ] },
    { id: 'pkr_heist', title: 'Казино', desc: 'Подпольное казино в особняке. Охраны много, но вентиляция слабая. Ты знаешь, где сейф.', choices: [
      { text: 'Ограбить', effect: 'pkr_heist_rob' },
      { text: 'Играть', effect: 'pkr_heist_play' },
      { text: 'Сдать копам', effect: 'pkr_heist_cops' }
    ] },
    { id: 'pkr_shark', title: 'Ростовщик', desc: 'Человек с улыбкой акулы предлагает тебе деньги под проценты. Большие деньги. Под очень большие проценты.', choices: [
      { text: 'Взять', effect: 'pkr_shark_take' },
      { text: 'Отказаться', effect: 'pkr_shark_refuse' },
      { text: 'Ограбить', effect: 'pkr_shark_rob' }
    ] },
    { id: 'pkr_marked', title: 'Меченые карты', desc: 'Ты видишь на столе карты. На рубашках — микроскопические пометки. Кто-то жульничает.', choices: [
      { text: 'Сказать', effect: 'pkr_marked_tell' },
      { text: 'Использовать', effect: 'pkr_marked_use' },
      { text: 'Уйти', effect: 'pkr_marked_leave' }
    ] },
    { id: 'pkr_streak', title: 'Полоса', desc: 'Ты проигрываешь третий раз подряд. Пора остановиться. Но ты знаешь, что следующий — точно твой.', choices: [
      { text: 'Играть дальше', effect: 'pkr_streak_continue' },
      { text: 'Остановиться', effect: 'pkr_streak_stop' },
      { text: 'Взять кредит', effect: 'pkr_streak_loan' }
    ] },
    { id: 'pkr_win', title: 'Крупный куш', desc: 'Ты сорвал банк. За столом воцарилась тишина. Все смотрят на тебя.', choices: [
      { text: 'Забрать деньги', effect: 'pkr_win_take' },
      { text: 'Оставить чаевые', effect: 'pkr_win_tip' },
      { text: 'Поставить всё', effect: 'pkr_win_allin' }
    ] },
    { id: 'pkr_cheat', title: 'Жулик', desc: 'Один из игроков явно жульничает. Остальные либо не видят, либо заодно с ним.', choices: [
      { text: 'Сдать его', effect: 'pkr_cheat_expose' },
      { text: 'Шантажировать', effect: 'pkr_cheat_blackmail' },
      { text: 'Сделать вид, что не заметил', effect: 'pkr_cheat_ignore' }
    ] },
    { id: 'pkr_fight', title: 'Подпольные бои', desc: 'В подвале дерутся люди. На кону — деньги. Ты можешь поставить или выйти на ринг.', choices: [
      { text: 'Поставить', effect: 'pkr_fight_bet' },
      { text: 'Драться', effect: 'pkr_fight_fight' },
      { text: 'Уйти', effect: 'pkr_fight_leave' }
    ] },
    { id: 'pkr_roulette', title: 'Русская рулетка', desc: 'Шесть человек. Один револьвер. Один патрон. На кону — твоя жизнь или чья-то ещё.', choices: [
      { text: 'Играть', effect: 'pkr_roulette_play' },
      { text: 'Застрелить ведущего', effect: 'pkr_roulette_shoot' },
      { text: 'Уйти', effect: 'pkr_roulette_leave' }
    ] },

    // ═══ БЛОК 3: КРИМИНАЛ ═══
    { id: 'crm_bank', title: 'Банк', desc: 'В центре города — банк. Охрана слабая. Ты знаешь, что внутри много наличных.', choices: [
      { text: 'Ограбить', effect: 'crm_bank_rob' },
      { text: 'Наводка', effect: 'crm_bank_tip' },
      { text: 'Пройти мимо', effect: 'crm_bank_leave' }
    ] },
    { id: 'crm_jewelry', title: 'Ювелирный', desc: 'Витрина ломится от золота. Владелец — старик. Охраны нет. Сигнализация есть.', choices: [
      { text: 'Ограбить', effect: 'crm_jewelry_rob' },
      { text: 'Купить', effect: 'crm_jewelry_buy' },
      { text: 'Уйти', effect: 'crm_jewelry_leave' }
    ] },
    { id: 'crm_blackmail', title: 'Шантаж', desc: 'У тебя есть компромат на одного из политиков. Фото, документы. Целое состояние.', choices: [
      { text: 'Использовать', effect: 'crm_blackmail_use' },
      { text: 'Продать', effect: 'crm_blackmail_sell' },
      { text: 'Сжечь', effect: 'crm_blackmail_burn' }
    ] },
    { id: 'crm_extortion', title: 'Рэкет', desc: 'Ты заходишь в бар, где недавно сменился владелец. Молодой. Не понимает правил.', choices: [
      { text: 'Требовать', effect: 'crm_extortion_demand' },
      { text: 'Предложить защиту', effect: 'crm_extortion_protect' },
      { text: 'Уйти', effect: 'crm_extortion_leave' }
    ] },
    { id: 'crm_smuggle', title: 'Контрабанда', desc: 'Нужно перевезти ящик через границу. Ты не знаешь, что внутри. Но платят хорошо.', choices: [
      { text: 'Везти', effect: 'crm_smuggle_transport' },
      { text: 'Посмотреть', effect: 'crm_smuggle_check' },
      { text: 'Отказаться', effect: 'crm_smuggle_refuse' }
    ] },
    { id: 'crm_kidnap', title: 'Похищение', desc: 'Богатый наследник. Один. Пьян. Ты знаешь его отца. Он заплатит.', choices: [
      { text: 'Похитить', effect: 'crm_kidnap_take' },
      { text: 'Просто ограбить', effect: 'crm_kidnap_rob' },
      { text: 'Уйти', effect: 'crm_kidnap_leave' }
    ] },
    { id: 'crm_art', title: 'Картина', desc: 'В частной коллекции есть картина, которая стоит целое состояние. Владелец в отъезде.', choices: [
      { text: 'Украсть', effect: 'crm_art_steal' },
      { text: 'Подменить', effect: 'crm_art_swap' },
      { text: 'Уйти', effect: 'crm_art_leave' }
    ] },
    { id: 'crm_warehouse', title: 'Склад', desc: 'Ты знаешь, где хранится товар конкурентов. Там только один охранник. И собака.', choices: [
      { text: 'Ограбить', effect: 'crm_warehouse_rob' },
      { text: 'Сжечь', effect: 'crm_warehouse_burn' },
      { text: 'Уйти', effect: 'crm_warehouse_leave' }
    ] },
    { id: 'crm_ransom', title: 'Обмен', desc: 'Ты должен обменять чемодан с деньгами на заложника. Место встречи — старый вокзал.', choices: [
      { text: 'Обменять', effect: 'crm_ransom_exchange' },
      { text: 'Подставить', effect: 'crm_ransom_double' },
      { text: 'Напасть', effect: 'crm_ransom_attack' }
    ] },
    { id: 'crm_pit', title: 'Яма', desc: 'В подвале — яма, где дерутся люди. Ты можешь поставить или спуститься. На кону — большие деньги.', choices: [
      { text: 'Поставить', effect: 'crm_pit_bet' },
      { text: 'Спуститься', effect: 'crm_pit_fight' },
      { text: 'Уйти', effect: 'crm_pit_leave' }
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
    
    // ═══ БЛОК 1: ЭФФЕКТЫ ═══
    body_alley_search: { money: 150, sanity: -3, log: 'Ты забираешь бумажник. Внутри — три сотни и визитка. Кому-то это не понравится.', tone: 'warn' },
    body_alley_leave: { sanity: -2, log: 'Ты уходишь. Ноги сами несут тебя прочь.', tone: 'info' },
    body_alley_cops: { heat: -3, sanity: +2, log: 'Копы приезжают через 10 минут. Тебя даже не спрашивают, кто ты.', tone: 'info' },

    body_river_family: { rep: +5, heat: +2, log: 'Семья благодарна. Но кто-то видел, как ты выходил с берега.', tone: 'good' },
    body_river_ring: { money: 300, sanity: -5, log: 'Кольцо снимается с холодного пальца. Оно ещё тёплое от твоей руки.', tone: 'bad' },
    body_river_leave: { sanity: -1, log: 'Ты оставляешь реку делать свою работу.', tone: 'info' },

    body_car_search: { money: 450, sanity: -4, log: 'В бардачке — пачка денег и револьвер. Оба тебе пригодятся.', tone: 'warn' },
    body_car_burn: { heat: -5, sanity: -6, log: 'Огонь пожирает Кадиллак. Тело превращается в пепел. Никто не узнает.', tone: 'bad' },
    body_car_leave: { sanity: -2, log: 'Ты уходишь. Машина остаётся с телом внутри.', tone: 'info' },

    body_hanging_cut: { rep: +3, sanity: -3, log: 'Ты срезаешь тело. Оно падает с глухим стуком. Кто-то должен был это сделать.', tone: 'warn' },
    body_hanging_hunt: { heat: +5, sanity: -5, log: 'Ты начинаешь искать. Слухи поползут по городу к утру.', tone: 'bad' },
    body_hanging_ignore: { sanity: -4, rep: -2, log: 'Ты проходишь мимо. Город замечает.', tone: 'warn' },

    body_burn_evidence: { sanity: -5, money: 80, log: 'Ты находишь обгоревший бумажник. Монеты оплавились, но что-то осталось.', tone: 'warn' },
    body_burn_gold: { money: 200, sanity: -8, log: 'Золото с зубов. Оно пахнет дымом и смертью.', tone: 'bad' },
    body_burn_leave: { sanity: -2, log: 'Ты уходишь. Пожар скоро потушат.', tone: 'info' },

    body_two_money: { money: 600, sanity: -6, heat: +5, log: 'Деньги твои. Но кто-то уже знает, где они были.', tone: 'bad' },
    body_two_search: { money: 200, sanity: -3, log: 'Ты находишь ключ и адрес. Интересно.', tone: 'warn' },
    body_two_cops: { heat: -4, sanity: +1, log: 'Анонимный звонок. Копы приедут через час.', tone: 'good' },

    body_grave_dig: { sanity: -12, money: 300, log: 'Ты раскапываешь могилу. Внутри — не гроб. Внутри — мешок с деньгами и револьвер.', tone: 'bad' },
    body_grave_mark: { sanity: -2, log: 'Ты ставишь метку. Завтра вернёшься с лопатой.', tone: 'info' },
    body_grave_leave: { sanity: -1, log: 'Ты уходишь. Могила остаётся.', tone: 'info' },

    body_cops_approach: { heat: +10, sanity: -5, log: 'Ты подходишь. Коп оборачивается. Теперь он знает твоё лицо.', tone: 'bad' },
    body_cops_follow: { sanity: -3, heat: +2, log: 'Ты следуешь за ним. Он идёт в участок. Значит, он на службе.', tone: 'info' },
    body_cops_leave: { sanity: -1, log: 'Ты уходишь. Пусть разбирается сам.', tone: 'info' },

    body_msg_erase: { sanity: -2, log: 'Ты стираешь надпись. Но она остаётся в голове.', tone: 'warn' },
    body_msg_keep: { sanity: -5, log: 'Ты оставляешь надпись. Пусть видят. Пусть боятся.', tone: 'bad' },
    body_msg_hunt: { heat: +5, sanity: -4, log: 'Ты начинаешь искать. К утру найдёшь.', tone: 'warn' },

    body_familiar_open: { sanity: -10, heat: +3, log: 'Ты открываешь гроб. Внутри — не твой человек. Кто-то подменил тело.', tone: 'bad' },
    body_familiar_ask: { sanity: -4, rep: +2, log: 'Семья говорит: "Мы не знаем, кто его убил". Но глаза их говорят другое.', tone: 'info' },
    body_familiar_leave: { sanity: -3, log: 'Ты уходишь. Гроб остаётся закрытым.', tone: 'info' },

    cop_pullover_bribe: { money: -100, heat: -3, log: 'Конверт исчезает в его кармане. Он даже не смотрит на тебя.', tone: 'warn' },
    cop_pullover_run: { heat: +15, sanity: -5, hp: -10, log: 'Ты бежишь. Коп бежит за тобой. Он стреляет в воздух.', tone: 'bad' },
    cop_pullover_calm: { heat: +5, sanity: -2, log: 'Ты стоишь спокойно. Он смотрит на тебя секунду. Потом уходит.', tone: 'info' },

    cop_raid_early_jump: { sanity: -8, hp: -15, log: 'Ты прыгаешь со второго этажа. Ноги болят. Но ты на свободе.', tone: 'bad' },
    cop_raid_early_hide: { sanity: -5, heat: +10, log: 'Ты прячешься в подвале. Слышишь шаги над головой. Они уходят.', tone: 'warn' },
    cop_raid_early_open: { heat: -10, money: -300, log: 'Ты открываешь дверь. Копам нужен не ты. Но они забирают всё, что находят.', tone: 'warn' },

    cop_undercover_check: { sanity: -3, heat: +5, log: 'Ты проверяешь его. Он не коп. Но он работает на кого-то.', tone: 'warn' },
    cop_undercover_leave: { sanity: -1, log: 'Ты уходишь. Пусть сидит.', tone: 'info' },
    cop_undercover_bribe: { money: -200, heat: -5, log: 'Ты подкупаешь его. Он улыбается. Может быть, он и правда коп. Может, нет.', tone: 'warn' },

    cop_detective_silent: { heat: +5, sanity: -3, log: 'Ты молчишь. Они записывают что-то в блокнот. Через час отпускают.', tone: 'info' },
    cop_detective_talk: { heat: -10, sanity: -10, rep: -5, log: 'Ты рассказываешь всё. Они слушают. Но теперь у них есть твоё имя.', tone: 'bad' },
    cop_detective_lawyer: { money: -500, heat: -5, log: 'Адвокат приезжает через час. Он забирает тебя. Копы недовольны.', tone: 'good' },

    cop_tip_move: { money: -200, sanity: -3, log: 'Ты вывозишь товар. Облавы нет. Значит, звонок был от друга.', tone: 'good' },
    cop_tip_ignore: { heat: +15, money: -500, log: 'Ты игнорируешь звонок. Утром склад пуст. Облава была реальной.', tone: 'bad' },
    cop_tip_check: { sanity: -5, heat: +2, log: 'Ты пытаешься найти звонящего. Он звонил с улицы. Никаких следов.', tone: 'info' },

    cop_bribe_offer_pay: { money: -300, heat: -5, log: 'Ты платишь. Он уходит. Но вернётся. Они всегда возвращаются.', tone: 'warn' },
    cop_bribe_offer_refuse: { heat: +10, sanity: -3, log: 'Ты отказываешься. Он запоминает. Потом найдёт повод.', tone: 'bad' },
    cop_bribe_offer_threat: { heat: +15, sanity: -5, rep: +2, log: 'Ты угрожаешь ему. Он отступает. Но теперь он твой враг.', tone: 'bad' },

    cop_evidence_pay: { money: -500, heat: -10, log: 'Деньги исчезают. Папка тоже. Пока.', tone: 'good' },
    cop_evidence_kill: { heat: +30, sanity: -15, rep: -5, log: 'Ты убиваешь копа. Это не сойдёт с рук. Но папка исчезла.', tone: 'bad' },
    cop_evidence_other: { money: -300, heat: -5, log: 'Ты находишь другого копа. Он берёт деньги и обещает "разобраться".', tone: 'warn' },

    cop_raid_heavy_surrender: { heat: -20, money: -500, sanity: -8, log: 'Ты сдаёшься. Тебя ведут в участок. Три дня в камере — и ты свободен. Пока.', tone: 'warn' },
    cop_raid_heavy_fight: { heat: +40, sanity: -20, hp: -30, log: 'Ты прорываешься с боем. Пули летят. Ты выживаешь. Но теперь ты — цель №1.', tone: 'bad' },
    cop_raid_heavy_smoke: { heat: +10, sanity: -10, log: 'Ты исчезаешь в дыму. Кто-то помог тебе. Кто-то, кого ты не знаешь.', tone: 'warn' },

    cop_leader_work: { heat: -20, money: +500, sanity: -10, rep: -5, log: 'Ты соглашаешься работать на копов. Теперь ты — их человек. И их пёс.', tone: 'bad' },
    cop_leader_refuse: { heat: +15, sanity: -5, rep: +5, log: 'Ты отказываешься. Он смотрит на тебя долго. Потом кивает.', tone: 'good' },
    cop_leader_bribe: { money: -1000, heat: -15, log: 'Ты подкупаешь его. Он берёт. Он всегда берёт.', tone: 'good' },

    cop_truck_stop_pay: { money: -400, sanity: -3, log: 'Конверт исчезает. Коп кивает. Грузовик едет дальше.', tone: 'warn' },
    cop_truck_stop_fight: { heat: +30, sanity: -15, hp: -25, log: 'Ты открываешь огонь. Коп падает. Но его напарник вызывает подкрепление.', tone: 'bad' },
    cop_truck_stop_surrender: { heat: -10, money: -800, sanity: -10, log: 'Ты сдаёшься. Грузовик конфискуют. Тебя отпускают через сутки.', tone: 'bad' },

    money_briefcase_take: { money: +2000, sanity: -5, heat: +5, log: 'Ты забираешь чемодан. Деньги пахнут чужими руками.', tone: 'warn' },
    money_briefcase_leave: { sanity: -2, log: 'Ты оставляешь чемодан. Может быть, кто-то придёт за ним. Может быть, ты.', tone: 'info' },
    money_briefcase_owner: { rep: +5, money: +200, sanity: -3, log: 'Ты находишь хозяина. Он благодарит тебя. Даёт двести. Уходит с чемоданом.', tone: 'good' },

    money_poker_play: { money: +500, sanity: -5, log: 'Ты играешь. Блефуешь. Побеждаешь. Или проигрываешь. Сегодня — победа.', tone: 'good' },
    money_poker_refuse: { sanity: -1, log: 'Ты отказываешься. Они не настаивают. Но что-то в их глазах меняется.', tone: 'info' },
    money_poker_ask: { money: -100, sanity: -3, log: 'Ты спрашиваешь правила. Они смеются. Ставка — сто. Ты платишь за вход.', tone: 'warn' },

    money_debt_pay: { money: -500, sanity: -3, rep: -2, log: 'Ты платишь. Он уходит. Но ты знаешь: такие не уходят навсегда.', tone: 'warn' },
    money_debt_kill: { heat: +20, sanity: -15, rep: +3, log: 'Ты убиваешь его. Проблема решена. Но это была не единственная проблема.', tone: 'bad' },
    money_debt_ignore: { heat: +5, sanity: -5, log: 'Ты игнорируешь его. Он уходит. Но вернётся с подкреплением.', tone: 'warn' },

    money_laundry_accept: { money: -200, sanity: -3, log: 'Ты соглашаешься. Деньги чисты. Теперь можно тратить.', tone: 'good' },
    money_laundry_refuse: { sanity: +1, log: 'Ты отказываешься. Чистые деньги пахнут лучше.', tone: 'info' },
    money_laundry_ask: { sanity: -2, log: 'Ты узнаёшь подробности. Всё законно. Почти.', tone: 'info' },

    money_tip_check: { money: +800, sanity: -5, heat: +8, log: 'Сейф открыт. Внутри — восемь сотен. Ты берёшь. Но кто-то видел.', tone: 'warn' },
    money_tip_refuse: { sanity: -1, log: 'Ты отказываешься. Наводка слишком хороша, чтобы быть правдой.', tone: 'info' },
    money_tip_interrogate: { sanity: -3, rep: +3, log: 'Ты допрашиваешь его. Он говорит, что сейф — правда. Но есть нюанс.', tone: 'warn' },

    money_scam_invest: { money: -1000, sanity: -10, log: 'Ты вкладываешь. Через неделю — тишина. Деньги исчезли.', tone: 'bad' },
    money_scam_refuse: { sanity: +1, log: 'Ты отказываешься. Чутьё тебя не подвело.', tone: 'good' },
    money_scam_investigate: { sanity: -3, money: +150, log: 'Ты проверяешь. Это афера. Ты продаёшь информацию о ней конкурентам за 150.', tone: 'warn' },

    money_cash_take: { money: +700, sanity: -5, log: 'Ты забираешь мешок. Никто не приходит за ним. Пока.', tone: 'warn' },
    money_cash_throw: { sanity: +2, log: 'Ты выбрасываешь мешок в реку. Деньги тонут. Ты — нет.', tone: 'good' },
    money_cash_trace: { heat: +5, sanity: -3, money: +100, log: 'Ты пытаешься найти отправителя. Находишь только его "человека". Он молчит. Ты получаешь сотню за молчание.', tone: 'warn' },

    money_stolen_take: { money: +400, sanity: -5, heat: +5, log: 'Ты берёшь деньги. Кровь на купюрах — не твоя. Пока.', tone: 'warn' },
    money_stolen_leave: { sanity: -1, log: 'Ты оставляешь деньги. Кто-то придёт за ними.', tone: 'info' },
    money_stolen_ask: { sanity: -3, rep: +2, log: 'Ты спрашиваешь у знающих. Они говорят: "Это долг одного мертвеца. Возьми, если не боишься".', tone: 'warn' },

    money_business_accept: { money: +600, heat: +8, sanity: -3, log: 'Ты берёшь бизнес. Полиция ищет владельца. Тебя — пока нет.', tone: 'warn' },
    money_business_refuse: { sanity: +1, log: 'Ты отказываешься. Слишком много проблем с полицией.', tone: 'info' },
    money_business_check: { sanity: -2, money: +50, log: 'Ты проверяешь его. Он в бегах. Ты продаёшь информацию копам за полтинник.', tone: 'warn' },

    money_counterfeit_accept: { money: +300, heat: +10, sanity: -3, log: 'Ты принимаешь деньги. Потом понимаешь: они фальшивые. Теперь ты — соучастник.', tone: 'bad' },
    money_counterfeit_refuse: { money: -50, sanity: +1, log: 'Ты отказываешься. Теряешь гонорар, но остаёшься чистым.', tone: 'info' },
    money_counterfeit_trace: { sanity: -5, heat: +5, money: +200, log: 'Ты находишь фальшивомонетчика. Он платит тебе двести за молчание.', tone: 'warn' },

    women_flirt_approach: { money: -50, sanity: +8, stress: -10, log: 'Ты подходишь. Она улыбается. Пара часов в её компании — и мир становится лучше.', tone: 'good' },
    women_flirt_leave: { sanity: -2, log: 'Ты уходишь. Она провожает тебя взглядом.', tone: 'info' },
    women_flirt_watch: { sanity: -1, log: 'Ты наблюдаешь. Она замечает. Улыбается. Потом уходит.', tone: 'info' },

    women_letter_go: { money: -100, sanity: +10, stress: -15, log: 'Ты идёшь по адресу. Там ждёт она. И ночь, о которой ты будешь помнить.', tone: 'good' },
    women_letter_burn: { sanity: -3, log: 'Ты сжигаешь письмо. Но фото остаётся в памяти.', tone: 'info' },
    women_letter_ignore: { sanity: -1, log: 'Ты игнорируешь. Она не звонит. Она ждёт.', tone: 'info' },

    women_ex_enter: { money: -200, sanity: -5, stress: +20, log: 'Ты впускаешь её. Она плачет. Ты слушаешь. Потом всё повторяется. Потом она уходит.', tone: 'warn' },
    women_ex_close: { sanity: -5, stress: +10, log: 'Ты закрываешь дверь. Она остаётся снаружи. И в твоей голове.', tone: 'bad' },
    women_ex_ask: { sanity: -2, log: 'Ты спрашиваешь. Она говорит: "Я просто хотела увидеть тебя". Ты не веришь.', tone: 'warn' },

    women_cry_approach: { sanity: +3, rep: +2, log: 'Ты подходишь. Она плачет на твоём плече. Ты не знаешь её имени. Но ты помогаешь.', tone: 'good' },
    women_cry_leave: { sanity: -3, log: 'Ты проходишь мимо. Плач затихает. Или тебе кажется.', tone: 'bad' },
    women_cry_call: { heat: -2, sanity: +1, log: 'Ты зовёшь копов. Они приезжают. Она уходит с ними. Ты больше не увидишь её.', tone: 'info' },

    women_gift_find: { money: -100, sanity: +8, log: 'Ты находишь её. Она ждёт. Благодарит. Ночь с ней — как награда.', tone: 'good' },
    women_gift_throw: { sanity: -2, log: 'Ты выбрасываешь платок. Потом жалеешь.', tone: 'info' },
    women_gift_ask: { sanity: -1, money: -20, log: 'Бармен говорит адрес. Ты платишь за информацию. Идёшь к ней.', tone: 'info' },

    women_jealous_talk: { sanity: -5, stress: +20, log: 'Ты говоришь. Она слушает. Она не верит. Она уходит. На время.', tone: 'warn' },
    women_jealous_leave: { sanity: -3, stress: +15, log: 'Ты уходишь. Она остаётся. И ждёт.', tone: 'bad' },
    women_jealous_lie: { sanity: -8, stress: +10, log: 'Ты врёшь. Она знает. Она всегда знает.', tone: 'bad' },

    women_danger_rush: { hp: -20, sanity: +10, rep: +5, log: 'Ты бежишь к ней. Там двое. Ты справляешься. Она плачет. Ты успокаиваешь.', tone: 'good' },
    women_danger_cops: { heat: +5, sanity: -3, log: 'Ты вызываешь копов. Они приезжают. Её нет. Никто не знает, где она.', tone: 'warn' },
    women_danger_crew: { money: -200, sanity: +5, rep: +3, log: 'Ты собираешь людей. Вы приходите вместе. Сила решает всё.', tone: 'good' },

    women_proposal_yes: { sanity: +15, stress: -20, money: -500, log: 'Ты соглашаешься. Она плачет от счастья. Ты — от страха.', tone: 'good' },
    women_proposal_no: { sanity: -8, stress: +15, log: 'Ты отказываешься. Она уходит. Навсегда.', tone: 'bad' },
    women_proposal_time: { sanity: -2, log: 'Ты просишь время. Она кивает. Она подождёт.', tone: 'info' },

    women_witness_pay: { money: -400, sanity: -2, log: 'Ты платишь. Она берёт. Молчание куплено.', tone: 'warn' },
    women_witness_threat: { sanity: -5, stress: +10, log: 'Ты угрожаешь. Она бледнеет. Уходит. Ты знаешь: она не забудет.', tone: 'bad' },
    women_witness_trust: { sanity: +5, stress: -10, log: 'Ты доверяешь ей. Она молчит. Она будет молчать всегда.', tone: 'good' },

    women_enemy_meet: { sanity: -5, money: +300, log: 'Ты встречаешься. Она говорит: "Он не тот, за кого себя выдаёт". Ты получаешь наводку. И деньги.', tone: 'warn' },
    women_enemy_refuse: { sanity: -1, log: 'Ты отказываешься. Она уходит. Ты думаешь о ней весь день.', tone: 'info' },
    women_enemy_check: { sanity: -3, heat: +3, log: 'Ты проверяешь её. Она — не жена врага. Она его сестра. Интересно.', tone: 'warn' },

    paranoia_follow_attack: { hp: -15, sanity: -8, rep: +3, log: 'Ты нападаешь первым. Он не ожидает. Ты побеждаешь. Но кто он был?', tone: 'warn' },
    paranoia_follow_lose: { sanity: -5, stress: +15, log: 'Ты петляешь. Он теряет след. Или делает вид.', tone: 'info' },
    paranoia_follow_trap: { sanity: -3, money: +100, log: 'Ты заводишь его в тупик. Там твои люди. Он говорит всё. За деньги.', tone: 'warn' },

    paranoia_mirror_break: { sanity: -5, stress: -10, log: 'Ты разбиваешь зеркало. Осколки летят. Кровь на руке. Но отражение исчезло.', tone: 'bad' },
    paranoia_mirror_ignore: { sanity: -2, log: 'Ты отворачиваешься. Отражение больше не двигается.', tone: 'info' },
    paranoia_mirror_stare: { sanity: -8, stress: +20, log: 'Ты смотришь. Оно смотрит. Ты моргаешь первым. Оно улыбается.', tone: 'bad' },

    paranoia_voice_listen: { sanity: -12, stress: +25, log: 'Ты слушаешь. Голос говорит: "Они все хотят тебя убить. Все". Ты начинаешь верить.', tone: 'bad' },
    paranoia_voice_drink: { money: -100, sanity: -5, stress: -15, log: 'Ты пьёшь. Голос становится тише. Но не исчезает.', tone: 'warn' },
    paranoia_voice_ignore: { sanity: -3, log: 'Ты игнорируешь. Голос замолкает. На время.', tone: 'info' },

    paranoia_shadow_check: { sanity: -8, hp: -10, log: 'Ты проверяешь. Тень — это человек. Он нападает. Ты выживаешь. Но что он искал?', tone: 'bad' },
    paranoia_shadow_hide: { sanity: -3, log: 'Ты закрываешь шторы. Тень остаётся. Но ты её не видишь.', tone: 'info' },
    paranoia_shadow_watch: { sanity: -6, stress: +15, log: 'Ты наблюдаешь. Тень исчезает к утру. Ты не спал.', tone: 'warn' },

    paranoia_note_find: { sanity: -5, heat: +3, log: 'Ты ищешь. Находишь отпечатки. Они твои. Но ты не помнишь, когда писал.', tone: 'bad' },
    paranoia_note_run: { sanity: -8, heat: +5, log: 'Ты бежишь. Куда — не знаешь. Подальше от того места, где нашёл записку.', tone: 'warn' },
    paranoia_note_ignore: { sanity: -3, log: 'Ты игнорируешь. Записка остаётся в кармане. На следующий день — исчезает.', tone: 'info' },

    paranoia_double_find: { sanity: -10, log: 'Ты находишь его. Он выглядит как ты. Он говорит как ты. Он уходит. Ты не преследуешь.', tone: 'bad' },
    paranoia_double_kill: { sanity: -20, heat: +15, log: 'Ты убиваешь его. Он падает. Ты смотришь на его лицо. Оно твоё. Но он не ты.', tone: 'bad' },
    paranoia_double_ignore: { sanity: -4, log: 'Ты игнорируешь. Он продолжает ходить по городу. Люди думают, что это ты.', tone: 'warn' },

    paranoia_radio_off: { sanity: -2, log: 'Ты выключаешь радио. Тишина. Но голос в голове остаётся.', tone: 'info' },
    paranoia_radio_listen: { sanity: -10, stress: +20, log: 'Ты слушаешь. Голос говорит твоё имя. Потом адрес. Потом: "Мы ждём".', tone: 'bad' },
    paranoia_radio_break: { money: -50, sanity: -5, log: 'Ты разбиваешь радио. Осколки летят. Голос замолкает. Навсегда?', tone: 'warn' },

    paranoia_knock_open: { hp: -10, sanity: -8, log: 'Ты открываешь. Там никого. Но на пороге — конверт с фотографией твоего дома.', tone: 'bad' },
    paranoia_knock_ignore: { sanity: -3, log: 'Ты игнорируешь. Стук прекращается. Через час — снова. Ты не открываешь.', tone: 'warn' },
    paranoia_knock_arm: { sanity: -2, log: 'Ты берёшь оружие. Стук прекращается. Ты сидишь с револьвером до утра.', tone: 'info' },

    paranoia_footsteps_turn: { sanity: -5, log: 'Ты оборачиваешься. Никого. Только твоя тень на стене.', tone: 'warn' },
    paranoia_footsteps_run: { sanity: -4, stress: +15, log: 'Ты ускоряешь шаг. Шаги тоже. Ты бежишь. Шаги отстают.', tone: 'warn' },
    paranoia_footsteps_hide: { money: -50, sanity: -3, log: 'Ты заходишь в бар. Заказываешь виски. Шаги остаются снаружи. Пока.', tone: 'info' },

    paranoia_wall_erase: { sanity: -3, log: 'Ты стираешь надпись. Но она остаётся в твоей голове.', tone: 'warn' },
    paranoia_wall_search: { sanity: -10, heat: +5, log: 'Ты проверяешь квартиру. Находишь жучок. Кто-то слушал тебя. Долго.', tone: 'bad' },
    paranoia_wall_move: { money: -500, sanity: -5, log: 'Ты переезжаешь. Новая квартира. Но надпись появляется снова. На новой стене.', tone: 'bad' },
    
    // ═══ БЛОК 2: ЭФФЕКТЫ ═══
    ill_fever_endure: { hp: -15, sanity: -5, log: 'Ты перетерпел. Жар ушёл. Слабость осталась.', tone: 'bad' },
    ill_fever_meds: { money: -100, hp: +10, sanity: +2, log: 'Таблетки. Горькие. Но помогают.', tone: 'good' },
    ill_fever_doctor: { money: -300, hp: +25, log: 'Врач осматривает тебя. Ставит укол. Ты засыпаешь.', tone: 'good' },

    ill_cough_ignore: { hp: -10, sanity: -3, log: 'Ты кашляешь дальше. Кровь на платке. Ты не хочешь думать об этом.', tone: 'bad' },
    ill_cough_meds: { money: -150, hp: +8, log: 'Сироп. Пахнет дёгтем. Но кашель становится тише.', tone: 'good' },
    ill_cough_quit: { sanity: -5, stress: +15, hp: +5, log: 'Ты бросаешь курить. На время. Руки трясутся.', tone: 'warn' },

    ill_wound_vodka: { money: -30, hp: -5, sanity: -3, log: 'Ты льёшь водку на рану. Боль адская. Но инфекция отступает.', tone: 'warn' },
    ill_wound_doctor: { money: -400, hp: +20, log: 'Врач чистит рану. Без анестезии. Ты стискиваешь зубы.', tone: 'good' },
    ill_wound_cut: { hp: -30, sanity: -15, log: 'Ты режешь. Кровь хлещет. Но гной уходит.', tone: 'bad' },

    ill_migraine_pills: { money: -80, sanity: +5, log: 'Таблетка. Через 20 минут — отпускает.', tone: 'good' },
    ill_migraine_dark: { hp: +5, sanity: -2, log: 'Тёмная комната. Тишина. Боль стихает. Медленно.', tone: 'info' },
    ill_migraine_whiskey: { money: -100, sanity: -3, stress: -10, log: 'Виски. Ты уже не чувствуешь головы. И боли тоже.', tone: 'warn' },

    ill_tooth_pull: { hp: -20, sanity: -10, log: 'Ты вырываешь зуб плоскогубцами. Кровь, боль, облегчение.', tone: 'bad' },
    ill_tooth_dentist: { money: -250, hp: +5, sanity: +3, log: 'Дантист. Укол. Кресло. Через час — ты свободен.', tone: 'good' },
    ill_tooth_drink: { money: -50, sanity: -5, stress: -5, log: 'Виски притупляет боль. На время. Зуб остаётся.', tone: 'warn' },

    ill_stomach_wait: { hp: -10, sanity: -3, log: 'Ты пережидаешь. Живот крутит. Но в итоге — отпускает.', tone: 'warn' },
    ill_stomach_coal: { money: -30, hp: +5, log: 'Уголь. Чёрный. Противный. Но помогает.', tone: 'good' },
    ill_stomach_ambulance: { money: -500, hp: +20, log: 'Скорая. Промывание. Ты чувствуешь себя опустошённым.', tone: 'good' },

    ill_exhausted_sleep: { hp: +15, sanity: +5, log: 'Ты падаешь на кровать. Сон приходит мгновенно.', tone: 'good' },
    ill_exhausted_caffeine: { money: -50, sanity: -5, stress: +10, log: 'Кофе. Ещё кофе. Руки дрожат. Но ты не спишь.', tone: 'warn' },
    ill_exhausted_cocaine: { money: -200, sanity: -15, stress: -20, log: 'Кокаин. Ты снова жив. Но это ненадолго.', tone: 'bad' },

    ill_heart_call: { money: -300, hp: +30, sanity: -5, log: 'Кто-то вызывает скорую. Ты выживаешь. Пока.', tone: 'good' },
    ill_heart_pills: { money: -80, hp: +15, log: 'Валидол. Через 5 минут — отпускает.', tone: 'good' },
    ill_heart_crawl: { hp: -20, sanity: -10, log: 'Ты ползёшь домой. Долго. Больно. Но доползаешь.', tone: 'bad' },

    ill_allergy_pill: { money: -80, hp: +10, log: 'Антигистамин. Пятна исчезают. Дышать легче.', tone: 'good' },
    ill_allergy_hospital: { money: -400, hp: +20, log: 'Больница. Капельница. Ты в порядке.', tone: 'good' },
    ill_allergy_endure: { hp: -15, sanity: -5, log: 'Ты терпишь. Тело чешется. Дышать трудно. Но ты жив.', tone: 'bad' },

    ill_vision_rest: { hp: +5, sanity: +2, log: 'Ты отдыхаешь. Пятна исчезают. Пока.', tone: 'info' },
    ill_vision_drops: { money: -50, hp: +5, log: 'Капли. Жжение. Потом — прояснение.', tone: 'good' },
    ill_vision_ignore: { hp: -10, sanity: -3, log: 'Ты игнорируешь. Пятна остаются. Ты привыкаешь.', tone: 'warn' },

    weather_storm_bar: { money: -100, sanity: +5, log: 'Ты пьёшь в баре. Гроза бушует снаружи. Ты — в тепле.', tone: 'good' },
    weather_storm_walk: { hp: -10, sanity: -3, log: 'Ты идёшь под дождём. Молнии бьют рядом. Ты выживаешь.', tone: 'warn' },
    weather_storm_shelter: { sanity: -2, log: 'Ты прячешься в подвале. Страшно. Но безопасно.', tone: 'info' },

    weather_fog_memory: { sanity: -3, log: 'Ты идёшь по памяти. Ошибаешься дважды. Но доходишь.', tone: 'warn' },
    weather_fog_wait: { sanity: +1, log: 'Ты стоишь. Туман рассеивается через час.', tone: 'info' },
    weather_fog_follow: { sanity: -5, heat: +3, log: 'Ты идёшь за звуком. Находишь копов. Они тебя не видят.', tone: 'warn' },

    weather_heat_bar: { money: -50, sanity: +5, log: 'Кондиционер. Холодное пиво. Жизнь налаживается.', tone: 'good' },
    weather_heat_water: { money: -20, hp: +5, log: 'Ты пьёшь воду. Много. Тело оживает.', tone: 'good' },
    weather_heat_endure: { hp: -10, sanity: -3, log: 'Ты терпишь. Жара. Пот. Слабость.', tone: 'bad' },

    weather_cold_bar: { money: -50, sanity: +5, log: 'Тепло. Виски. Ты отогреваешься.', tone: 'good' },
    weather_cold_coat: { money: -150, hp: +5, log: 'Пальто. Тёплое. Ты больше не мёрзнешь.', tone: 'good' },
    weather_cold_walk: { hp: -10, sanity: -3, log: 'Ты идёшь быстро. Холод кусает. Но ты доходишь.', tone: 'warn' },

    weather_rain_cover: { sanity: +1, log: 'Ты под навесом. Дождь стучит. Ты сухой.', tone: 'info' },
    weather_rain_walk: { hp: -5, sanity: -2, log: 'Ты идёшь по лужам. Промок до нитки. Плевать.', tone: 'warn' },
    weather_rain_bar: { money: -80, sanity: +5, log: 'Виски. Бар. Дождь за окном. Всё как надо.', tone: 'good' },

    weather_wind_help: { hp: -10, rep: +5, log: 'Ты помогаешь тушить. Огонь отступает. Тебя запомнят.', tone: 'good' },
    weather_wind_leave: { sanity: -1, log: 'Ты уходишь. Пожар бушует. Не твоя проблема.', tone: 'info' },
    weather_wind_watch: { sanity: -3, log: 'Ты смотришь. Огонь пожирает здание. Люди бегут. Ты стоишь.', tone: 'warn' },

    weather_sun_walk: { sanity: +5, stress: -5, log: 'Солнце. Тепло. Ты гуляешь. Впервые за долгое время — спокойно.', tone: 'good' },
    weather_sun_shade: { sanity: -1, log: 'Ты в тени. Солнце не для тебя.', tone: 'info' },
    weather_sun_bar: { money: -50, sanity: +3, log: 'Ты в баре. Солнце — снаружи. Ты — внутри. Всё правильно.', tone: 'info' },

    weather_snow_catch: { sanity: +3, log: 'Ты ловишь снежинку. Она тает в руке. Красиво.', tone: 'good' },
    weather_snow_snowball: { sanity: +5, rep: +2, log: 'Ты лепишь снежок. Бросаешь в прохожего. Он смеётся. Город почти нормальный.', tone: 'good' },
    weather_snow_window: { sanity: +2, log: 'Ты смотришь в окно. Снег валит. Внутри тепло. Хорошо.', tone: 'good' },

    weather_hail_stairs: { hp: -5, sanity: -1, log: 'Ты бежишь в подъезд. Град бьёт по спине. Но ты в укрытии.', tone: 'warn' },
    weather_hail_bar: { money: -50, sanity: +2, log: 'Под навесом бара. Град стучит. Ты пьёшь виски.', tone: 'info' },
    weather_hail_walk: { hp: -10, sanity: -3, log: 'Ты идёшь под градом. Голова в синяках. Но ты живой.', tone: 'bad' },

    weather_blackout_scout: { sanity: -3, heat: +5, log: 'Ты проверяешь округу. В темноте кто-то ходит. Это не ты.', tone: 'warn' },
    weather_blackout_home: { sanity: +1, log: 'Ты дома. Темно. Свечи. Тишина.', tone: 'info' },
    weather_blackout_candles: { money: -30, sanity: +5, stress: -10, log: 'Свечи. Виски. Тишина. Ты отдыхаешь.', tone: 'good' },

    faction_message_go: { money: +300, heat: +5, sanity: -3, log: 'Ты приходишь. Синдикат даёт тебе работу. И деньги. Всё как обычно.', tone: 'warn' },
    faction_message_burn: { sanity: -2, log: 'Ты сжигаешь записку. Синдикат не забудет.', tone: 'warn' },
    faction_message_crew: { money: -100, rep: +3, log: 'Ты отправляешь своих. Они возвращаются с информацией. И без тебя.', tone: 'info' },

    faction_war_join: { hp: -20, rep: +5, heat: +10, log: 'Ты вмешиваешься. Стреляешь. Побеждаешь. Тебя запоминают.', tone: 'good' },
    faction_war_hide: { sanity: -3, log: 'Ты скрываешься. Война идёт без тебя.', tone: 'info' },
    faction_war_watch: { sanity: -2, heat: +3, log: 'Ты наблюдаешь. Запоминаешь лица. Пригодится.', tone: 'warn' },

    faction_defector_take: { rep: +3, heat: +5, log: 'Ты принимаешь его. Он говорит много. Всё полезное.', tone: 'good' },
    faction_defector_refuse: { sanity: -1, log: 'Ты отказываешь. Он уходит. Кто-то другой его примет.', tone: 'info' },
    faction_defector_interrogate: { rep: +2, sanity: -3, log: 'Ты допрашиваешь его. Он говорит. Потом уходит. Без денег.', tone: 'warn' },

    faction_offer_meet: { money: +200, sanity: -3, heat: +3, log: 'Вы встречаетесь. Он говорит про мир. Ты не веришь. Но деньги берёшь.', tone: 'warn' },
    faction_offer_refuse: { heat: +5, sanity: -2, log: 'Ты отказываешь. Он уходит. Война продолжается.', tone: 'warn' },
    faction_offer_armed: { sanity: -5, rep: +5, heat: +5, log: 'Ты приходишь с оружием. Он нервничает. Но говорит. Ты запоминаешь.', tone: 'good' },

    faction_betrayal_forgive: { sanity: +5, rep: -3, log: 'Ты прощаешь его. Он плачет. Он будет верен.', tone: 'good' },
    faction_betrayal_kill: { sanity: -10, rep: +3, heat: +5, log: 'Ты убиваешь его. Остальные видят. Больше никто не предаст.', tone: 'bad' },
    faction_betrayal_use: { sanity: -3, rep: +2, log: 'Ты используешь его. Он будет передавать информацию. Ты — врагу.', tone: 'warn' },

    faction_alliance_accept: { rep: +5, heat: -5, money: +300, log: 'Вы союзники. Пока. Деньги идут. Война продолжается.', tone: 'good' },
    faction_alliance_refuse: { sanity: -2, log: 'Ты отказываешь. Они уходят. Война продолжается.', tone: 'info' },
    faction_alliance_delay: { sanity: -3, heat: +2, log: 'Ты тянешь время. Они ждут. Ты готовишься.', tone: 'warn' },

    faction_territory_return: { rep: +3, heat: +5, log: 'Ты проходишь по их территории. Демонстрация. Они запоминают.', tone: 'good' },
    faction_territory_shoot: { heat: +15, sanity: -10, rep: +5, log: 'Ты стреляешь. Один падает. Остальные бегут. Война началась.', tone: 'bad' },
    faction_territory_ignore: { sanity: -2, rep: -3, log: 'Ты игнорируешь. Они запоминают это. Ты слаб?', tone: 'warn' },

    faction_leader_neutral: { money: +500, rep: +5, sanity: -5, log: 'Нейтральная территория. Он говорит о мире. Ты слушаешь. Деньги идут.', tone: 'good' },
    faction_leader_home: { heat: +5, rep: +3, sanity: -3, log: 'Он приходит к тебе. Это честь. Ты знаешь, что делать.', tone: 'good' },
    faction_leader_refuse: { heat: +10, sanity: -3, log: 'Ты отказываешь. Он уходит. Война приближается.', tone: 'warn' },

    faction_young_teach: { rep: +5, money: -100, log: 'Ты учишь их правилам. Они слушают. Ты становишься старшим.', tone: 'good' },
    faction_young_crush: { heat: +10, sanity: -5, rep: +3, log: 'Ты уничтожаешь их. Молодые, глупые. Теперь они мертвы.', tone: 'bad' },
    faction_young_talk: { rep: +2, sanity: +1, log: 'Ты говоришь с ними. Они понимают. Они уходят.', tone: 'good' },

    faction_rumor_hunt: { money: -100, heat: +3, log: 'Ты ищешь. Находишь. Оказывается, это был слух. Пустой.', tone: 'warn' },
    faction_rumor_ignore: { sanity: -3, log: 'Ты игнорируешь. Слух растёт. Люди начинают шептаться.', tone: 'warn' },
    faction_rumor_counter: { rep: +2, sanity: -2, log: 'Ты распускаешь свой слух. Люди верят. Ты — хитрее.', tone: 'good' },

    animal_dog_feed: { money: -20, sanity: +5, log: 'Ты кормишь собаку. Она лижет руку. Ты улыбаешься.', tone: 'good' },
    animal_dog_chase: { sanity: -2, log: 'Ты прогоняешь её. Она уходит. Оглядывается.', tone: 'warn' },
    animal_dog_take: { money: -50, sanity: +8, log: 'Ты забираешь её. Теперь у тебя есть друг. Настоящий.', tone: 'good' },

    animal_cat_pet: { sanity: +3, log: 'Ты гладишь кота. Он мурлычет. Мир чуть теплее.', tone: 'good' },
    animal_cat_chase: { sanity: -3, log: 'Ты прогоняешь. Он уходит. Ты чувствуешь: что-то не так.', tone: 'warn' },
    animal_cat_ignore: { sanity: -1, log: 'Ты проходишь мимо. Он смотрит. Ты чувствуешь взгляд.', tone: 'info' },

    animal_rats_poison: { money: -80, sanity: -2, log: 'Ты травишь. Крысы умирают. Пахнет.', tone: 'warn' },
    animal_rats_burn: { money: -30, sanity: -5, log: 'Ты сжигаешь. Огонь. Крысы. Пепел.', tone: 'bad' },
    animal_rats_trace: { sanity: -3, heat: +3, log: 'Ты ищешь, откуда идут. Находишь проход. Кто-то там живёт.', tone: 'warn' },

    animal_pigeons_watch: { sanity: +2, log: 'Белый голубь летит. Ты идёшь за ним. Он садится на крышу.', tone: 'info' },
    animal_pigeons_scare: { sanity: -1, log: 'Ты пугаешь их. Стая улетает. Белый голубь остаётся. Смотрит.', tone: 'warn' },
    animal_pigeons_ignore: { sanity: +1, log: 'Ты проходишь мимо. Голуби остаются.', tone: 'info' },

    animal_snake_kill: { sanity: -3, rep: +2, log: 'Ты убиваешь змею. Один удар. Тихо.', tone: 'warn' },
    animal_snake_catch: { sanity: -2, log: 'Ты ловишь змею. Она извивается. Ты понимаешь: она не ядовита.', tone: 'info' },
    animal_snake_leave: { sanity: -1, log: 'Ты оставляешь её. Она уползает.', tone: 'info' },

    animal_horse_take: { money: -200, sanity: +5, log: 'Ты забираешь лошадь. Она слушается. Ты чувствуешь силу.', tone: 'good' },
    animal_horse_feed: { money: -30, sanity: +3, log: 'Ты кормишь её. Она благодарна.', tone: 'good' },
    animal_horse_cops: { heat: -2, sanity: +1, log: 'Копы забирают её. Ты уходишь.', tone: 'info' },

    animal_owl_stare: { sanity: -5, stress: +10, log: 'Ты смотришь в ответ. Она смотрит. Ты моргаешь первым.', tone: 'warn' },
    animal_owl_chase: { sanity: -3, log: 'Ты прогоняешь. Она улетает. Ты не знаешь, хорошо это или плохо.', tone: 'warn' },
    animal_owl_ignore: { sanity: -1, log: 'Ты проходишь мимо. Она провожает тебя взглядом.', tone: 'info' },

    animal_fish_buy: { money: -80, sanity: +3, log: 'Ты покупаешь рыбу. Готовишь. Ешь. Вкусно.', tone: 'good' },
    animal_fish_ask: { sanity: -2, log: 'Ты спрашиваешь о озере. Продавец молчит. Значит, там что-то есть.', tone: 'warn' },
    animal_fish_ignore: { sanity: +1, log: 'Ты проходишь мимо. Рыба остаётся.', tone: 'info' },

    animal_crow_follow: { sanity: -3, heat: +3, log: 'Ты идёшь за вороном. Он летит к кладбищу. Там — свежая могила.', tone: 'warn' },
    animal_crow_throw: { sanity: -2, log: 'Ты бросаешь камень. Ворон улетает. Ты остаёшься.', tone: 'warn' },
    animal_crow_ignore: { sanity: -1, log: 'Ты проходишь мимо. Ворон смотрит.', tone: 'info' },

    animal_moth_light_off: { sanity: +2, log: 'Ты гасишь фонарь. Мотыльки исчезают. Тишина.', tone: 'good' },
    animal_moth_watch: { sanity: -3, log: 'Ты смотришь. Они бьются. Падают. Поднимаются. Ты понимаешь их.', tone: 'warn' },
    animal_moth_leave: { sanity: +1, log: 'Ты уходишь. Мотыльки остаются.', tone: 'info' },

    city_musician_tip: { money: -50, sanity: +5, log: 'Ты даёшь денег. Он кивает. Играет громче. Ты уходишь с улыбкой.', tone: 'good' },
    city_musician_listen: { sanity: +3, stress: -10, log: 'Ты слушаешь. Музыка. Печаль. Красота.', tone: 'good' },
    city_musician_ignore: { sanity: -1, log: 'Ты проходишь мимо. Музыка остаётся за спиной.', tone: 'info' },

    city_preacher_give: { money: -30, sanity: +3, log: 'Ты даёшь денег. Он благословляет тебя. Ты не веришь. Но приятно.', tone: 'good' },
    city_preacher_listen: { sanity: -2, log: 'Ты слушаешь. Конец света. Может быть, он прав.', tone: 'warn' },
    city_preacher_ask: { sanity: -3, log: 'Ты спрашиваешь. Он говорит долго. Ты не понимаешь. Но что-то в этом есть.', tone: 'info' },

    city_kid_buy: { money: -10, sanity: -2, log: 'Ты покупаешь газету. Кровь. Убийства. Всё как обычно.', tone: 'warn' },
    city_kid_give: { money: -20, sanity: +3, log: 'Ты даёшь денег. Он смотрит на тебя. Удивлённо. Уходит.', tone: 'good' },
    city_kid_ignore: { sanity: -1, log: 'Ты проходишь мимо. Он кричит вслед. Ты не оборачиваешься.', tone: 'info' },

    city_beggar_give: { money: -30, sanity: +3, log: 'Ты даёшь денег. Он кивает. Ты уходишь.', tone: 'good' },
    city_beggar_food: { money: -50, sanity: +5, log: 'Ты покупаешь еду. Он ест. Медленно. Благодарно.', tone: 'good' },
    city_beggar_ignore: { sanity: -2, log: 'Ты проходишь мимо. Он смотрит вслед.', tone: 'warn' },

    city_prostitute_approach: { money: -100, sanity: +5, stress: -10, log: 'Ты подходишь. Она улыбается. Ночь. Забвение. Утро.', tone: 'good' },
    city_prostitute_give: { money: -50, sanity: +3, log: 'Ты даёшь денег. Она смотрит удивлённо. Уходит.', tone: 'good' },
    city_prostitute_ignore: { sanity: -1, log: 'Ты проходишь мимо. Она закуривает снова.', tone: 'info' },

    city_drunk_help: { money: -30, sanity: +3, log: 'Ты помогаешь ему встать. Он бормочет спасибо. Ты уходишь.', tone: 'good' },
    city_drunk_rob: { money: +50, sanity: -5, log: 'Ты обчищаешь его. В кармане — мелочь. Он даже не просыпается.', tone: 'bad' },
    city_drunk_ignore: { sanity: -1, log: 'Ты проходишь мимо. Он остаётся в луже.', tone: 'info' },

    city_wedding_enter: { sanity: +5, log: 'Ты заходишь. Музыка. Люди. Радость. Тебе это чуждо.', tone: 'good' },
    city_wedding_listen: { sanity: +3, log: 'Ты слушаешь снаружи. Музыка. Смех. Ты улыбаешься.', tone: 'good' },
    city_wedding_ignore: { sanity: -1, log: 'Ты проходишь мимо. Музыка затихает.', tone: 'info' },

    city_funeral_join: { sanity: -2, rep: +2, log: 'Ты идёшь со всеми. Гроб. Могила. Земля. Ты не знаешь, кто умер.', tone: 'info' },
    city_funeral_ask: { sanity: -3, heat: +2, log: 'Ты спрашиваешь. Отвечают: "Никто. Пустой гроб". Странно.', tone: 'warn' },
    city_funeral_ignore: { sanity: -1, log: 'Ты проходишь мимо. Процессия уходит.', tone: 'info' },

    city_market_food: { money: -60, hp: +10, log: 'Ты покупаешь еду. Свежую. Вкусную. Ешь.', tone: 'good' },
    city_market_find: { sanity: -3, heat: +3, log: 'Ты ищешь карманника. Находишь. Он отдаёт кошелёк. Ты отпускаешь.', tone: 'warn' },
    city_market_watch: { sanity: +1, log: 'Ты наблюдаешь. Рынок. Люди. Жизнь. Всё как обычно.', tone: 'info' },

    city_fire_rescue: { hp: -20, rep: +10, sanity: +5, log: 'Ты спасаешь человека. Он плачет. Ты уходишь. Ты — герой?', tone: 'good' },
    city_fire_watch: { sanity: -3, log: 'Ты смотришь. Огонь. Крики. Люди. Ты не помогаешь.', tone: 'warn' },
    city_fire_leave: { sanity: -1, log: 'Ты уходишь. Пожар бушует. Не твоя проблема.', tone: 'info' },
    
    // ═══ БЛОК 3: ЭФФЕКТЫ ═══
    war_convoy_attack: { hp: -20, money: 1200, heat: 15, sanity: -5, rep: 8, log: 'Ты нападаешь на конвой. Машины горят. Товар твой. Но кто-то выжил.', tone: 'bad' },
    war_convoy_cops: { heat: -5, rep: -2, money: 200, log: 'Ты сообщаешь копам. Конвой перехвачен. Тебе дают награду. Но свои считают тебя стукачом.', tone: 'warn' },
    war_convoy_ignore: { sanity: -2, log: 'Ты пропускаешь конвой. Война продолжается без тебя.', tone: 'info' },
    war_sniper_flank: { hp: -10, rep: 5, heat: 5, log: 'Ты заходишь сзади. Снайпер мёртв. Твои люди в безопасности.', tone: 'good' },
    war_sniper_fire: { money: -200, heat: 10, log: 'Ты вызываешь огонь. Крыша горит. Снайпер прыгает. Не выживает.', tone: 'warn' },
    war_sniper_leave: { sanity: -5, rep: -3, log: 'Ты уходишь. Снайпер продолжает работать. Твои люди гибнут.', tone: 'bad' },
    war_molotov_fire: { money: -300, hp: -15, log: 'Ты тушишь пожар. Бар спасён. Но выгорела половина.', tone: 'warn' },
    war_molotov_run: { money: -500, sanity: -5, log: 'Ты бежишь. Бар сгорает. Пламя освещает улицу.', tone: 'bad' },
    war_molotov_hunt: { hp: -10, rep: 5, heat: 5, log: 'Ты находишь нападавшего. Он говорит, кто заказал. Ты его отпускаешь.', tone: 'good' },
    war_boss_kill: { heat: 25, sanity: -10, rep: 10, log: 'Ты убиваешь главу. Враг обезглавлен. Но его люди будут мстить.', tone: 'bad' },
    war_boss_capture: { money: 2000, rep: 8, log: 'Ты захватываешь его. Он платит за жизнь. Две тысячи. Наличными.', tone: 'good' },
    war_boss_follow: { sanity: -3, heat: 5, log: 'Ты следишь за ним. Он идёт в участок. Копы. Вот это поворот.', tone: 'warn' },
    war_bomb_defuse: { sanity: -10, hp: -5, log: 'Ты обезвреживаешь бомбу. Провода, пот, дрожащие пальцы. Но ты жив.', tone: 'good' },
    war_bomb_jump: { hp: -20, sanity: -5, log: 'Ты прыгаешь. Взрыв. Тебя отбрасывает. Но ты выживаешь.', tone: 'warn' },
    war_bomb_drive: { hp: -10, money: -500, log: 'Ты отгоняешь машину. Взрыв вдалеке. Ты спас людей. Но потерял тачку.', tone: 'warn' },
    war_truce_peace: { rep: 5, heat: -10, money: 500, log: 'Мир заключён. Война окончена. Пока. Ты получаешь процент.', tone: 'good' },
    war_truce_provoke: { heat: 15, sanity: -10, rep: -5, log: 'Ты провоцируешь. Стрельба. Труп. Война начинается снова.', tone: 'bad' },
    war_truce_kill: { heat: 30, sanity: -20, rep: -10, log: 'Ты убиваешь обоих. Стол переговоров в крови. Ты — враг для всех.', tone: 'bad' },
    war_armored_explosive: { heat: 20, sanity: -10, money: 2000, log: 'Взрывчатка срабатывает. Броня вскрыта. Деньги твои. Но полиция уже едет.', tone: 'bad' },
    war_armored_block: { hp: -15, money: 1000, log: 'Ты блокируешь машину. Инкассаторы не готовы. Ты забираешь деньги. Но один успевает выстрелить.', tone: 'warn' },
    war_armored_ignore: { sanity: -1, log: 'Ты не связываешься. Слишком опасно. Пусть едут.', tone: 'info' },
    war_hostage_ransom: { money: 3000, heat: 15, sanity: -5, log: 'Прокурор платит. Три тысячи. Ты отпускаешь сына. Он смотрит на тебя с ненавистью.', tone: 'warn' },
    war_hostage_release: { rep: 5, heat: -5, log: 'Ты отпускаешь его. Прокурор запомнит. Может быть, это поможет.', tone: 'good' },
    war_hostage_kill: { heat: 40, sanity: -20, rep: -10, log: 'Ты убиваешь его. Город замер. Прокурор объявляет войну. Тебе конец.', tone: 'bad' },
    war_driveby_return: { hp: -15, heat: 15, sanity: -5, log: 'Ты стреляешь в ответ. Стекло разбито. Кто-то кричит. Машина уезжает. Ты ранен.', tone: 'warn' },
    war_driveby_hide: { sanity: -5, log: 'Ты прячешься. Пули летят мимо. Ты жив. Но кто это был?', tone: 'info' },
    war_driveby_plate: { sanity: -3, heat: 5, log: 'Ты запоминаешь номер. Это машина из другого района. Ты знаешь, чья она.', tone: 'warn' },
    war_flame_save: { hp: -20, money: -300, log: 'Ты спасаешь товар. Огонь обжигает руки. Но ты вытаскиваешь половину.', tone: 'warn' },
    war_flame_people: { rep: 8, sanity: 5, hp: -10, log: 'Ты спасаешь людей. Они выживают. Ты — герой. Но склад сгорел.', tone: 'good' },
    war_flame_call: { money: -100, heat: -5, log: 'Ты звонишь в пожарную. Они приезжают. Огонь потушен. Но полиция начинает задавать вопросы.', tone: 'info' },

    wpn_case_take: { money: 400, sanity: -2, log: 'Ты забираешь пистолет. Глушитель. Идеально.', tone: 'good' },
    wpn_case_sell: { money: 600, log: 'Ты продаёшь его. Покупатель доволен. Ты тоже.', tone: 'good' },
    wpn_case_leave: { sanity: -1, log: 'Ты оставляешь его. Кто-то другой найдёт.', tone: 'info' },
    wpn_broken_fix: { money: -100, hp: 5, log: 'Ты чинишь его. Щелчок. Затвор работает. Теперь он снова стреляет.', tone: 'good' },
    wpn_broken_throw: { money: -200, sanity: -3, log: 'Ты выбрасываешь его. Враги приближаются. У тебя нет оружия.', tone: 'bad' },
    wpn_broken_throw_weapon: { hp: -10, sanity: -5, log: 'Ты бросаешь пистолет в врага. Попал. Он падает. Но у тебя больше нет оружия.', tone: 'warn' },
    wpn_custom_buy: { money: -800, sanity: 3, log: 'Ты покупаешь кастомный ствол. Оружейник улыбается. Ты тоже. Он стреляет как мечта.', tone: 'good' },
    wpn_custom_refuse: { sanity: -1, log: 'Ты отказываешься. Слишком дорого. Или слишком подозрительно.', tone: 'info' },
    wpn_custom_take: { hp: -10, heat: 10, rep: 5, log: 'Ты забираешь его бесплатно. Оружейник не в восторге. Но ты уходишь с новым стволом.', tone: 'warn' },
    wpn_cache_take: { money: 1000, heat: 10, log: 'Ты забираешь партию. Автоматы в масле. Идеальны. Но кто-то мог их найти.', tone: 'good' },
    wpn_cache_sell: { money: 1500, heat: 15, log: 'Ты продаёшь автоматы. Покупатели довольны. Ты тоже.', tone: 'good' },
    wpn_cache_leave: { sanity: -1, log: 'Ты оставляешь их. Слишком горячо.', tone: 'info' },
    wpn_silencer_buy: { money: -200, sanity: 2, log: 'Ты покупаешь глушитель. Теперь стрельба будет тихой.', tone: 'good' },
    wpn_silencer_check: { sanity: -3, heat: 3, log: 'Ты проверяешь его. Он работает. Но продавец оказался копом под прикрытием.', tone: 'bad' },
    wpn_silencer_refuse: { sanity: 1, log: 'Ты отказываешься. Слишком подозрительно.', tone: 'info' },
    wpn_cop_gun_take: { heat: 15, money: 100, log: 'Ты забираешь пистолет. Номер сдан. Ты теперь в списке. Но у тебя есть улика.', tone: 'bad' },
    wpn_cop_gun_plant: { heat: -5, rep: 3, log: 'Ты подбрасываешь его в машину конкурента. Копы найдут. Тебе не поверят.', tone: 'good' },
    wpn_cop_gun_throw: { sanity: 1, log: 'Ты выбрасываешь его в реку. Металл тонет. Проблема решена.', tone: 'info' },
    wpn_explosives_keep: { money: 200, heat: 5, log: 'Ты оставляешь взрывчатку. На чёрный день.', tone: 'warn' },
    wpn_explosives_sell: { money: 600, heat: 10, log: 'Ты продаёшь её. Покупатель улыбается. Это ненадолго.', tone: 'good' },
    wpn_explosives_destroy: { sanity: 2, log: 'Ты уничтожаешь её. Взрыв в карьере. Ты спокоен.', tone: 'info' },
    wpn_blackmarket_buy: { money: -1500, sanity: -5, log: 'Ты покупаешь винтовку. Дорого. Но она стоит того.', tone: 'good' },
    wpn_blackmarket_bargain: { money: -1000, sanity: -2, log: 'Ты торгуешься. Продавец недоволен. Но сделка закрыта.', tone: 'good' },
    wpn_blackmarket_rob: { money: 500, heat: 20, sanity: -10, log: 'Ты грабишь его. Забираешь деньги и винтовку. Но он запомнил твоё лицо.', tone: 'bad' },
    wpn_ammo_buy: { money: -300, sanity: 2, log: 'Ты покупаешь патроны. Они пробивают бронежилеты. Ты готов.', tone: 'good' },
    wpn_ammo_ask: { sanity: -3, heat: 5, log: 'Ты спрашиваешь. Он говорит, что патроны из полиции. Теперь ты знаешь.', tone: 'warn' },
    wpn_ammo_refuse: { sanity: 1, log: 'Ты отказываешься. Слишком опасно.', tone: 'info' },
    wpn_jam_fix: { hp: -10, sanity: -5, log: 'Ты чинишь его. Враги приближаются. Ты успеваешь выстрелить.', tone: 'warn' },
    wpn_jam_fight: { hp: -20, sanity: -5, log: 'Ты бьёшь кулаком. Он падает. Второй бежит. Ты жив.', tone: 'warn' },
    wpn_jam_run: { hp: -5, sanity: -3, log: 'Ты бежишь. Враги не преследуют. Ты спасся.', tone: 'info' },

    car_stolen_steal: { money: 500, heat: 10, log: 'Ты угоняешь. Машина ревёт. Ты уезжаешь. Но кто-то видел.', tone: 'bad' },
    car_stolen_wait: { sanity: -1, log: 'Ты ждёшь. Владелец приходит. Ты уходишь. Скучно.', tone: 'info' },
    car_stolen_check: { sanity: -2, heat: 3, log: 'Ты проверяешь. Внутри — сумка с документами. Ты знаешь, чей это Кадиллак.', tone: 'warn' },
    car_race_race: { money: 500, sanity: 5, log: 'Ты гонишь. Побеждаешь. Он платит. Ты уезжаешь с деньгами и адреналином.', tone: 'good' },
    car_race_ignore: { sanity: 1, log: 'Ты не гоняешь. Он уезжает. Скучно.', tone: 'info' },
    car_race_shoot: { heat: 20, sanity: -10, log: 'Ты стреляешь. Он врезается. Ты уезжаешь. Но это уже не гонка.', tone: 'bad' },
    car_bomb_exit: { sanity: -5, hp: -10, log: 'Ты выпрыгиваешь. Взрыв. Тебя отбрасывает. Но ты жив.', tone: 'warn' },
    car_bomb_drive: { money: -500, sanity: -10, log: 'Ты гонишь. Взрыв. Машина уничтожена. Но ты успел выпрыгнуть.', tone: 'bad' },
    car_bomb_search: { sanity: -10, heat: 5, log: 'Ты ищешь. Находишь бомбу. Обезвреживаешь. Но кто её поставил?', tone: 'warn' },
    car_tire_fix: { hp: -5, money: -50, log: 'Ты меняешь колесо. В темноте. Долго. Но справляешься.', tone: 'warn' },
    car_tire_walk: { sanity: -3, log: 'Ты идёшь пешком. Долго. Холодно. Но доходишь.', tone: 'info' },
    car_tire_wait: { sanity: -5, hp: -5, log: 'Ты ждёшь. Проходит час. Никто не приезжает. Ты замерзаешь.', tone: 'bad' },
    car_custom_buy: { money: -3000, sanity: 3, log: 'Ты покупаешь её. Она блестит. Ты уезжаешь. Все смотрят.', tone: 'good' },
    car_custom_steal: { heat: 20, sanity: -5, log: 'Ты угоняешь её. Владелец увидит. Он не забудет.', tone: 'bad' },
    car_custom_refuse: { sanity: 1, log: 'Ты отказываешься. Слишком дорого.', tone: 'info' },
    car_chopshop_burn: { heat: 25, sanity: -10, log: 'Ты сжигаешь её. Огонь виден издалека. Полиция приедет. Но ты уходишь.', tone: 'bad' },
    car_chopshop_deal: { money: 500, heat: -5, log: 'Ты договариваешься. Они платят. Ты уходишь. Все довольны.', tone: 'good' },
    car_chopshop_rob: { money: 1000, heat: 15, sanity: -5, log: 'Ты грабишь их. Забираешь всё. Но они запомнят.', tone: 'warn' },
    car_chase_escape: { hp: -10, heat: 15, log: 'Ты уходишь. Мигалки исчезают в зеркалах. Ты выдыхаешь.', tone: 'warn' },
    car_chase_stop: { heat: -5, money: -200, log: 'Ты останавливаешься. Копы проверяют. Ты платишь штраф. Они уезжают.', tone: 'info' },
    car_chase_shoot: { heat: 40, sanity: -15, log: 'Ты стреляешь. Копы отвечают. Ты уходишь. Но теперь ты в списке.', tone: 'bad' },
    car_crash_apologize: { sanity: -2, log: 'Ты извиняешься. Они смотрят на тебя. Уходят. Ты выдыхаешь.', tone: 'info' },
    car_crash_pay: { money: -300, log: 'Ты платишь. Они довольны. Ты уезжаешь.', tone: 'good' },
    car_crash_fight: { hp: -15, heat: 10, sanity: -5, log: 'Ты дерёшься. Они падают. Ты уезжаешь. Но у тебя разбита губа.', tone: 'warn' },
    car_engine_fix: { money: -200, hp: -5, log: 'Ты чинишь его. Долго. Грязно. Но машина заводится.', tone: 'warn' },
    car_engine_abandon: { money: -500, sanity: -3, log: 'Ты бросаешь её. Идёшь пешком. Долго.', tone: 'bad' },
    car_engine_steal: { heat: 15, money: 100, log: 'Ты угоняешь другую. Быстро. Ты уезжаешь. Но кто-то видел.', tone: 'warn' },
    car_jack_escape: { hp: -10, sanity: -5, log: 'Ты даёшь по газам. Он стреляет. Пуля пробивает стекло. Но ты уезжаешь.', tone: 'warn' },
    car_jack_give: { money: -1000, sanity: -3, log: 'Ты отдаёшь ключи. Он уезжает. Ты остаёшься на улице. Пешком.', tone: 'bad' },
    car_jack_fight: { hp: -20, sanity: -5, rep: 3, log: 'Ты дерёшься. Он падает. Ты забираешь его пистолет. Уезжаешь.', tone: 'good' },

    pkr_highstakes_play: { money: 500, sanity: -5, log: 'Ты играешь. Блефуешь. Побеждаешь. Или проигрываешь. Сегодня — победа.', tone: 'good' },
    pkr_highstakes_watch: { sanity: 2, log: 'Ты наблюдаешь. Изучаешь игроков. Это тоже опыт.', tone: 'info' },
    pkr_highstakes_leave: { sanity: 1, log: 'Ты уходишь. Слишком высокие ставки.', tone: 'info' },
    pkr_dice_expose: { heat: 10, rep: 3, log: 'Ты срываешь игру. Они недовольны. Но ты забираешь банк.', tone: 'warn' },
    pkr_dice_join: { money: -200, sanity: -3, log: 'Ты играешь. Кости не твои. Ты проигрываешь.', tone: 'bad' },
    pkr_dice_leave: { sanity: 1, log: 'Ты проходишь мимо. Игра продолжается.', tone: 'info' },
    pkr_heist_rob: { money: 2000, heat: 25, sanity: -10, log: 'Ты грабишь казино. Охрана не готова. Ты уходишь с деньгами.', tone: 'bad' },
    pkr_heist_play: { money: -500, sanity: -3, log: 'Ты играешь. Ставки высокие. Ты проигрываешь. Но получаешь удовольствие.', tone: 'warn' },
    pkr_heist_cops: { heat: -5, rep: -3, money: 300, log: 'Ты сдаёшь казино копам. Они благодарят. Бандиты ищут стукача.', tone: 'warn' },
    pkr_shark_take: { money: 1000, heat: 5, sanity: -5, log: 'Ты берёшь деньги. Под проценты. Ты знаешь, что будешь должен.', tone: 'warn' },
    pkr_shark_refuse: { sanity: 1, log: 'Ты отказываешься. Акула улыбается. Уходит.', tone: 'info' },
    pkr_shark_rob: { money: 1500, heat: 15, sanity: -5, log: 'Ты грабишь ростовщика. Он в ярости. Ты уходишь.', tone: 'bad' },
    pkr_marked_tell: { rep: 3, heat: 5, log: 'Ты говоришь всем. Игра останавливается. Жулика вышвыривают.', tone: 'good' },
    pkr_marked_use: { money: 800, sanity: -5, log: 'Ты используешь меченые карты. Выигрываешь. Но кто-то видел.', tone: 'warn' },
    pkr_marked_leave: { sanity: 1, log: 'Ты уходишь. Игра продолжается без тебя.', tone: 'info' },
    pkr_streak_continue: { money: -500, sanity: -5, log: 'Ты играешь. Проигрываешь. Ещё раз. Ещё. Ты не можешь остановиться.', tone: 'bad' },
    pkr_streak_stop: { sanity: 3, log: 'Ты останавливаешься. Умное решение. Редкое.', tone: 'good' },
    pkr_streak_loan: { money: -1000, sanity: -8, log: 'Ты берёшь кредит. Играешь. Проигрываешь. Теперь ты должен больше.', tone: 'bad' },
    pkr_win_take: { money: 2000, sanity: 5, log: 'Ты забираешь деньги. Все смотрят. Ты уходишь.', tone: 'good' },
    pkr_win_tip: { money: 1800, rep: 3, log: 'Ты оставляешь чаевые. Официант улыбается. Ты уходишь.', tone: 'good' },
    pkr_win_allin: { money: 0, sanity: -10, log: 'Ты ставишь всё. Проигрываешь. Всё. Ты выходишь на улицу пустым.', tone: 'bad' },
    pkr_cheat_expose: { rep: 5, heat: 5, log: 'Ты сдаёшь жулика. Его вышвыривают. Ты — герой.', tone: 'good' },
    pkr_cheat_blackmail: { money: 500, heat: 5, sanity: -3, log: 'Ты шантажируешь его. Он платит. Ты уходишь. Он запомнил.', tone: 'warn' },
    pkr_cheat_ignore: { sanity: 1, log: 'Ты не замечаешь. Игра продолжается.', tone: 'info' },
    pkr_fight_bet: { money: -300, sanity: -3, log: 'Ты ставишь. Боец проигрывает. Ты теряешь деньги.', tone: 'bad' },
    pkr_fight_fight: { hp: -20, money: 500, rep: 3, log: 'Ты выходишь на ринг. Побеждаешь. Забираешь деньги. Но у тебя разбит нос.', tone: 'warn' },
    pkr_fight_leave: { sanity: 1, log: 'Ты уходишь. Бои продолжаются.', tone: 'info' },
    pkr_roulette_play: { sanity: -15, hp: -10, log: 'Ты играешь. Пуля проходит мимо. Ты выживаешь. Но ты никогда не будешь прежним.', tone: 'bad' },
    pkr_roulette_shoot: { heat: 30, sanity: -10, rep: 5, log: 'Ты стреляешь в ведущего. Паника. Ты уходишь. Игра окончена.', tone: 'bad' },
    pkr_roulette_leave: { sanity: 3, log: 'Ты уходишь. Ты умнее остальных.', tone: 'good' },

    crm_bank_rob: { money: 3000, heat: 30, sanity: -15, log: 'Ты грабишь банк. Охрана не готова. Ты уходишь с деньгами. Но это не конец.', tone: 'bad' },
    crm_bank_tip: { money: 500, rep: -2, log: 'Ты продаёшь наводку. Банда грабит. Ты получаешь процент.', tone: 'warn' },
    crm_bank_leave: { sanity: 1, log: 'Ты проходишь мимо. Ограбление не для тебя.', tone: 'info' },
    crm_jewelry_rob: { money: 1500, heat: 20, sanity: -10, log: 'Ты грабишь ювелирный. Старик даже не сопротивляется. Ты уходишь с золотом.', tone: 'bad' },
    crm_jewelry_buy: { money: -500, sanity: 3, log: 'Ты покупаешь украшение. Для одной из женщин. Она будет довольна.', tone: 'good' },
    crm_jewelry_leave: { sanity: 1, log: 'Ты проходишь мимо. Витрина остаётся.', tone: 'info' },
    crm_blackmail_use: { money: 2000, heat: 5, sanity: -3, log: 'Ты шантажируешь политика. Он платит. Много. Ты уходишь.', tone: 'warn' },
    crm_blackmail_sell: { money: 3000, heat: 10, rep: -5, log: 'Ты продаёшь компромат. Покупатель — конкурент. Политик уничтожен.', tone: 'bad' },
    crm_blackmail_burn: { sanity: 5, rep: 3, log: 'Ты сжигаешь компромат. Кто-то вздыхает с облегчением. Может быть, это ты.', tone: 'good' },
    crm_extortion_demand: { money: 400, heat: 5, rep: 3, log: 'Ты требуешь. Он платит. Он боится. Это правильно.', tone: 'good' },
    crm_extortion_protect: { money: 200, rep: 5, log: 'Ты предлагаешь защиту. Он соглашается. Теперь ты — его крыша.', tone: 'good' },
    crm_extortion_leave: { sanity: 1, log: 'Ты уходишь. Бар остаётся без крыши.', tone: 'info' },
    crm_smuggle_transport: { money: 1500, heat: 15, sanity: -5, log: 'Ты везёшь ящик. Через границу. Без проблем. Деньги твои.', tone: 'good' },
    crm_smuggle_check: { sanity: -5, heat: 5, log: 'Ты открываешь ящик. Внутри — оружие. Много. Ты везешь его. Деньги твои.', tone: 'warn' },
    crm_smuggle_refuse: { sanity: 1, log: 'Ты отказываешься. Кто-то другой повезёт.', tone: 'info' },
    crm_kidnap_take: { money: 3000, heat: 25, sanity: -15, log: 'Ты похищаешь его. Отец платит. Три тысячи. Ты отпускаешь. Он не забудет твоё лицо.', tone: 'bad' },
    crm_kidnap_rob: { money: 500, heat: 10, sanity: -5, log: 'Ты просто грабишь его. Он пьян. Не сопротивляется. Ты уходишь.', tone: 'warn' },
    crm_kidnap_leave: { sanity: 1, log: 'Ты уходишь. Он остаётся в баре.', tone: 'info' },
    crm_art_steal: { money: 2500, heat: 20, sanity: -5, log: 'Ты крадёшь картину. Она твоя. Теперь нужно найти покупателя.', tone: 'good' },
    crm_art_swap: { money: 1000, heat: 10, sanity: -3, log: 'Ты подменяешь картину. Никто не замечает. Ты уходишь с оригиналом.', tone: 'good' },
    crm_art_leave: { sanity: 1, log: 'Ты уходишь. Картина остаётся.', tone: 'info' },
    crm_warehouse_rob: { money: 1800, heat: 20, sanity: -10, hp: -15, log: 'Ты грабишь склад. Охранник сопротивляется. Ты его вырубаешь. Собака кусает. Но ты уходишь с товаром.', tone: 'bad' },
    crm_warehouse_burn: { heat: 25, sanity: -15, log: 'Ты сжигаешь склад. Огонь виден издалека. Товар конкурентов уничтожен.', tone: 'bad' },
    crm_warehouse_leave: { sanity: 1, log: 'Ты уходишь. Склад остаётся.', tone: 'info' },
    crm_ransom_exchange: { money: 2000, heat: 10, sanity: -5, log: 'Ты обмениваешь. Заложник свободен. Деньги твои. Всё чисто.', tone: 'good' },
    crm_ransom_double: { money: 4000, heat: 20, sanity: -10, rep: -5, log: 'Ты подставляешь. Забираешь деньги и заложника. Все в ярости.', tone: 'bad' },
    crm_ransom_attack: { hp: -20, money: 1000, heat: 25, sanity: -10, log: 'Ты нападаешь. Стрельба. Ты уходишь с деньгами. Но заложник мёртв.', tone: 'bad' },
    crm_pit_bet: { money: -300, sanity: -3, log: 'Ты ставишь. Боец проигрывает. Деньги уходят.', tone: 'bad' },
    crm_pit_fight: { hp: -25, money: 800, rep: 5, log: 'Ты спускаешься в яму. Дерёшься. Побеждаешь. Забираешь деньги. Но ты весь в крови.', tone: 'warn' },
    crm_pit_leave: { sanity: 1, log: 'Ты уходишь. Яма остаётся.', tone: 'info' },
  },
};
