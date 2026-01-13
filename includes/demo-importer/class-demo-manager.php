<?php
/**
 * Demo Manager.
 *
 * Handles demo registration, listing, and data structure.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\DemoImporter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Demo_Manager
 *
 * Manages available demos and their configurations.
 */
class Demo_Manager {

	/**
	 * Singleton instance.
	 *
	 * @var Demo_Manager|null
	 */
	private static $instance = null;

	/**
	 * Registered demos.
	 *
	 * @var array
	 */
	private $demos = array();

	/**
	 * Get singleton instance.
	 *
	 * @return Demo_Manager
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
		$this->init();
	}

	/**
	 * Initialize.
	 *
	 * @return void
	 */
	private function init() {
		// Load built-in demos.
		add_action( 'init', array( $this, 'register_default_demos' ), 5 );

		// Allow external demos to be registered.
		add_action( 'init', array( $this, 'load_external_demos' ), 10 );
	}

	/**
	 * Register default demos.
	 *
	 * @return void
	 */
	public function register_default_demos() {
		$demos_dir = GAMBOL_BUILDER_PATH . 'includes/demo-importer/demos/';

		if ( ! is_dir( $demos_dir ) ) {
			return;
		}

		$demo_folders = glob( $demos_dir . '*', GLOB_ONLYDIR );

		foreach ( $demo_folders as $folder ) {
			$config_file = $folder . '/config.json';

			if ( file_exists( $config_file ) ) {
				$config = json_decode( file_get_contents( $config_file ), true );

				if ( $config && isset( $config['id'] ) ) {
					$config['path'] = $folder;
					$this->register_demo( $config );
				}
			}
		}
	}

	/**
	 * Load external demos via filter.
	 *
	 * @return void
	 */
	public function load_external_demos() {
		/**
		 * Filter to register external demos.
		 *
		 * @param array $demos Array of demo configurations.
		 */
		$external_demos = apply_filters( 'gambol_register_demos', array() );

		foreach ( $external_demos as $demo ) {
			if ( isset( $demo['id'] ) ) {
				$this->register_demo( $demo );
			}
		}
	}

	/**
	 * Register a demo.
	 *
	 * @param array $config Demo configuration.
	 * @return bool True on success, false on failure.
	 */
	public function register_demo( $config ) {
		$defaults = array(
			'id'          => '',
			'name'        => '',
			'description' => '',
			'thumbnail'   => '',
			'preview_url' => '',
			'path'        => '',
			'categories'  => array(),
			'contents'    => array(
				'pages'         => true,
				'headers'       => true,
				'footers'       => true,
				'global_styles' => true,
			),
		);

		$config = wp_parse_args( $config, $defaults );

		// Validate required fields.
		if ( empty( $config['id'] ) || empty( $config['name'] ) ) {
			return false;
		}

		// Validate path exists.
		if ( ! empty( $config['path'] ) && ! is_dir( $config['path'] ) ) {
			return false;
		}

		$this->demos[ $config['id'] ] = $config;

		return true;
	}

	/**
	 * Get all registered demos.
	 *
	 * @return array Array of demo configurations.
	 */
	public function get_demos() {
		return $this->demos;
	}

	/**
	 * Get a specific demo.
	 *
	 * @param string $demo_id Demo ID.
	 * @return array|false Demo configuration or false if not found.
	 */
	public function get_demo( $demo_id ) {
		return isset( $this->demos[ $demo_id ] ) ? $this->demos[ $demo_id ] : false;
	}

	/**
	 * Get demo data file contents.
	 *
	 * @param string $demo_id   Demo ID.
	 * @param string $data_type Data type (pages, headers, footers, global_styles).
	 * @return array|false Data array or false on failure.
	 */
	public function get_demo_data( $demo_id, $data_type ) {
		$demo = $this->get_demo( $demo_id );

		if ( ! $demo || empty( $demo['path'] ) ) {
			return false;
		}

		$file_map = array(
			'pages'         => 'pages.json',
			'headers'       => 'headers.json',
			'footers'       => 'footers.json',
			'global_styles' => 'global-styles.json',
		);

		if ( ! isset( $file_map[ $data_type ] ) ) {
			return false;
		}

		$file_path = trailingslashit( $demo['path'] ) . $file_map[ $data_type ];

		if ( ! file_exists( $file_path ) ) {
			return false;
		}

		$data = json_decode( file_get_contents( $file_path ), true );

		return is_array( $data ) ? $data : false;
	}

	/**
	 * Get demo thumbnail URL.
	 *
	 * @param string $demo_id Demo ID.
	 * @return string Thumbnail URL or empty string.
	 */
	public function get_demo_thumbnail( $demo_id ) {
		$demo = $this->get_demo( $demo_id );

		if ( ! $demo ) {
			return '';
		}

		// If thumbnail is a URL, return it directly.
		if ( ! empty( $demo['thumbnail'] ) && filter_var( $demo['thumbnail'], FILTER_VALIDATE_URL ) ) {
			return $demo['thumbnail'];
		}

		// Check for thumbnail file in demo folder.
		if ( ! empty( $demo['path'] ) ) {
			$extensions = array( 'jpg', 'jpeg', 'png', 'webp', 'gif' );

			foreach ( $extensions as $ext ) {
				$file = trailingslashit( $demo['path'] ) . 'thumbnail.' . $ext;

				if ( file_exists( $file ) ) {
					// Convert path to URL.
					$relative_path = str_replace( GAMBOL_BUILDER_PATH, '', $file );
					return GAMBOL_BUILDER_URL . $relative_path;
				}
			}
		}

		// Return placeholder.
		return '';
	}

	/**
	 * Get demos by category.
	 *
	 * @param string $category Category slug.
	 * @return array Array of demo configurations.
	 */
	public function get_demos_by_category( $category ) {
		$filtered = array();

		foreach ( $this->demos as $id => $demo ) {
			if ( in_array( $category, $demo['categories'], true ) ) {
				$filtered[ $id ] = $demo;
			}
		}

		return $filtered;
	}

	/**
	 * Get all demo categories.
	 *
	 * @return array Array of category slugs.
	 */
	public function get_categories() {
		$categories = array();

		foreach ( $this->demos as $demo ) {
			foreach ( $demo['categories'] as $category ) {
				if ( ! in_array( $category, $categories, true ) ) {
					$categories[] = $category;
				}
			}
		}

		sort( $categories );

		return $categories;
	}

	/**
	 * Check if a demo exists.
	 *
	 * @param string $demo_id Demo ID.
	 * @return bool True if demo exists.
	 */
	public function demo_exists( $demo_id ) {
		return isset( $this->demos[ $demo_id ] );
	}
}
