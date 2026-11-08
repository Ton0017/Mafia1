const Cards = {
  ranks: ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
  suits: ['♠','♥','♦','♣'],

  rankValue(r) { return this.ranks.indexOf(r) + 2; },
  rankName(v) { return this.ranks[v - 2] || '?'; },

  newDeck() {
    const deck = [];
    for (const r of this.ranks) for (const s of this.suits) deck.push({ r, s });
    return deck;
  },

  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  },

  show(card) { return card.r + card.s; },
  showHand(hand) { return hand.map(c => this.show(c)).join(' '); },

  // Все k-элементные подмножества
  _combos(arr, k) {
    const out = [];
    const rec = (start, cur) => {
      if (cur.length === k) { out.push(cur.slice()); return; }
      for (let i = start; i < arr.length; i++) {
        cur.push(arr[i]);
        rec(i + 1, cur);
        cur.pop();
      }
    };
    rec(0, []);
    return out;
  },

  // Оценка ровно 5 карт → { type, ranks[] }
  _eval5(cards) {
    const vals = cards.map(c => this.rankValue(c.r)).sort((a,b) => b - a);
    const suits = cards.map(c => c.s);
    const isFlush = suits.every(s => s === suits[0]);

    const counts = {};
    for (const v of vals) counts[v] = (counts[v] || 0) + 1;
    const groups = Object.keys(counts).map(v => ({ v: +v, c: counts[v] }));
    groups.sort((a, b) => b.c - a.c || b.v - a.v);

    let straight = false, straightHigh = 0;
    const uniq = [...new Set(vals)].sort((a,b) => b - a);
    if (uniq.length === 5) {
      if (uniq[0] - uniq[4] === 4) { straight = true; straightHigh = uniq[0]; }
      if (uniq[0] === 14 && uniq[1] === 5 && uniq[4] === 2) { straight = true; straightHigh = 5; }
    }

    if (isFlush && straight) return { type: 'straight_flush', ranks: [straightHigh] };
    if (groups[0].c === 4) return { type: 'quads', ranks: [groups[0].v, groups[1].v] };
    if (groups[0].c === 3 && groups[1].c === 2) return { type: 'full_house', ranks: [groups[0].v, groups[1].v] };
    if (isFlush) return { type: 'flush', ranks: vals };
    if (straight) return { type: 'straight', ranks: [straightHigh] };
    if (groups[0].c === 3) {
      const k = groups.slice(1).map(g => g.v).sort((a,b) => b - a);
      return { type: 'trips', ranks: [groups[0].v, ...k] };
    }
    if (groups[0].c === 2 && groups[1].c === 2) {
      const pr = [groups[0].v, groups[1].v].sort((a,b) => b - a);
      return { type: 'two_pair', ranks: [...pr, groups[2].v] };
    }
    if (groups[0].c === 2) {
      const k = groups.slice(1).map(g => g.v).sort((a,b) => b - a);
      return { type: 'pair', ranks: [groups[0].v, ...k] };
    }
    return { type: 'high', ranks: vals };
  },

  _typeWeight(t) {
    return { high: 1, pair: 2, two_pair: 3, trips: 4, straight: 5, flush: 6, full_house: 7, quads: 8, straight_flush: 9 }[t] || 0;
  },

  _cmpEval(a, b) {
    const wa = this._typeWeight(a.type), wb = this._typeWeight(b.type);
    if (wa !== wb) return wa - wb;
    const n = Math.max(a.ranks.length, b.ranks.length);
    for (let i = 0; i < n; i++) {
      const x = a.ranks[i] || 0, y = b.ranks[i] || 0;
      if (x !== y) return x - y;
    }
    return 0;
  },

  // Оценка руки 2-7 карт (лучшая комбинация)
  evaluate(hand) {
    if (hand.length >= 5) {
      const combos = this._combos(hand, 5);
      let best = null;
      for (const c of combos) {
        const e = this._eval5(c);
        if (!best || this._cmpEval(e, best) > 0) best = e;
      }
      return best;
    }
    const vals = hand.map(c => this.rankValue(c.r)).sort((a,b) => b - a);
    const counts = {};
    for (const v of vals) counts[v] = (counts[v] || 0) + 1;
    const groups = Object.keys(counts).map(v => ({ v: +v, c: counts[v] }));
    groups.sort((a, b) => b.c - a.c || b.v - a.v);
    if (groups[0].c === 2) {
      const k = groups.slice(1).map(g => g.v).sort((a,b) => b - a);
      return { type: 'pair', ranks: [groups[0].v, ...k] };
    }
    return { type: 'high', ranks: vals };
  },

  compare(handA, handB) {
    return this._cmpEval(this.evaluate(handA), this.evaluate(handB));
  },

  describe(hand) {
    const e = this.evaluate(hand);
    const n = v => this.rankName(v);
    switch (e.type) {
      case 'straight_flush': return 'стрит-флеш до ' + n(e.ranks[0]);
      case 'quads': return 'каре ' + n(e.ranks[0]);
      case 'full_house': return 'фулл-хаус ' + n(e.ranks[0]) + ' на ' + n(e.ranks[1]);
      case 'flush': return 'флеш';
      case 'straight': return 'стрит до ' + n(e.ranks[0]);
      case 'trips': return 'тройка ' + n(e.ranks[0]);
      case 'two_pair': return 'две пары ' + n(e.ranks[0]) + ' и ' + n(e.ranks[1]);
      case 'pair': return 'пара ' + n(e.ranks[0]);
      default: return 'старшая карта ' + n(e.ranks[0]);
    }
  }
};
