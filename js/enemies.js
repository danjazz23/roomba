// ============================================
// SISTEMA DE ENEMIGOS
// ============================================

class EnemySystem {
  constructor() {
    this.enemies = [];
    this.particles = [];
    this.onEnemyDeath = null;
  }

  // Spawn enemigos en el mundo
  spawnEnemies(worldWidth, worldHeight, difficulty = 1) {
    this.enemies = [];
    const count = Math.floor((worldWidth * worldHeight) / 80000 * difficulty);

    for (let i = 0; i < count; i++) {
      const x = Utils.random(300, worldWidth - 200);
      const y = Utils.random(100, worldHeight - 200);
      const type = Math.random() < 0.7 ? 'drone' : 'hostile';

      this.enemies.push({
        x, y,
        w: type === 'drone' ? 32 : 36,
        h: type === 'drone' ? 32 : 36,
        r: type === 'drone' ? 16 : 18,
        type,
        vx: 0,
        vy: 0,
        speed: type === 'drone' ? 1.5 : 1.0,
        health: type === 'drone' ? 20 : 35,
        maxHealth: type === 'drone' ? 20 : 35,
        damage: type === 'drone' ? 8 : 12,
        direction: Math.random() < 0.5 ? -1 : 1,
        patrolRange: Utils.random(100, 200),
        originX: x,
        originY: y,
        state: 'patrol', // patrol, chase, attack
        attackCooldown: 0,
        hitFlash: 0,
        animFrame: 0,
        animTimer: 0
      });
    }
  }

  // Actualizar enemigos
  update(dt, player, battery) {
    this.enemies.forEach(enemy => {
      // Solo actualizar si está cerca del jugador (optimización)
      const dist = Utils.dist(enemy.x, enemy.y, player.x, player.y);
      if (dist > 600) return;

      // Animación
      enemy.animTimer += dt;
      if (enemy.animTimer > 0.15) {
        enemy.animTimer = 0;
        enemy.animFrame = (enemy.animFrame + 1) % 8;
      }

      // Flash de daño
      if (enemy.hitFlash > 0) enemy.hitFlash -= dt * 5;

      // Cooldown de ataque
      if (enemy.attackCooldown > 0) enemy.attackCooldown -= dt;

      // IA según distancia
      if (dist < 200) {
        enemy.state = 'chase';
      } else if (dist > 350) {
        enemy.state = 'patrol';
      }

      switch (enemy.state) {
        case 'patrol':
          // Patrulla alrededor del punto origen
          enemy.x += enemy.speed * enemy.direction * dt * 60;
          if (Math.abs(enemy.x - enemy.originX) > enemy.patrolRange) {
            enemy.direction *= -1;
          }
          // Drone flota, hostil camina
          if (enemy.type === 'drone') {
            enemy.y = enemy.originY + Math.sin(Date.now() * 0.002) * 20;
          }
          break;

        case 'chase':
          // Perseguir al jugador
          const angle = Utils.angle(enemy.x, enemy.y, player.x, player.y);
          enemy.x += Math.cos(angle) * enemy.speed * 1.5 * dt * 60;
          enemy.y += Math.sin(angle) * enemy.speed * 1.5 * dt * 60;
          enemy.direction = Math.cos(angle) > 0 ? 1 : -1;

          // Atacar si está cerca
          if (dist < 50 && enemy.attackCooldown <= 0 && !battery.shieldActive) {
            const damage = Math.max(1, enemy.damage - (player.upgrades?.getDefenseMultiplier() ?? 1));
            battery.energy -= damage;
            enemy.attackCooldown = 1.5;
            enemy.hitFlash = 0.3;
            if (battery.onLowBattery) battery.onLowBattery();
          }
          break;

        case 'attack':
          if (enemy.attackCooldown <= 0) {
            enemy.state = 'chase';
          }
          break;
      }

      // Colisión con jugador (daño por impacto)
      if (Utils.circleCircleCollision(
        { x: player.x + player.w / 2, y: player.y + player.h / 2, r: player.w / 2 },
        { x: enemy.x + enemy.w / 2, y: enemy.y + enemy.h / 2, r: enemy.r }
      ) && !battery.shieldActive) {
        if (enemy.attackCooldown <= 0) {
          const damage = Math.max(1, enemy.damage * 0.5 - 2);
          battery.energy -= damage;
          enemy.attackCooldown = 1;
        }
      }
    });

    // Eliminar enemigos muertos y spawn particles
    const deadEnemies = this.enemies.filter(e => e.health <= 0);
    deadEnemies.forEach(enemy => {
      // Spawn partículas de explosión
      for (let i = 0; i < 15; i++) {
        this.particles.push(Utils.createParticle(
          enemy.x + enemy.w / 2,
          enemy.y + enemy.h / 2,
          { color: enemy.type === 'drone' ? K.blue : K.orange, vx: Utils.random(-4, 4), vy: Utils.random(-4, 4), life: 1.5, decay: 0.01 }
        ));
      }
      if (this.onEnemyDeath) this.onEnemyDeath(enemy);
    });
    this.enemies = this.enemies.filter(e => e.health > 0);

    // Actualizar partículas
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= p.decay;
    });
    this.particles = this.particles.filter(p => p.life > 0);
  }

  // Atacar enemigo (daño del jugador)
  attackEnemy(player, weaponLevel, segments) {
    let hit = false;
    // segments es un array de { enemies: [...] }, necesitamos aplanarlo
    const targets = segments ? segments.flatMap(s => s.enemies || []) : this.enemies;
    targets.forEach(enemy => {
      if (hit) return;
      const dist = Utils.dist(player.x, player.y, enemy.x, enemy.y);
      const range = weaponLevel === 0 ? 40 : weaponLevel === 1 ? 50 : 120;

      if (dist < range) {
        const weaponDamage = weaponLevel === 0 ? 15 : weaponLevel === 1 ? 25 : 40;
        const defense = player.upgrades?.getDefenseMultiplier() ?? 1;
        enemy.health -= weaponDamage / defense;
        enemy.hitFlash = 0.3;
        enemy.state = 'chase';

        // Partículas de impacto
        for (let i = 0; i < 5; i++) {
          this.particles.push(Utils.createParticle(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, { color: '#FFF', vx: Utils.random(-2, 2), vy: Utils.random(-3, -1) }));
        }
        hit = true;
      }
    });
    return hit;
  }

  // Renderizar enemigos
  render(ctx, camera) {
    // La cámara ya se aplicó con ctx.translate en game.js - no restar cámara de nuevo
    // Renderizar partículas
    this.particles.forEach(p => {
      const sx = p.x;
      const sy = p.y;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(sx - p.size / 2, sy - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;

    // Renderizar enemigos
    this.enemies.forEach(enemy => {
      const sx = enemy.x;
      const sy = enemy.y;

      // No renderizar si está fuera de pantalla
      if (sx < -100 || sx > ctx.canvas.width + 100 || sy < -100 || sy > ctx.canvas.height + 100) return;

      ctx.save();
      ctx.translate(sx + enemy.w / 2, sy + enemy.h / 2);

      // Flash de daño
      if (enemy.hitFlash > 0) {
        ctx.fillStyle = '#FFF';
        ctx.shadowColor = '#FFF';
        ctx.shadowBlur = 20;
      }

      if (enemy.type === 'drone') {
        // Drone hexagonal
        ctx.fillStyle = enemy.hitFlash > 0 ? '#FFF7E4' : K.blue;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = Math.cos(angle) * enemy.r;
          const py = Math.sin(angle) * enemy.r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Ojo del drone
        ctx.fillStyle = K.red;
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // Propulsor
        const propellerAnim = Math.sin(Date.now() * 0.02) * 3;
        ctx.fillStyle = K.blue;
        ctx.fillRect(-8, enemy.r - 2 + propellerAnim, 16, 4);
      } else {
        // Robot hostil
        ctx.fillStyle = enemy.hitFlash > 0 ? '#FFF7E4' : K.neutral;
        ctx.fillRect(-enemy.w / 2, -enemy.h / 2, enemy.w, enemy.h);

        // Placas oxidadas
        ctx.fillStyle = K.orange;
        ctx.fillRect(-enemy.w / 2 + 2, -enemy.h / 2 + 2, 8, 8);
        ctx.fillRect(enemy.w / 2 - 10, enemy.h / 2 - 10, 8, 8);

        // Ojo rojo
        ctx.fillStyle = K.red;
        ctx.shadowColor = K.red;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(enemy.direction * 5, -5, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Patas
        const legAnim = Math.sin(enemy.animFrame * Math.PI / 4) * 4;
        ctx.fillStyle = K.bgDeep;
        ctx.fillRect(-enemy.w / 2 + 4, enemy.h / 2, 6, 8 + legAnim);
        ctx.fillRect(enemy.w / 2 - 10, enemy.h / 2, 6, 8 - legAnim);
      }

      // Barra de vida
      if (enemy.health < enemy.maxHealth) {
        const barWidth = 40;
        const healthPct = enemy.health / enemy.maxHealth;
        ctx.fillStyle = K.bg;
        ctx.fillRect(-barWidth / 2, -enemy.r - 15, barWidth, 5);
        ctx.fillStyle = healthPct > 0.5 ? K.green : healthPct > 0.25 ? K.yellow : K.red;
        ctx.fillRect(-barWidth / 2, -enemy.r - 15, barWidth * healthPct, 5);
      }

      ctx.restore();
    });
  }

  // Actualizar un enemigo individual (para mundo infinito)
  updateEnemy(dt, enemy, player, battery) {
    const dist = Utils.dist(enemy.x, enemy.y, player.x, player.y);

    // Solo actualizar si está cerca del jugador
    if (dist > 600) return;

    // Animación
    enemy.animTimer += dt;
    if (enemy.animTimer > 0.15) {
      enemy.animTimer = 0;
      enemy.animFrame = (enemy.animFrame + 1) % 8;
    }

    // Flash de daño
    if (enemy.hitFlash > 0) enemy.hitFlash -= dt * 5;

    // Cooldown de ataque
    if (enemy.attackCooldown > 0) enemy.attackCooldown -= dt;

    // IA según distancia
    if (dist < 200) {
      enemy.state = 'chase';
    } else if (dist > 350) {
      enemy.state = 'patrol';
    }

    switch (enemy.state) {
      case 'patrol':
        enemy.x += enemy.speed * enemy.direction * dt * 60;
        if (Math.abs(enemy.x - enemy.originX) > enemy.patrolRange) {
          enemy.direction *= -1;
        }
        if (enemy.type === 'drone') {
          enemy.y = enemy.originY + Math.sin(Date.now() * 0.002) * 20;
        }
        break;

      case 'chase':
        const angle = Utils.angle(enemy.x, enemy.y, player.x, player.y);
        enemy.x += Math.cos(angle) * enemy.speed * 1.5 * dt * 60;
        enemy.y += Math.sin(angle) * enemy.speed * 1.5 * dt * 60;
        enemy.direction = Math.cos(angle) > 0 ? 1 : -1;

        if (dist < 50 && enemy.attackCooldown <= 0 && !battery.shieldActive) {
          const damage = Math.max(1, enemy.damage - (player.upgrades?.getDefenseMultiplier() ?? 1));
          battery.energy -= damage;
          enemy.attackCooldown = 1.5;
          enemy.hitFlash = 0.3;
          if (battery.onLowBattery) battery.onLowBattery();
        }
        break;

      case 'attack':
        if (enemy.attackCooldown <= 0) {
          enemy.state = 'chase';
        }
        break;
    }
  }

  // Verificar colisión de un enemigo con el jugador
  checkPlayerCollision(enemy, player, battery) {
    if (Utils.circleCircleCollision(
      { x: player.x + player.w / 2, y: player.y + player.h / 2, r: player.w / 2 },
      { x: enemy.x + enemy.w / 2, y: enemy.y + enemy.h / 2, r: enemy.r }
    ) && !battery.shieldActive) {
      if (enemy.attackCooldown <= 0) {
        const damage = Math.max(1, enemy.damage * 0.5 - 2);
        battery.energy -= damage;
        enemy.attackCooldown = 1;
      }
    }
  }
}
