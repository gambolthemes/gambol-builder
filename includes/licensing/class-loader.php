<?php
/**
 * Licensing Module Loader.
 *
 * Initializes all licensing components.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Licensing;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Loader
 *
 * Loads and initializes all licensing components.
 */
class Loader {

	/**
	 * Singleton instance.
	 *
	 * @var Loader|null
	 */
	private static $instance = null;

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
		$this->include_files();
		$this->init_components();
	}

	/**
	 * Include required files.
	 *
	 * @return void
	 */
	private function include_files() {
		$base_path = GAMBOL_BUILDER_PATH . 'includes/licensing/';

		require_once $base_path . 'class-license-manager.php';
		require_once $base_path . 'class-license-api.php';
		require_once $base_path . 'class-license-admin.php';
		require_once $base_path . 'class-pro-features.php';
	}

	/**
	 * Initialize components.
	 *
	 * @return void
	 */
	private function init_components() {
		// Initialize license manager first.
		License_Manager::get_instance();

		// Initialize API.
		License_API::get_instance();

		// Initialize admin.
		if ( is_admin() ) {
			License_Admin::get_instance();
		}

		// Initialize Pro features.
		Pro_Features::get_instance();

		/**
		 * Fires after licensing system is initialized.
		 *
		 * @since 1.0.0
		 */
		do_action( 'gambol_licensing_init' );
	}

	/**
	 * Get license manager instance.
	 *
	 * @return License_Manager
	 */
	public function manager() {
		return License_Manager::get_instance();
	}

	/**
	 * Get license API instance.
	 *
	 * @return License_API
	 */
	public function api() {
		return License_API::get_instance();
	}

	/**
	 * Get Pro features instance.
	 *
	 * @return Pro_Features
	 */
	public function pro() {
		return Pro_Features::get_instance();
	}

	/**
	 * Check if Pro is active.
	 *
	 * @return bool True if Pro is active.
	 */
	public function is_pro() {
		return $this->manager()->is_pro();
	}

	/**
	 * Check if license is valid.
	 *
	 * @return bool True if license is valid.
	 */
	public function is_valid() {
		return $this->manager()->is_valid();
	}

	/**
	 * Check if a feature is available.
	 *
	 * @param string $feature_id Feature ID.
	 * @return bool True if available.
	 */
	public function has_feature( $feature_id ) {
		return $this->pro()->is_feature_available( $feature_id );
	}

	/**
	 * Get license status.
	 *
	 * @return string License status.
	 */
	public function get_status() {
		return $this->manager()->get_status();
	}

	/**
	 * Get license type.
	 *
	 * @return string License type.
	 */
	public function get_type() {
		return $this->manager()->get_type();
	}

	/**
	 * Get licensing status summary.
	 *
	 * @return array Status summary.
	 */
	public function get_status_summary() {
		$manager = $this->manager();

		return array(
			'is_pro'        => $manager->is_pro(),
			'is_valid'      => $manager->is_valid(),
			'status'        => $manager->get_status(),
			'status_label'  => $manager->get_status_label(),
			'type'          => $manager->get_type(),
			'type_label'    => $manager->get_type_label(),
			'expires_in'    => $manager->get_days_until_expiry(),
			'is_lifetime'   => $manager->is_lifetime(),
		);
	}
}

/**
 * Get licensing instance.
 *
 * @return Loader
 */
function gambol_licensing() {
	return Loader::get_instance();
}

// Initialize on plugins_loaded with priority 30.
add_action( 'plugins_loaded', __NAMESPACE__ . '\gambol_licensing', 30 );
