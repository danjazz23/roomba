# Sprites — Guía de Creación para Roomba KISOU

## Dimensiones Base
- **Sprite Sheet KISOU**: 512x512px (8x8 grid = 64x64px por frame)
- **Enemy Sprites**: 256x256px (8x8 grid = 32x32px por frame)
- **Environment**: Variable, máximo 512x512px
- **Items**: 128x128px (4x4 grid = 32x32px por frame)
- **UI**: 256x64px

## Estilo Artístico
- **Resolución**: Pixel art 16-bit moderno
- **Paleta limitada**: 32 colores máx. por sprite
- **Transparencia**: PNG con canal alpha
- **Anti-aliasing**: OFF (pixel art puro)

## Paleta de Colores Principal

```css
/* KISOU - Robot Doméstico */
--kizou-body:       #4A5568;  /* Gris metálico */
--kizou-accent:     #38B2AC;  /* Cyan eléctrico (conciencia) */
--kizou-eye:        #4FD1C5;  /* Ojo brillante */
--kizou-dark:       #2D3748;  /* Sombras */
--kizou-light:      #A0AEC0;  /* Reflejos */

/* Batería */
--energy-high:      #48BB78;  /* Verde */
--energy-mid:       #ECC94B;  /* Amarillo */
--energy-low:       #F56565;  /* Rojo */
--energy-critical:  #FC5185;  /* Rojo intenso parpadeante */

/* Entornos */
--dump-orange:      #ED8936;  /* Óxido */
--dump-green:       #48C78E;  /* Tóxico */
--dump-gray:        #718096;  /* Metal */
--neon-blue:        #4299E1;  /* Urbano */
--neon-purple:      #9F7AEA;  /* Cyberpunk */
--neon-pink:        #F56565;  /* Alerta */
--warm-gold:        #F6E05E;  /* Casa/Nostalgia */
```

## Especificaciones por Personaje

### KISOU — Robot Doméstico Consciente

**Diseño General:**
- Forma cilíndrica (tipo Roomba real) pero con detalles antropomórficos
- Cuerpo circular de ~64px diámetro
- "Ojo" LED central que brilla en cyan (símbolo de conciencia)
- Patas/rueda trasera visible
- Panel superior donde se instalará el panel solar

**Evolución Visual con Mejoras:**
1. **Base**: Gris apagado, ojo parpadeando débilmente
2. **Turbo**: Estela azul detrás, ojo más brillante
3. **Blindado**: Placas adicionales, aspecto más ancho
4. **Sensor Cuántico**: Ojo con patrón de ondas
5. **Arma Cuchilla**: Brazo lateral con cuchilla giratoria
6. **Panel Solar**: Panel desplegable en la parte superior

### Enemigos

**Drone de Seguridad:**
- Forma hexagonal, color azul/rojo de seguridad
- Propulsor visible debajo
- Ojo sensor rojo brillante
- 32x32px base

**Robot Hostil:**
- Robot doméstico corrompido
- Color óxido/negro
- "Ojo" rojo en lugar del cyan
- Patas en lugar de ruedas
- 32x32px base

**Jefe — Destructor:**
- Robot de desguace gigante
- Garras mecánicas
- Color industrial amarillo/negro
- Ojo rojo pulsante
- 128x128px
- Animaciones: idle (2 frames), atacar (4 frames), dañado (2 frames), muerte (6 frames)

## Formato de Archivos

```
{kizou}/{animación}.png

Ejemplo:
- kizou/idle.png = 512x512px (8 frames de 64x64px en grid 8x8)
  [1][2][3][4][5][6][7][8]
  [9][10][11][12][13][14][15][16]
  ...
  [57][58][59][60][61][62][63][64]
```

## Herramientas Recomendadas
- **Aseprite**: Pixel art profesional ($20)
- **Piskel**: Gratis, online
- **GraphicsGale**: Gratis, Windows
- **Tiled**: Para mapas de nivel

## Tips para Pixel Art de Alta Calidad
1. **Line art**: Usar anti-aliasing solo en bordes diagonales
2. **Sombras**: 2-3 niveles de sombra, no más
3. **Highlight**: Siempre incluir un punto de luz consistente
4. **Dithering**: Usar sutilmente para gradientes
5. **Animación**: 8-16 frames por ciclo, 12-15 FPS
