# AGENTS.md - WordPress Gutenberg Blocks

## Project Overview

Custom WordPress Gutenberg blocks built with `@wordpress/scripts`.

## Available Skills

This project has specialized skills for different tasks:

| Task | Skill |
|------|-------|
| Creating/editing Gutenberg blocks | `gutenberg-blocks-development` |
| WordPress plugin architecture, hooks, security | `wp-plugin-development` |

## Project Structure

```
bloques_personalizados/
├── src/blocks/ds-hero/          # Block source code (development)
│   ├── block.json               # Metadata & attributes
│   ├── index.js                 # Block registration
│   ├── edit.js                  # Editor component
│   ├── save.js                  # Frontend render
│   ├── custom-css-editor.js     # CodeMirror CSS editor
│   ├── style.scss               # Frontend styles
│   └── editor.scss              # Editor styles
├── dist/ds-hero/                # Production-ready plugin
│   ├── ds-hero.php              # Plugin header (auto-copied on build)
│   ├── index.js
│   ├── index.asset.php
│   ├── index.css
│   └── style-index.css
└── package.json                 # Dependencies
```

## Commands

```bash
# Install dependencies
npm install

# Development with hot reload
npm run start

# Production build
npm run build

# Linting
npm run lint:js
npm run lint:css
```

## WordPress Plugin

1. Run `npm run build`
2. Copy `dist/ds-hero/` to:
```
wp-content/plugins/ds-hero/
```

## Quick Reference

- **Block name**: `mis-bloques/ds-hero`
- **Textdomain**: `ds-hero`
- **API Version**: 3
- **Features**: Masked images, InnerBlocks, custom CSS, responsive padding, overlay
