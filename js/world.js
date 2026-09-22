// ============================================
// MUNDO INFINITO — Generación procedural infinita
// ============================================

class World {
  constructor() {
    this.segments = [];      // segmentos de terreno activos
    this.segmentWidth = 400;  // ancho de cada segmento
    this.segmentHeight = 800; // alto del nivel
    this.groundY = 520;       // nivel del suelo (dentro del viewport 600px)
    this.nextSegmentX = 0;    // próximo segmento por generar
    this.camera = null;
    this.lastPlayerX = 0;     // para detectar dirección del jugador
    this.totalDistance = 0;   // distancia total recorrida
  }

  // Iniciar mundo (primera generación)
  init(playerStartX = 100) {
    this.segments = [];
    this.nextSegmentX = 0;
    this.lastPlayerX = playerStartX;
    this.totalDistance = 0;

    // Generar segmentos iniciales seguros (sin enemigos difíciles)
    for (let i = 0; i < 5; i++) {
      this.generateSegment(i * this.segmentWidth, i < 2 ? 'safe' : 'normal');
    }
  }

  // Generar un segmento del mundo
  generateSegment(x, difficulty = 'normal') {
    const segment = {
      x: x,
      width: this.segmentWidth,
      platforms: [],
      outlets: [],
      solarZones: [],
      enemies: [],
      items: [],
      difficulty: difficulty
    };

    // Suelo continuo (con huecos aleatorios para desafío)
    const hasGap = Math.random() < (difficulty === 'safe' ? 0 : 0.15);
    if (!hasGap || x < this.segmentWidth * 2) {
      segment.platforms.push({
        x: x, y: this.groundY,
        w: this.segmentWidth, h: 60,
        type: 'ground'
      });
    } else {
      // Generar puente o plataforma sobre el hueco
      const bridgeX = x + this.segmentWidth * 0.4;
      segment.platforms.push({
        x: bridgeX, y: this.groundY + 40,
        w: 120, h: 20,
        type: 'bridge'
      });
    }

    // Plataformas flotantes (más en dificultad normal/hard)
    const platformCount = difficulty === 'safe' ? Utils.random(1, 2) : Utils.random(2, 5);
    for (let i = 0; i < platformCount; i++) {
      const px = x + Utils.random(20, this.segmentWidth - 100);
      const py = this.groundY - Utils.random(80, 350);
      const pw = Utils.random(60, 140);
      const ph = 16;

      segment.platforms.push({
        x: px, y: py, w: pw, h: ph,
        type: 'platform'
      });
    }

    // Plataformas altas (para saltos difíciles)
    if (difficulty !== 'safe' && Math.random() < 0.4) {
      const hx = x + Utils.random(50, this.segmentWidth - 150);
      const hy = this.groundY - Utils.random(350, 500);
      segment.platforms.push({
        x: hx, y: hy, w: 80, h: 16,
        type: 'high-platform'
      });
    }

    // Enchufes de recarga (más frecuentes en early game)
    if (difficulty === 'safe' || Math.random() < 0.3) {
      segment.outlets.push({
        x: x + Utils.random(50, this.segmentWidth - 100),
        y: this.groundY - 35,
        w: 35, h: 25,
        rechargeRate: 0.8
      });
    }

    // Zonas de luz solar
    if (Math.random() < 0.5) {
      segment.solarZones.push({
        x: x,
        y: 0,
        w: this.segmentWidth,
        h: this.segmentHeight * 0.7,
        active: true
      });
    }

    // Items (chatarra, baterías, memoria)
    const itemCount = Utils.random(2, 5);
    for (let i = 0; i < itemCount; i++) {
      const itemType = Math.random();
      let type;

      if (itemType < 0.6) {
        type = 'scrap'; // 60% chatarra
      } else if (itemType < 0.85) {
        type = 'battery'; // 25% batería
      } else {
        type = 'memory'; // 15% fragmento de memoria
      }

      segment.items.push({
        x: x + Utils.random(20, this.segmentWidth - 40),
        y: this.groundY - Utils.random(60, 400),
        w: 20, h: 20,
        type: type,
        collected: false,
        bobOffset: Math.random() * Math.PI * 2
      });
    }

    // Enemigos (solo en dificultad normal/hard)
    if (difficulty !== 'safe') {
      const enemyCount = difficulty === 'normal' ? Utils.random(0, 2) : Utils.random(1, 3);
      for (let i = 0; i < enemyCount; i++) {
        segment.enemies.push({
          x: x + Utils.random(50, this.segmentWidth - 100),
          y: this.groundY - Utils.random(30, 200),
          w: 35, h: 35,
          r: 18,
          type: 'drone',
          health: 20,
          maxHealth: 20,
          damage: 8,
          patrolLeft: x + 20,
          patrolRight: x + this.segmentWidth - 20,
          speed: 1 + Math.random() * 1.5,
          direction: 1,
          originX: x + Utils.random(50, this.segmentWidth - 100),
          patrolRange: Utils.random(50, 150),
          originY: this.groundY - Utils.random(30, 200),
          state: 'patrol',
          attackCooldown: 0,
          hitFlash: 0,
          animFrame: 0,
          animTimer: 0
        });
      }
    }

    this.segments.push(segment);
  }

  // Actualizar mundo (generar nuevos segmentos, eliminar viejos)
  update(playerX, cameraX) {
    // Calcular distancia total
    this.totalDistance = Math.max(this.totalDistance, playerX);

    // Generar nuevos segmentos ADELANTE DEL JUGADOR (no de la cámara)
    // Esto asegura que siempre haya 1200px de mundo visible adelante del jugador
    const viewAhead = playerX + 1200;
    while (this.nextSegmentX < viewAhead) {
      const difficulty = this.nextSegmentX < this.segmentWidth * 3 ? 'safe' :
                         Math.random() < 0.6 ? 'normal' : 'hard';
      this.generateSegment(this.nextSegmentX, difficulty);
      this.nextSegmentX += this.segmentWidth;
    }

    // Eliminar segmentos detrás del jugador (optimización)
    const viewBehind = playerX - 800;
    this.segments = this.segments.filter(seg => seg.x + seg.width > viewBehind);

    // Actualizar enemigos en el segmento
    this.segments.forEach(seg => {
      seg.enemies.forEach(enemy => {
        if (enemy.type === 'drone') {
          enemy.x += enemy.speed * enemy.direction;
          if (enemy.x >= enemy.patrolRight || enemy.x <= enemy.patrolLeft) {
            enemy.direction *= -1;
          }
        }
      });
    });

    this.lastPlayerX = playerX;
  }

  // Obtener todos los elementos visibles (optimizado)
  getVisiblePlatforms(cameraX, canvasWidth) {
    const visible = [];
    const margin = 200;

    this.segments.forEach(seg => {
      seg.platforms.forEach(plat => {
        const screenX = plat.x - cameraX;
        if (screenX + plat.w > -margin && screenX < canvasWidth + margin) {
          visible.push(plat);
        }
      });
    });

    return visible;
  }

  getVisibleItems(cameraX, canvasWidth) {
    const visible = [];
    const margin = 200;

    this.segments.forEach(seg => {
      seg.items.forEach(item => {
        if (!item.collected) {
          const screenX = item.x - cameraX;
          if (screenX + item.w > -margin && screenX < canvasWidth + margin) {
            visible.push(item);
          }
        }
      });
    });

    return visible;
  }

  getVisibleEnemies(cameraX, canvasWidth) {
    const visible = [];
    const margin = 300;

    this.segments.forEach(seg => {
      seg.enemies.forEach(enemy => {
        const screenX = enemy.x - cameraX;
        if (screenX + enemy.w > -margin && screenX < canvasWidth + margin) {
          visible.push(enemy);
        }
      });
    });

    return visible;
  }

  getVisibleOutlets(cameraX, canvasWidth) {
    const visible = [];
    const margin = 200;

    this.segments.forEach(seg => {
      seg.outlets.forEach(outlet => {
        const screenX = outlet.x - cameraX;
        if (screenX + outlet.w > -margin && screenX < canvasWidth + margin) {
          visible.push(outlet);
        }
      });
    });

    return visible;
  }

  getVisibleSolarZones(cameraX, canvasWidth) {
    const visible = [];
    const margin = 200;

    this.segments.forEach(seg => {
      seg.solarZones.forEach(zone => {
        const screenX = zone.x - cameraX;
        if (screenX + zone.w > -margin && screenX < canvasWidth + margin) {
          visible.push(zone);
        }
      });
    });

    return visible;
  }

  // Verificar si una posición está en zona de luz solar
  isInSolarZone(x, y) {
    return this.segments.some(seg =>
      seg.solarZones.some(zone =>
        x >= zone.x && x <= zone.x + zone.w &&
        y >= zone.y && y <= zone.y + zone.h
      )
    );
  }

  // Verificar colisión con enchufe (recarga)
  checkOutletCollision(playerX, playerY, playerR) {
    for (const seg of this.segments) {
      for (const outlet of seg.outlets) {
        if (Utils.circleRectCollision(
          { x: playerX, y: playerY, r: playerR },
          outlet
        )) {
          return outlet;
        }
      }
    }
    return null;
  }

  // Renderizar fondo (separado para que no dependa de cámara)
  renderBackground(ctx, camera) {
    ctx.save();

    // Cielo oscuro del vertedero
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    skyGrad.addColorStop(0, '#28282e');
    skyGrad.addColorStop(0.5, '#28282e');
    skyGrad.addColorStop(1, '#6c5671');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Estrellas/partículas (parallax muy lento)
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 40; i++) {
      const x = ((i * 137.5 - camera.x * 0.02) % ctx.canvas.width + ctx.canvas.width) % ctx.canvas.width;
      const y = (i * 97.3) % (ctx.canvas.height * 0.5);
      ctx.fillStyle = '#d9c8bf';
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.globalAlpha = 1;

    // Edificios lejanos (parallax medio)
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#6c5671';
    const buildingOffset = -(camera.x * 0.1) % 300;
    for (let x = buildingOffset; x < ctx.canvas.width + 300; x += 150) {
      const h = 80 + Math.floor((x * 0.7) % 120);
      ctx.fillRect(x, ctx.canvas.height - h - 60, 80, h);
      // Ventanas
      ctx.fillStyle = '#fff7a0';
      ctx.globalAlpha = 0.15 + Math.sin(Date.now() * 0.001 + x) * 0.1;
      for (let wy = ctx.canvas.height - h - 40; wy < ctx.canvas.height - 70; wy += 25) {
        for (let wx = x + 10; wx < x + 70; wx += 20) {
          if ((wx * wy) % 3 === 0) {
            ctx.fillRect(wx, wy, 8, 12);
          }
        }
      }
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = '#6c5671';
    }

    // Montañas de basura (parallax rápido)
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#28282e';
    const trashOffset = -(camera.x * 0.3) % 400;
    for (let x = trashOffset; x < ctx.canvas.width + 400; x += 200) {
      ctx.beginPath();
      ctx.moveTo(x, ctx.canvas.height - 60);
      ctx.quadraticCurveTo(
        x + 50, ctx.canvas.height - 180 - ((x * 0.5) % 50),
        x + 100, ctx.canvas.height - 60
      );
      ctx.fill();
    }

    ctx.restore();
  }

  // Renderizar elementos del mundo (sin fondo, dentro del translate de cámara)
  renderWithoutBackground(ctx, camera) {
    // Zonas de luz solar
    this.getVisibleSolarZones(camera.x, ctx.canvas.width).forEach(zone => {
      const sx = zone.x;
      const sy = zone.y;
      ctx.save();
      ctx.globalAlpha = 0.15;
      const gradient = ctx.createLinearGradient(sx, sy, sx, sy + zone.h);
      gradient.addColorStop(0, '#fff7a0');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(sx, sy, zone.w, zone.h);
      ctx.restore();
    });

    // Plataformas
    this.getVisiblePlatforms(camera.x, ctx.canvas.width).forEach(plat => {
      const sx = plat.x;
      const sy = plat.y;

      ctx.save();

      switch (plat.type) {
        case 'ground':
          const groundGrad = ctx.createLinearGradient(sx, sy, sx, sy + plat.h);
          groundGrad.addColorStop(0, '#6c5671');
          groundGrad.addColorStop(1, '#28282e');
          ctx.fillStyle = groundGrad;
          ctx.fillRect(sx, sy, plat.w, plat.h);
          ctx.fillStyle = '#d9c8bf';
          ctx.fillRect(sx, sy, plat.w, 3);
          // Basura en el suelo
          ctx.fillStyle = '#6c5671';
          for (let i = 0; i < 3; i++) {
            const dx = sx + ((i * 73 + plat.x) % (plat.w - 20)) + 10;
            const dy = sy + ((i * 47 + plat.x) % (plat.h - 10)) + 5;
            ctx.fillRect(dx, dy, Utils.random(5, 15), Utils.random(3, 8));
          }
          break;

        case 'platform':
          ctx.fillStyle = '#28282e';
          ctx.fillRect(sx, sy, plat.w, plat.h);
          ctx.fillStyle = '#b0a9e4';
          ctx.fillRect(sx, sy, plat.w, 3);
          ctx.fillStyle = '#6c5671';
          ctx.fillRect(sx + 5, sy + plat.h, 5, 8);
          ctx.fillRect(sx + plat.w - 10, sy + plat.h, 5, 8);
          break;

        case 'high-platform':
          ctx.fillStyle = '#28282e';
          ctx.fillRect(sx, sy, plat.w, plat.h);
          ctx.fillStyle = '#b3e3da';
          ctx.fillRect(sx, sy, plat.w, 3);
          break;

        case 'bridge':
          ctx.fillStyle = '#dea38b';
          ctx.fillRect(sx, sy, plat.w, plat.h);
          ctx.fillStyle = '#ffc384';
          ctx.fillRect(sx, sy, plat.w, 4);
          break;
      }

      ctx.restore();
    });

    // Enchufes
    this.getVisibleOutlets(camera.x, ctx.canvas.width).forEach(outlet => {
      const sx = outlet.x;
      const sy = outlet.y;

      ctx.save();
      ctx.fillStyle = '#28282e';
      ctx.fillRect(sx, sy, outlet.w, outlet.h);
      ctx.fillStyle = '#87a889';
      ctx.fillRect(sx + 2, sy + 2, outlet.w - 4, outlet.h - 4);
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', sx + outlet.w / 2, sy + outlet.h / 2 + 5);
      ctx.shadowColor = '#87a889';
      ctx.shadowBlur = 8 + Math.sin(Date.now() * 0.005) * 4;
      ctx.fillStyle = '#87a889';
      ctx.beginPath();
      ctx.arc(sx + outlet.w / 2, sy - 5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Items
    this.getVisibleItems(camera.x, ctx.canvas.width).forEach(item => {
      const sx = item.x;
      const sy = item.y + Math.sin(Date.now() * 0.003 + item.bobOffset) * 5;

      ctx.save();
      switch (item.type) {
        case 'scrap':
          ctx.fillStyle = '#b0a9e4';
          ctx.fillRect(sx, sy, item.w, item.h);
          ctx.fillStyle = '#fff7e4';
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('♻', sx + item.w / 2, sy + item.h / 2 + 4);
          break;
        case 'battery':
          ctx.fillStyle = '#b0eb93';
          ctx.fillRect(sx, sy, item.w, item.h);
          ctx.fillStyle = '#fff';
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('⚡', sx + item.w / 2, sy + item.h / 2 + 4);
          break;
        case 'memory':
          ctx.fillStyle = '#feaae4';
          ctx.fillRect(sx, sy, item.w, item.h);
          ctx.fillStyle = '#fff';
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('💾', sx + item.w / 2, sy + item.h / 2 + 4);
          break;
      }
      ctx.restore();
    });

    // Enemigos
    this.getVisibleEnemies(camera.x, ctx.canvas.width).forEach(enemy => {
      const sx = enemy.x;
      const sy = enemy.y;

      ctx.save();
      ctx.fillStyle = '#f98284';
      ctx.beginPath();
      ctx.arc(sx + enemy.w / 2, sy + enemy.h / 2, enemy.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('👾', sx + enemy.w / 2, sy + enemy.h / 2 + 5);
      ctx.restore();
    });
  }

  // Renderizar mundo (método original, ahora llama a los nuevos métodos)
  render(ctx, camera) {
    this.renderBackground(ctx, camera);
    this.renderWithoutBackground(ctx, camera);
  }
}

// Exponer World globalmente para debug
window.World = World;
