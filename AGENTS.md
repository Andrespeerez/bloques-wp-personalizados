# AGENTS.md - WordPress Gutenberg Blocks Development

## Project Overview

This repository contains custom WordPress Gutenberg blocks built with `@wordpress/scripts`. Each block lives in its own directory under `ds-hero/` (future blocks will follow the same pattern).

## Build Commands

### Main Commands (run from `ds-hero/` directory)

```bash
# Install dependencies
npm install

# Build for production (creates build/ folder)
npm run build

# Development mode with hot reload
npm run start

# Linting
npm run lint:js        # Lint JavaScript
npm run lint:css       # Lint CSS/SCSS
```

### WordPress Plugin Activation

Copy the entire `ds-hero/` folder to your WordPress installation:
```
wp-content/plugins/ds-hero/
```

Then activate the plugin from WordPress admin.

## Code Style Guidelines

### JavaScript/JSX Conventions

**Imports (order matters):**
1. External packages: `@wordpress/*`
2. WordPress components: `@wordpress/components`
3. Internal imports: `./edit`, `./save`, `./block.json`
4. Side-effect imports: `./style.scss`, `./editor.scss`

```javascript
// Good
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls, MediaPlaceholder, MediaReplaceFlow } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl, Button, BaseControl, ColorPicker, TextareaControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';
```

**Component Structure:**
- Use functional components with `function` keyword (not arrow for export)
- Always destructure props: `export default function Edit( { attributes, setAttributes } )`
- Return JSX with parentheses for multi-line returns
- Use tabs for InspectorControls organization

```javascript
// Good
export default function Edit( { attributes, setAttributes } ) {
    const { title, content, customCSS } = attributes;
    const [ activeTab, setActiveTab ] = useState( 'general' );
    
    const blockProps = useBlockProps( {
        className: `ds-hero`,
        style: { '--ds-bg-color': backgroundColor },
    } );
    
    return (
        <>
            <InspectorControls>
                <InspectorTabs currentTab={ activeTab } onTabChange={ setActiveTab } />

                { activeTab === 'general' && (
                    <PanelBody title={ __( 'Content', 'ds-hero' ) }>
                        {/* content controls */}
                    </PanelBody>
                ) }

                { activeTab === 'style' && (
                    <PanelBody title={ __( 'Background', 'ds-hero' ) }>
                        {/* style controls */}
                    </PanelBody>
                ) }

                { activeTab === 'advanced' && (
                    <PanelBody title={ __( 'Custom CSS', 'ds-hero' ) }>
                        <TextareaControl ... />
                    </PanelBody>
                ) }
            </InspectorControls>

            { customCSS && <style>{ customCSS }</style> }

            <div { ...blockProps }>
                <InnerBlocks />
            </div>
        </>
    );
}
```

### Inspector Tabs Pattern

Organize InspectorControls into three tabs:

| Tab | Contents |
|-----|----------|
| **General** | Main content settings, masked images, InnerBlocks |
| **Style** | Colors, backgrounds, spacing, layout |
| **Advanced** | Custom CSS, HTML anchor, visibility |

```javascript
function InspectorTabs( { currentTab, onTabChange } ) {
    const tabs = [
        { name: 'general', title: __( 'General', 'ds-hero' ) },
        { name: 'style', title: __( 'Style', 'ds-hero' ) },
        { name: 'advanced', title: __( 'Advanced', 'ds-hero' ) },
    ];

    return (
        <div className="components-tab-panel__tabs">
            { tabs.map( ( tab ) => (
                <button
                    key={ tab.name }
                    className={ `components-tab-panel__tab ${ currentTab === tab.name ? 'is-active' : '' }` }
                    onClick={ () => onTabChange( tab.name ) }
                >
                    { tab.title }
                </button>
            ) ) }
        </div>
    );
}
```

### Attributes in block.json

- Use `apiVersion: 3`
- Define types: `string`, `number`, `boolean`, `array`, `object`
- Always provide `default` values
- Responsive values use arrays: `[desktop, tablet, mobile]`
- Include `customCSS` attribute for custom styling

```json
{
    "apiVersion": 3,
    "name": "mis-bloques/ds-hero",
    "attributes": {
        "backgroundColor": { "type": "string", "default": "#0d1b3e" },
        "maskedImageUrl": { "type": "string", "default": "" },
        "maskImageUrl": { "type": "string", "default": "" },
        "maskPositionPreset": { "type": "string", "default": "bottom right" },
        "customCSS": { "type": "string", "default": "" }
    }
}
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Block name | `namespace/block-name` | `mis-bloques/ds-hero` |
| CSS classes | BEM + kebab-case | `.ds-hero`, `.ds-hero__inner` |
| CSS custom properties | `--prefix-` | `--ds-bg-color`, `--ds-mask-image` |
| Data attributes | `data-*` | `data-position="bottom right"` |
| State classes | `--modifier` | `.ds-hero--content-left` |

### CSS/SCSS Conventions

**File Structure:**
- `style.scss` - Frontend styles (loaded on frontend + editor)
- `editor.scss` - Editor-only styles (preview, UI, tabs)

**Styling Pattern:**
Use CSS custom properties for dynamic values from attributes:

```scss
.ds-hero {
    width: 100%;
    min-height: 100vh;
    background-color: var(--ds-bg-color, #0d1b3e);
    background-image: var(--ds-bg-image);
}

.ds-hero__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--ds-padding-top, 60px);
}

.ds-hero__masked-image {
    position: absolute;
    mask-image: var(--ds-mask-image);
    -webkit-mask-image: var(--ds-mask-image);
}

.ds-hero__masked-image[data-position="bottom right"] {
    bottom: 0;
    right: 0;
}
```

### PHP Conventions

```php
<?php
/**
 * Plugin Name:       DS Hero Block
 * Requires at least: 6.0
 * Requires PHP:      7.0
 * Version:           0.1.0
 * License:           GPL-2.0-or-later
 * Text Domain:       ds-hero
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function ds_hero_register_block() {
    $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php' );
    
    register_block_type( __DIR__, array(
        'editor_script' => 'ds-hero-editor',
        'style' => 'ds-hero-style',
    ) );
}
add_action( 'init', 'ds_hero_register_block' );
```

## Block Architecture

```
block-name/
├── block.json         # Metadata, attributes, supports
├── index.js           # Block registration (registerBlockType)
├── edit.js            # Editor component (InspectorControls + tabs)
├── save.js            # Frontend render
├── style.scss         # Frontend styles
├── editor.scss        # Editor-only styles
├── ds-hero.php        # Plugin header + block registration
├── webpack.config.js  # Webpack config
├── build/             # Compiled output (generated by build)
└── package.json       # Dependencies
```

## InnerBlocks Pattern

```javascript
<InnerBlocks
    allowedBlocks={ [ 'core/heading', 'core/paragraph', 'core/buttons' ] }
    template={ [
        [ 'core/paragraph', { placeholder: 'Add content...' } ],
    ] }
/>
```

## Masked Image Pattern

For blocks with image masking (image + mask PNG):

```javascript
// edit.js / save.js
<div 
    className="ds-hero__masked-image" 
    data-position={ maskPositionPreset }
>
    <img src={ maskedImageUrl } alt="" />
</div>
```

CSS:
```scss
.ds-hero__masked-image {
    mask-image: var(--ds-mask-image);
    -webkit-mask-image: var(--ds-mask-image);
    mask-size: var(--ds-mask-size, cover);
}
```

## Custom CSS Support

```javascript
// edit.js and save.js
{ customCSS && <style>{ customCSS }</style> }
```

## Common Issues

- **Build fails**: Run `npm install` to ensure dependencies are installed
- **Block not appearing**: Check `textdomain` in block.json matches plugin header
- **Styles not applying**: Verify CSS custom properties match attribute names in JS
- **Mask not working**: Ensure mask image is PNG with transparency
- **Custom CSS not applying**: Verify `<style>` tag is rendered in save.js
