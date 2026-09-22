// ============================================
// SISTEMA DE INPUT — Táctil + Teclado
// ============================================

class InputSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.justPressed = {}; // Teclas presionadas este frame (para triggers)
    this.joystick = { active: false, dx: 0, dy: 0, originX: 0, originY: 0, currentX: 0, currentY: 0 };
    this.buttons = { attack: false, shield: false, turbo: false, jump: false };
    this.touchAreas = { joystick: null, attack: null, shield: null, turbo: null, jump: null };
    this.isMobile = this.detectMobile();
    this.touchStartX = 0;
    this.touchStartY = 0;

    this.setupKeyboard();
    if (this.isMobile) {
      this.setupTouch();
    }
  }

  detectMobile() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (!this.keys[e.code]) {
        this.justPressed[e.code] = true; // Solo marca el borde de subida
      }
      this.keys[e.code] = true;
      if (e.code === 'Escape') {
        window.dispatchEvent(new CustomEvent('game-pause'));
      }
      // Prevenir scroll con espacio y flechas
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.justPressed[e.code] = false;
    });
  }

  setupTouch() {
    const joystickZone = document.getElementById('joystick-zone');
    const btnAttack = document.getElementById('btn-attack');
    const btnShield = document.getElementById('btn-shield');
    const btnTurbo = document.getElementById('btn-turbo');

    // Joystick
    joystickZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = joystickZone.getBoundingClientRect();
      this.joystick.active = true;
      this.joystick.originX = rect.left + rect.width / 2;
      this.joystick.originY = rect.top + rect.height / 2;
      this.joystick.currentX = touch.clientX;
      this.joystick.currentY = touch.clientY;
    });

    joystickZone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const maxDist = 40;
      let dx = touch.clientX - this.joystick.originX;
      let dy = touch.clientY - this.joystick.originY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > maxDist) {
        dx = (dx / dist) * maxDist;
        dy = (dy / dist) * maxDist;
      }
      this.joystick.dx = dx / maxDist;
      this.joystick.dy = dy / maxDist;
      this.joystick.currentX = this.joystick.originX + dx;
      this.joystick.currentY = this.joystick.originY + dy;
    });

    joystickZone.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.joystick.active = false;
      this.joystick.dx = 0;
      this.joystick.dy = 0;
    });

    // Saltar — usar pointer events para mayor compatibilidad móvil
    const setupBtn = (btn, key, code) => {
      btn.addEventListener('pointerdown', (e) => { e.preventDefault(); this.buttons[key] = true; });
      btn.addEventListener('pointerup', (e) => { e.preventDefault(); this.buttons[key] = false; });
      btn.addEventListener('pointerleave', (e) => { this.buttons[key] = false; });
      btn.addEventListener('touchstart', (e) => { e.preventDefault(); this.buttons[key] = true; });
      btn.addEventListener('touchend', (e) => { e.preventDefault(); this.buttons[key] = false; });
      btn.addEventListener('touchcancel', (e) => { this.buttons[key] = false; });
    };

    setupBtn(btnAttack, 'attack', 'KeyZ');
    setupBtn(btnShield, 'shield', 'KeyQ');
    setupBtn(btnTurbo, 'turbo', 'ShiftLeft');

    // Botón de salto
    const btnJump = document.getElementById('btn-jump');
    if (btnJump) {
      btnJump.addEventListener('pointerdown', (e) => { e.preventDefault(); this.buttons.jump = true; });
      btnJump.addEventListener('pointerup', (e) => { e.preventDefault(); this.buttons.jump = false; });
      btnJump.addEventListener('pointerleave', (e) => { this.buttons.jump = false; });
      btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); this.buttons.jump = true; });
      btnJump.addEventListener('touchend', (e) => { e.preventDefault(); this.buttons.jump = false; });
      btnJump.addEventListener('touchcancel', (e) => { this.buttons.jump = false; });
    }
  }

  // Obtener dirección de movimiento (-1 a 1)
  getMoveX() {
    if (this.joystick.active) return this.joystick.dx;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) return -1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) return 1;
    return 0;
  }

  getMoveY() {
    if (this.joystick.active) return this.joystick.dy;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) return -0.5;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) return 0.5;
    return 0;
  }

  // Estados de botones
  isAttacking() {
    return this.buttons.attack || this.keys['Space'] || this.keys['KeyZ'];
  }

  isJumping() {
    return this.buttons.jump || !!this.justPressed['ArrowUp'] || !!this.justPressed['KeyW'] || !!this.justPressed['KeyX'];
  }

  isShielding() {
    return this.buttons.shield || this.keys['KeyQ'];
  }

  isTurbo() {
    return this.buttons.turbo || this.keys['ShiftLeft'] || this.keys['ShiftRight'];
  }

  // Actualizar visual del joystick
  updateJoystickVisual() {
    const stick = document.getElementById('joystick-stick');
    if (stick) {
      stick.style.transform = `translate(${this.joystick.currentX - 40}px, ${this.joystick.currentY - 40}px)`;
    }
  }

  // Resetear triggers de teclas cada frame (para que el jump solo actúe un frame)
  update() {
    this.justPressed = {};
  }
}
