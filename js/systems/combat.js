const Combat = {
  start(enemyConfig, context = {}) {
    if (!State.player) return false;
    if (!State.player.inventory) State.player.inventory = {};
    if (!State.player.inventory.ammo) State.player.inventory.ammo = {};
    // Если висит старый бой, но он неактивен или сломан — очищаем
    if (State.combat && State.combat.active) {
      // Если в бою нет врага или он уже мертв — принудительно сбрасываем
      if (!State.combat.enemy || State.combat.enemy.dead || State.combat.finished) {
        State.combat = null;
      } else {
        return false;
      }
    }
    const weaponId = State.player.currentWeaponId || Weapons.starter(State.player.side);
    const weapon = Weapons.find(weaponId) || Weapons.list[0];

    // Загрузка по типу патронов (melee — бесконечные)
    // Объявляем effectiveMag (с учётом перка "Быстрый глаз")
    const perkMagBonus = (typeof Perks !== 'undefined') ? (Perks.getModifiers().magazine || 0) : 0;
    const effectiveMag = weapon.magazine + perkMagBonus;

    const ammoType = Weapons.ammo.find(a => a.for.includes(weapon.category));
    let magAmmo;
    if (ammoType) {
      const reserve = State.player.inventory.ammo[ammoType.id] || 0;
      magAmmo = Math.min(weapon.magazine, reserve);
      State.player.inventory.ammo[ammoType.id] = reserve - magAmmo;
    } else {
      magAmmo = weapon.magazine; // melee — не тратится
    }

    // У врага тоже могут быть зависимости/травмы (рандом 30%)
    const enemyHasDebuff = Utils.chance(0.3);
    const enemyDebuffType = enemyHasDebuff ? Utils.pick(['drunk', 'wounded', 'junkie']) : null;

    State.combat = {
      active: true,
      playerState: { weaponId: weapon.id, ammo: magAmmo, coverBonus: 0, aimBonus: 0, effectiveMag: effectiveMag, jammed: false },
      enemy: {
        name: enemyConfig.name,
        portrait: enemyConfig.portrait || Sprites.byName(enemyConfig.name),
        level: enemyConfig.level || 1,
        body: defaultBody(),
        conditions: defaultConditions(),
        weaponId: enemyConfig.weaponId,
        ammo: (Weapons.find(enemyConfig.weaponId) || weapon).magazine,
        coverBonus: 0,
        aimBonus: 0,
        stats: enemyConfig.stats,
        ai: enemyConfig.ai || 'aggressive',
        morale: 100,
        dead: false,
        debuff: enemyDebuffType,
        loot: enemyConfig.loot || { money: 50 },
        role: enemyConfig.role || null,
        roleDesc: enemyConfig.roleDesc || null,
        affiliationLabel: enemyConfig.affiliationLabel || null,
        armor: enemyConfig.armor || 0,
      },
      distance: Utils.rnd(5, 12),
      turn: 'player',
      round: 1,
      log: [],
      finished: false,
      outcome: null,
      context,
    };

    this._log('Дождь стучит по асфальту. Он стоит напротив, рука на кобуре.', 'lore');
    this._log('Дистанция: ' + State.combat.distance + ' метров.', 'info');

    // Показываем дебаффы врага (позволяет выбрать тактику)
    if (enemyDebuffType === 'drunk') this._log('Он шатается. Пьян.', 'info');
    if (enemyDebuffType === 'wounded') this._log('Он хромает. Старая рана.', 'info');
    if (enemyDebuffType === 'junkie') this._log('У него дёргается рука. Ломка.', 'info');

    // БАГ #40: предупреждение если нет патронов
    if (magAmmo === 0) {
      this._log('В магазине пусто. Патронов нет.', 'bad');
      this._log('Можно только ударить (в упор) или убежать.', 'warn');
    }

    // Показываем свои дебаффы
    const penalties = this._getAllPenalties();
    if (penalties.log.length > 0) {
      this._log('Ты чувствуешь: ' + penalties.log.join(', '), 'warn');
    }

    Save.save();
    if (typeof Music !== 'undefined') Music.playCombat();
    Engine.go('combat');
    return true;
  },

  spawnEnemy(level, context = {}) {
    const baseLevel = State.player.level || 1;
    level = level || Math.max(1, baseLevel + Utils.rnd(-1, 2));
    const affiliation = context.affiliation || 'independent';

    // 1. Списки имен в стиле США 70-90х
    const FirstNames = ['Джимми', 'Джонни', 'Майк', 'Тони', 'Винни', 'Рик', 'Дэйв', 'Стив', 'Бобби', 'Томми', 'Билли', 'Чак', 'Рэнди', 'Брюс', 'Кевин', 'Гэри', 'Ларри', 'Скотт', 'Джефф', 'Брайан', 'Ронни', 'Дэнни', 'Джо', 'Фрэнк', 'Рэй', 'Эдди', 'Пол', 'Дон', 'Роджер', 'Барри', 'Терри', 'Лэнс', 'Дерек'];
    const FemaleNames = ['Синди', 'Дебби', 'Линда', 'Донна', 'Карен', 'Нэнси', 'Сьюзан', 'Дайан', 'Кэти', 'Шэрон', 'Бренда', 'Пэм', 'Шерил', 'Джанет', 'Кэрол', 'Тина', 'Келли', 'Лори', 'Мишель', 'Трэйси'];
    const LastNames = ['Смит', 'Джонсон', 'Уильямс', 'Браун', 'Джонс', 'Миллер', 'Дэвис', 'Гарсия', 'Родригес', 'Уилсон', 'Мартинес', 'Андерсон', 'Тейлор', 'Томас', 'Эрнандес', 'Мур', 'Мартин', 'Джексон', 'Томпсон', 'Уайт', 'Лопес', 'Ли', 'Гонсалес', 'Харрис', 'Кларк', 'Льюис', 'Робинсон', 'Уокер', 'Перес', 'Холл', 'Янг', 'Аллен', 'Санчес', 'Райт', 'Кинг', 'Скотт', 'Грин', 'Бэйкер', 'Адамс', 'Нельсон', 'Хилл', 'Рамирес', 'Кэмпбелл', 'Митчелл', 'Робертс', 'Картер', 'Филлипс', 'Эванс', 'Тернер', 'Торрес'];

    // 2. Уникальное имя
    if (!State.player.usedNames) State.player.usedNames = [];
    let enemyName = '';
    let attempts = 0;
    do {
      const isFemale = Utils.chance(0.3);
      enemyName = (isFemale ? Utils.pick(FemaleNames) : Utils.pick(FirstNames)) + ' ' + Utils.pick(LastNames);
      attempts++;
    } while (State.player.usedNames.includes(enemyName) && attempts < 15);
    State.player.usedNames.push(enemyName);
    if (State.player.usedNames.length > 200) State.player.usedNames.shift();

    // 3. Роли, оружие и статы
    let roleLabel = 'Грабитель';
    let roleDesc = 'Голодный, злой. Ему нечего терять.';
    let affiliationLabel = 'Одиночка';
    let statMult = 1.0;
    let lootMult = 1.0;
    let weaponId = 'melee_sharp';

    if (affiliation === 'police') {
      roleLabel = 'Коп';
      roleDesc = 'Служит уже давно. Видел всё.';
      affiliationLabel = 'Полиция';
      statMult = 1.1;
      lootMult = 1.2;
      weaponId = Utils.pick(['pistol_m1911', 'pistol_glock', 'shotgun_rem']);
    } else if (affiliation === 'civilian') {
      roleLabel = 'Гражданин';
      roleDesc = 'Не обучен драться. Просто не повезло.';
      affiliationLabel = 'Гражданский';
      statMult = 0.6;
      lootMult = 0.5;
      weaponId = Utils.pick(['melee_brass', 'melee_sharp', 'melee_knife']);
    } else if (affiliation === 'gang') {
      const fac = (State.factions || []).find(f => f.id === context.factionId);
      affiliationLabel = fac ? fac.name : 'Банда';
      if (Utils.chance(0.25)) {
        roleLabel = 'Авторитет';
        roleDesc = 'Старый волк. Не спешит. У него опыт.';
        statMult = 1.3;
        lootMult = 2.0;
      } else {
        roleLabel = 'Шестёрка';
        roleDesc = 'Молодой, дёрганый. Держит пистолет неправильно.';
        statMult = 0.8;
        lootMult = 0.7;
      }
      const maxRarity = Math.min(4, Math.ceil(level / 2));
      const pool = Weapons.list.filter(w => w.rarity <= maxRarity && w.category !== 'melee');
      weaponId = (Utils.pick(pool.length ? pool : Weapons.list)).id;
    } else {
      if (Utils.chance(0.2)) {
        roleLabel = 'Авторитет';
        roleDesc = 'Одиночка с опытом. Опасен.';
        statMult = 1.2;
        lootMult = 1.5;
      }
      weaponId = Utils.pick(['shotgun_sawnoff', 'melee_sharp', 'melee_brass']);
    }

    const weapon = Weapons.find(weaponId) || Weapons.list[0];
    const mult = 1 + (level - 1) * 0.15;

    return {
      name: enemyName,
      portrait: Utils.chance(0.3) ? Sprites.randomWoman() : Sprites.randomMan(),
      level: level,
      weaponId: weapon.id,
      stats: {
        shooting: Math.round(5 * mult * statMult),
        agility: Math.round(4 * mult * statMult),
        willpower: Math.round(4 * mult * statMult),
      },
      ai: Utils.pick(['aggressive', 'cautious', 'desperate']),
      loot: { money: Math.round((Utils.rnd(50, 150) + level * 30) * lootMult), weaponId: weapon.id },
      role: roleLabel,
      roleDesc: roleDesc,
      affiliationLabel: affiliationLabel
    };
  },

  _log(text, type = 'combat') {
    if (!State.combat) return;
    State.combat.log.unshift({ text, type });
    if (State.combat.log.length > 30) State.combat.log.pop();
  },

  _getAllPenalties() {
    const total = { accuracy: 0, agility: 0, initiative: 0, log: [] };
    const add = (p) => {
      if (!p) return;
      total.accuracy += p.accuracy || 0;
      total.agility += p.agility || 0;
      total.initiative += p.initiative || 0;
      if (p.log) total.log.push(...p.log);
    };
    if (typeof Survival !== 'undefined') add(Survival.getCombatPenalties());
    if (typeof Sanity !== 'undefined') add(Sanity.getCombatPenalties());
    if (typeof Drugs !== 'undefined') add(Drugs.getActiveBonuses());
    if (typeof Wounds !== 'undefined') add(Wounds.getCombatPenalties());
    return total;
  },

  _getSpecialBonus(weaponId) {
    if (!State.weapons || !State.weapons.specialBonuses) return null;
    return State.weapons.specialBonuses[weaponId] || null;
  },

  _getEnemyPenalty() {
    const c = State.combat;
    if (!c.enemy.debuff) return { accuracy: 0, agility: 0 };
    if (c.enemy.debuff === 'drunk') return { accuracy: -0.15, agility: -2 };
    if (c.enemy.debuff === 'wounded') return { accuracy: -0.05, agility: -3 };
    if (c.enemy.debuff === 'junkie') return { accuracy: -0.15, agility: -1 };
    return { accuracy: 0, agility: 0 };
  },

  playerAction(action, target) {
    const c = State.combat;
    if (!c || !c.active || c.finished || c.turn !== 'player') return { ok: false };

    // Адреналин: одноразовый буст
    if (State.player.combatBoost && State.player.combatBoost.initiative) {
      this._log('Сердце колотится. Ты быстрее.', 'good');
      State.player.combatBoost = null;
    }

    const weapon = Weapons.find(c.playerState.weaponId);
    if (!weapon) return { ok: false };

    switch (action) {
      case 'shoot':
        if (c.playerState.jammed) {
          this._log('Затвор заклинило. Жми «Передёрнуть».', 'bad');
          return { ok: false };
        }
        if (c.playerState.ammo <= 0) { this._log('Пусто. Перезаряди.', 'bad'); return { ok: false }; }
        c.playerState.ammo--;
        this._resolveShoot('player', 'enemy', target);
        c.playerState.aimBonus = 0;
        
        // Износ оружия (0.5% - 1% за выстрел)
        if (c.playerState.weaponId !== 'melee_knife' && !c.playerState.weaponId.startsWith('melee_')) {
          const wear = 0.5 + Math.random() * 0.5;
          if (!State.weapons.durability) State.weapons.durability = {};
          let dur = State.weapons.durability[c.playerState.weaponId] !== undefined ? State.weapons.durability[c.playerState.weaponId] : 100;
          dur = Math.max(0, dur - wear);
          State.weapons.durability[c.playerState.weaponId] = dur;
          
          if (dur <= 0) {
            c.playerState.jammed = true;
            this._log('Оружие заклинило! Нужно передёрнуть затвор.', 'bad');
          }
        }
        break;
      case 'unjam':
        if (!c.playerState.jammed) return { ok: false };
        c.playerState.jammed = false;
        State.weapons.durability[c.playerState.weaponId] = 10; // Чиним на 10%
        this._log('Ты дёргаешь затвор. Оружие оживает. Но ненадолго.', 'info');
        break;

      case 'aim':
        c.playerState.aimBonus = 0.25;
        this._log('Ты целишься. Дыхание ровное.', 'info');
        break;
      case 'cover':
        c.playerState.coverBonus = 0.4;
        this._log('Ты уходишь в укрытие. Дождь прикрывает.', 'info');
        break;
      case 'reload': {
        const effectiveMag = c.playerState.effectiveMag || weapon.magazine;
        if (c.playerState.ammo >= effectiveMag) return { ok: false };
        const ammoType = Weapons.ammo.find(a => a.for.includes(weapon.category));
        if (!ammoType) return { ok: false };
        if (!State.player.inventory) State.player.inventory = {};
        if (!State.player.inventory.ammo) State.player.inventory.ammo = {};
        const reserve = State.player.inventory.ammo[ammoType.id] || 0;
        if (reserve <= 0) {
          this._log('Патроны кончились. Совсем.', 'bad');
          return { ok: false };
        }
        const needed = effectiveMag - c.playerState.ammo;
        const loaded = Math.min(needed, reserve);
        c.playerState.ammo += loaded;
        State.player.inventory.ammo[ammoType.id] = reserve - loaded;
        if (typeof Sfx !== 'undefined') Sfx.play('reload');
        this._log('Перезарядка: +' + loaded + ' патронов. В запасе: ' + (reserve - loaded) + '.', 'info');
        break;
      }
      case 'melee':
        if (c.distance > 2) { this._log('Слишком далеко.', 'bad'); return { ok: false }; }
        // БАГ #41+#62: melee-удар использует фиксированное «кулачное» оружие,
        // а не пистолет игрока. Урон 8-12, шанс 0.75.
        this._resolveMelee();
        c.playerState.aimBonus = 0;
        break;
      case 'intimidate': {
        if (!State.player || !State.player.stats) return { ok: false };
        const drugBonus = (typeof Drugs !== 'undefined') ? Drugs.getActiveBonuses() : { charisma: 0 };
        const outfit = (typeof OutfitsSystem !== 'undefined' && OutfitsSystem.getCurrent) ? OutfitsSystem.getCurrent() : null;
        const outfitBonus = outfit ? (outfit.charisma || 0) : 0;
        const effectiveCharisma = (State.player.stats.charisma || 0) + (drugBonus.charisma || 0) + outfitBonus;
        const enemyWill = (c.enemy && c.enemy.stats && c.enemy.stats.willpower) || 1;
        let chance = (effectiveCharisma - enemyWill) / 20 + 0.3;
        if (typeof Perks !== 'undefined') {
          chance += Perks.getModifiers().intimidateBonus || 0;
        }
        if (Utils.chance(Utils.clamp(chance, 0.1, 0.8))) {
          c.enemy.morale -= 30;
          this._log('Он опускает взгляд.', 'combat');
          if (c.enemy.morale <= 0) {
            this._log('Он разворачивается и уходит.', 'combat');
            this._finish('win');
            return { ok: true };
          }
        } else {
          this._log('Он усмехается. «Слова? Серьёзно?»', 'combat');
        }
        break;
      }
      case 'flee': {
        if (!State.player) return { ok: false };
        const san = State.player.sanity || { sanity: 100 };
        const pBody = State.player.body || {};
        const pStats = State.player.stats || {};
        const eBody = (c.enemy && c.enemy.body) || {};
        const eStats = (c.enemy && c.enemy.stats) || {};
        // При срыве нельзя бежать
        if ((san.sanity || 0) < 25) {
          this._log('Ты не можешь бежать. Ярость сильнее страха.', 'bad');
          return { ok: false };
        }
        if (pBody.leftLeg && pBody.rightLeg && pBody.leftLeg.hp <= 0 && pBody.rightLeg.hp <= 0) {
          this._log('Твои ноги не держат. Бежать не выйдет.', 'bad');
          return { ok: false };
        }
        // #35: agility из дебаффов тоже влияет на побег
        const pen = this._getAllPenalties();
        let fleeChance = 0.4 + ((pStats.agility || 0) + (pen.agility || 0) - (eStats.agility || 0)) / 30;
        if (eBody.leftLeg && eBody.rightLeg && eBody.leftLeg.hp <= 0 && eBody.rightLeg.hp <= 0) {
          fleeChance = 0.99; // Враг не может преследовать
        }
        if (Utils.chance(Utils.clamp(fleeChance, 0.1, 0.95))) {
          this._log('Ты бежишь. Позади — выстрел. Мимо.', 'combat');
          const mods = (typeof Perks !== 'undefined') ? Perks.getModifiers() : { fleeNoPenalty: 0 };
          if (mods.fleeNoPenalty && Utils.chance(mods.fleeNoPenalty)) {
            this._log('Тень. Никто не заметил.', 'info');
            this._finish('flee_silent');
          } else {
            this._finish('flee');
          }
          return { ok: true };
        } else {
          this._log('Он предугадывает движение.', 'bad');
        }
        break;
      }
      default: return { ok: false };
    }

    if (c.finished) { Engine.render(); Save.save(); return { ok: true }; }
    if (this._checkEnd()) { Engine.render(); Save.save(); return { ok: true }; }

    c.turn = 'enemy';
    this._enemyTurn();
    return { ok: true };
  },

  _resolveMelee() {
    const c = State.combat;
    if (!c) return;
    if (!State.player || !State.player.stats) return;
    const pAgility = State.player.stats.agility || 5;
    const pStrength = State.player.stats.strength || 5;
    
    const weapon = Weapons.find(c.playerState.weaponId);
    const isMeleeWeapon = weapon && weapon.category === 'melee';
    
    // Если в руках melee-оружие — используем его статы. Иначе — кулаки.
    const hitChance = isMeleeWeapon 
      ? Utils.clamp(weapon.accuracy + pAgility / 40 - 0.1, 0.4, 0.95)
      : Utils.clamp(0.55 + pAgility / 40, 0.3, 0.75);
    
    const baseDmg = isMeleeWeapon
      ? weapon.damage + Math.floor(pStrength / 2)
      : Utils.rnd(4, 8) + Math.floor(pStrength / 3);
    
    const target = Utils.pick(['head', 'torso', 'torso', 'torso', 'leftArm', 'rightArm']);

    if (Utils.chance(hitChance)) {
      if (typeof Sfx !== 'undefined') Sfx.play('melee');
      const bodyMult = Weapons.bodyMultByCategory.melee;
      const dmg = Math.round(baseDmg * (bodyMult[target] || 1));
      this._applyDamage('enemy', target, dmg);
      const targetName = {
        head: 'голову', torso: 'корпус',
        leftArm: 'левую руку', rightArm: 'правую руку',
        leftLeg: 'левую ногу', rightLeg: 'правую ногу',
      }[target] || 'корпус';
      const weaponName = isMeleeWeapon ? weapon.name : 'кулак';
      const flavor = Utils.pick(['Хруст.', 'Он отшатывается.', 'Кровь из носа.', 'Глухой звук.', 'Он сгибается.']);
      this._log('Ты (' + weaponName + ') \u2192 ' + targetName + '. Удар: \u2212' + dmg + ' HP. ' + flavor, 'combat');
    } else {
      this._log('Удар. Мимо. Он успевает отскочить.', 'combat');
    }
  },

  _resolveShoot(attackerKey, defenderKey, target, melee = false) {
    const c = State.combat;
    if (!c || !c.enemy) return;
    if (!State.player || !State.player.body || !State.player.stats) return;
    if (!c.enemy.body || !c.enemy.stats) return;
    const isPlayer = attackerKey === 'player';
    const attacker = isPlayer
      ? { body: State.player.body, stats: State.player.stats, weaponId: c.playerState.weaponId, aimBonus: c.playerState.aimBonus }
      : { body: c.enemy.body, stats: c.enemy.stats, weaponId: c.enemy.weaponId, aimBonus: c.enemy.aimBonus };
    const defender = isPlayer
      ? { body: c.enemy.body, stats: c.enemy.stats, coverBonus: c.enemy.coverBonus }
      : { body: State.player.body, stats: State.player.stats, coverBonus: c.playerState.coverBonus };

    const weapon = Weapons.find(attacker.weaponId);
    if (!weapon) return;
    const bodyMult = Weapons.bodyMultByCategory[weapon.category] || {};

    let hit = weapon.accuracy + attacker.stats.shooting / 20 + (attacker.aimBonus || 0);
    if (isPlayer) {
      const sb = this._getSpecialBonus(c.playerState.weaponId);
      if (sb === 'accuracy') hit += 0.10;
    }
    if (c.distance > weapon.range) hit -= Math.min(0.4, (c.distance - weapon.range) * 0.05);
    hit -= defender.coverBonus || 0;
    if (attacker.body.leftArm.hp <= 0 || attacker.body.rightArm.hp <= 0) hit -= 0.4;

    // Штраф за прицеливание (в голову попасть сложнее всего)
    if (weapon.category !== 'melee') {
      const targetPenalty = {
        head: 0.45, torso: 0,
        leftArm: 0.20, rightArm: 0.20,
        leftLeg: 0.15, rightLeg: 0.15
      };
      hit -= targetPenalty[target] || 0;
    }

    // Дебаффы стрелка
    if (isPlayer) {
      const pen = this._getAllPenalties();
      hit += pen.accuracy;
      if (typeof Perks !== 'undefined') {
        hit += Perks.getModifiers().accuracy || 0;
      }
      // #Fix: боевая усталость
      const fatigue = (State.player.survival && State.player.survival.combatFatigue) || 0;
      if (fatigue > 0) hit -= fatigue * 0.05; // -5% за каждый бой за день
    } else {
      const pen = this._getEnemyPenalty();
      hit += pen.accuracy;
    }

    hit = Utils.clamp(hit, 0.05, 0.95);

    // Потолок для выстрела в голову — 35%
    if (target === 'head') hit = Math.min(hit, 0.35);

    const shooterName = isPlayer ? 'Ты' : c.enemy.name;
    const targetName = {
      head: 'голову', torso: 'корпус',
      leftArm: 'левую руку', rightArm: 'правую руку',
      leftLeg: 'левую ногу', rightLeg: 'правую ногу',
    }[target] || 'корпус';

    if (typeof Sfx !== 'undefined') Sfx.play('shoot_' + weapon.category);
    if (Utils.chance(hit)) {
      if (typeof Sfx !== 'undefined') Sfx.play('hit');
      let dmg = Math.round(weapon.damage * (bodyMult[target] || 1));
      if (isPlayer) {
        const sbDmg = this._getSpecialBonus(c.playerState.weaponId);
        if (sbDmg === 'damage') dmg = Math.round(dmg * 1.15);
      }

      if (isPlayer && typeof Perks !== 'undefined') {
        const mods = Perks.getModifiers();
        if (mods.damagePistolSmg && (weapon.category === 'pistol' || weapon.category === 'smg')) {
          dmg = Math.round(dmg * (1 + mods.damagePistolSmg));
        }
        if (target === 'head' && mods.headshotChance && Utils.chance(mods.headshotChance)) {
          dmg = c.enemy.body.head.max;
          this._log('Смертельный выстрел. Он даже не понял.', 'good');
        }
      }

      this._applyDamage(defenderKey, target, dmg);
      this._log(`${shooterName} → ${targetName}. −${dmg} HP. ${Utils.pick(Lore.noir.combat.hit)}`, 'combat');

      // Шанс травмы (только для игрока, чтобы не усложнять)
      if (defenderKey === 'player' && typeof Wounds !== 'undefined') {
        Wounds.maybeInjure(target, dmg);
      }
      // У врага — простой флаг «wounded» если урон большой
      if (defenderKey === 'enemy' && dmg > 25 && !c.enemy.debuff) {
        c.enemy.debuff = 'wounded';
        this._log(c.enemy.name + ' хромает. Ты видишь это.', 'info');
      }
    } else {
      if (typeof Sfx !== 'undefined') Sfx.play('miss');
      this._log(`${shooterName} → ${targetName}. ${Utils.pick(Lore.noir.combat.miss)}`, 'combat');
    }

    if (isPlayer) c.playerState.aimBonus = 0;
    else c.enemy.aimBonus = 0;
  },

  _applyDamage(targetKey, part, amount) {
    const c = State.combat;
    const body = targetKey === 'player' ? State.player.body : c.enemy.body;
    const p = body[part];
    if (!p) return;

    // Броня врага
    if (targetKey === 'enemy' && c.enemy.armor) {
      const reduction = Math.min(amount * 0.6, c.enemy.armor);
      amount = Math.max(1, amount - reduction);
      if (reduction > 0 && Utils.chance(0.2)) this._log('Бронежилет врага поглотил часть урона.', 'info');
    }

    // Броня игрока снижает урон
    if (targetKey === 'player' && State.player.armor) {
      const armor = Weapons.findArmor(State.player.armor);
      if (armor) {
        const reduction = Math.min(amount * 0.6, armor.defense);
        amount = Math.max(1, amount - reduction);
        if (reduction > 0 && Utils.chance(0.2)) {
          this._log('Броня выдержала удар (−' + Math.round(reduction) + ' урона).', 'info');
        }
      }
    }

    p.hp = Math.max(0, p.hp - amount);

    if (p.hp <= 0 && (part === 'head' || part === 'torso')) {
      if (targetKey === 'enemy') {
        c.enemy.dead = true;
        if (typeof Sfx !== 'undefined') Sfx.play('death');
        this._log('Он падает. ' + Utils.pick(Lore.noir.win), 'combat');
      } else {
        this._finish('lose');
      }
    }
  },

  _checkEnd() {
    const c = State.combat;
    if (!c) return true;
    if (c.finished) return true;
    if (!State.player || !State.player.body) return true;
    if (!c.enemy || !c.enemy.body) return true;
    // Враг мёртв — по флагу ИЛИ по HP (кровотечение могло обнулить торс)
    if (c.enemy.dead || c.enemy.body.head.hp <= 0 || c.enemy.body.torso.hp <= 0) {
      this._finish('win');
      return true;
    }
    // Игрок мёртв
    if (State.player.body.head.hp <= 0 || State.player.body.torso.hp <= 0) {
      this._finish('lose');
      return true;
    }
    return false;
  },

  _enemyTurn() {
    const c = State.combat;
    if (!c.active || c.finished || c.turn !== 'enemy') return;
    const enemy = c.enemy;
    if (!enemy || !enemy.body) return;

    if (enemy.ammo <= 0) {
      enemy.ammo = (Weapons.find(enemy.weaponId) || {}).magazine || 6;
      this._log(enemy.name + ' перезаряжает.', 'info');
    } else if (enemy.ai === 'desperate' && enemy.morale < 50 && Utils.chance(0.25)) {
      if (enemy.body.leftLeg && enemy.body.rightLeg && (enemy.body.leftLeg.hp <= 0 || enemy.body.rightLeg.hp <= 0)) {
        this._log(enemy.name + ' пытается бежать, но хромает. Не выходит.', 'combat');
      } else {
        this._log(enemy.name + ' отступает.', 'combat');
        this._finish('win');
        return;
      }
    } else if (enemy.ai === 'cautious' && Utils.chance(0.2)) {
      enemy.coverBonus = 0.4;
      this._log(enemy.name + ' уходит в укрытие.', 'info');
    } else {
      let target = 'torso';
      const r = Math.random();
      if (r < 0.25) target = 'head';
      else if (r < 0.4) target = 'leftArm';
      else if (r < 0.55) target = 'rightArm';
      enemy.ammo--;
      this._resolveShoot('enemy', 'player', target);
    }

    if (c.finished) { Engine.render(); Save.save(); return; }
    if (this._checkEnd()) { Engine.render(); Save.save(); return; }

    c.turn = 'player';
    c.round++;
    if (c.playerState.coverBonus > 0) c.playerState.coverBonus = 0;
    if (c.enemy.coverBonus > 0 && Utils.chance(0.5)) c.enemy.coverBonus = 0;

    this._tickBleeding();
    if (this._checkEnd()) { Engine.render(); Save.save(); return; }
    Engine.render();
    Save.save();
  },

  _tickBleeding() {
    if (!State.player || !State.player.body || !State.player.body.torso) return;
    if (State.player.body.torso.hp > 0 && State.player.body.torso.hp < 30) {
      State.player.body.torso.hp = Math.max(0, State.player.body.torso.hp - 3);
      this._log('Кровь. Ты теряешь силы.', 'bad');
    }
    const c = State.combat;
    if (c.enemy.body.torso.hp > 0 && c.enemy.body.torso.hp < 30) {
      c.enemy.body.torso.hp = Math.max(0, c.enemy.body.torso.hp - 3);
    }
  },

  _finish(outcome) {
    const c = State.combat;
    if (!c || c.finished) return;
    c.active = false;
    c.finished = true;
    c.outcome = outcome;

    // Возврат остатка патронов из магазина в инвентарь
    const weapon = Weapons.find(c.playerState.weaponId);
    if (weapon && c.playerState.ammo > 0) {
      if (!State.player.inventory) State.player.inventory = {};
      if (!State.player.inventory.ammo) State.player.inventory.ammo = {};
      const ammoType = Weapons.ammo.find(a => a.for.includes(weapon.category));
      if (ammoType) {
        State.player.inventory.ammo[ammoType.id] =
          (State.player.inventory.ammo[ammoType.id] || 0) + c.playerState.ammo;
      }
    }

    if (typeof Music !== 'undefined') Music.playBackground();
    if (outcome === 'win') this._rewardPlayer();
    else if (outcome === 'flee') Economy.changeRep(-3, 'Побег — не выход. Репутация пострадала.');
    // flee_silent — без штрафа

    // Если игрок умер во время _rewardPlayer — State.combat = null, не сохраняем
    if (!State.combat) return;

    Save.save();
  },

  _rewardPlayer() {
    const c = State.combat;
    if (!State.player) return;
    if (!State.player.lifetime) State.player.lifetime = { kills: 0, moneyEarned: 0, missionsDone: 0, daysSurvived: 0, deaths: 0, overdoses: 0, breakdowns: 0 };
    if (!State.player.survival) State.player.survival = { hunger: 100, thirst: 100, energy: 100, combatFatigue: 0 };
    if (!State.weapons) State.weapons = { owned: [], durability: {}, forSale: [] };
    if (!State.weapons.owned) State.weapons.owned = [];
    const xp = 20 + c.enemy.level * 10;
    const money = c.enemy.loot.money;
    const rep = 2 + Math.floor(c.enemy.level / 2);

    State.player.lifetime.kills++;
    if (typeof PersonalEnemies !== 'undefined' && PersonalEnemies.onKill) PersonalEnemies.onKill(c.enemy.name, c.enemy.level);
    State.player.survival.combatFatigue = (State.player.survival.combatFatigue || 0) + 1;
    if (State.player.survival.combatFatigue === 3) {
      Engine.log('Руки дрожат. Слишком много стрельбы за сегодня. Нужен отдых.', 'warn');
    } else if (State.player.survival.combatFatigue > 3) {
      Engine.log('Ты валишься с ног. Точность сильно упала.', 'bad');
    }
    if (typeof Sanity !== 'undefined') Sanity.onKill();
    Economy.addXp(xp);
    Economy.earn(money, 'добыча с врага');
    Economy.changeRep(rep, 'уважение выросло');
    const sbHeat = this._getSpecialBonus(c.playerState && c.playerState.weaponId);
    if (sbHeat === 'silencer') {
      Economy.changeHeat(1);
      this._log('Тихий выстрел. Меньше шума — меньше копов.', 'info');
    } else {
      Economy.changeHeat(3);
    }

    if (c.enemy.loot.weaponId && !State.weapons.owned.includes(c.enemy.loot.weaponId)) {
      State.weapons.owned.push(c.enemy.loot.weaponId);
      const lootW = Weapons.find(c.enemy.loot.weaponId);
      this._log('Ты забираешь: ' + (lootW ? lootW.name : c.enemy.loot.weaponId), 'good');
    }

    Time.advance(1);

    // Если умер от истощения во время advance — выходим
    if (!State.player || !State.city) return;

    if (c.context && c.context.type === 'quest' && c.context.questId && typeof Quests !== 'undefined') {
      Quests.reward(c.context.questId);
    }

    // Убийство копа: сильный штраф к репутации, большой Heat
    if (c.context && c.context.type === 'cop') {
      Economy.changeHeat(17, 'Убийство копа'); // +3 базовый +17 = +20 итого
      Economy.changeRep(-23, 'Убийство копа'); // -3 (базовый от копа) -20 (спец) = -23 итого
    }

    // Засада: Heat растёт, REP не даём (античит)
    if (c.context && c.context.type === 'ambush') {
      Economy.changeHeat(2, 'Шум на улице'); // +3 базовый +2 = +5 итого
    }

    // Захват зоны фракции
    if (c.context && c.context.type === 'zoneCapture' && typeof ZonesSystem !== 'undefined') {
      ZonesSystem.onFactionZoneCapture(c.context.zoneId, c.context.factionId);
    }
  },
};
