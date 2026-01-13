<?php
/**
 * CSS Optimizer.
 *
 * Handles conditional CSS loading and CSS-related optimizations.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Performance;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class CSS_Optimizer
 *
 * Manages CSS optimization including conditional loading.
 */
class CSS_Optimizer {

	/**
	 * Singleton instance.
	 *
	 * @var CSS_Optimizer|null
	 */
	private static $instance = null;

	/**
	 * Blocks used on current page.
	 *
	 * @var array
	 */
	private $used_blocks = array();

	/**
	 * Get singleton instance.
	 *
	 * @return CSS_Optimizer
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
		// Don't run in admin.
		if ( is_admin() ) {
			return;
		}

		$settings = Settings::get_instance();

		// Conditional CSS loading.
		if ( $settings->is_enabled( 'conditional_css' ) || $settings->is_enabled( 'disable_unused_blocks' ) ) {
			add_action( 'wp', array( $this, 'detect_used_blocks' ) );
			add_action( 'wp_enqueue_scripts', array( $this, 'optimize_block_styles' ), 100 );
		}

		// Remove editor styles on frontend.
		if ( $settings->is_enabled( 'disable_editor_frontend' ) ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'remove_editor_styles' ), 100 );
		}

		// Remove block library CSS.
		if ( $settings->is_enabled( 'remove_block_library' ) ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'remove_block_library' ), 100 );
		}
	}

	/**
	 * Detect blocks used on current page.
	 *
	 * @return void
	 */
	public function detect_used_blocks() {
		global $post;

		$this->used_blocks = array();

		// Check main post content.
		if ( $post && has_blocks( $post->post_content ) ) {
			$this->extract_blocks( $post->post_content );
		}

		// Check header/footer if using Gambol Header Footer.
		if ( function_exists( 'gambol_get_header' ) ) {
			$header = gambol_get_header();
			if ( $header && has_blocks( $header->post_content ) ) {
				$this->extract_blocks( $header->post_content );
			}
		}

		if ( function_exists( 'gambol_get_footer' ) ) {
			$footer = gambol_get_footer();
			if ( $footer && has_blocks( $footer->post_content ) ) {
				$this->extract_blocks( $footer->post_content );
			}
		}

		// Allow other plugins to add used blocks.
		$this->used_blocks = apply_filters( 'gambol_used_blocks', $this->used_blocks );
	}

	/**
	 * Extract block names from content.
	 *
	 * @param string $content Post content.
	 * @return void
	 */
	private function extract_blocks( $content ) {
		$blocks = parse_blocks( $content );
		$this->process_blocks( $blocks );
	}

	/**
	 * Process blocks recursively.
	 *
	 * @param array $blocks Array of blocks.
	 * @return void
	 */
	private function process_blocks( $blocks ) {
		foreach ( $blocks as $block ) {
			if ( ! empty( $block['blockName'] ) ) {
				$this->used_blocks[] = $block['blockName'];
			}

			// Process inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$this->process_blocks( $block['innerBlocks'] );
			}
		}

		$this->used_blocks = array_unique( $this->used_blocks );
	}

	/**
	 * Optimize block styles based on usage.
	 *
	 * @return void
	 */
	public function optimize_block_styles() {
		$settings = Settings::get_instance();

		if ( ! $settings->is_enabled( 'disable_unused_blocks' ) ) {
			return;
		}

		// Get all registered styles.
		global $wp_styles;

		if ( ! $wp_styles ) {
			return;
		}

		// Gambol block handles.
		$gambol_block_styles = array(
			'gambol-section'   => 'gambol/section',
			'gambol-container' => 'gambol/container',
			'gambol-heading'   => 'gambol/heading',
			'gambol-text'      => 'gambol/text',
			'gambol-button'    => 'gambol/button',
		);

		// Allow filtering of block style mapping.
		$gambol_block_styles = apply_filters( 'gambol_block_style_handles', $gambol_block_styles );

		foreach ( $gambol_block_styles as $handle => $block_name ) {
			// If block is not used, dequeue its style.
			if ( ! in_array( $block_name, $this->used_blocks, true ) ) {
				wp_dequeue_style( $handle );
			}
		}
	}

	/**
	 * Remove editor styles from frontend.
	 *
	 * @return void
	 */
	public function remove_editor_styles() {
		// Common editor-only style handles.
		$editor_handles = array(
			'wp-editor-font',
			'wp-block-editor',
			'wp-edit-blocks',
			'wp-nux',
			'wp-format-library',
		);

		// Allow filtering.
		$editor_handles = apply_filters( 'gambol_editor_style_handles', $editor_handles );

		foreach ( $editor_handles as $handle ) {
			wp_dequeue_style( $handle );
			wp_deregister_style( $handle );
		}
	}

	/**
	 * Remove block library CSS.
	 *
	 * @return void
	 */
	public function remove_block_library() {
		wp_dequeue_style( 'wp-block-library' );
		wp_dequeue_style( 'wp-block-library-theme' );
		wp_dequeue_style( 'wc-blocks-style' ); // WooCommerce blocks.
		wp_dequeue_style( 'global-styles' ); // Global styles (FSE).
	}

	/**
	 * Get used blocks on current page.
	 *
	 * @return array Array of block names.
	 */
	public function get_used_blocks() {
		return $this->used_blocks;
	}

	/**
	 * Check if a specific block is used.
	 *
	 * @param string $block_name Block name (e.g., 'gambol/section').
	 * @return bool True if block is used.
	 */
	public function is_block_used( $block_name ) {
		return in_array( $block_name, $this->used_blocks, true );
	}
}
