// ═══ ПОЛИТИКА: МЭР ГОРОДА ═══
const Politics = {
  MAYOR_TYPES: {
    corrupt: {
      name: 'Продажный',
      taxMod: 0.5,
      heatMod: 1.0,
      bribeAccept: 0.9,
      desc: 'Берёт у всех. Дёшево. Но и другим помогает.'
    },
    honest: {
      name: 'Честный',
      taxMod: 1.2,
      heatMod: 1.5,
      bribeAccept: 0.0,
      desc: 'Взяток не берёт. Копов не сдерживает.'
    },
    paranoid: {
      name: 'Параноик',
      taxMod: 0.8,
      heatMod: 1.2,
      bribeAccept: 0.5,
      desc: 'Верит в заговоры. Взятки берёт, но следит.'
    }
  },

  generateMayor() {
    const types = ['corrupt', 'honest', 'paranoid'];
    const type = Utils.pick(types);
    return {
      id: 'mayor_' + Utils.uid(),
      name: Utils.pick(Lore.firstNames) + ' ' + Utils.pick(Lore.lastNames),
      type: type,
      typeName: this.MAYOR_TYPES[type].name,
      electedDay: State.time.day,
      termEnd: State.time.day + 30,
      influence: Utils.rnd(10, 30),
      relationToPlayer: 0
    };
  },

  getMayor() {
    if (!State.mayor) {
      State.mayor = this.generateMayor();
    }
    return State.mayor;
  },

  getTaxModifier() {
    const mayor = this.getMayor();
    const typeData = this.MAYOR_TYPES[mayor.type];
    return typeData ? typeData.taxMod : 1.0;
  },

  getHeatModifier() {
    const mayor = this.getMayor();
    const typeData = this.MAYOR_TYPES[mayor.type];
    return typeData ? typeData.heatMod : 1.0;
  },

  // ═══ ДЕЙСТВИЯ ИГРОКА ═══
  bribeMayor() {
    if (!State.player) return;
    const mayor = this.getMayor();
    const typeData = this.MAYOR_TYPES[mayor.type];
    
    // Цена: $1000 + Heat * 30 + Level * 100
    if (!typeData) return;
    let cost = 1000 + ((State.player.heat || 0) * 30) + ((State.player.level || 1) * 100);
    
    if (!Economy.spend(cost, 'Взятка мэру')) return;


    // Шанс успеха
    if (Utils.chance(typeData.bribeAccept)) {
      // Взял взятку
      Economy.changeHeat(-30, 'Мэр закрыл глаза');
      mayor.relationToPlayer = Math.min(100, (mayor.relationToPlayer || 0) + 10);
      Engine.log('Конверт исчезает в ящике стола. «Приятно иметь с вами дело».', 'good');
    } else {
      // Честный мэр (или параноик сорвался)
      Economy.changeHeat(15, 'Мэр вызвал копов');
      mayor.relationToPlayer = Math.max(-100, (mayor.relationToPlayer || 0) - 20);
      Engine.log('Мэр смотрит на конверт, потом на тебя. «Вы арестованы». Он тянется к телефону.', 'bad');
      // Здесь можно было бы запустить бой с копами, но пока просто штраф
    }

    Time.spend(1);
    if (!State.player || !State.city) return; // #32: если умер во время spend
    Save.save();
    Engine.render();
  },

  compromiseFaction(factionId) {
    if (!State.player || !State.factions) return;
    const faction = State.factions.find(f => f.id === factionId);
    if (!faction) return;
    if (faction.isPolice) { Engine.log('Полицию не скомпрометируешь.', 'warn'); return; }

    const cost = 2000;
    if (!Economy.spend(cost, 'Компромат на ' + faction.name)) return;

    // Успех всегда, но фракция узнает
    faction.influence = Math.max(0, (faction.influence || 0) - 20);
    faction.enemyId = 'player';
    if (!faction.relations) faction.relations = {};
    faction.relations.player = -100;
    
    Engine.log('Ты передаешь папку с компроматом журналистам. Удар по ' + faction.name + ' нанесен.', 'good');
    Engine.log('Но они знают, чьих это рук дело. Война объявлена.', 'bad');
    
    Time.spend(2);
    if (!State.player || !State.city) return; // #32
    Save.save();
    Engine.go('mayorOffice');
  },

  lobbyBusiness() {
    if (!State.player || !State.politics) return;
    const mayor = this.getMayor();
    
    if (State.politics && State.politics.lobbyUntil && State.time.day < State.politics.lobbyUntil) {
      Engine.log('Ты уже лоббируешь. Подожди.', 'warn');
      return;
    }

    const cost = 1000;
    if (!Economy.spend(cost, 'Лоббирование')) return;

    State.politics.lobbyUntil = State.time.day + 10;
    
    Engine.log('Мэр подписывает бумаги. Налоги на бизнес снижены на 10 дней. Но он получает долю.', 'good');
    
    Time.spend(1);
    if (!State.player || !State.city) return; // #32
    Save.save();
    Engine.render();
  },

  // Расчет коалиций (для выборов)
  getFactionCoalitions() {
    if (!State.factions) return [];
    const mafia = State.factions.filter(f => !f.isPolice);
    const coalitions = [];
    const used = new Set();

    for (let i = 0; i < mafia.length; i++) {
      if (used.has(mafia[i].id)) continue;
      const coalition = [mafia[i]];
      used.add(mafia[i].id);
      
      for (let j = i + 1; j < mafia.length; j++) {
        if (used.has(mafia[j].id)) continue;
        const rel = (mafia[i].relations && mafia[i].relations[mafia[j].id]) || 0;
        // Если отношения > 40, они в коалиции
        if (rel > 40) {
          coalition.push(mafia[j]);
          used.add(mafia[j].id);
        }
      }
      
      // Суммируем влияние
      const totalInfluence = coalition.reduce((sum, f) => sum + (f.influence || 0), 0);
      coalitions.push({ factions: coalition, influence: totalInfluence });
    }
    return coalitions;
  },

  checkElection() {
    if (!State.mayor) return;
    const today = State.time.day;
    if (today < State.mayor.termEnd) return;
    this.runElection();
  },

  runElection() {
    if (!State.player) return;
    const oldMayor = State.mayor;
    Engine.log('— ВЫБОРЫ —', 'warn');
    Engine.log('Город голосует. Плакаты, обещания, грязь под ногтями.', 'lore');

    const candidates = [];
    
    // Старый мэр
    if ((oldMayor.influence || 0) > 10) {
      candidates.push({
        name: oldMayor.name, type: oldMayor.type, typeName: oldMayor.typeName,
        influence: oldMayor.influence, isPlayer: false, factionId: null
      });
    }

    // Самые влиятельные коалиции фракций
    const coalitions = this.getFactionCoalitions();
    const topCoalition = coalitions.sort((a, b) => b.influence - a.influence)[0];
    
    if (topCoalition && topCoalition.influence > 20) {
      const factionNames = topCoalition.factions.map(f => f.name).join(' + ');
      candidates.push({
        name: Utils.pick(Lore.firstNames) + ' ' + Utils.pick(Lore.lastNames),
        type: Utils.pick(['corrupt', 'honest', 'paranoid']),
        typeName: 'Ставленник',
        influence: topCoalition.influence,
        isPlayer: false,
        factionId: topCoalition.factions[0].id,
        factionName: factionNames
      });
    }

    // Игрок
    const pInf = (State.politics && State.politics.playerInfluence) || 0;
    if (pInf >= 50) {
      candidates.push({
        name: State.player.name + ' (Ты)', type: 'corrupt', typeName: 'Твой ставленник',
        influence: pInf, isPlayer: true, factionId: null
      });
    }

    // Запасной кандидат
    if (candidates.length === 0) {
      candidates.push({
        name: Utils.pick(Lore.firstNames) + ' ' + Utils.pick(Lore.lastNames),
        type: Utils.pick(['corrupt', 'honest', 'paranoid']), typeName: 'Случайный',
        influence: Utils.rnd(10, 30), isPlayer: false, factionId: null
      });
    }

    candidates.forEach(c => c.finalScore = c.influence + Utils.rnd(0, Math.round(c.influence * 0.2)));
    candidates.sort((a, b) => b.finalScore - a.finalScore);
    const winner = candidates[0];

    State.mayor = {
      id: 'mayor_' + Utils.uid(),
      name: winner.name, type: winner.type, typeName: winner.typeName,
      electedDay: State.time.day, termEnd: State.time.day + 30,
      influence: Math.round(winner.finalScore),
      relationToPlayer: winner.isPlayer ? 100 : 0
    };

    Engine.log('Победитель: ' + winner.name + '.', 'good');
    if (winner.isPlayer) {
      Engine.log('Твой человек в мэрии! Налоги снижены.', 'good');
      State.player.heat = Math.max(0, (State.player.heat || 0) - 20);
    } else if (winner.factionId) {
      Engine.log('Мэрия теперь под контролем ' + winner.factionName + '.', 'bad');
    } else {
      Engine.log('Город выбрал ' + winner.typeName + '.', 'info');
    }

    if (State.politics) State.politics.playerInfluence = 0;
    if (State.city) {
      if (!State.city.news) State.city.news = [];
      State.city.news.unshift(`🏛 Новый мэр: ${winner.name} (${winner.typeName})`);
      if (State.city.news.length > 5) State.city.news.pop();
    }

    Save.save();
    if (Engine.screen === 'city') Engine.render();
  }
};
