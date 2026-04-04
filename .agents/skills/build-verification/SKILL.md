---
name: build-verification
description: "Use after running npm run build to verify the project structure is correct. Checks dist/ folder contains expected block folders without unwanted directories like 'blocks/'."
---

# Build Verification

## When to Use This Skill

- After running `npm run build`
- When verifying the build output structure
- Before deploying blocks to WordPress

## Post-Build Verification Checklist

### 1. Verify dist/ Structure

After build, `dist/` should contain only block folders:

```
dist/
├── apg-hero/
└── apg-google-reviews/
```

**NOT**:
```
dist/
├── blocks/              ❌ This folder should NOT exist
├── apg-hero/
└── apg-google-reviews/
```

### 2. Verify Each Block Folder

Each block in `dist/` must have:

```
dist/[block-name]/
├── index.js
├── index.asset.php
├── block.json
├── editor.css
├── editor-rtl.css
├── style.css
├── style-rtl.css
├── render.php           (if block has PHP render)
└── mock-data.php        (if block uses mock data)
```

### 3. Verify No Orphan Files in dist/

The following files/folders should NOT exist in `dist/`:

- `dist/blocks/` - residual folder from webpack default config
- Any `.css` files directly in `dist/` (they should be moved to block folders)

### 4. Verify block.json is Valid

Each block's `block.json` should:

- Have `apiVersion: 3`
- Have correct `name` (namespace/block-name)
- Have `attributes` defined
- Point to correct asset files:
  ```json
  "editorScript": "file:./index.js"
  "editorStyle": "file:./editor.css"
  "style": "file:./style.css"
  ```

## Verification Commands

```bash
# Check dist structure
ls -la dist/

# Check no blocks/ folder exists
test ! -d dist/blocks && echo "OK: No blocks/ folder" || echo "ERROR: blocks/ folder exists"

# Check each block has required files
for block in apg-hero apg-google-reviews; do
    for file in index.js index.asset.php block.json editor.css style.css; do
        test -f "dist/$block/$file" && echo "OK: $block/$file" || echo "MISSING: $block/$file"
    done
done
```

## Common Issues After Build

| Issue | Cause | Solution |
|-------|-------|----------|
| `dist/blocks/` exists | Webpack default config | Remove with `rm -rf dist/blocks` or add cleanup to webpack plugin |
| CSS files in dist/ root | Files not moved to block folders | Webpack plugin should move them |
| Missing `render.php` | File not in `filesToCopy` array | Add to webpack config `copyBlockAssetsPlugin` |

## Webpack Config Cleanup

The webpack config must include cleanup logic to remove unwanted folders:

```javascript
const copyBlockAssetsPlugin = () => ({
    apply(compiler) {
        compiler.hooks.afterEmit.tap('CopyBlockAssets', () => {
            // ... existing copy logic ...

            // Cleanup: remove dist/blocks/ if it exists
            const blocksDir = path.resolve(__dirname, 'dist/blocks');
            if (fs.existsSync(blocksDir)) {
                fs.rmSync(blocksDir, { recursive: true, force: true });
            }
        });
    }
});
```

## Related Skills

- `gutenberg-blocks-development` - Project structure overview
- `skill-manager` - How to create and manage skills
