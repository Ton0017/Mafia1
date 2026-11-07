// ═══ СИСТЕМА РАБОТЫ ═══
const WorkSystem = {
  MAX_PER_DAY: 2,

  getAvailable() {
    if (!State.player) return [];
    if ((State.player.workToday || 0) >= this.MAX_PER_DAY) return [];
    return WorkData;
  },

  canWork() {
    if (!State.player) return false;
    if ((State.player.workToday || 0) >= this.MAX_PER_DAY) return false;
    const s = State.player.survival;
    if (s && s.energy < 20) return false;
    return true;
  },

  apply(jobId) {
    if (!State.player) return false;
    if (!this.canWork()) {
      if ((State.player.workToday || 0) >= this.MAX_PER_DAY) {
        Engine.log('На сегодня хватит. Организм не железный.', 'warn');
      } else {
        Engine.log('Ты слишком устал. Нужно поспать.', 'warn');
      }
      return false;
    }
    const job = WorkData.find(j => j.id === jobId);
    if (!job) return false;

    if (!Time.canSpend(job.hours)) {
      Engine.log('Слишком поздно. Возьми работу утром.', 'warn');
      return false;
    }

    // Списываем энергию и платим
    const s = State.player.survival || { hunger: 100, thirst: 100, energy: 100, combatFatigue: 0 };
    State.player.survival = s;
    s.energy = Math.max(0, (s.energy || 0) - job.energyCost);

    // Платим
    Economy.earn(job.pay, 'Работа: ' + job.name);

    // Стресс
    if (job.stressChange && State.player.sanity) {
      State.player.sanity.stress = Math.max(0, (State.player.sanity.stress || 0) + job.stressChange);
    }
    // Heat/Rep
    if (job.heatChange) Economy.changeHeat(job.heatChange, '');
    if (job.repChange) Economy.changeRep(job.repChange, '');

    // Риск травмы
    if (job.injuryChance && Utils.chance(job.injuryChance)) {
      const parts = ['leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'torso'];
      const part = Utils.pick(parts);
      const dmg = Utils.rnd(5, 15);
      if (State.player.body && State.player.body[part]) {
        State.player.body[part].hp = Math.max(0, State.player.body[part].hp - dmg);
        Engine.log('Ты получил травму на работе (' + part + ' −' + dmg + ' HP).', 'bad');
      }
    }

    // Лог
    Engine.log(job.log, 'info');

    // Спецсобытие
    if (job.specialEvent === 'taxi_stranger') {
      this._taxiEvent();
    }

    State.player.workToday = (State.player.workToday || 0) + 1;

    // Время
    Time.spend(job.hours, 'Работа: ' + job.name);
    if (!State.player || !State.city) return true;

    Save.save();
    Engine.go('work');
    return true;
  },

  _taxiEvent() {
    const roll = Utils.random ? Utils.random() : Math.random();
    if (roll < 0.30) {
      Economy.earn(50, 'Щедрый пассажир');
      Engine.log('Пассажир оставляет щедрые чаевые. «Сдачи не надо».', 'good');
    } else if (roll < 0.50) {
      // Грабитель
      if (Utils.chance(0.5)) {
        if (Economy.spend(100, 'Грабитель в такси')) {
          Engine.log('Пассажир достал пистолет. Ты отдал $100. Живой.', 'bad');
        }
      } else {
        Engine.log('Пассажир угрожал пистолетом, но ты дал по газам и выкинул его.', 'warn');
        if (State.player.body && State.player.body.torso) {
          State.player.body.torso.hp = Math.max(0, State.player.body.torso.hp - 5);
        }
      }
    } else {
      Engine.log('Пассажир молчал всю дорогу. Выходя, назвал тебя по имени. Ты его не знаешь.', 'lore');
    }
  }
};
