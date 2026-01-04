// Simple SoundManager for mario-game-main
(function(global){
  function SoundManager(options){
    this.sfx = {};
    this.music = null;
    this.bgmUrl = (options && options.bgm) || '';
    this.deathUrl = (options && options.deathUrl) || '';
    this.muted = false;
    // preload basic sfx if provided
    var map = (options && options.sfx) || {};
    for (var key in map){ if (map.hasOwnProperty(key)) this._loadSfx(key, map[key]); }
  }
  SoundManager.prototype._loadSfx = function(label, url){
    try {
      var a = new Audio(url);
      a.preload = 'auto';
      this.sfx[label] = a;
    } catch(e) {}
  };
  SoundManager.prototype.play = function(label){
    if (this.muted) return;
    var a = this.sfx[label];
    if (!a) return;
    var c = a.cloneNode();
    c.play().catch(function(){});
  };
  SoundManager.prototype.sideMusic = function(label){
    if (this.muted) return;
    if (label === 'die') {
      // stop bgm and play death track (URL) or fall back to death sfx
      if (this.music) this.music.pause();
      if (this.deathUrl) {
        try { var d = new Audio(this.deathUrl); d.play().catch(function(){}); } catch(e) {}
      } else {
        this.play('die');
      }
      return;
    }
    if (!this.bgmUrl) return;
    if (!this.music){
      try { this.music = new Audio(this.bgmUrl); this.music.loop = true; this.music.volume = 0.6; } catch(e) {}
    }
    if (this.music){ this.music.currentTime = 0; this.music.play().catch(function(){}); }
  };
  SoundManager.prototype.stopMusic = function(){ if (this.music) this.music.pause(); };
  global.SoundManager = SoundManager;
})(window);
