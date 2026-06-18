<?php
/**
 * Template Library REST API.
 *
 * Endpoints for the Avada-Studio-style template library.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\TemplateLibrary;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Rest_API
 */
class Rest_API {

	const NAMESPACE = 'gambol-builder/v1';

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
		// GET /templates — list with optional ?category=, ?type=, ?search=
		register_rest_route( self::NAMESPACE, '/templates', array(
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_templates' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'category' => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
					'type'     => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
					'search'   => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
				),
			),
		) );

		// POST /templates — save a new template
		register_rest_route( self::NAMESPACE, '/templates', array(
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'save_template' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			),
		) );

		// POST /templates/import — get content of a template for insertion
		register_rest_route( self::NAMESPACE, '/templates/import', array(
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'import_template' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'id' => array( 'type' => 'string', 'required' => true, 'sanitize_callback' => 'sanitize_text_field' ),
				),
			),
		) );

		// DELETE /templates/(?P<id>[\w-]+) — delete a local template
		register_rest_route( self::NAMESPACE, '/templates/(?P<id>[\w-]+)', array(
			array(
				'methods'             => \WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_template' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'id' => array( 'type' => 'string', 'required' => true ),
				),
			),
		) );
	}

	/**
	 * Check permissions — require manage_options.
	 *
	 * @return bool
	 */
	public function check_permissions() {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * GET /templates
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response
	 */
	public function get_templates( $request ) {
		$filters = array(
			'category' => $request->get_param( 'category' ),
			'type'     => $request->get_param( 'type' ),
			'search'   => $request->get_param( 'search' ),
		);

		$templates = Template_Manager::get_instance()->get_templates( array_filter( $filters ) );
		return rest_ensure_response( $templates );
	}

	/**
	 * POST /templates
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function save_template( $request ) {
		$data = $request->get_json_params();

		if ( empty( $data ) ) {
			return new \WP_Error( 'missing_data', __( 'No data provided.', 'gambol-builder' ), array( 'status' => 400 ) );
		}

		$result = Template_Manager::get_instance()->save_template( $data );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( array( 'id' => 'local-' . $result, 'success' => true ) );
	}

	/**
	 * POST /templates/import
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function import_template( $request ) {
		$id      = $request->get_param( 'id' );
		$content = Template_Manager::get_instance()->get_template_content( $id );

		if ( empty( $content ) ) {
			return new \WP_Error( 'not_found', __( 'Template not found.', 'gambol-builder' ), array( 'status' => 404 ) );
		}

		return rest_ensure_response( array( 'content' => $content ) );
	}

	/**
	 * DELETE /templates/{id}
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function delete_template( $request ) {
		$id = $request->get_param( 'id' );

		if ( strpos( $id, 'local-' ) !== 0 ) {
			return new \WP_Error( 'not_deletable', __( 'Only locally saved templates can be deleted.', 'gambol-builder' ), array( 'status' => 403 ) );
		}

		$post_id = (int) str_replace( 'local-', '', $id );
		$result  = Template_Manager::get_instance()->delete_template( $post_id );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( array( 'deleted' => true ) );
	}
}
