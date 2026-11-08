const DeathSystem = {
  fullRestart(reason) {
    if (typeof Music !== 'undefined' && Music.stop) Music.stop();
    const p = State.player;
    if (!p) {
      Save.wipe();
      State.reset();
      Engine.clearLog();
      Engine.go('menu');
      return;
    }

    const result = (typeof Prestige !== 'undefined' && Prestige.onDeath) ? Prestige.onDeath(p, State.city) : { gainedBlood: 0, totalBlood: 0 };
    const epitaph = (typeof Prestige !== 'undefined' && Prestige.buildEpitaph) ? Prestige.buildEpitaph(p) : 'Здесь лежит тот, кто пытался.';

    State.deathRecord = {
      reason: reason || 'Причина неизвестна. Город не объясняет.',
      epitaph: epitaph,
      gainedBlood: result.gainedBlood || 0,
      totalBlood: result.totalBlood || 0,
      lifetime: p.lifetime || {},
      level: p.level || 1,
      money: p.money || 0,
      name: p.name || 'Безымянный',
      day: (State.time && State.time.day) || 1
    };

    Engine.go('deathScreen');
  },

  finalize() {
    Save.wipe();
    State.reset();
    Engine.clearLog();
    Engine.go('create');
  }
};
