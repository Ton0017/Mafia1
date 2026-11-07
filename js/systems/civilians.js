const CiviliansSystem = {
  createScene(zoneId) {
    const zone = State.zones.find(z => z.id === zoneId);
    if (!zone) return null;
    
    const civ = CiviliansData.generate(zone.type);
    if (!civ) return null;
    
    return {
      id: 'civilian_encounter',
      title: 'Прохожий',
      desc: civ.desc,
      civ: civ,
      zoneId: zoneId,
      choices: [
        { text: 'Ограбить', action: 'civ_rob', primary: true },
        { text: 'Убить', action: 'civ_kill', danger: true },
        { text: 'Помочь ($20)', action: 'civ_help' },
        { text: 'Пройти мимо', action: 'civ_pass' }
      ]
    };
  },

  resolveByIndex(scene, choiceIndex) {
    const actions = ['civ_rob', 'civ_kill', 'civ_help', 'civ_pass'];
    this.resolve(actions[choiceIndex], scene);
  },

  resolve(action, scene) {
    const civ = scene.civ;
    if (!civ) return;

    if (action === 'civ_rob') {
      if (Utils.chance(civ.resist)) {
        Engine.log(civ.name + ' сопротивляется. В его руке блеснуло лезвие.', 'bad');
        Engine.log('Придется драться.', 'warn');
        this.startCombat(civ, 'rob');
      } else {
        Economy.earn(civ.wealth, 'Ограбление: ' + civ.name);
        if (typeof PersonalEnemies !== 'undefined' && PersonalEnemies.onRob) PersonalEnemies.onRob(civ.name, civ.wealth);
        Economy.changeHeat(3, 'Свидетель ограбления');
        State.player.sanity.sanity = Math.max(0, State.player.sanity.sanity - 2);
        Engine.log('Ты вытаскиваешь у него $' + civ.wealth + '. Он даже не сопротивлялся.', 'good');
        Time.spend(1);
        if (!State.player || !State.city) return; // #58
        Save.save();
        Engine.go('zones');
      }
    } else if (action === 'civ_kill') {
      const heatCost = Utils.rnd(20, 30);
      Economy.earn(civ.wealth, 'Убийство: ' + civ.name);
      if (typeof PersonalEnemies !== 'undefined' && PersonalEnemies.onKill) PersonalEnemies.onKill(civ.name, State.player.level);
      Economy.changeHeat(heatCost, 'Труп на улице');
      Economy.changeRep(-3, 'Жестокость');
      State.player.sanity.sanity = Math.max(0, State.player.sanity.sanity - 10);
      State.player.sanity.stress = Math.min(100, State.player.sanity.stress + 10);
      State.player.lifetime.kills++;
      Engine.log('Ты убиваешь его. Быстро. Но город узнает.', 'bad');
      Engine.log('+$' + civ.wealth + '. Heat +' + heatCost + '.', 'warn');
      Time.spend(1);
      if (!State.player || !State.city) return; // #58
      Save.save();
      Engine.go('zones');
    } else if (action === 'civ_help') {
      if (State.player.money < 20) {
        Engine.log('У тебя нет двадцатки. Ты просто проходишь мимо.', 'warn'); // #62
        return;
      }
      if (!Economy.spend(20, 'Помощь прохожему')) return;
      State.player.sanity.stress = Math.max(0, State.player.sanity.stress - 5);
      Economy.changeRep(2, 'Доброе дело');
      Engine.log('Ты даёшь ему двадцатку. Он смотрит на тебя как на святого.', 'good');
      Time.spend(0.5);
      if (!State.player || !State.city) return; // #58
      Save.save();
      Engine.go('zones');
    } else if (action === 'civ_pass') {
      Engine.log('Ты проходишь мимо. Он даже не заметил.', 'info');
      Time.spend(0.25);
      if (!State.player || !State.city) return; // #58
      Save.save();
      Engine.go('zones');
    }
  },

  startCombat(civ, reason) {
    const enemyLevel = Math.max(1, Math.floor(State.player.level / 2));
    const enemy = Combat.spawnEnemy(enemyLevel, { affiliation: 'civilian' });
    enemy.role = civ.name; // #59: тип гражданина — в роль, имя остаётся уникальным
    enemy.loot.money = civ.wealth;
    enemy.loot.weaponId = civ.weapon === 'shiv' ? 'melee_sharp' : 
                          civ.weapon === 'pistol' ? 'pistol_pm' : 'melee_brass';
    enemy.stats = { shooting: 2, agility: 3, willpower: 2 };
    
    Combat.start(enemy, { 
      type: 'civilian', 
      returnScreen: 'zones',
      civilianReason: reason 
    });
  }
};
