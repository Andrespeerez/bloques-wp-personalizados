---
name: gutenberg-blocks-development
description: "Use when creating custom Gutenberg blocks with @wordpress/scripts: block registration, edit/save components, InspectorControls with tabs (General/Style/Advanced), responsive controls, InnerBlocks, masked images, dynamic CSS generation, custom CSS editor (CodeMirror), and styling with CSS custom properties."
compatibility: "Targets WordPress 6.0+ with @wordpress packages. Requires Node.js build environment."
---

# Gutenberg Blocks Development

## When to use

Use this skill for creating Gutenberg blocks:
- creating new blocks from scratch with @wordpress/create-block
- building blocks with InspectorControls panels organized in tabs (Kadence-style)
- implementing responsive settings (desktop/tablet/mobile)
- adding masked image functionality (image + mask PNG)
- using InnerBlocks for flexible content
- adding dynamic CSS generation in JS
- adding custom CSS support with CodeMirror editor
- styling with CSS custom properties

## Project Structure

```
bloques_personalizados/
├── src/blocks/ds-hero/           # Block source code
│   ├── block.json                # Metadata, attributes, supports
│   ├── index.js                   # Block registration
│   ├── edit.js                   # Editor component (InspectorControls + tabs)
│   ├── save.js                   # Frontend render
│   ├── custom-css-editor.js      # CodeMirror CSS editor
│   ├── style.scss                # Frontend styles
│   └── editor.scss               # Editor-only styles + tabs styles
├── dist/ds-hero/                 # Compiled output
├── webpack.config.js             # Webpack config
└── package.json                  # Dependencies
```

## Build Commands

```bash
npm install          # Install dependencies
npm run build        # Production build
npm run start        # Development with hot reload
npm run lint:js      # Lint JavaScript
npm run lint:css     # Lint CSS/SCSS
```

## Quick Start - New Block

### 1. Create scaffold with @wordpress/create-block

```bash
npx @wordpress/create-block@latest block-name --namespace my-plugin --title "Block Title" --category design --no-plugin
```

### 2. Setup package.json

```json
{
    "scripts": {
        "build": "wp-scripts build",
        "start": "wp-scripts start"
    },
    "devDependencies": {
        "@wordpress/scripts": "^30.0.0"
    }
}
```

### 3. Configure block.json

```json
{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "my-plugin/my-block",
    "version": "0.1.0",
    "title": "My Block",
    "category": "design",
    "textdomain": "my-plugin",
    "supports": {
        "html": false,
        "anchor": true,
        "align": ["wide", "full"]
    },
    "attributes": {
        "uniqueID": { "type": "string", "default": "" },
        "customCSS": { "type": "string", "default": "" }
    },
    "editorScript": "file:../../dist/my-block/index.js",
    "editorStyle": "file:../../dist/my-block/index.css",
    "style": "file:../../dist/my-block/style-index.css"
}
```

## Inspector Tabs Pattern (Kadence-style)

Organize InspectorControls into three tabs: **General**, **Style**, **Advanced**.

### InspectorTabs Component

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

### Tab Organization

| Tab | Contents |
|-----|----------|
| **General** | Main content settings, masked images, InnerBlocks |
| **Style** | Colors, backgrounds, spacing, layout, responsive |
| **Advanced** | Custom CSS, HTML anchor, visibility |

### Complete edit.js Structure

```javascript
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls, MediaPlaceholder, MediaReplaceFlow } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl, Button, BaseControl, ColorPicker, TextareaControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import './editor.scss';

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

function generateUniqueId( prefix = 'ds' ) {
    return prefix + '-' + Math.random().toString( 36 ).substring( 2, 9 );
}

export default function Edit( { attributes, setAttributes, clientId } ) {
    const { customCSS, uniqueID } = attributes;
    const [ activeTab, setActiveTab ] = useState( 'general' );
    const [ deviceType, setDeviceType ] = useState( 'desktop' );

    useEffect( () => {
        if ( ! uniqueID ) {
            setAttributes( { uniqueID: generateUniqueId() } );
        }
    }, [ clientId ] );

    const blockProps = useBlockProps( {
        className: `ds-hero${ uniqueID ? ' ds-hero-' + uniqueID : '' }`,
    } );

    return (
        <>
            <InspectorControls>
                <InspectorTabs currentTab={ activeTab } onTabChange={ setActiveTab } />

                { activeTab === 'general' && (
                    <PanelBody title={ __( 'Content', 'ds-hero' ) } initialOpen={ true }>
                        {/* General controls */}
                        <InnerBlocks
                            allowedBlocks={ [ 'core/heading', 'core/paragraph', 'core/buttons' ] }
                            template={ [ [ 'core/paragraph', { placeholder: 'Add content...' } ] ] }
                        />
                    </PanelBody>
                ) }

                { activeTab === 'style' && (
                    <>
                        <PanelBody title={ __( 'Background', 'ds-hero' ) } initialOpen={ true }>
                            {/* Color, gradient, image controls */}
                        </PanelBody>
                        <PanelBody title={ __( 'Spacing', 'ds-hero' ) } initialOpen={ false }>
                            <BaseControl label={ __( 'Device', 'ds-hero' ) }>
                                <Button isPressed={ deviceType === 'desktop' } onClick={ () => setDeviceType( 'desktop' ) } variant="secondary">D</Button>
                                <Button isPressed={ deviceType === 'tablet' } onClick={ () => setDeviceType( 'tablet' ) } variant="secondary">T</Button>
                                <Button isPressed={ deviceType === 'mobile' } onClick={ () => setDeviceType( 'mobile' ) } variant="secondary">M</Button>
                            </BaseControl>
                            {/* Padding controls based on deviceType */}
                        </PanelBody>
                    </>
                ) }

                { activeTab === 'advanced' && (
                    <PanelBody title={ __( 'Custom CSS', 'ds-hero' ) } initialOpen={ true }>
                        <TextareaControl
                            label={ __( 'Custom CSS', 'ds-hero' ) }
                            value={ customCSS || '' }
                            onChange={ ( value ) => setAttributes( { customCSS: value } ) }
                            placeholder={ '.my-block { ... }' }
                            rows={ 8 }
                            style={ { fontFamily: 'monospace', fontSize: '12px' } }
                        />
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

## Dynamic CSS Generation Pattern

Generate CSS dynamically based on block attributes:

### generateBlockCSS Function

```javascript
function generateBlockCSS( uniqueId, attributes ) {
    const {
        backgroundColor,
        backgroundType,
        backgroundGradient,
        backgroundImage,
        paddingDesktop,
        paddingTablet,
        paddingMobile,
    } = attributes;

    let css = `.ds-hero-${ uniqueId } {\n`;
    css += `    background-color: ${ backgroundColor || '#0d1b3e' };\n`;
    
    if ( backgroundType === 'gradient' && backgroundGradient ) {
        css += `    background-image: ${ backgroundGradient };\n`;
    } else if ( backgroundType === 'image' && backgroundImage?.url ) {
        css += `    background-image: url(${ backgroundImage.url });\n`;
    }
    
    css += `    padding: ${ paddingDesktop[ 0 ] }px ${ paddingDesktop[ 1 ] }px ${ paddingDesktop[ 2 ] }px ${ paddingDesktop[ 3 ] }px;\n`;
    css += `}\n\n`;

    css += `@media (max-width: 1024px) {\n`;
    css += `    .ds-hero-${ uniqueId } {\n`;
    css += `        padding: ${ paddingTablet[ 0 ] }px ${ paddingTablet[ 1 ] }px ${ paddingTablet[ 2 ] }px ${ paddingTablet[ 3 ] }px;\n`;
    css += `    }\n`;
    css += `}\n\n`;

    css += `@media (max-width: 767px) {\n`;
    css += `    .ds-hero-${ uniqueId } {\n`;
    css += `        padding: ${ paddingMobile[ 0 ] }px ${ paddingMobile[ 1 ] }px ${ paddingMobile[ 2 ] }px ${ paddingMobile[ 3 ] }px;\n`;
    css += `    }\n`;
    css += `}\n`;

    return css;
}
```

### Use in edit.js

```javascript
export default function Edit( { attributes } ) {
    const { uniqueID, customCSS } = attributes;
    
    const blockCSS = uniqueID ? generateBlockCSS( uniqueID, attributes ) : '';
    const fullCSS = blockCSS + ( customCSS || '' );

    return (
        <>
            { fullCSS && <style>{ fullCSS }</style> }
            <div { ...blockProps }>
                <InnerBlocks />
            </div>
        </>
    );
}
```

## Masked Image Pattern

For blocks with masked images (image + PNG mask):

### Attributes
```json
"maskEnabled": { "type": "boolean", "default": true },
"maskedImageUrl": { "type": "string", "default": "" },
"maskedImageId": { "type": "number", "default": 0 },
"maskImageUrl": { "type": "string", "default": "" },
"maskImageId": { "type": "number", "default": 0 },
"maskPositionPreset": { "type": "string", "default": "bottom right" },
"maskPositionX": { "type": "number", "default": "" },
"maskPositionY": { "type": "number", "default": "" },
"maskWidth": { "type": "number", "default": 480 },
"maskHeight": { "type": "number", "default": 420 }
```

### edit.js Controls
```javascript
<ToggleControl
    label={ __( 'Enable Masked Image', 'ds-hero' ) }
    checked={ maskEnabled }
    onChange={ ( value ) => setAttributes( { maskEnabled: value } ) }
/>

{ maskEnabled && (
    <>
        <BaseControl label={ __( 'Image to Mask', 'ds-hero' ) }>
            { maskedImageUrl ? (
                <MediaReplaceFlow
                    mediaId={ maskedImageId }
                    mediaURL={ maskedImageUrl }
                    onSelectMedia={ ( media ) => setAttributes( { maskedImageUrl: media.url, maskedImageId: media.id } ) }
                    onRemoveMedia={ () => setAttributes( { maskedImageUrl: '', maskedImageId: 0 } ) }
                />
            ) : (
                <MediaPlaceholder icon="format-image" onSelect={ ( media ) => setAttributes( { maskedImageUrl: media.url, maskedImageId: media.id } ) } accept="image/*" allowedTypes={ [ 'image' ] } />
            ) }
        </BaseControl>

        <BaseControl label={ __( 'Mask (PNG with transparency)', 'ds-hero' ) }>
            { maskImageUrl ? (
                <MediaReplaceFlow mediaId={ maskImageId } mediaURL={ maskImageUrl } onSelectMedia={ ( media ) => setAttributes( { maskImageUrl: media.url, maskImageId: media.id } ) } onRemoveMedia={ () => setAttributes( { maskImageUrl: '', maskImageId: 0 } ) } />
            ) : (
                <MediaPlaceholder icon="format-image" onSelect={ ( media ) => setAttributes( { maskImageUrl: media.url, maskImageId: media.id } ) } accept="image/*" allowedTypes={ [ 'image' ] } />
            ) }
        </BaseControl>

        <SelectControl
            label={ __( 'Position', 'ds-hero' ) }
            value={ maskPositionPreset }
            options={ [
                { value: 'top left', label: 'Top Left' },
                { value: 'top center', label: 'Top Center' },
                { value: 'top right', label: 'Top Right' },
                { value: 'center left', label: 'Center Left' },
                { value: 'center center', label: 'Center' },
                { value: 'center right', label: 'Center Right' },
                { value: 'bottom left', label: 'Bottom Left' },
                { value: 'bottom center', label: 'Bottom Center' },
                { value: 'bottom right', label: 'Bottom Right' },
                { value: 'custom', label: 'Custom' },
            ] }
            onChange={ ( value ) => setAttributes( { maskPositionPreset: value } ) }
        />
    </>
) }
```

### save.js Render
```javascript
{ maskEnabled && maskedImageUrl && (
    <div className="ds-hero__masked-image" data-position={ maskPositionPreset }>
        <img src={ maskedImageUrl } alt="" />
    </div>
) }
```

### CSS
```scss
.ds-hero__masked-image {
    position: absolute;
    mask-image: var(--ds-mask-image);
    -webkit-mask-image: var(--ds-mask-image);
    mask-size: cover;
}

.ds-hero__masked-image[data-position="bottom right"] {
    bottom: 0;
    right: 0;
}
```

## Custom CSS Editor with CodeMirror

For advanced custom CSS editing, use a CodeMirror-based editor:

### custom-css-editor.js
```javascript
import { TextareaControl } from '@wordpress/components';

export default function CustomCSSEditor( { label, value, onChange } ) {
    return (
        <TextareaControl
            label={ label }
            value={ value }
            onChange={ onChange }
            placeholder={ '.ds-hero { ... }' }
            rows={ 10 }
            style={ { 
                fontFamily: 'monospace', 
                fontSize: '12px',
                whiteSpace: 'pre',
                overflowX: 'auto' 
            } }
        />
    );
}
```

## Responsive Controls Pattern

### Device State
```javascript
const [ deviceType, setDeviceType ] = useState( 'desktop' );

// In padding control
const getPadding = () => {
    if ( deviceType === 'mobile' ) return paddingMobile;
    if ( deviceType === 'tablet' ) return paddingTablet;
    return paddingDesktop;
};

const updatePadding = ( index, value ) => {
    const padding = getPadding();
    const newPadding = [ ...padding ];
    newPadding[ index ] = value;
    if ( deviceType === 'mobile' ) {
        setAttributes( { paddingMobile: newPadding } );
    } else if ( deviceType === 'tablet' ) {
        setAttributes( { paddingTablet: newPadding } );
    } else {
        setAttributes( { paddingDesktop: newPadding } );
    }
};
```

### Device Buttons
```javascript
<BaseControl label={ __( 'Device', 'ds-hero' ) }>
    <Button
        isPressed={ deviceType === 'desktop' }
        onClick={ () => setDeviceType( 'desktop' ) }
        variant="secondary"
    >
        D
    </Button>
    <Button
        isPressed={ deviceType === 'tablet' }
        onClick={ () => setDeviceType( 'tablet' ) }
        variant="secondary"
    >
        T
    </Button>
    <Button
        isPressed={ deviceType === 'mobile' }
        onClick={ () => setDeviceType( 'mobile' ) }
        variant="secondary"
    >
        M
    </Button>
</BaseControl>
```

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Block name | `namespace/block-name` | `mis-bloques/ds-hero` |
| CSS classes | BEM + kebab-case | `.ds-hero`, `.ds-hero__inner` |
| CSS custom properties | `--prefix-` | `--ds-bg-color`, `--ds-mask-image` |
| Data attributes | `data-*` | `data-position="bottom right"` |
| Unique ID | `prefix-random` | `ds-abc1234` |

## Common Issues

- **Build fails**: Run `npm install` first
- **Block not appearing**: Check textdomain in block.json matches plugin header
- **Styles not applying**: Use `useBlockProps()` correctly
- **Mask not working**: Ensure mask is PNG with transparency
- **Custom CSS not applying**: Verify `<style>` tag is rendered in save.js
- **Responsive not working**: Check media query breakpoints (1024px tablet, 767px mobile)
