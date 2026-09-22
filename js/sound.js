// ============================================
// SISTEMA DE AUDIO — Web Audio API + Música Procedural Retro
// ============================================

class ChiptuneMusic {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.schedulerTimer = null;
    this.nextNoteTime = 0;
    this.scheduleAheadTime = 0.15;
    this.tempo = 120;
    this.currentBeat = 0;
    this.beatCount = 0;
    this.octave = 4;
    this.isActionMode = false;
    this.initialized = false;
    this.pendingNotes = [];
  }

  init(ctx) {
    if (this.initialized) return;
    
    this.ctx = ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(ctx.destination);
    
    // Eco para ambiente
    this.delay = ctx.createDelay();
    this.delay.delayTime.value = 0.25;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.15;
    this.delay.connect(delayGain);
    delayGain.connect(this.masterGain);
    
    this.initialized = true;
    console.log('🎵 ChiptuneMusic inicializado');
  }

  getScale(type = 'minor') {
    return {
      minor: [0, 3, 5, 7, 10],
      major: [0, 2, 4, 5, 7],
      blues: [0, 3, 5, 6, 7, 10]
    }[type] || [0, 3, 5, 7, 10];
  }

  scaleToFreq(index, scaleType = 'minor') {
    const scale = this.getScale(scaleType);
    const noteInScale = ((index % scale.length) + scale.length) % scale.length;
    const octaveShift = Math.floor(index / scale.length);
    const semitones = scale[noteInScale] + (octaveShift * 12);
    return 440 * Math.pow(2, (semitones - 9) / 12);
  }

  generateMelody(beat) {
    const patterns = [
      [0, 2, 4, 2, 0, 1, 3, 0, 4, 2, 0, 1, 0, 3, 2, 0],
      [0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 4, 2, 0, 1, 3, 0],
      [0, 0, 2, 2, 4, 4, 2, 0, 1, 1, 3, 3, 1, 0, 0, 0]
    ];
    const patternIndex = Math.floor(beat / 16) % patterns.length;
    return patterns[patternIndex][beat % 16];
  }

  generateBass(beat) {
    const bassPatterns = [
      [0, 0, 4, 4, 0, 0, 2, 2, 3, 3, 7, 7, 3, 3, 0, 0],
      [0, 4, 0, 4, 2, 0, 2, 0, 3, 7, 3, 7, 0, 4, 0, 4]
    ];
    const patternIndex = Math.floor(beat / 16) % bassPatterns.length;
    return bassPatterns[patternIndex][beat % 16];
  }

  playMelodyNote(noteIndex, time) {
    if (noteIndex < 0) return;
    
    const freq = this.scaleToFreq(noteIndex, 'minor');
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.005);
    gain.gain.setValueAtTime(0.12, time + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    gain.connect(this.delay);
    
    osc.start(time);
    osc.stop(time + 0.15);
  }

  playBassNote(noteIndex, time) {
    const freq = this.scaleToFreq(noteIndex - 12, 'minor');
    
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.015);
    gain.gain.setValueAtTime(0.18, time + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.24);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(time);
    osc.stop(time + 0.28);
  }

  playChord(time) {
    const chordNotes = [0, 4, 7];
    chordNotes.forEach(noteIdx => {
      const freq = this.scaleToFreq(noteIdx, 'minor') * 0.5;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.08, time + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.7);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(time);
      osc.stop(time + 0.8);
    });
  }

  scheduleNote(beat, time) {
    const melodyIndex = this.generateMelody(beat);
    if (Math.random() > 0.25) {
      this.playMelodyNote(melodyIndex, time);
    }
    
    if (beat % 4 === 0) {
      const bassIndex = this.generateBass(beat);
      this.playBassNote(bassIndex, time);
    }
    
    if (beat % 8 === 0) {
      this.playChord(time);
    }
  }

  // Scheduler robusto: usa setTimeout recursivo con check de contexto
  scheduler() {
    if (!this.isPlaying || !this.initialized) return;
    
    // Verificar que el contexto sigue activo
    if (!this.ctx || this.ctx.state === 'closed') {
      this.isPlaying = false;
      return;
    }
    
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      const secondsPerBeat = 60.0 / this.tempo;
      this.nextNoteTime += 0.25 * secondsPerBeat;
      this.currentBeat++;
      this.beatCount++;
    }
    
    // Programar siguiente ejecución (25ms = 40Hz)
    if (this.isPlaying) {
      this.schedulerTimer = setTimeout(() => this.scheduler(), 25);
    }
  }

  setActionMode(enabled) {
    if (!this.initialized) return;
    if (this.isActionMode === enabled) return;
    this.isActionMode = enabled;
    
    const newTempo = enabled ? 150 : 120;
    const newVolume = enabled ? 0.4 : 0.3;
    
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(newVolume, this.ctx.currentTime + 0.5);
    }
    this.tempo = newTempo;
  }

  // START ROBUSTO: espera a que el contexto esté listo antes de programar
  async start() {
    if (this.isPlaying) return;
    
    if (!this.initialized || !this.ctx) {
      console.warn('⚠️ ChiptuneMusic.start() pero no inicializado');
      return;
    }
    
    // Asegurar que el contexto está running (crítico en móviles)
    if (this.ctx.state === 'suspended') {
      try {
        console.log('🎵 Resumiendo AudioContext...');
        await this.ctx.resume();
        console.log('🎵 AudioContext resume:', this.ctx.state);
      } catch (e) {
        console.error('❌ No se pudo resumir AudioContext:', e);
        return;
      }
    }
    
    if (this.ctx.state !== 'running') {
      console.error('❌ AudioContext no está running:', this.ctx.state);
      return;
    }
    
    this.currentBeat = 0;
    this.beatCount = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.01; // Muy cerca para empezar ya
    this.isPlaying = true;
    
    console.log('🎵 Iniciando scheduler, nextNoteTime:', this.nextNoteTime.toFixed(4), 'currentTime:', this.ctx.currentTime.toFixed(4));
    
    // Programar inmediatamente Y luego con setTimeout
    this.scheduler();
  }

  stop() {
    this.isPlaying = false;
    if (this.schedulerTimer) {
      clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
      setTimeout(() => {
        if (this.masterGain) {
          this.masterGain.gain.value = 0.3;
        }
      }, 300);
    }
  }

  setVolume(volume) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.1);
    }
  }
}

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.sounds = {};
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
    this.music = new ChiptuneMusic();
  }

  async init() {
    if (this.ctx) {
      // Si ya existe, verificar estado
      if (this.ctx.state === 'suspended') {
        try {
          await this.ctx.resume();
        } catch (e) {
          console.warn('No se pudo resume AudioContext:', e);
        }
      }
      return this.ctx.state === 'running';
    }
    
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Esperar a que el contexto esté activo
      if (this.ctx.state === 'suspended') {
        console.log('🎵 AudioContext suspendido, esperando resume...');
        await this.ctx.resume();
      }
      
      console.log('✅ AudioContext listo:', this.ctx.state);
      return this.ctx.state === 'running';
    } catch (e) {
      console.error('❌ Web Audio API no disponible:', e);
      return false;
    }
  }

  playTone(freq, duration, type = 'sine', volume = 0.3) {
    if (!this.ctx || !this.enabled) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume * this.sfxVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playCollect() {
    this.playTone(880, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(1100, 0.1, 'sine', 0.2), 50);
  }

  playDamage() {
    this.playTone(150, 0.2, 'sawtooth', 0.3);
    this.playTone(100, 0.3, 'square', 0.15);
  }

  playAttack() {
    this.playTone(400, 0.05, 'square', 0.2);
    this.playTone(600, 0.08, 'sawtooth', 0.15);
  }

  playLowBattery() {
    this.playTone(440, 0.15, 'sine', 0.25);
    setTimeout(() => this.playTone(440, 0.15, 'sine', 0.25), 200);
    setTimeout(() => this.playTone(440, 0.3, 'sine', 0.25), 400);
  }

  playUpgrade() {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.2), i * 80);
    });
  }

  motorTone(speed) {
    const freq = 60 + speed * 40;
    this.playTone(freq, 0.05, 'sawtooth', 0.05 + speed * 0.02);
  }

  playCollision() {
    this.playTone(80, 0.15, 'square', 0.25);
  }

  playDeath() {
    [440, 370, 311, 261, 220].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.3), i * 200);
    });
  }

  playCheckpoint() {
    [523, 659, 784, 1047, 784, 1047].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.2), i * 100);
    });
  }

  playShield() {
    this.playTone(300, 0.1, 'sine', 0.15);
    this.playTone(500, 0.15, 'sine', 0.1);
  }

  playJump() {
    this.playTone(300, 0.05, 'sine', 0.2);
    setTimeout(() => this.playTone(500, 0.08, 'sine', 0.2), 50);
    setTimeout(() => this.playTone(700, 0.1, 'sine', 0.15), 100);
  }

  mute() { this.enabled = false; }
  unmute() { this.enabled = true; }
}

const Sound = new SoundSystem();
