<?php
/**
 * Block Presets System.
 *
 * Allows users to save a block's style attributes as a named preset
 * and apply it to other blocks of the same type — like Avada's Element Presets.
 *
 * Storage: wp_options key `gambol_block_presets`
 * Structure: { 'gambol/button': [{ id, name, attributes: {...} }], ... }
 *
 * @package GambolBuilder
 */

namespace GambolBuilder;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Block_Presets
 */
class Block_Presets {

	const OPTION_NAME = 'gambol_block_presets';
	const NAMESPACE   = 'gambol-builder/v1';

	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST routes.
	 *
	 * @return void
	 */
	public function register_routes() {
		// GET /block-presets/{block-name} — list presets for a block type
		register_rest_route( self::NAMESPACE, '/block-presets/(?P<block>[a-z0-9\-\/]+)', array(
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_presets' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'block' => array( 'type' => 'string', 'required' => true ),
				),
			),
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'save_preset' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			),
		) );

		// DELETE /block-presets/{block-name}/{preset-id}
		register_rest_route( self::NAMESPACE, '/block-presets/(?P<block>[a-z0-9\-\/]+)/(?P<id>[a-z0-9\-]+)', array(
			array(
				'methods'             => \WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_preset' ),
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
	 * Load all stored presets.
	 *
	 * @return array
	 */
	private function load_presets() {
		return get_option( self::OPTION_NAME, array() );
	}

	/**
	 * GET /block-presets/{block}
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response
	 */
	public function get_presets( $request ) {
		$block   = sanitize_text_field( $request->get_param( 'block' ) );
		$presets = $this->load_presets();
		return rest_ensure_response( $presets[ $block ] ?? array() );
	}

	/**
	 * POST /block-presets/{block}
	 * Body: { name: string, attributes: object }
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function save_preset( $request ) {
		$block = sanitize_text_field( $request->get_param( 'block' ) );
		$data  = $request->get_json_params();

		if ( empty( $data['name'] ) ) {
			return new \WP_Error( 'missing_name', __( 'Preset name is required.', 'gambol-builder' ), array( 'status' => 400 ) );
		}

		$presets = $this->load_presets();

		if ( ! isset( $presets[ $block ] ) ) {
			$presets[ $block ] = array();
		}

		$preset_id = wp_generate_uuid4();

		$presets[ $block ][] = array(
			'id'         => $preset_id,
			'name'       => sanitize_text_field( $data['name'] ),
			'attributes' => $data['attributes'] ?? array(),
			'created_at' => current_time( 'mysql' ),
		);

		update_option( self::OPTION_NAME, $presets );

		return rest_ensure_response( array( 'id' => $preset_id, 'success' => true ) );
	}

	/**
	 * DELETE /block-presets/{block}/{id}
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function delete_preset( $request ) {
		$block = sanitize_text_field( $request->get_param( 'block' ) );
		$id    = sanitize_key( $request->get_param( 'id' ) );

		$presets = $this->load_presets();

		if ( empty( $presets[ $block ] ) ) {
			return new \WP_Error( 'not_found', __( 'No presets found for this block.', 'gambol-builder' ), array( 'status' => 404 ) );
		}

		$presets[ $block ] = array_values( array_filter( $presets[ $block ], function( $p ) use ( $id ) {
			return $p['id'] !== $id;
		} ) );

		update_option( self::OPTION_NAME, $presets );

		return rest_ensure_response( array( 'deleted' => true ) );
	}
}

// Initialize.
add_action( 'plugins_loaded', function() {
	Block_Presets::get_instance();
} );
