// ============================================
// SISTEMA DE AUDIO — Web Audio API + Música Procedural Retro
// ============================================

class ChiptuneMusic {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.currentTrack = null;
    this.nextNoteTime = 0;
    this.scheduleAheadTime = 0.2; // Lookahead: debe ser > 0.125s (duración por beat)
    this.tempo = 120;
    this.currentBeat = 0;
    this.beatCount = 0;
    this.octave = 4;
    this.isActionMode = false;
  }

  init(ctx) {
    this.ctx = ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(ctx.destination);
    
    // Crear efectos de eco para ambiente retro
    this.delay = ctx.createDelay();
    this.delay.delayTime.value = 0.3;
    this.delayGain = ctx.createGain();
    this.delayGain.gain.value = 0.2;
    this.delay.connect(this.delayGain);
    this.delayGain.connect(this.masterGain);
  }

  // Escalas pentatónicas para sonido retro auténtico
  getScale(type = 'minor') {
    const scales = {
      minor: [0, 3, 5, 7, 10],      // Do menor pentatónica
      major: [0, 2, 4, 5, 7],       // Do mayor pentatónica  
      blues: [0, 3, 5, 6, 7, 10],   // Do blues
      dorian: [0, 2, 3, 5, 7, 9, 10] // Dórico
    };
    return scales[type] || scales.minor;
  }

  // Convertir índice de escala a frecuencia
  scaleToFreq(index, scaleType = 'minor') {
    const scale = this.getScale(scaleType);
    const noteInScale = index % scale.length;
    const octaveShift = Math.floor(index / scale.length);
    const semitones = scale[noteInScale] + (octaveShift * 12);
    return 440 * Math.pow(2, (semitones - 9) / 12);
  }

  // Generar melodía procedural
  generateMelody(beat) {
    const patterns = [
      // Patrón melódico 1 - Ambiente misterioso
      [0, 2, 4, 2, 0, 1, 3, 0, 4, 2, 0, 1, 0, 3, 2, 0],
      // Patrón melódico 2 - Ascendente
      [0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 4, 2, 0, 1, 3, 0],
      // Patrón melódico 3 - Repetitivo retro
      [0, 0, 2, 2, 4, 4, 2, 0, 1, 1, 3, 3, 1, 0, 0, 0]
    ];
    
    const patternIndex = Math.floor(beat / 16) % patterns.length;
    const beatInPattern = beat % 16;
    return patterns[patternIndex][beatInPattern];
  }

  // Generar línea de bajo procedural
  generateBass(beat) {
    const bassPatterns = [
      [0, 0, 4, 4, 0, 0, 2, 2, 3, 3, 7, 7, 3, 3, 0, 0],
      [0, 4, 0, 4, 2, 0, 2, 0, 3, 7, 3, 7, 0, 4, 0, 4]
    ];
    
    const patternIndex = Math.floor(beat / 16) % bassPatterns.length;
    const beatInPattern = beat % 16;
    return bassPatterns[patternIndex][beatInPattern];
  }

  // Tocar nota de melodía con estilo chiptune
  playMelodyNote(noteIndex, time) {
    if (noteIndex === undefined || noteIndex < 0) return;
    
    const freq = this.scaleToFreq(noteIndex, 'minor');
    
    // Oscilador principal (onda cuadrada para sonido retro)
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq * (2 + (this.currentBeat % 2 === 0 ? 0 : 0)), time);
    
    // Envelope ADSR rápido para sonido pixelado
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.15, time + 0.01);
    gain.gain.setValueAtTime(0.15, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    gain.connect(this.delay); // Añadir eco
    
    osc.start(time);
    osc.stop(time + 0.15);
  }

  // Tocar nota de bajo
  playBassNote(noteIndex, time) {
    const freq = this.scaleToFreq(noteIndex - 12, 'minor'); // Una octava abajo
    
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle'; // Bajo más suave
    osc.frequency.setValueAtTime(freq, time);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.2, time + 0.02);
    gain.gain.setValueAtTime(0.2, time + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(time);
    osc.stop(time + 0.3);
  }

  // Generar acorde de fondo
  playChord(time, intensity = 0.1) {
    const chordNotes = [0, 4, 7]; // Tónica, tercera, quinta
    
    chordNotes.forEach((noteIdx, i) => {
      const freq = this.scaleToFreq(noteIdx, 'minor') * 0.5; // Una octava abajo
      
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(intensity * 0.1, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(time);
      osc.stop(time + 1.0);
    });
  }

  // Scheduler principal para timing preciso
  scheduler() {
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      this.nextNote();
    }
    
    if (this.isPlaying) {
      setTimeout(() => this.scheduler(), 25);
    }
  }

  // Programar nota en tiempo específico
  scheduleNote(beat, time) {
    // Melodía en cada beat
    const melodyIndex = this.generateMelody(beat);
    if (Math.random() > 0.3) { // 70% probabilidad de sonar
      this.playMelodyNote(melodyIndex, time);
    }
    
    // Bajo cada 4 beats
    if (beat % 4 === 0) {
      const bassIndex = this.generateBass(beat);
      this.playBassNote(bassIndex, time);
    }
    
    // Acorde cada 8 beats
    if (beat % 8 === 0) {
      this.playChord(time, 0.5);
    }
  }

  // Avanzar al siguiente beat
  nextNote() {
    const secondsPerBeat = 60.0 / this.tempo;
    this.nextNoteTime += 0.25 * secondsPerBeat; // Cuartos de nota
    this.currentBeat++;
    this.beatCount++;
  }

  // Cambiar a modo acción (más rápido, intenso)
  setActionMode(enabled) {
    if (this.isActionMode === enabled) return;
    this.isActionMode = enabled;
    
    if (enabled) {
      this.tempo = 150; // Más rápido
      this.masterGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.5);
    } else {
      this.tempo = 120;
      this.masterGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.5);
    }
  }

  // Iniciar música
  start() {
    if (this.isPlaying) return;
    
    this.currentBeat = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05; // Inicio dentro del lookahead
    this.isPlaying = true;
    
    // Pre-cargar notas para evitar silencio inicial
    this.scheduler();
    // Programar el siguiente ciclo
    this.scheduler();
  }

  // Detener música
  stop() {
    this.isPlaying = false;
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        if (this.masterGain) {
          this.masterGain.gain.value = 0.3;
        }
      }, 500);
    }
  }

  // Cambiar volumen
  setVolume(volume) {
    if (this.masterGain) {
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

  // Inicializar audio (requiere interacción del usuario)
  async init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Resumir contexto si está suspendido (iOS/Android lo suspenden por defecto)
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      console.log('✅ AudioContext listo, estado:', this.ctx.state);
      return true;
    } catch (e) {
      console.warn('Web Audio API no disponible:', e);
      return false;
    }
  }

  // Crear oscilador para efectos de sonido procedurales
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

  // Sonido de recolección
  playCollect() {
    this.playTone(880, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(1100, 0.1, 'sine', 0.2), 50);
  }

  // Sonido de daño
  playDamage() {
    this.playTone(150, 0.2, 'sawtooth', 0.3);
    this.playTone(100, 0.3, 'square', 0.15);
  }

  // Sonido de ataque
  playAttack() {
    this.playTone(400, 0.05, 'square', 0.2);
    this.playTone(600, 0.08, 'sawtooth', 0.15);
  }

  // Sonido de batería baja
  playLowBattery() {
    this.playTone(440, 0.15, 'sine', 0.25);
    setTimeout(() => this.playTone(440, 0.15, 'sine', 0.25), 200);
    setTimeout(() => this.playTone(440, 0.3, 'sine', 0.25), 400);
  }

  // Sonido de mejora instalada
  playUpgrade() {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.2), i * 80);
    });
  }

  // Sonido de motor en movimiento
  motorTone(speed) {
    const freq = 60 + speed * 40;
    this.playTone(freq, 0.05, 'sawtooth', 0.05 + speed * 0.02);
  }

  // Sonido de choque
  playCollision() {
    this.playTone(80, 0.15, 'square', 0.25);
  }

  // Sonido de pantalla de muerte
  playDeath() {
    [440, 370, 311, 261, 220].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.3), i * 200);
    });
  }

  // Sonido de victoria/checkpoint
  playCheckpoint() {
    [523, 659, 784, 1047, 784, 1047].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.2), i * 100);
    });
  }

  // Sonido de escudo activado
  playShield() {
    this.playTone(300, 0.1, 'sine', 0.15);
    this.playTone(500, 0.15, 'sine', 0.1);
  }

  // Sonido de salto
  playJump() {
    this.playTone(300, 0.05, 'sine', 0.2);
    setTimeout(() => this.playTone(500, 0.08, 'sine', 0.2), 50);
    setTimeout(() => this.playTone(700, 0.1, 'sine', 0.15), 100);
  }

  // Silenciar todo (SFX solo)
  mute() { this.enabled = false; }
  unmute() { this.enabled = true; }
}

const Sound = new SoundSystem();
