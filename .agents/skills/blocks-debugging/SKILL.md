---
name: blocks-debugging
description: "Diagnostica y corrige errores comunes en bloques Gutenberg: bloques que no aparecen, errores en el editor, problemas de build."
---

# Blocks Debugging - Errores Comunes y Soluciones

## Errores Frecuentes

### 1. PHP visible como texto en el navegador

**Síntoma:** El código PHP se muestra como texto plano en el dashboard de WordPress.

**Causa:** Los archivos PHP del bloque están en la carpeta del proyecto, no en `wp-content/plugins/`.

**Solución:**
```bash
# Copiar archivos compilados a la carpeta de plugins
cp -r dist/apg-hero/* wp-content/plugins/apg-hero/
cp -r dist/apg-google-reviews/* wp-content/plugins/apg-google-reviews/
```

---

### 2. Bloque no aparece en el inserter

**Síntoma:** El bloque no se muestra en el añadidor de bloques de Gutenberg.

**Causas posibles:**
- Plugin no activado
- block.json con errores de sintaxis
- Assets (index.js, index.asset.php) no generados correctamente
- Textdomain no coincide entre block.json y PHP

**Solución:**
1. Activar el plugin en WordPress
2. Verificar que `block.json` tenga la estructura correcta
3. Ejecutar `npm run build` para generar los assets
4. Verificar que el textdomain en block.json coincida con el del plugin

---

### 3. "This block has encountered an error"

**Síntoma:** El bloque muestra error y no puede previsualizarse en el editor.

**Causas comunes:**

#### a) Variable no definida en generateBlockCSS
```javascript
// ERROR: contentMaxWidth no está en la destructuración
const cmw = contentMaxWidth || { value: 1200, unit: 'px' };

// CORRECTO: Incluir en la destructuración
const {
    contentMaxWidth,  // ← AGREGAR ESTO
    ...
} = attributes;
```

#### b) Import faltante en save.js
```javascript
// ERROR
import { useBlockProps } from '@wordpress/block-editor';

// CORRECTO
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
```

#### c) useEffect con dependencias faltantes
```javascript
// ERROR
useEffect(() => {
    if ( ! uniqueID ) {
        setAttributes( { uniqueID: generateUniqueId() } );
    }
}, []);

// CORRECTO: incluir clientId en dependencias
useEffect(() => {
    if ( ! uniqueID ) {
        setAttributes( { uniqueID: generateUniqueId() } );
    }
}, [clientId]);
```

---

### 4. Error de webpack: "filesToCopy is not defined"

**Síntoma:** Error en consola durante `npm run build`.

**Causa:** Error de sintaxis en webpack.config.js.

```javascript
// ERROR
const extraFiles = blockName === 'apg-google-reviews' ? ['mock-data.php', 'render.php'] : [];
filesToCopy.forEach(file => {  // ← filesToCopy no está definido

// CORRECTO
const extraFiles = blockName === 'apg-google-reviews' ? ['mock-data.php', 'render.php'] : [];
const filesToCopy = ['block.json', `${blockName}.php`, ...extraFiles];
filesToCopy.forEach(file => {
```

---

## Registro de Bloques - Método Correcto

### block.json (recomendado)
```json
{
    "name": "apg/hero",
    "editorScript": "file:./index.js",
    "editorStyle": "file:./index.css",
    "style": "file:./style-index.css"
}
```

### PHP (mínimo)
```php
<?php
/**
 * Plugin Name: APG Hero Block
 * Text Domain: apg-hero
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

register_block_type( __DIR__ );
```

WordPress会自动读取 block.json y cargar los assets correctos.

---

## Checklist de Verificación

- [ ] Archivos copiados a `wp-content/plugins/`
- [ ] Plugin activado en WordPress
- [ ] `npm run build` ejecuta sin errores
- [ ] `block.json` tiene `file:./index.js` (no rutas absolutas)
- [ ] PHP usa `register_block_type(__DIR__)`
- [ ] textdomain coincide en block.json y PHP
- [ ] Todos los imports en edit.js y save.js están completos
- [ ] Variables destructuradas coinciden con las usadas en el código