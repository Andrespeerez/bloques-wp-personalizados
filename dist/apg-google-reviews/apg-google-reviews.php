/**
 * Plugin Name:       APG Google Reviews Block
 * Description:       Bloque para cargar reseñas de Google Places
 * Requires at least: 6.0
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Tu Nombre
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       apg-google-reviews
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function apg_google_reviews_register_block() {
	$asset_file = include( plugin_dir_path( __FILE__ ) . 'index.asset.php' );

	wp_register_script(
		'apg-google-reviews-editor',
		plugins_url( 'index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version']
	);

	wp_register_style(
		'apg-google-reviews-editor-style',
		plugins_url( 'index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);

	wp_register_style(
		'apg-google-reviews-style',
		plugins_url( 'style-index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);

	register_block_type( __DIR__, array(
		'editor_script' => 'apg-google-reviews-editor',
		'editor_style' => 'apg-google-reviews-editor-style',
		'style' => 'apg-google-reviews-style',
	) );
}
add_action( 'init', 'apg_google_reviews_register_block' );
