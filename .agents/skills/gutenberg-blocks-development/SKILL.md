---
name: gutenberg-blocks-development
description: "Use when you need a general overview of Gutenberg block development. Provides context on block types, build commands, and pointers to specialized skills for detailed implementation. Start here for context, then use specialized skills for specific features."
---

# Gutenberg Blocks Development - Overview

## When to Use This Skill

- Getting context on block development
- Understanding build commands
- Overview of block types available
- Finding the right specialized skill

For specific implementations, see specialized skills below.

---

## Block Types

### Client-Side Render
- JavaScript generates frontend HTML
- CSS can be generated dynamically in JS
- Immediate feedback in editor

### Server-Side Render (PHP)
- PHP generates frontend HTML
- External API integration
- Mock data for demo mode

---

## Build Commands

```bash
npm install      # Install dependencies
npm run build    # Production build
npm run start    # Development with hot reload
npm run lint:js # Lint JavaScript
npm run lint:css # Lint CSS/SCSS
```

---

## Specialized Skills

Use these skills for specific implementations:

### Kadence-Style Blocks
- InspectorControls with tabs
- Responsive device switching
- CodeMirror CSS editor
- Dynamic CSS generation

**Use when**: Creating blocks with professional UI patterns

### Server-Side Render Blocks
- PHP server rendering
- Mock data for demo
- External API integration
- WordPress security practices

**Use when**: Creating blocks that render on server

### Skill Manager
- Creating new skills
- Updating skills index
- Consolidating knowledge

**Use when**: Managing project knowledge

---

## Quick Reference

| Need | Skill |
|------|-------|
| Professional UI (tabs, responsive) | `kadence-style-blocks` |
| PHP server-side rendering | `server-side-render-blocks` |
| Manage/create skills | `skill-manager` |
| General overview | This skill |

---

## Related Skills

- `kadence-style-blocks` - UI patterns
- `server-side-render-blocks` - PHP rendering
- `skill-manager` - Skill management
