<?php
/**
 * Template Library Custom Post Type.
 *
 * Registers the gambol_template CPT for locally saved templates.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\TemplateLibrary;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Template_CPT
 */
class Template_CPT {

	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'init', array( $this, 'register' ) );
	}

	/**
	 * Register gambol_template CPT.
	 *
	 * @return void
	 */
	public function register() {
		register_post_type( 'gambol_template', array(
			'label'               => __( 'Gambol Templates', 'gambol-builder' ),
			'public'              => false,
			'show_ui'             => false,
			'show_in_menu'        => false,
			'show_in_rest'        => false,
			'supports'            => array( 'title', 'editor', 'custom-fields' ),
			'capability_type'     => 'post',
			'has_archive'         => false,
			'rewrite'             => false,
		) );
	}
}
