// ═══ ПОЛИЦЕЙСКИЙ УЧАСТОК ═══
// Чистым — открыт. На заметке — скрипят двери. В розыске — не заходи.

const PoliceStation = {
  ASK_PRICE: 200,
  SIT_LINES: [
    'Ты сидишь на скамье в коридоре. Кто-то плачет за дверью. Кто-то смеётся. Никто не смотрит друг на друга.',
    'Лампа мигает. Дежурный перелистывает бумаги. Твои тоже.',
    'По коридору ведут человека. Он смотрит на тебя. Ты отворачиваешься.',
    'Кофе из автомата. Вкус как у ржавой воды. Но горячий.',
    'Кто-то оставил газету на скамье. Вчерашнюю. Или позавчерашнюю. Неважно.'
  ],

  enter() {
    if (!State.player) return;
    const heat = State.player.heat || 0;

    // Особо опасен — забирают сразу, без разговоров
    if (heat >= 90) {
      Engine.log('Ты входишь. Дежурный не поднимает глаз. Потом поднимает. Медленно.', 'bad');
      Engine.log('Он тянется к кнопке под столом. Ты не успеваешь.', 'bad');
      if (typeof JailSystem !== 'undefined') {
        let days = 5;
        if (State.flags && State.flags.killedCop) { days += 7; delete State.flags.killedCop; }
        JailSystem.start(days);
      }
      return;
    }

    // В розыске — узнают, бой
    if (heat >= 70) {
      Engine.log('Ты входишь. Дежурный смотрит на тебя. Потом на стену с фотографиями. Потом снова на тебя.', 'bad');
      Engine.log('«Это он». Он не кричит. Говорит тихо. Как говорят перед тем, как выстрелить.', 'bad');
      this._startFight(3);
      return;
    }

    // На заметке — 30% шанс, что дежурный снимет трубку
    if (heat >= 40) {
      if (Utils.chance(0.3)) {
        Engine.log('Ты входишь. Дежурный кивает. Слишком вежливо.', 'warn');
        Engine.log('Он поднимает трубку. Набирает две цифры. Ты понимаешь, какие.', 'bad');
        this._startFight(2);
        return;
      }
      Engine.log('Ты входишь. Дежурный смотрит на тебя дольше обычного. Но пропускает.', 'warn');
      Engine.go('policeStation');
      return;
    }

    // Чист
    Engine.log('Ты входишь. Дежурный не поднимает глаз от бумаг.', 'info');
    Engine.go('policeStation');
  },

  _startFight(count) {
    if (typeof Combat === 'undefined') return;
    const level = (State.player.level || 1) + 2;
    const enemy = Combat.spawnEnemy(level, { affiliation: 'police' });
    enemy.armor = 15;
    enemy.loot.money = (enemy.loot.money || 0) + Utils.rnd(100, 200) * count;
    Economy.changeHeat(30, 'Стрельба в участке');
    Time.spend(1);
    if (!State.player || !State.city || State.deathRecord) return;
    Combat.start(enemy, { type: 'cop', returnScreen: 'city' });
  },

  ask() {
    if (!State.player) return false;
    if (!Time.canSpend(1)) { Engine.log('Слишком поздно. Участок закрыт.', 'warn'); return false; }
    if (!Economy.spend(this.ASK_PRICE, 'Справка в участке')) return false;

    const heat = State.player.heat || 0;
    let who;
    if (heat >= 80) who = 'За твоё дело взялись всерьёз. Папка толстая, фотографии свежие. Судя по отметкам — федералы тоже в курсе.';
    else if (heat >= 50) who = 'На тебя есть бумаги. Детектив по фамилии Райли. Он не торопится — знает, что ты сам придёшь.';
    else if (heat >= 20) who = 'Пара жалоб. Ничего серьёзного. Пока. Участковый запомнил твоё лицо. На всякий случай.';
    else who = 'На тебя ничего нет. Или делают вид. В этом городе бумаги горят быстрее, чем люди.';

    Engine.log('Дежурный долго смотрит в картотеку. Потом отдаёт папку. Ты платишь. Он запоминает.', 'info');
    Engine.log(who, 'lore');
    Time.spend(1);
    if (!State.player || !State.city || State.deathRecord) return false;
    Save.save();
    Engine.render();
    return true;
  },

  bribeDesk() {
    if (!State.player) return false;
    const heat = State.player.heat || 0;
    const price = 500 + heat * 20;
    if (heat <= 0) { Engine.log('Дежурный смотрит на тебя как на сумасшедшего. «Что мне взять? Тебя?»', 'warn'); return false; }
    if (!Economy.spend(price, 'Подкуп дежурного')) return false;

    const chance = Math.max(0.2, 1 - heat / 120);
    if (Utils.chance(chance)) {
      Economy.changeHeat(-10, 'Дежурный подчистил');
      Engine.log('Конверт исчезает в столе. Дежурный не поднимает глаз. «Я тебя не видел. Ты меня тоже».', 'good');
    } else {
      Economy.changeHeat(5, 'Дежурный вызвал начальство');
      Engine.log('Дежурный отодвигает конверт. «Это к начальству». Он тянется к телефону. Ты уходишь быстрее, чем он успевает набрать номер.', 'bad');
    }

    Time.spend(0.5);
    if (!State.player || !State.city || State.deathRecord) return false;
    Save.save();
    Engine.render();
    return true;
  },

  sit() {
    if (!State.player) return false;
    if (!Time.canSpend(2)) { Engine.log('Слишком поздно. Иди домой.', 'warn'); return false; }

    const line = Utils.pick(this.SIT_LINES);
    Engine.log(line, 'lore');
    Engine.log('Ты просто сидишь. Никто не спрашивает, зачем ты здесь. Это и есть участок.', 'muted');

    Time.spend(2);
    if (!State.player || !State.city || State.deathRecord) return false;
    Economy.changeRep(-1, 'Вас видели в участке');
    Save.save();
    Engine.render();
    return true;
  },

  surrender() {
    if (!State.player) return false;
    const heat = State.player.heat || 0;
    if (heat < 40) { Engine.log('Тебе нечего сдавать. За тобой ничего нет.', 'warn'); return false; }
    if (heat >= 70) { Engine.log('Поздно. Они уже не спрашивают.', 'bad'); return false; }
    Engine.log('Ты кладёшь ладони на стойку. Дежурный смотрит. Потом кивает.', 'bad');
    if (typeof JailSystem !== 'undefined') {
      let days = 3;
      if (State.flags && State.flags.killedCop) { days += 7; delete State.flags.killedCop; }
      JailSystem.start(days);
    }
    return true;
  }
};
