<?php
/**
 * Plugin Name:       Gambol Builder
 * Plugin URI:        https://gambolthemes.net
 * Description:       A performance-first visual builder for WordPress.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Gambol
 * Author URI:        https://gambolthemes.net
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gambol-builder
 * Domain Path:       /languages
 *
 * @package GambolBuilder
 */

namespace GambolBuilder;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Plugin constants.
define( 'GAMBOL_BUILDER_VERSION', '1.0.0' );
define( 'GAMBOL_BUILDER_PATH', plugin_dir_path( __FILE__ ) );
define( 'GAMBOL_BUILDER_URL', plugin_dir_url( __FILE__ ) );
define( 'GAMBOL_BUILDER_FILE', __FILE__ );

/**
 * Load plugin text domain.
 *
 * @return void
 */
function load_textdomain() {
	load_plugin_textdomain(
		'gambol-builder',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}
add_action( 'init', __NAMESPACE__ . '\load_textdomain', 0 );

/**
 * Safely include a file if it exists.
 *
 * @param string $file File path.
 * @return bool True if file was included.
 */
function safe_include( $file ) {
	if ( file_exists( $file ) ) {
		require_once $file;
		return true;
	}
	return false;
}

// Include Global Styles.
safe_include( GAMBOL_BUILDER_PATH . 'includes/class-global-styles.php' );

// Include Admin Page.
safe_include( GAMBOL_BUILDER_PATH . 'includes/class-admin-page.php' );

// Include Header Footer Builder (optional module).
if ( safe_include( GAMBOL_BUILDER_PATH . 'includes/header-footer/class-loader.php' ) ) {
	safe_include( GAMBOL_BUILDER_PATH . 'includes/header-footer/template-functions.php' );
}

// Include Demo Importer (optional module).
safe_include( GAMBOL_BUILDER_PATH . 'includes/demo-importer/class-loader.php' );

// Include Performance Optimization (optional module).
safe_include( GAMBOL_BUILDER_PATH . 'includes/performance/class-loader.php' );

// Include Theme Integration (optional module).
safe_include( GAMBOL_BUILDER_PATH . 'includes/theme-integration/class-loader.php' );

// Include Licensing (optional module - may not be included in free version).
safe_include( GAMBOL_BUILDER_PATH . 'includes/licensing/class-loader.php' );

/**
 * Initialize the plugin.
 *
 * @return void
 */
function init() {
	add_action( 'init', __NAMESPACE__ . '\register_blocks' );
	add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_assets' );
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_frontend_assets' );
	add_filter( 'block_categories_all', __NAMESPACE__ . '\register_block_category', 10, 2 );

	/**
	 * Fires after Gambol Builder core is initialized.
	 *
	 * @since 1.0.0
	 */
	do_action( 'gambol_builder_init' );
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\init' );

/**
 * Plugin activation hook.
 *
 * @return void
 */
function activate() {
	// Store version for upgrade routines.
	update_option( 'gambol_builder_version', GAMBOL_BUILDER_VERSION );

	/**
	 * Fires on plugin activation.
	 *
	 * @since 1.0.0
	 */
	do_action( 'gambol_builder_activate' );

	// Flush rewrite rules for custom post types.
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, __NAMESPACE__ . '\activate' );

/**
 * Plugin deactivation hook.
 *
 * @return void
 */
function deactivate() {
	/**
	 * Fires on plugin deactivation.
	 *
	 * @since 1.0.0
	 */
	do_action( 'gambol_builder_deactivate' );

	// Clear scheduled events.
	wp_clear_scheduled_hook( 'gambol_daily_license_check' );

	// Flush rewrite rules.
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, __NAMESPACE__ . '\deactivate' );

/**
 * Register custom block category.
 *
 * @param array                   $categories Block categories.
 * @param WP_Block_Editor_Context $context    Block editor context.
 * @return array Modified block categories.
 */
function register_block_category( $categories, $context ) {
	return array_merge(
		array(
			array(
				'slug'  => 'gambol-builder',
				'title' => __( 'Gambol Builder', 'gambol-builder' ),
				'icon'  => 'layout',
			),
		),
		$categories
	);
}

/**
 * Register all blocks.
 *
 * @return void
 */
function register_blocks() {
	// Check if build files exist.
	$build_path = GAMBOL_BUILDER_PATH . 'build/';

	if ( ! file_exists( $build_path . 'index.asset.php' ) ) {
		return;
	}

	$asset_file = include $build_path . 'index.asset.php';

	// Register editor script.
	wp_register_script(
		'gambol-builder-editor',
		GAMBOL_BUILDER_URL . 'build/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	// Register editor styles.
	if ( file_exists( $build_path . 'index.css' ) ) {
		wp_register_style(
			'gambol-builder-editor',
			GAMBOL_BUILDER_URL . 'build/index.css',
			array(),
			$asset_file['version']
		);
	}

	// Register frontend styles.
	if ( file_exists( $build_path . 'style-index.css' ) ) {
		wp_register_style(
			'gambol-builder-style',
			GAMBOL_BUILDER_URL . 'build/style-index.css',
			array(),
			$asset_file['version']
		);
	}

	// Register Section block.
	register_block_type(
		'gambol/section',
		array(
			'api_version'   => 3,
			'editor_script' => 'gambol-builder-editor',
			'editor_style'  => 'gambol-builder-editor',
			'style'         => 'gambol-builder-style',
		)
	);
}

/**
 * Enqueue editor-specific assets.
 *
 * @return void
 */
function enqueue_editor_assets() {
	// Additional editor-only assets can be enqueued here.
}

/**
 * Enqueue frontend assets.
 * Only loads assets when builder blocks are used.
 *
 * @return void
 */
function enqueue_frontend_assets() {
	// Assets are conditionally loaded via block registration.
	// Additional frontend scripts can be added here if needed.
}

/**
 * Get allowed HTML for block output.
 * Provides a strict allowlist for clean output.
 *
 * @return array Allowed HTML elements and attributes.
 */
function get_allowed_html() {
	return array(
		'div'    => array(
			'id'    => true,
			'class' => true,
			'style' => true,
		),
		'span'   => array(
			'id'    => true,
			'class' => true,
			'style' => true,
		),
		'a'      => array(
			'href'   => true,
			'title'  => true,
			'target' => true,
			'rel'    => true,
			'class'  => true,
		),
		'img'    => array(
			'src'     => true,
			'alt'     => true,
			'width'   => true,
			'height'  => true,
			'loading' => true,
			'class'   => true,
		),
		'p'      => array(
			'class' => true,
		),
		'h1'     => array( 'class' => true ),
		'h2'     => array( 'class' => true ),
		'h3'     => array( 'class' => true ),
		'h4'     => array( 'class' => true ),
		'h5'     => array( 'class' => true ),
		'h6'     => array( 'class' => true ),
		'ul'     => array( 'class' => true ),
		'ol'     => array( 'class' => true ),
		'li'     => array( 'class' => true ),
		'strong' => array(),
		'em'     => array(),
		'br'     => array(),
	);
}
