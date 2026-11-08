const EventsSystem = {
  rollDaily() {
    if (!State.player || !State.city) return;
    if (!State.events) State.events = { pending: [] };
    if (!State.events.pending) State.events.pending = [];
    // Лимит — не больше 3 ожидающих событий
    if (State.events.pending.length >= 3) {
      Engine.log('Слишком много висит незавершённых дел. Разберись сначала.', 'warn');
      return;
    }
    const count = Utils.rnd(1, 2);
    const used = Utils.shuffle(EventData.templates).slice(0, count);
    for (const tpl of used) {
      State.events.pending.push({
        id: 'ev_' + Utils.uid(),
        templateId: tpl.id,
        title: tpl.title,
        desc: tpl.desc,
        choices: tpl.choices,
        portrait: (typeof Sprites !== 'undefined' && Sprites.randomAny) ? Sprites.randomAny() : 'assets/sprites/man.png1.jpg',
        resolved: false,
      });
    }
    if (State.events.pending.length > 0) {
      Engine.log('Событие ждёт твоего решения.', 'warn');
    }
  },

  tick() {
    // События не истекают, но висят в pending до разрешения
  },

  resolve(eventId, choiceIndex) {
    if (!State.player) return false;
    if (!State.events || !State.events.pending) return false;
    const ev = State.events.pending.find(e => e.id === eventId);
    if (!ev || ev.resolved) return false;
    const choice = ev.choices[choiceIndex];
    if (!choice) return false;

    // Проверка требований
    if (choice.requires && choice.requires.money && (State.player.money || 0) < choice.requires.money) {
      Engine.log('Недостаточно денег.', 'bad');
      return false;
    }

    const eff = EventData.effects[choice.effect];
    if (!eff) return false;

    this.applyEffect(eff);
    ev.resolved = true;
    State.events.pending = State.events.pending.filter(e => e.id !== eventId);
    Save.save();
    Engine.go(State.events.pending.length > 0 ? 'events' : 'city');
    return true;
  },

  applyEffect(eff) {
    if (!State.player) return;
    if (!State.player.body || !State.player.body.torso) return;
    if (!State.player.sanity) State.player.sanity = { sanity: 100, stress: 0, killsToday: 0, lastResetDay: 0, nightmares: 0 };
    if (!State.player.lifetime) State.player.lifetime = { kills: 0, moneyEarned: 0, missionsDone: 0, daysSurvived: 0, deaths: 0, overdoses: 0, breakdowns: 0 };
    if (eff.money > 0) Economy.earn(eff.money, 'событие');
    else if (eff.money < 0) {
      if (!Economy.spend(-eff.money, 'событие')) {
        Engine.log('Денег не хватило. Но выбор сделан.', 'warn');
      }
    }
    if (eff.hp) {
      State.player.body.torso.hp = Utils.clamp(State.player.body.torso.hp + eff.hp, 0, 100);
    }
    if (eff.sanity && typeof Sanity !== 'undefined') {
      Sanity.onBloodyEvent(-eff.sanity);
    }
    if (eff.stress) {
      State.player.sanity.stress = Utils.clamp((State.player.sanity.stress || 0) + eff.stress, 0, 100);
    }
    if (eff.heat) Economy.changeHeat(eff.heat);
    if (eff.rep) Economy.changeRep(eff.rep);
    if (eff.kills) State.player.lifetime.kills += eff.kills;  // #63: += N, не ++

    if (eff.log) Engine.log(eff.log, eff.tone || 'info');

    if (State.player.body.torso.hp <= 0) {
      if (typeof DeathSystem !== 'undefined') DeathSystem.fullRestart('Случай. Один из тех, что заканчивают всё.');
      return;
    }
  },
};
