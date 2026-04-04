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
│   ├── ds-hero/                 # Block: Hero con imagen con máscara
│   │   ├── block.json           # Metadata & attributes
│   │   ├── index.js             # Block registration
│   │   ├── edit.js              # Editor component
│   │   ├── save.js              # Frontend render
│   │   ├── custom-css-editor.js # CodeMirror CSS editor
│   │   ├── style.scss           # Frontend styles
│   │   ├── editor.scss          # Editor styles
│   │   └── ds-hero.php          # Plugin header
│   └── testimonial/             # Block: Google Places Reviews
│       ├── block.json           # Metadata & attributes
│       ├── index.js             # Block registration
│       ├── edit.js              # Editor component (InspectorControls)
│       ├── save.js              # Returns null (PHP render)
│       ├── render.php           # Server-side render logic
│       ├── mock-data.php        # Demo data for preview
│       ├── style.scss           # Frontend styles
│       ├── editor.scss          # Editor styles
│       └── testimonial.php      # Plugin header
├── dist/                        # Production-ready plugins
│   ├── ds-hero/                 # Copy to wp-content/plugins/ds-hero/
│   └── testimonial/             # Copy to wp-content/plugins/testimonial/
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
3. Activate the plugin in WordPress admin

## Quick Reference

### ds-hero Block
- **Block name**: `mis-bloques/ds-hero`
- **Textdomain**: `ds-hero`
- **Features**: Masked images, InnerBlocks, custom CSS, responsive padding, overlay

### testimonial Block
- **Block name**: `blocks/testimonial`
- **Textdomain**: `testimonial`
- **Features**: Google Places API integration, mock data for demo, server-side render

## Adding New Blocks

### 1. Create folder structure

```bash
mkdir src/blocks/[block-name]/
```

### 2. Required files per block

| File | Purpose |
|------|---------|
| `block.json` | Metadata, attributes, supports |
| `index.js` | Block registration |
| `edit.js` | Editor component with InspectorControls |
| `save.js` | Frontend render (or null for PHP render) |
| `style.scss` | Frontend styles |
| `editor.scss` | Editor styles |
| `[block-name].php` | Plugin header and registration |
| `render.php` | Server-side render (optional) |
| `mock-data.php` | Demo data for preview (optional) |

### 3. Update webpack.config.js

Add block name to the `blocks` array:

```javascript
const blocks = ['ds-hero', 'testimonial', 'new-block'];
```

Add extra files if needed:

```javascript
const extraFiles = blockName === 'testimonial' ? ['mock-data.php'] : [];
const filesToCopy = ['render.php', 'block.json', `${blockName}.php`, ...extraFiles];
```

### 4. Build and deploy

```bash
npm run build
# Copy dist/[block-name]/ to WordPress plugins folder
```

## CSS Architecture

- Use CSS classes, NOT inline styles
- Generate uniqueID for each block instance
- Classes follow pattern: `.ds-hero-{uniqueID}`, `.testimonial-{uniqueID}`

## Block Types

### Client-side Render (JS)
- `save.js` returns React component
- CSS generated in JS and injected

### Server-side Render (PHP)
- `save.js` returns `<div {...useBlockProps.save()} />`
- `render.php` handles frontend output
- Use `include __DIR__ . '/mock-data.php'` for demo data

### Example: PHP Render Block (testimonial)

**edit.js:**
```javascript
export default function Edit({ attributes, setAttributes, clientId }) {
    const { placeId, apiKey, cantidad, uniqueId } = attributes;
    
    return (
        <InspectorControls>
            <PanelBody title={__('Settings')}>
                <TextControl label="API Key" value={apiKey} onChange={v => setAttributes({apiKey: v})} />
                <TextControl label="Place ID" value={placeId} onChange={v => setAttributes({placeId: v})} />
                <RangeControl label="Cantidad" value={cantidad} onChange={v => setAttributes({cantidad: v})} min={1} max={10} />
            </PanelBody>
        </InspectorControls>
    );
}
```

**save.js:**
```javascript
import { useBlockProps } from '@wordpress/block-editor';
export default function save() {
    return <div {...useBlockProps.save()} />;
}
```

**render.php:**
```php
<?php
$place_id = isset($attributes['placeId']) ? sanitize_text_field($attributes['placeId']) : '';
$api_key = isset($attributes['apiKey']) ? sanitize_text_field($attributes['apiKey']) : '';
$is_demo = empty($place_id) && empty($api_key);

if ($is_demo) {
    $mock_data = include __DIR__ . '/mock-data.php';
    $reviews = array_slice($mock_data, 0, $attributes['cantidad']);
} else {
    // Fetch from API
    // ...
}
?>
<section>
    <?php foreach ($reviews as $review) : ?>
        <div class="review-item">
            <strong><?php echo esc_html($review['author_name']); ?></strong>
            <p><?php echo esc_html($review['text']); ?></p>
        </div>
    <?php endforeach; ?>
</section>
```

**block.json:**
```json
{
    "name": "blocks/testimonial",
    "attributes": {
        "uniqueId": { "type": "string", "default": "" },
        "placeId": { "type": "string", "default": "" },
        "apiKey": { "type": "string", "default": "" },
        "cantidad": { "type": "number", "default": 4 }
    },
    "render": "file:./render.php"
}
```
