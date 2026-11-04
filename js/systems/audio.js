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

// ═══ ЗВУКОВЫЕ ЭФФЕКТЫ (синтез через Web Audio API) ═══
const Sfx = {
  ctx: null,
  init() {
    if (this.ctx) return;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  },
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
  },
  play(type) {
    this.init();
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (type === 'shoot_pistol')  this._noise(now, 0.12, 800, 0.3);
    else if (type === 'shoot_shotgun') this._noise(now, 0.25, 400, 0.5);
    else if (type === 'shoot_rifle')   this._noise(now, 0.18, 600, 0.4);
    else if (type === 'shoot_smg')     this._noise(now, 0.10, 900, 0.25);
    else if (type === 'shoot_revolver')this._noise(now, 0.15, 700, 0.35);
    else if (type === 'hit')    this._thud(now, 0.15, 120, 0.4);
    else if (type === 'miss')   this._noise(now, 0.08, 1200, 0.15);
    else if (type === 'reload') this._click(now, 0.05);
    else if (type === 'melee')  this._thud(now, 0.12, 90, 0.5);
    else if (type === 'death')  this._thud(now, 0.5, 60, 0.6);
  },
  _noise(now, dur, cutoff, vol) {
    const sr = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, sr * dur, sr);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    src.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
    src.start(now); src.stop(now + dur);
  },
  _thud(now, dur, freq, vol) {
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + dur);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + dur);
  },
  _click(now, dur) {
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(2000, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + dur);
  }
};
