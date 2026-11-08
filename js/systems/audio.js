// ═══ МУЗЫКА (Web Audio API — не выходит из WebView) ═══
const Music = {
  bgPlaylist: ['assets/music/bg.mp3', 'assets/music/bg2.wav'],
  combatTrack: 'assets/music/combat.wav',
  currentBg: 0,
  ctx: null,
  masterGain: null,
  buffers: {},
  currentSource: null,
  enabled: false,
  inCombat: false,
  _loading: {},

  init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.15;
      this.masterGain.connect(this.ctx.destination);
      try { if (localStorage.getItem('noir_audio') === 'on') this.enabled = true; } catch (e) {}
    } catch (e) { console.warn('AudioContext недоступен', e); }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
  },

  _loadBuffer(url) {
    if (this.buffers[url]) return Promise.resolve(this.buffers[url]);
    if (this._loading[url]) return this._loading[url];
    if (!this.ctx) return Promise.resolve(null);
    // XMLHttpRequest работает и на http://, и на file://
    this._loading[url] = new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = () => {
        // status 0 = file://, status 200 = http://
        if (xhr.status === 200 || xhr.status === 0) {
          this.ctx.decodeAudioData(
            xhr.response,
            (buf) => { this.buffers[url] = buf; delete this._loading[url]; resolve(buf); },
            (err) => { console.warn('decodeAudioData fail:', url, err); delete this._loading[url]; resolve(null); }
          );
        } else {
          console.warn('Music HTTP', xhr.status, url);
          delete this._loading[url];
          resolve(null);
        }
      };
      xhr.onerror = () => { console.warn('Music XHR error:', url); delete this._loading[url]; resolve(null); };
      xhr.send();
    });
    return this._loading[url];
  },

  async _play(url, loop) {
    if (!this.ctx || !this.masterGain) return;
    if (this.currentSource) {
      try { this.currentSource.stop(); } catch (e) {}
      this.currentSource = null;
    }
    const buf = await this._loadBuffer(url);
    if (!buf) return;
    if (!this.enabled) return; // Защита: если выключили, пока грузилось — не играем
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = loop;
    src.connect(this.masterGain);
    src.onended = () => {
      if (!this.enabled || this.inCombat) return;
      this.currentBg = (this.currentBg + 1) % this.bgPlaylist.length;
      this._play(this.bgPlaylist[this.currentBg], false);
    };
    src.start(0);
    this.currentSource = src;
  },

  async start() {
    this.init();
    this.resume();
    if (!this.ctx) return;
    this.enabled = true;
    try { localStorage.setItem('noir_audio', 'on'); } catch (e) {}
    if (typeof Engine !== 'undefined') Engine.updateTopbar();
    const url = this.inCombat ? this.combatTrack : this.bgPlaylist[this.currentBg];
    this.masterGain.gain.value = this.inCombat ? 0.25 : 0.15;
    await this._play(url, this.inCombat);
    // Preload остальных в фоне (через 3 сек, чтобы не тормозить старт)
    setTimeout(() => {
      this.bgPlaylist.forEach(u => { if (!this.buffers[u]) this._loadBuffer(u); });
      if (!this.buffers[this.combatTrack]) this._loadBuffer(this.combatTrack);
    }, 3000);
  },

  stop() {
    if (this.currentSource) {
      try { this.currentSource.stop(); } catch (e) {}
      this.currentSource = null;
    }
    this.enabled = false;
    try { localStorage.setItem('noir_audio', 'off'); } catch (e) {}
    if (typeof Engine !== 'undefined') Engine.updateTopbar();
  },

  toggle() { if (this.enabled) this.stop(); else this.start(); },

  async playCombat() {
    this.inCombat = true;
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;
    this.masterGain.gain.value = 0.25;
    await this._play(this.combatTrack, true);
  },

  async playBackground() {
    this.inCombat = false;
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;
    this.masterGain.gain.value = 0.15;
    await this._play(this.bgPlaylist[this.currentBg], false);
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
