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

// Include Dynamic Blocks (server-side rendering).
safe_include( GAMBOL_BUILDER_PATH . 'includes/blocks/class-dynamic-blocks.php' );

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
	add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_editor_iframe_assets' );
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_frontend_assets' );
	add_filter( 'block_categories_all', __NAMESPACE__ . '\register_block_category', 10, 2 );
	add_filter( 'allowed_block_types_all', __NAMESPACE__ . '\filter_allowed_block_types', 10, 2 );
	add_filter( 'admin_body_class', __NAMESPACE__ . '\add_admin_body_classes' );

	/**
	 * Fires after Gambol Builder core is initialized.
	 *
	 * @since 1.0.0
	 */
	do_action( 'gambol_builder_init' );
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\init' );

/**
 * Add admin body classes.
 *
 * @param string $classes Existing body classes.
 * @return string Modified body classes.
 */
function add_admin_body_classes( $classes ) {
	// Add WooCommerce active class.
	if ( class_exists( 'WooCommerce' ) ) {
		$classes .= ' woocommerce-active';
	}
	
	// Add Gambol editor class.
	$classes .= ' gambol-builder-editor';
	
	return $classes;
}

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
 * Register custom block categories (replaces default categories).
 *
 * @param array                   $categories Block categories.
 * @param WP_Block_Editor_Context $context    Block editor context.
 * @return array Modified block categories.
 */
function register_block_category( $categories, $context ) {
	// Gambol Builder custom categories only
	$gambol_categories = array(
		array(
			'slug'  => 'gambol-layout',
			'title' => __( 'Layout', 'gambol-builder' ),
			'icon'  => 'layout',
		),
		array(
			'slug'  => 'gambol-content',
			'title' => __( 'Content', 'gambol-builder' ),
			'icon'  => 'text',
		),
		array(
			'slug'  => 'gambol-media',
			'title' => __( 'Media', 'gambol-builder' ),
			'icon'  => 'format-image',
		),
		array(
			'slug'  => 'gambol-utilities',
			'title' => __( 'Utilities', 'gambol-builder' ),
			'icon'  => 'admin-settings',
		),
	);

	// Return only Gambol categories, completely replacing defaults
	return $gambol_categories;
}

/**
 * Get the list of allowed block types.
 *
 * @return array List of allowed block names.
 */
function get_allowed_block_types() {
	return array(
		// Gambol Layout blocks
		'gambol/section',
		'gambol/container',
		// Gambol Content blocks
		'gambol/heading',
		'gambol/text',
		'gambol/button',
		'gambol/icon',
		'gambol/spacer',
		// Gambol Media blocks
		'gambol/image',
		'gambol/video',
		'gambol/gallery',
		// Gambol UI Components
		'gambol/tabs',
		'gambol/tab-panel',
		'gambol/accordion',
		'gambol/accordion-item',
		'gambol/testimonial',
		'gambol/counter',
		// Core blocks we need to keep
		'core/paragraph', // Needed for default typing
		'core/list',
		'core/list-item',
	);
}

/**
 * Filter allowed block types in the editor.
 *
 * @param bool|array              $allowed_block_types Array of allowed block types or true for all.
 * @param WP_Block_Editor_Context $context             Block editor context.
 * @return array Filtered block types.
 */
function filter_allowed_block_types( $allowed_block_types, $context ) {
	return get_allowed_block_types();
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
 * Note: Scripts go here, CSS is enqueued via enqueue_block_assets for iframe support.
 *
 * @return void
 */
function enqueue_editor_assets() {
	// Check if editor script exists.
	$editor_asset_file = GAMBOL_BUILDER_PATH . 'build/editor.asset.php';
	if ( ! file_exists( $editor_asset_file ) ) {
		return;
	}

	$editor_asset = require $editor_asset_file;

	// Enqueue editor panel script.
	wp_enqueue_script(
		'gambol-builder-editor-panel',
		GAMBOL_BUILDER_URL . 'build/editor.js',
		$editor_asset['dependencies'],
		$editor_asset['version'],
		true
	);

	// Pass data to JavaScript.
	wp_localize_script(
		'gambol-builder-editor-panel',
		'gambolBuilderData',
		array(
			'woocommerceActive' => class_exists( 'WooCommerce' ),
			'pluginUrl'         => GAMBOL_BUILDER_URL,
			'version'           => GAMBOL_BUILDER_VERSION,
			'ajaxUrl'           => admin_url( 'admin-ajax.php' ),
			'nonce'             => wp_create_nonce( 'gambol_builder_nonce' ),
			'adminUrl'          => admin_url(),
		)
	);
}

/**
 * Enqueue editor styles for iframe support (WordPress 6.x+).
 * Uses enqueue_block_assets hook which properly adds styles to the iframe.
 *
 * @return void
 */
function enqueue_editor_iframe_assets() {
	// Only load in editor context.
	if ( ! is_admin() ) {
		return;
	}

	$editor_asset_file = GAMBOL_BUILDER_PATH . 'build/editor.asset.php';
	if ( ! file_exists( $editor_asset_file ) ) {
		return;
	}

	$editor_asset = require $editor_asset_file;

	// Enqueue editor panel styles - this will work in iframe.
	if ( file_exists( GAMBOL_BUILDER_PATH . 'build/editor.css' ) ) {
		wp_enqueue_style(
			'gambol-builder-editor-styles',
			GAMBOL_BUILDER_URL . 'build/editor.css',
			array(),
			$editor_asset['version']
		);
	}
}

/**
 * Enqueue frontend assets.
 * Loads interactivity scripts when builder blocks are used.
 *
 * @return void
 */
function enqueue_frontend_assets() {
	// Check if frontend script exists.
	$frontend_asset_file = GAMBOL_BUILDER_PATH . 'build/frontend.asset.php';
	if ( ! file_exists( $frontend_asset_file ) ) {
		return;
	}

	// Only load if post has Gambol blocks.
	if ( ! has_gambol_blocks() ) {
		return;
	}

	$frontend_asset = require $frontend_asset_file;

	// Enqueue frontend interactivity script.
	wp_enqueue_script(
		'gambol-builder-frontend',
		GAMBOL_BUILDER_URL . 'build/frontend.js',
		array(), // No dependencies, vanilla JS
		$frontend_asset['version'],
		true // Load in footer
	);
}

/**
 * Check if current post/page has Gambol Builder blocks.
 *
 * @return bool True if Gambol blocks are present.
 */
function has_gambol_blocks() {
	global $post;

	if ( ! $post || ! isset( $post->post_content ) ) {
		return false;
	}

	// Check for any Gambol block.
	return strpos( $post->post_content, '<!-- wp:gambol/' ) !== false;
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
