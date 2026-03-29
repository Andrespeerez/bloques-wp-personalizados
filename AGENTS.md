# AGENTS.md - WordPress Gutenberg Blocks Monorepo

## Project Overview

Custom WordPress Gutenberg blocks built with `@wordpress/scripts` and AI assistance.

## Available Skills

| Task | Skill |
|------|-------|
| Creating/editing Gutenberg blocks | `gutenberg-blocks-development` |
| WordPress plugin architecture, hooks, security | `wp-plugin-development` |

## Project Structure

```
bloques_personalizados/          # Monorepo
├── src/blocks/                  # Block source code (development)
│   └── ds-hero/                 # Block: DS Hero
│       ├── block.json           # Metadata & attributes
│       ├── index.js             # Block registration
│       ├── edit.js              # Editor component
│       ├── save.js              # Frontend render
│       ├── custom-css-editor.js # CodeMirror CSS editor
│       ├── style.scss           # Frontend styles
│       └── editor.scss          # Editor styles
├── dist/                        # Production-ready plugins
│   └── ds-hero/                 # Block: DS Hero
│       ├── ds-hero.php          # Plugin header
│       ├── index.js
│       ├── index.asset.php
│       ├── index.css
│       └── style-index.css
├── .agents/skills/              # AI development skills
└── package.json                # Shared dependencies
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

## WordPress Deployment

1. Run `npm run build`
2. Copy desired block from `dist/[block-name]/` to:
```
wp-content/plugins/[block-name]/
```

## Quick Reference

- **Block name**: `mis-bloques/ds-hero`
- **Textdomain**: `ds-hero`
- **API Version**: 3
- **Features**: Masked images, InnerBlocks, custom CSS, responsive padding, overlay

## Adding New Blocks

1. Create folder: `src/blocks/[block-name]/`
2. Create `block.json` with attributes
3. Create `index.js` - register block
4. Create `edit.js` - editor component
5. Create `save.js` - frontend render
6. Update `webpack.config.js` - add entry point
7. Run `npm run build`
8. Copy `dist/[block-name]/` to WordPress

## CSS Architecture

- Use CSS classes, NOT inline styles
- Generate uniqueID for each block instance
- Classes follow pattern: `.ds-hero-{uniqueID}`
