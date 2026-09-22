// ============================================
// JUEGO PRINCIPAL — Game Loop y estado
// ============================================

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.renderer = new Renderer(this.canvas);
    this.battery = new BatterySystem(15); // Empieza con 15%
    this.upgrades = new UpgradeSystem();
    this.input = new InputSystem(this.canvas);
    this.world = new World();
    this.world.init(100); // Inicializar mundo antes del jugador
    
    // Crear cámara con las dimensiones FIJAS del juego (800x600), no del display
    this.camera = new Camera(this.renderer.gameWidth, this.renderer.gameHeight);
    // KISOU mide 48x40 (definido en kizou.js), groundY=520, así que Y=480
    this.player = new KISOU(100, this.world.groundY - 40);
    this.items = new ItemSystem();
    this.enemies = new EnemySystem();

    // Referencias a sistemas — siempre disponibles (incluso si el usuario pulsa Start antes de loadSprites)
    this.player.upgrades = this.upgrades;
    this.player.battery = this.battery;
    this.player.input = this.input;
    this.player.enemies = this.enemies;
    this.player.items = this.items;
    this.player.world = this.world;

    this.state = 'menu'; // menu, playing, paused, dead
    this.lastTime = 0;
    this.gameTime = 0;
    this.animationId = null;
    this.spritesLoaded = false;

    this.loadSprites();
  }

  async loadSprites() {
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout cargando sprites')), 5000));
      await Promise.race([Sprites.loadAll(), timeout]);
      console.log('✅ Sprites cargados correctamente');
    } catch (err) {
      console.warn('⚠️ Error o timeout cargando sprites, usando fallback:', err);
    }
    this.spritesLoaded = true;
    this.initWorld();
    this.setupEvents();
    this.render();
  }

  setupEvents() {
    // Resize
    window.addEventListener('resize', () => {
      this.renderer.resize();
      // NO recrear la cámara - mantener las dimensiones fijas del juego
    });

    // Botón inicio
    document.getElementById('btn-start').addEventListener('click', () => {
      this.start();
    });

    // Botón reiniciar
    document.getElementById('btn-restart').addEventListener('click', () => {
      this.restart();
    });

    document.getElementById('btn-restart-pause').addEventListener('click', () => {
      this.restart();
    });

    document.getElementById('btn-resume').addEventListener('click', () => {
      this.resume();
    });

    // Pausa con ESC
    window.addEventListener('game-pause', () => {
      if (this.state === 'playing') this.pause();
      else if (this.state === 'paused') this.resume();
    });

    // Toggle música con M
    window.addEventListener('keydown', (e) => {
      if (e.key === 'm' || e.key === 'M') {
        if (Sound.music.isPlaying) {
          Sound.music.stop();
        } else if (Sound.ctx) {
          Sound.music.start();
        }
      }
    });

    // Reinicio al morir (touch/click)
    this.canvas.addEventListener('click', () => {
      if (this.state === 'dead') this.restart();
    });
    this.canvas.addEventListener('touchstart', () => {
      if (this.state === 'dead') this.restart();
    });

    // Configurar callbacks
    this.battery.onLowBattery = () => {
      if (this.state === 'playing') Sound.playLowBattery();
    };

    this.battery.onDeath = () => {
      if (this.state === 'playing') this.die();
    };

    this.upgrades.onCollectScrap = (amount) => {
      Sound.playCollect();
    };

    this.upgrades.onCollectMemory = () => {
      Sound.playUpgrade();
    };

    this.upgrades.onUpgrade = (type, level) => {
      Sound.playUpgrade();
    };

    this.enemies.onEnemyDeath = (enemy) => {
      this.upgrades.collectScrap(5);
      this.camera.applyShake(0.5);
    };
  }

  initWorld() {
    this.world.init(100);
    // Colocar jugador SOBRE EL SUELO (no en plataformas flotantes)
    this.player.x = 100;
    this.player.y = this.world.groundY - this.player.h; // 520 - 40 = 480
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.onGround = true;
    this.player.state = 'idle';
    
    // Configurar referencias a sistemas
    this.player.upgrades = this.upgrades;
    this.player.battery = this.battery;
    this.player.input = this.input;
    this.player.enemies = this.enemies;
    this.player.items = this.items;
    this.player.world = this.world;
    
    // Centrar cámara en el jugador: jugador en 55% de la pantalla (ligeramente abajo)
    // camera.y = playerY - (playerYOnScreen) => 480 - 330 = 150
    this.camera.x = 0;
    this.camera.y = this.player.y - this.camera.canvasHeight * 0.55;
    this.camera.targetX = this.camera.x;
    this.camera.targetY = this.camera.y;
  }

  start() {
    // Inicializar audio
    Sound.init();
    Sound.music.init(Sound.ctx);

    // Iniciar música procedural retro
    Sound.music.start();

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('touch-controls').classList.remove('hidden');

    this.state = 'playing';
    this.lastTime = performance.now();
    this.gameTime = 0;
    this.loop();
  }

  pause() {
    this.state = 'paused';
    document.getElementById('pause-screen').classList.remove('hidden');
    Sound.music.stop();
  }

  resume() {
    this.state = 'playing';
    document.getElementById('pause-screen').classList.add('hidden');
    this.lastTime = performance.now();
    this.loop();
  }

  die() {
    this.state = 'dead';
    Sound.playDeath();
    this.camera.applyShake(1);
    Sound.music.stop();

    setTimeout(() => {
      document.getElementById('death-screen').classList.remove('hidden');
      document.getElementById('death-score').textContent = this.upgrades.scrap;
      document.getElementById('death-memory').textContent = this.upgrades.memoryFragments;
      document.getElementById('death-upgrades').textContent = this.upgrades.totalUpgrades;
    }, 1000);
  }

  restart() {
    this.state = 'menu';
    document.getElementById('death-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('pause-screen').classList.add('hidden');

    this.battery.reset(15);
    this.upgrades.reset();
    this.world.segments = [];
    this.world.nextSegmentX = 0;
    this.initWorld();
    this.camera.reset();

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // Loop principal
  loop() {
    if (this.state !== 'playing') return;

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05); // Cap a 50ms
    this.lastTime = now;
    this.gameTime += dt;

    this.update(dt);
    this.render();

    // Resetear triggers de teclas para el siguiente frame
    this.input.update();

    this.animationId = requestAnimationFrame(() => this.loop());
  }

  // Actualizar todo
  update(dt) {
    // 1. Batería (primero para que el jugador tenga energía disponible)
    this.battery.update(this.gameTime);

    // 2. Jugador (actualizar posición antes que la cámara)
    this.player.update(dt, this.world, this.camera);

    // 3. Mundo infinito (generar nuevos segmentos, eliminar viejos)
    this.world.update(this.player.x, this.camera.x);

    // 4. Cámara (después de que el jugador se haya movido)
    this.camera.update(this.player, this.world);

    // 5. Items
    this.items.update(dt);

    // 6. Colisiones con items (del mundo)
    const collected = [];
    this.world.segments.forEach(seg => {
      seg.items.forEach(item => {
        if (!item.collected && Utils.circleRectCollision(
          { x: this.player.x + this.player.w / 2, y: this.player.y + this.player.h / 2, r: this.player.w / 2 + 10 },
          item
        )) {
          item.collected = true;
          collected.push(item.type);
        }
      });
    });
    collected.forEach(type => {
      switch (type) {
        case 'scrap':
          this.upgrades.collectScrap(1);
          break;
        case 'battery':
          this.battery.recharge(15);
          break;
        case 'memory':
          this.upgrades.collectMemory();
          break;
        case 'solar':
          this.upgrades.installUpgrade('solar');
          break;
      }
    });

    // 7. Recarga en enchufe
    const outlet = this.world.checkOutletCollision(
      this.player.x + this.player.w / 2,
      this.player.y + this.player.h / 2,
      this.player.r
    );
    if (outlet) {
      this.battery.recharge(outlet.rechargeRate * dt * 60);
    }

    // 8. Enemigos (actualizar y verificar colisiones)
    const visibleEnemies = this.world.getVisibleEnemies(this.camera.x, this.renderer.gameWidth);
    visibleEnemies.forEach(enemy => {
      this.enemies.updateEnemy(dt, enemy, this.player, this.battery);
      this.enemies.checkPlayerCollision(enemy, this.player, this.battery);
    });
    // Eliminar enemigos muertos del mundo
    this.world.segments.forEach(seg => {
      seg.enemies = seg.enemies.filter(e => {
        if (e.health <= 0) {
          for (let i = 0; i < 15; i++) {
            this.enemies.particles.push(Utils.createParticle(
              e.x + e.w / 2, e.y + e.h / 2,
              { color: e.type === 'drone' ? K.blue : K.orange, vx: Utils.random(-4, 4), vy: Utils.random(-4, 4), life: 1.5, decay: 0.01 }
            ));
          }
          if (this.enemies.onEnemyDeath) this.enemies.onEnemyDeath(e);
          return false;
        }
        return true;
      });
    });
    // Limpiar partículas muertas
    this.enemies.particles = this.enemies.particles.filter(p => p.life > 0);
  }

  // Renderizar todo
  render() {
    this.renderer.clear();

    if (this.state === 'menu') {
      // Fondo animado del menú
      this.renderer.ctx.fillStyle = K.bg;
      this.renderer.ctx.fillRect(0, 0, this.renderer.gameWidth, this.renderer.gameHeight);

      // Partículas de fondo
      const ctx = this.renderer.ctx;
      for (let i = 0; i < 50; i++) {
        const x = (Date.now() * 0.02 + i * 73) % this.renderer.gameWidth;
        const y = (Date.now() * 0.01 + i * 47) % this.renderer.gameHeight;
        ctx.fillStyle = `rgba(56, 178, 172, ${0.1 + Math.sin(Date.now() * 0.001 + i) * 0.1})`;
        ctx.fillRect(x, y, 2, 2);
      }
      return;
    }

    if (this.state === 'dead') {
      this.renderer.renderDeathScreen(this.upgrades.scrap, this.upgrades.memoryFragments, this.upgrades.totalUpgrades);
      return;
    }

    // Fondo (dibujar ANTES del translate de cámara para que siempre ocupe la pantalla)
    this.world.renderBackground(this.renderer.ctx, this.camera);

    // Aplicar cámara
    this.renderer.ctx.save();
    this.camera.apply(this.renderer.ctx);

    // Mundo (sin fondo, ya dibujado arriba)
    this.world.renderWithoutBackground(this.renderer.ctx, this.camera);

    // Partículas de enemigos del mundo
    this.enemies.particles.forEach(p => {
      this.renderer.ctx.globalAlpha = p.life;
      this.renderer.ctx.fillStyle = p.color;
      this.renderer.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    this.renderer.ctx.globalAlpha = 1;

    // Jugador
    this.player.render(this.renderer.ctx, this.camera);

    this.renderer.ctx.restore();

    // HUD
    this.renderer.renderHUD(this.battery, this.upgrades);

    // Controles táctiles
    if (this.input.isMobile) {
      this.renderer.renderTouchControls(this.input);
    }

    // Pausa
    if (this.state === 'paused') {
      this.renderer.renderPauseMenu();
    }
  }
}

// Inicializar juego cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando juego...');
  try {
    window.game = new Game();
    console.log('✅ Game instancia creada, estado:', window.game.state);
  } catch (e) {
    console.error('❌ Error creando Game:', e);
    console.error(e.stack);
  }
});

// Capturar errores globales
window.addEventListener('error', (e) => {
  console.error('⚠️ Error global:', e.message, 'en', e.filename, ':', e.lineno);
  if (e.error) console.error(e.error.stack);
});
