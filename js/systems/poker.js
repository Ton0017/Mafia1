const Poker = {
  MAX_GAMES: 3,
  ANTE: 50,
  MIN_RAISE: 100,
  MAX_RAISE: 1000,
  RAKE: 0.05,

  canPlay() {
    if (!State.player) return false;
    if ((State.player.pokerGamesToday || 0) >= this.MAX_GAMES) return false;
    return true;
  },

  // Сесть за стол (анте $50)
  sitDown() {
    if (!this.canPlay()) {
      Engine.log('Дилер качает головой. «На сегодня хватит».', 'warn');
      return;
    }
    if (typeof State.player.money !== 'number' || State.player.money < this.ANTE) {
      Engine.log('Не хватает $50 на анте.', 'warn');
      return;
    }

    State.player.money -= this.ANTE;
    State.player.pokerGamesToday = (State.player.pokerGamesToday || 0) + 1;

    if (typeof Cards === 'undefined') { Engine.log('Карты недоступны.', 'warn'); return; }
    const deck = Cards.shuffle(Cards.newDeck());
    const playerHand = [deck.pop(), deck.pop()];
    const dealerHand = [deck.pop(), deck.pop()];

    State.poker = {
      stage: 'preflop',
      playerHand,
      dealerHand: null,
      community: [],
      deck: deck,
      playerBet: this.ANTE,
      pot: this.ANTE,
      result: null,
      netGain: 0,
      dealer: (typeof PokerNPCsData !== 'undefined') ? PokerNPCsData.randomDealer() : null,
      npcs: []
    };

    // NPC за столом
    if (typeof PokerNPCsData !== 'undefined') {
      const picked = PokerNPCsData.pickPlayers(2);
      for (const npc of picked) {
        State.poker.npcs.push({
          id: npc.id,
          name: npc.name,
          style: npc.style,
          caution: npc.caution,
          aggression: npc.aggression,
          bluff: npc.bluff,
          lines: npc.lines,
          hand: [deck.pop(), deck.pop()],
          bet: this.ANTE,
          stack: 500 + Math.floor(Math.random() * 1500),
          status: 'waiting',
          line: npc.lines.think,
          folded: false
        });
        State.poker.pot += this.ANTE;
      }
    }

    Engine.log('Ты садишься за стол. Анте $' + this.ANTE + '.', 'lore');
    if (State.poker.dealer) Engine.log(State.poker.dealer.lines.sit, 'lore');
    if (State.poker.npcs.length > 0) {
      const names = State.poker.npcs.map(n => n.name).join(', ');
      Engine.log('За столом: ' + names + '.', 'info');
    }
    Engine.log('Твои карты: ' + Cards.showHand(playerHand), 'info');
    Engine.log('В банке: $' + State.poker.pot + '.', 'info');
    Save.save();
    Engine.go('pokerTable');
  },

  // Сбросить карты
  fold() {
    if (!State.poker) return;
    const s = State.poker;
    s.stage = 'result';
    s.result = 'fold';
    s.netGain = -s.playerBet;
    Engine.log('Ты сбрасываешь карты. Дилер забирает стол молча.', 'bad');
    if (s.dealer) Engine.log(s.dealer.lines.fold, 'lore');
    Save.save();
    Engine.render();
  },

  // Уравнять текущую ставку
  call() {
    if (!State.poker) return;
    const s = State.poker;
    const toCall = 50;
    if (typeof State.player.money !== 'number' || State.player.money < toCall) {
      Engine.log('Не хватает денег на уравнивание.', 'warn');
      return;
    }
    State.player.money -= toCall;
    s.playerBet += toCall;
    s.pot += toCall;
    Engine.log('Ты уравниваешь. +$' + toCall + ' в банк.', 'info');
    if (s.dealer) Engine.log(s.dealer.lines.call, 'lore');
    this._afterPlayerAction();
  },

  // Поднять (ввод суммы)
  raise(amount) {
    if (!State.poker) return;
    const s = State.poker;
    amount = parseInt(amount);
    if (!amount || isNaN(amount)) { Engine.log('Введи сумму.', 'warn'); return; }
    if (amount < this.MIN_RAISE) { Engine.log('Минимальная ставка: $' + this.MIN_RAISE, 'warn'); return; }
    if (amount > this.MAX_RAISE) { Engine.log('Максимальная ставка: $' + this.MAX_RAISE, 'warn'); return; }
    if (typeof State.player.money !== 'number' || amount > State.player.money) { Engine.log('У тебя нет столько денег.', 'warn'); return; }

    State.player.money -= amount;
    s.playerBet += amount;
    s.pot += amount;
    Engine.log('Ты поднимаешь на $' + amount + '.', 'info');
    if (s.dealer) Engine.log(s.dealer.lines.raise, 'lore');
    this._afterPlayerAction();
  },

  // Оценка силы руки: доля побед против случайной руки (7 попыток)
  _handStrength(hand) {
    if (typeof Cards === 'undefined') return 0.5;
    let wins = 0;
    const N = 7;
    for (let i = 0; i < N; i++) {
      const deck = Cards.shuffle(Cards.newDeck());
      const opp = [deck.pop(), deck.pop()];
      if (Cards.compare(hand, opp) > 0) wins++;
    }
    return wins / N;
  },

  // NPC принимает решение по характеру
  _npcDecide(npc, currentBet) {
    const strength = this._handStrength(npc.hand);
    const bluffing = Math.random() < npc.bluff && strength < 0.5;
    const eff = bluffing ? 0.75 : strength;
    const toCall = Math.max(0, currentBet - npc.bet);

    if (!bluffing && eff < npc.caution * 0.55) {
      return { action: 'fold', amount: 0 };
    }
    if (eff > 0.5 && Math.random() < npc.aggression) {
      const raise = Math.min(200, Math.max(0, npc.stack));
      return { action: 'raise', amount: raise };
    }
    return { action: 'call', amount: toCall };
  },

  // После действия игрока: NPC действуют, потом следующая улица
  _afterPlayerAction() {
    const s = State.poker;

    for (const npc of s.npcs) {
      if (npc.folded) continue;
      const d = this._npcDecide(npc, s.playerBet);
      if (d.action === 'fold') {
        npc.folded = true;
        npc.status = 'folded';
        npc.line = npc.lines.fold;
      } else if (d.action === 'raise') {
        const r = Math.min(d.amount, npc.stack);
        npc.bet += r;
        npc.stack -= r;
        s.pot += r;
        npc.status = 'raised';
        npc.line = npc.lines.raise;
      } else {
        const c = Math.min(50, npc.stack);
        npc.bet += c;
        npc.stack -= c;
        s.pot += c;
        npc.status = 'called';
        npc.line = npc.lines.call;
      }
    }

    for (const npc of s.npcs) {
      if (npc.line) Engine.log(npc.line, 'info');
    }

    this._nextStage();
  },

  // Открыть следующую улицу или вскрытие
  _nextStage() {
    const s = State.poker;
    const alive = s.npcs.filter(n => !n.folded);
    if (alive.length === 0) {
      s.stage = 'result';
      s.result = 'win_all_fold';
      s.netGain = s.pot - s.playerBet;
      State.player.money += s.pot;
      Engine.log('Все сбрасывают. Ты забираешь банк: +$' + s.netGain + '.', 'good');
      Save.save();
      Engine.render();
      return;
    }

    if (s.stage === 'preflop') {
      s.community.push(s.deck.pop(), s.deck.pop(), s.deck.pop());
      s.stage = 'flop';
      Engine.log('Флоп: ' + Cards.showHand(s.community) + '.', 'lore');
    } else if (s.stage === 'flop') {
      s.community.push(s.deck.pop());
      s.stage = 'turn';
      Engine.log('Тёрн: ' + Cards.show(s.community[3]) + '.', 'lore');
    } else if (s.stage === 'turn') {
      s.community.push(s.deck.pop());
      s.stage = 'river';
      Engine.log('Ривер: ' + Cards.show(s.community[4]) + '.', 'lore');
    } else if (s.stage === 'river') {
      this._showdown();
      return;
    }

    Engine.log('В банке: $' + s.pot + '.', 'info');
    Save.save();
    Engine.render();
  },

  // Вскрытие: сравнить 5-7 карт у всех живых
  _showdown() {
    const s = State.poker;
    s.stage = 'result';

    Engine.log('Вскрытие.', 'lore');
    Engine.log('Стол: ' + Cards.showHand(s.community) + '.', 'info');

    let best = { isPlayer: true, hand: s.playerHand.concat(s.community), eval: null, name: 'Ты' };
    best.eval = Cards.evaluate(best.hand);
    Engine.log('Ты: ' + Cards.showHand(s.playerHand) + ' → ' + Cards.describe(best.hand) + '.', 'info');

    for (const npc of s.npcs) {
      if (npc.folded) continue;
      const full = npc.hand.concat(s.community);
      const ev = Cards.evaluate(full);
      Engine.log(npc.name + ': ' + Cards.showHand(npc.hand) + ' → ' + Cards.describe(full) + '.', 'info');
      if (Cards._cmpEval(ev, best.eval) > 0) {
        best = { isPlayer: false, npc, hand: full, eval: ev, name: npc.name };
      }
    }

    const rakeCut = Math.round(s.pot * this.RAKE);

    if (best.isPlayer) {
      const prize = s.pot - rakeCut;
      State.player.money += prize;
      s.result = 'win';
      s.netGain = prize - s.playerBet;
      Engine.log('Ты выигрываешь с рукой: ' + Cards.describe(best.hand) + '. +$' + s.netGain + ' (рейк $' + rakeCut + ').', 'good');
      for (const npc of s.npcs) {
        if (!npc.folded) Engine.log(npc.lines.lose, 'info');
      }
    } else {
      s.result = 'lose';
      s.netGain = -s.playerBet;
      Engine.log(best.npc.lines.win, 'bad');
      Engine.log('Ты проигрываешь $' + s.playerBet + '. Победил ' + best.npc.name + ' с рукой ' + Cards.describe(best.hand) + '.', 'bad');
    }

    if (typeof PokerNPCsData !== 'undefined') {
      Engine.log(PokerNPCsData.randomSpectatorLine(), 'muted');
    }

    Time.spend(0.5);
    if (!State.player || !State.city) return;
    Save.save();
    Engine.render();
  },

  leave() {
    State.poker = null;
    Engine.go('bar');
  }
};
