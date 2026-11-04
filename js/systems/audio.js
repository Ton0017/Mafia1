// ═══ УМНАЯ СИСТЕМА МУЗЫКИ ═══
const Music = {
  bgPlaylist: ['assets/music/bg.mp3', 'assets/music/bg2.wav'],
  combatTrack: 'assets/music/combat.wav',
  currentBg: 0,
  player: null,
  enabled: false,
  inCombat: false,

  init() {
    if (this.player) return;
    this.player = document.createElement('audio');
    this.player.volume = 0.15;
    this.player.loop = true; // Нативное зацикливание (WebView не сможет остановить)

    // Страховка: если WebView поставил на паузу, принудительно включаем
    setInterval(() => {
      if (this.enabled && this.player && this.player.src && this.player.paused) {
        this.player.play().catch(() => {});
      }
    }, 3000);

    try { if (localStorage.getItem('noir_audio') === 'on') this.enabled = true; } catch (e) {}
  },

  start() {
    this.init();
    if (!this.player) return;
    if (!this.player.src) {
      this.player.src = this.inCombat ? this.combatTrack : this.bgPlaylist[this.currentBg];
    }
    this.player.loop = true;
    this.player.play().then(() => {
      this.enabled = true;
      try { localStorage.setItem('noir_audio', 'on'); } catch (e) {}
      if (typeof Engine !== 'undefined') Engine.updateTopbar();
    }).catch(e => console.warn('Ошибка аудио:', e));
  },

  stop() {
    this.init();
    if (!this.player) return;
    this.player.pause();
    this.enabled = false;
    try { localStorage.setItem('noir_audio', 'off'); } catch (e) {}
    if (typeof Engine !== 'undefined') Engine.updateTopbar();
  },

  toggle() { if (this.enabled) this.stop(); else this.start(); },

  playCombat() {
    this.init();
    if (!this.enabled || !this.player) return;
    this.inCombat = true;
    this.player.loop = true;
    this.player.src = this.combatTrack;
    this.player.volume = 0.25; // В бою делаем чуть громче
    this.player.play().catch(e => console.warn(e));
  },

  playBackground() {
    this.init();
    if (!this.enabled || !this.player) return;
    this.inCombat = false;
    this.player.loop = true;
    this.player.src = this.bgPlaylist[this.currentBg];
    this.player.volume = 0.15; // В городе — тихий фон
    this.player.play().catch(e => console.warn(e));
  }
};
