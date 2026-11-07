// ═══ СИСТЕМА РЕСТОРАНА ═══
const RestaurantSystem = {
  MAX_PER_DAY: 2,

  eat(dishId) {
    if (!State.player) return false;
    const dish = RestaurantData.dishes.find(d => d.id === dishId);
    if (!dish) return false;
    if ((State.player.restaurantToday || 0) >= this.MAX_PER_DAY) {
      Engine.log('Ресторан закрывается для тебя. Приходи завтра.', 'warn');
      return false;
    }
    if (!Time.canSpend(1.5)) {
      Engine.log('Слишком поздно. Ресторан закрыт.', 'warn');
      return false;
    }
    if (!Economy.spend(dish.price, 'Ужин: ' + dish.name)) return false;

    if (!State.player.survival) State.player.survival = { hunger: 100, thirst: 100, energy: 100, combatFatigue: 0 };
    State.player.survival.hunger = Math.min(100, (State.player.survival.hunger || 0) + dish.hunger);
    State.player.survival.energy = Math.min(100, (State.player.survival.energy || 0) + (dish.energy || 0));
    if (State.player.sanity) {
      State.player.sanity.stress = Math.max(0, (State.player.sanity.stress || 0) + dish.stress);
    }

    Engine.log(dish.log, 'good');
    State.player.restaurantToday = (State.player.restaurantToday || 0) + 1;
    Time.spend(1.5, 'Ужин в ресторане');
    if (!State.player || !State.city) return true;

    if (Utils.chance(0.25)) {
      const ev = Utils.pick(RestaurantData.events);
      Engine.log('Что-то происходит...', 'warn');
      Save.save();
      Engine.go('restaurantEvent', { eventId: ev.id });
    } else {
      Save.save();
      Engine.go('restaurant');
    }
    return true;
  },

  eatWithGirl(girlId, dishId) {
    if (!State.player) return false;
    const dish = RestaurantData.dateDishes.find(d => d.id === dishId);
    if (!dish) return false;
    if (!State.player.relationship || !State.player.relationship[girlId]) {
      Engine.log('Ты ещё не знаком с этой женщиной.', 'warn');
      return false;
    }
    const status = State.player.relationship[girlId];
    if (status === 'ex') {
      Engine.log('Она не сядет с тобой за стол. Сначала помирись.', 'warn');
      return false;
    }
    const aff = (State.player.womenAffection && State.player.womenAffection[girlId]) || 0;
    if (aff < 30) {
      Engine.log('Она холодна. Ещё рано для ужина.', 'warn');
      return false;
    }
    if ((State.player.restaurantToday || 0) >= this.MAX_PER_DAY) {
      Engine.log('Ресторан закрывается. Приходи завтра.', 'warn');
      return false;
    }
    if (!Time.canSpend(2)) {
      Engine.log('Слишком поздно.', 'warn');
      return false;
    }
    if (!Economy.spend(dish.price, 'Ужин: ' + dish.name)) return false;

    if (!State.player.survival) State.player.survival = { hunger: 100, thirst: 100, energy: 100, combatFatigue: 0 };
    State.player.survival.hunger = Math.min(100, (State.player.survival.hunger || 0) + dish.hunger);
    State.player.survival.energy = Math.min(100, (State.player.survival.energy || 0) + (dish.energy || 0));
    if (State.player.sanity) {
      State.player.sanity.stress = Math.max(0, (State.player.sanity.stress || 0) + dish.stress);
    }
    if (typeof WomenSystem !== 'undefined' && WomenSystem.increaseAffection) {
      WomenSystem.increaseAffection(girlId, dish.affection);
    }

    Engine.log(dish.log, 'good');
    State.player.restaurantToday = (State.player.restaurantToday || 0) + 1;
    Time.spend(2, 'Ужин с женщиной');
    if (!State.player || !State.city) return true;
    Save.save();
    Engine.go('restaurant');
    return true;
  },

  resolveEvent(eventId, choiceIndex) {
    if (!State.player) return false;
    const ev = RestaurantData.events.find(e => e.id === eventId);
    if (!ev) return false;
    const choice = ev.choices[choiceIndex];
    if (!choice) return false;
    const eff = choice.effect || {};

    if (eff.money && eff.money > 0) Economy.earn(eff.money, 'Ресторан');
    else if (eff.money && eff.money < 0) {
      if (!Economy.spend(-eff.money, 'Ресторан')) Engine.log('Денег не хватило.', 'warn');
    }
    if (eff.hp && State.player.body && State.player.body.torso) {
      State.player.body.torso.hp = Math.max(0, (State.player.body.torso.hp || 0) + eff.hp);
    }
    if (eff.sanity && State.player.sanity) {
      State.player.sanity.sanity = Math.max(0, Math.min(100, (State.player.sanity.sanity || 0) + eff.sanity));
    }
    if (eff.stress && State.player.sanity) {
      State.player.sanity.stress = Math.max(0, Math.min(100, (State.player.sanity.stress || 0) + eff.stress));
    }
    if (eff.heat) Economy.changeHeat(eff.heat, '');
    if (eff.rep) Economy.changeRep(eff.rep, '');
    if (eff.log) Engine.log(eff.log, choice.tone || 'info');

    Save.save();
    Engine.go('restaurant');
    return true;
  }
};
