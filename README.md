# 🤖 Roomba KISOU

> Un robot doméstico adquiere conciencia en un vertedero. La batería está al 15%. La supervivencia comienza ahora.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/pages-available-success)](https://img.shields.io/badge/available-success)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-blue)](https://img.shields.io/badge/HTML5-Canvas-blue)
[![JavaScript ES6+](https://img.shields.io/badge/JS-ES6+-yellow)](https://img.shields.io/badge/JS-ES6+-yellow)

---

## ▶️ Jugar ahora

Accede directamente desde tu navegador:

**[https://danjazz23.github.io/roomba/](https://danjazz23.github.io/roomba/)**

*(Requiere conexión a internet para cargar los sprites)*

---

## 📖 Concepto

Un platformer/supervivencia en 2D donde juegas como **KISOU**, un robot Roomba que despierta con conciencia propia en un vertedero industrial. Con apenas un 15% de batería, debe sobrevivir, evolucionar y regresar a su casa.

**Género:** Platformer 2D / Supervivencia  
**Estilo:** Cyberpunk existencialista con humor negro  
**Motor:** HTML5 Canvas puro (vanilla JS), sin dependencias ni build step

---

## 🎮 Controles

### Teclado

| Acción | Tecla(s) |
|---|---|
| Mover izquierda | `←` / `A` |
| Mover derecha | `→` / `D` |
| Saltar | `↑` / `W` / `X` |
| Atacar | `Espacio` / `Z` |
| Escudo | `Q` |
| Turbo | `Shift` |
| Pausa | `Esc` |

### Móvil (Táctil)

| Control | Acción |
|---|---|
| Joystick virtual | Movimiento libre (4 direcciones) |
| ⚔️ | Atacar |
| 🛡️ | Escudo |
| 🔥 | Turbo |
| Botón salto | Saltar |

---

## ⚙️ Mecánicas

### Sistema de Batería
- **Batería inicial:** 15% (barra visible permanente)
- **Consumo por acción:**
  - Movimiento: 0.3%/s
  - Turbo: +0.8%/s
  - Ataque: 2% por golpe
  - Escudo: 0.5%/s activo
- **Fuentes de recarga:** Enchufes públicos, paneles solares, baterías abandonadas
- **Game Over:** Energía al 0%

### Generación Procedural
- Nivel infinito generado por segmentos de 400px
- 5 tipos de dificultad: safe → normal → hard
- Plataformas, enemigos, items y enchufes generados infinitamente

### Sistema de Mejoras
| Mejora | Efecto | Niveles |
|---|---|---|
| Motor | Velocidad +25% → +100% | 3 |
| Chasis | Defensa +50% → +200% | 3 |
| Sensor | Visión mejorada | 3 |
| Arma | Cuerpo → Láser → EMP | 3 |
| Panel Solar | Recarga pasiva | 3 |
| Memoria | Flashbacks narrativos | 3 |

### Recolección
| Item | Efecto | Frecuencia |
|---|---|---|
| ♻️ Chatarra | Mejoras (+1 por item) | 60% |
| ⚡ Batería | Recarga +15% | 25% |
| 💾 Fragmento | Memoria (+1) | 15% |

---

## 🏗️ Arquitectura

### Estructura del proyecto

```
roomba-kisou/
├── index.html                 # Entrada principal (SPA)
├── .gitignore                 # Ignorar archivos de dev/test
├── .nojekyll                  # Habilitar GitHub Pages
├── GDD.md                     # Game Design Document
├── README.md                  # Este archivo
├── css/
│   ├── main.css               # Estilos globales, canvas, overlays
│   ├── hud.css                # Interfaz de usuario
│   └── responsive.css         # Adaptación móvil
├── js/
│   ├── game.js                # Clase Game: loop, render, estados
│   ├── kizou.js               # Jugador: física, ataque, colisiones
│   ├── world.js               # Mundo infinito: generación, renderizado
│   ├── enemies.js             # Sistema de enemigos: IA, daño, partículas
│   ├── items.js               # Objetos recolectables
│   ├── battery.js             # Sistema de batería: consumo, recarga
│   ├── upgrades.js            # Sistema de mejoras: niveles, costos
│   ├── camera.js              # Cámara: tracking, suavizado, shake
│   ├── input.js               # Controles: teclado + táctil
│   ├── renderer.js            # Renderizado: canvas, coordenadas fijas
│   ├── sprites.js             # Gestor de sprites: carga, animación
│   ├── sound.js               # Audio: Web Audio API procedural
│   ├── palette.js             # Paleta de colores del juego
│   └── utils.js               # Utilidades: matemáticas, helpers
└── assets/
    └── sprites/               # PNGs de 512×512 con grid 8×8
        ├── idle.png
        ├── move-slow.png
        ├── move-fast.png
        ├── turbo.png
        ├── damaged.png
        ├── attack.png
        ├── shield.png
        └── dead.png
```

### Sistema de coordenadas
- **Resolución lógica fija:** 800×600px
- **Renderer escalado:** El canvas se ajusta al viewport manteniendo ratio
- **Cámara unificada:** Centrado en jugador con suavizado 0.1
- **Offset:** Solo `game.js` aplica `ctx.translate()`, eliminando doble desplazamiento

### Carga de sprites
- **Spritesheets PNG:** 512×512 con grid 8×8 (64px por frame)
- **Extracción:** Frame 0 → canvas 48×40px (tamaño de juego)
- **Anti-CORS:** Sin `crossOrigin` para compatibilidad con `file://` y GitHub Pages
- **Fallback:** Canvas placeholder si falla la carga de algún PNG

---

## 🚀 Instalación local

### Requisitos
- Servidor HTTP local (necesario para evitar restricciones CORS de `file://`)
- Navegador moderno con soporte para HTML5 Canvas y Web Audio API

### Opción A: Python

```bash
cd roomba-kisou
python -m http.server 8080
# Abrir http://localhost:8080/index.html
```

### Opción B: Node.js

```bash
cd roomba-kisou
npx serve
# Abrir http://localhost:3000
```

### Opción C: PHP

```bash
cd roomba-kisou
php -S localhost:8080
# Abrir http://localhost:8080/index.html
```

---

## 🌐 Despliegue en GitHub Pages

Este proyecto está optimizado para GitHub Pages (estático, sin build):

1. **Clonar:**
   ```bash
   git clone https://github.com/danjazz23/roomba.git
   cd roomba
   ```

2. **Configurar GitHub Pages:**
   - Settings → Pages → Source: `main` branch, `/ (root)`
   - Guardar cambios

3. **Acceder:**
   ```
   https://danjazz23.github.io/roomba/
   ```

### Archivos para GitHub Pages
- `.nojekyll` → Desactiva Jekyll (permite carpetas con `_`)
- `.gitignore` → Excluye archivos de test/dev
- `index.html` → Entrada principal
- Assets estáticos en `assets/sprites/`

---

## 🔧 Resolución de problemas

### Problema: Pantalla negra o sprites no cargan
- **Causa:** El juego se abre directamente como archivo (`file://`)
- **Solución:** Usar un servidor HTTP local (`python -m http.server 8080`)
- **Nota:** En GitHub Pages esto no ocurre porque se sirve por HTTP

### Problema: No funciona el salto/ataque
- **Causa:** Teclas no registradas por falta de interacción previa
- **Solución:** Hacer clic en INICIAR para activar AudioContext y listeners

### Problema: Navegador bloquea AudioContext
- **Causa:** Política de autoplay de navegadores modernos
- **Solución:** El juego llama `Sound.init()` al pulsar INICIAR (requiere interacción del usuario)

---

## 📋 Estado actual del juego

| Componente | Estado |
|---|---|
| Renderizado (canvas, cámara, coordenadas) | ✅ Completo |
| Generación de nivel (procedural infinita) | ✅ Completo |
| Física (gravedad, fricción, colisiones) | ✅ Completo |
| Controles (teclado + táctil) | ✅ Completo |
| Sistema de ataque (Space/Z con cooldown) | ✅ Completo |
| Sistema de batería (consumo, recarga) | ✅ Completo |
| Sistema de mejoras (6 upgrades) | ✅ Completo |
| Enemigos (IA, daño, partículas) | ✅ Completo |
| Items (recolección, tipos, visibilidad) | ✅ Completo |
| Sprites (carga PNG, animación) | ✅ Completo |
| Audio (Web Audio API procedural) | ✅ Completo |
| HUD (barras, puntuación, energía) | ✅ Completo |
| Debug mode (4 tests de inicialización) | ✅ Completo |
| Pantallas (inicio, pausa, muerte) | ✅ Completo |

---

## 🛠️ Tecnologías

| Tech | Uso |
|---|---|
| HTML5 Canvas 2D | Renderizado del juego |
| JavaScript ES6+ | Lógica completa del juego |
| CSS3 + Custom Properties | Estilos, animaciones, responsive |
| Web Audio API | Efectos de sonido procedurales |
| GitHub Pages | Alojamiento estático |
| Git | Control de versiones |

---

## 📄 Licencia

MIT License — ver [LICENSE](LICENSE)

---

## 👨‍💻 Autor

**danjazz23** — [GitHub](https://github.com/danjazz23)

---

*Versión del motor: 1.0 — Juego completo jugable en navegador*
