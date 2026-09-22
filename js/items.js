// ============================================
// SISTEMA DE OBJETOS — Items recolectables
// ============================================

class ItemSystem {
  constructor() {
    this.items = [];
    this.types = {
      scrap: { color: K.neutral, size: 8, points: 1, label: 'Chatarra' },
      battery: { color: K.green, size: 10, points: 0, label: 'Batería', value: 15 },
      memory: { color: K.purple, size: 12, points: 0, label: 'Fragmento' },
      solar: { color: K.yellowB, size: 14, points: 0, label: 'Panel Solar' }
    };
  }

  // Spawn items en el mundo
  spawnItems(worldWidth, worldHeight) {
    this.items = [];
    const itemCount = Math.floor(worldWidth * worldHeight / 50000);

    for (let i = 0; i < itemCount; i++) {
      const x = Utils.random(100, worldWidth - 100);
      const y = Utils.random(100, worldHeight - 100);
      const rand = Math.random();
      let type;

      if (rand < 0.5) type = 'scrap';
      else if (rand < 0.7) type = 'battery';
      else if (rand < 0.85) type = 'memory';
      else type = 'solar';

      this.items.push({
        x, y,
        w: this.types[type].size * 2,
        h: this.types[type].size * 2,
        type,
        collected: false,
        bobOffset: Utils.random(0, Math.PI * 2),
        sparkle: 0
      });
    }
  }

  // Actualizar items
  update(dt) {
    this.items.forEach(item => {
      if (!item.collected) {
        item.sparkle = (item.sparkle + dt * 3) % (Math.PI * 2);
      }
    });
  }

  // Verificar colisiones con jugador
  checkCollisions(player) {
    const collected = [];
    this.items.forEach(item => {
      if (!item.collected && Utils.circleRectCollision(
        { x: player.x + player.w / 2, y: player.y + player.h / 2, r: player.w / 2 + 10 },
        item
      )) {
        item.collected = true;
        collected.push(item.type);
      }
    });
    return collected;
  }

  // Renderizar items en canvas
  render(ctx, camera) {
    // La cámara ya se aplicó con ctx.translate en game.js - no restar cámara de nuevo
    this.items.forEach(item => {
      if (item.collected) return;

      const sx = item.x;
      const sy = item.y;

      // No renderizar si está fuera de pantalla
      if (sx < -50 || sx > ctx.canvas.width + 50 || sy < -50 || sy > ctx.canvas.height + 50) return;

      const typeInfo = this.types[item.type];
      const bobY = Math.sin(Date.now() * 0.003 + item.bobOffset) * 3;
      const sparkleAlpha = 0.3 + Math.sin(item.sparkle) * 0.2;

      ctx.save();
      ctx.translate(sx + item.w / 2, sy + item.h / 2 + bobY);

      // Brillo
      ctx.shadowColor = typeInfo.color;
      ctx.shadowBlur = 10 + Math.sin(item.sparkle) * 5;

      // Dibujar item
      ctx.fillStyle = typeInfo.color;
      ctx.globalAlpha = 0.8 + sparkleAlpha;

      switch (item.type) {
        case 'scrap':
          // Triángulo de chatarra
          ctx.beginPath();
          ctx.moveTo(0, -item.h / 2);
          ctx.lineTo(item.w / 2, item.h / 2);
          ctx.lineTo(-item.w / 2, item.h / 2);
          ctx.closePath();
          ctx.fill();
          break;
        case 'battery':
          // Batería rectangular
          ctx.fillRect(-item.w / 4, -item.h / 2, item.w / 2, item.h);
          ctx.fillStyle = '#FFF';
          ctx.fillRect(-item.w / 6, -item.h / 2 - 3, item.w / 3, 3);
          break;
        case 'memory':
          // Fragmento con forma de chip
          ctx.fillRect(-item.w / 2, -item.h / 2, item.w, item.h);
          ctx.strokeStyle = '#FFF';
          ctx.lineWidth = 1;
          ctx.strokeRect(-item.w / 2, -item.h / 2, item.w, item.h);
          break;
        case 'solar':
          // Panel solar
          ctx.fillStyle = K.bg;
          ctx.fillRect(-item.w / 2, -item.h / 2, item.w, item.h);
          ctx.strokeStyle = K.yellowB;
          ctx.lineWidth = 2;
          ctx.strokeRect(-item.w / 2, -item.h / 2, item.w, item.h);
          // Líneas del panel
          ctx.beginPath();
          ctx.moveTo(-item.w / 4, -item.h / 2);
          ctx.lineTo(-item.w / 4, item.h / 2);
          ctx.moveTo(item.w / 4, -item.h / 2);
          ctx.lineTo(item.w / 4, item.h / 2);
          ctx.moveTo(-item.w / 2, 0);
          ctx.lineTo(item.w / 2, 0);
          ctx.stroke();
          break;
      }

      ctx.restore();
    });
  }
}
