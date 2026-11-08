const DrugDataBrands = {
  cig: {
    camel: { name: 'Camel', price: 60, stress: -10, addiction: 8, desc: 'Крепкие. С легким привкусом шоколада.' },
    marlboro: { name: 'Marlboro', price: 70, stress: -12, addiction: 10, desc: 'Классика. Красная пачка.' },
    lucky: { name: 'Lucky Strike', price: 50, stress: -8, addiction: 6, desc: 'Дешевые. Воняют, но курятся.' }
  },
  alc: {
    whiskey: { name: 'Виски', price: 150, stress: -20, addiction: 12, desc: 'Обжигает. Помогает.' },
    vodka: { name: 'Водка', price: 100, stress: -15, addiction: 10, desc: 'Безвкусная. Убивает.' },
    rum: { name: 'Ром', price: 180, stress: -25, addiction: 14, desc: 'Пахнет пиратами и смертью.' }
  }
};

const Drugs = {
  use(drugId) {
    const drug = DrugData.find(drugId);
    if (!drug) return false;

    // #48: проверяем время ДО списания
    if (!Time.canSpend(drug.useTime || 0.25)) {
      Engine.log('Слишком поздно. Иди спать.', 'warn');
      return false;
    }

    if (!State.player) return false;
    if (!State.player.inventory) State.player.inventory = {};
    if (!State.player.inventory.drugs) State.player.inventory.drugs = {};
    if (!State.player.dependencies) State.player.dependencies = { nicotine: 0, alcohol: 0, stimulants: 0, opiates: 0, activeEffects: [], withdrawal: null };
    if (!State.player.dependencies.activeEffects) State.player.dependencies.activeEffects = [];
    const inv = State.player.inventory;
    const deps = State.player.dependencies;

    // Проверка наличия
    if (drugId === 'alcohol') {
      if (inv.alcohol <= 0) { Engine.log('Нет алкоголя.', 'warn'); return false; }
      inv.alcohol--;
    } else if (drugId === 'cigarettes') {
      if (inv.cigs <= 0) { Engine.log('Нет сигарет.', 'warn'); return false; }
      inv.cigs--;
    } else {
      if ((inv.drugs[drugId] || 0) <= 0) { Engine.log('Нет ' + drug.name + '.', 'warn'); return false; }
      inv.drugs[drugId]--;
    }

    // Передозировка?
    const dep = deps[drug.category] || 0;
    if (dep > (drug.overdoseThreshold || 100) && Utils.chance(drug.overdoseChance || 0)) {
      Engine.log('— ПЕРЕДОЗ —', 'bad');
      Engine.log(Utils.pick(Lore.noir.overdose), 'lore');
      if (!State.player.lifetime) State.player.lifetime = { kills: 0, moneyEarned: 0, missionsDone: 0, daysSurvived: 0, deaths: 0, overdoses: 0, breakdowns: 0 };
      State.player.lifetime.overdoses++;
      // Смерть или тяжёлое состояние
      if (Utils.chance(0.7)) {
        if (typeof DeathSystem !== 'undefined') DeathSystem.fullRestart('Передоз. Доза оказалась больше, чем ты.');
        return true;
      } else {
        if (State.player.body && State.player.body.torso) State.player.body.torso.hp = Math.max(1, (State.player.body.torso.hp || 50) - 50);
        Engine.log('Ты выжил. Но лучше бы нет.', 'bad');
      }
    }

    // Применяем эффекты
    this.applyEffects(drug);

    // #46: использование снимает ломку по этой категории
    if (deps.withdrawal && deps.withdrawal.type === drug.category) {
      deps.withdrawal = null;
      Engine.log('Ломка отпустила. Пока.', 'good');
    }

    // Рост зависимости
    deps[drug.category] = Math.min(100, (deps[drug.category] || 0) + drug.addictionGain);

    // Лог
    let actionLog = 'Ты используешь ' + drug.name + '.';
    if (drugId === 'cigarettes') actionLog = Utils.pick(Lore.noir.actions.smoke);
    else if (drugId === 'alcohol') actionLog = Utils.pick(Lore.noir.actions.alcohol);
    else if (drugId === 'cocaine' || drugId === 'amphetamine') actionLog = Utils.pick(Lore.noir.actions[drugId]);
    else if (drugId === 'heroin' || drugId === 'morphine') actionLog = Utils.pick(Lore.noir.actions[drugId]);
    Engine.log(actionLog, 'info');

    // Мгновенные эффекты на стресс/рассудок
    if (!State.player.sanity) State.player.sanity = { sanity: 100, stress: 0, killsToday: 0, lastResetDay: 0, nightmares: 0 };
    if (drug.effects.stress) {
      State.player.sanity.stress = Utils.clamp((State.player.sanity.stress || 0) + drug.effects.stress, 0, 100);
    }
    if (drug.effects.sanity) {
      State.player.sanity.sanity = Utils.clamp((State.player.sanity.sanity || 0) + drug.effects.sanity, 0, 100);
    }

    // Crash НЕ планируем здесь — он создастся когда бафф истечёт (см. tick)

    Time.spend(drug.useTime || 0.25);
    if (!State.player || !State.city) return true; // #39
    Save.save();
    Engine.render();
    return true;
  },

  applyEffects(drug) {
    if (!State.player || !State.player.dependencies) return;
    const deps = State.player.dependencies;
    if (!deps.activeEffects) deps.activeEffects = [];
    // #45: удаляем старый бафф этого же наркотика (refresh, не stack)
    deps.activeEffects = deps.activeEffects.filter(
      e => !(e.type === 'buff' && e.source === drug.id)
    );
    deps.activeEffects.push({
      id: 'effect_' + drug.id,
      type: 'buff',
      source: drug.id,
      name: drug.name,
      until: Time.totalHours() + (drug.effects.duration || 2),
      data: drug.effects,
    });
  },

  // Проверка ломки
  tick() {
    if (!State.player) return;
    const deps = State.player.dependencies;
    if (!deps) return;
    if (!deps.activeEffects) deps.activeEffects = [];

    const now = Time.totalHours();

    // #47: очищаем истёкшую ломку
    if (deps.withdrawal && deps.withdrawal.until <= now) {
      deps.withdrawal = null;
    }

    // Чистим истёкшие
    const expired = deps.activeEffects.filter(e => e.until <= now);
    deps.activeEffects = deps.activeEffects.filter(e => e.until > now);

    // Применяем эффекты от истёкших
    for (const e of expired) {
      if (e.type === 'buff' && e.data) {
        // Бафф истёк — если у наркотика есть крах, планируем его СЕЙЧАС
        const srcDrug = DrugData.find(e.source);
        if (srcDrug && srcDrug.crash) {
          deps.activeEffects.push({
            id: 'crash_' + e.source + '_' + now,
            type: 'crash',
            source: e.source,
            until: now + (srcDrug.crash.duration || 12),
            data: srcDrug.crash,
          });
          Engine.log('Крах от ' + srcDrug.name + '. Тело просит ещё.', 'bad');
        }
      }
      if (e.type === 'crash' && e.data) {
        Engine.log('Крах прошёл: ' + (DrugData[e.source]?.name || e.source), 'info');
      }
    }

    // Активные зависимости: без дозы — ломка
    // Ломка начинается, если зависимость > 30 и последняя доза была > 12 часов назад
    for (const cat of ['nicotine', 'alcohol', 'stimulants', 'opiates']) {
      const level = deps[cat] || 0;
      if (level > 30) {
        // Ищем последний приём
        const lastUse = deps.activeEffects
          .filter(e => DrugData[e.source]?.category === cat)
          .sort((a, b) => b.until - a.until)[0];
        // Если нет активного эффекта, шанс ломки
        if (!lastUse && Utils.chance(level / 500)) {
          this.triggerWithdrawal(cat, level);
        }
      }
    }
  },

  triggerWithdrawal(cat, level) {
    if (!State.player || !State.player.dependencies) return;
    if (!State.player.sanity) State.player.sanity = { sanity: 100, stress: 0, killsToday: 0, lastResetDay: 0, nightmares: 0 };
    const deps = State.player.dependencies;
    if (deps.withdrawal && deps.withdrawal.type === cat) return;
    deps.withdrawal = { type: cat, until: Time.totalHours() + 24 };
    Engine.log('— ЛОМКА (' + cat + ') —', 'bad');
    Engine.log(Utils.pick(Lore.noir.withdrawal), 'lore');
    State.player.sanity.sanity = Math.max(0, (State.player.sanity.sanity || 0) - 5);
    Save.save();
  },

  // Бонусы/штрафы для боя
  getActiveBonuses() {
    const deps = State.player.dependencies;
    const bonus = { accuracy: 0, agility: 0, initiative: 0, charisma: 0, painkiller: 0, log: [] };
    if (!deps) return bonus;
    if (!deps.activeEffects) return bonus;

    const now = Time.totalHours();

    for (const e of deps.activeEffects) {
      if (e.type === 'buff' && e.until > now && e.data) {
        if (e.data.shooting) bonus.accuracy += e.data.shooting / 100;
        if (e.data.agility) bonus.agility += e.data.agility / 2;
        if (e.data.accuracy) bonus.accuracy += e.data.accuracy;
        if (e.data.charisma) bonus.charisma += e.data.charisma;   // БАГ #14
        if (e.data.painkiller) bonus.painkiller = Math.max(bonus.painkiller, e.data.painkiller); // БАГ #13
      }
      if (e.type === 'crash' && e.until > now && e.data) {
        if (e.data.shooting) bonus.accuracy += e.data.shooting / 100;
        if (e.data.agility) bonus.agility += e.data.agility / 2;
      }
    }

    // Ломка
    if (deps.withdrawal && deps.withdrawal.until > now) {
      // #43: правильный маппинг категории на препарат
      const categoryToDrug = {
        nicotine: DrugData.cigarettes,
        alcohol: DrugData.alcohol,
        stimulants: DrugData.cocaine,
        opiates: DrugData.heroin
      };
      const drug = categoryToDrug[deps.withdrawal.type] || DrugData.cigarettes;
      const pen = drug.withdrawalPenalty || {};
      if (pen.shooting) bonus.accuracy += pen.shooting / 100;
      if (pen.agility) bonus.agility += pen.agility / 2;
      bonus.log.push(pen.log || 'Ломка.');
    }

    return bonus;
  },

  // Покупка
  buy(drugId, quantity = 1) {
    const drug = DrugData.find(drugId);
    if (!drug) return false;
    // #50: покупка тратит время
    if (!Time.canSpend(0.25)) { Engine.log('Слишком поздно. Иди спать.', 'warn'); return false; }
    const price = drug.price * quantity;
    if (!Economy.spend(price, drug.name + ' ×' + quantity)) return false;

    if (!State.player || !State.player.inventory) return false;
    if (!State.player.inventory.drugs) State.player.inventory.drugs = {};
    const inv = State.player.inventory;
    if (drugId === 'alcohol') inv.alcohol = (inv.alcohol || 0) + quantity;
    else if (drugId === 'cigarettes') inv.cigs = (inv.cigs || 0) + quantity;
    else inv.drugs[drugId] = (inv.drugs[drugId] || 0) + quantity;

    Engine.log('Ты прячешь ' + drug.name + ' во внутренний карман. Никто не видел.', 'good');
    Time.spend(0.25);
    if (!State.player || !State.city) return true; // #41
    Save.save();
    Engine.render();
    return true;
  },
  useBrand(type, brandId) {
    if (!State.player || !State.player.inventory) return;
    if (!State.player.inventory.cigs_inv) State.player.inventory.cigs_inv = {};
    if (!State.player.inventory.alc_inv) State.player.inventory.alc_inv = {};
    if (!State.player.sanity) State.player.sanity = { sanity: 100, stress: 0, killsToday: 0, lastResetDay: 0, nightmares: 0 };
    if (!State.player.dependencies) State.player.dependencies = { nicotine: 0, alcohol: 0, stimulants: 0, opiates: 0, activeEffects: [], withdrawal: null };
    const isCig = type === 'cig';
    const brand = isCig ? DrugDataBrands.cig[brandId] : DrugDataBrands.alc[brandId];
    if (!brand) return;
    
    const inv = isCig ? State.player.inventory.cigs_inv : State.player.inventory.alc_inv;
    if (!inv || (inv[brandId] || 0) <= 0) {
      Engine.log('У тебя нет этого.', 'warn');
      return;
    }
    
    inv[brandId]--;
    
    const prefs = State.player.preferences;
    let stressMod = 1;
    let logText = '';
    
    if (prefs) {
      // #44: защита knownPrefs
      if (!State.player.knownPrefs) State.player.knownPrefs = { cig: false, alc: false };
      if (isCig && !State.player.knownPrefs.cig) State.player.knownPrefs.cig = true;
      if (!isCig && !State.player.knownPrefs.alc) State.player.knownPrefs.alc = true;

      if (isCig && prefs.cig === brandId) {
        stressMod = 1.5;
        logText = 'Знакомый вкус. Твои любимые сигареты. На секунду становится легче.';
      } else if (isCig && prefs.cigHate === brandId) {
        stressMod = 0.5;
        logText = 'Дерьмо. Дешевый табак. Ты морщишься, но докуриваешь.';
      } else if (!isCig && prefs.alc === brandId) {
        stressMod = 1.5;
        logText = 'Твой любимый напиток. Ты чувствуешь, как напряжение уходит.';
      } else if (!isCig && prefs.alcHate === brandId) {
        stressMod = 0.5;
        logText = 'Пойло. Приходится давиться.';
      }
    }
    
    if (!logText) {
      logText = isCig ? Utils.pick(Lore.noir.actions.smoke) : Utils.pick(Lore.noir.actions.alcohol);
    }
    
    State.player.sanity.stress = Utils.clamp((State.player.sanity.stress || 0) + Math.round(brand.stress * stressMod), 0, 100);
    
    const deps = State.player.dependencies;
    if (isCig) deps.nicotine = Math.min(100, (deps.nicotine || 0) + brand.addiction);
    else deps.alcohol = Math.min(100, (deps.alcohol || 0) + brand.addiction);
    
    Engine.log(logText, 'good');
    Time.spend(0.25);
    if (!State.player || !State.city) return; // #40
    Save.save();
    Engine.render();
  },
};
