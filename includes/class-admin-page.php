<?php
/**
 * Admin Page for Gambol Builder.
 *
 * Creates the main admin menu and Global Styles settings page.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Admin_Page
 *
 * Handles admin menu registration and settings page rendering.
 */
class Admin_Page {

	/**
	 * Singleton instance.
	 *
	 * @var Admin_Page|null
	 */
	private static $instance = null;

	/**
	 * Admin page slug.
	 *
	 * @var string
	 */
	const MENU_SLUG = 'gambol-builder';

	/**
	 * Global Styles page slug.
	 *
	 * @var string
	 */
	const GLOBAL_STYLES_SLUG = 'gambol-global-styles';

	/**
	 * Get singleton instance.
	 *
	 * @return Admin_Page
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
	 * Initialize hooks.
	 *
	 * @return void
	 */
	private function init() {
		add_action( 'admin_menu', array( $this, 'register_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
	}

	/**
	 * Register admin menu.
	 *
	 * @return void
	 */
	public function register_admin_menu() {
		// Main menu.
		add_menu_page(
			__( 'Gambol Builder', 'gambol-builder' ),
			__( 'Gambol', 'gambol-builder' ),
			'manage_options',
			self::MENU_SLUG,
			array( $this, 'render_dashboard_page' ),
			$this->get_menu_icon(),
			59
		);

		// Dashboard submenu (rename the first item).
		add_submenu_page(
			self::MENU_SLUG,
			__( 'Dashboard', 'gambol-builder' ),
			__( 'Dashboard', 'gambol-builder' ),
			'manage_options',
			self::MENU_SLUG,
			array( $this, 'render_dashboard_page' )
		);

		// Global Styles submenu.
		add_submenu_page(
			self::MENU_SLUG,
			__( 'Global Styles', 'gambol-builder' ),
			__( 'Global Styles', 'gambol-builder' ),
			'manage_options',
			self::GLOBAL_STYLES_SLUG,
			array( $this, 'render_global_styles_page' )
		);
	}

	/**
	 * Get menu icon SVG.
	 *
	 * @return string Base64 encoded SVG icon.
	 */
	private function get_menu_icon() {
		$svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#a0a5aa"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>';
		return 'data:image/svg+xml;base64,' . base64_encode( $svg );
	}

	/**
	 * Enqueue admin scripts and styles.
	 *
	 * @param string $hook Current admin page hook.
	 * @return void
	 */
	public function enqueue_admin_scripts( $hook ) {
		// Only load on our pages.
		$our_pages = array(
			'toplevel_page_' . self::MENU_SLUG,
			'gambol_page_' . self::GLOBAL_STYLES_SLUG,
		);

		if ( ! in_array( $hook, $our_pages, true ) ) {
			return;
		}

		// Check if admin script exists.
		$admin_asset_file = GAMBOL_BUILDER_PATH . 'build/admin.asset.php';
		if ( ! file_exists( $admin_asset_file ) ) {
			return;
		}

		$admin_asset = require $admin_asset_file;

		// Enqueue admin app.
		wp_enqueue_script(
			'gambol-admin',
			GAMBOL_BUILDER_URL . 'build/admin.js',
			$admin_asset['dependencies'],
			$admin_asset['version'],
			true
		);

		// Enqueue admin styles.
		wp_enqueue_style(
			'gambol-admin',
			GAMBOL_BUILDER_URL . 'build/admin.css',
			array( 'wp-components' ),
			$admin_asset['version']
		);

		// Localize script with data.
		wp_localize_script(
			'gambol-admin',
			'gambolAdmin',
			array(
				'restUrl'   => rest_url( 'gambol-builder/v1/' ),
				'nonce'     => wp_create_nonce( 'wp_rest' ),
				'page'      => $this->get_current_page( $hook ),
				'version'   => GAMBOL_BUILDER_VERSION,
				'adminUrl'  => admin_url(),
				'pluginUrl' => GAMBOL_BUILDER_URL,
			)
		);

		// WordPress components styles.
		wp_enqueue_style( 'wp-components' );
	}

	/**
	 * Get current page identifier.
	 *
	 * @param string $hook Current admin page hook.
	 * @return string Page identifier.
	 */
	private function get_current_page( $hook ) {
		if ( strpos( $hook, self::GLOBAL_STYLES_SLUG ) !== false ) {
			return 'global-styles';
		}
		return 'dashboard';
	}

	/**
	 * Render dashboard page.
	 *
	 * @return void
	 */
	public function render_dashboard_page() {
		?>
		<div class="wrap gambol-admin-wrap">
			<div id="gambol-admin-root" data-page="dashboard"></div>
		</div>
		<?php
	}

	/**
	 * Render global styles page.
	 *
	 * @return void
	 */
	public function render_global_styles_page() {
		?>
		<div class="wrap gambol-admin-wrap">
			<div id="gambol-admin-root" data-page="global-styles"></div>
		</div>
		<?php
	}
}

/**
 * Initialize Admin Page.
 *
 * @return Admin_Page
 */
function admin_page() {
	return Admin_Page::get_instance();
}

// Initialize on plugins_loaded.
add_action( 'plugins_loaded', __NAMESPACE__ . '\admin_page' );
