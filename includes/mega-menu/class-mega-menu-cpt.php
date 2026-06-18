<?php
/**
 * Mega Menu CPT.
 *
 * Registers the gambol_mega_menu custom post type.
 * Each post is a Gutenberg-editable layout that can be attached
 * to a WordPress menu item via the meta box.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\MegaMenu;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Mega_Menu_CPT
 */
class Mega_Menu_CPT {

	/**
	 * Initialize.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register' ) );
	}

	/**
	 * Register the gambol_mega_menu CPT.
	 *
	 * @return void
	 */
	public static function register() {
		register_post_type( 'gambol_mega_menu', array(
			'labels'        => array(
				'name'          => __( 'Mega Menus',       'gambol-builder' ),
				'singular_name' => __( 'Mega Menu',        'gambol-builder' ),
				'add_new_item'  => __( 'Add Mega Menu',    'gambol-builder' ),
				'edit_item'     => __( 'Edit Mega Menu',   'gambol-builder' ),
			),
			'public'           => false,
			'show_ui'          => true,
			'show_in_menu'     => 'gambol-builder',
			'show_in_rest'     => true,
			'supports'         => array( 'title', 'editor' ),
			'capability_type'  => 'post',
			'menu_icon'        => 'dashicons-menu-alt3',
		) );
	}
}
