// ============================================
// CÁMARA — Seguimiento del jugador y parallax
// ============================================

class Camera {
  constructor(canvasWidth, canvasHeight) {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.smoothing = 0.1;  // Aumentado de 0.08 a 0.1 para seguimiento más rápido
    this.canvasWidth = canvasWidth || 800;
    this.canvasHeight = canvasHeight || 600;
    this.bounds = { x: 0, y: 0, w: 0, h: 0 };
    this.shake = 0;
    this.shakeIntensity = 0;
  }

  // Actualizar cámara (llamado DESPUÉS de player.update)
  update(player, world) {
    // Objetivo: centrar al jugador (30% izquierda, 70% derecha)
    this.targetX = player.x + player.w * 0.3 - this.canvasWidth * 0.3;
    
    // Objetivo Y: mantener al jugador en el tercio inferior de la pantalla
    // para que el suelo siempre sea visible
    this.targetY = player.y + player.h * 0.5 - this.canvasHeight * 0.6;

    // Suavizado proporcional a la velocidad del jugador
    const smoothing = Math.min(this.smoothing + (Math.abs(player.vx) * 0.02), 0.2);
    this.x = Utils.lerp(this.x, this.targetX, smoothing);
    this.y = Utils.lerp(this.y, this.targetY, smoothing);

    // Limitar Y: nunca subir más allá de mostrar el cielo vacío
    // Mantener el suelo visible en la parte inferior
    if (world && world.groundY) {
      // Cámara Y máxima: suelo - 100px desde el fondo de la pantalla
      const maxY = world.groundY - this.canvasHeight + 100;
      this.y = Math.min(this.y, maxY);
      // Nunca mostrar debajo del suelo
      if (this.y > maxY) {
        this.y = maxY;
        this.targetY = maxY;
      }
    }

    // Nunca mostrar a la izquierda del inicio
    this.x = Math.max(0, this.x);

    // Screen shake decay
    if (this.shake > 0) {
      this.shake -= 0.016;
      this.shakeIntensity *= 0.9;
    }
  }

  // Aplicar shake
  applyShake(intensity) {
    this.shake = 0.3;
    this.shakeIntensity = intensity;
  }

  // Aplicar shake a la transformación del canvas
  apply(ctx) {
    if (this.shake > 0) {
      const shakeX = (Math.random() - 0.5) * this.shakeIntensity * 10;
      const shakeY = (Math.random() - 0.5) * this.shakeIntensity * 10;
      ctx.translate(shakeX, shakeY);
    }
    ctx.translate(-this.x, -this.y);
  }

  // Reset
  reset() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.shake = 0;
  }
}
