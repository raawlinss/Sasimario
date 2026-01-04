// Simple SoundManager for mario-game-main
(function(global){
  function SoundManager(options){
    this.sfx = {};
    this.music = null;
    this.bgmUrl = (options && options.bgm) || '';
    this.deathUrl = (options && options.deathUrl) || '';
    this.volume = (options && typeof options.volume === 'number') ? options.volume : 0.5;
    this.muted = false;
    this._settingsVisible = false;
    this._settingsEl = null;
    this._lastDeathOverlayAt = 0;
    // preload basic sfx if provided
    var map = (options && options.sfx) || {};
    for (var key in map){ if (map.hasOwnProperty(key)) this._loadSfx(key, map[key]); }
  }
  SoundManager.prototype._loadSfx = function(label, url){
    try {
      var a = new Audio(url);
      a.preload = 'auto';
      a.volume = this.volume;
      this.sfx[label] = a;
    } catch(e) {}
  };

  SoundManager.prototype.setVolume = function(v){
    if (typeof v !== 'number') return;
    if (v < 0) v = 0;
    if (v > 1) v = 1;
    this.volume = v;
    if (this.music) this.music.volume = this.muted ? 0 : this.volume;
    for (var key in this.sfx){
      if (!this.sfx.hasOwnProperty(key)) continue;
      try { this.sfx[key].volume = this.muted ? 0 : this.volume; } catch(e) {}
    }
  };

  SoundManager.prototype.getVolume = function(){
    return this.volume;
  };

  SoundManager.prototype._ensureSettingsUi = function(){
    if (this._settingsEl) return;
    var self = this;
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.55);z-index:2500;display:none;align-items:center;justify-content:center;';
    var card = document.createElement('div');
    card.style.cssText = 'background:#111;color:#fff;padding:18px 18px;border-radius:12px;min-width:280px;border:1px solid rgba(255,255,255,0.15);';
    var title = document.createElement('div');
    title.textContent = 'Ayarlar';
    title.style.cssText = 'font-weight:700;margin-bottom:10px;';
    var label = document.createElement('div');
    label.style.cssText = 'margin:8px 0 6px 0;opacity:.95;';
    var slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.value = String(Math.round(self.getVolume() * 100));
    slider.style.cssText = 'width:100%;';
    var btn = document.createElement('button');
    btn.textContent = 'Kapat';
    btn.style.cssText = 'margin-top:12px;width:100%;background:#10b981;color:#06120f;border:none;padding:10px 12px;border-radius:8px;cursor:pointer;font-weight:600;';

    function syncLabel(){
      label.textContent = 'Ses: ' + slider.value + '%';
    }
    syncLabel();
    slider.addEventListener('input', function(){
      self.setVolume(parseInt(slider.value, 10) / 100);
      syncLabel();
    });
    btn.addEventListener('click', function(){
      self.toggleSettings();
    });
    wrap.addEventListener('click', function(e){
      if (e.target === wrap) self.toggleSettings();
    });

    card.appendChild(title);
    card.appendChild(label);
    card.appendChild(slider);
    card.appendChild(btn);
    wrap.appendChild(card);
    document.body.appendChild(wrap);
    this._settingsEl = wrap;
  };

  SoundManager.prototype.toggleSettings = function(){
    this._ensureSettingsUi();
    this._settingsVisible = !this._settingsVisible;
    this._settingsEl.style.display = this._settingsVisible ? 'flex' : 'none';
  };

  SoundManager.prototype._playDeathOverlay = function(){
    if (this.muted) return;
    if (!this.deathUrl) return;
    var now = Date.now();
    if (now - this._lastDeathOverlayAt < 200) return;
    this._lastDeathOverlayAt = now;
    try {
      var d = new Audio(this.deathUrl);
      d.volume = this.volume;
      d.play().catch(function(){});
    } catch(e) {}
  };

  SoundManager.prototype.play = function(label){
    if (this.muted) return;
    if (label === 'hurt') {
      this._playDeathOverlay();
    }
    var a = this.sfx[label];
    if (!a) return;
    var c = a.cloneNode();
    try { c.volume = this.volume; } catch(e) {}
    c.play().catch(function(){});
  };
  SoundManager.prototype.sideMusic = function(label){
    if (this.muted) return;
    if (label === 'die') {
      // play death track (URL) over bgm (do not pause bgm)
      this._playDeathOverlay();
      if (!this.deathUrl) this.play('die');
      return;
    }
    if (!this.bgmUrl) return;
    if (!this.music){
      try { this.music = new Audio(this.bgmUrl); this.music.loop = true; this.music.volume = this.volume; } catch(e) {}
    }
    if (this.music){
      if (this.music.paused) this.music.play().catch(function(){});
    }
  };
  SoundManager.prototype.stopMusic = function(){ if (this.music) this.music.pause(); };
  global.SoundManager = SoundManager;

  if (!global.__soundSettingsEscHooked) {
    global.__soundSettingsEscHooked = true;
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && global.__soundMgr && global.__soundMgr.toggleSettings) {
        global.__soundMgr.toggleSettings();
        e.preventDefault();
      }
    });
  }
})(window);
