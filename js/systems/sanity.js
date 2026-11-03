const Sanity = {
  tick() {
    const s = State.player.sanity;
    if (!s) return;

    // Стресс медленно спадает, если ничего не происходит
    if (s.stress > 0 && Utils.chance(0.1)) s.stress = Math.max(0, s.stress - 1);

    // Высокий стресс бьёт по рассудку
    if (s.stress > 70 && Utils.chance(0.05)) {
      s.sanity = Math.max(0, s.sanity - 1);
    }

    // Рассудок < 50: галлюцинации
    if (s.sanity < 50) {
      s.hallucinations = true;
      if (Utils.chance(0.03)) {
        Engine.log(Utils.pick(Lore.noir.hallucination), 'bad');
        // #37: hallucinationPenalty был мёртвым полем, эффект реализован через getCombatPenalties (sanity < 50)
      }
    } else {
      s.hallucinations = false;
    }

    // Рассудок = 0: срыв
    if (s.sanity <= 0 && !s.breakdownActive) {
      this.triggerBreakdown();
    }
  },

  // Триггеры падения рассудка
  onKill() {
    if (!State.player || !State.player.sanity) return;
    const s = State.player.sanity;
    s.killsToday++;
    const loss = s.killsToday === 1 ? 2 : 1;
    s.sanity = Math.max(0, s.sanity - loss);
    s.stress = Math.min(100, s.stress + 5);
    if (s.killsToday === 1) {
      Engine.log(Utils.pick(Lore.noir.kill_trauma), 'lore');
    }
    Save.save();
  },

  onBloodyEvent(amount) {
    if (!State.player || !State.player.sanity) return;
    const s = State.player.sanity;
    // Фикс: рассудок не выше 100, стресс не ниже 0
    s.sanity = Utils.clamp(s.sanity - amount, 0, 100);
    s.stress = Utils.clamp(s.stress + Math.round(amount * 1.5), 0, 100);
    if (s.sanity < 30 && Utils.chance(0.3)) {
      Engine.log('Ты чувствуешь, как что-то внутри ломается.', 'bad');
    }
  },

  onWitnessDeath() {
    this.onBloodyEvent(5);
  },

  onTorture() {
    this.onBloodyEvent(10);
  },

  // Восстановление
  onRest(amount = 5) {
    if (!State.player || !State.player.sanity) return;
    const s = State.player.sanity;
    s.sanity = Math.min(100, s.sanity + amount);
    s.stress = Math.max(0, s.stress - amount * 2);
  },

  onSex() {
    if (!State.player || !State.player.sanity) return;
    const s = State.player.sanity;
    s.sanity = Math.min(100, s.sanity + 15);
    s.stress = Math.max(0, s.stress - 30);
    Engine.log('Ненадолго — мир становится нормальным.', 'good');
  },

  onDrink() {
    if (!State.player || !State.player.sanity) return;
    const s = State.player.sanity;
    s.stress = Math.max(0, s.stress - 15);
  },

  // Срыв
  triggerBreakdown() {
    if (!State.player || !State.player.sanity) return;
    if (!State.player.lifetime) State.player.lifetime = { kills: 0, moneyEarned: 0, missionsDone: 0, daysSurvived: 0, deaths: 0, overdoses: 0, breakdowns: 0 };
    const s = State.player.sanity;
    s.breakdownActive = true;
    Engine.log('— СРЫВ —', 'bad');
    Engine.log(Utils.pick(Lore.noir.breakdown), 'lore');
    State.player.lifetime.breakdowns++;

    // Случайный эффект
    const roll = Math.random();
    if (roll < 0.3) {
      // Очнулся в незнакомом месте, потерял деньги
      const loss = Math.round(State.player.money * 0.2);
      State.player.money -= loss;
      Engine.log('Ты очнулся в подворотне. В кармане на $' + Utils.fmtMoney(loss) + ' меньше.', 'bad');
    } else if (roll < 0.6) {
      // Потерял предмет
      if (State.player.inventory.food > 0) State.player.inventory.food--;
      if (State.player.inventory.water > 0) State.player.inventory.water--;
      Engine.log('Ты не помнишь, куда дел припасы. Их нет.', 'bad');
    } else {
      // «Убил кого-то без памяти»
      State.player.heat = Math.min(100, State.player.heat + 15);
      State.player.lifetime.kills++;
      Engine.log('На руках кровь. Ты не помнишь, чья.', 'bad');
    }

    // Восстановление после срыва
    s.sanity = 30;
    s.stress = 50;
    s.breakdownActive = false;
    Save.save();
  },

  // Дебаффы для боя
  getCombatPenalties() {
    const pen = { accuracy: 0, initiative: 0, log: [] };
    if (!State.player || !State.player.sanity) return pen;
    const s = State.player.sanity;
    if (s.stress > 70) {
      pen.accuracy -= 0.05;
      pen.log.push('Руки дрожат от напряжения.');
    }
    if (s.sanity < 50) {
      pen.accuracy -= 0.10;
      pen.log.push('Мир двоится. Ты не уверен, куда целишься.');
    }
    if (s.sanity < 25) {
      // #36: initiative пока не используется в бою (нет механики инициативы)
      pen.accuracy -= 0.05;
      pen.log.push('Голоса в голове. Один из них смеётся.');
    }
    return pen;
  },
};
