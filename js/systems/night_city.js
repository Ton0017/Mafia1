// ═══ СИСТЕМА НОЧНОГО ГОРОДА ═══
const NightSystem = {
  enter(locationId) {
    if (!State.player) return false;
    if (!NightData.isNight()) {
      Engine.log('Сейчас не ночь. Это место открывается после 22:00.', 'warn');
      return false;
    }
    const loc = NightData.locations.find(l => l.id === locationId);
    if (!loc) return false;

    if (loc.entry > 0 && !Economy.spend(loc.entry, 'Вход: ' + loc.name)) return false;
    if (loc.entry > 0) Engine.log('Ты платишь $' + loc.entry + ' на входе в «' + loc.name + '».', 'lore');

    // Случайная перестрелка (15% шанс)
    if (Utils.chance(0.15)) {
      this.triggerShootout();
      return true;
    }

    Engine.go(locationId);
    return true;
  },

  leave() { Engine.go('city'); },

  // ═══ СТРИПТИЗ ═══
  drinkNight(drinkId) {
    if (!State.player) return;
    const d = NightData.stripClub.drinks.find(x => x.id === drinkId);
    if (!d) return;
    if (!Economy.spend(d.price, 'Напиток: ' + d.name)) return;
    if (State.player.sanity) State.player.sanity.stress = Math.max(0, (State.player.sanity.stress || 0) + d.stress);
    if (State.player.dependencies) State.player.dependencies.alcohol = Math.min(100, (State.player.dependencies.alcohol || 0) + d.addiction);
    Engine.log(d.log, 'good');
    Time.spend(0.25);
    if (!State.player || !State.city || State.deathRecord) return;
    Save.save();
    Engine.render();
  },

  dance(danceId) {
    if (!State.player) return;
    const d = NightData.stripClub.dances.find(x => x.id === danceId);
    if (!d) return;
    if (!Economy.spend(d.price, 'Стриптиз: ' + d.name)) return;
    if (State.player.sanity) {
      State.player.sanity.sanity = Math.min(100, (State.player.sanity.sanity || 0) + (d.sanity || 0));
      State.player.sanity.stress = Math.max(0, (State.player.sanity.stress || 0) + (d.stress || 0));
    }
    Engine.log(d.log, 'good');
    Time.spend(d.id === 'take_home' ? 4 : 0.5);
    if (!State.player || !State.city || State.deathRecord) return;
    Save.save();
    Engine.render();
  },

  talkWaitress() {
    if (!State.player) return;
    const waitress = Utils.pick(NightData.stripClub.waitresses);
    const topic = Utils.pick(NightData.stripClub.waitressTopics);
    Engine.log('«' + waitress.name + '» (официантка): «' + topic + '? За $200 расскажу».', 'info');
    if (Economy.spend(200, 'Официантка: ' + waitress.name)) {
      Engine.log('Она наклоняется и шепчет что-то полезное. Ты запоминаешь.', 'good');
      if (State.player.sanity) State.player.sanity.sanity = Math.min(100, (State.player.sanity.sanity || 0) + 5);
    }
    Time.spend(0.25);
    if (!State.player || !State.city || State.deathRecord) return;
    Save.save();
    Engine.render();
  },

  // ═══ ПРИТОН ═══
  buyDenDrug(drugId) {
    if (!State.player) return;
    const drug = NightData.den.drugs.find(d => d.id === drugId);
    if (!drug) return;
    if (!Economy.spend(drug.price, 'Притон: ' + drug.name)) return;
    Engine.log(drug.log, 'bad');
    if (typeof Drugs !== 'undefined') Drugs.use(drugId);
    Time.spend(0.25);
    if (!State.player || !State.city || State.deathRecord) return;
    Save.save();
    Engine.render();
  },

  denEncounter() {
    if (!State.player) return;
    const npc = Utils.pick(NightData.den.npcs);
    Engine.log('В притоне: ' + npc.name + '. ' + npc.desc, 'lore');
    if (npc.type === 'cop') {
      // Облава
      if (Utils.chance(0.4)) {
        Economy.changeHeat(15, 'Облава в притоне');
        if (State.player.body && State.player.body.torso) {
          State.player.body.torso.hp = Math.max(0, State.player.body.torso.hp - 20);
        }
        Engine.log('Копы! Ты выпрыгиваешь в окно и бежишь.', 'bad');
        Time.spend(1);
        if (!State.player || !State.city || State.deathRecord) return;
        Save.save();
        Engine.go('city');
        return;
      }
    }
    if (npc.type === 'info' && Utils.chance(0.5)) {
      Economy.changeRep(2, 'Информация из притона');
      Engine.log('Человек без лица шепчет: «В порту — товар. Кто-то должен забрать».', 'info');
    }
    Save.save();
    Engine.render();
  },

  // ═══ РЫНОК ═══
  buyMarketWeapon(weaponId) {
    if (!State.player) return;
    const w = NightData.market.weapons.find(x => x.id === weaponId);
    if (!w) return;
    if (!State.weapons) State.weapons = { owned: [], durability: {}, forSale: [] };
    if (!State.weapons.owned) State.weapons.owned = [];
    if (!State.weapons.specialBonuses) State.weapons.specialBonuses = {};
    if (!State.weapons.durability) State.weapons.durability = {};

    // Уже есть именная версия этой модели
    if (State.weapons.specialBonuses[w.baseId] === w.bonus) {
      Engine.log('У тебя уже есть эта именная версия.', 'warn');
      return;
    }

    if (!Economy.spend(w.price, 'Рынок: ' + w.name)) return;

    // Апгрейд: если базовая уже есть — просто добавляем бонус
    if (State.weapons.owned.includes(w.baseId)) {
      Engine.log('Ты меняешь свою базовую версию на именную.', 'info');
    } else {
      State.weapons.owned.push(w.baseId);
      State.weapons.durability[w.baseId] = 100;
    }

    State.weapons.specialBonuses[w.baseId] = w.bonus;

    Engine.log('Ты покупаешь «' + w.name + '». ' + w.desc, 'good');
    const bonusLabel = w.bonus === 'silencer' ? 'Тихий выстрел — heat после боя снижен.'
                      : w.bonus === 'damage'  ? '+15% к урону.'
                      : '+10% к точности.';
    Engine.log('Бонус: ' + bonusLabel, 'info');

    Time.spend(0.5);
    if (!State.player || !State.city || State.deathRecord) return;
    Save.save();
    Engine.render();
  },

  buyMarketSpecial(specialId) {
    if (!State.player) return;
    const item = NightData.market.specials.find(x => x.id === specialId);
    if (!item) return;
    if (!Economy.spend(item.price, 'Рынок: ' + item.name)) return;
    Engine.log('Ты покупаешь «' + item.name + '». ' + item.desc, 'good');
    Time.spend(0.5);
    if (!State.player || !State.city || State.deathRecord) return;
    Save.save();
    Engine.render();
  },

  // ═══ АРЕНА ═══
  arenaFight(fightId) {
    if (!State.player) return;
    const fight = NightData.arena.fights.find(f => f.id === fightId);
    if (!fight) return;
    if (!Time.canSpend(1)) {
      Engine.log('Слишком поздно. Даже для арены.', 'warn');
      return;
    }
    const lvl = Math.max(1, (State.player.level || 1) + fight.difficulty - 1);
    const e = Combat.spawnEnemy(lvl, { affiliation: 'independent' });
    e.name = fight.name;
    e.role = 'Арена: ' + fight.name;
    e.roleDesc = fight.desc;
    e.loot.money = fight.prize;
    e.weaponId = 'melee_brass'; // кулаки/кастет
    Combat.start(e, { type: 'arena', fightId, returnScreen: 'arena' });
  },

  // ═══ СЛУЧАЙНАЯ ПЕРЕСТРЕЛКА ═══
  triggerShootout() {
    if (!State.player) return;
    Engine.log('ПЕРЕСТРЕЛКА НА УЛИЦЕ', 'bad');
    Engine.log('Ты выходишь, и тут же начинается стрельба. Кто-то бежит мимо, стреляя в кого-то другого.', 'lore');
    const lvl = Math.max(1, State.player.level || 1);
    const e = Combat.spawnEnemy(lvl, { affiliation: 'gang' });
    e.loot.money = Utils.rnd(200, 500);
    Combat.start(e, { type: 'shootout', returnScreen: 'city' });
  }
};
