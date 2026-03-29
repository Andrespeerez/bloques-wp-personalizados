---
name: wp-plugin-development
description: "Use when developing WordPress plugins: architecture and hooks, activation/deactivation/uninstall, admin UI and Settings API, data storage, cron/tasks, security (nonces/capabilities/sanitization/escaping), and release packaging."
compatibility: "Targets WordPress 6.0+ (PHP 7.2+). Filesystem-based agent with bash + node."
---

# WP Plugin Development

## When to use

Use this skill for plugin work such as:
- creating or refactoring plugin structure (bootstrap, includes, namespaces/classes)
- adding hooks/actions/filters
- activation/deactivation/uninstall behavior
- adding settings pages / options / admin UI (Settings API)
- security fixes (nonces, capabilities, sanitization/escaping)
- packaging a release (build artifacts, readme, assets)

## Plugin Structure

For Gutenberg block plugins, follow this structure:

```
plugin-name/
├── plugin-name.php          # Main file with plugin header
├── index.php                # Security guard
├── block.json               # Block metadata
├── build/                   # Compiled JS/CSS
│   └── index.js
│   └── index.css
│   └── style-index.css
└── readme.txt               # WordPress.org readme
```

## Plugin Header

```php
<?php
/**
 * Plugin Name:       DS Hero Block
 * Requires at least: 6.0
 * Requires PHP:      7.2
 * Version:           0.1.0
 * License:           GPL-2.0-or-later
 * Text Domain:       ds-hero
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
```

## Block Registration

```php
function ds_hero_register_block() {
    $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php' );
    
    register_block_type( __DIR__, array(
        'editor_script' => 'ds-hero-editor',
        'style' => 'ds-hero-style',
        'editor_style' => 'ds-hero-editor-style',
    ) );
}
add_action( 'init', 'ds_hero_register_block' );
```

## Activation/Deactivation Hooks

```php
function ds_hero_activate() {
    // Register block types first
    ds_hero_register_block();
    
    // Flush rewrite rules if needed
    flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'ds_hero_activate' );

function ds_hero_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'ds_hero_deactivate' );
```

## Security Checklist

Always implement:

1. **Nonces** for form submissions:
```php
wp_nonce_field( 'ds_hero_action', 'ds_hero_nonce' );

// Verify
if ( ! isset( $_POST['ds_hero_nonce'] ) || 
     ! wp_verify_nonce( $_POST['ds_hero_nonce'], 'ds_hero_action' ) ) {
    return;
}
```

2. **Capability checks**:
```php
if ( ! current_user_can( 'edit_posts' ) ) {
    return;
}
```

3. **Sanitization**:
```php
$value = sanitize_text_field( $_POST['option_name'] );
$css = sanitize_textarea_field( $_POST['custom_css'] );
```

4. **Escaping in output**:
```php
echo esc_html( $value );
echo esc_attr( $class_name );
echo esc_url( $image_url );
```

## Settings API

```php
function ds_hero_settings_init() {
    register_setting( 'ds_hero_options', 'ds_hero_settings' );
    
    add_settings_section(
        'ds_hero_general',
        __( 'General Settings', 'ds-hero' ),
        '',
        'ds-hero'
    );
    
    add_settings_field(
        'ds_hero_default_color',
        __( 'Default Background Color', 'ds-hero' ),
        'ds_hero_color_field_callback',
        'ds_hero',
        'ds_hero_general'
    );
}
add_action( 'admin_init', 'ds_hero_settings_init' );

function ds_hero_color_field_callback() {
    $settings = get_option( 'ds_hero_settings' );
    $color = isset( $settings['default_color'] ) ? $settings['default_color'] : '#0d1b3e';
    ?>
    <input type="text" name="ds_hero_settings[default_color]" value="<?php echo esc_attr( $color ); ?>" class="regular-text" />
    <?php
}
```

## Uninstall

```php
// uninstall.php
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

delete_option( 'ds_hero_settings' );
```

Or:

```php
register_uninstall_hook( __FILE__, 'ds_hero_uninstall' );

function ds_hero_uninstall() {
    delete_option( 'ds_hero_settings' );
}
```

## Common Issues

- **Activation hook not firing**: Hook must be registered at top-level, not inside another hook
- **Settings not saving**: Check option group matches register_setting
- **Block not appearing**: Verify textdomain in block.json matches plugin header
- **Security issues**: Always validate input and escape output

## WordPress.org Readme Format

```txt
=== Plugin Name ===
Contributors: username
Tags: block, gutenberg
Requires at least: 6.0
Tested up to: 6.4
Stable tag: 0.1.0
License: GPL v2 or later

Description: Your block description.

== Installation ==
1. Upload the plugin files to the `/wp-content/plugins/plugin-name` directory
2. Activate the plugin through the 'Plugins' screen in WordPress

== Changelog ==
= 0.1.0 =
* Initial release
```
