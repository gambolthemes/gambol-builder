<?php
/**
 * Layout Configuration.
 *
 * Provides layout widths, breakpoints, and container settings.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\ThemeIntegration;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Layout_Config
 *
 * Manages layout configuration and breakpoints.
 */
class Layout_Config {

	/**
	 * Singleton instance.
	 *
	 * @var Layout_Config|null
	 */
	private static $instance = null;

	/**
	 * Cached configuration.
	 *
	 * @var array|null
	 */
	private $config = null;

	/**
	 * Default configuration.
	 *
	 * @var array
	 */
	private $defaults = array(
		'container_width'     => 1200,
		'wide_width'          => 1400,
		'narrow_width'        => 800,
		'content_width'       => 720,
		'sidebar_width'       => 300,
		'gutter'              => 30,
		'breakpoints'         => array(
			'mobile'  => 480,
			'tablet'  => 768,
			'desktop' => 1024,
			'wide'    => 1200,
		),
		'container_padding'   => array(
			'mobile'  => 15,
			'tablet'  => 20,
			'desktop' => 30,
		),
		'enable_full_width'   => true,
		'enable_boxed_layout' => true,
	);

	/**
	 * Get singleton instance.
	 *
	 * @return Layout_Config
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
		// Load configuration after theme setup.
		add_action( 'after_setup_theme', array( $this, 'load_config' ), 15 );

		// Register content width.
		add_action( 'after_setup_theme', array( $this, 'set_content_width' ), 0 );

		// Output CSS variables.
		add_action( 'wp_head', array( $this, 'output_css_variables' ), 1 );
		add_action( 'admin_head', array( $this, 'output_css_variables' ), 1 );

		// Provide layout data to editor.
		add_action( 'enqueue_block_editor_assets', array( $this, 'localize_editor_config' ) );
	}

	/**
	 * Load configuration from theme or defaults.
	 *
	 * @return void
	 */
	public function load_config() {
		$detector = Theme_Detector::get_instance();

		// Start with defaults.
		$config = $this->defaults;

		// Check for theme configuration.
		$theme_config = $detector->get_theme_feature( 'layout' );

		if ( is_array( $theme_config ) ) {
			$config = $this->merge_config( $config, $theme_config );
		}

		// Check for global styles settings.
		$global_config = $this->get_global_styles_config();

		if ( is_array( $global_config ) ) {
			$config = $this->merge_config( $config, $global_config );
		}

		/**
		 * Filter layout configuration.
		 *
		 * @since 1.0.0
		 *
		 * @param array $config Layout configuration.
		 */
		$this->config = apply_filters( 'gambol_layout_config', $config );
	}

	/**
	 * Merge configuration arrays.
	 *
	 * @param array $base    Base configuration.
	 * @param array $overlay Overlay configuration.
	 * @return array Merged configuration.
	 */
	private function merge_config( $base, $overlay ) {
		foreach ( $overlay as $key => $value ) {
			if ( is_array( $value ) && isset( $base[ $key ] ) && is_array( $base[ $key ] ) ) {
				$base[ $key ] = array_merge( $base[ $key ], $value );
			} else {
				$base[ $key ] = $value;
			}
		}
		return $base;
	}

	/**
	 * Get configuration from Global Styles.
	 *
	 * @return array|null Configuration or null.
	 */
	private function get_global_styles_config() {
		if ( ! class_exists( '\GambolBuilder\Global_Styles' ) ) {
			return null;
		}

		$global_styles = \GambolBuilder\Global_Styles::get_instance();
		$styles = $global_styles->get_styles();

		$config = array();

		if ( isset( $styles['container_width'] ) ) {
			$config['container_width'] = intval( $styles['container_width'] );
		}

		if ( isset( $styles['content_width'] ) ) {
			$config['content_width'] = intval( $styles['content_width'] );
		}

		return ! empty( $config ) ? $config : null;
	}

	/**
	 * Set WordPress content width.
	 *
	 * @return void
	 */
	public function set_content_width() {
		global $content_width;

		if ( ! isset( $content_width ) ) {
			$content_width = $this->get( 'content_width', 720 );
		}
	}

	/**
	 * Get configuration value.
	 *
	 * @param string $key     Configuration key.
	 * @param mixed  $default Default value.
	 * @return mixed Configuration value.
	 */
	public function get( $key, $default = null ) {
		if ( null === $this->config ) {
			$this->load_config();
		}

		if ( isset( $this->config[ $key ] ) ) {
			return $this->config[ $key ];
		}

		// Check for nested keys (e.g., 'breakpoints.mobile').
		if ( strpos( $key, '.' ) !== false ) {
			$keys = explode( '.', $key );
			$value = $this->config;

			foreach ( $keys as $k ) {
				if ( ! isset( $value[ $k ] ) ) {
					return $default;
				}
				$value = $value[ $k ];
			}

			return $value;
		}

		return $default;
	}

	/**
	 * Get all configuration.
	 *
	 * @return array Full configuration.
	 */
	public function get_all() {
		if ( null === $this->config ) {
			$this->load_config();
		}
		return $this->config;
	}

	/**
	 * Get breakpoint value.
	 *
	 * @param string $size Breakpoint size (mobile, tablet, desktop, wide).
	 * @return int Breakpoint value in pixels.
	 */
	public function get_breakpoint( $size ) {
		$breakpoints = $this->get( 'breakpoints', $this->defaults['breakpoints'] );
		return isset( $breakpoints[ $size ] ) ? intval( $breakpoints[ $size ] ) : 0;
	}

	/**
	 * Get all breakpoints.
	 *
	 * @return array Breakpoints.
	 */
	public function get_breakpoints() {
		return $this->get( 'breakpoints', $this->defaults['breakpoints'] );
	}

	/**
	 * Get container width.
	 *
	 * @param string $type Container type (default, wide, narrow).
	 * @return int Width in pixels.
	 */
	public function get_container_width( $type = 'default' ) {
		switch ( $type ) {
			case 'wide':
				return $this->get( 'wide_width', 1400 );
			case 'narrow':
				return $this->get( 'narrow_width', 800 );
			default:
				return $this->get( 'container_width', 1200 );
		}
	}

	/**
	 * Output CSS variables.
	 *
	 * @return void
	 */
	public function output_css_variables() {
		$config = $this->get_all();
		$breakpoints = $this->get_breakpoints();
		$container_padding = $this->get( 'container_padding', $this->defaults['container_padding'] );

		$css = ':root {' . "\n";

		// Layout widths.
		$css .= sprintf( "\t--gambol-container-width: %dpx;\n", $config['container_width'] );
		$css .= sprintf( "\t--gambol-wide-width: %dpx;\n", $config['wide_width'] );
		$css .= sprintf( "\t--gambol-narrow-width: %dpx;\n", $config['narrow_width'] );
		$css .= sprintf( "\t--gambol-content-width: %dpx;\n", $config['content_width'] );
		$css .= sprintf( "\t--gambol-sidebar-width: %dpx;\n", $config['sidebar_width'] );
		$css .= sprintf( "\t--gambol-gutter: %dpx;\n", $config['gutter'] );

		// Breakpoints.
		foreach ( $breakpoints as $name => $value ) {
			$css .= sprintf( "\t--gambol-breakpoint-%s: %dpx;\n", $name, $value );
		}

		// Container padding (responsive).
		$css .= sprintf( "\t--gambol-container-padding: %dpx;\n", $container_padding['desktop'] );

		$css .= "}\n";

		// Responsive container padding.
		$css .= sprintf(
			"@media (max-width: %dpx) {\n\t:root { --gambol-container-padding: %dpx; }\n}\n",
			$breakpoints['tablet'],
			$container_padding['tablet']
		);

		$css .= sprintf(
			"@media (max-width: %dpx) {\n\t:root { --gambol-container-padding: %dpx; }\n}\n",
			$breakpoints['mobile'],
			$container_padding['mobile']
		);

		printf( '<style id="gambol-layout-vars">%s</style>' . "\n", $css );
	}

	/**
	 * Localize configuration for editor.
	 *
	 * @return void
	 */
	public function localize_editor_config() {
		$config = $this->get_all();

		wp_localize_script(
			'gambol-builder-editor',
			'gambolLayout',
			array(
				'containerWidth'  => $config['container_width'],
				'wideWidth'       => $config['wide_width'],
				'narrowWidth'     => $config['narrow_width'],
				'contentWidth'    => $config['content_width'],
				'gutter'          => $config['gutter'],
				'breakpoints'     => $this->get_breakpoints(),
				'enableFullWidth' => $config['enable_full_width'],
				'enableBoxed'     => $config['enable_boxed_layout'],
			)
		);
	}

	/**
	 * Generate container CSS.
	 *
	 * @param string $selector CSS selector.
	 * @param string $type     Container type.
	 * @return string CSS rules.
	 */
	public function generate_container_css( $selector, $type = 'default' ) {
		$width = $this->get_container_width( $type );
		$gutter = $this->get( 'gutter', 30 );

		$css = sprintf(
			'%s {
	width: 100%%;
	max-width: %dpx;
	margin-left: auto;
	margin-right: auto;
	padding-left: var(--gambol-container-padding, %dpx);
	padding-right: var(--gambol-container-padding, %dpx);
}',
			$selector,
			$width,
			$gutter / 2,
			$gutter / 2
		);

		return $css;
	}

	/**
	 * Get media query for breakpoint.
	 *
	 * @param string $size  Breakpoint size.
	 * @param string $type  Query type (min or max).
	 * @return string Media query string.
	 */
	public function get_media_query( $size, $type = 'max' ) {
		$breakpoint = $this->get_breakpoint( $size );

		if ( 'min' === $type ) {
			return sprintf( '@media (min-width: %dpx)', $breakpoint + 1 );
		}

		return sprintf( '@media (max-width: %dpx)', $breakpoint );
	}

	/**
	 * Check if layout feature is enabled.
	 *
	 * @param string $feature Feature name.
	 * @return bool True if enabled.
	 */
	public function is_enabled( $feature ) {
		$key = 'enable_' . $feature;
		return (bool) $this->get( $key, false );
	}
}
