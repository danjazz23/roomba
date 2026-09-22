// ============================================
// SPRITE MANAGER — Carga y animación de spritesheets PNG
// ============================================

class SpriteManager {
  constructor() {
    this.spritesheets = {}; // spritesheets principales
    this.frames = {};       // frames individuales (idle_01.png, etc.)
    this.frameCache = {};   // imágenes cargadas
    this.loading = false;
  }

  // Método principal para cargar sprites (llamado por game.js como loadAll)
  async loadAll(spriteList) {
    return new Promise((resolve) => {
      this.loadSprites(spriteList).then(resolve);
    });
  }

  // Cargar spritesheets principales
  async loadSprites(spriteList) {
    const defaults = ['idle', 'move-slow', 'move-fast', 'turbo', 
                      'damaged', 'attack', 'shield', 'dead', 'jump'];
    const names = spriteList ? spriteList.map(([_, path]) => path.split('/').pop().replace('.png', '')) : defaults;
    
    for (const name of names) {
      await this._loadSprite(name);
    }
    
    console.log(`🤖 ${Object.keys(this.spritesheets).length} sprites cargados`);
  }

  // Cargar un sprite (spritesheet 512x512 con grid 8x8 de 64px)
  async _loadSprite(name) {
    const path = `assets/sprites/${name}.png`;
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Los spritesheets son 512x512 con grid 8x8 (64px por frame)
        // Extraemos el frame 0 y lo escalamos al tamaño que necesitemos
        const frame0X = 0;
        const frame0Y = 0;
        const frameW = 64;
        const frameH = 64;
        const cols = img.width / 64;
        const rows = img.height / 64;
        
        // Crear un canvas con el frame 0 a tamaño completo del juego
        const displayW = 48;
        const displayH = 40;
        const canvas = document.createElement('canvas');
        canvas.width = displayW;
        canvas.height = displayH;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, frame0X, frame0Y, frameW, frameH, 0, 0, displayW, displayH);
        
        this.spritesheets[name] = {
          image: img,
          canvas: canvas,
          width: displayW,
          height: displayH,
          frameWidth: frameW,
          frameHeight: frameH,
          cols: cols,
          rows: rows,
          currentFrame: 0,
          fps: 8,
          frameTimer: 0,
          animating: true
        };
        
        console.log(`✅ Sprite cargado: ${name} (${img.width}x${img.height} → ${displayW}x${displayH})`);
        resolve();
      };
      img.onerror = () => {
        console.warn(`⚠️ No se pudo cargar ${path}`);
        this.spritesheets[name] = null;
        resolve();
      };
      img.src = path;
    });
  }

  // Crear placeholder si falla la carga
  _createPlaceholder(name) {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    const colors = {
      idle: '#b3e3da', 'move-slow': '#b3e3da', 'move-fast': '#b3e3da',
      turbo: '#accce4', damaged: '#f98284', attack: '#f98284',
      shield: '#b3e3da', dead: '#6c5671', jump: '#b3e3da'
    };
    
    ctx.fillStyle = colors[name] || '#b3e3da';
    ctx.fillRect(0, 0, 48, 40);
    ctx.strokeStyle = colors[name] || '#b3e3da';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 44, 36);
    
    ctx.fillStyle = colors[name] || '#b3e3da';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('●', 24, 20);
    
    return {
      image: canvas,
      width: 48,
      height: 40,
      cols: 1,
      rows: 1,
      frameWidth: 48,
      frameHeight: 40,
      totalFrames: 1,
      animFrames: 1,
      currentFrame: 0,
      fps: 1,
      placeholder: true
    };
  }

  // Actualizar animación
  updateAnimation(name, dt) {
    const sheet = this.spritesheets[name];
    if (!sheet) return;
    
    if (sheet.animating) {
      sheet.frameTimer += dt;
      if (sheet.frameTimer >= 1 / sheet.fps) {
        sheet.frameTimer = 0;
        sheet.currentFrame = (sheet.currentFrame + 1) % sheet.rows;
      }
    }
  }

  // Obtener sprite por nombre (usado por kizou.js y world.js)
  get(name) {
    const sheet = this.spritesheets[name];
    if (!sheet) return null;
    return sheet.canvas;
  }

  // Obtener frame actual como sub-imagen
  getFrame(name, width, height) {
    const sheet = this.spritesheets[name];
    if (!sheet) return null;
    
    if (width !== sheet.canvas.width || height !== sheet.canvas.height) {
      // Escalar frame al tamaño solicitado
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(sheet.canvas, 0, 0, width, height);
      return canvas;
    }
    
    return sheet.canvas;
  }

  // Dibujar sprite (usado por kizou.js)
  draw(ctx, name, x, y, w, h, flipX = false) {
    const sheet = this.spritesheets[name];
    if (!sheet) return;
    
    ctx.save();
    
    if (flipX) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      ctx.drawImage(sheet.canvas, 0, 0, w, h);
    } else {
      ctx.drawImage(sheet.canvas, x, y, w, h);
    }
    
    ctx.restore();
  }

  // Dibujar frame específico (sin animación)
  drawFrame(ctx, name, frameIndex, x, y, width, height, flipX = false) {
    const sheet = this.spritesheets[name];
    if (!sheet) return;
    
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext('2d');
    offCtx.imageSmoothingEnabled = true;
    offCtx.imageSmoothingQuality = 'high';
    
    const sx = (frameIndex % sheet.cols) * sheet.frameWidth;
    const sy = Math.floor(frameIndex / sheet.cols) * sheet.frameHeight;
    
    offCtx.drawImage(sheet.image, sx, sy, sheet.frameWidth, sheet.frameHeight, 0, 0, width, height);
    
    ctx.save();
    
    if (flipX) {
      ctx.translate(x + width, y);
      ctx.scale(-1, 1);
      ctx.drawImage(offscreen, 0, 0, width, height);
    } else {
      ctx.drawImage(offscreen, x, y, width, height);
    }
    
    ctx.restore();
  }
}

// Instancia global
const Sprites = new SpriteManager();
