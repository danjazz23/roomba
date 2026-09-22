# 📂 Estructura DETALLADA de Sprites — Roomba KISOU

## Esquema Visual de Carpetas

```
roomba-kisou/
├── assets/
│   └── sprites/                    ← CARPETA PRINCIPAL DE SPRITES
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  1. PERSONAJE PRINCIPAL — KISOU                     ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── kizou/                      ← Todas las animaciones de KISOU
│   │   │
│   │   │  [512x512 px] — 8x8 grid = 64x64 px por frame
│   │   │
│   │   ├── idle.png                ← Animación: reposo / inactivo
│   │   │   Frame 1-8: Rueda girando lentamente
│   │   │   Color base: #4A5568 (gris metálico)
│   │   │   Ojo LED: #38B2AC parpadea suavemente
│   │   │
│   │   ├── move-slow.png           ← Animación: movimiento normal
│   │   │   Frame 1-8: Rueda girando ritmo medio
│   │   │   Inclinación ligera hacia adelante
│   │   │
│   │   ├── move-fast.png           ← Animación: movimiento rápido
│   │   │   Frame 1-8: Rueda girando rápido
│   │   │   Mayor inclinación, polvo al pasar
│   │   │
│   │   ├── turbo.png               ← Animación: turbo activo
│   │   │   Frame 1-8: Rueda girando ultra rápido
│   │   │   Estela de fuego azul detrás
│   │   │   Vibración del cuerpo
│   │   │
│   │   ├── damaged.png             ← Animación: recibiendo daño
│   │   │   Frame 1-8: Temblor, chispas, ojo rojo
│   │   │
│   │   ├── attack.png              ← Animación: atacando
│   │   │   Frame 1-8: Cuchilla/arma visible, rotación
│   │   │
│   │   ├── shield.png              ← Animación: escudo activo
│   │   │   Frame 1-8: Orbe de energía cyan alrededor
│   │   │
│   │   ├── dead.png                ← Animación: apagado
│   │   │   Frame 1-8: Ojo se apaga, cuerpo se hunde
│   │   │
│   │   └── jump.png                ← Animación: saltar/impulso
│   │       Frame 1-8: Impulso hacia arriba
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  2. VARIANTES VISUALES DE KISOU (MEJORAS)          ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── kizou/
│   │   ├── kizou-motor-turbo.png         ← Motor nivel 2
│   │   ├── kizou-motor-hyper.png         ← Motor nivel 3
│   │   ├── kizou-chasis-blindado.png     ← Chasis nivel 2
│   │   ├── kizou-chasis-nano.png         ← Chasis nivel 3
│   │   ├── kizou-sensor-termico.png      ← Sensor nivel 2
│   │   ├── kizou-sensor-quantico.png     ← Sensor nivel 3
│   │   ├── kizou-arma-cuchilla.png       ← Arma nivel 1
│   │   ├── kizou-arma-laser.png          ← Arma nivel 2
│   │   ├── kizou-arma-emp.png            ← Arma nivel 3
│   │   ├── kizou-solar-mini.png          ← Solar nivel 1
│   │   ├── kizou-solar-extendido.png     ← Solar nivel 2
│   │   └── kizou-solar-plegable.png      ← Solar nivel 3
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  3. ENEMIGOS                                         ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── enemies/
│   │   │
│   │   ├── drone/                    ← Drone de Seguridad
│   │   │   │  [256x256 px] — 8x8 grid = 32x32 px por frame
│   │   │   │
│   │   │   ├── idle.png              ← Frame 1-4: Flotando reposo
│   │   │   ├── patrol.png            ← Frame 1-8: Movimiento lateral
│   │   │   ├── chase.png             ← Frame 1-8: Persiguiendo
│   │   │   ├── attack.png            ← Frame 1-4: Disparando
│   │   │   ├── damaged.png           ← Frame 1-4: Recibiendo daño
│   │   │   └── death.png             ← Frame 1-8: Explotando
│   │   │
│   │   ├── hostile/                  ← Robot Hostil
│   │   │   │  [256x256 px] — 8x8 grid = 32x32 px por frame
│   │   │   │
│   │   │   ├── idle.png              ← Frame 1-4: Quieto, ojo rojo
│   │   │   ├── walk.png              ← Frame 1-8: Caminando
│   │   │   ├── chase.png             ← Frame 1-8: Persiguiendo rápido
│   │   │   ├── attack.png            ← Frame 1-6: Golpeando
│   │   │   ├── damaged.png           ← Frame 1-4: Parpadeando
│   │   │   └── death.png             ← Frame 1-8: Desmoronándose
│   │   │
│   │   └── boss/                     ← Jefe — Destructor
│   │       │  [512x512 px] — 8x8 grid = 64x64 px por frame
│   │       │
│   │       ├── idle.png              ← Frame 1-8: Respirando, grietas rojas
│   │       ├── walk.png              ← Frame 1-8: Caminando pesado
│   │       ├── claw-attack.png       ← Frame 1-8: Garras arriba y abajo
│   │       ├── slam.png              ← Frame 1-8: Golpeando el suelo
│   │       ├── damaged.png           ← Frame 1-4: Chispas, grietas
│   │       ├── charge.png            ← Frame 1-8: Cargando embestida
│   │       ├── death.png             ← Frame 1-16: Explotando
│   │       └── defeated.png          ← Frame 1-8: Fuera de combate
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  4. ENTORNO / ESCENARIOS                               ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── environment/
│   │   │
│   │   ├── platforms/              ← Bloques de plataforma
│   │   │   ├── ground-dump.png     ← [512x64 px] Suelo del vertedero
│   │   │   ├── ground-industrial.png ← [512x64 px] Suelo industrial
│   │   │   ├── ground-urban.png    ← [512x64 px] Suelo urbano
│   │   │   ├── platform-metal.png  ← [256x32 px] Plataforma metálica
│   │   │   ├── platform-wood.png   ← [256x32 px] Plataforma de madera
│   │   │   ├── platform-solar.png  ← [256x32 px] Plataforma con panel
│   │   │   └── conveyor.png        ← [256x32 px] Cinta transportadora
│   │   │
│   │   ├── decorations/            ← Elementos decorativos
│   │   │   ├── trash-pile-1.png    ← [128x128 px] Montaña basura #1
│   │   │   ├── trash-pile-2.png    ← [128x128 px] Montaña basura #2
│   │   │   ├── rusted-barrel.png   ← [64x96 px] Barril oxidado
│   │   │   ├── broken-machine.png  ← [256x192 px] Máquina rota
│   │   │   ├── pipe-leak.png       ← [64x128 px] Tubería con fuga
│   │   │   ├── warning-sign.png    ← [64x64 px] Señal de advertencia
│   │   │   ├── chain-link.png      ← [128x64 px] Cadena colgando
│   │   │   └── sparks.png          ← [64x64 px] Chispas estáticas
│   │   │
│   │   ├── interactive/            ← Objetos interactivos
│   │   │   ├── outlet.png          ← [64x64 px] Enchufe de recarga
│   │   │   ├── outlet-charging.png ← [64x64 px] Enchufe cargando (verde parpadea)
│   │   │   ├── vending-machine.png ← [96x160 px] Máquina expendedora
│   │   │   ├── terminal.png        ← [128x128 px] Terminal hackeable
│   │   │   └── door.png            ← [64x128 px] Puerta cerrada/abierta
│   │   │
│   │   └── tiles/                  ← Tiles para construcción de niveles
│   │       ├── tile-set.png        ← [512x512 px] Hoja de tiles completa
│   │       │   16x16 tiles de 32x32 px
│   │       │   (suelo, pared, cielo, agua, lava, plataforma móvil)
│   │       └── tile-set-industrial.png ← [512x512 px] Tiles zona industrial
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  5. OBJETOS / ITEMS                                      ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── items/
│   │   │  [128x128 px] — 4x4 grid = 32x32 px por frame
│   │   │
│   │   ├── scrap-metal.png         ← Frame 1-4: Rotando lentamente
│   │   ├── scrap-electronic.png    ← Frame 1-4: Pieza electrónica
│   │   ├── battery-full.png        ← Frame 1-4: Batería con carga
│   │   ├── battery-half.png        ← Frame 1-4: Batería media
│   │   ├── battery-empty.png       ← Frame 1-4: Batería gastada (drop)
│   │   ├── memory-fragment.png     ← Frame 1-8: Flotando con brillo
│   │   ├── solar-panel-small.png   ← Frame 1-4: Panel solar mini
│   │   ├── solar-panel-large.png   ← Frame 1-4: Panel solar extendido
│   │   ├── coin-energy.png         ← Frame 1-8: Moneda de energía
│   │   ├── key-access.png          ← Frame 1-4: Tarjeta de acceso
│   │   ├── upgrade-engine.png      ← Frame 1-8: Icono mejora motor
│   │   ├── upgrade-chassis.png     ← Frame 1-8: Icono mejora chasis
│   │   ├── upgrade-sensor.png      ← Frame 1-8: Icono mejora sensor
│   │   ├── upgrade-weapon.png      ← Frame 1-8: Icono mejora arma
│   │   └── upgrade-solar.png       ← Frame 1-8: Icono mejora solar
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  6. ARMAS — EFECTOS DE ATAQUE                          ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── weapons/
│   │   │
│   │   ├── melee/                  ← Armas cuerpo a cuerpo
│   │   │   ├── blade-swing-1.png   ← [128x128 px] Golpe cuchilla 1
│   │   │   ├── blade-swing-2.png   ← [128x128 px] Golpe cuchilla 2
│   │   │   ├── blade-swing-3.png   ← [128x128 px] Golpe cuchilla 3
│   │   │   └── slash-trail.png     ← [256x64 px] Estela del corte
│   │   │
│   │   ├── ranged/                 ← Armas a distancia
│   │   │   ├── laser-beam.png      ← [512x16 px] Haz láser
│   │   │   ├── laser-beam-hit.png  ← [64x64 px] Impacto láser
│   │   │   ├── laser-charge.png    ← Frame 1-4: Cargando láser
│   │   │   ├── emp-wave-1.png      ← [128x128 px] Onda EMP exp.
│   │   │   ├── emp-wave-2.png      ← [256x256 px] Onda EMP máx.
│   │   │   └── emp-flash.png       ← [256x256 px] Flash EMP
│   │   │
│   │   └── hitspark/               ← Efectos de impacto universal
│   │       ├── hitspark-small.png  ← [64x64 px] Chispa pequeña
│   │       ├── hitspark-medium.png ← [128x128 px] Chispa media
│   │       ├── hitspark-large.png  ← [256x256 px] Chispa grande
│   │       ├── hit-number-1.png    ← [32x32 px] Número "-10"
│   │       ├── hit-number-2.png    ← [32x32 px] Número "-25"
│   │       └── hit-number-3.png    ← [32x32 px] Número "-40"
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  7. EFECTOS VISUALES / PARTICULAS                      ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── effects/
│   │   │
│   │   ├── particles/              ← Partículas simples
│   │   │   ├── spark-blue.png      ← [16x16 px] Chispa azul
│   │   │   ├── spark-orange.png    ← [16x16 px] Chispa naranja
│   │   │   ├── spark-white.png     ← [16x16 px] Chispa blanca
│   │   │   ├── dust.png            ← [16x16 px] Polvo
│   │   │   ├── rain.png            ← [8x16 px] Gota de lluvia
│   │   │   ├── snow.png            ← [8x8 px] Copo de nieve
│   │   │   ├── ember.png           ← [8x8 px] Brasa
│   │   │   └── steam.png           ← [32x32 px] Vapor difuso
│   │   │
│   │   ├── explosions/             ← Explosiones
│   │   │   ├── exp-small.png       ← Frame 1-6: Explosión pequeña
│   │   │   ├── exp-medium.png      ← Frame 1-8: Explosión media
│   │   │   ├── exp-large.png       ← Frame 1-12: Explosión grande
│   │   │   └── smoke.png           ← Frame 1-8: Humo tras explosión
│   │   │
│   │   ├── lightning/              ← Rayos / electricidad
│   │   │   ├── bolt-1.png          ← Rayo recto 1
│   │   │   ├── bolt-2.png          ← Rayo recto 2
│   │   │   ├── arc.png             ← Rayo curvo
│   │   │   └── static.png          ← Electricidad estática
│   │   │
│   │   └── ui-effects/             ← Efectos de UI
│   │       ├── flash-white.png     ← [512x512 px] Flash pantalla
│   │       ├── flash-red.png       ← [512x512 px] Flash daño
│   │       ├── vignette.png        ← [512x512 px] Viñeta oscura
│   │       └── scanlines.png       ← [512x512 px] Líneas de escaneo
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  8. FONDO / BACKGROUNDS (PARALLAX)                     ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── backgrounds/
│   │   │
│   │   ├── dump/                   ← Zona 1: El Vertedero
│   │   │   ├── sky-dark.png        ← [1920x400 px] Cielo oscuro
│   │   │   ├── buildings-far.png   ← [1920x600 px] Edificios lejanos
│   │   │   ├── buildings-mid.png   ← [1920x500 px] Edificios medios
│   │   │   ├── trash-bg.png        ← [1920x400 px] Basura fondo
│   │   │   ├── smoke-haze.png      ← [1920x300 px] Niebla tóxica
│   │   │   └── lighting.png        ← [1920x800 px] Iluminación overlay
│   │   │
│   │   ├── industrial/             ← Zona 2: Zona Industrial
│   │   │   ├── sky-orange.png      ← [1920x400 px] Cielo anaranjado
│   │   │   ├── factory-far.png     ← [1920x600 px] Fábricas lejanas
│   │   │   ├── smokestacks.png     ← [1920x500 px] Chimeneas humo
│   │   │   ├── pipes-bg.png        ← [1920x400 px] Tuberías fondo
│   │   │   └── lighting.png        ← [1920x800 px] Iluminación
│   │   │
│   │   ├── urban/                  ← Zona 3: Callejones
│   │   │   ├── sky-night.png       ← [1920x400 px] Cielo nocturno
│   │   │   ├── neon-buildings.png  ← [1920x600 px] Rascacielos neón
│   │   │   ├── alley-walls.png     ← [1920x500 px] Muros callejón
│   │   │   ├── puddles.png         ← [1920x300 px] Charcos reflejo
│   │   │   └── neon-lights.png     ← [1920x800 px] Luz neón overlay
│   │   │
│   │   ├── city/                   ← Zona 4-5: Ciudad
│   │   │   ├── sky-dawn.png        ← [1920x400 px] Amanecer
│   │   │   ├── skyline.png         ← [1920x600 px] Skyline
│   │   │   ├── streets.png         ← [1920x500 px] Calles
│   │   │   └── traffic.png         ← [1920x300 px] Tráfico fondo
│   │   │
│   │   └── home/                   ← Zona 6: Casa de Origen
│   │       ├── sky-warm.png        ← [1920x400 px] Cielo cálido
│   │       ├── garden-bg.png       ← [1920x600 px] Jardín
│   │       ├── house-exterior.png  ← [1920x500 px] Casa exterior
│   │       └── lighting-warm.png   ← [1920x800 px] Luz dorada
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  9. UI / INTERFAZ DE USUARIO                           ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── ui/
│   │   │  (Texturas para UI en canvas)
│   │   │
│   │   ├── bar-energy-bg.png       ← [200x16 px] Fondo barra energía
│   │   ├── bar-energy-fill-green.png ← [200x16 px] Barra verde
│   │   ├── bar-energy-fill-yellow.png ← [200x16 px] Barra amarilla
│   │   ├── bar-energy-fill-red.png   ← [200x16 px] Barra roja
│   │   ├── bar-energy-border.png   ← [204x20 px] Borde barra
│   │   ├── icon-energy.png         ← [32x32 px] Icono energía
│   │   ├── icon-scrap.png          ← [32x32 px] Icono chatarra
│   │   ├── icon-memory.png         ← [32x32 px] Icono memoria
│   │   ├── icon-battery.png        ← [32x32 px] Icono batería
│   │   ├── icon-zones.png          ← [32x32 px] Icono zona
│   │   ├── btn-start.png           ← [200x60 px] Botón iniciar
│   │   ├── btn-start-hover.png     ← [200x60 px] Botón hover
│   │   ├── btn-menu.png            ← [100x40 px] Botón menú
│   │   ├── joystick-base.png       ← [120x120 px] Base joystick
│   │   ├── joystick-stick.png      ← [30x30 px] Stick joystick
│   │   ├── panel-stats.png         ← [300x200 px] Panel estadísticas
│   │   ├── dialog-box.png          ← [400x120 px] Caja de diálogo
│   │   ├── minimap-frame.png       ← [128x128 px] Marco minimapa
│   │   └── pause-overlay.png       ← [512x512 px] Overlay pausa
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  10. FUENTES / TYPOGRAPHY                                ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── fonts/
│   │   ├── kisou-font.png          ← [512x512 px] Sprite font
│   │   │   Todos los caracteres ASCII en grid 16x16
│   │   │   A-Z, a-z, 0-9, símbolos, emoji
│   │   │   (usar con BitmapText en canvas)
│   │   └── kisou-font-bold.png     ← [512x512 px] Versión bold
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  11. MENSAJES / NOTIFICACIONES                           ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── messages/
│   │   ├── msg-scrap-plus.png      ← "+1 ♻️" animado
│   │   ├── msg-battery-plus.png    ← "+15% ⚡" animado
│   │   ├── msg-upgrade.png         ← "MEJORA INSTALADA"
│   │   ├── msg-memory-found.png    ← "RECORDATORIO DESBLOQUEADO"
│   │   ├── msg-low-battery.png     ← "⚠️ BATERÍA BAJA ⚠️"
│   │   ├── msg-area-locked.png     ← "ZONA BLOQUEADA"
│   │   └── msg-transition.png      ← Efecto transición zona
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  12. MAPA / MINIMAP                                      ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── minimap/
│   │   ├── tile-ground.png         ← [16x16 px] Tile suelo mapa
│   │   ├── tile-wall.png           ← [16x16 px] Tile pared mapa
│   │   ├── tile-enemy.png          ← [16x16 px] Punto enemigo
│   │   ├── tile-item.png           ← [16x16 px] Punto item
│   │   ├── tile-player.png         ← [16x16 px] Punto jugador
│   │   ├── tile-outlet.png         ← [16x16 px] Punto enchufe
│   │   └── tile-boss.png           ← [16x16 px] Punto jefe
│   │
│   │
│   │   ╔══════════════════════════════════════════════════════╗
│   │   ║  13. ARCHIVOS DE REFERENCIA                              ║
│   │   ╚══════════════════════════════════════════════════════╝
│   │
│   ├── reference/
│   │   ├── color-palette.png       ← [512x64 px] Paleta completa
│   │   ├── character-sheet.png     ← [512x512 px] KISOU referencia
│   │   ├── enemy-sheet.png         ← [512x512 px] Enemigos ref.
│   │   ├── tile-set.png            ← [512x512 px] Hoja de tiles
│   │   └── font-sheet.png          ← [512x512 px] Fuente sprite
│   │
│   └── .gitkeep                    ← Mantener carpeta en git
│
│
│   ╔═══════════════════════════════════════════════════════════╗
│   ║  📋 REGLAS DE NOMENCLATURA                                ║
│   ╚═══════════════════════════════════════════════════════════╝
│
│   ┌─────────────────────────────────────────────────────────┐
│   │  NOMENCLATURA DE ARCHIVOS                               │
│   │                                                         │
│   │  <personaje>_<animacion>.png                            │
│   │  <tipo>_<item>.png                                     │
│   │  <ambiente>_<capa>.png                                 │
│   │  <arma>_<efecto>.png                                   │
│   │  <categoria>_<descriptivo>.png                         │
│   │                                                         │
│   │  REGLAS:                                                │
│   │  • Minúsculas solo                                      │
│   │  • Separador: guion bajo (_)                            │
│   │  • Sin espacios, sin acentos                            │
│   │  • Descriptivo pero corto                               │
│   │  • Ejemplo: kizou_attack.png, no "ataque_kisou_final.png"│
│   └─────────────────────────────────────────────────────────┘
│
│   ┌─────────────────────────────────────────────────────────┐
│   │  RESOLUCIONES POR CATEGORÍA                             │
│   │                                                         │
│   │  Personaje principal:   512x512 (8x8 grid = 64px)       │
│   │  Enemigos pequeños:     256x256 (8x8 grid = 32px)       │
│   │  Enemigos jefe:         512x512 (8x8 grid = 64px)       │
│   │  Items:                 128x128 (4x4 grid = 32px)       │
│   │  Decoraciones:          64-256px variable               │
│   │  Plataformas:           256-512px x 32px                │
│   │  Fondos parallax:       1920x variable                  │
│   │  UI:                    64-512px variable               │
│   │  Partículas:            8-32px                          │
│   │  Efectos:               64-512px variable               │
│   │                                                         │
│   │  FORMATO: PNG con canal alpha (transparencia)           │
│   │  COMPRESIÓN: Sin compresión lossy (PNG nativo)          │
│   └─────────────────────────────────────────────────────────┘
```

---

## 📐 Ejemplo Concreto: `kizou/idle.png`

```
Imagen: kizou/idle.png
Dimensiones: 512 x 512 px
Formato: PNG 32-bit (RGBA)
Grid: 8 columnas x 8 filas = 64 frames totales
Tamaño por frame: 64 x 64 px
Paleta: 32 colores máx.
Anti-aliasing: Solo en bordes diagonales

╔═══════════════════════════════════════════════════════╗
║ [F01][F02][F03][F04][F05][F06][F07][F08]            ║  Fila 1: Rueda posición 1-8
║ [F09][F10][F11][F12][F13][F14][F15][F16]            ║  Fila 2: Rueda posición 1-8
║ [F17][F18][F19][F20][F21][F22][F23][F24]            ║  Fila 3: Rueda posición 1-8
║ [F25][F26][F27][F28][F29][F30][F31][F32]            ║  Fila 4: Rueda posición 1-8
║ [F33][F34][F35][F36][F37][F38][F39][F40]            ║  Fila 5: Ojo parpadeo 1-8
║ [F41][F42][F43][F44][F45][F46][F47][F48]            ║  Fila 6: Ojo parpadeo 1-4
║ [F49][F50][F51][F52][F53][F54][F55][F56]            ║  Fila 7: Vacío / transición
║ [F57][F58][F59][F60][F61][F62][F63][F64]            ║  Fila 8: Vacío / transición
╚═══════════════════════════════════════════════════════╝

Uso en código:
  SpriteSheet.load('assets/sprites/kizou/idle.png', {
    frameWidth: 64,
    frameHeight: 64,
    totalFrames: 8,    // Solo usamos 8 frames reales
    fps: 12,           // 12 FPS para loop
    loop: true         // Loop infinito
  })
```

---

## 🔄 Flujo de Trabajo: Crear un Sprite

```
1. DISEÑO (Aseprite / Piskel)
   └→ Crear canvas de tamaño correcto (ej: 512x512)
   └→ Definir paleta de 32 colores máx.
   └→ Dibujar cada frame en su celda del grid
   └→ Verificar: 12-15 FPS en preview

2. EXPORTACIÓN
   └→ Archivo PNG nativo (no comprimir)
   └→ Nombre: kizou_move-slow.png
   └→ Guardar en: assets/sprites/kizou/

3. INTEGRACIÓN
   └→ El juego carga el PNG automáticamente
   └→ Divide en grid de 64x64px
   └→ Renderiza frames a 12 FPS
   └→ Loop automático

4. VERIFICACIÓN
   └→ Probar en canvas del juego
   └→ Verificar que los frames se repiten
   └→ Comprobar en móvil y desktop
   └→ Ajustar si es necesario
```

---

## 📊 Resumen por Categoría

| Categoría | Carpetas | Archivos Est. | Resolución | Frames/Categ. |
|-----------|----------|---------------|------------|---------------|
| **KISOU** | kizou/ | 10 archivos | 512x512 | ~80 frames |
| **Enemigos** | enemies/ | 20 archivos | 256-512px | ~120 frames |
| **Entorno** | environment/ | 25 archivos | variable | ~50 tiles |
| **Items** | items/ | 16 archivos | 128x128 | ~50 frames |
| **Armas** | weapons/ | 15 archivos | 64-512px | ~40 frames |
| **Efectos** | effects/ | 20 archivos | 8-256px | ~100 frames |
| **Fondos** | backgrounds/ | 20 archivos | 1920px ancho | ~20 capas |
| **UI** | ui/ | 16 archivos | 32-512px | ~30 texturas |
| **Referencia** | reference/ | 5 archivos | 512x512 | — |

**Total estimado: ~167 archivos PNG**
