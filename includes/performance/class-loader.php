<?php
/**
 * Performance Module Loader.
 *
 * Initializes all performance optimization components.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Performance;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Loader
 *
 * Loads and initializes all performance components.
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
		$base_path = GAMBOL_BUILDER_PATH . 'includes/performance/';

		require_once $base_path . 'class-settings.php';
		require_once $base_path . 'class-admin-page.php';
		require_once $base_path . 'class-css-optimizer.php';
		require_once $base_path . 'class-asset-optimizer.php';
		require_once $base_path . 'class-font-optimizer.php';
		require_once $base_path . 'class-lazy-loading.php';
	}

	/**
	 * Initialize components.
	 *
	 * @return void
	 */
	private function init_components() {
		// Initialize settings.
		Settings::get_instance();

		// Initialize admin page.
		if ( is_admin() ) {
			Admin_Page::get_instance();
		}

		// Initialize optimizers on frontend.
		add_action( 'wp', array( $this, 'init_optimizers' ) );
	}

	/**
	 * Initialize optimizer components.
	 *
	 * @return void
	 */
	public function init_optimizers() {
		// Don't run in admin or on login page.
		if ( is_admin() || $this->is_login_page() ) {
			return;
		}

		// Initialize CSS optimizer.
		CSS_Optimizer::get_instance();

		// Initialize asset optimizer.
		Asset_Optimizer::get_instance();

		// Initialize font optimizer.
		Font_Optimizer::get_instance();

		// Initialize lazy loading.
		Lazy_Loading::get_instance();

		/**
		 * Fires after performance optimizers are initialized.
		 *
		 * @since 1.0.0
		 */
		do_action( 'gambol_performance_init' );
	}

	/**
	 * Check if current page is login page.
	 *
	 * @return bool True if login page.
	 */
	private function is_login_page() {
		return in_array( $GLOBALS['pagenow'], array( 'wp-login.php', 'wp-register.php' ), true );
	}

	/**
	 * Get all performance settings.
	 *
	 * @return array All settings.
	 */
	public function get_settings() {
		return Settings::get_instance()->get_all();
	}

	/**
	 * Update performance settings.
	 *
	 * @param array $settings Settings to update.
	 * @return bool True on success.
	 */
	public function update_settings( $settings ) {
		return Settings::get_instance()->update( $settings );
	}

	/**
	 * Reset performance settings to defaults.
	 *
	 * @return bool True on success.
	 */
	public function reset_settings() {
		return Settings::get_instance()->reset();
	}

	/**
	 * Check if a specific optimization is enabled.
	 *
	 * @param string $key Setting key.
	 * @return bool True if enabled.
	 */
	public function is_enabled( $key ) {
		return Settings::get_instance()->is_enabled( $key );
	}

	/**
	 * Get performance stats.
	 *
	 * @return array Performance statistics.
	 */
	public function get_stats() {
		$settings = Settings::get_instance();
		$stats = array(
			'optimizations_enabled' => 0,
			'optimizations_total'   => 0,
			'css_savings'           => 0,
			'js_savings'            => 0,
		);

		// Count enabled optimizations.
		$optimization_keys = array(
			'conditional_css',
			'remove_editor_styles',
			'remove_block_library',
			'defer_block_scripts',
			'disable_emojis',
			'disable_embeds',
			'remove_jquery_migrate',
			'disable_dashicons',
			'optimize_google_fonts',
			'font_display_swap',
			'lazy_load_images',
			'lazy_load_iframes',
			'native_lazy_loading',
			'add_image_dimensions',
		);

		$stats['optimizations_total'] = count( $optimization_keys );

		foreach ( $optimization_keys as $key ) {
			if ( $settings->is_enabled( $key ) ) {
				$stats['optimizations_enabled']++;
			}
		}

		// Estimate savings.
		if ( $settings->is_enabled( 'disable_emojis' ) ) {
			$stats['js_savings'] += 10; // ~10KB.
		}

		if ( $settings->is_enabled( 'disable_embeds' ) ) {
			$stats['js_savings'] += 2; // ~2KB.
		}

		if ( $settings->is_enabled( 'remove_jquery_migrate' ) ) {
			$stats['js_savings'] += 10; // ~10KB.
		}

		if ( $settings->is_enabled( 'disable_dashicons' ) ) {
			$stats['css_savings'] += 40; // ~40KB.
		}

		if ( $settings->is_enabled( 'remove_block_library' ) ) {
			$stats['css_savings'] += 12; // ~12KB.
		}

		/**
		 * Filter performance statistics.
		 *
		 * @since 1.0.0
		 *
		 * @param array $stats Performance statistics.
		 */
		return apply_filters( 'gambol_performance_stats', $stats );
	}
}

/**
 * Get performance module instance.
 *
 * @return Loader
 */
function gambol_performance() {
	return Loader::get_instance();
}

// Initialize on plugins_loaded with priority 25.
add_action( 'plugins_loaded', __NAMESPACE__ . '\gambol_performance', 25 );
