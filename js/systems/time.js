const Time = {
  HOUR_END: 2,

  totalHours() { return State.time.day * 24 + State.time.hour; },
  now() { return State.time.day * 100 + State.time.hour; },

  advance(hours) {
    if (hours <= 0) return;
    if (!State.player || !State.city) return;
    for (let i = 0; i < hours; i++) {
      State.time.hour++;
      if (State.time.hour >= 24) {
        State.time.hour = 0;
        State.time.day++;
        this.onNewDay();
      }
      this.onHourTick();
      if (!State.player || !State.city) return; // смерть посреди advance
    }
    Save.save();
    if (typeof Engine !== 'undefined') Engine.updateTopbar();
  },

  canSpend(hours) {
    const h = State.time.hour;
    if (h >= this.HOUR_END && h < 6) return false;
    return true;
  },

  spend(hours, action) {
    if (!this.canSpend(hours)) {
      Engine.log('Слишком поздно. Иди спать.', 'warn');
      return false;
    }
    if (action) Engine.log(action, 'info');
    this.advance(hours);
    return true;
  },

  onHourTick() {
    if (!State.player || !State.city) return;
    if (typeof Survival !== 'undefined') Survival.tick();
    if (!State.player || !State.city) return;
    if (typeof Diseases !== 'undefined') Diseases.tick();
    if (!State.player || !State.city) return;
    if (typeof Sanity !== 'undefined') Sanity.tick();
    if (!State.player || !State.city) return;
    if (typeof Drugs !== 'undefined') Drugs.tick();
    if (!State.player || !State.city) return;
    if (typeof Wounds !== 'undefined') Wounds.tick();
    if (!State.player || !State.city) return;
    if (typeof Building !== 'undefined' && Building.tickUpgrades) Building.tickUpgrades();
    if (typeof Hire !== 'undefined' && Hire.tickMissions) Hire.tickMissions();
    if (!State.player || !State.city) return;
    if (typeof ZonesSystem !== 'undefined' && ZonesSystem.tickCaptures) ZonesSystem.tickCaptures();
    if (!State.player || !State.city) return;
    if (typeof Quests !== 'undefined' && Quests.tickDeadlines) Quests.tickDeadlines();
    if (typeof EventsSystem !== 'undefined' && EventsSystem.tick) EventsSystem.tick();
  },


  _printNewspaper() {
    const lines = [];
    
    // 1. МЭР — про налоги/порядки
    if (typeof Politics !== 'undefined' && State.mayor) {
      const m = State.mayor;
      if (m.type === 'corrupt') lines.push('Мэр ' + m.name + ' снова снизил налоги для богатых. Бедные не заметили.');
      else if (m.type === 'honest') lines.push('Мэр ' + m.name + ' объявил войну уличной преступности. Копы работают сверхурочно.');
      else if (m.type === 'paranoid') lines.push('Мэр ' + m.name + ' подозревает заговор. Он сменил охрану третий раз за месяц.');
      else lines.push('Мэрия ' + m.name + ' обещает перемены. Как обычно.');
    }
    
    // 2. ФРАКЦИИ — самая сильная и самая слабая
    if (State.factions && State.factions.length > 0) {
      const nonPolice = State.factions.filter(f => !f.isPolice);
      if (nonPolice.length > 0) {
        const strongest = nonPolice.reduce((a, b) => (a.zones || 0) > (b.zones || 0) ? a : b);
        const weakest = nonPolice.reduce((a, b) => (a.zones || 0) < (b.zones || 0) ? a : b);
        if (strongest && (strongest.zones || 0) > 0) {
          lines.push(strongest.name + ' набирает силу — уже ' + strongest.zones + ' зон под контролем.');
        }
        if (weakest && weakest !== strongest && (weakest.zones || 0) <= 1) {
          lines.push(weakest.name + ' дышит на ладан. Их почти выдавили с улиц.');
        }
      }
    }
    
    // 3. ИГРОК — слухи о тебе
    const p = State.player;
    if (p.heat > 50) lines.push('Полиция ищет человека. Приметы не разглашаются. Слухи — самые разные.');
    else if (p.heat > 20) lines.push('Копы патрулируют чаще. Люди шепчутся — кто-то засветился.');
    else if (p.reputation > 80) lines.push('В городе говорят о тебе с уважением. Даже копы здороваются.');
    else if (p.reputation > 30) lines.push('Твоё имя упоминают в барах. Пока нейтрально.');
    
    // 4. КРИМИНАЛЬНАЯ СВОДКА
    if (p.lifetime && p.lifetime.kills > 0) {
      const yesterday = Utils.chance(0.5);
      if (yesterday) lines.push('На Приморской нашли тело. Полиция ищет свидетелей. Свидетелей нет.');
    }
    
    // 5. МЕЛКИЕ СЛУХИ
    const rumors = [
      'Бармен из «Крысы» снова жалуется на посетителей. Говорят, кто-то не платит.',
      'На рынке поднялись цены. Торговцы ссылаются на банды.',
      'В порту опять что-то выгружали ночью. Таможня сделала вид, что не заметила.',
      'Умер старик, который знал всех. Похороны завтра.',
      'Кто-то видел мэра в баре. Не в том, что в центре.',
      'Говорят, в тюрьме сидит человек, который знает имя убийцы прокурора.',
      'Старый Кадиллак у мэрии стоит третий день. Никто не знает, чей он.',
    ];
    lines.push(Utils.pick(rumors));
    
    // Вывод: 3-4 строки, не больше
    if (lines.length > 0) {
      Engine.log('📰 ГАЗЕТА «НОКТАУН ТАЙМС»', 'lore');
      const shown = lines.slice(0, 4);
      for (const line of shown) {
        Engine.log('  ▸ ' + line, 'lore');
      }
    }
  },

  onNewDay() {
    if (!State.player) return;
    if (!State.player.lifetime) State.player.lifetime = { kills: 0, moneyEarned: 0, missionsDone: 0, daysSurvived: 0, deaths: 0, overdoses: 0, breakdowns: 0 };
    if (!State.player.sanity) State.player.sanity = { sanity: 100, stress: 0, killsToday: 0, lastResetDay: 0, nightmares: 0 };
    if (!State.player.dependencies) State.player.dependencies = { nicotine: 0, alcohol: 0, stimulants: 0, opiates: 0 };
    State.player.lifetime.daysSurvived++;
    State.player.sanity.killsToday = 0;
    State.player.barVisitsToday = 0;
    State.player.pokerGamesToday = 0;
    State.player.zoneVisitsToday = 0;
    State.player.idleEventsToday = 0;
    State.player.sanity.lastResetDay = State.time.day;  // используется для статистики

    Engine.log('— День ' + State.time.day + ' —', 'warn');
    if (State.city) {
      Engine.log(Utils.pick(Lore.noir.newDay), 'lore');
      if (Utils.chance(0.3)) State.city.weather = Utils.pick(Lore.weathers);
    }
    if (typeof Economy !== 'undefined') Economy.dailyIncome();
    if (!State.player) return;
    if (typeof Hire !== 'undefined') {
      if (Hire.payUpkeep) Hire.payUpkeep();
      if (Hire.refreshPoolIfNeeded) Hire.refreshPoolIfNeeded();
    }
    if (typeof Quests !== 'undefined' && Quests.resetDaily) Quests.resetDaily();
    if (typeof EventsSystem !== 'undefined' && EventsSystem.rollDaily) EventsSystem.rollDaily();
    if (typeof Faction !== 'undefined' && Faction.tick) Faction.tick();
    if (typeof CopSystem !== 'undefined' && CopSystem.roll) CopSystem.roll();
    // Heat медленно падает
    if (typeof Politics !== 'undefined' && Politics.checkElection) Politics.checkElection();
    if (typeof WomenSystem !== 'undefined' && WomenSystem.checkFights) WomenSystem.checkFights();
    if (State.player.heat > 0 && Utils.chance(0.3)) {
      State.player.heat = Math.max(0, State.player.heat - 1);
    }
    // Лёгкое восстановление рассудка за ночь в безопасности
    if (State.player.sanity.sanity < 100 && Utils.chance(0.5)) {
      State.player.sanity.sanity = Math.min(100, State.player.sanity.sanity + 2);
    }

    // ═══ УТРЕННЯЯ ГАЗЕТА ═══
    if (State.city) {
      this._printNewspaper();
    }

    // Естественное снижение зависимости
    const deps = State.player.dependencies;
    if (deps) {
      let decayed = false;
      for (const cat of ['nicotine', 'alcohol', 'stimulants', 'opiates']) {
        if (deps[cat] > 0) {
          deps[cat] = Math.max(0, deps[cat] - 2);
          if (deps[cat] === 0) decayed = true;
        }
      }
      if (decayed) Engine.log('Ты чувствуешь, что тело очищается. Зависимость отступила.', 'good');
    }
  },

  sleep() {
    if (!State.player) return;
    if (!State.player.survival) State.player.survival = { energy: 100, hunger: 100, thirst: 100, combatFatigue: 0 };
    if (!State.player.sanity) State.player.sanity = { sanity: 100, stress: 0, killsToday: 0, lastResetDay: 0, nightmares: 0 };
    const h = State.time.hour;
    let hoursToSleep = 0;
    if (h >= 6 && h < 22) hoursToSleep = 6;
    else if (h >= 22) hoursToSleep = (24 - h) + 6;
    else hoursToSleep = 6 - h;
    if (hoursToSleep < 1) hoursToSleep = 1;

    // #Fix: запрет спама сном (если не устал и не ночь)
    if (h >= 6 && h < 22 && State.player.survival.energy > 60) {
      Engine.log('Ты не устал. Спать средь бела дня? Найди себе дело.', 'warn');
      return;
    }

    // Предупреждение о голоде/жажде перед сном
    const s = State.player.survival;
    if (s.hunger < 20 || s.thirst < 20) {
      if (!confirm('Ты голоден или хочешь пить! Если уснёшь, можешь не проснуться. Всё равно спать?')) {
        return; // игрок отменил сон
      }
    }

    Engine.log(Utils.pick(['Ты засыпаешь под шум дождя. Город продолжает жить без тебя.', 'Ты закрываешь глаза. В темноте слышен только стук собственного сердца.', 'Сон приходит быстро. Слишком быстро. Как будто кто-то выключил свет.']), 'lore');

    // Кошмары при низком рассудке
    if (State.player.sanity.sanity < 40 && Utils.chance(0.4)) {
      Engine.log('Тебе снится что-то, чего ты не помнишь. Просыпаешься в холодном поту.', 'bad');
      // Safety net: не даём умереть от истощения, но не даём и полноценного отдыха
      State.player.survival.energy = Math.max(20, State.player.survival.energy);
      State.player.sanity.nightmares++;
    } else {
      if (typeof Survival !== 'undefined') Survival.sleepRecover(hoursToSleep);
    // Снимаем боевую усталость
    State.player.survival.combatFatigue = 0;
    }

    // Медпункт лечит травмы
    if (typeof Wounds !== 'undefined') Wounds.medbayHeal();
    // #60: медпункт лечит по хардкор-алгоритму (1-3 части, не все)
    if (typeof Building !== 'undefined' && State.building.modules.medbay.level > 0) {
      Building.applyModuleEffect('medbay', State.building.modules.medbay.level);
    }

    this.advance(hoursToSleep);
    // Если игрок умер во сне — city = null, остаёмся на экране смерти
    if (State.player && State.city) Engine.go('city');
  },
};
