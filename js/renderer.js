// ============================================
// RENDERER — Todo el renderizado en canvas
// ============================================

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    // Sistema de coordenadas interno FIJO 800x600
    this.gameWidth = 800;
    this.gameHeight = 600;
    this.scale = 1;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    // Mantener aspecto 4:3 dentro de la ventana
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const aspect = this.gameWidth / this.gameHeight;
    
    let displayW, displayH;
    if (winW / winH > aspect) {
      displayH = winH;
      displayW = displayH * aspect;
    } else {
      displayW = winW;
      displayH = displayW / aspect;
    }
    
    // Centrar en la ventana
    const offsetX = (winW - displayW) / 2;
    const offsetY = (winH - displayH) / 2;
    
    // Tamaño del canvas
    this.canvas.width = this.gameWidth;
    this.canvas.height = this.gameHeight;
    this.canvas.style.width = displayW + 'px';
    this.canvas.style.height = displayH + 'px';
    this.canvas.style.left = offsetX + 'px';
    this.canvas.style.top = offsetY + 'px';
    this.canvas.style.position = 'fixed';
    this.canvas.style.zIndex = '1';
    
    // NO hacer scale del context - usar coordenadas 800x600 directamente
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    this.width = displayW;
    this.height = displayH;
  }

  // Limpiar canvas
  clear() {
    this.ctx.fillStyle = K.bg;
    this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
  }

  // Renderizar HUD (barras, iconos)
  renderHUD(battery, upgrades) {
    const ctx = this.ctx;
    const status = battery.getStatus();

    // Barra de energía
    const barX = 20;
    const barY = 60;
    const barWidth = Math.min(200, this.gameWidth * 0.3);
    const barHeight = 16;

    // Fondo
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);

    // Barra
    ctx.fillStyle = K.bg;
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Contenido
    ctx.fillStyle = status.color;
    if (status.critical) {
      // Parpadeo en crítico
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
    }
    ctx.fillRect(barX, barY, barWidth * (status.percent / 100), barHeight);
    ctx.globalAlpha = 1;

    // Borde
    ctx.strokeStyle = K.bgDeep;
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Texto de porcentaje
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${status.percent}%`, barX + barWidth + 10, barY + 13);

    // Icono de energía
    ctx.fillText('⚡', barX - 30, barY + 13);

    // Score (chatarra)
    ctx.fillStyle = '#FFF';
    ctx.font = '14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`♻️ ${upgrades.scrap}`, this.gameWidth - 20, barY + 13);

    // Memoria fragments
    if (upgrades.memoryFragments > 0) {
      ctx.fillText(`🧠 ${upgrades.memoryFragments}`, this.gameWidth - 20, barY + 30);
    }

    // Indicador de zona
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '12px monospace';
    ctx.fillText('📍 VERTEDERO', this.gameWidth / 2, 30);

    // Indicador de batería baja
    if (status.low) {
      ctx.fillStyle = status.critical ? K.pink : K.red;
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.008) * 0.5;
      ctx.fillText('⚠️ BATERÍA BAJA ⚠️', this.gameWidth / 2, 60);
      ctx.globalAlpha = 1;
    }

    // Mejoras instaladas (esquina inferior derecha)
    if (upgrades.totalUpgrades > 0) {
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '11px monospace';
      let yPos = this.gameHeight - 20;
      Object.values(upgrades.upgrades).forEach(upg => {
        if (upg.level > 0) {
          ctx.fillText(`${upg.icon} ${upg.levels[upg.level]}`, this.gameWidth - 20, yPos);
          yPos -= 15;
        }
      });
    }
  }

  // Renderizar controles táctiles
  renderTouchControls(input) {
    if (!input.isMobile) return;

    const ctx = this.ctx;

    // Joystick visual
    const joystickZone = document.getElementById('joystick-zone');
    const rect = joystickZone.getBoundingClientRect();

    if (input.joystick.active) {
      // Base
      ctx.beginPath();
      ctx.arc(rect.left + rect.width / 2, rect.top + rect.height / 2, 40, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Stick
      ctx.beginPath();
      ctx.arc(input.joystick.currentX, input.joystick.currentY, 15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fill();
    }

    // Botones
    const buttons = [
      { id: 'btn-attack', color: K.red, label: '⚔️' },
      { id: 'btn-shield', color: K.teal, label: '🛡️' },
      { id: 'btn-turbo', color: K.orange, label: '🔥' }
    ];

    buttons.forEach(btn => {
      const el = document.getElementById(btn.id);
      const r = el.getBoundingClientRect();
      const isActive = btn.id === 'btn-attack' && input.buttons.attack ||
                       btn.id === 'btn-shield' && input.buttons.shield ||
                       btn.id === 'btn-turbo' && input.buttons.turbo;

      ctx.beginPath();
      ctx.arc(r.left + r.width / 2, r.top + r.height / 2, r.width / 2, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? btn.color : `${btn.color}80`;
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  // Renderizar pantalla de pausa
  renderPauseMenu() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSA', this.gameWidth / 2, this.gameHeight / 2 - 40);

    ctx.font = '18px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Presiona ESC para continuar', this.gameWidth / 2, this.gameHeight / 2 + 20);
  }

  // Renderizar pantalla de muerte
  renderDeathScreen(score, memory, upgrades) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

    ctx.textAlign = 'center';

    // Título
    ctx.fillStyle = K.red;
    ctx.font = 'bold 56px monospace';
    ctx.shadowColor = K.red;
    ctx.shadowBlur = 20;
    ctx.fillText('APAGADO', this.gameWidth / 2, this.gameHeight / 2 - 80);
    ctx.shadowBlur = 0;

    // Subtítulo
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '18px monospace';
    ctx.fillText('La energía se ha agotado...', this.gameWidth / 2, this.gameHeight / 2 - 40);

    // Estadísticas
    ctx.fillStyle = '#FFF';
    ctx.font = '16px monospace';
    ctx.fillText(`Chatarra recogida: ${score}`, this.gameWidth / 2, this.gameHeight / 2 + 10);
    ctx.fillText(`Fragmentos de memoria: ${memory}`, this.gameWidth / 2, this.gameHeight / 2 + 35);
    ctx.fillText(`Mejoras instaladas: ${upgrades}`, this.gameWidth / 2, this.gameHeight / 2 + 60);

    // Reinicio
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '14px monospace';
    ctx.fillText('Toca para reiniciar', this.gameWidth / 2, this.gameHeight / 2 + 110);
  }
}
