window.addEventListener('DOMContentLoaded', () => {
  // Миграция старого кладбища в Prestige (если было)
  if (typeof Prestige !== 'undefined' && typeof Save !== 'undefined') {
    const oldGrave = Save.getGraveyard();
    if (oldGrave && oldGrave.length > 0) {
      const prestige = Prestige.load();
      if (!prestige.deaths || prestige.deaths.length === 0) {
        prestige.deaths = oldGrave;
        prestige.totalDeaths = oldGrave.length;
        Prestige.save(prestige);
        // #67: чистим старое кладбище, чтобы миграция не повторилась
        try { localStorage.removeItem('noir_city_graveyard'); } catch (e) {}
      }
    }
  }

  // ═══ SPLASH 1.7s ═══
  const splash = document.createElement('div');
  splash.id = 'splash';
  splash.innerHTML = '<div class="splash-title"><span class="splash-w">CITY</span><span class="splash-r">OF</span><span class="splash-w">NOIR</span></div>';
  document.body.appendChild(splash);

  setTimeout(() => {
    splash.classList.add('fade');
    Engine.log('City of Noir — v2.0 «Хардкор».', 'info');
    Engine.go('menu');
    setTimeout(() => splash.remove(), 400);
  }, 1700);

  // Разблокировка AudioContext на первом клике
  const unlockAudio = () => {
    if (typeof Music !== 'undefined') {
      Music.init();
      Music.resume && Music.resume();
      
      // Автовключение: если игрок ранее не выключал музыку (нет 'off' в памяти)
      let audioPref = null;
      try { audioPref = localStorage.getItem('noir_audio'); } catch (e) {}
      if (audioPref !== 'off') {
        Music.start();
      }
    }
    if (typeof Sfx !== 'undefined') { Sfx.init(); Sfx.resume(); }
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('mousedown', unlockAudio);
  };
  document.addEventListener('touchstart', unlockAudio, { once: true });
  document.addEventListener('mousedown', unlockAudio, { once: true });
});
