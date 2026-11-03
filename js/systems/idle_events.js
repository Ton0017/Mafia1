// ═══ СИСТЕМА ПАССИВНЫХ СОБЫТИЙ ═══
const IdleSystem = {
  timer: null,
  MAX_PER_DAY: 3,

  start() {
    this.stop();
    this.timer = setTimeout(() => this.trigger(), Utils.rnd(60000, 180000)); // 1–3 мин
  },

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },

  trigger() {
    this.timer = null;

    // Проверки безопасности
    if (typeof Engine === 'undefined') return;
    if (Engine.screen !== 'city') return;
    if (!State.player || !State.city) return;
    if (State.combat && State.combat.active) return;

    // Лимит на день
    if ((State.player.idleEventsToday || 0) >= this.MAX_PER_DAY) {
      return; // Не спамим. Ждём завтра.
    }

    const event = this.pickEvent();
    if (!event) return;

    Engine.log(event.text, 'lore');

    if (event.effect) this.applyEffect(event.effect);

    if (!State.player) return;
    State.player.idleEventsToday = (State.player.idleEventsToday || 0) + 1;

    // Если это было последнее — намекнуть, что город затих
    if (State.player.idleEventsToday === this.MAX_PER_DAY) {
      setTimeout(() => {
        if (Engine.screen === 'city') {
          Engine.log('Город затихает. Больше сегодня ничего не произойдёт.', 'info');
        }
      }, 2000);
    }

    Save.save();
    this.start();
  },

  pickEvent() {
    if (!State.player) return null;
    if (typeof IdleEvents === 'undefined' || !IdleEvents.length) return null;
    if (!State.player.idleHistory) State.player.idleHistory = [];
    let available = IdleEvents.filter(e => !State.player.idleHistory.includes(e.id));

    if (available.length === 0) {
      State.player.idleHistory = [];
      available = IdleEvents;
    }

    const event = Utils.pick(available);
    if (!event) return null;
    State.player.idleHistory.push(event.id);
    return event;
  },

  applyEffect(eff) {
    if (!State.player) return;
    if (!State.player.sanity) State.player.sanity = { sanity: 100, stress: 0, killsToday: 0, lastResetDay: 0, nightmares: 0 };
    if (eff.stress) State.player.sanity.stress = Utils.clamp((State.player.sanity.stress || 0) + eff.stress, 0, 100);
    if (eff.sanity) State.player.sanity.sanity = Utils.clamp((State.player.sanity.sanity || 0) + eff.sanity, 0, 100);
    if (eff.money) {
      if (eff.money > 0) Economy.earn(eff.money, 'Находка');
      else Economy.spend(-eff.money, 'Потеря');
    }
    if (eff.heat) Economy.changeHeat(eff.heat, '');
  }
};
