const Building = {
  upgrade(moduleId) {
    if (!State.building || !State.building.modules) return false;
    const mod = State.building.modules[moduleId];
    const def = Buildings.modules[moduleId];
    if (!mod || !def) return false;
    if (mod.upgradeUntil) { Engine.log('Уже идёт улучшение.', 'warn'); return false; }
    const cost = Buildings.moduleCost(moduleId, mod.level);
    if (!Economy.spend(cost, 'Апгрейд: ' + def.name)) return false;
    const time = Buildings.moduleTime(moduleId, mod.level);
    mod.upgradeUntil = Time.totalHours() + time;
    Engine.log('Апгрейд «' + def.name + '» начат. Готово через ' + time + 'ч.', 'good');
    Save.save();
    Engine.render();
    return true;
  },

  tickUpgrades() {
    if (!State.building || !State.building.modules) return;
    if (!State.player) return;
    const now = Time.totalHours();
    for (const [id, mod] of Object.entries(State.building.modules)) {
      if (mod.upgradeUntil && mod.upgradeUntil <= now) {
        mod.level++;
        mod.upgradeUntil = null;
        const def = Buildings.modules[id];
        if (def) Engine.log('Апгрейд завершён: ' + def.name + ' → ур. ' + mod.level, 'good');
        this.applyModuleEffect(id, mod.level);
      }
    }
  },

  applyModuleEffect(moduleId, level) {
    if (!State.player || !State.player.body) return;
    if (moduleId === 'medbay') {
      // ХАРДКОР: лечит 1 часть на 1 ур, +1 часть за каждые 2 уровня
      const lvl = level || 1;
      const partsCount = 1 + Math.floor((lvl - 1) / 2);
      const healPerPart = 8 + lvl * 2;
      const parts = Object.keys(State.player.body).filter(k => {
        const bp = State.player.body[k];
        return bp && typeof bp.hp === 'number' && typeof bp.max === 'number' && bp.max > 0;
      });
      // Выбираем самые раненые части
      parts.sort((a, b) => (State.player.body[a].hp / State.player.body[a].max) - (State.player.body[b].hp / State.player.body[b].max));
      let healed = 0;
      for (let i = 0; i < partsCount && i < parts.length; i++) {
        const part = parts[i];
        const p = State.player.body[part];
        if (p.hp >= p.max) continue;
        p.hp = Math.min(p.max, p.hp + healPerPart);
        healed++;
      }
      if (healed > 0) {
        Engine.log('Медпункт обработал ' + healed + ' частей тела (+' + healPerPart + ' HP каждой).', 'good');
      }
    }
    if (moduleId === 'barracks') {
      Engine.log('Казарма: место для ' + (2 + (level || 0) * 2) + ' наёмников.', 'good');
    }
  },

  buyBusiness(type, zoneId) {
    if (!State.zones) return false;
    if (!State.businesses) State.businesses = [];
    const def = Buildings.businesses[type];
    const zone = State.zones.find(z => z.id === zoneId);
    if (!def || !zone) return false;
    if (!Array.isArray(zone.businesses)) zone.businesses = [];
    if (zone.businesses.length >= 2) { Engine.log('В этой зоне уже 2 бизнеса.', 'warn'); return false; }
    if (!Economy.spend(def.buyPrice, 'Покупка: ' + def.name)) return false;
    const biz = {
      id: 'biz_' + Utils.uid(),
      type, name: def.name, zoneId,
      income: def.income,
      buyPrice: def.buyPrice,
      level: 1,
    };
    State.businesses.push(biz);
    zone.businesses.push(biz.id);
    Engine.log('Куплено: ' + def.name + ' в ' + zone.name, 'good');
    Save.save();
    Engine.render();
    return true;
  },
};
