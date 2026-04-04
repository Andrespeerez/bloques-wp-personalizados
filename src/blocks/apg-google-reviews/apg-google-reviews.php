<?php
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

register_block_type( __DIR__ );