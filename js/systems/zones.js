// ═══ СИСТЕМА ЗАХВАТА ЗОН ═══
const ZonesSystem = {
  // Лимит зон: 3 + казарма × 2
  maxZones() {
    if (!State.building || !State.building.modules || !State.building.modules.barracks) return 3;
    const barracks = State.building.modules.barracks.level || 0;
    return 3 + barracks * 2;
  },

  playerZones() {
    if (!State.zones) return [];
    return State.zones.filter(z => z.ownerId === 'player');
  },

  idleMercs() {
    if (!State.mercenaries || !State.mercenaries.active) return [];
    return State.mercenaries.active.filter(m => m.status === 'idle');
  },

  // Проверка возможности захвата
  canCapture(zoneId) {
    if (!State.player) return { ok: false, reason: 'Нет игрока' };
    if (!State.zones) return { ok: false, reason: 'Зона не найдена' };
    const zone = State.zones.find(z => z.id === zoneId);
    if (!zone) return { ok: false, reason: 'Зона не найдена' };
    if (zone.ownerId === 'player') return { ok: false, reason: 'Уже твоя' };

    if (this.playerZones().length >= this.maxZones()) {
      return { ok: false, reason: 'Лимит зон (' + this.maxZones() + '). Улучши казарму.' };
    }

    const idle = this.idleMercs();

    if (zone.ownerId === null) {
      // Нейтральная
      if (idle.length < 1) return { ok: false, reason: 'Нужен 1 свободный наёмник' };
      return { ok: true, type: 'neutral' };
    }

    // Фракция
    if (idle.length < 2) return { ok: false, reason: 'Нужно 2 свободных наёмника' };
    if ((State.player.heat || 0) >= 70) return { ok: false, reason: 'Слишком высокий heat (70+)' };
    return { ok: true, type: 'faction' };
  },

  // ═══ ЗАХВАТ НЕЙТРАЛА (через наёмника) ═══
  captureNeutral(zoneId) {
    const zone = State.zones.find(z => z.id === zoneId);
    if (!zone) return false;
    const check = this.canCapture(zoneId);
    if (!check.ok || check.type !== 'neutral') {
      Engine.log(check.reason || 'Нельзя захватить', 'warn');
      return false;
    }
    if (!Time.canSpend(0.5)) {
      Engine.log('Слишком поздно. Возьми утром.', 'warn');
      return false;
    }

    // Призрак: мгновенный захват
    if (typeof Perks !== 'undefined') {
      const mods = Perks.getModifiers();
      if (mods.captureWithoutFight && Utils.chance(mods.captureWithoutFight)) {
        zone.ownerId = 'player';
        zone.guards = 1;
        // #22: проверяем, не брошена ли зона недавно
        const abandonDay = (State.player.recentlyAbandoned && State.player.recentlyAbandoned[zoneId]) || 0;
        if (State.time.day - abandonDay > 3) {
          if (State.politics) State.politics.playerInfluence += 1;
        } else {
          Engine.log('Ты уже бросал эту зону недавно. Влияния не будет.', 'warn');
        }
        Economy.changeHeat(5, 'Тихий захват');
        Economy.addXp(30);
        Engine.log(zone.name + ' теперь твоя. Без единого выстрела.', 'good');
        Save.save();
        Engine.go('myZones');
        return true;
      }
    }

    const merc = this.idleMercs()[0];
    const duration = Utils.rnd(3, 6);

    merc.status = 'onMission';
    merc.mission = {
      type: 'capture',
      name: 'Захват: ' + zone.name,
      until: Time.totalHours() + duration,
      duration: duration,
      zoneId: zone.id,
      risk: Math.max(0.1, 0.4 - ((merc.stats && merc.stats.shooting) || 0) / 30),
    };

    Engine.log(merc.name + ' отправился захватить ' + zone.name + ' (' + duration + 'ч).', 'info');
    Time.spend(0.5);
    Save.save();
    Engine.go('myZones');
    return true;
  },

  // ═══ РАЗРЕШЕНИЕ ЗАХВАТА (вызывается из Time.onHourTick) ═══
  tickCaptures() {
    if (!State.player || !State.city) return;
    const now = Time.totalHours();
    const snapshot = [...State.mercenaries.active];
    for (const m of snapshot) {
      if (m.status === 'onMission' && m.mission && m.mission.type === 'capture' && now >= m.mission.until) {
        this.resolveCapture(m);
        if (!State.player || !State.city) return; // смерть/краш
      }
    }
  },

  resolveCapture(merc) {
    const mission = merc.mission;
    if (!mission) return;
    const zone = State.zones.find(z => z.id === mission.zoneId);
    if (!zone) {
      merc.status = 'idle';
      merc.mission = null;
      return;
    }

    // #93: если зону уже кто-то занял — не отбираем без боя
    if (zone.ownerId !== null) {
      Engine.log(merc.name + ' прибыл на ' + zone.name + ' — но зону уже заняли. Без боя не выйдет.', 'warn');
      merc.status = 'idle';
      merc.mission = null;
      Save.save();
      return;
    }

    // #107: проверка лимита зон (мог измениться за время миссии)
    if (this.playerZones().length >= this.maxZones()) {
      Engine.log(merc.name + ' прибыл на ' + zone.name + ' — но у тебя уже максимум зон. Возвращается.', 'warn');
      merc.status = 'idle';
      merc.mission = null;
      Save.save();
      return;
    }

    if (Utils.chance(mission.risk)) {
      // Провал
      const dmg = Utils.rnd(10, 30);
      if (merc.stats) merc.stats.health = Math.max(1, (merc.stats.health || 9) - Math.round(dmg / 15));
      Engine.log(merc.name + ' не смог захватить ' + zone.name + '. Ранен.', 'bad');
    } else {
      // Успех
      zone.ownerId = 'player';
      zone.guards = 1;
      // #23: даём влияние (с учётом античита)
      const abandonDay = (State.player.recentlyAbandoned && State.player.recentlyAbandoned[zone.id]) || 0;
      if (State.time.day - abandonDay > 3) {
        if (State.politics) State.politics.playerInfluence += 1;
      }
      Economy.changeHeat(10, 'Захват зоны');
      Economy.addXp(30);
      Engine.log(zone.name + ' теперь твоя. Доход +$' + zone.income + '/день.', 'good');
    }

    merc.status = 'idle';
    merc.mission = null;
    Save.save();
  },

  // ═══ АТАКА ЗОНЫ ФРАКЦИИ (через бой) ═══
  attackFactionZone(zoneId) {
    if (!State.player) return false;
    if (!State.zones) return false;
    const zone = State.zones.find(z => z.id === zoneId);
    if (!zone) return false;
    const check = this.canCapture(zoneId);
    if (!check.ok || check.type !== 'faction') {
      Engine.log(check.reason || 'Нельзя атаковать', 'warn');
      return false;
    }
    if (!Time.canSpend(1)) {
      Engine.log('Слишком поздно. Возьми утром.', 'warn');
      return false;
    }

    const faction = State.factions.find(f => f.id === zone.ownerId);
    if (!faction) return false;

    // #123 Миротворец — 20% мирно
    if (typeof Perks !== 'undefined') {
      const mods = Perks.getModifiers();
      if (mods.avoidFactionCombat && Utils.chance(mods.avoidFactionCombat)) {
        zone.ownerId = 'player';
        zone.guards = 1;
        faction.zones = Math.max(0, (faction.zones || 1) - 1);
        faction.relations = faction.relations || {};
        faction.relations.player = (faction.relations.player || 0) - 10;
        if (State.politics) State.politics.playerInfluence += 2;
        Economy.changeHeat(5, 'Мирный захват');
        Economy.changeRep(3, 'Без крови');
        Engine.log('Ты говоришь. Они слушают. ' + zone.name + ' переходит к тебе — мирно.', 'good');
        Save.save();
        Engine.go('myZones');
        return true;
      }
    }

    // Если зона ослаблена войной (охрана <= 1) — 40% шанс забрать без боя
    if ((zone.guards || 0) <= 1 && Utils.chance(0.4)) {
      zone.ownerId = 'player';
      zone.guards = 1;
      if (faction) faction.zones = Math.max(0, (faction.zones || 1) - 1);
      if (State.politics) State.politics.playerInfluence += 2;
      Economy.changeHeat(5, 'Тихий захват');
      Economy.addXp(40);
      Engine.log('В зоне почти нет охраны. Ты заходишь и объявляешь её своей.', 'good');
      Save.save();
      Engine.go('myZones');
      return true;
    }

    // Иначе — бой
    const enemyLevel = Math.max(1, (State.player.level || 1) + (zone.difficulty || 1) - 1);
    const enemy = Combat.spawnEnemy(enemyLevel, { affiliation: 'gang', factionId: faction.id });
    // #20: НЕ перезаписываем имя — используем уникальное + роль
    // #21: лут добавляем, а не перезаписываем
    enemy.loot.money += Utils.rnd(100, 300) + enemyLevel * 20;

    Time.spend(1, 'Ты выдвигаешься на ' + zone.name + '.');
    // #94: если умер — State.city = null, State.player = new default
    if (!State.player || !State.city) return false;
    // #95: если бой уже активен — не запускаем
    if (State.combat && State.combat.active) {
      Engine.log('Ты уже в перестрелке.', 'warn');
      return false;
    }

    Combat.start(enemy, {
      type: 'zoneCapture',
      zoneId: zone.id,
      factionId: faction.id,
      returnScreen: 'myZones',
    });
    return true;
  },

  // ═══ ПОБЕДА В БОЮ ЗА ЗОНУ ═══
  onFactionZoneCapture(zoneId, factionId) {
    const zone = State.zones.find(z => z.id === zoneId);
    const faction = State.factions.find(f => f.id === factionId);
    if (!zone || !faction) return;

    zone.ownerId = 'player';
    zone.guards = 1;
    if (State.politics) State.politics.playerInfluence += 2;
    faction.zones = Math.max(0, (faction.zones || 1) - 1);

    Economy.changeHeat(25, 'Атака фракции');
    Economy.changeRep(5, 'Уважение за смелость');

    if (Utils.chance(0.4)) {
      faction.enemyId = 'player';
      Engine.log(faction.name + ' запомнила тебя. Это ненадолго — или навсегда.', 'bad');
    } else {
      Engine.log(faction.name + ' проглотила потерю. Пока.', 'info');
    }

    Engine.log(zone.name + ' теперь твоя. Доход +$' + zone.income + '/день.', 'good');
    Save.save();
  },

  // ═══ ОХРАНА ═══
  garrison(zoneId) {
    const zone = State.zones.find(z => z.id === zoneId);
    if (!zone || zone.ownerId !== 'player') return false;
    if (!Time.canSpend(0.25)) {
      Engine.log('Слишком поздно. Возьми утром.', 'warn');
      return false;
    }
    if (!Economy.spend(500, 'Укрепление: ' + zone.name)) return false;
    zone.guards = (zone.guards || 0) + 2;
    Engine.log(zone.name + ': охрана +2 (всего ' + zone.guards + ').', 'good');
    Time.spend(0.25);
    // #99: если умер во время spend — не сохраняем и не рендерим мусор
    if (!State.player || !State.city) return true;
    Save.save();
    Engine.render();
    return true;
  },

  // ═══ ОСТАВИТЬ ЗОНУ ═══
  abandon(zoneId) {
    if (!State.player) return false;
    if (!State.zones) return false;
    const zone = State.zones.find(z => z.id === zoneId);
    if (!zone || zone.ownerId !== 'player') return false;
    if (!confirm('Оставить ' + zone.name + '? Доход уйдёт.')) return false;
    zone.ownerId = null;
    zone.guards = 0;
    // #22: трекаем, чтобы не давать репутацию/влияние за повторный захват
    if (!State.player.recentlyAbandoned) State.player.recentlyAbandoned = {};
    State.player.recentlyAbandoned[zoneId] = State.time.day;
    Economy.changeHeat(-10, 'Тихо ушёл');
    Engine.log(zone.name + ' оставлена. Доход потерян.', 'warn');
    Save.save();
    Engine.render();
    return true;
  },
};
