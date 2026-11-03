const Hire = {
  generatePool() {
    if (!State.mercenaries) State.mercenaries = { pool: [], active: [], poolResetDay: 1 };
    const count = Utils.rnd(5, 8);
    const pool = [];
    for (let i = 0; i < count; i++) {
      const cls = Utils.pick(MercData.classes);
      const priceMod = Utils.rnd(80, 130) / 100;
      const stats = {};
      for (const [k, v] of Object.entries(cls.stats)) {
        stats[k] = Math.max(1, v + Utils.rnd(-1, 2));
      }
      const isFemale = Utils.chance(0.3);
      pool.push({
        id: 'merc_' + Utils.uid(),
        name: MercData.generateName(isFemale),
        portrait: isFemale ? Sprites.randomWoman() : Sprites.randomMan(),
        classId: cls.id,
        className: cls.name,
        classDesc: cls.desc,
        stats: stats,
        price: Math.round(cls.basePrice * priceMod),
        upkeep: Math.round(cls.baseUpkeep * priceMod),
        status: 'available',
        mission: null,
        xp: 0,
      });
    }
    State.mercenaries.pool = pool;
    State.mercenaries.poolResetDay = State.time.day;
  },

  refreshPoolIfNeeded() {
    if (!State.mercenaries.poolResetDay) State.mercenaries.poolResetDay = State.time.day;
    if (State.time.day - State.mercenaries.poolResetDay >= 3) {
      this.generatePool();
      Engine.log('Биржа наёмников обновилась.', 'info');
    }
  },

  recruit(mercId) {
    if (!State.mercenaries) State.mercenaries = { pool: [], active: [], poolResetDay: 1 };
    const m = State.mercenaries.pool.find(x => x.id === mercId);
    if (!m) return { ok: false };
    const barracksLevel = (State.building && State.building.modules && State.building.modules.barracks) ? State.building.modules.barracks.level : 0;
    const perkSlots = (typeof Perks !== 'undefined') ? (Perks.getModifiers().extraMercSlots || 0) : 0;
    const slots = 2 + barracksLevel * 2 + perkSlots;
    if (State.mercenaries.active.length >= slots) {
      Engine.log('Нет свободных мест. Улучши казарму.', 'warn');
      return { ok: false };
    }
    if (!Economy.spend(m.price, 'Найм: ' + m.name)) return { ok: false };
    State.mercenaries.pool = State.mercenaries.pool.filter(x => x.id !== mercId);
    m.status = 'idle';
    State.mercenaries.active.push(m);
    Engine.log(m.name + ' теперь работает на тебя.', 'good');
    Save.save();
    Engine.go('mercenaries');
    return { ok: true };
  },

  dismiss(mercId) {
    const m = State.mercenaries.active.find(x => x.id === mercId);
    if (!m) return;
    if (!confirm('Уволить ' + m.name + '?')) return;
    State.mercenaries.active = State.mercenaries.active.filter(x => x.id !== mercId);
    Economy.changeRep(-2, 'Уволенные не любят болтать о хорошем.');
    Save.save();
    Engine.go('mercenaries');
  },

  assignMission(mercId, missionType, zoneId = null) {
    const m = State.mercenaries.active.find(x => x.id === mercId);
    if (!m) return;
    if (m.status !== 'idle') {
      Engine.log('Он занят.', 'warn');
      return;
    }
    const tpl = MercData.missionTypes[missionType];
    if (!tpl) return;

    let zone = null;
    if (missionType === 'guard') {
      if (!zoneId) { Engine.log('Выбери зону для охраны.', 'warn'); return; }
      zone = State.zones.find(z => z.id === zoneId);
      if (!zone || zone.ownerId !== 'player') { Engine.log('Это не твоя зона.', 'warn'); return; }
    }

    const duration = Math.max(1, tpl.baseTime + Utils.rnd(-2, 2));
    const risk = Math.min(0.9, Math.max(0.02, tpl.baseRisk * 1.5 * (1 - (m.stats.cunning || 0) / 40)));
    const pay = Math.round(tpl.basePay * (1 + (m.stats.shooting || 0) / 20));

    m.status = 'onMission';
    m.mission = {
      type: missionType,
      name: tpl.name + (zone ? ': ' + zone.name : ''),
      until: Time.totalHours() + (missionType === 'guard' ? 99999 : duration), // Охрана бессрочная
      duration: duration,
      risk: risk,
      pay: pay,
      zoneId: zoneId
    };
    Engine.log(m.name + ' отправлен на задание: ' + m.mission.name, 'info');
    Save.save();
    Engine.go('mercenaries');
  },

  tickMissions() {
    if (!State.mercenaries) State.mercenaries = { pool: [], active: [], poolResetDay: 1 };
    const now = Time.totalHours();
    const snapshot = [...State.mercenaries.active];
    for (const m of snapshot) {
      // Если на охране — проверяем, жива ли зона
      if (m.status === 'onMission' && m.mission && m.mission.type === 'guard') {
        const z = State.zones.find(x => x.id === m.mission.zoneId);
        if (!z || z.ownerId !== 'player') {
          m.status = 'idle';
          m.mission = null;
          Engine.log(m.name + ' вернулся. Зона, которую он охранял, потеряна.', 'warn');
        }
      } 
      // Для остальных миссий — проверяем время
      else if (m.status === 'onMission' && m.mission && now >= m.mission.until) {
        this.resolveMission(m);
      }
    }
  },

  resolveMission(m) {
    const mission = m.mission;
    if (!mission) return;
    let effectiveRisk = mission.risk;
    if (typeof Perks !== 'undefined' && Perks.getModifiers) {
      effectiveRisk = Math.max(0.02, effectiveRisk - (Perks.getModifiers().mercSuccessBonus || 0));
    }
    if (Utils.chance(effectiveRisk)) {
      // #56: урон мягче — наёмник выдерживает 3-4 провала, не 1
      const dmg = Utils.rnd(15, 40);
      m.stats.health = Math.max(1, (m.stats.health || 9) - Math.round(dmg / 15));
      const deathChance = m.stats.health <= 2 ? 0.3 : 0.05;
      if (Utils.chance(deathChance)) {
        Engine.log(m.name + ' не вернулся с задания «' + mission.name + '».', 'bad');
        if (typeof Sanity !== 'undefined') Sanity.onWitnessDeath();
        State.mercenaries.active = State.mercenaries.active.filter(x => x.id !== m.id);
        return;
      }
      Engine.log(m.name + ' провалил задание «' + mission.name + '». Ранен.', 'bad');
    } else {
      Economy.earn(mission.pay, mission.name + ': ' + m.name);
      m.xp = (m.xp || 0) + 10;
      Engine.log(m.name + ' выполнил «' + mission.name + '». +$' + Utils.fmtMoney(mission.pay), 'good');
    }
    m.status = 'idle';
    m.mission = null;
  },

  payUpkeep() {
    if (!State.mercenaries) State.mercenaries = { pool: [], active: [], poolResetDay: 1 };
    // #56: восстановление HP наёмников — +1 в день
    for (const m of State.mercenaries.active) {
      if ((m.stats.health || 9) < 9) {
        m.stats.health = Math.min(9, (m.stats.health || 9) + 1);
      }
    }
    let total = 0;
    for (const m of State.mercenaries.active) total += (m.upkeep || 0);
    if (total <= 0) return;
    if (typeof Perks !== 'undefined') {
      const mods = Perks.getModifiers();
      total = Math.round(total * (1 - (mods.mercUpkeepReduction || 0)));
    }
    if (!Economy.spend(total, 'содержание наёмников')) {
      const noBetray = (typeof Perks !== 'undefined') ? Perks.getModifiers().mercNoBetrayal : false;
      const snapshot = [...State.mercenaries.active];
      for (const m of snapshot) {
        m.stats.loyalty = Math.max(0, (m.stats.loyalty || 0) - 10);
        if (!noBetray && m.stats.loyalty < 20 && Utils.chance(0.2)) {
          Engine.log(m.name + ' ушёл. Не оглянулся.', 'bad');
          State.mercenaries.active = State.mercenaries.active.filter(x => x.id !== m.id);
        }
      }
    }
  },
};
