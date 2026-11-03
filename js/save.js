const Save = {
  KEY: 'noir_city_save_v1',
  GRAVEYARD_KEY: 'noir_city_graveyard',
  save() {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(State));
      return true;
    } catch (e) {
      if (typeof Engine !== 'undefined') Engine.log('Не удалось сохранить: ' + e.message, 'bad');
      return false;
    }
  },
  load() {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return false;
    try {
      const data = JSON.parse(raw);
      if (!data.version) return false;
      if (!data.player || typeof data.player !== 'object') return false;

      State.reset();
      const fresh = defaultState();

      // ═══ Миграция старых сейвов ═══
      if (!data.player.sanity) data.player.sanity = fresh.player.sanity;
      if (!data.player.survival) data.player.survival = fresh.player.survival;
      if (!data.player.dependencies) data.player.dependencies = fresh.player.dependencies;
      if (!data.player.conditions) data.player.conditions = fresh.player.conditions;
      if (data.player.barVisitsToday === undefined) data.player.barVisitsToday = 0;
      if (data.player.pokerGamesToday === undefined) data.player.pokerGamesToday = 0;
      if (!Array.isArray(data.player.idleHistory)) data.player.idleHistory = [];
      if (data.player.idleEventsToday === undefined) data.player.idleEventsToday = 0;
      if (data.player.zoneVisitsToday === undefined) data.player.zoneVisitsToday = 0;
      if (data.player.lastCopEventDay === undefined) data.player.lastCopEventDay = 0;
      if (data.player.portrait === undefined) data.player.portrait = null;
      if (data.player.preferences === undefined) data.player.preferences = null;
      // #1: миграция knownPrefs
      if (!data.player.knownPrefs) data.player.knownPrefs = { cig: false, alc: false };
      // #2: миграция relationship
      if (!data.player.relationship) data.player.relationship = { lily: null, evelyn: null, vivian: null };
      // #3: миграция usedNames
      if (!Array.isArray(data.player.usedNames)) data.player.usedNames = [];
      // #7: защита на случай отсутствия data.weapons (очень старые сейвы)
      if (!data.weapons) data.weapons = { owned: [], durability: {}, forSale: [] };
      if (!data.weapons.durability) data.weapons.durability = {};
      for (const w of (data.weapons.owned || [])) {
        if (data.weapons.durability[w] === undefined) data.weapons.durability[w] = 100;
      }
      // #6: глубокий merge lifetime (не терять поля в старых сейвах)
      if (!data.player.lifetime) {
        data.player.lifetime = fresh.player.lifetime;
      } else {
        for (const k of Object.keys(fresh.player.lifetime)) {
          if (data.player.lifetime[k] === undefined) {
            data.player.lifetime[k] = fresh.player.lifetime[k];
          }
        }
      }

      if (!data.player.inventory) {
        data.player.inventory = fresh.player.inventory;
      } else {
        if (!Array.isArray(data.player.inventory.ownedArmor)) {
          data.player.inventory.ownedArmor = ['armor_none'];
          if (data.player.armor && data.player.armor !== 'armor_none') {
            data.player.inventory.ownedArmor.push(data.player.armor);
          }
        }
        if (!data.player.inventory.medicine) {
          data.player.inventory.medicine = fresh.player.inventory.medicine;
        } else {
          // добиваем недостающие медикаменты (tourniquet, vitamins и т.д.)
          const medDef = fresh.player.inventory.medicine;
          for (const k of Object.keys(medDef)) {
            if (data.player.inventory.medicine[k] === undefined) {
              data.player.inventory.medicine[k] = medDef[k];
            }
          }
        }
        if (data.player.inventory.drugs === undefined) data.player.inventory.drugs = {};
        if (!data.player.inventory.cigs_inv) data.player.inventory.cigs_inv = { camel: 0, marlboro: 0, lucky: 0 };
        if (!data.player.inventory.alc_inv) data.player.inventory.alc_inv = { whiskey: 0, vodka: 0, rum: 0 };
        // Миграция старого medkits → medicine.medkit
        if (data.player.inventory.medkits !== undefined) {
          if (!data.player.inventory.medicine) data.player.inventory.medicine = {};
          data.player.inventory.medicine.medkit = (data.player.inventory.medicine.medkit || 0) + data.player.inventory.medkits;
          delete data.player.inventory.medkits;
        }
        if (data.player.inventory.ammo === undefined) data.player.inventory.ammo = {};
        // #4: food и water в старых сейвах могут отсутствовать
        if (data.player.inventory.food === undefined) data.player.inventory.food = 1;
        if (data.player.inventory.water === undefined) data.player.inventory.water = 1;
      }

      if (!data.player.dependencies.activeEffects) {
        data.player.dependencies.activeEffects = [];
      }

      // Миграция NPC/фракций/зон (на случай старых версий)
      if (!data.mayor) data.mayor = null;
      if (!data.politics) data.politics = { playerInfluence: 0, lobbyUntil: 0 };
      if (data.politics.lobbyUntil === undefined) data.politics.lobbyUntil = 0; // будет создан при первом обращении
      if (!Array.isArray(data.zones)) data.zones = [];
      if (!Array.isArray(data.factions)) data.factions = [];
      if (!Array.isArray(data.npcs)) data.npcs = [];
      // #129: миграция полей фракций для старых сейвов
      if (Array.isArray(data.factions)) {
        for (const f of data.factions) {
          if (!f.relations) f.relations = {};
          if (f.allyWithPlayer === undefined) f.allyWithPlayer = false;
          if (f.tradeDay === undefined) f.tradeDay = 0;
          if (f.threatDay === undefined) f.threatDay = 0;
          if (f.jobDay === undefined) f.jobDay = 0;
          if (f.mysteryDay === undefined) f.mysteryDay = 0;
          if (f.enemyId === undefined) f.enemyId = null;
          if (f.mood === undefined) f.mood = null;
          if (f.moodUntil === undefined) f.moodUntil = 0;
        }
      }
      if (!data.quests || !data.quests.available) {
        data.quests = fresh.quests;
      }

      Object.assign(State, data);
      return true;
    } catch (e) {
      if (typeof Engine !== 'undefined') Engine.log('Битый сейв: ' + e.message, 'bad');
      return false;
    }
  },
  exists() { return !!localStorage.getItem(this.KEY); },
  wipe() { localStorage.removeItem(this.KEY); },
  // Кладбище — статистика прошлых жизней (флавор)
  addToGraveyard(entry) {
    try {
      const list = JSON.parse(localStorage.getItem(this.GRAVEYARD_KEY) || '[]');
      list.push(entry);
      if (list.length > 20) list.shift();
      localStorage.setItem(this.GRAVEYARD_KEY, JSON.stringify(list));
    } catch (e) {}
  },
  getGraveyard() {
    try { return JSON.parse(localStorage.getItem(this.GRAVEYARD_KEY) || '[]'); }
    catch (e) { return []; }
  },
};
