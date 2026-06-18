<?php
/**
 * Popup Manager.
 *
 * Registers the gambol_popup CPT and provides server-side rendering support.
 * Frontend trigger logic lives entirely in src/frontend/index.js.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Popup_Manager
 */
class Popup_Manager {

	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'init',          array( $this, 'register_post_type' ) );
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register the gambol_popup CPT.
	 *
	 * @return void
	 */
	public function register_post_type() {
		register_post_type( 'gambol_popup', array(
			'labels'        => array(
				'name'          => __( 'Popups',    'gambol-builder' ),
				'singular_name' => __( 'Popup',     'gambol-builder' ),
				'add_new_item'  => __( 'Add Popup', 'gambol-builder' ),
				'edit_item'     => __( 'Edit Popup', 'gambol-builder' ),
			),
			'public'        => false,
			'show_ui'       => false,
			'show_in_rest'  => true,
			'supports'      => array( 'title', 'editor', 'custom-fields' ),
			'rest_base'     => 'gambol-popups',
		) );
	}

	/**
	 * Register REST routes.
	 *
	 * @return void
	 */
	public function register_routes() {
		$namespace = 'gambol-builder/v1';

		register_rest_route( $namespace, '/popups', array(
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_popups' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			),
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_popup' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			),
		) );

		register_rest_route( $namespace, '/popups/(?P<id>\d+)', array(
			array(
				'methods'             => \WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_popup' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			),
		) );
	}

	/**
	 * @return bool
	 */
	public function check_permissions() {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * GET /gambol-builder/v1/popups
	 *
	 * @return \WP_REST_Response
	 */
	public function get_popups() {
		$posts = get_posts( array(
			'post_type'      => 'gambol_popup',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
		) );

		$items = array_map( function( $post ) {
			return array(
				'id'      => $post->ID,
				'title'   => get_the_title( $post ),
				'content' => get_post_field( 'post_content', $post->ID ),
				'meta'    => get_post_meta( $post->ID ),
			);
		}, $posts );

		return rest_ensure_response( $items );
	}

	/**
	 * POST /gambol-builder/v1/popups
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function create_popup( $request ) {
		$data = $request->get_json_params();
		if ( empty( $data['title'] ) ) {
			return new \WP_Error( 'missing_title', __( 'Title required.', 'gambol-builder' ), array( 'status' => 400 ) );
		}

		$id = wp_insert_post( array(
			'post_type'    => 'gambol_popup',
			'post_status'  => 'publish',
			'post_title'   => sanitize_text_field( $data['title'] ),
			'post_content' => wp_kses_post( $data['content'] ?? '' ),
		) );

		if ( is_wp_error( $id ) ) {
			return $id;
		}

		// Store trigger/display meta.
		$meta_fields = array( 'triggerType', 'triggerDelay', 'scrollPercent', 'cookieDays', 'scheduledStart', 'scheduledEnd' );
		foreach ( $meta_fields as $field ) {
			if ( isset( $data[ $field ] ) ) {
				update_post_meta( $id, '_gambol_popup_' . $field, sanitize_text_field( (string) $data[ $field ] ) );
			}
		}

		return rest_ensure_response( array( 'id' => $id ) );
	}

	/**
	 * DELETE /gambol-builder/v1/popups/{id}
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function delete_popup( $request ) {
		$id = (int) $request['id'];
		if ( get_post_type( $id ) !== 'gambol_popup' ) {
			return new \WP_Error( 'not_found', __( 'Popup not found.', 'gambol-builder' ), array( 'status' => 404 ) );
		}

		wp_delete_post( $id, true );
		return rest_ensure_response( array( 'deleted' => true ) );
	}
}

// Initialize.
add_action( 'plugins_loaded', function() {
	Popup_Manager::get_instance();
} );
