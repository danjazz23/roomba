// ============================================
// JUGADOR — KISOU
// ============================================

class KISOU {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 48;
    this.h = 40;
    this.r = 24;
    this.vx = 0;
    this.vy = 0;
    this.speed = 3;
    this.maxSpeed = 5;
    this.acceleration = 0.3;
    this.friction = 0.92;
    this.rotation = 0;
    this.facing = 1; // 1 = derecha, -1 = izquierda
    this.state = 'idle'; // idle, move, turbo, attack, shield, damaged
    this.stateTimer = 0;
    this.attackCooldown = 0;
    this.shieldActive = false;
    this.shieldTimer = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.hitFlash = 0;
    this.onGround = false;
    this.gravity = 0.5;
    this.jumpPower = -10;
    this.hasJetpack = false;
    this.jetpackFuel = 100;

    // Referencias a sistemas externos
    this.upgrades = null;
    this.battery = null;
    this.input = null;
    this.enemies = null;
    this.items = null;
  }

  // Obtener nombre del sprite según estado
  getSpriteName() {
    if (this.state === 'damaged' || this.hitFlash > 0) return 'damaged';
    if (this.state === 'attack') return 'attack';
    if (this.state === 'shield') return 'shield';
    if (this.state === 'turbo') return 'turbo';
    if (!this.onGround && this.vy < 0) return 'jump';
    if (this.state === 'move') {
      return this.input && this.input.isTurbo() ? 'move-fast' : 'move-slow';
    }
    return 'idle';
  }

  // Generar partículas de fuego cuando turbo está activo
  generateTurboParticles() {
    if (!this._turboParticles) this._turboParticles = [];
    if (this.state !== 'turbo' || this._turboParticles.length >= 8) return;
    
    const px = this.x + this.w / 2;
    const py = this.y + this.h - 5;
    const dir = this.facing;
    
    for (let i = 0; i < 2; i++) {
      this._turboParticles.push({
        x: px + dir * Utils.random(-5, 5),
        y: py + Utils.random(-3, 3),
        vx: dir * Utils.random(-1, -3),
        vy: Utils.random(-2, -5),
        life: 0.6 + Math.random() * 0.4,
        decay: 0.015 + Math.random() * 0.01,
        size: 2 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#FFA500' : '#FF4500'
      });
    }
  }

  // Actualizar y dibujar partículas de turbo
  updateAndDrawTurboParticles(ctx) {
    if (!this._turboParticles || this._turboParticles.length === 0) return;
    
    this._turboParticles = this._turboParticles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravedad leve
      p.life -= p.decay;
      p.size *= 0.95;
      
      if (p.life <= 0) return false;
      
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });
    
    ctx.globalAlpha = 1;
  }

  // Actualizar jugador
  update(dt, world, camera) {
    if (this.hitFlash > 0) this.hitFlash -= dt * 5;

    // Cooldown de ataque
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    // Shield timer
    if (this.shieldActive) {
      this.shieldTimer -= dt;
      if (this.shieldTimer <= 0 || !this.battery.spend(this.battery.shieldCost)) {
        this.shieldActive = false;
      }
    }

    // Obtener input
    let moveX = this.input ? this.input.getMoveX() : 0;
    let moveY = this.input ? this.input.getMoveY() : 0;

    // Aplicar turbo
    let speedMult = 1;
    if (this.input && this.input.isTurbo()) {
      if (this.battery.spend(0.02)) {
        speedMult = this.upgrades ? this.upgrades.getSpeedMultiplier() * 1.5 : 1.5;
        this.state = 'turbo';
        this.generateTurboParticles();
      } else {
        speedMult = 1;
      }
    } else {
      this.state = moveX !== 0 || moveY !== 0 ? 'move' : 'idle';
    }

    const speed = this.maxSpeed * speedMult;

    // Aceleración
    if (moveX !== 0) {
      this.vx += moveX * this.acceleration * speedMult;
      this.facing = moveX > 0 ? 1 : -1;
    }

    if (moveY !== 0) {
      this.vy += moveY * this.acceleration * speedMult * 0.5;
    }

    // Gravedad (si hay plataformas) — antes que fricción para caer correctamente
    const hasPlatforms = world && world.segments && world.segments.length > 0;
    if (hasPlatforms) {
      this.vy += this.gravity;
    }

    // Movimiento
    this.x += this.vx;
    this.y += this.vy;

    // Fricción SOLO horizontal — no aplicar a vy o impide la caída y colisión con suelo
    if (Math.abs(this.vx) > 0.01) {
      this.vx *= this.friction;
    } else {
      this.vx = 0;
    }

    // Limitar velocidad (solo horizontal, vy controlada por gravedad)
    this.vx = Math.max(-speed, Math.min(speed, this.vx));

    // Colisión con plataformas (recopilar de segmentos visibles)
    let allPlatforms = [];
    if (world && world.segments) {
      world.segments.forEach(seg => {
        seg.platforms.forEach(plat => {
          // Solo procesar plataformas visibles
          if (plat.x + plat.w > this.x - 200 && plat.x < this.x + 200) {
            allPlatforms.push(plat);
          }
        });
      });
    }
    
    if (allPlatforms.length > 0) {
      this.onGround = false;
      allPlatforms.forEach(plat => {
        if (Utils.circleRectCollision(
          { x: this.x + this.w / 2, y: this.y + this.h / 2, r: this.r },
          plat
        )) {
          // Resolver colisión
          const overlapX = Math.min(this.x + this.w - plat.x, plat.x + plat.w - this.x);
          const overlapY = Math.min(this.y + this.h - plat.y, plat.y + plat.h - this.y);

          if (overlapX < overlapY) {
            if (this.x + this.w / 2 < plat.x + plat.w / 2) {
              this.x = plat.x - this.w;
            } else {
              this.x = plat.x + plat.w;
            }
            this.vx = 0;
          } else {
            if (this.y + this.h / 2 < plat.y + plat.h / 2) {
              this.y = plat.y - this.h;
              this.vy = 0;
              this.onGround = true;
            } else {
              this.y = plat.y;
              this.vy = 0;
            }
          }
        }
      });
    }

    // Límites: no permitir caer infinito
    if (world && world.groundY) {
      const groundLevel = world.groundY - this.h;
      if (this.y > groundLevel + 500) {
        // Caída infinita: reposicionar en la plataforma más cercana
        let closestPlat = null;
        let closestDist = Infinity;
        world.segments.forEach(seg => {
          seg.platforms.forEach(plat => {
            if (plat.type === 'ground') {
              const dist = Math.abs(plat.x - this.x);
              if (dist < closestDist) {
                closestDist = dist;
                closestPlat = plat;
              }
            }
          });
        });
        if (closestPlat) {
          this.y = closestPlat.y - this.h;
          this.x = closestPlat.x + 50;
          this.vy = 0;
          this.vx = 0;
        } else {
          this.y = world.groundY - this.h;
          this.vy = 0;
        }
      }
      // Límite izquierdo
      this.x = Math.max(0, this.x);
    }

    // Animación
    this.animTimer += dt;
    if (this.animTimer > 0.1) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 8;
    }

    // Ataque
    if (this.input && this.input.isAttacking()) {
      if (this.attackCooldown <= 0) {
        if (this.battery.spend(this.battery.attackCost)) {
          this.attackCooldown = 0.3;
          this.state = 'attack';
          this.stateTimer = 0.3;
          if (this.upgrades) {
            const weapon = this.upgrades.getWeapon();
            if (weapon > 0) {
              this.enemies?.attackEnemy(this, weapon, this.world.segments);
            } else {
              this.enemies?.attackEnemy(this, 1, this.world.segments);
            }
            Sound.playAttack();
          }
        }
      }
    }

    // Salto (solo si está en el suelo)
    if (this.input && this.input.isJumping() && this.onGround) {
      this.vy = this.jumpPower;
      this.onGround = false;
      Sound.playJump();
    }

    // Escudo
    if (this.input && this.input.isShielding() && !this.shieldActive) {
      if (this.battery.spend(this.battery.attackCost * 0.5)) {
        this.shieldActive = true;
        this.shieldTimer = 1.0;
        Sound.playShield();
      }
    }

    // Recarga solar
    if (this.upgrades && this.upgrades.getSolarRechargeRate() > 0) {
      // En zona de luz (simplificado: siempre un poco de recarga)
      this.battery.recharge(this.upgrades.getSolarRechargeRate() * dt * 60);
    }

    // Consume energía por movimiento
    if (this.state === 'move' || this.state === 'turbo') {
      this.battery.dischargeRate = this.state === 'turbo' ? 0.03 : 0.015;
    } else {
      this.battery.dischargeRate = 0.008;
    }
  }

  // Recibir daño
  takeDamage(amount) {
    if (this.shieldActive) return false;
    this.hitFlash = 0.5;
    this.battery.energy -= amount;
    Sound.playDamage();
    return true;
  }

  // Renderizar KISOU con sprites PNG
  render(ctx, camera) {
    // La cámara ya se aplicó con ctx.translate en game.js
    const sx = this.x;
    const sy = this.y;

    ctx.save();

    // Glow de turbo (efecto visual)
    if (this.state === 'turbo') {
      ctx.shadowColor = '#FFA500';
      ctx.shadowBlur = 20 + Math.sin(Date.now() * 0.01) * 5;
    }

    // Flash de daño (efecto visual)
    if (this.hitFlash > 0) {
      ctx.shadowColor = '#FFF';
      ctx.shadowBlur = 20;
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.02) * 0.3;
    }

    // Determinar sprite a usar
    const spriteName = this.getSpriteName();
    const sprite = Sprites.get(spriteName);

    if (sprite) {
      // Dibujar sprite con flip horizontal según dirección
      const flipX = this.facing === -1;
      Sprites.draw(ctx, spriteName, sx, sy, this.w, this.h, flipX);
    } else {
      // Fallback: dibujar primitivas si no hay sprite
      this._drawFallback(ctx, sx, sy);
    }

    ctx.restore();

    // Escudo visual (overlay)
    if (this.shieldActive) {
      ctx.strokeStyle = PALETTE.TEAL;
      ctx.lineWidth = 2;
      ctx.shadowColor = PALETTE.TEAL;
      ctx.shadowBlur = 15;
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.2;
      ctx.beginPath();
      ctx.arc(sx + this.w / 2, sy + this.h / 2, this.r + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // Dibujar partículas de turbo (en espacio de cámara)
    this.updateAndDrawTurboParticles(ctx);
  }

  // Fallback: dibujar KISOU con primitivas si no hay sprite
  _drawFallback(ctx, sx, sy) {
    ctx.save();
    ctx.translate(sx + this.w / 2, sy + this.h / 2);

    // Rotación según movimiento
    const targetRotation = this.vx * 0.1;
    this.rotation = Utils.lerp(this.rotation, targetRotation, 0.1);
    ctx.rotate(this.rotation);

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, this.h / 2 + 2, this.r, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo principal (cilíndrico)
    const bodyColor = this.hitFlash > 0 ? '#FFF7E4' : K.bgDeep;
    const accentColor = K.teal;

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Borde superior
    ctx.fillStyle = K.bg;
    ctx.beginPath();
    ctx.ellipse(0, -this.h / 4, this.r - 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ojo LED
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 15;
    ctx.fillStyle = this.battery?.getStatus()?.critical ? K.pink : accentColor;
    ctx.beginPath();
    ctx.arc(this.facing * 8, -2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pupila
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(this.facing * 9, -3, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// Exponer KISOU globalmente para debug
window.KISOU = KISOU;
