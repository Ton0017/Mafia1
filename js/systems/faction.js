const Faction = {
  tick() {
    if (!State.player || !State.city || !State.factions) return;

    for (const f of State.factions) {
      if (f.isPolice) continue;

      // Проверка настроения (меняется раз в 5-7 дней)
      this.updateMood(f);

      // ═══ АНТИСНЕЖОК: фракция с 9+ зон не атакует ═══
      if ((f.zones || 0) >= 9) {
        this.tryRecruit(f);
        continue;
      }

      const roll = Math.random();
      
      // Шанс атаки зависит от настроения
      let attackChance = 0.15;
      if (f.enemyId === 'player') attackChance = 0.30;
      if (f.allyWithPlayer) attackChance = 0.25; // союзники воюют активнее
      
      const mood = this.getEffectiveTrait(f);
      if (mood === 'агрессивный') attackChance += 0.15;
      else if (mood === 'торговый') attackChance -= 0.10;
      else if (mood === 'осторожный') attackChance -= 0.15;
      else if (mood === 'хитрый') attackChance += 0.05;
      
      attackChance = Utils.clamp(attackChance, 0.05, 0.50);

      if (roll < attackChance) {
        this.tryAttack(f);
      } else if (roll < attackChance + 0.15) {
        this.tryAttackFaction(f);
      } else if (roll < attackChance + 0.25) {
        this.tryRecruit(f);
      }
    }

    // 1. Удаляем фракции без зон (кроме полиции)
    const aliveFactions = State.factions.filter(f => f.isPolice || (f.zones && f.zones > 0));
    
    for (const f of State.factions) {
      if (!f.isPolice && (!f.zones || f.zones <= 0) && !f.destroyed) {
        f.destroyed = true;
        if (!State.city.news) State.city.news = [];
        State.city.news.unshift(`☠ Фракция ${f.name} распалась. Их больше нет.`);
        Engine.log(`Фракция ${f.name} исчезла с карты города.`, 'warn');
      }
    }
    State.factions = aliveFactions;

    // 2. Рождение новой фракции (если их меньше 4)
    const mafiaCount = State.factions.filter(f => !f.isPolice).length;
    if (mafiaCount < 4) {
      this.spawnNewFaction();
    }
  },

  // Функция генерации новой банды
  spawnNewFaction() {
    const count = State.factions.length;
    const root = Utils.pick(Lore.factionRoots);
    const nameTemplate = Utils.pick(Lore.factionNameTemplates);
    const name = nameTemplate.replace('{0}', root);
    
    const newF = {
      id: 'fac_' + Utils.uid(),
      name: name,
      trait: Utils.pick(Lore.factionTraits),
      power: Utils.rnd(3, 6),
      influence: Utils.rnd(5, 15),
      relations: {},
      zones: 0,
      enemyId: null,
      allyWithPlayer: false,
      mood: null,
      moodUntil: 0,
      tradeDay: 0, threatDay: 0, jobDay: 0, mysteryDay: 0,
      isPolice: false
    };

    // Устанавливаем нейтральные отношения
    for (const f of State.factions) {
      newF.relations[f.id] = Utils.rnd(-20, 20);
      if (!f.relations) f.relations = {};
      f.relations[newF.id] = newF.relations[f.id];
    }

    // Выдаем им одну нейтральную зону, чтобы они не умерли сразу
    const freeZones = State.zones.filter(z => z.ownerId === null);
    if (freeZones.length > 0) {
      const z = Utils.pick(freeZones);
      z.ownerId = newF.id;
      z.guards = Utils.rnd(2, 4);
      newF.zones = 1;
    }

    State.factions.push(newF);
    
    if (!State.city.news) State.city.news = [];
    State.city.news.unshift(`⚑ В городе появилась новая сила: ${name}. Они молоды, голодны и опасны.`);
    Engine.log(`Новая фракция: ${name}`, 'good');
    Save.save();
  },

  // Обновление настроения
  updateMood(f) {
    const today = State.time.day;
    if (!f.moodUntil || today >= f.moodUntil) {
      const moods = ['агрессивный', 'торговый', 'хитрый', 'осторожный', 'нейтральный'];
      f.mood = Utils.pick(moods);
      f.moodUntil = today + Utils.rnd(5, 7);
      
      if (State.city.news && f.mood !== 'нейтральный') {
        State.city.news.unshift('Слухи: ' + f.name + ' сейчас в ' + f.mood + ' настроении.');
        if (State.city.news.length > 5) State.city.news.pop();
      }
    }
  },

  // Получить текущий характер (mood перекрывает trait)
  getEffectiveTrait(f) {
    return f.mood || f.trait || 'нейтральный';
  },

  tryAttackFaction(attacker) {
    if (!State.zones || State.zones.length === 0) return;

    // Ищем зоны, принадлежащие ДРУГИМ фракциям
    const targets = State.zones.filter(z => z.ownerId && z.ownerId !== attacker.id && z.ownerId !== 'player');
    if (targets.length === 0) return;

    const zone = Utils.pick(targets);
    const defender = State.factions.find(f => f.id === zone.ownerId);
    if (!defender) return;

    // Дипломатия: если отношения > 50, они не воюют
    if (!attacker.relations) attacker.relations = {};
    if ((attacker.relations[defender.id] || 0) > 50) return;

    const attackerPower = Math.round(attacker.power || 5) + Utils.rnd(1, 5);
    const defenderPower = Math.round(defender.power || 5) + (zone.guards || 0);

    if (attackerPower > defenderPower) {
      // ПОБЕДА АТАКУЮЩЕГО
      const oldOwnerName = defender.name;
      zone.ownerId = attacker.id;
      zone.guards = Utils.rnd(1, 3);
      
      // Меняем силу и счетчики (целыми числами)
      attacker.power = Math.min(10, (attacker.power || 5) + 1);
      defender.power = Math.max(1, (defender.power || 5) - 1);
      attacker.zones = (attacker.zones || 0) + 1;
      defender.zones = Math.max(0, (defender.zones || 1) - 1);
      
      // Падение отношений
      if (!attacker.relations) attacker.relations = {};
      if (!defender.relations) defender.relations = {};
      attacker.relations[defender.id] = Math.max(-100, (attacker.relations[defender.id] || 0) - 40);
      defender.relations[attacker.id] = Math.max(-100, (defender.relations[attacker.id] || 0) - 50);

      if (!State.city.news) State.city.news = [];
      State.city.news.unshift(`⚔ ${attacker.name} выбили ${oldOwnerName} из района ${zone.name}.`);
      if (State.city.news.length > 5) State.city.news.pop();

    } else {
      // ПОБЕДА ЗАЩИТНИКА (Зона ослаблена)
      zone.guards = Math.max(1, (zone.guards || 1) - 1);
      defender.power = Math.min(10, (defender.power || 5) + 1);
      
      if (!State.city.news) State.city.news = [];
      State.city.news.unshift(`🛡 ${defender.name} отбились от атаки ${attacker.name} в районе ${zone.name}. Охрана ослаблена.`);
      if (State.city.news.length > 5) State.city.news.pop();
    }
  },

  tryAttack(faction) {
    // ═══ АНТИСНЕЖОК ═══
    if ((faction.zones || 0) >= 9) return;
    
    let targets;
    if (faction.allyWithPlayer) {
      // Союзник атакует только других фракций, не игрока
      targets = State.zones.filter(z => z.ownerId && z.ownerId !== faction.id && z.ownerId !== 'player');
    } else if (faction.enemyId === 'player') {
      const playerZones = State.zones.filter(z => z.ownerId === 'player');
      if (playerZones.length > 0 && Utils.chance(0.8)) {
        targets = playerZones;
      } else {
        targets = State.zones.filter(z => z.ownerId && z.ownerId !== faction.id && z.ownerId !== 'player');
      }
    } else {
      targets = State.zones.filter(z => z.ownerId && z.ownerId !== faction.id);
    }
    if (targets.length === 0) return;
    const zone = Utils.pick(targets);

    const attackerPower = Math.round(faction.power || 5) + Utils.rnd(1, 5);
    
    // Считаем защиту зоны
    let guardPower = (zone.guards || 0);
    let mercsOnGuard = [];
    
    if (zone.ownerId === 'player') {
      if (!State.player || !State.player.stats) return;
      const activeMercs = (State.mercenaries && State.mercenaries.active) || [];
      mercsOnGuard = activeMercs.filter(m => m.status === 'onMission' && m.mission && m.mission.type === 'guard' && m.mission.zoneId === zone.id);
      guardPower += mercsOnGuard.length * 3;
      guardPower += Math.floor((State.player.stats.strength || 5) / 2);
    } else {
      guardPower += 3;
      // Осторожный характер = лучше защищаются
      const effTrait = this.getEffectiveTrait(faction);
      if (effTrait === 'осторожный') guardPower += 2;
    }
    
    const defenderPower = guardPower;
    const win = attackerPower > defenderPower;

    if (win) {
      const oldOwner = zone.ownerId;
      zone.ownerId = faction.id;
      zone.guards = Utils.rnd(2, 4);
      faction.zones = (faction.zones || 0) + 1;
      faction.influence = (faction.influence || 0) + 1;
      
      if (oldOwner === 'player') {
        Engine.log(faction.name + ' захватила ' + zone.name + '. Ты потерял зону.', 'bad');
        Economy.changeRep(-5);
        if (typeof Sanity !== 'undefined') Sanity.onBloodyEvent(2);

        // Судьба наёмников, которые охраняли зону
        for (const m of mercsOnGuard) {
          if (Utils.chance(0.3)) {
            State.mercenaries.active = State.mercenaries.active.filter(x => x.id !== m.id);
            Engine.log(m.name + ' погиб, защищая ' + zone.name + '.', 'bad');
          } else {
            m.status = 'idle';
            m.mission = null;
            if (m.stats) m.stats.health = Math.max(1, (m.stats.health || 9) - 2);
            Engine.log(m.name + ' тяжело ранен. Он не смог удержать зону.', 'bad');
          }
        }
      } else {
        Engine.log(faction.name + ' захватила ' + zone.name + '.', 'info');
      }
    }
  },

  tryRecruit(faction) {
    const pow = (faction && faction.power) || 5;
    if (pow < 10 && Utils.chance(0.2)) {
      faction.power = Math.min(10, pow + 1);
    }
  },

  adjustRelation(fromId, toId, delta) {
    const f = State.factions.find(x => x.id === fromId);
    if (!f || !f.relations) return;
    f.relations[toId] = Utils.clamp((f.relations[toId] || 0) + delta, -100, 100);
  },
};
