# AGENTS.md - WordPress Gutenberg Blocks Monorepo

## Project Overview

Custom WordPress Gutenberg blocks built with `@wordpress/scripts` and AI assistance.

## Skills Index

| Task | Skill | Description |
|------|-------|-------------|
| Depurar errores de bloques Gutenberg | `blocks-debugging` | PHP visible, bloque no aparece, error en editor, errores de build |
| Crear bloques con InspectorControls tabs (General/Style/Advanced) | `kadence-style-blocks` | Bloques tipo Kadence con panels organizados en tabs, controles responsive |
| Crear bloques con renderizado PHP server-side | `server-side-render-blocks` | Bloques que renderizan en servidor con mock data, integración API (fetch en editor o PHP) |
| Crear/editar skills y consolidar conocimiento | `skill-manager` | Cómo crear nuevas skills, editar AGENTS.md, gestionar conocimiento |
| Overview general de desarrollo de bloques | `gutenberg-blocks-development` | Estructura del proyecto, build commands, configuración webpack |
| Verificar estructura del proyecto post-build | `build-verification` | Checklist para validar dist/, detectar carpetas no deseadas, verificar archivos de bloque |

## Available Skills

Carga estas skills cuando necesites:

- **blocks-debugging**: PHP visible, bloque no aparece, "block has encountered an error", errores de webpack
- **kadence-style-blocks**: InspectorControls con tabs, responsive settings (Desktop/Tablet/Mobile), CodeMirror CSS editor
- **server-side-render-blocks**: PHP server render, mock data pattern, API integration, seguridad WordPress
- **skill-manager**: Crear nuevas skills, actualizar AGENTS.md, gestionar conocimiento
- **gutenberg-blocks-development**: Estructura del proyecto, webpack multi-bloque, commands
- **build-verification**: Verificar estructura de dist/ post-build, checklist de archivos requeridos

## Project Structure

```
bloques_personalizados/
├── src/blocks/                  # Block source code (development)
│   ├── apg-hero/
│   └── apg-google-reviews/
├── dist/                        # Production-ready plugins
├── .agents/skills/              # Skills (this directory)
└── package.json
```

## Commands

```bash
npm install          # Install dependencies
npm run build        # Production build
npm run start        # Development with hot reload
npm run lint:js      # Lint JavaScript
npm run lint:css     # Lint CSS/SCSS
```

## WordPress Deployment

1. Run `npm run build`
2. Copy desired block from `dist/[block-name]/` to:
   ```
   wp-content/plugins/[block-name]/
   ```
3. Activate the plugin in WordPress admin
