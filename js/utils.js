// ============================================
// UTILIDADES GENERALES
// ============================================

const Utils = {
  // Colisiones AABB (Axis-Aligned Bounding Box)
  aabbCollision(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
  },

  // Colisión círculo vs rectángulo
  circleRectCollision(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return (dx * dx + dy * dy) < (circle.r * circle.r);
  },

  // Colisión círculo vs círculo
  circleCircleCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < (a.r + b.r);
  },

  // Distancia entre dos puntos
  dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  },

  // Ángulo entre dos puntos
  angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  },

  // Lerp (interpolación lineal)
  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  // Clamp valor entre min y max
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },

  // Random entre min y max
  random(min, max) {
    return Math.random() * (max - min) + min;
  },

  // Random int entre min y max
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Random elemento de array
  randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Degradado lineal entre dos colores
  lerpColor(c1, c2, t) {
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
    return [r, g, b];
  },

  // Formatear tiempo
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  },

  // Formatear distancia
  formatDistance(px) {
    if (px >= 1000) return `${(px / 1000).toFixed(1)}km`;
    return `${Math.floor(px)}m`;
  },

  // Easing functions
  easeOutQuad(t) { return 1 - (1 - t) * (1 - t); },
  easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; },
  easeOutBack(t) { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },

  // Partícula para efectos
  createParticle(x, y, opts = {}) {
    return {
      x, y,
      vx: opts.vx ?? Utils.random(-2, 2),
      vy: opts.vy ?? Utils.random(-3, -1),
      life: opts.life ?? 1.0,
      decay: opts.decay ?? Utils.random(0.01, 0.03),
      size: opts.size ?? Utils.random(2, 4),
      color: opts.color ?? K.orange,
      gravity: opts.gravity ?? 0.1
    };
  }
};
