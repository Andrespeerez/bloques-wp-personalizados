# Bloques Personalizados de WordPress

Monorepositorio para crear y gestionar bloques personalizados de Gutenberg para WordPress.

## Bloques Disponibles

Este monorepositorio contiene múltiples bloques personalizados para Gutenberg. Se irán añadiendo nuevos bloques según las necesidades.

### APG Hero Block

<img width="2203" height="591" alt="image" src="https://github.com/user-attachments/assets/9ab5f30f-dafb-4829-b340-fa996a7eca44" />

Bloque Gutenberg para crear secciones hero con imagen con máscara PNG, fondo personalizable y contenido flexible.

**Características:**
- Fondo personalizable: color sólido, gradiente CSS o imagen con overlay
- Imagen con máscara PNG con transparencia
- Posicionamiento flexible: 9 posiciones predefinidas + opción custom
- Contenido flexible con InnerBlocks
- Editor de CSS personalizado con CodeMirror
- Diseño responsivo (desktop, tablet, móvil)
- Tabs estilo Kadence (General, Style, Advanced)
- CSS generado como clases (no inline styles)

### APG Google Reviews

Bloque para mostrar reseñas de Google Places con diseño de tarjetas. Incluye mock data para preview y conexión directa a la API de Google Places.

**Características:**
- Visualización de reseñas de Google Places API
- Mock data para demo y preview en el editor
- Diseño de tarjetas con avatar, rating (estrellas), texto y tiempo
- Caché de 24 horas para minimizar llamadas a la API
- Ordenación por más recientes

### Más bloques en desarrollo...

Consulta `src/blocks/` para ver todos los bloques disponibles.

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
2. Copia el bloque(s) que necesites de `dist/` a WordPress:
```
wp-content/plugins/[nombre-del-bloque]/
```
3. Activa el plugin en el admin de WordPress

Cada bloque en `dist/` es un plugin de WordPress independiente y autocontenido.

## Estructura del Proyecto

```
bloques_personalizados/          # Monorepositorio
├── README.md                    # Este archivo
├── AGENTS.md                    # Guía para desarrollo con IA
├── package.json                 # Dependencias compartidas
├── webpack.config.js            # Config de build
├── src/blocks/                  # Código fuente (desarrollo)
│   ├── apg-hero/
│   │   ├── block.json
│   │   ├── index.js
│   │   ├── edit.js
│   │   ├── save.js
│   │   ├── custom-css-editor.js
│   │   ├── style.scss
│   │   └── editor.scss
│   └── apg-google-reviews/
│       ├── block.json
│       ├── render.php
│       ├── mock-data.php
│       ├── index.js
│       ├── edit.js
│       ├── save.js
│       ├── style.scss
│       └── editor.scss
└── dist/                       # Build output (listo para producción)
    ├── apg-hero/
    │   ├── apg-hero.php
    │   ├── index.js
    │   ├── index.asset.php
    │   └── ...
    └── apg-google-reviews/
        ├── apg-google-reviews.php
        ├── index.js
        ├── index.asset.php
        ├── render.php
        ├── mock-data.php
        └── ...
```

## Añadir Nuevos Bloques

1. Crea la carpeta en `src/blocks/[nombre]/`
2. Configura `block.json` con atributos y metadatos
3. Desarrolla `edit.js` (editor) y `save.js` (frontend)
4. Añade estilos en `style.scss` y `editor.scss`
5. Ejecuta `npm run build`
6. Copia `dist/[nombre]/` a WordPress

El nombre de la carpeta en `src/blocks/` será el nombre del plugin resultante en `dist/`.

Ver `AGENTS.md` para guidelines de desarrollo con agentes IA.

## Stack Tecnológico

- **Gutenberg Blocks API** v3
- **@wordpress/scripts** - Build y desarrollo
- **CodeMirror** - Editor CSS integrado
- **SCSS** - Preprocesador de estilos

## Linting

```bash
npm run lint:js
npm run lint:css
```

## Licencia

GPL-2.0-or-later
