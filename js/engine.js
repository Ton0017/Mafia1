const Engine = {
  screen: 'menu',
  params: {},

  go(screen, params = {}) {
    // Тюрьма: пока все сцены не пройдены — только jail
    if (typeof State !== 'undefined' && State.jail && screen !== 'jail') {
      screen = 'jail';
      params = {};
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
      screenEl.innerHTML = fn(this.params);
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
