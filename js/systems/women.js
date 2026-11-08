const WomenSystem = {
  init() {
    if (!State.player) return;
    if (!State.player.womenAffection) {
      State.player.womenAffection = { lily: 0, evelyn: 0, vivian: 0 };
    }
    if (!State.player.relationship) {
      State.player.relationship = { lily: null, evelyn: null, vivian: null };
    }
  },

  getGirl(id) {
    if (typeof WomenData === 'undefined' || !WomenData.getGirl) return null;
    const girl = WomenData.getGirl(id);
    if (!girl) {
      Engine.log('Девушки с id "' + id + '" не существует.', 'bad');
      return null;
    }
    return girl;
  },
  
  getAffection(id) {
    this.init();
    return State.player.womenAffection[id] || 0;
  },

  increaseAffection(id, amount) {
    this.init();
    State.player.womenAffection[id] = Math.min(100, (State.player.womenAffection[id] || 0) + amount);
    Save.save();
  },

  isRomanceDone(id) {
    this.init();
    return State.player.relationship[id] !== null;
  },

  markRomanceDone(id) {
    this.init();
    State.player.relationship[id] = 'lover'; // Статус любовницы
    Save.save();
  },

  // Проверка на ссору (вызывается каждый новый день)
  checkFights() {
    if (!State.player) return;
    this.init();
    if (typeof WomenData === 'undefined' || !WomenData.getAll) return;
    if (!State.player.sanity) State.player.sanity = { sanity: 100, stress: 0, killsToday: 0, lastResetDay: 0, nightmares: 0 };
    const girls = WomenData.getAll();
    
    for (const girl of girls) {
      const status = State.player.relationship[girl.id];
      if (status === 'lover') {
        // Каждый день симпатия падает на 3 (она ждет внимания)
        State.player.womenAffection[girl.id] = Math.max(0, (State.player.womenAffection[girl.id] || 0) - 3);
        
        // Если симпатия упала ниже 30 — ссора
        if (State.player.womenAffection[girl.id] < 30) {
          Engine.log('⚠ ССОРА С ' + girl.name.toUpperCase() + '!', 'bad');
          Engine.log('Она кричит, что ты её не ценишь. В гневе она выгребает деньги из твоего бумажника.', 'bad');
          
          // Штраф
          State.player.money = Math.max(0, (State.player.money || 0) - 500);
          State.player.sanity.stress = Utils.clamp((State.player.sanity.stress || 0) + 20, 0, 100);
          
          State.player.relationship[girl.id] = 'ex'; // Теперь она "бывшая"
          Engine.log('Она уходит, хлопнув дверью. Отношения разорваны.', 'bad');
          Save.save();
        }
      }
    }
  },

  canInteract(id) {
    if (!State.player) return false;
    this.init();
    if (!State.player.womenVisits) State.player.womenVisits = {};
    
    // Не больше 2 любых действий в день
    let visitsToday = 0;
    for (const key in State.player.womenVisits) {
      if (State.player.womenVisits[key] === State.time.day) visitsToday++;
    }
    if (visitsToday >= 2) return false;

    const lastVisit = State.player.womenVisits[id + '_interact'] || 0;
    return lastVisit < State.time.day;
  },

  markVisit(id) {
    if (!State.player) return;
    if (!State.player.womenVisits) State.player.womenVisits = {};
    State.player.womenVisits[id + '_interact'] = State.time.day;
  },

  giveGift(id) {
    const girl = this.getGirl(id);
    if (!girl) return;
    const status = State.player.relationship ? State.player.relationship[id] : null;
    
    if (!this.canInteract(id)) {
      Engine.log('Ты уже подходил к ней сегодня.', 'warn');
      return;
    }
    
    // Если она в ссоре (ex), подарок в 2 раза дороже
    let cost = girl.giftCost;
    if (status === 'ex') {
      cost *= 2;
      Engine.log('Она смотрит на тебя с презрением. Чтобы вернуть её, нужно нечто большее.', 'warn');
    }
    
    if (!Economy.spend(cost, 'Подарок для ' + girl.name)) return;
    
    // Примирение восстанавливает симпатию
    if (status === 'ex') {
      this.init();
      State.player.relationship[id] = 'lover';
      State.player.womenAffection[id] = 40; // Начинаем заново с 40
      Engine.log('Она смягчается. «Ладно. Но это в последний раз». Вы снова вместе.', 'good');
    } else {
      this.increaseAffection(id, Utils.rnd(15, 25));
      Engine.log('Ты даришь ей дорогую безделушку. Она улыбается.', 'good');
    }
    
    this.markVisit(id);
    Time.spend(1);
    if (!State.player || !State.city) return; // #47
    Engine.go('barGirls');
  },

  date(id) {
    const girl = this.getGirl(id);
    if (!girl) return;
    const aff = this.getAffection(id);
    const status = State.player.relationship ? State.player.relationship[id] : null;

    if (!this.canInteract(id)) {
      Engine.log('Ты уже подходил к ней сегодня.', 'warn');
      return;
    }
    
    if (status === 'ex') {
      Engine.log('Она развернулась и ушла. Сначала нужно помириться (купи подарок).', 'warn');
      return;
    }

    if (aff < 30) {
      Engine.log('Она холодна. «Может, в другой раз».', 'warn');
      return;
    }

    const cost = status === 'lover' ? 0 : girl.giftCost * 2; 
    if (cost > 0 && !Economy.spend(cost, 'Свидание с ' + girl.name)) return;

    this.markVisit(id);
    if (!State.player.sanity) State.player.sanity = { sanity: 100, stress: 0, killsToday: 0, lastResetDay: 0, nightmares: 0 };
    State.player.sanity.stress = Math.max(0, (State.player.sanity.stress || 0) - 20);
    this.increaseAffection(id, 10); // Каждое свидание чуток поднимает симпатию

    // #51: используем НОВОЕ значение симпатии (после increaseAffection)
    const newAff = this.getAffection(id);
    if (newAff >= 80 && !this.isRomanceDone(id)) {
      // ПЕРВАЯ НОЧЬ
      Engine.log('— ПЕРВАЯ НОЧЬ С ' + girl.name.toUpperCase() + ' —', 'good');
      Engine.log(girl.romanceText, 'lore');
      if (!State.flags) State.flags = {};
      State.flags.showSexScene = true;
      this.markRomanceDone(id);
      State.player.sanity.sanity = 100;
      State.player.sanity.stress = 0;
      Economy.changeRep(5, 'Слухи о твоей личной жизни');
      State.player.womenAffection[id] = 100; // Влюблена
    } else {
      Engine.log('Вы проводите вечер вместе. Это становится твоей привычкой.', 'good');
    }

    Time.spend(3);
    if (!State.player || !State.city) return; // #48
    Engine.go('barGirls');
  },

  // Ночка с любовницей (регулярно)
  sleepWith(id) {
    const girl = this.getGirl(id);
    if (!girl) return;
    const status = State.player.relationship ? State.player.relationship[id] : null;
    
    if (status !== 'lover') {
      Engine.log('Она не твоя. Пока. Сначала завоюй её.', 'warn');
      return;
    }
    
    Engine.log('Ты остаешься у ' + girl.name + ' на ночь. Дождь стучит по стеклу, но тебе тепло.', 'good');
    if (!State.flags) State.flags = {};
    State.flags.showSexScene = true;
    if (!State.player.sanity) State.player.sanity = { sanity: 100, stress: 0, killsToday: 0, lastResetDay: 0, nightmares: 0 };
    State.player.sanity.stress = Math.max(0, (State.player.sanity.stress || 0) - 50);
    this.increaseAffection(id, 5); // Небольшой плюс за внимание
    Time.spend(4);
    if (!State.player || !State.city) return; // #49
    Engine.go('barGirls');
  },

  dangerClient() {
    this.markVisit('lily');
    const enemy = Combat.spawnEnemy((State.player.level || 1) + 1, { affiliation: 'civilian' });
    // #52: не перезаписываем имя — используем уникальное, добавляем атрибут мажора
    enemy.loot.money = 500;
    Engine.log('Мажор хватает Лили за руку. Ты вмешиваешься. Он тянется к бутылке.', 'bad');
    Time.spend(1, 'Драка в баре.');
    if (!State.player || !State.city) return; // #50
    Combat.start(enemy, { type: 'bar_fight', returnScreen: 'bar' });
  }
};
