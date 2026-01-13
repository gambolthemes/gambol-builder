<?php
/**
 * Demo Importer REST API.
 *
 * Handles REST API endpoints for demo import operations.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\DemoImporter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Rest_API
 *
 * Manages REST API endpoints for the demo importer.
 */
class Rest_API {

	/**
	 * Singleton instance.
	 *
	 * @var Rest_API|null
	 */
	private static $instance = null;

	/**
	 * REST namespace.
	 *
	 * @var string
	 */
	const NAMESPACE = 'gambol-builder/v1';

	/**
	 * Get singleton instance.
	 *
	 * @return Rest_API
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST routes.
	 *
	 * @return void
	 */
	public function register_routes() {
		// Get demos list.
		register_rest_route(
			self::NAMESPACE,
			'/demos',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_demos' ),
				'permission_callback' => array( $this, 'check_admin_permission' ),
			)
		);

		// Get single demo.
		register_rest_route(
			self::NAMESPACE,
			'/demos/(?P<id>[\w-]+)',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_demo' ),
				'permission_callback' => array( $this, 'check_admin_permission' ),
				'args'                => array(
					'id' => array(
						'required'          => true,
						'sanitize_callback' => 'sanitize_key',
					),
				),
			)
		);

		// Import demo.
		register_rest_route(
			self::NAMESPACE,
			'/demos/(?P<id>[\w-]+)/import',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'import_demo' ),
				'permission_callback' => array( $this, 'check_admin_permission' ),
				'args'                => array(
					'id'            => array(
						'required'          => true,
						'sanitize_callback' => 'sanitize_key',
					),
					'pages'         => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'headers'       => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'footers'       => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'global_styles' => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'create_backup' => array(
						'type'    => 'boolean',
						'default' => true,
					),
				),
			)
		);

		// Import step (for progress tracking).
		register_rest_route(
			self::NAMESPACE,
			'/demos/(?P<id>[\w-]+)/import-step',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'import_step' ),
				'permission_callback' => array( $this, 'check_admin_permission' ),
				'args'                => array(
					'id'   => array(
						'required'          => true,
						'sanitize_callback' => 'sanitize_key',
					),
					'step' => array(
						'required'          => true,
						'sanitize_callback' => 'sanitize_key',
					),
				),
			)
		);

		// Rollback.
		register_rest_route(
			self::NAMESPACE,
			'/demos/rollback',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'rollback' ),
				'permission_callback' => array( $this, 'check_admin_permission' ),
			)
		);

		// Reset all.
		register_rest_route(
			self::NAMESPACE,
			'/demos/reset',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'reset_all' ),
				'permission_callback' => array( $this, 'check_admin_permission' ),
			)
		);

		// Get import history.
		register_rest_route(
			self::NAMESPACE,
			'/demos/history',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_history' ),
				'permission_callback' => array( $this, 'check_admin_permission' ),
			)
		);
	}

	/**
	 * Check admin permission.
	 *
	 * @return bool|\WP_Error True if allowed.
	 */
	public function check_admin_permission() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'You do not have permission to access this endpoint.', 'gambol-builder' ),
				array( 'status' => 403 )
			);
		}
		return true;
	}

	/**
	 * Get all demos.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response Response.
	 */
	public function get_demos( $request ) {
		$demo_manager = Demo_Manager::get_instance();
		$demos = $demo_manager->get_demos();

		$response_data = array();

		foreach ( $demos as $id => $demo ) {
			$response_data[] = $this->prepare_demo_for_response( $demo );
		}

		return rest_ensure_response( $response_data );
	}

	/**
	 * Get single demo.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response or error.
	 */
	public function get_demo( $request ) {
		$demo_id = $request->get_param( 'id' );
		$demo_manager = Demo_Manager::get_instance();
		$demo = $demo_manager->get_demo( $demo_id );

		if ( ! $demo ) {
			return new \WP_Error(
				'demo_not_found',
				__( 'Demo not found.', 'gambol-builder' ),
				array( 'status' => 404 )
			);
		}

		return rest_ensure_response( $this->prepare_demo_for_response( $demo ) );
	}

	/**
	 * Import demo.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response or error.
	 */
	public function import_demo( $request ) {
		$demo_id = $request->get_param( 'id' );

		$options = array(
			'pages'         => $request->get_param( 'pages' ),
			'headers'       => $request->get_param( 'headers' ),
			'footers'       => $request->get_param( 'footers' ),
			'global_styles' => $request->get_param( 'global_styles' ),
			'create_backup' => $request->get_param( 'create_backup' ),
		);

		$importer = Importer::get_instance();
		$result = $importer->import( $demo_id, $options );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response(
			array(
				'success' => true,
				'message' => __( 'Demo imported successfully.', 'gambol-builder' ),
				'data'    => $result,
			)
		);
	}

	/**
	 * Import single step (for progress tracking).
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response or error.
	 */
	public function import_step( $request ) {
		$demo_id = $request->get_param( 'id' );
		$step = $request->get_param( 'step' );

		$demo_manager = Demo_Manager::get_instance();
		$demo = $demo_manager->get_demo( $demo_id );

		if ( ! $demo ) {
			return new \WP_Error(
				'demo_not_found',
				__( 'Demo not found.', 'gambol-builder' ),
				array( 'status' => 404 )
			);
		}

		$importer = Importer::get_instance();
		$result = null;

		switch ( $step ) {
			case 'backup':
				$result = $importer->create_backup(
					array(
						'pages'         => true,
						'headers'       => true,
						'footers'       => true,
						'global_styles' => true,
					)
				);
				break;

			case 'pages':
				$result = $this->call_private_method( $importer, 'import_pages', array( $demo_id ) );
				break;

			case 'headers':
				$result = $this->call_private_method( $importer, 'import_headers', array( $demo_id ) );
				break;

			case 'footers':
				$result = $this->call_private_method( $importer, 'import_footers', array( $demo_id ) );
				break;

			case 'global_styles':
				$result = $this->call_private_method( $importer, 'import_global_styles', array( $demo_id ) );
				break;

			default:
				return new \WP_Error(
					'invalid_step',
					__( 'Invalid import step.', 'gambol-builder' ),
					array( 'status' => 400 )
				);
		}

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response(
			array(
				'success' => true,
				'step'    => $step,
				'data'    => $result,
			)
		);
	}

	/**
	 * Call private method via reflection.
	 *
	 * @param object $object Object instance.
	 * @param string $method Method name.
	 * @param array  $args   Method arguments.
	 * @return mixed Method result.
	 */
	private function call_private_method( $object, $method, $args = array() ) {
		$reflection = new \ReflectionClass( get_class( $object ) );
		$method = $reflection->getMethod( $method );
		$method->setAccessible( true );
		return $method->invokeArgs( $object, $args );
	}

	/**
	 * Rollback last import.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response or error.
	 */
	public function rollback( $request ) {
		$importer = Importer::get_instance();

		if ( ! $importer->can_rollback() ) {
			return new \WP_Error(
				'no_rollback',
				__( 'No import history available for rollback.', 'gambol-builder' ),
				array( 'status' => 400 )
			);
		}

		$result = $importer->rollback();

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response(
			array(
				'success' => true,
				'message' => __( 'Rollback completed successfully.', 'gambol-builder' ),
				'data'    => $result,
			)
		);
	}

	/**
	 * Reset all demo content.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response Response.
	 */
	public function reset_all( $request ) {
		$importer = Importer::get_instance();
		$result = $importer->reset_all();

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response(
			array(
				'success' => true,
				'message' => __( 'All demo content has been reset.', 'gambol-builder' ),
				'data'    => $result,
			)
		);
	}

	/**
	 * Get import history.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response Response.
	 */
	public function get_history( $request ) {
		$importer = Importer::get_instance();
		$history = $importer->get_import_history();

		return rest_ensure_response(
			array(
				'history'      => $history,
				'can_rollback' => $importer->can_rollback(),
				'last_import'  => $importer->get_last_import(),
			)
		);
	}

	/**
	 * Prepare demo for REST response.
	 *
	 * @param array $demo Demo configuration.
	 * @return array Prepared demo data.
	 */
	private function prepare_demo_for_response( $demo ) {
		$demo_manager = Demo_Manager::get_instance();

		return array(
			'id'          => $demo['id'],
			'name'        => $demo['name'],
			'description' => $demo['description'],
			'thumbnail'   => $demo_manager->get_demo_thumbnail( $demo['id'] ),
			'preview_url' => $demo['preview_url'],
			'categories'  => $demo['categories'],
			'contents'    => $demo['contents'],
		);
	}
}
