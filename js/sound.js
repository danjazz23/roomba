// ============================================
// SISTEMA DE AUDIO — Web Audio API + Música Procedural Retro
// ============================================

// ============================================
// DIAGNÓSTICO DE AUDIO — Habilitado para debugging
// ============================================
const AUDIO_DEBUG = true;
function debugLog(...args) {
  if (AUDIO_DEBUG) {
    console.log('[AUDIO]', ...args);
  }
}
function debugError(...args) {
  console.error('[AUDIO]', ...args);
}

// ============================================
// CHIPTUNE MUSIC — Motor de música procedural
// ============================================
class ChiptuneMusic {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.nextNoteTime = 0;
    this.scheduleAheadTime = 0.1;
    this.tempo = 120;
    this.currentBeat = 0;
    this.beatCount = 0;
    this.actionMode = false;
    this.schedulerTimer = null;
    this.initCalled = false;
    this.startCalled = false;
  }

  // INICIALIZACIÓN — Se llama cuando ya tenemos AudioContext
  init(ctx) {
    debugLog('>>> init() called, ctx:', ctx ? ctx.state : 'null');
    
    if (this.initCalled) {
      debugLog('>>> init() already called, skipping');
      return;
    }
    this.initCalled = true;

    if (!ctx) {
      debugError('init() called without ctx');
      return;
    }

    this.ctx = ctx;
    
    // Crear master gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.ctx.destination);
    debugLog('Master gain created, connected to destination');

    // Crear eco
    this.delay = this.ctx.createDelay();
    this.delay.delayTime.value = 0.25;
    const delayGain = this.ctx.createGain();
    delayGain.gain.value = 0.15;
    this.delay.connect(delayGain);
    delayGain.connect(this.masterGain);
    debugLog('Delay effect created');
  }

  // Escalas pentatónicas
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

  // Melodía procedural
  generateMelody(beat) {
    const patterns = [
      [0, 2, 4, 2, 0, 1, 3, 0, 4, 2, 0, 1, 0, 3, 2, 0],
      [0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 4, 2, 0, 1, 3, 0],
      [0, 0, 2, 2, 4, 4, 2, 0, 1, 1, 3, 3, 1, 0, 0, 0]
    ];
    return patterns[Math.floor(beat / 16) % patterns.length][beat % 16];
  }

  generateBass(beat) {
    const bassPatterns = [
      [0, 0, 4, 4, 0, 0, 2, 2, 3, 3, 7, 7, 3, 3, 0, 0],
      [0, 4, 0, 4, 2, 0, 2, 0, 3, 7, 3, 7, 0, 4, 0, 4]
    ];
    return bassPatterns[Math.floor(beat / 16) % bassPatterns.length][beat % 16];
  }

  // Notas de melodía (onda cuadrada)
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
    
    debugLog(`  🎵 Melody note ${noteIndex} @ freq ${freq.toFixed(1)}Hz at time ${time.toFixed(4)}`);
  }

  // Notas de bajo (onda triangular)
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

  // Acordes de fondo (onda sinusoidal)
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

  // Scheduler — programa notas en el futuro
  scheduler() {
    if (!this.isPlaying) {
      debugLog('Scheduler stopped: isPlaying=false');
      return;
    }
    
    if (!this.ctx || !this.masterGain) {
      debugError('Scheduler running but no ctx/masterGain');
      this.isPlaying = false;
      return;
    }

    // Verificar estado del contexto
    const ctxState = this.ctx.state;
    if (ctxState === 'closed') {
      debugError('Scheduler: context is CLOSED');
      this.isPlaying = false;
      return;
    }
    
    // Si el contexto está suspendido, intentamos reanudar
    if (ctxState === 'suspended') {
      debugLog('Scheduler: context suspended, attempting resume...');
      this.ctx.resume().then(() => {
        debugLog('Scheduler: context resumed to', this.ctx.state);
        this.scheduler();
      }).catch(err => {
        debugError('Scheduler: resume failed:', err);
      });
      return;
    }
    
    // Programar todas las notas dentro del lookahead
    let notesScheduled = 0;
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      
      const secondsPerBeat = 60.0 / this.tempo;
      this.nextNoteTime += 0.25 * secondsPerBeat; // 1/4 de nota
      this.currentBeat++;
      this.beatCount++;
      notesScheduled++;
    }
    
    debugLog(`Scheduler tick: scheduled ${notesScheduled} notes, beat=${this.currentBeat}, beatCount=${this.beatCount}`);
    debugLog(`  currentTime=${this.ctx.currentTime.toFixed(3)}, nextNoteTime=${this.nextNoteTime.toFixed(3)}, lookahead=${this.scheduleAheadTime}`);
    
    // Programar siguiente tick (40Hz = 25ms)
    if (this.isPlaying) {
      this.schedulerTimer = setTimeout(() => this.scheduler(), 25);
    }
  }

  // Programar una nota individual
  scheduleNote(beat, time) {
    // Melodía en cada beat
    const melodyIndex = this.generateMelody(beat);
    if (Math.random() > 0.25) {
      this.playMelodyNote(melodyIndex, time);
    }
    
    // Bajo cada 4 beats
    if (beat % 4 === 0) {
      const bassIndex = this.generateBass(beat);
      this.playBassNote(bassIndex, time);
    }
    
    // Acordes cada 8 beats
    if (beat % 8 === 0) {
      this.playChord(time);
    }
  }

  // Cambiar modo acción (turbo)
  setActionMode(enabled) {
    if (!this.ctx) return;
    if (this.actionMode === enabled) return;
    this.actionMode = enabled;
    
    const newTempo = enabled ? 150 : 120;
    const newVolume = enabled ? 0.4 : 0.3;
    
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(newVolume, this.ctx.currentTime + 0.5);
    }
    this.tempo = newTempo;
    debugLog(`Action mode: ${enabled ? 'ON (150 BPM)' : 'OFF (120 BPM)'}`);
  }

  // START ROBUSTO — el método más importante
  async start() {
    debugLog('>>> START() called');
    debugLog('   initCalled:', this.initCalled);
    debugLog('   isPlaying:', this.isPlaying);
    
    if (this.isPlaying) {
      debugLog('>>> START() already playing, skipping');
      return true;
    }
    
    if (!this.initCalled) {
      debugError('>>> START() called but init() was not!');
      return false;
    }
    
    if (!this.ctx) {
      debugError('>>> START() called but this.ctx is null!');
      return false;
    }
    
    // Verificar y asegurar contexto activo
    debugLog('   ctx.state before resume:', this.ctx.state);
    
    if (this.ctx.state === 'suspended') {
      debugLog('>>> Context suspended, awaiting resume...');
      try {
        await this.ctx.resume();
        debugLog('>>> Context resumed to:', this.ctx.state);
      } catch (e) {
        debugError('>>> Context resume FAILED:', e);
        return false;
      }
    }
    
    if (this.ctx.state !== 'running') {
      debugError('>>> Context still not running after resume! state:', this.ctx.state);
      return false;
    }
    
    debugLog('>>> Context is RUNNING — starting scheduler');
    
    // Iniciar scheduler
    this.currentBeat = 0;
    this.beatCount = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.01; // Inmediato
    this.isPlaying = true;
    this.startCalled = true;
    
    debugLog(`   nextNoteTime: ${this.nextNoteTime.toFixed(4)}`);
    debugLog(`   currentTime: ${this.ctx.currentTime.toFixed(4)}`);
    debugLog(`   scheduleAheadTime: ${this.scheduleAheadTime}`);
    
    // Ejecutar scheduler inmediatamente
    this.scheduler();
    
    // Verificar que el scheduler se ejecutó (después de 100ms)
    setTimeout(() => {
      if (this.isPlaying) {
        debugLog(`   [100ms post-start] isPlaying=${this.isPlaying}, beat=${this.currentBeat}, beatCount=${this.beatCount}`);
      }
    }, 100);
    
    return true;
  }

  // STOP
  stop() {
    debugLog('>>> STOP() called');
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
}

// ============================================
// SOUND SYSTEM — Capa superior de audio
// ============================================
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.music = new ChiptuneMusic();
    this.initialized = false;
  }

  // INICIALIZACIÓN ASÍNCRONA — Crea y resume AudioContext
  async init() {
    debugLog('>>> SoundSystem.init() called');
    
    // Si ya inicializado, verificar estado
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        debugLog('>>> Context suspended, attempting resume...');
        try {
          await this.ctx.resume();
          debugLog('>>> Context resumed to:', this.ctx.state);
        } catch (e) {
          debugError('>>> Resume failed:', e);
        }
      }
      const ready = this.ctx.state === 'running';
      debugLog(`>>> Already initialized, ctx.state=${this.ctx.state}, ready=${ready}`);
      return ready;
    }
    
    // Crear nuevo contexto
    debugLog('>>> Creating new AudioContext...');
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      debugLog('>>> AudioContext created, state:', this.ctx.state);
      
      // Esperar a que el contexto esté activo
      if (this.ctx.state === 'suspended') {
        debugLog('>>> Context initially suspended, awaiting resume...');
        await this.ctx.resume();
        debugLog('>>> Context resumed to:', this.ctx.state);
      }
      
      this.initialized = this.ctx.state === 'running';
      debugLog(`>>> AudioSystem init complete: ${this.initialized ? 'READY' : 'NOT READY'}, state=${this.ctx.state}`);
      return this.initialized;
    } catch (e) {
      debugError('>>> Web Audio API failed:', e);
      return false;
    }
  }

  // Efectos de sonido procedurales
  playTone(freq, duration, type = 'sine', volume = 0.3) {
    if (!this.ctx || !this.enabled) return;
    
    // Verificar estado del contexto
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.ctx.state !== 'running') return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume * 0.7, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playCollect() { this.playTone(880, 0.1, 'sine', 0.2); setTimeout(() => this.playTone(1100, 0.1, 'sine', 0.2), 50); }
  playDamage() { this.playTone(150, 0.2, 'sawtooth', 0.3); }
  playAttack() { this.playTone(400, 0.05, 'square', 0.2); }
  playLowBattery() { this.playTone(440, 0.15, 'sine', 0.25); setTimeout(() => this.playTone(440, 0.3, 'sine', 0.25), 300); }
  playUpgrade() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.playTone(f, 0.15, 'sine', 0.2), i * 80)); }
  playCollision() { this.playTone(80, 0.15, 'square', 0.25); }
  playDeath() { [440, 370, 311, 261, 220].forEach((f, i) => setTimeout(() => this.playTone(f, 0.4, 'sine', 0.3), i * 200)); }
  playJump() { this.playTone(300, 0.05, 'sine', 0.2); setTimeout(() => this.playTone(500, 0.08, 'sine', 0.2), 50); }
  playShield() { this.playTone(300, 0.1, 'sine', 0.15); }
  mute() { this.enabled = false; }
  unmute() { this.enabled = true; }
}

// Instancia global
const Sound = new SoundSystem();
