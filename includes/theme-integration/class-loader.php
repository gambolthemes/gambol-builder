<?php
/**
 * Theme Integration Loader.
 *
 * Initializes all theme integration components.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\ThemeIntegration;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Loader
 *
 * Loads and initializes all theme integration components.
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
		$base_path = GAMBOL_BUILDER_PATH . 'includes/theme-integration/';

		require_once $base_path . 'class-theme-detector.php';
		require_once $base_path . 'class-theme-support.php';
		require_once $base_path . 'class-layout-config.php';
		require_once $base_path . 'class-template-override.php';
		require_once $base_path . 'class-hooks-manager.php';
	}

	/**
	 * Initialize components.
	 *
	 * @return void
	 */
	private function init_components() {
		// Initialize theme detector first.
		Theme_Detector::get_instance();

		// Initialize theme support.
		Theme_Support::get_instance();

		// Initialize layout configuration.
		Layout_Config::get_instance();

		// Initialize template override.
		Template_Override::get_instance();

		// Initialize hooks manager.
		Hooks_Manager::get_instance();

		/**
		 * Fires after theme integration is initialized.
		 *
		 * @since 1.0.0
		 */
		do_action( 'gambol_theme_integration_init' );
	}

	/**
	 * Get theme detector instance.
	 *
	 * @return Theme_Detector
	 */
	public function detector() {
		return Theme_Detector::get_instance();
	}

	/**
	 * Get theme support instance.
	 *
	 * @return Theme_Support
	 */
	public function support() {
		return Theme_Support::get_instance();
	}

	/**
	 * Get layout config instance.
	 *
	 * @return Layout_Config
	 */
	public function layout() {
		return Layout_Config::get_instance();
	}

	/**
	 * Get template override instance.
	 *
	 * @return Template_Override
	 */
	public function templates() {
		return Template_Override::get_instance();
	}

	/**
	 * Get hooks manager instance.
	 *
	 * @return Hooks_Manager
	 */
	public function hooks() {
		return Hooks_Manager::get_instance();
	}

	/**
	 * Check if Gambol Theme is active.
	 *
	 * @return bool True if Gambol Theme is active.
	 */
	public function is_gambol_theme() {
		return $this->detector()->is_gambol_theme();
	}

	/**
	 * Check if theme is compatible.
	 *
	 * @return bool True if compatible.
	 */
	public function is_compatible() {
		return $this->detector()->is_compatible();
	}

	/**
	 * Get layout value.
	 *
	 * @param string $key     Configuration key.
	 * @param mixed  $default Default value.
	 * @return mixed Configuration value.
	 */
	public function get_layout( $key, $default = null ) {
		return $this->layout()->get( $key, $default );
	}

	/**
	 * Get breakpoint value.
	 *
	 * @param string $size Breakpoint size.
	 * @return int Breakpoint value.
	 */
	public function get_breakpoint( $size ) {
		return $this->layout()->get_breakpoint( $size );
	}

	/**
	 * Trigger hook at location.
	 *
	 * @param string $location Location key.
	 * @param mixed  $args     Optional arguments.
	 * @return void
	 */
	public function do_hook( $location, $args = null ) {
		$this->hooks()->do_location( $location, $args );
	}

	/**
	 * Get theme feature value.
	 *
	 * @param string $feature Feature key.
	 * @param mixed  $default Default value.
	 * @return mixed Feature value.
	 */
	public function get_theme_feature( $feature, $default = null ) {
		return $this->detector()->get_theme_feature( $feature, $default );
	}

	/**
	 * Check if theme has feature.
	 *
	 * @param string $feature Feature key.
	 * @return bool True if feature is supported.
	 */
	public function theme_has_feature( $feature ) {
		return $this->detector()->theme_has_feature( $feature );
	}

	/**
	 * Should render builder header.
	 *
	 * @return bool True if builder should render header.
	 */
	public function should_render_header() {
		return $this->templates()->should_render_header();
	}

	/**
	 * Should render builder footer.
	 *
	 * @return bool True if builder should render footer.
	 */
	public function should_render_footer() {
		return $this->templates()->should_render_footer();
	}

	/**
	 * Locate template.
	 *
	 * @param string $template_name Template file name.
	 * @return string|false Template path or false.
	 */
	public function locate_template( $template_name ) {
		return $this->templates()->locate_template( $template_name );
	}

	/**
	 * Get theme integration status.
	 *
	 * @return array Status information.
	 */
	public function get_status() {
		return array(
			'theme_name'       => $this->detector()->get_theme_name(),
			'theme_version'    => $this->detector()->get_theme_version(),
			'is_gambol_theme'  => $this->is_gambol_theme(),
			'is_compatible'    => $this->is_compatible(),
			'supports_status'  => $this->support()->get_supports_status(),
			'layout_config'    => $this->layout()->get_all(),
			'hook_locations'   => array_keys( $this->hooks()->get_all_locations() ),
		);
	}
}

/**
 * Get theme integration instance.
 *
 * @return Loader
 */
function gambol_theme_integration() {
	return Loader::get_instance();
}

// Initialize on plugins_loaded with priority 22.
add_action( 'plugins_loaded', __NAMESPACE__ . '\gambol_theme_integration', 22 );
