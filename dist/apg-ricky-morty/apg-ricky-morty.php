<?php
/**
 * Plugin Name:       APG Ricki Morty
 * Description:       Bloque que carga personajes de Ricky y Morty
 * Requires at least: 6.0
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Andrespeerez
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       apg-ricky-morty
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

register_block_type( __DIR__ );