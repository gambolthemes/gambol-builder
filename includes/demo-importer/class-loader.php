<?php
/**
 * Demo Importer Loader.
 *
 * Main entry point for the Demo Importer feature.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\DemoImporter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Include required files.
require_once __DIR__ . '/class-demo-manager.php';
require_once __DIR__ . '/class-importer.php';
require_once __DIR__ . '/class-rest-api.php';
require_once __DIR__ . '/class-admin-page.php';

/**
 * Class Loader
 *
 * Initializes all Demo Importer components.
 */
class Loader {

	/**
	 * Singleton instance.
	 *
	 * @var Loader|null
	 */
	private static $instance = null;

	/**
	 * Component instances.
	 *
	 * @var array
	 */
	private $components = array();

	/**
	 * Get singleton instance.
	 *
	 * @return Loader
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
	 * Initialize components.
	 *
	 * @return void
	 */
	private function init() {
		// Initialize demo manager (always needed).
		$this->components['demo_manager'] = Demo_Manager::get_instance();

		// Initialize importer.
		$this->components['importer'] = Importer::get_instance();

		// Initialize REST API.
		$this->components['rest_api'] = Rest_API::get_instance();

		// Initialize admin page (admin only).
		if ( is_admin() ) {
			$this->components['admin_page'] = Admin_Page::get_instance();
		}
	}

	/**
	 * Get component.
	 *
	 * @param string $name Component name.
	 * @return object|null Component instance or null.
	 */
	public function get_component( $name ) {
		return isset( $this->components[ $name ] ) ? $this->components[ $name ] : null;
	}

	/**
	 * Get demo manager.
	 *
	 * @return Demo_Manager
	 */
	public function demo_manager() {
		return $this->components['demo_manager'];
	}

	/**
	 * Get importer.
	 *
	 * @return Importer
	 */
	public function importer() {
		return $this->components['importer'];
	}
}

/**
 * Initialize the Demo Importer.
 *
 * @return Loader
 */
function gambol_demo_importer() {
	return Loader::get_instance();
}

// Initialize on plugins_loaded.
add_action( 'plugins_loaded', __NAMESPACE__ . '\gambol_demo_importer', 20 );
