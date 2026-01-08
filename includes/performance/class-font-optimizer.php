<?php
/**
 * Font Optimizer.
 *
 * Handles Google Fonts and web font optimizations.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Performance;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Font_Optimizer
 *
 * Manages Google Fonts and web font optimization.
 */
class Font_Optimizer {

	/**
	 * Singleton instance.
	 *
	 * @var Font_Optimizer|null
	 */
	private static $instance = null;

	/**
	 * Collected Google Fonts URLs.
	 *
	 * @var array
	 */
	private $google_fonts = array();

	/**
	 * Get singleton instance.
	 *
	 * @return Font_Optimizer
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

		if ( $settings->is_enabled( 'optimize_google_fonts' ) ) {
			// Collect Google Fonts before output.
			add_action( 'wp_enqueue_scripts', array( $this, 'collect_google_fonts' ), 100 );

			// Output combined fonts in head.
			add_action( 'wp_head', array( $this, 'output_optimized_fonts' ), 2 );

			// Add preload hints.
			add_action( 'wp_head', array( $this, 'add_font_preload' ), 1 );
		}

		// Add font-display swap.
		if ( $settings->is_enabled( 'font_display_swap' ) ) {
			add_filter( 'style_loader_tag', array( $this, 'add_font_display_swap' ), 10, 4 );
		}
	}

	/**
	 * Collect Google Fonts from enqueued styles.
	 *
	 * @return void
	 */
	public function collect_google_fonts() {
		global $wp_styles;

		if ( empty( $wp_styles->queue ) ) {
			return;
		}

		foreach ( $wp_styles->queue as $handle ) {
			if ( ! isset( $wp_styles->registered[ $handle ] ) ) {
				continue;
			}

			$style = $wp_styles->registered[ $handle ];
			$src = $style->src;

			// Check if Google Fonts URL.
			if ( $this->is_google_fonts_url( $src ) ) {
				$this->google_fonts[ $handle ] = $src;

				// Dequeue original.
				wp_dequeue_style( $handle );
				wp_deregister_style( $handle );
			}
		}
	}

	/**
	 * Check if URL is a Google Fonts URL.
	 *
	 * @param string $url URL to check.
	 * @return bool True if Google Fonts URL.
	 */
	private function is_google_fonts_url( $url ) {
		return strpos( $url, 'fonts.googleapis.com' ) !== false;
	}

	/**
	 * Output optimized combined Google Fonts.
	 *
	 * @return void
	 */
	public function output_optimized_fonts() {
		if ( empty( $this->google_fonts ) ) {
			return;
		}

		$combined_url = $this->combine_google_fonts();

		if ( $combined_url ) {
			printf(
				'<link rel="stylesheet" href="%s" media="print" onload="this.media=\'all\'">' . "\n",
				esc_url( $combined_url )
			);
			printf(
				'<noscript><link rel="stylesheet" href="%s"></noscript>' . "\n",
				esc_url( $combined_url )
			);
		}
	}

	/**
	 * Combine multiple Google Fonts URLs into one.
	 *
	 * @return string|false Combined URL or false on failure.
	 */
	private function combine_google_fonts() {
		$families = array();
		$display = 'swap';

		foreach ( $this->google_fonts as $url ) {
			$parsed = wp_parse_url( $url );

			if ( ! isset( $parsed['query'] ) ) {
				continue;
			}

			parse_str( $parsed['query'], $args );

			if ( isset( $args['family'] ) ) {
				// Handle multiple families in one URL.
				$font_families = explode( '|', $args['family'] );
				$families = array_merge( $families, $font_families );
			}

			// Use display from first URL that has it.
			if ( isset( $args['display'] ) && 'swap' !== $display ) {
				$display = $args['display'];
			}
		}

		if ( empty( $families ) ) {
			return false;
		}

		// Remove duplicates and combine.
		$families = $this->merge_font_families( $families );

		// Build combined URL.
		$combined_url = add_query_arg(
			array(
				'family'  => implode( '|', $families ),
				'display' => $display,
			),
			'https://fonts.googleapis.com/css2'
		);

		return $combined_url;
	}

	/**
	 * Merge font families intelligently.
	 *
	 * @param array $families Font families.
	 * @return array Merged families.
	 */
	private function merge_font_families( $families ) {
		$merged = array();

		foreach ( $families as $family ) {
			// Parse font family and weights.
			if ( strpos( $family, ':' ) !== false ) {
				list( $name, $weights ) = explode( ':', $family, 2 );
			} else {
				$name = $family;
				$weights = '';
			}

			$name = trim( $name );

			if ( ! isset( $merged[ $name ] ) ) {
				$merged[ $name ] = array();
			}

			if ( ! empty( $weights ) ) {
				// Parse weights.
				$weight_list = explode( ',', $weights );
				$merged[ $name ] = array_merge( $merged[ $name ], $weight_list );
			}
		}

		// Build final families array.
		$result = array();

		foreach ( $merged as $name => $weights ) {
			$weights = array_unique( array_filter( $weights ) );
			sort( $weights );

			if ( ! empty( $weights ) ) {
				$result[] = $name . ':' . implode( ',', $weights );
			} else {
				$result[] = $name;
			}
		}

		return $result;
	}

	/**
	 * Add font preload hints.
	 *
	 * @return void
	 */
	public function add_font_preload() {
		$settings = Settings::get_instance();
		$preload_fonts = $settings->get( 'preload_fonts', array() );

		// Allow filtering.
		$preload_fonts = apply_filters( 'gambol_preload_fonts', $preload_fonts );

		// Ensure we have an array.
		if ( ! is_array( $preload_fonts ) || empty( $preload_fonts ) ) {
			return;
		}

		foreach ( $preload_fonts as $font ) {
			$type = $this->get_font_type( $font );

			printf(
				'<link rel="preload" href="%s" as="font" type="%s" crossorigin>' . "\n",
				esc_url( $font ),
				esc_attr( $type )
			);
		}
	}

	/**
	 * Get font MIME type from URL.
	 *
	 * @param string $url Font URL.
	 * @return string MIME type.
	 */
	private function get_font_type( $url ) {
		$extension = pathinfo( wp_parse_url( $url, PHP_URL_PATH ), PATHINFO_EXTENSION );

		$types = array(
			'woff2' => 'font/woff2',
			'woff'  => 'font/woff',
			'ttf'   => 'font/ttf',
			'otf'   => 'font/otf',
			'eot'   => 'application/vnd.ms-fontobject',
		);

		return isset( $types[ $extension ] ) ? $types[ $extension ] : 'font/woff2';
	}

	/**
	 * Add font-display swap to stylesheets.
	 *
	 * @param string $tag    Link tag.
	 * @param string $handle Stylesheet handle.
	 * @param string $href   Stylesheet URL.
	 * @param string $media  Media attribute.
	 * @return string Modified tag.
	 */
	public function add_font_display_swap( $tag, $handle, $href, $media ) {
		// Only for Google Fonts.
		if ( ! $this->is_google_fonts_url( $href ) ) {
			return $tag;
		}

		// Check if already has display parameter.
		if ( strpos( $href, 'display=' ) !== false ) {
			return $tag;
		}

		// Add display=swap.
		$new_href = add_query_arg( 'display', 'swap', $href );

		return str_replace( $href, $new_href, $tag );
	}

	/**
	 * Generate CSS for font-display swap.
	 *
	 * @param array $fonts Array of font configurations.
	 * @return string CSS with font-display.
	 */
	public function generate_font_face_css( $fonts ) {
		$css = '';

		if ( ! is_array( $fonts ) || empty( $fonts ) ) {
			return $css;
		}

		foreach ( $fonts as $font ) {
			$name = isset( $font['name'] ) ? $font['name'] : '';
			$src = isset( $font['src'] ) ? $font['src'] : '';
			$weight = isset( $font['weight'] ) ? $font['weight'] : 'normal';
			$style = isset( $font['style'] ) ? $font['style'] : 'normal';

			if ( empty( $name ) || empty( $src ) ) {
				continue;
			}

			$css .= sprintf(
				'@font-face {
	font-family: "%s";
	src: url("%s");
	font-weight: %s;
	font-style: %s;
	font-display: swap;
}' . "\n",
				esc_attr( $name ),
				esc_url( $src ),
				esc_attr( $weight ),
				esc_attr( $style )
			);
		}

		return $css;
	}

	/**
	 * Get list of system font stacks for fallbacks.
	 *
	 * @return array System font stacks.
	 */
	public static function get_system_font_stacks() {
		return array(
			'sans-serif' => '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
			'serif'      => 'Georgia, Cambria, "Times New Roman", Times, serif',
			'monospace'  => 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
		);
	}
}
