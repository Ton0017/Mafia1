// ═══ СИСТЕМА ПЕРКОВ ═══
const Perks = {
  maxAllowed() {
    if (!State.player) return 0;
    return Math.floor((State.player.level || 1) / 3);
  },

  count() {
    return (State.player && State.player.perks) ? State.player.perks.length : 0;
  },

  hasNew() {
    return this.count() < this.maxAllowed();
  },

  has(perkId) {
    return State.player && State.player.perks && State.player.perks.includes(perkId);
  },

  getAvailable() {
    if (!State.player) return [];
    const taken = State.player.perks || [];
    const out = [];
    if (typeof PerkData === 'undefined' || !PerkData.branches) return out;

    for (const [branchId, branch] of Object.entries(PerkData.branches)) {
      for (let i = 0; i < branch.perks.length; i++) {
        const p = branch.perks[i];
        if (taken.includes(p.id)) continue;
        if (i > 0) {
          const prev = branch.perks[i - 1];
          if (!taken.includes(prev.id)) break;
        }
        out.push({ ...p, branchId, branchName: branch.name, step: i + 1 });
        break;
      }
    }
    return out;
  },

  pick(perkId) {
    if (!State.player) return false;
    if (!this.hasNew()) {
      Engine.log('Пока нельзя взять новый перк.', 'warn');
      return false;
    }
    const available = this.getAvailable();
    if (!available.find(p => p.id === perkId)) {
      Engine.log('Этот перк сейчас недоступен.', 'warn');
      return false;
    }
    if (!State.player.perks) State.player.perks = [];
    State.player.perks.push(perkId);
    const perk = PerkData.find(perkId);
    Engine.log('Перк получен: ' + (perk ? perk.name : perkId), 'good');
    Save.save();
    Engine.go('city');
    return true;
  },

  // Все модификаторы от перков
  getModifiers() {
    const mods = {
      accuracy: 0,
      damagePistolSmg: 0,
      magazine: 0,
      headshotChance: 0,
      intimidateBonus: 0,
      tradeDiscount: 0,
      repPerQuest: 0,
      avoidFactionCombat: 0,
      questRiskReduction: 0,
      questMoneyBonus: 0,
      fleeNoPenalty: 0,
      captureWithoutFight: 0,
      extraMercSlots: 0,
      mercUpkeepReduction: 0,
      mercSuccessBonus: 0,
      mercNoBetrayal: false,
    };

    if (!State.player || !State.player.perks) return mods;
    const taken = State.player.perks;

    for (const perkId of taken) {
      if (typeof PerkData === 'undefined' || !PerkData.find) continue;
      const perk = PerkData.find(perkId);
      if (!perk || !perk.effect) continue;
      for (const [key, val] of Object.entries(perk.effect)) {
        if (key === 'mercNoBetrayal') {
          mods.mercNoBetrayal = true;
        } else if (typeof val === 'number') {
          mods[key] = (mods[key] || 0) + val;
        }
      }
    }
    return mods;
  },
};
