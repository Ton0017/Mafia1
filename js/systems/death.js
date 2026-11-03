const DeathSystem = {
  fullRestart() {
    const p = State.player;
    // #64: защита — если player не создан, всё равно сбрасываем
    if (!p) {
      Save.wipe();
      State.reset();
      Engine.clearLog();
      Engine.go('menu');
      return;
    }
    Engine.log('— Конец пути —', 'warn');
    Engine.log(Utils.pick(Lore.noir.lose), 'lore');

    // Считаем кровь рода
    const result = (typeof Prestige !== 'undefined' && Prestige.onDeath) ? Prestige.onDeath(p, State.city) : { gainedBlood: 0, totalBlood: 0 };
    if (result.gainedBlood > 0) {
      Engine.log('Кровь рода: +' + result.gainedBlood + ' (всего ' + result.totalBlood + ').', 'warn');
    }

    const epitaph = (typeof Prestige !== 'undefined' && Prestige.buildEpitaph) ? Prestige.buildEpitaph(p) : 'Здесь лежит тот, кто пытался.';
    Engine.log(epitaph, 'lore');

    Save.wipe();
    State.reset();
    Engine.clearLog();
    Engine.log('Твоя история закончилась. Город ждёт следующего.', 'lore');
    // Сразу создание нового персонажа — без меню, без бонусов
    Engine.go('create');
  },
};
