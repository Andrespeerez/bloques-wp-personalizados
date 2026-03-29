# Bloques Personalizados de WordPress

Repositorio para crear y gestionar bloques personalizados de Gutenberg para WordPress.

## Bloques Disponibles

### DS Hero Block

Bloque Gutenberg para crear secciones hero con imagen con máscara, fondo personalizable y contenido flexible.

**Características:**
- Fondo personalizable: color sólido, gradiente CSS o imagen con overlay
- Imagen con máscara PNG con transparencia
- Posicionamiento flexible: 9 posiciones predefinidas + opción custom
- Contenido flexible con InnerBlocks
- Editor de CSS personalizado
- Diseño responsivo (desktop, tablet, móvil)
- Tabs estilo Kadence (General, Style, Advanced)

## Instalación

### Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run start

# Build para producción
npm run build
```

### Usar en WordPress

1. Haz el build: `npm run build`
2. Copia `dist/ds-hero/` completo a:
```
wp-content/plugins/ds-hero/
```

## Estructura de archivos

```
bloques_personalizados/
├── README.md
├── AGENTS.md                    # Guía para agentes IA
├── package.json                 # Dependencias
├── webpack.config.js            # Config webpack
├── src/blocks/ds-hero/          # Código fuente (desarrollo)
│   ├── block.json               # Metadatos y atributos
│   ├── index.js                 # Registro del bloque
│   ├── edit.js                  # Componente del editor
│   ├── save.js                  # Renderizado frontend
│   ├── custom-css-editor.js     # Editor CSS
│   ├── style.scss               # Estilos frontend
│   └── editor.scss              # Estilos editor
└── dist/ds-hero/                # Listo para producción
    ├── ds-hero.php              # Plugin header
    ├── index.js
    ├── index.asset.php
    ├── index.css
    └── style-index.css
```

## Atributos del bloque DS Hero

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `uniqueID` | string | ID único para CSS dinámico |
| `backgroundType` | string | `color`, `gradient`, `image` |
| `backgroundColor` | string | Color de fondo (hex) |
| `backgroundGradient` | string | Gradiente CSS |
| `backgroundImage` | object | Objeto con url, id, size |
| `overlayColor` | string | Color del overlay |
| `overlayOpacity` | number | Opacidad del overlay (0-1) |
| `maskEnabled` | boolean | Habilitar imagen con máscara |
| `maskedImageUrl` | string | URL de la imagen a mostrar |
| `maskImageUrl` | string | URL de la máscara PNG |
| `maskPositionPreset` | string | Posición predefinida |
| `maskPositionX/Y` | number | Posición custom |
| `maskWidth/Height` | number | Dimensiones de la máscara |
| `contentPosition` | string | `left`, `center`, `right` |
| `verticalAlign` | string | `top`, `center`, `bottom` |
| `paddingDesktop` | array | Padding [top, right, bottom, left] |
| `paddingTablet` | array | Padding tablet |
| `paddingMobile` | array | Padding móvil |
| `customCSS` | string | CSS personalizado |

## Añadir nuevos bloques

Para añadir un nuevo bloque:

1. Crea una nueva carpeta en `src/blocks/`
2. Usa `@wordpress/create-block` como scaffold:
   ```bash
   npx @wordpress/create-block@latest nuevo-bloque --namespace mis-bloques --title "Nuevo Bloque" --category design --no-plugin
   ```
3. Configura `block.json` con la ruta correcta a los archivos compilados:
   ```json
   "editorScript": "file:../../dist/nuevo-bloque/index.js",
   "editorStyle": "file:../../dist/nuevo-bloque/index.css",
   "style": "file:../../dist/nuevo-bloque/style-index.css"
   ```
4. Añade el registro en un archivo PHP (o crea nuevo)

Ver `AGENTS.md` para guidelines de desarrollo con agentes IA.

## Linting

```bash
npm run lint:js
npm run lint:css
```

## Licencia

GPL-2.0-or-later
