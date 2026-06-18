<?php
/**
 * Mega Menu Module Loader.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\MegaMenu;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$dir = __DIR__;
require_once $dir . '/class-mega-menu-cpt.php';
require_once $dir . '/class-walker.php';
require_once $dir . '/class-meta-box.php';

Mega_Menu_CPT::init();
Meta_Box::init();

/**
 * Hook Gambol Walker into wp_nav_menu calls.
 * Themes must call wp_nav_menu() and pass 'gambol_mega_menu' as walker
 * or we filter it globally here.
 *
 * We filter 'wp_nav_menu_args' so themes using default calls get mega menus
 * automatically when a menu item has _gambol_mega_menu_id set.
 */
add_filter( 'wp_nav_menu_args', function( $args ) {
	// Only inject if not already using a custom walker.
	if ( empty( $args['walker'] ) ) {
		$args['walker'] = new Walker();
	}
	return $args;
} );

/**
 * Add mega menu CSS inline.
 */
add_action( 'wp_head', function() {
	$css = '
.menu-item:has(.gambol-mega-menu__panel) { position: relative; }
.gambol-mega-menu__panel {
	display: none;
	position: absolute;
	top: 100%;
	left: 0;
	z-index: 999;
	min-width: 600px;
	background: #fff;
	box-shadow: 0 8px 32px rgba(0,0,0,.15);
	border-radius: 0 0 8px 8px;
	padding: 24px;
}
.menu-item:hover > .gambol-mega-menu__panel,
.menu-item:focus-within > .gambol-mega-menu__panel {
	display: block;
}
';
	echo '<style id="gambol-mega-menu-css">' . $css . '</style>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}, 20 );
