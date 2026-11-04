const Wounds = {
  // Проверка получения травмы при уроне
  maybeInjure(part, damage) {
    if (!State.player || !State.player.conditions) return;
    if (damage < WoundData.injuryMinDamage) return;
    const chances = WoundData.injuryChance[part];
    if (!chances) return;

    const cond = State.player.conditions[part];
    if (!cond) return;

    for (const [injury, chance] of Object.entries(chances)) {
      if (cond[injury]) continue; // уже есть
      if (Utils.chance(chance)) {
        cond[injury] = true;
        const data = WoundData.conditions[injury];
        if (!data) continue;
        Engine.log('Травма: ' + data.name + ' (' + part + ').', 'bad');
        if (typeof Sanity !== 'undefined') Sanity.onBloodyEvent(2);
      }
    }
  },

  // Тик: кровотечение, инфекция бьют по HP
  tick() {
    if (!State.player) return;
    const player = State.player;
    if (!player.conditions) player.conditions = {};
    if (!player.body) return;
    const conds = player.conditions;

    for (const part of Object.keys(conds)) {
      const c = conds[part];
      for (const [injury, active] of Object.entries(c)) {
        if (!active) continue;
        const data = WoundData.conditions[injury];
        if (!data) continue;

        if (data.tickEffect) {
          const dmg = data.tickEffect.hpLoss || 0;
          if (dmg > 0) {
            const target = data.tickEffect.part || part;
            if (player.body[target] && typeof player.body[target].hp === 'number') {
              player.body[target].hp = Math.max(0, player.body[target].hp - dmg);
            }
          }
        }

        // Шанс ухудшения (кровотечение → инфекция)
        if (injury === 'bleeding' && !c.infected && Utils.chance(0.02)) {
          c.infected = true;
          Engine.log(Utils.pick(Lore.noir.infection), 'bad');
        }
      }
    }

    // Смерть от травм
    if (player.body.torso && player.body.head && (player.body.torso.hp <= 0 || player.body.head.hp <= 0)) {
      Engine.log('Травмы доконали тебя.', 'bad');
      if (typeof DeathSystem !== 'undefined') DeathSystem.fullRestart();
      return;
    }
  },

  // Лечение
  treat(part, injury) {
    if (!State.player || !State.player.conditions) return false;
    if (!State.player.inventory || !State.player.inventory.medicine) return false;
    const cond = State.player.conditions[part];
    if (!cond || !cond[injury]) {
      Engine.log('Этого состояния нет.', 'warn');
      return false;
    }
    const data = WoundData.conditions[injury];
    if (!data.treatWith) {
      Engine.log('Это лечится только временем.', 'warn');
      return false;
    }
    const inv = State.player.inventory.medicine;
    let medToUse = data.treatWith;

    // Fallback на аптечку (medkit), если нет специфичного медикамента
    if ((inv[medToUse] || 0) <= 0 && (inv.medkit || 0) > 0) {
      medToUse = 'medkit';
      Engine.log('Используешь аптечку вместо ' + (WoundData.medicine[data.treatWith]?.name || 'лекарства') + '.', 'info');
    }

    if ((inv[medToUse] || 0) <= 0) {
      const medName = (WoundData.medicine[data.treatWith] && WoundData.medicine[data.treatWith].name) || data.treatWith;
      Engine.log('Нужно: ' + medName, 'warn');
      return false;
    }

    // БАГ #36: проверяем возможность траты времени ДО списания медикамента
    if (!Time.canSpend(data.treatTime)) {
      Engine.log('Слишком поздно. Лечение подождёт до утра.', 'warn');
      return false;
    }
    inv[medToUse]--;
    const medData = WoundData.medicine[medToUse];
    if (medData && medData.healsHp && State.player.body && State.player.body[part]) {
      State.player.body[part].hp = Math.min(State.player.body[part].max, State.player.body[part].hp + medData.healsHp);
      Engine.log('Рана обработана (+' + medData.healsHp + ' HP).', 'good');
    }

    if (!Time.spend(data.treatTime, 'Лечение: ' + data.name)) return false;
    if (!State.player || !State.city) return true; // #42

    cond[injury] = false;
    Engine.log(data.treatLog, 'good');

    // Шанс что не помогло (для инфекции/перелома)
    if (injury === 'infected' && Utils.chance(0.2)) {
      cond.infected = true;
      Engine.log(Utils.pick(Lore.noir.infection), 'bad');
      Engine.log('Инфекция вернулась. Нужен другой подход.', 'warn');
    }

    Save.save();
    Engine.render();
    return true;
  },

  // Автолечение в медпункте (при сне)
  medbayHeal() {
    if (!State.player || !State.player.conditions) return;
    if (!State.building || !State.building.modules || !State.building.modules.medbay) return;
    const level = State.building.modules.medbay.level;
    if (level <= 0) return;

    // Лечим лёгкие состояния
    for (const part of Object.keys(State.player.conditions)) {
      const cond = State.player.conditions[part];
      for (const [injury, active] of Object.entries(cond)) {
        if (!active) continue;
        // Медпункт лечит кровотечение и ожоги, НЕ переломы/инфекцию
        if ((injury === 'bleeding' || injury === 'burn' || injury === 'shrapnel') && Utils.chance(level * 0.2)) {
          cond[injury] = false;
          const wName = (WoundData.conditions[injury] && WoundData.conditions[injury].name) || injury;
          Engine.log('Медпункт обработал: ' + wName + '.', 'good');
        }
      }
    }
  },

  // Проверка дебаффов для боя
  getCombatPenalties() {
    const pen = { accuracy: 0, agility: 0, initiative: 0, log: [] };
    if (!State.player || !State.player.conditions) return pen;
    // Обезболивание снижает штрафы (баг #13)
    let painkiller = 0;
    if (typeof Drugs !== 'undefined') {
      const drugsBonus = Drugs.getActiveBonuses();
      painkiller = drugsBonus.painkiller || 0;
    }
    const relief = 1 - Math.min(1, painkiller / 100);

    for (const [part, conds] of Object.entries(State.player.conditions)) {
      for (const [injury, active] of Object.entries(conds)) {
        if (!active) continue;
        const data = WoundData.conditions[injury];
        if (!data) continue;
        if (data.statPenalty) {
          if (data.statPenalty.shooting) pen.accuracy += (data.statPenalty.shooting / 100) * relief;
          if (data.statPenalty.agility) pen.agility += (data.statPenalty.agility / 2) * relief;
        }
        pen.log.push(data.name + ' (' + part + ')' + (painkiller > 0 ? ' [обезбол]' : ''));
      }
    }
    return pen;
  },

  // Купить медикаменты
  useMedicine(medId) {
    if (!State.player || !State.player.inventory || !State.player.inventory.medicine) return false;
    if (!State.player.survival) State.player.survival = { hunger: 100, thirst: 100, energy: 100, combatFatigue: 0 };
    if (!State.player.conditions) State.player.conditions = {};
    if (!State.player.dependencies) State.player.dependencies = { activeEffects: [] };
    if (!State.player.dependencies.activeEffects) State.player.dependencies.activeEffects = [];
    if (typeof WoundData === 'undefined' || !WoundData.medicine) return false;
    const med = WoundData.medicine[medId];
    if (!med) return false;
    if ((State.player.inventory.medicine[medId] || 0) <= 0) {
      Engine.log('Нет такого медикамента.', 'warn');
      return false;
    }
    if (!Time.canSpend(0.25)) { Engine.log('Слишком поздно.', 'warn'); return false; }
    
    let used = false;
    
    // Лечение HP (выбираем самую раненую часть)
    if (med.healsHp && State.player.body) {
      const parts = Object.keys(State.player.body).filter(p => State.player.body[p].hp < State.player.body[p].max);
      if (parts.length > 0) {
        parts.sort((a,b) => (State.player.body[a].hp/State.player.body[a].max) - (State.player.body[b].hp/State.player.body[b].max));
        const part = parts[0];
        State.player.body[part].hp = Math.min(State.player.body[part].max, State.player.body[part].hp + med.healsHp);
        Engine.log('Ты используешь ' + med.name + '. ' + part + ' +' + med.healsHp + ' HP.', 'good');
        used = true;
      }
    }
    
    // Энергия
    if (med.energyBoost) {
      State.player.survival.energy = Math.min(100, (State.player.survival.energy || 0) + med.energyBoost);
      Engine.log('Ты чувствуешь прилив сил. +' + med.energyBoost + ' энергии.', 'good');
      used = true;
    }
    
    // Обезболивание
    if (med.painkiller) {
      if (!State.player.dependencies) State.player.dependencies = { activeEffects: [] };
      if (!State.player.dependencies.activeEffects) State.player.dependencies.activeEffects = [];
      State.player.dependencies.activeEffects.push({ id: 'painkiller_' + Date.now(), type: 'buff', source: medId, until: Time.totalHours() + (med.duration || 3), data: { painkiller: med.painkiller } });
      Engine.log('Боль отступает. На время.', 'good');
      used = true;
    }
    
    // Боевой буст (адреналин)
    if (med.combatBoost) {
      State.player.combatBoost = med.combatBoost;
      Engine.log('Сердце колотится. Готов к драке.', 'good');
      used = true;
    }
    
    // Снимаем травму, если предмет лечит condition и через инвентарь
    if (med.treatConditions && Array.isArray(med.treatConditions)) {
      for (const part of Object.keys(State.player.conditions)) {
        const cond = State.player.conditions[part];
        if (!cond) continue;
        for (const inj of med.treatConditions) {
          if (cond[inj]) {
            cond[inj] = false;
            Engine.log('Ты обработал ' + inj + '.', 'good');
            used = true;
            break;
          }
        }
        if (used) break;
      }
    }

    // Жгут (останавливает кровотечение)
    if (medId === 'tourniquet') {
      const conds = State.player.conditions || {};
      for (const part of Object.keys(conds)) {
        if (conds[part] && conds[part].bleeding) {
          conds[part].bleeding = false;
          Engine.log('Жгут наложен. Кровотечение остановлено.', 'good');
          used = true;
          break;
        }
      }
    }
    
    if (!used) {
      Engine.log('Этот предмет сейчас не нужен.', 'warn');
      return false;
    }
    
    State.player.inventory.medicine[medId]--;
    Time.spend(0.25);
    if (!State.player || !State.city) return true;
    Save.save();
    Engine.render();
    return true;
  },

  buyMedicine(medId, quantity = 1) {
    if (!State.player || !State.player.inventory) return false;
    if (!State.player.inventory.medicine) State.player.inventory.medicine = {};
    if (!State.flags) State.flags = {};
    const med = WoundData.medicine[medId];
    if (!med) return false;
    let discount = State.flags.tradeDiscount || 0;
    if (typeof Perks !== 'undefined') discount += Perks.getModifiers().tradeDiscount || 0;
    discount = Math.min(0.5, discount);
    const price = Math.round(med.price * (1 - discount)) * quantity;
    if (!Economy.spend(price, med.name + ' ×' + quantity)) return false;
    State.player.inventory.medicine[medId] = (State.player.inventory.medicine[medId] || 0) + quantity;
    
    // Применяем эффект Детокса сразу при покупке
    if (medId === 'detox') {
      const deps = State.player.dependencies;
      if (deps) {
        deps.nicotine = 0;
        deps.alcohol = 0;
        deps.stimulants = 0;
        deps.opiates = 0;
        deps.withdrawal = null;
        if (State.player.body && State.player.body.torso) {
          State.player.body.torso.hp = Math.max(1, (State.player.body.torso.hp || 50) - 20);
        }
        Engine.log('Врач вводит тебе капельницу. Кровь горит. Зависимость исчезла, но ты ослаб.', 'warn');
        State.player.inventory.medicine[medId]--;
        Save.save();
        Engine.render();
        return true;
      }
    }
    Engine.log(Utils.pick(Lore.noir.actions.medicine), 'good');
    Save.save();
    Engine.render();
    return true;
  },
};
