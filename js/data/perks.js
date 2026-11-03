// ═══ ПЕРКИ — 4 ветки × 4 перка ═══
const PerkData = {
  branches: {
    shooter: {
      name: 'Стрелок',
      icon: '[S]',
      desc: 'Точность и урон. Пуля находит цель.',
      perks: [
        { id: 'shooter_1', name: 'Твёрдая рука',  desc: '+10% к шансу попадания', effect: { accuracy: 0.10 } },
        { id: 'shooter_2', name: 'Тяжёлый калибр', desc: '+15% урона из пистолетов и ПП', effect: { damagePistolSmg: 0.15 } },
        { id: 'shooter_3', name: 'Быстрый глаз',   desc: '+1 к магазину любого оружия', effect: { magazine: 1 } },
        { id: 'shooter_4', name: 'Смертельный выстрел', desc: '15% шанс ваншота при попадании в голову', effect: { headshotChance: 0.15 } },
      ],
    },
    diplomat: {
      name: 'Дипломат',
      icon: '[D]',
      desc: 'Слова и связи. Иногда сильнее пули.',
      perks: [
        { id: 'diplomat_1', name: 'Убеждение',     desc: 'Intimidate в бою +25%', effect: { intimidateBonus: 0.25 } },
        { id: 'diplomat_2', name: 'Скидка',         desc: '−10% у всех торговцев', effect: { tradeDiscount: 0.10 } },
        { id: 'diplomat_3', name: 'Авторитет',      desc: '+1 к репутации за каждый квест', effect: { repPerQuest: 1 } },
        { id: 'diplomat_4', name: 'Миротворец',     desc: '20% шанс мирно забрать зону у фракции', effect: { avoidFactionCombat: 0.20 } },
      ],
    },
    thief: {
      name: 'Вор',
      icon: '[T]',
      desc: 'Деньги и тени. Без шума.',
      perks: [
        { id: 'thief_1', name: 'Осторожность',     desc: '−10% риска квестов', effect: { questRiskReduction: 0.10 } },
        { id: 'thief_2', name: 'Карманник',         desc: '+20% денег с квестов и лута', effect: { questMoneyBonus: 0.20 } },
        { id: 'thief_3', name: 'Тень',              desc: '20% шанс уйти из боя без штрафа', effect: { fleeNoPenalty: 0.20 } },
        { id: 'thief_4', name: 'Призрак',           desc: '25% шанс захватить нейтральную зону без боя', effect: { captureWithoutFight: 0.25 } },
      ],
    },
    leader: {
      name: 'Авторитет',
      icon: '[L]',
      desc: 'Люди и база. Армия важнее пистолета.',
      perks: [
        { id: 'leader_1', name: 'Вербовщик',        desc: '+2 слота наёмников', effect: { extraMercSlots: 2 } },
        { id: 'leader_2', name: 'Хозяин',           desc: '−20% содержание наёмников', effect: { mercUpkeepReduction: 0.20 } },
        { id: 'leader_3', name: 'Командир',         desc: '+10% к успеху миссий наёмников', effect: { mercSuccessBonus: 0.10 } },
        { id: 'leader_4', name: 'Дон',              desc: 'Наёмники не предают при неоплате', effect: { mercNoBetrayal: true } },
      ],
    },
  },

  allPerks() {
    const out = [];
    for (const [branchId, branch] of Object.entries(this.branches)) {
      branch.perks.forEach((p, idx) => {
        out.push({ ...p, branchId, branchName: branch.name, step: idx + 1 });
      });
    }
    return out;
  },

  find(perkId) {
    for (const branch of Object.values(this.branches)) {
      const p = branch.perks.find(x => x.id === perkId);
      if (p) return p;
    }
    return null;
  },
};
