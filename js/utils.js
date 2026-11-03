const Utils = {
  rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  rndF: (min, max) => Math.random() * (max - min) + min,
  pick: (arr) => (!arr || arr.length === 0) ? null : arr[Math.floor(Math.random() * arr.length)],
  chance: (p) => Math.random() < p,
  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
  fmtMoney: (n) => Math.round(n).toLocaleString('en-US'),
  pad2: (n) => String(n).padStart(2, '0'),
  clone: (o) => JSON.parse(JSON.stringify(o)),
  shuffle: (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  sum: (arr, key) => arr.reduce((s, x) => s + (key ? x[key] : x), 0),
  uniq: (arr) => [...new Set(arr)],
  weighted: (list) => {
    if (!list || list.length === 0) return null;
    const total = list.reduce((s, x) => s + x.w, 0);
    if (total <= 0) return null;
    let r = Math.random() * total;
    for (const it of list) { r -= it.w; if (r <= 0) return it.v; }
    return list[list.length - 1].v;
  },
  uid: () => Math.random().toString(36).slice(2, 10),
  // Стоимость апгрейда по уровню
  upgradeCost: (base, level) => Math.round(base * Math.pow(1.6, level - 1)),
  // Длительность апгрейда в часах
  upgradeTime: (base, level) => Math.round(base * Math.pow(1.35, level - 1)),
};
