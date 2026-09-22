# Roomba KISOU — Game Design Document

> *Un robot doméstico adquiere conciencia en un vertedero. La batería está al 3%. La supervivencia comienza ahora.*

---

## 1. CONCEPTO

### Elevator Pitch
Un platformer/supervivencia en 2D donde juegas como **KISOU**, un robot Roomba que despierta con conciencia propia en un vertedero industrial. Con apenas un 3% de batería, debe sobrevivir, evolucionar y regresar a su casa — su destino original.

### Tema y Narrativa
- **Género narrativo**: Cyberpunk existencialista con humor negro
- **Arco del protagonista**: De máquina doméstica ignorada a entidad consciente que lucha por su derecho a existir
- **Ambientación**: Vertedero → Callejones urbanos → Zona industrial → Ciudad → Casa de origen
- **Tono**: Melancólico pero con momentos de humor y determinación

### Objetivos del Jugador
1. **Cortoplazo**: Sobrevivir, recargar batería, escapar del vertedero
2. **Medio plazo**: Tunear KISOU, enfrentar amenazas urbanas
3. **Largo plazo**: Llegar a la "Casa de Origen" — clímax emocional del juego

---

## 2. MECÁNICAS CORE

### 2.1 Sistema de Batería (Core Loop)
```
[ENERGÍA] → Limita acciones → Busca fuentes de energía → Continúa
```

- **Barra de energía**: Visible permanentemente (HUD)
- **Regeneración pasiva**: Extremadamente lenta (~1% cada 30s)
- **Consumo por acción**:
  - Movimiento: 0.3%/s
  - Turbo: +0.8%/s
  - Ataque: +2% por golpe
  - Defensa activada: +0.5%/s
- **Fuentes de recarga**:
  - Enchufes públicos (recarga rápida)
  - Paneles solares (recarga gradual, requiere luz)
  - Baterías abandonadas (objetos coleccionables)
  - Robot amigos que comparten energía
- **Game Over**: Energía al 0% → KISOU se apaga → Checkpoint anterior

### 2.2 Movimiento
- **Rotación 360°**: KISOU rueda en cualquier dirección
- **Inercia**: Simulación física realista (peso de robot doméstico)
- **Aceleración progresiva**: Arranca lento, acelera
- **Frenado de emergencia**: Para brusco con derrape
- **Saltos/Impulsos**: Solo tras adquirir mejoras

### 2.3 Sistema de Mejoras (Tuning)

| Slot | Mejora | Efecto | Coste |
|------|--------|--------|-------|
| **Motor** | Motor estándar → Turbo → Hyperdrive | Velocidad +25% → +60% → +100% | Batería + chatarra |
| **Chasis** | Standard → Blindado → Nanochasis | Defensa +50% → +150% → Regeneración | Chatarra + componentes |
| **Sensor** | Básico → Térmico → Cuántico | Visión nocturna, detectar enemigos, hackeo | Componentes electrónicos |
| **Arma** | Ninguna → Cuchilla → Láser → EMP | Daño cuerpo → Corte → Precisión → Stun | Chatarra + circuitos |
| **Panel Solar** | Ninguno → Mini → Extendido → Plegable | Recarga en luz solar pasiva | Chatarra solar |
| **Memoria** | 0 → 1 → 2 → 3 fragmentos | Desbloquea flashbacks narrativos + pasivas | Encontrado en mundo |

### 2.4 Combate

- **Cuerpo a cuerpo**: Rotación + colisión con cuchilla
- **Armas a distancia**: Láser (preciso, poco consumo), EMP (área, stun)
- **Sistema de defensa**: Escudo activable (consume energía)
- **Enemigos**:
  - **Drones de seguridad**: Patrol, patrullan zonas urbanas
  - **Robots corruptos**: Maquinas domésticas que se volvieron hostiles
  - **Depredadores mecánicos**: Robots de desguace automáticos
  - **Guardianes**: Jefes en zonas clave

### 2.5 Exploración y Recolección

- **Chatarra**: Recurso principal para mejoras
- **Componentes electrónicos**: Mejoras avanzadas
- **Baterías**: Recarga directa
- **Fragmentos de memoria**: Historia de KISOU
- **Puntos de guardado**: Estaciones de carga (recarga completa + checkpoint)

### 2.6 Progresión por Zonas

| Zona | Nombre | Descripción | Peligro |
|------|--------|-------------|---------|
| **1** | El Vertedero | Inicio, tutorial, escape | Bajo |
| **2** | Zona Industrial | Fábricas abandonadas, robots de desguace | Medio |
| **3** | Callejones | Urbanos, drones de seguridad | Medio-Alto |
| **4** | Periferia Ciudad | Tráfico, robots urbanos, clima | Alto |
| **5** | Centro Ciudad | Guardianes, puzzles complejos | Muy alto |
| **6** | Casa de Origen | Clímax, revelación final | Variable |

---

## 3. CONTROLES

### 3.1 Móvil (Táctil)

```
┌─────────────────────────────────┐
│  [←] [→] [ATAQUE] [DEFENSA]     │  ← HUD superior
│                                  │
│         [ZONA JOGABLE]           │  ← Canvas principal
│                                  │
│  ┌──────────┐  ┌────────────┐   │
│  │  JOYSTICK│  │ [TURBO]    │   │  ← Controles inferiores
│  │  VIRTUAL │  │ [SALTAR]*  │   │
│  └──────────┘  └────────────┘   │
└─────────────────────────────────┘
 * Saltar aparece tras mejorar motor
```

- **Joystick virtual**: Izquierda inferior — dirección y velocidad
- **Botón Turbo**: Derecha inferior — sprint (consume energía extra)
- **Botón Ataque**: Derecha superior — atacar/interactuar
- **Botón Defensa**: Centro superior — escudo/evadir
- **Swipe hacia arriba**: Saltar/impulsar (desbloqueable)
- **Swipe izquierda/derecha**: Cambiar arma (si tiene múltiples)

### 3.2 Desktop (Teclado + Ratón)

- **WASD / Flechas**: Movimiento
- **Espacio**: Ataque
- **Shift**: Turbo
- **Q**: Defensa/escudo
- **E**: Interactuar
- **1/2/3**: Cambiar arma
- **R**: Recargar (en enchufe)
- **ESC**: Pausa

---

## 4. ARTE Y ESTILO VISUAL

### 4.1 Estilo Artístico
- **Perspectiva**: 2.5D con parallax (fondo/middle/foreground)
- **Estilo**: Pixel art de alta resolución (16-bit moderno) + efectos post-procesado
- **Paleta**: 
  - Vertedero: Grises, naranjas óxido, verdes tóxicos
  - Urbano: Azules neón, morados, rojos de alerta
  - Ciudad: Dorados cálidos (nostalgia) vs Azules fríos (realidad)
  - Casa: Tonos cálidos, iluminación suave

### 4.2 Efectos Visuales
- **Partículas**: Chispas al atacar, polvo al rodar, lluvia
- **Iluminación**: Sistema de luz dinámica (farolas, ventanas, neón)
- **Parallax**: 3+ capas de fondo con movimiento diferencial
- **Shaders**: Bloom en luces neón, chromatic aberration en daño
- **Screen shake**: En impactos y explosiones
- **Transiciones**: Fade entre zonas, glitch al cambiar de área

### 4.3 Animaciones del Personaje (Sprite Sheet)

**KISOU — Estado Base**
| Frame | Animación | Duración |
|-------|-----------|----------|
| 1-8 | Rueda normal (idle) | 0.4s loop |
| 9-16 | Rueda movimiento lento | 0.6s loop |
| 17-24 | Rueda movimiento rápido | 0.3s loop |
| 25-32 | Turbo con chispas | 0.2s loop |
| 33-40 | Daño/temblor | 0.8s |
| 41-48 | Ataque activado | 0.5s |
| 49-56 | Defensa activada (escudo) | 0.4s loop |
| 57-64 | Muerte/apagado | 1.2s |

**KISOU — Mejoras Visuales**
- **Motor Turbo**: Estela de fuego azul en la parte trasera
- **Chasis Blindado**: Placas metálicas visibles, aspecto más robusto
- **Sensor Cuántico**: Ojo que brilla en verde/cyan
- **Arma Cuchilla**: Cuchilla giratoria visible lateral
- **Arma Láser**: Visor que emite haz rojo
- **Arma EMP**: Antena que pulsa con ondas circulares
- **Panel Solar**: Panel desplegable en la parte superior

### 4.4 Escenarios

| Capa | Elementos |
|------|-----------|
| **Fondo** | Cielo, nubes, edificios lejanos, sol/luna |
| **Parallax 2** | Edificios medios, árboles, carteles |
| **Parallax 3** | Suelo, obstáculos, recolectables |
| **Foreground** | Primer plano con partículas, niebla |

### 4.5 Efectos de Transición entre Zonas
- Glitch digital al cambiar de zona
- Fade to black con sonido de encendido/apagado
- Mensaje narrativo en cada transición

---

## 5. SONIDO Y MÚSICA

### 5.1 Música
- **Estilo**: Synthwave/Chiptune con toques orchestral
- **Temas por zona**:
  - Vertedero: Melancólico, lento, misterioso
  - Industrial: Mecánico, rítmico, tenso
  - Urbano: Electrónico, rápido, urgente
  - Casa: Nostálgico, emocional, resolutivo

### 5.2 Efectos de Sonido
- Motor eléctrico (varia con velocidad)
- Chispas al atacar
- Recolectables (chatarra, batería)
- Alerta de batería baja (pitido progresivo)
- Sonidos de impacto y daño
- Voz robótica (monólogos internos de KISOU)

---

## 6. ALCANCE PARA JAM

### MVP (Versión Jam — 1 semana)
- **1 zona completa**: El Vertedero (tutorial + escape)
- **Movimiento base**: Rotación, aceleración, frenado
- **Sistema de batería**: Consumo, recarga, game over
- **2 tipos de enemigos**: Drones patrulla + Robot hostil
- **1 mejora**: Motor básico → Turbo
- **Sistema de recolección**: Chatarra + Baterías
- **Sprites básicos**: KISOU animado + 2 enemigos + plataforma
- **Controles táctiles**: Joystick virtual + 3 botones
- **HUD**: Energía, puntuación (chatarra), zona actual
- **1 jefe de zona**: Robot de desguace gigante

### Feature Creep (si hay tiempo)
- 2ª zona: Zona Industrial
- Arma de cuerpo a cuerpo
- 2 mejoras adicionales
- Flashback narrativo con fragmento de memoria
- Efectos de partículas avanzados
- Guardado de progreso

### NO para la Jam
- Multiplayer
- Más de 2 zonas
- Sistema de narrativa complejo
- Más de 5 tipos de enemigos
- Editor de niveles
- Ranking online

---

## 7. ESTRUCTURA DE ARCHIVOS DEL PROYECTO

```
roomba-kisou/
├── GDD.md                          # Este documento
├── index.html                      # Entrada principal del juego
├── css/
│   ├── main.css                    # Estilos globales
│   ├── hud.css                     # Interfaz de usuario
│   └── responsive.css              # Adaptación móvil
├── js/
│   ├── main.js                     # Entry point
│   ├── game.js                     # Clase Game principal
│   ├── kizou.js                    # Jugador (KISOU)
│   ├── world.js                    # Mundo, plataformas, zonas
│   ├── enemies.js                  # Sistema de enemigos
│   ├── items.js                    # Objetos recolectables
│   ├── battery.js                  # Sistema de batería
│   ├── upgrades.js                 # Sistema de mejoras
│   ├── camera.js                   # Cámara y parallax
│   ├── input.js                    # Controles (táctil + teclado)
│   ├── renderer.js                 # Renderizado canvas
│   ├── sound.js                    # Sistema de audio
│   └── utils.js                    # Utilidades generales
├── assets/
│   ├── sprites/
│   │   ├── kizou/                  # Animaciones de KISOU
│   │   │   ├── idle.png            # Sprite sheet: frames 1-8
│   │   │   ├── move-slow.png       # Frames 9-16
│   │   │   ├── move-fast.png       # Frames 17-24
│   │   │   ├── turbo.png           # Frames 25-32
│   │   │   ├── damaged.png         # Frames 33-40
│   │   │   ├── attack.png          # Frames 41-48
│   │   │   ├── shield.png          # Frames 49-56
│   │   │   └── dead.png            # Frames 57-64
│   │   ├── enemies/
│   │   │   ├── drone-idle.png      # Drone patrulla
│   │   │   ├── drone-move.png      # Drone en movimiento
│   │   │   ├── robot-hostile.png   # Robot hostil
│   │   │   └── boss-destructor.png # Jefe del vertedero
│   │   ├── environment/
│   │   │   ├── platform.png        # Plataforma sólida
│   │   │   ├── conveyor.png        # Cinta transportadora
│   │   │   ├── trash-pile.png      # Montaña de basura (deco)
│   │   │   └── outlet.png          # Enchufe (recarga)
│   │   ├── items/
│   │   │   ├── scrap-metal.png     # Chatarra
│   │   │   ├── battery.png         # Batería
│   │   │   ├── memory-fragment.png # Fragmento de memoria
│   │   │   └── solar-panel.png     # Panel solar (mejora)
│   │   ├── weapons/
│   │   │   ├── blade-attack.png    # Cuchilla en acción
│   │   │   ├── laser-beam.png      # Haz láser
│   │   │   └── emp-wave.png        # Onda EMP
│   │   └── ui/
│   │       ├── energy-bar.png      # Barra de energía
│   │       ├── battery-icon.png    # Icono batería
│   │       └── joystick.png        # Joystick visual
│   ├── backgrounds/
│   │   ├── sky-dump.png            # Cielo del vertedero
│   │   ├── building-far.png        # Edificios lejanos
│   │   ├── building-mid.png        # Edificios medios
│   │   └── ground-dump.png         # Suelo del vertedero
│   └── audio/
│       ├── music-dump.mp3          # Música zona 1
│       ├── sfx-motor.mp3           # Motor en loop
│       ├── sfx-spark.mp3           # Chispas
│       ├── sfx-collect.mp3         # Recolectar item
│       └── sfx-alert.mp3           # Alerta batería baja
├── sprites/
│   └── README.md                   # Guía para crear sprites
└── README.md                       # README del proyecto
```

---

## 8. TECNOLOGÍAS

- **Motor**: HTML5 Canvas 2D (vanilla JS, sin framework)
- **Lenguaje**: JavaScript ES6+
- **Estilos**: CSS3 + Custom Properties
- **Audio**: Web Audio API
- **Responsive**: CSS Grid + Flexbox + Media Queries
- **Distribución**: Web pura (GitHub Pages, itch.io)
- **Build**: Zero build step (ficheros directos)

---

## 9. CRITERIOS DE ÉXITO

- ✅ Juegable en móvil táctil sin lag
- ✅ 60 FPS en dispositivos modernos
- ✅ Controles intuitivos en pantalla táctil
- ✅ Batería visible en todo momento
- ✅ Al menos una zona completa jugable
- ✅ Sensación de "robot con conciencia" en narrativa
- ✅ Progresión clara de mejoras
- ✅ Game Over por agotamiento de batería

---

*Documento v1.0 — Diseñado para Game Jam de 1 semana*
