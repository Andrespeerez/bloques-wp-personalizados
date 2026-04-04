<?php
/**
 * Plugin Name:       Testimonial Block
 * Description:       Bloque para cargar reseñas de Google Places
 * Requires at least: 6.0
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Tu Nombre
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       testimonial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function testimonial_register_block() {
	$asset_file = include( plugin_dir_path( __FILE__ ) . 'index.asset.php' );

	wp_register_script(
		'testimonial-editor',
		plugins_url( 'index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version']
	);

	wp_register_style(
		'testimonial-editor-style',
		plugins_url( 'testimonial.css', __FILE__ ),
		array(),
		$asset_file['version']
	);

	wp_register_style(
		'testimonial-style',
		plugins_url( 'style-testimonial.css', __FILE__ ),
		array(),
		$asset_file['version']
	);

	register_block_type( __DIR__, array(
		'editor_script' => 'testimonial-editor',
		'editor_style' => 'testimonial-editor-style',
		'style' => 'testimonial-style',
	) );
}
add_action( 'init', 'testimonial_register_block' );
