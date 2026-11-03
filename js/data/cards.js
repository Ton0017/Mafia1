const Cards = {
  ranks: ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
  suits: ['♠','♥','♦','♣'],

  // Вес ранга (2=2, A=14)
  rankValue(r) { return this.ranks.indexOf(r) + 2; },

  // Создаём колоду
  newDeck() {
    const deck = [];
    for (const r of this.ranks) for (const s of this.suits) deck.push({ r, s });
    return deck;
  },

  // Перемешать (Фишер-Йетс)
  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  },

  // Отображение карты: "K♠"
  show(card) { return card.r + card.s; },

  // Отображение руки: "K♠ Q♥"
  showHand(hand) { return hand.map(c => this.show(c)).join(' '); },

  // Сила руки: { type, high, low, pairRank }
  evaluate(hand) {
    const a = this.rankValue(hand[0].r);
    const b = this.rankValue(hand[1].r);
    if (a === b) {
      return { type: 'pair', pairRank: a, high: a, low: 0 };
    }
    return { type: 'high', pairRank: 0, high: Math.max(a, b), low: Math.min(a, b) };
  },

  // Сравнение: 1 (A > B), -1 (A < B), 0 (равно)
  compare(handA, handB) {
    const a = this.evaluate(handA);
    const b = this.evaluate(handB);

    if (a.type === 'pair' && b.type === 'high') return 1;
    if (a.type === 'high' && b.type === 'pair') return -1;
    if (a.type === 'pair' && b.type === 'pair') return a.pairRank - b.pairRank;
    // Оба high
    if (a.high !== b.high) return a.high - b.high;
    return a.low - b.low;
  },

  // Описание силы (для текста)
  describe(hand) {
    const e = this.evaluate(hand);
    if (e.type === 'pair') {
      const name = this.ranks[e.pairRank - 2];
      return 'пара ' + name;
    }
    return 'старшая карта ' + this.ranks[e.high - 2];
  }
};
