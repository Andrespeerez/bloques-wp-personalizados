/**
 * Plugin Name:       APG Hero Block
 * Description:       Bloque hero personalizable con imagen con mascara
 * Requires at least: 6.0
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Tu Nombre
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       apg-hero
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function apg_hero_register_block() {
	$asset_file = include( plugin_dir_path( __FILE__ ) . 'index.asset.php' );

	wp_register_script(
		'apg-hero-editor',
		plugins_url( 'index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version']
	);

	wp_register_style(
		'apg-hero-editor-style',
		plugins_url( 'index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);

	wp_register_style(
		'apg-hero-style',
		plugins_url( 'style-index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);

	register_block_type( __DIR__, array(
		'editor_script' => 'apg-hero-editor',
		'editor_style' => 'apg-hero-editor-style',
		'style' => 'apg-hero-style',
	) );
}
add_action( 'init', 'apg_hero_register_block' );
