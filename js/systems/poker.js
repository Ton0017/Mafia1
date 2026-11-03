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
      stage: 'decide',
      playerHand,
      dealerHand,
      playerBet: this.ANTE,
      result: null,
      netGain: 0
    };

    Engine.log('Ты садишься за стол. Анте $' + this.ANTE + '. Дилер раздаёт.', 'lore');
    Engine.log('Твои карты: ' + Cards.showHand(playerHand), 'info');
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
    Save.save();
    Engine.render();
  },

  // Уравнять (ещё $50, итого $100)
  call() {
    if (!State.poker) return;
    const s = State.poker;
    const addBet = 50;
    if (typeof State.player.money !== 'number' || State.player.money < addBet) {
      Engine.log('Не хватает денег на уравнивание.', 'warn');
      return;
    }
    State.player.money -= addBet;
    s.playerBet += addBet;
    this._resolve();
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
    this._resolve();
  },

  // Финал: дилер открывает, сравниваем
  _resolve() {
    const s = State.poker;
    s.stage = 'result';

    if (typeof Cards === 'undefined') return;
    const cmp = Cards.compare(s.playerHand, s.dealerHand);
    const totalBank = s.playerBet * 2;
    const rakeCut = Math.round(totalBank * this.RAKE);
    const prize = totalBank - rakeCut;

    Engine.log('Дилер открывает: ' + Cards.showHand(s.dealerHand) + ' (' + Cards.describe(s.dealerHand) + ').', 'info');

    if (cmp > 0) {
      // Победа
      State.player.money += prize;
      s.result = 'win';
      s.netGain = prize - s.playerBet;
      Engine.log('Ты выигрываешь! +$' + s.netGain + ' (казино удержало $' + rakeCut + ').', 'good');
    } else if (cmp < 0) {
      // Проигрыш
      s.result = 'lose';
      s.netGain = -s.playerBet;
      Engine.log('Дилер забирает всё. −$' + s.playerBet + '.', 'bad');
    } else {
      // Ничья — дилер выигрывает
      s.result = 'lose';
      s.netGain = -s.playerBet;
      Engine.log('Ничья. Казино всегда в плюсе. −$' + s.playerBet + '.', 'bad');
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
