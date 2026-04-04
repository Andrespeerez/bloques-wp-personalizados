# AGENTS.md - WordPress Gutenberg Blocks Monorepo

## Project Overview

Custom WordPress Gutenberg blocks built with `@wordpress/scripts` and AI assistance.

## Skills Index

| Task | Skill | Description |
|------|-------|-------------|
| Crear bloques con InspectorControls tabs (General/Style/Advanced) | `kadence-style-blocks` | Bloques tipo Kadence con panels organizados en tabs, controles responsive |
| Crear bloques con renderizado PHP server-side | `server-side-render-blocks` | Bloques que renderizan en servidor con mock data para demo |
| Crear/editar skills y consolidar conocimiento | `skill-manager` | Cómo crear nuevas skills, editar AGENTS.md, gestionar conocimiento |
| Overview general de desarrollo de bloques | `gutenberg-blocks-development` | Estructura del proyecto, build commands, configuración webpack |

## Available Skills

Carga estas skills cuando necesites:

- **kadence-style-blocks**: InspectorControls con tabs, responsive settings (Desktop/Tablet/Mobile), CodeMirror CSS editor
- **server-side-render-blocks**: PHP server render, mock data pattern, API integration, seguridad WordPress
- **skill-manager**: Crear nuevas skills, actualizar AGENTS.md, workflow para documentación
- **gutenberg-blocks-development**: Estructura del proyecto, webpack multi-bloque, commands

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
