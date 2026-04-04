<?php
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

register_block_type( __DIR__ );