---
name: kadence-style-blocks
description: "Use when creating Gutenberg blocks with professional UI patterns. Includes InspectorControls organized in tabs (General/Style/Advanced), responsive device switching (Desktop/Tablet/Mobile), CodeMirror custom CSS editor, InnerBlocks support, and dynamic CSS generation. Perfect for building customizable blocks with advanced styling controls."
---

# Kadence-Style Blocks

## When to Use This Skill

Creating Gutenberg blocks with:
- InspectorControls organized in tabs (General, Style, Advanced)
- Responsive controls with device switching
- Custom CSS editor with CodeMirror
- InnerBlocks for flexible content
- Dynamic CSS generation based on attributes

---

## Inspector Tabs Pattern

Organize InspectorControls into three tabs.

### Tab Component

```javascript
function InspectorTabs({ currentTab, onTabChange }) {
    const tabs = [
        { name: 'general', title: __('General', 'textdomain') },
        { name: 'style', title: __('Style', 'textdomain') },
        { name: 'advanced', title: __('Advanced', 'textdomain') },
    ];

    return (
        <div className="components-tab-panel__tabs">
            {tabs.map(tab => (
                <button
                    key={tab.name}
                    className={`components-tab-panel__tab ${currentTab === tab.name ? 'is-active' : ''}`}
                    onClick={() => onTabChange(tab.name)}
                >
                    {tab.title}
                </button>
            ))}
        </div>
    );
}
```

### Usage in Edit Component

```javascript
export default function Edit({ attributes, setAttributes, clientId }) {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <>
            <InspectorControls>
                <InspectorTabs currentTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === 'general' && (
                    <PanelBody title={__('Settings', 'textdomain')}>
                        {/* General controls */}
                    </PanelBody>
                )}

                {activeTab === 'style' && (
                    <>
                        <PanelBody title={__('Background', 'textdomain')}>
                            {/* Background controls */}
                        </PanelBody>
                        <PanelBody title={__('Spacing', 'textdomain')}>
                            {/* Spacing controls */}
                        </PanelBody>
                    </>
                )}

                {activeTab === 'advanced' && (
                    <PanelBody title={__('Custom CSS', 'textdomain')}>
                        <CustomCSSEditor />
                    </PanelBody>
                )}
            </InspectorControls>

            <div {...blockProps}>
                <InnerBlocks />
            </div>
        </>
    );
}
```

---

## Responsive Device Switching

### Device Switcher Component

```javascript
function DeviceSwitcher({ device, onChange }) {
    return (
        <BaseControl label={__('Device', 'textdomain')}>
            <Button
                isPressed={device === 'desktop'}
                onClick={() => onChange('desktop')}
                variant="secondary"
            >
                D
            </Button>
            <Button
                isPressed={device === 'tablet'}
                onClick={() => onChange('tablet')}
                variant="secondary"
            >
                T
            </Button>
            <Button
                isPressed={device === 'mobile'}
                onClick={() => onChange('mobile')}
                variant="secondary"
            >
                M
            </Button>
        </BaseControl>
    );
}
```

### Usage with Responsive Attributes

```javascript
export default function Edit({ attributes, setAttributes }) {
    const [deviceType, setDeviceType] = useState('desktop');
    const { paddingDesktop, paddingTablet, paddingMobile } = attributes;
    
    const getPadding = () => {
        if (deviceType === 'mobile') return paddingMobile;
        if (deviceType === 'tablet') return paddingTablet;
        return paddingDesktop;
    };

    const updatePadding = (index, value) => {
        const padding = [...getPadding()];
        padding[index] = value;
        
        if (deviceType === 'mobile') {
            setAttributes({ paddingMobile: padding });
        } else if (deviceType === 'tablet') {
            setAttributes({ paddingTablet: padding });
        } else {
            setAttributes({ paddingDesktop: padding });
        }
    };

    return (
        <>
            <DeviceSwitcher device={deviceType} onChange={setDeviceType} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <RangeControl
                    label={__('Top', 'textdomain')}
                    value={getPadding()[0]}
                    onChange={(value) => updatePadding(0, value)}
                    min={0}
                    max={200}
                />
                {/* Right, Bottom, Left controls... */}
            </div>
        </>
    );
}
```

---

## CodeMirror CSS Editor

### Dependencies

```bash
npm install @codemirror/lang-css @codemirror/state @codemirror/view @codemirror/autocomplete @codemirror/commands @codemirror/language codemirror
```

### Custom CSS Editor Component

```javascript
import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { BaseControl } from '@wordpress/components';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { css } from '@codemirror/lang-css';
import { defaultKeymap } from '@codemirror/commands';
import { autocompletion } from '@codemirror/autocomplete';

export default function CustomCSSEditor({ label, value, onChange }) {
    const editorRef = useRef(null);
    const viewRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current || viewRef.current) return;

        const state = EditorState.create({
            doc: value || '',
            extensions: [
                css(),
                autocompletion(),
                keymap.of(defaultKeymap),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        onChange(update.state.doc.toString());
                    }
                }),
                EditorView.theme({
                    '&': { height: '200px', fontSize: '13px' },
                    '.cm-scroller': { overflow: 'auto' },
                    '.cm-content': { fontFamily: 'monospace' },
                }),
            ],
        });

        viewRef.current = new EditorView({
            state,
            parent: editorRef.current,
        });

        return () => {
            viewRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (viewRef.current) {
            const currentValue = viewRef.current.state.doc.toString();
            if (currentValue !== value) {
                viewRef.current.dispatch({
                    changes: { from: 0, to: currentValue.length, insert: value || '' }
                });
            }
        }
    }, [value]);

    return (
        <BaseControl label={label}>
            <div
                ref={editorRef}
                className="custom-css-editor"
                style={{ border: '1px solid #ccc', borderRadius: '4px' }}
            />
        </BaseControl>
    );
}
```

---

## Dynamic CSS Generation

### CSS Generator Function

```javascript
function generateBlockCSS(uniqueId, attributes) {
    const {
        backgroundColor,
        paddingDesktop,
        paddingTablet,
        paddingMobile,
        customCSS,
    } = attributes;

    let css = `.block-${uniqueId} {\n`;
    css += `    background-color: ${backgroundColor};\n`;
    css += `    padding: ${paddingDesktop[0]}px ${paddingDesktop[1]}px ${paddingDesktop[2]}px ${paddingDesktop[3]}px;\n`;
    css += `}\n\n`;

    // Tablet
    css += `@media (max-width: 1024px) {\n`;
    css += `    .block-${uniqueId} {\n`;
    css += `        padding: ${paddingTablet[0]}px ${paddingTablet[1]}px ${paddingTablet[2]}px ${paddingTablet[3]}px;\n`;
    css += `    }\n`;
    css += `}\n\n`;

    // Mobile
    css += `@media (max-width: 767px) {\n`;
    css += `    .block-${uniqueId} {\n`;
    css += `        padding: ${paddingMobile[0]}px ${paddingMobile[1]}px ${paddingMobile[2]}px ${paddingMobile[3]}px;\n`;
    css += `    }\n`;
    css += `}\n`;

    return css + (customCSS || '');
}
```

### Usage in Edit Component

```javascript
export default function Edit({ attributes }) {
    const { uniqueID, customCSS } = attributes;
    const blockCSS = uniqueID ? generateBlockCSS(uniqueID, attributes) : '';
    const fullCSS = blockCSS + (customCSS || '');

    return (
        <>
            {fullCSS && <style>{fullCSS}</style>}
            <div {...blockProps}>...</div>
        </>
    );
}
```

### Usage in Save Component (Client-side render)

```javascript
export default function save({ attributes }) {
    const { uniqueID, customCSS } = attributes;
    const blockCSS = uniqueID ? generateBlockCSS(uniqueID, attributes) : '';
    const fullCSS = blockCSS + (customCSS || '');

    return (
        <>
            {fullCSS && <style>{fullCSS}</style>}
            <div {...useBlockProps.save()}>...</div>
        </>
    );
}
```

---

## InnerBlocks Usage

```javascript
import { InnerBlocks } from '@wordpress/block-editor';

export default function Edit({ attributes }) {
    return (
        <div {...blockProps}>
            <div className="block-inner">
                <InnerBlocks
                    allowedBlocks={undefined}
                    template={[
                        ['core/paragraph', { placeholder: 'Add content...' }],
                    ]}
                />
            </div>
        </div>
    );
}
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Tabs not switching | Ensure state is properly managed with `useState` |
| CodeMirror not rendering | Check that editor container has defined height |
| CSS not applying | Verify uniqueID is generated and used in CSS selectors |
| Responsive controls not working | Ensure attribute names match between getPadding and setAttributes |
| Styles bleeding | Use specific class selectors (`.block-{uniqueID}`) not generic classes |

---

## Related Skills

- `server-side-render-blocks` - For PHP server-side rendering pattern
