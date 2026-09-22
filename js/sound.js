// ============================================
// SISTEMA DE AUDIO — Web Audio API
// ============================================

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.sounds = {};
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
  }

  // Inicializar audio (requiere interacción del usuario)
  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      return true;
    } catch (e) {
      console.warn('Web Audio API no disponible');
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

  // Silenciar todo
  mute() { this.enabled = false; }
  unmute() { this.enabled = true; }
}

const Sound = new SoundSystem();
