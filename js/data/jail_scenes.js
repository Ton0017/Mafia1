// ═══ СЦЕНЫ ТЮРЬМЫ ═══
// Пул сцен с рандомизацией. Каждая тюрьма — новый набор.

const JailScenes = {

  cellmateNames: ['Костлявый Эд', 'Молчун', 'Проповедник', 'Шрам', 'Тихий Хэнк', 'Барсук', 'Гвоздь', 'Пастор'],
  detectiveNames: ['Райли', 'Ковач', 'Митчелл', 'Донахью', 'Соренсен'],

  firstNight: [
    { text: 'Первая ночь. Храп, лампа, холодный бетон. Кто-то в углу шепчет молитву. Или проклятие. Ты не разбираешь слов.' },
    { text: 'Камера на четверых. Трое спят. Ты — нет. Лампа мигает в коридоре. Кто-то считает шаги надзирателя. Не ты. Ты считаешь свои.' },
    { text: 'Матрас пахнет чужой жизнью. Ты лежишь с открытыми глазами. Потолок в разводах. Похоже на карту. На карту города, которого уже нет.' },
    { text: 'Ты сидишь на нарах. Свет из коридора режет глаза. За стеной кого-то бьют. Ты не оборачиваешься. Привычка за первую ночь.' },
    { text: 'Здесь холоднее, чем на улице. Стены помнят больше, чем люди. Ты закрываешь глаза. Дождь стучит по крыше. Или это шаги.' }
  ],

  cellmate: [
    {
      text: 'Он сидит напротив. Худой, с татуировками на пальцах. «Слышал, ты засветился. У меня есть информация. Но не бесплатно».',
      choices: [
        { text: 'Взять', effect: 'intel', log: 'Ты берёшь информацию. Услуга за услугу. Теперь ты должен ему.' },
        { text: 'Отказаться', effect: 'silent', log: 'Ты качаешь головой. Он пожимает плечами. Молчание — тоже ответ.' }
      ]
    },
    {
      text: 'Он не спрашивает, за что ты сидишь. Не рассказывает, за что сидит сам. Просто смотрит. Через час ты понимаешь: он знает больше, чем говорит.',
      choices: [
        { text: 'Спросить напрямую', effect: 'intel', log: 'Он говорит одну фразу. Она будет сниться тебе после выхода.' },
        { text: 'Молчать', effect: 'silent', log: 'Вы сидите молча. Это тоже разговор. Понятный без слов.' }
      ]
    },
    {
      text: 'Он рассказывает о себе. Много, красиво. Ты слушаешь. Потом понимаешь: ни слова правды. Но история хорошая. Почти как твоя.',
      choices: [
        { text: 'Поддержать игру', effect: 'trust', log: 'Он хлопает тебя по плечу. «Свой человек». Может, и правда.' },
        { text: 'Оборвать', effect: 'silent', log: 'Он замолкает. Больше не подходит. И это к лучшему.' }
      ]
    },
    {
      text: 'Он спрашивает, с какой ты улицы. Ты называешь. Он кивает. «Там был человек. Хороший. Теперь нет». Он не уточняет, при чём тут ты.',
      choices: [
        { text: 'Спросить имя', effect: 'intel', log: 'Имя ты запомнишь. И однажды найдёшь его родственников. Или они тебя.' },
        { text: 'Сменить тему', effect: 'silent', log: 'Он понимает. Молча отворачивается. Ты тоже.' }
      ]
    },
    {
      text: 'Он предлагает сыграть в карты. На интерес. На самом деле — на информацию. Ты проигрываешь, но узнаёшь больше, чем хотел.',
      choices: [
        { text: 'Сыграть ещё', effect: 'trust', log: 'Вторую партию он отдаёт тебе. Уважение. Немного.' },
        { text: 'Закончить', effect: 'silent', log: 'Он кивает. Убирает карты. Больше не предлагает.' }
      ]
    },
    {
      text: 'Он молчит три дня. На четвёртый подходит и говорит одно слово. Имя. Чьё-то имя. Он смотрит на тебя. Ты понимаешь: это важно.',
      choices: [
        { text: 'Запомнить', effect: 'intel', log: 'Ты запоминаешь имя. Оно всплывёт, когда ты выйдешь. Найдёшь его.' },
        { text: 'Забыть', effect: 'silent', log: 'Ты отворачиваешься. Имя уходит в темноту. Как и он.' }
      ]
    }
  ],

  interrogation: [
    {
      text: 'Детектив кладёт папку на стол. Усталые глаза. «Я не спрашиваю, виноват ли ты. Я спрашиваю, что ты знаешь».',
      choices: [
        { text: 'Молчать', effect: 'silent', log: 'Он закрывает папку. «Как хочешь». Выходит. Ты выиграл время. Но не свободу.' },
        { text: 'Торговаться', effect: 'trade', log: 'Он слушает. Кивает. Уходит. Ты не знаешь, что выторговал. Узнаешь при выходе.' },
        { text: 'Сдать кого-то', effect: 'sellout', log: 'Он записывает. Ты называешь имя. Выходишь с чистым листом — но с грязными руками.' }
      ]
    },
    {
      text: 'Детектив не задаёт вопросов. Просто сидит. Смотрит. Проходит час. Два. Ты начинаешь говорить сам. Это и есть его метод.',
      choices: [
        { text: 'Молчать', effect: 'silent', log: 'Он уходит первым. Это маленькая победа. Но всё равно победа.' },
        { text: 'Торговаться', effect: 'trade', log: 'Он слушает. Медленно кивает. «Мы ещё поговорим».' }
      ]
    },
    {
      text: 'Детектив кладёт фотографию на стол. Твой город. Твоя улица. Кто-то на фото — мёртв. Он смотрит на тебя.',
      choices: [
        { text: 'Молчать', effect: 'silent', log: 'Он забирает фото. «Подумай». Ты уже думаешь. Слишком много.' },
        { text: 'Сдать кого-то', effect: 'sellout', log: 'Ты называешь имя. Он записывает. Фото исчезает в папке.' }
      ]
    },
    {
      text: 'Детектив угощает сигаретой. Ты берёшь. Он закуривает тоже. «Знаешь, я не злодей. Я просто делаю работу. Как и ты».',
      choices: [
        { text: 'Согласиться', effect: 'trade', log: 'Он улыбается впервые. «Вот и славно». Ты не уверен, что это хорошо.' },
        { text: 'Молчать', effect: 'silent', log: 'Он гасит сигарету. «Ладно». Выходит. Сигарета была единственным подарком.' }
      ]
    },
    {
      text: 'Детектив кладёт на стол конверт. «Здесь пятьсот. Мне нужно имя. Одно имя. И ты выйдешь раньше».',
      choices: [
        { text: 'Взять деньги', effect: 'sellout', log: 'Ты берёшь. Говоришь имя. Выходишь раньше. Не чувствуешь облегчения.' },
        { text: 'Оттолкнуть', effect: 'silent', log: 'Он забирает конверт. «Дурак. Но честный дурак». Впервые звучит как комплимент.' },
        { text: 'Торговаться', effect: 'trade', log: 'Вы сходитесь на тысяче. Имени ты не называешь. Пока.' }
      ]
    }
  ],

  micro: [
    'Кормят баландой. Ты ешь. Она безвкусная. Как и всё здесь.',
    'Прогулка. Двадцать минут. Небо серое. Дождь идёт. Как всегда.',
    'Кто-то поёт в соседней камере. Плохо. Но искренне.',
    'Надзиратель проходит мимо. Смотрит. Идёт дальше.',
    'Ты считаешь трещины на потолке. Сбиваешься. Начинаешь заново.',
    'За стеной ссора. Потом тишина. Потом кто-то плачет.',
    'Тебе приносят письмо. Без подписи. Ты не открываешь. Пока.',
    'Лампа гаснет на час. В темноте все равны. Как и в жизни.',
    'Надзиратель спрашивает имя. Ты называешь. Он записывает. В третий раз.',
    'Ты вспоминаешь улицу. Не ту, где вырос. Ту, где умер кто-то важный.'
  ],

  release: [
    { text: 'Дверь открывается. Свет бьёт в глаза. Ты выходишь. На улице всё та же грязь. Но у тебя чистый лист. Пока.' },
    { text: 'Надзиратель кивает. Молча. Ты выходишь. За воротами — город. Он не ждал. Он никогда не ждёт.' },
    { text: 'Ты забираешь свои вещи. Меньше, чем было. Больше, чем заслужил. Выходишь. Дождь. Как и в тот день, когда вошёл.' },
    { text: 'Начальник тюрьмы жмёт руку. «Не возвращайся». Ты киваешь. Возможно, врёшь. Возможно, нет.' }
  ],

  // Генерация полного плана тюрьмы для конкретного срока
  generate(days) {
    const scenes = [];
    const used = new Set();

    const pickUnused = (arr, tag) => {
      const available = arr.map((v, i) => ({ v, i })).filter(x => !used.has(tag + '_' + x.i));
      if (available.length === 0) return arr[Math.floor(Math.random() * arr.length)];
      const choice = available[Math.floor(Math.random() * available.length)];
      used.add(tag + '_' + choice.i);
      return choice.v;
    };

    // Ночь 1
    scenes.push({ type: 'firstNight', data: pickUnused(this.firstNight, 'fn') });

    // Микро-событие (шанс 40%)
    if (Math.random() < 0.4) {
      scenes.push({ type: 'micro', data: this.micro[Math.floor(Math.random() * this.micro.length)] });
    }

    // Сокамерник — с уникальным именем
    const usedCellmateNames = new Set();
    let cellmateName;
    do {
      cellmateName = this.cellmateNames[Math.floor(Math.random() * this.cellmateNames.length)];
    } while (usedCellmateNames.has(cellmateName));
    usedCellmateNames.add(cellmateName);
    scenes.push({ type: 'cellmate', data: pickUnused(this.cellmate, 'cm'), name: cellmateName });

    // При 4+ днях — ещё микро
    if (days >= 4) {
      scenes.push({ type: 'micro', data: this.micro[Math.floor(Math.random() * this.micro.length)] });
    }

    // Допрос — детектив с уникальным именем
    const usedDetectiveNames = new Set();
    let detectiveName;
    do {
      detectiveName = this.detectiveNames[Math.floor(Math.random() * this.detectiveNames.length)];
    } while (usedDetectiveNames.has(detectiveName));
    usedDetectiveNames.add(detectiveName);
    scenes.push({ type: 'interrogation', data: pickUnused(this.interrogation, 'in'), name: detectiveName });

    // При 5+ днях — второй сокамерник или допрос
    if (days >= 5) {
      scenes.push({ type: 'micro', data: this.micro[Math.floor(Math.random() * this.micro.length)] });
      if (Math.random() < 0.5) {
        let secondName;
        do {
          secondName = this.cellmateNames[Math.floor(Math.random() * this.cellmateNames.length)];
        } while (usedCellmateNames.has(secondName));
        usedCellmateNames.add(secondName);
        scenes.push({ type: 'cellmate', data: pickUnused(this.cellmate, 'cm'), name: secondName });
      } else {
        let secondDetective;
        do {
          secondDetective = this.detectiveNames[Math.floor(Math.random() * this.detectiveNames.length)];
        } while (usedDetectiveNames.has(secondDetective));
        usedDetectiveNames.add(secondDetective);
        scenes.push({ type: 'interrogation', data: pickUnused(this.interrogation, 'in'), name: secondDetective });
      }
    }

    // Выход
    scenes.push({ type: 'release', data: pickUnused(this.release, 're') });

    return scenes;
  }
};
