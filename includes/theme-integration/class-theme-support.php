<?php
/**
 * Theme Support.
 *
 * Registers and manages theme supports for Gambol Builder.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\ThemeIntegration;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Theme_Support
 *
 * Manages theme support registration and requirements.
 */
class Theme_Support {

	/**
	 * Singleton instance.
	 *
	 * @var Theme_Support|null
	 */
	private static $instance = null;

	/**
	 * Required theme supports.
	 *
	 * @var array
	 */
	private $required_supports = array();

	/**
	 * Recommended theme supports.
	 *
	 * @var array
	 */
	private $recommended_supports = array();

	/**
	 * Get singleton instance.
	 *
	 * @return Theme_Support
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
		$this->define_supports();
		$this->init();
	}

	/**
	 * Define required and recommended supports.
	 *
	 * @return void
	 */
	private function define_supports() {
		$this->required_supports = array(
			'title-tag',
			'post-thumbnails',
			'html5' => array(
				'comment-list',
				'comment-form',
				'search-form',
				'gallery',
				'caption',
				'style',
				'script',
			),
		);

		$this->recommended_supports = array(
			'align-wide',
			'responsive-embeds',
			'custom-line-height',
			'custom-spacing',
			'custom-units',
			'appearance-tools',
			'border',
			'link-color',
			'editor-styles',
		);
	}

	/**
	 * Initialize.
	 *
	 * @return void
	 */
	private function init() {
		// Register theme supports early.
		add_action( 'after_setup_theme', array( $this, 'register_theme_supports' ), 20 );

		// Add editor supports.
		add_action( 'after_setup_theme', array( $this, 'register_editor_supports' ), 20 );

		// Register block patterns support.
		add_action( 'after_setup_theme', array( $this, 'register_pattern_supports' ), 20 );
	}

	/**
	 * Register theme supports.
	 *
	 * @return void
	 */
	public function register_theme_supports() {
		$detector = Theme_Detector::get_instance();

		// Only auto-register if not using a Gambol theme (theme handles its own supports).
		if ( $detector->is_gambol_theme() ) {
			return;
		}

		// Register required supports if missing.
		foreach ( $this->required_supports as $key => $value ) {
			if ( is_string( $key ) ) {
				if ( ! current_theme_supports( $key ) ) {
					add_theme_support( $key, $value );
				}
			} else {
				if ( ! current_theme_supports( $value ) ) {
					add_theme_support( $value );
				}
			}
		}

		// Register recommended supports if theme opts in.
		if ( $this->should_add_recommended_supports() ) {
			foreach ( $this->recommended_supports as $support ) {
				if ( ! current_theme_supports( $support ) ) {
					add_theme_support( $support );
				}
			}
		}

		/**
		 * Fires after Gambol Builder registers theme supports.
		 *
		 * @since 1.0.0
		 */
		do_action( 'gambol_theme_supports_registered' );
	}

	/**
	 * Check if recommended supports should be added.
	 *
	 * @return bool True if should add.
	 */
	private function should_add_recommended_supports() {
		// Check if theme explicitly opted in.
		$support = get_theme_support( 'gambol-builder' );

		if ( is_array( $support ) && isset( $support[0] ) ) {
			if ( is_array( $support[0] ) && isset( $support[0]['add_recommended_supports'] ) ) {
				return (bool) $support[0]['add_recommended_supports'];
			}
		}

		/**
		 * Filter whether to add recommended theme supports.
		 *
		 * @since 1.0.0
		 *
		 * @param bool $add Whether to add recommended supports.
		 */
		return apply_filters( 'gambol_add_recommended_supports', true );
	}

	/**
	 * Register editor-specific supports.
	 *
	 * @return void
	 */
	public function register_editor_supports() {
		// Add editor styles support.
		add_theme_support( 'editor-styles' );

		// Enqueue editor stylesheet if exists.
		$editor_style = get_stylesheet_directory() . '/editor-style.css';
		if ( file_exists( $editor_style ) ) {
			add_editor_style( 'editor-style.css' );
		}

		// Register Gambol Builder editor styles.
		add_editor_style( GAMBOL_BUILDER_URL . 'build/style-index.css' );

		// Add custom colors if theme provides them.
		$this->register_editor_color_palette();

		// Add font sizes if theme provides them.
		$this->register_editor_font_sizes();

		// Add gradient presets if theme provides them.
		$this->register_editor_gradients();
	}

	/**
	 * Register editor color palette from theme.
	 *
	 * @return void
	 */
	private function register_editor_color_palette() {
		$detector = Theme_Detector::get_instance();
		$colors = $detector->get_theme_feature( 'editor-color-palette' );

		if ( ! empty( $colors ) && is_array( $colors ) ) {
			add_theme_support( 'editor-color-palette', $colors );
			return;
		}

		// Provide default colors if none set.
		if ( ! current_theme_supports( 'editor-color-palette' ) ) {
			$default_colors = $this->get_default_colors();

			/**
			 * Filter default editor color palette.
			 *
			 * @since 1.0.0
			 *
			 * @param array $colors Default colors.
			 */
			$default_colors = apply_filters( 'gambol_default_color_palette', $default_colors );

			if ( ! empty( $default_colors ) ) {
				add_theme_support( 'editor-color-palette', $default_colors );
			}
		}
	}

	/**
	 * Get default color palette.
	 *
	 * @return array Default colors.
	 */
	private function get_default_colors() {
		return array(
			array(
				'name'  => __( 'Primary', 'gambol-builder' ),
				'slug'  => 'primary',
				'color' => '#0073aa',
			),
			array(
				'name'  => __( 'Secondary', 'gambol-builder' ),
				'slug'  => 'secondary',
				'color' => '#23282d',
			),
			array(
				'name'  => __( 'Accent', 'gambol-builder' ),
				'slug'  => 'accent',
				'color' => '#00a0d2',
			),
			array(
				'name'  => __( 'Light', 'gambol-builder' ),
				'slug'  => 'light',
				'color' => '#f5f5f5',
			),
			array(
				'name'  => __( 'Dark', 'gambol-builder' ),
				'slug'  => 'dark',
				'color' => '#1e1e1e',
			),
			array(
				'name'  => __( 'White', 'gambol-builder' ),
				'slug'  => 'white',
				'color' => '#ffffff',
			),
			array(
				'name'  => __( 'Black', 'gambol-builder' ),
				'slug'  => 'black',
				'color' => '#000000',
			),
		);
	}

	/**
	 * Register editor font sizes.
	 *
	 * @return void
	 */
	private function register_editor_font_sizes() {
		$detector = Theme_Detector::get_instance();
		$font_sizes = $detector->get_theme_feature( 'editor-font-sizes' );

		if ( ! empty( $font_sizes ) && is_array( $font_sizes ) ) {
			add_theme_support( 'editor-font-sizes', $font_sizes );
			return;
		}

		// Provide default font sizes if none set.
		if ( ! current_theme_supports( 'editor-font-sizes' ) ) {
			$default_sizes = array(
				array(
					'name' => __( 'Small', 'gambol-builder' ),
					'slug' => 'small',
					'size' => 14,
				),
				array(
					'name' => __( 'Normal', 'gambol-builder' ),
					'slug' => 'normal',
					'size' => 16,
				),
				array(
					'name' => __( 'Medium', 'gambol-builder' ),
					'slug' => 'medium',
					'size' => 20,
				),
				array(
					'name' => __( 'Large', 'gambol-builder' ),
					'slug' => 'large',
					'size' => 24,
				),
				array(
					'name' => __( 'Extra Large', 'gambol-builder' ),
					'slug' => 'x-large',
					'size' => 32,
				),
				array(
					'name' => __( 'Huge', 'gambol-builder' ),
					'slug' => 'huge',
					'size' => 48,
				),
			);

			/**
			 * Filter default editor font sizes.
			 *
			 * @since 1.0.0
			 *
			 * @param array $sizes Default font sizes.
			 */
			$default_sizes = apply_filters( 'gambol_default_font_sizes', $default_sizes );

			add_theme_support( 'editor-font-sizes', $default_sizes );
		}
	}

	/**
	 * Register editor gradients.
	 *
	 * @return void
	 */
	private function register_editor_gradients() {
		$detector = Theme_Detector::get_instance();
		$gradients = $detector->get_theme_feature( 'editor-gradient-presets' );

		if ( ! empty( $gradients ) && is_array( $gradients ) ) {
			add_theme_support( 'editor-gradient-presets', $gradients );
			return;
		}

		// Provide default gradients if none set.
		if ( ! current_theme_supports( 'editor-gradient-presets' ) ) {
			$default_gradients = array(
				array(
					'name'     => __( 'Primary to Secondary', 'gambol-builder' ),
					'slug'     => 'primary-to-secondary',
					'gradient' => 'linear-gradient(135deg, #0073aa 0%, #23282d 100%)',
				),
				array(
					'name'     => __( 'Light to Dark', 'gambol-builder' ),
					'slug'     => 'light-to-dark',
					'gradient' => 'linear-gradient(180deg, #f5f5f5 0%, #1e1e1e 100%)',
				),
				array(
					'name'     => __( 'Accent Fade', 'gambol-builder' ),
					'slug'     => 'accent-fade',
					'gradient' => 'linear-gradient(135deg, #00a0d2 0%, #0073aa 100%)',
				),
			);

			/**
			 * Filter default editor gradients.
			 *
			 * @since 1.0.0
			 *
			 * @param array $gradients Default gradients.
			 */
			$default_gradients = apply_filters( 'gambol_default_gradients', $default_gradients );

			add_theme_support( 'editor-gradient-presets', $default_gradients );
		}
	}

	/**
	 * Register block pattern supports.
	 *
	 * @return void
	 */
	public function register_pattern_supports() {
		// Remove core patterns if theme wants.
		$detector = Theme_Detector::get_instance();

		if ( $detector->get_theme_feature( 'remove_core_patterns', false ) ) {
			remove_theme_support( 'core-block-patterns' );
		}

		// Register Gambol pattern categories.
		if ( function_exists( 'register_block_pattern_category' ) ) {
			register_block_pattern_category(
				'gambol-builder',
				array( 'label' => __( 'Gambol Builder', 'gambol-builder' ) )
			);

			register_block_pattern_category(
				'gambol-headers',
				array( 'label' => __( 'Gambol Headers', 'gambol-builder' ) )
			);

			register_block_pattern_category(
				'gambol-footers',
				array( 'label' => __( 'Gambol Footers', 'gambol-builder' ) )
			);
		}
	}

	/**
	 * Check if specific support is available.
	 *
	 * @param string $support Support key.
	 * @return bool True if supported.
	 */
	public function has_support( $support ) {
		return current_theme_supports( $support );
	}

	/**
	 * Get missing required supports.
	 *
	 * @return array Missing supports.
	 */
	public function get_missing_supports() {
		$missing = array();

		foreach ( $this->required_supports as $key => $value ) {
			$support = is_string( $key ) ? $key : $value;
			if ( ! current_theme_supports( $support ) ) {
				$missing[] = $support;
			}
		}

		return $missing;
	}

	/**
	 * Get all registered supports.
	 *
	 * @return array Supports data.
	 */
	public function get_supports_status() {
		$status = array(
			'required'    => array(),
			'recommended' => array(),
		);

		foreach ( $this->required_supports as $key => $value ) {
			$support = is_string( $key ) ? $key : $value;
			$status['required'][ $support ] = current_theme_supports( $support );
		}

		foreach ( $this->recommended_supports as $support ) {
			$status['recommended'][ $support ] = current_theme_supports( $support );
		}

		return $status;
	}
}
