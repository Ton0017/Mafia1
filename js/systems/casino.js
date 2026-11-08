// ═══ СИСТЕМА КАЗИНО ═══
const CasinoSystem = {
  enter() {
    if (!State.player) return false;
    const fee = CasinoData.ENTRY_FEE;
    if ((State.player.money || 0) < fee) {
      Engine.log('Не хватает $' + fee + ' на вход. Охрана смотрит на тебя с презрением.', 'warn');
      return false;
    }
    if (State.player.casinoSession && State.player.casinoSession.inside) {
      Engine.go('casino');
      return true;
    }
    if (!Economy.spend(fee, 'Вход в казино')) return false;
    Engine.log('Ты платишь $' + fee + ' на входе. Охранник кивает. Двери открываются.', 'lore');

    State.player.casinoSession = {
      inside: true,
      npcs: CasinoData.generateNpcs(),
      gamesPlayed: 0,
      totalWon: 0,
      totalLost: 0,
      enteredDay: State.time.day
    };

    Engine.log('Внутри — дым, свет люстр, звон монет. За столами сидят люди.', 'lore');
    Save.save();
    Engine.go('casino');
    return true;
  },

  leave() {
    if (State.player) State.player.casinoSession = null;
    Engine.go('city');
  },

  talkToNpc(npcId) {
    if (!State.player || !State.player.casinoSession) return;
    const npc = State.player.casinoSession.npcs.find(n => n.id === npcId);
    if (!npc) return;

    if (npc.type === 'rich') {
      Engine.log('«' + npc.name + '» смотрит на тебя. «Что надо? Я играю. Не мешай».', 'info');
    } else if (npc.type === 'old') {
      Engine.log('«' + npc.name + '»: «Я помню этот город другим. Тогда здесь можно было выиграть».', 'lore');
    } else if (npc.type === 'woman') {
      Engine.log('«' + npc.name + '» выпускает дым. «За $500 расскажу, кто в этом городе спит с кем».', 'info');
    } else if (npc.type === 'suspicious') {
      Engine.log('«' + npc.name + '» не отвечает. Просто смотрит. Потом отворачивается.', 'warn');
    } else if (npc.type === 'prostitute') {
      Engine.log('«' + npc.name + '» улыбается. «Ищешь компанию? $1000 — и я твоя на всю ночь».', 'info');
    }
    Save.save();
    Engine.render();
  },

  drink(drinkId) {
    if (!State.player) return;
    const drink = CasinoData.drinks.find(d => d.id === drinkId);
    if (!drink) return;
    if (!Economy.spend(drink.price, 'Напиток: ' + drink.name)) return;
    Engine.log(drink.log, 'good');
    if (State.player.sanity) {
      State.player.sanity.stress = Math.max(0, (State.player.sanity.stress || 0) - Math.abs(drink.stress));
    }
    if (State.player.dependencies) {
      State.player.dependencies.alcohol = Math.min(100, (State.player.dependencies.alcohol || 0) + drink.addiction);
    }
    Time.spend(0.25);
    if (!State.player || !State.city || State.deathRecord) return;
    Save.save();
    Engine.render();
  },

  smoke(cigarId) {
    if (!State.player) return;
    const cigar = CasinoData.cigars.find(c => c.id === cigarId);
    if (!cigar) return;
    if (!Economy.spend(cigar.price, 'Курение: ' + cigar.name)) return;
    Engine.log(cigar.log, 'good');
    if (State.player.sanity) {
      State.player.sanity.stress = Math.max(0, (State.player.sanity.stress || 0) - Math.abs(cigar.stress));
    }
    if (State.player.dependencies) {
      State.player.dependencies.nicotine = Math.min(100, (State.player.dependencies.nicotine || 0) + cigar.addiction);
    }
    Time.spend(0.25);
    if (!State.player || !State.city || State.deathRecord) return;
    Save.save();
    Engine.render();
  },

  buyProstitute(npcId) {
    if (!State.player || !State.player.casinoSession) return;
    const npc = State.player.casinoSession.npcs.find(n => n.id === npcId);
    if (!npc || npc.type !== 'prostitute') return;
    if (!Economy.spend(1000, 'Ночь с ' + npc.name)) return;
    if (State.player.sanity) {
      State.player.sanity.sanity = Math.min(100, (State.player.sanity.sanity || 0) + 20);
      State.player.sanity.stress = Math.max(0, (State.player.sanity.stress || 0) - 50);
    }
    Engine.log('Ты проводишь ночь с ' + npc.name + '. Мир становится чуть мягче.', 'good');
    if (!State.flags) State.flags = {};
    State.flags.showSexScene = true;
    Time.spend(4, 'Ночь с ' + npc.name);
    if (!State.player || !State.city || State.deathRecord) return;
    Save.save();
    Engine.go('casino');
  },

  // ═══ БЛЭКДЖЕК ═══
  _calcHand(hand) {
    let total = 0, aces = 0;
    for (const card of hand) {
      const v = Cards.rankValue(card.r);
      if (v === 14) { aces++; total += 11; }
      else if (v > 10) total += 10;
      else total += v;
    }
    while (total > 21 && aces > 0) { total -= 10; aces--; }
    return total;
  },

  startBlackjack(npcId, bet) {
    if (!State.player) return false;
    if (!State.player.casinoSession || !State.player.casinoSession.inside) {
      Engine.log('Ты не в казино.', 'warn');
      return false;
    }
    const npc = State.player.casinoSession.npcs.find(n => n.id === npcId);
    if (!npc) return false;
    if (State.player.blackjack) {
      Engine.log('Ты уже за столом.', 'warn');
      return false;
    }
    const cfg = CasinoData.blackjack;
    bet = Number(bet) || cfg.minBet;
    if (cfg.bets.indexOf(bet) === -1) bet = cfg.minBet;
    if ((State.player.money || 0) < bet) {
      Engine.log('Не хватает $' + bet + ' на ставку.', 'warn');
      return false;
    }
    if (!Time.canSpend(0.5)) {
      Engine.log('Слишком поздно.', 'warn');
      return false;
    }
    if (!Economy.spend(bet, 'Ставка в 21 против ' + npc.name)) return false;

    const deck = Cards.shuffle(Cards.newDeck());
    const playerHand = [deck.pop(), deck.pop()];
    const npcHand = [deck.pop(), deck.pop()];

    State.player.blackjack = {
      active: true,
      npc: { id: npc.id, name: npc.name, type: npc.type, hint: npc.hint },
      bet,
      deck,
      playerHand,
      npcHand,
      npcHidden: true,
      stage: 'player_turn',
      result: null,
      netGain: 0
    };

    Engine.log('Ты садишься напротив «' + npc.name + '». Ставка: $' + bet + '. Он смотрит на тебя без эмоций.', 'lore');
    Engine.log('Твои карты: ' + playerHand.map(c => c.r + c.s).join(' ') + ' (' + this._calcHand(playerHand) + ')', 'info');
    Engine.log('У «' + npc.name + '» на столе: ' + npcHand[0].r + npcHand[0].s + ' и карта рубашкой вверх.', 'info');
    Save.save();
    Engine.go('blackjack');
    return true;
  },

  blackjackHit() {
    if (!State.player || !State.player.blackjack) return;
    const g = State.player.blackjack;
    if (g.stage !== 'player_turn') return;
    if (!g.deck || g.deck.length < 5) g.deck = Cards.shuffle(Cards.newDeck()); // Перемешиваем, если мало карт
    g.playerHand.push(g.deck.pop());
    const total = this._calcHand(g.playerHand);
    Engine.log('Ты берёшь. ' + g.playerHand[g.playerHand.length - 1].r + g.playerHand[g.playerHand.length - 1].s + '. Сумма: ' + total + '.', 'info');
    if (total > 21) {
      Engine.log('Перебор. ' + total + ' — это слишком. Ты проиграл.', 'bad');
      this._resolveBlackjack('bust');
      return;
    }
    if (total === 21) {
      Engine.log('Двадцать одно! Ты останавливаешься.', 'good');
      this.blackjackStand();
      return;
    }
    Save.save();
    Engine.render();
  },

  blackjackStand() {
    if (!State.player || !State.player.blackjack) return;
    const g = State.player.blackjack;
    if (g.stage !== 'player_turn') return;
    g.stage = 'npc_turn';
    g.npcHidden = false;

    // NPC играет по характеру
    const cfg = CasinoData.blackjack;
    const thr = cfg.npcThresholds[g.npc.type] || { min: 16, max: 18 };
    const target = Utils.rnd(thr.min, thr.max);
    if (!g.deck || g.deck.length < 5) g.deck = Cards.shuffle(Cards.newDeck());
    while (this._calcHand(g.npcHand) < target) {
      g.npcHand.push(g.deck.pop());
    }
    const npcTotal = this._calcHand(g.npcHand);
    const playerTotal = this._calcHand(g.playerHand);

    Engine.log('«' + g.npc.name + '» открывает карты: ' + g.npcHand.map(c => c.r + c.s).join(' ') + ' (' + npcTotal + ').', 'info');

    let outcome;
    if (npcTotal > 21) {
      outcome = 'win';
      Engine.log('У «' + g.npc.name + '» перебор. Он тихо ругается.', 'good');
    } else if (npcTotal > playerTotal) {
      outcome = 'lose';
      Engine.log('«' + g.npc.name + '» ближе к 21. Он забирает деньги.', 'bad');
    } else if (npcTotal < playerTotal) {
      outcome = 'win';
      Engine.log('Ты ближе. «' + g.npc.name + '» отодвигает фишки.', 'good');
    } else {
      outcome = 'draw';
      Engine.log('Ничья. Ставка возвращается.', 'info');
    }
    this._resolveBlackjack(outcome);
  },

  _resolveBlackjack(outcome) {
    if (!State.player || !State.player.blackjack) return;
    const g = State.player.blackjack;
    g.result = outcome;
    g.stage = 'result';
    if (outcome === 'win') {
      const prize = g.bet * 2;
      Economy.earn(prize, 'Выигрыш в 21 против ' + g.npc.name);
      g.netGain = g.bet;
      Engine.log('Ты забираешь $' + prize + '.', 'good');
    } else if (outcome === 'lose') {
      g.netGain = -g.bet;
      Engine.log('Ты теряешь $' + g.bet + '.', 'bad');
    } else if (outcome === 'bust') {
      g.netGain = -g.bet;
    } else {
      Economy.earn(g.bet, 'Возврат ставки');
      g.netGain = 0;
    }
    if (State.player.casinoSession) {
      State.player.casinoSession.gamesPlayed = (State.player.casinoSession.gamesPlayed || 0) + 1;
    }
    
    // Игра за столом отнимает 5 минут (5 / 60 часа)
    Time.spend(5 / 60);
    if (!State.player || !State.city || State.deathRecord) return;
    
    Save.save();
    Engine.render();
  },

  blackjackLeave() {
    if (!State.player || !State.player.blackjack) return;
    if (State.player.blackjack.stage === 'player_turn') {
      Engine.log('Ты встаёшь из-за стола. Ставка остаётся у стола.', 'warn');
    }
    State.player.blackjack = null;
    Engine.go('casino');
  }
};
