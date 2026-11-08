const Engine = {
  screen: 'menu',
  params: {},

  go(screen, params = {}) {
    // Тюрьма: пока все сцены не пройдены — только jail
    if (typeof State !== 'undefined' && State.jail && screen !== 'jail') {
      screen = 'jail';
      params = {};
    }

    // СМЕРТЬ: если игрок умер, никакие экраны не перезапишут экран смерти
    if (typeof State !== 'undefined' && State.deathRecord) {
      if (screen !== 'deathScreen' && screen !== 'menu') {
        screen = 'deathScreen';
        params = {};
      }
    }

    // Личные враги: пока враг ждет, ты не можешь уйти от него
    if (typeof State !== 'undefined' && State.player && State.player.personalEnemies) {
      const activeEnemies = State.player.personalEnemies.filter(e => e.status === 'appeared');
      if (activeEnemies.length > 0 && screen !== 'personalEnemies' && screen !== 'personalEnemyEvent' && screen !== 'combat' && screen !== 'deathScreen' && screen !== 'menu') {
        if (this.screen !== 'personalEnemies') { // Чтобы не спамить лог
           Engine.log('Тебя перехватывают. ' + activeEnemies[0].name + ' стоит на пути.', 'bad');
        }
        screen = 'personalEnemies';
        params = {};
      }
    }

    this.screen = screen;
    this.params = params;
    this.render();
    const s = document.getElementById('screen');
    if (s) s.scrollTop = 0;

    // Пассивные события только на главном экране
    if (typeof IdleSystem !== 'undefined') {
      if (screen === 'city' && State.player && State.city) {
        IdleSystem.start();
      } else {
        IdleSystem.stop();
      }
    }
  },

  render() {
    const fn = Screens[this.screen];
    const screenEl = document.getElementById('screen');
    if (!screenEl) return;
    if (!fn) {
      screenEl.innerHTML = '<p class="red">Экран «' + this.screen + '» не найден.</p>' +
        '<button onclick="Engine.go(\'menu\')">← В меню</button>';
      return;
    }
    try {
      let html = fn(this.params);
      
      // Универсальный показ сцены (если флаг установлен)
      if (typeof State !== 'undefined' && State.flags && State.flags.showSexScene) {
        html = `<img src="assets/sprites/sex_scene.jpg" class="scene-img" alt="Ночь">` + html;
        State.flags.showSexScene = false;
      }
      
      screenEl.innerHTML = html;
    } catch (e) {
      screenEl.innerHTML = '<p class="red">Ошибка экрана: ' + e.message + '</p>' +
        '<button onclick="Engine.go(\'menu\')">← В меню</button>';
      console.error(e);
    }
    this.updateTopbar();
  },

  updateTopbar() {
    const p = State.player;
    document.getElementById('stat-money').innerHTML = (typeof Icons !== 'undefined' ? Icons.get('money') : '') + ' ' + Utils.fmtMoney(p.money);
    document.getElementById('stat-rep').innerHTML   = (typeof Icons !== 'undefined' ? Icons.get('rep') : 'REP') + ' ' + p.reputation;
    const heatEl = document.getElementById('stat-heat');
    heatEl.innerHTML = (typeof Icons !== 'undefined' ? Icons.get('heat') : 'HEAT') + ' ' + p.heat;
    heatEl.classList.toggle('high', p.heat >= 70);
    document.getElementById('stat-time').textContent  =
      'День ' + State.time.day + ', ' + Utils.pad2(State.time.hour) + ':00';

    const audioBtn = document.getElementById('audio-btn');
    if (audioBtn && typeof Music !== 'undefined') {
      audioBtn.textContent = Music.enabled ? '♫' : '♪';
      audioBtn.classList.toggle('on', Music.enabled);
    }
  },

  log(text, type = 'info') {
    const el = document.getElementById('log');
    if (!el) return;
    const div = document.createElement('div');
    div.className = 'log-entry ' + type;
    const timeStr = State.city ? '[' + Utils.pad2(State.time.hour) + ':00] ' : '';
    div.textContent = timeStr + text;
    el.prepend(div);
    while (el.children.length > 80) el.lastChild.remove();
  },

  clearLog() { const el = document.getElementById('log'); if (el) el.innerHTML = ''; },
};
