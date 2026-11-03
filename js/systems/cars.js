const CarsSystem = {
  isOwned(carId) {
    if (!State.cars || !Array.isArray(State.cars.owned)) return false;
    return State.cars.owned.includes(carId);
  },

  buy(carId) {
    const car = CarsData.find(carId);
    if (!car) return false;
    if (this.isOwned(carId)) {
      Engine.log('У тебя уже есть эта машина.', 'warn');
      return false;
    }
    if (!Economy.spend(car.price, 'Покупка: ' + car.name)) return false;

    if (!State.cars || !Array.isArray(State.cars.owned)) {
      State.cars = { owned: [], forSale: [] };
    }
    State.cars.owned.push(carId);
    Economy.changeRep(1, 'Новая машина в гараже: ' + car.name);
    Save.save();
    Engine.render();
    return true;
  },

  sell(carId) {
    const car = CarsData.find(carId);
    if (!car) return false;
    if (!this.isOwned(carId)) return false;

    const price = Math.round(car.price * 0.3);
    State.cars.owned = State.cars.owned.filter(id => id !== carId);
    Economy.earn(price, 'Продажа: ' + car.name);
    // #33: REP снижаем только если есть что снижать
    if (State.player && (State.player.reputation || 0) > 0) {
      Economy.changeRep(-1, 'Продал ' + car.name);
    }
    Save.save();
    Engine.render();
    return true;
  },

  getOwned() {
    if (typeof CarsData === 'undefined' || !CarsData.find) return [];
    if (!State.cars || !Array.isArray(State.cars.owned)) return [];
    return State.cars.owned.map(id => CarsData.find(id)).filter(Boolean);
  }
};
