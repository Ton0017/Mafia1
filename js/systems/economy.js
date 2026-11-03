const Economy = {
  earn(amount, reason) {
    if (typeof amount !== 'number' || !isFinite(amount) || amount <= 0) return;
    State.player.money += amount;
    if (!State.player.lifetime) State.player.lifetime = { kills: 0, moneyEarned: 0, missionsDone: 0, daysSurvived: 0, deaths: 0, overdoses: 0, breakdowns: 0 };
    State.player.lifetime.moneyEarned += amount;
    if (reason) Engine.log('+' + Utils.fmtMoney(amount) + '$ — ' + reason, 'good');
    Save.save();
    Engine.updateTopbar();
  },

  spend(amount, reason) {
    if (typeof amount !== 'number' || !isFinite(amount) || amount <= 0) return true;
    if (State.player.money < amount) {
      Engine.log('Недостаточно денег. Нужно $' + Utils.fmtMoney(amount) + '.', 'bad');
      return false;
    }
    State.player.money -= amount;
    if (reason) Engine.log('−' + Utils.fmtMoney(amount) + '$ — ' + reason, 'warn');
    Save.save();
    Engine.updateTopbar();
    return true;
  },

  changeHeat(delta, reason) {
    if (!delta) return;
    const before = State.player.heat;
    State.player.heat = Utils.clamp((State.player.heat || 0) + delta, 0, 100);
    if (reason) Engine.log(reason, delta > 0 ? 'warn' : 'good');
    if (State.player.heat >= 80 && before < 80) {
      Engine.log('Внимание: тебя ищут всерьёз.', 'bad');
      State.flags.highHeat = true;
    }
    if (State.player.heat < 50 && State.flags.highHeat) State.flags.highHeat = false;
    Engine.updateTopbar();
    Save.save();
  },

  changeRep(delta, reason) {
    if (!delta) return;
    State.player.reputation = Math.max(0, (State.player.reputation || 0) + delta);
    if (reason) Engine.log(reason, delta > 0 ? 'good' : 'bad');
    Engine.updateTopbar();
    Save.save();
  },

  addXp(amount) {
    if (typeof amount !== 'number' || !isFinite(amount) || amount <= 0) return;
    if (typeof State.player.xp !== 'number') State.player.xp = 0;
    if (typeof State.player.xpNext !== 'number' || State.player.xpNext <= 0) State.player.xpNext = 100;
    State.player.xp += amount;
    while (State.player.xp >= State.player.xpNext) {
      State.player.xp -= State.player.xpNext;
      State.player.level++;
      State.player.xpNext = Math.round(State.player.xpNext * 1.5);
      Engine.log('Уровень ' + State.player.level + '!', 'good');
      if (typeof Perks !== 'undefined' && Perks.hasNew()) {
        Engine.log('Доступен новый перк! Зайди в профиль.', 'warn');
      }
    }
    Save.save();
  },

  dailyIncome() {
    let income = 0;
    const breakdown = [];

    for (const zone of State.zones) {
      if (zone.ownerId === 'player') income += zone.income;
    }
    if (income > 0) breakdown.push('зоны +' + Utils.fmtMoney(income));

    let businessIncome = 0;
    for (const b of State.businesses) businessIncome += b.income;
    
    // Лоббирование: мэр забирает 20% дохода бизнесов
    if (State.politics && State.politics.lobbyUntil && State.time.day < State.politics.lobbyUntil) {
      businessIncome = Math.round(businessIncome * 0.8);
    }
    
    income += businessIncome;
    if (businessIncome > 0) breakdown.push('бизнесы +' + Utils.fmtMoney(businessIncome));

    let moduleIncome = 0;
    if (State.building && State.building.modules) for (const [id, mod] of Object.entries(State.building.modules)) {
      if (mod.level > 0) {
        const def = Buildings.modules[id];
        if (def && def.effects && def.effects.income) moduleIncome += def.effects.income * mod.level;
      }
    }
    income += moduleIncome;
    if (moduleIncome > 0) breakdown.push('здание +' + Utils.fmtMoney(moduleIncome));

    if (income > 0) this.earn(income, 'дневной доход (' + breakdown.join(', ') + ')');
    else Engine.log('Доход нулевой. Пора что-то с этим делать.', 'info');

    // Налог зависит от мэра и лобби
    let tax = 100 + Math.round(income * 0.1);
    if (typeof Politics !== 'undefined') {
      const taxMod = Politics.getTaxModifier();
      tax = Math.round(tax * taxMod);
      // Лоббирование снижает налог на 50%
      if (State.politics.lobbyUntil && State.time.day < State.politics.lobbyUntil) {
        tax = Math.round(tax * 0.5);
      }
    }
    if (!this.spend(tax, 'ежедневные расходы (крыша, аренда)')) {
      this.changeHeat(5, 'Налог не заплачен. Крыша недовольна.');
      if (Utils.chance(0.3)) {
        Engine.log('Крыша напомнила о себе. Грубо.', 'bad');
        State.player.body.torso.hp = Math.max(0, State.player.body.torso.hp - 15);

        // ═══ БАГ #30: если налог убил — сразу фиксируем смерть ═══
        if (State.player.body.torso.hp <= 0) {
          Engine.log('Ты не пережил визит крыши.', 'bad');
          if (typeof DeathSystem !== 'undefined') {
            DeathSystem.fullRestart();
            return;
          }
        }
      }
      // БАГ #33: при неоплате — уходим в долг (минус)
      if (State.player.money >= 0) {
        State.player.money -= tax;
        Engine.log('Ты занял у крыши. Теперь должен $' + Utils.fmtMoney(tax) + '.', 'bad');
      }
    }

    // Долг — обрабатываем
    if (State.player.money < 0) this.handleDebt();
  },

  handleDebt() {
    Engine.log('Ты в долгах. Кредиторы начинают нервничать.', 'bad');
    this.changeRep(-5);
    if (State.businesses.length > 0) {
      const b = State.businesses[0];
      State.businesses.shift();
      Engine.log('Пришлось продать «' + (Buildings.businesses[b.type]?.name || b.type) + '».', 'bad');
      State.player.money += Math.round((b.buyPrice || 0) * 0.5);
    }
    State.player.money = Math.max(0, State.player.money);
  },
};
