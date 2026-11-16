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
			// Each Google Fonts stylesheet is kept as enqueued: rewriting or
			// merging css2 URLs (repeated family= params, axis syntax) breaks
			// fonts and the styles that depend on their handles. Instead,
			// connect to the font hosts early and make text render at once.
			add_filter( 'wp_resource_hints', array( $this, 'add_google_preconnect' ), 10, 2 );
			add_filter( 'style_loader_tag', array( $this, 'add_font_display_swap' ), 10, 4 );

			// Preload self-hosted font files listed in the settings.
			add_action( 'wp_head', array( $this, 'add_font_preload' ), 1 );
		} elseif ( $settings->is_enabled( 'font_display_swap' ) ) {
			add_filter( 'style_loader_tag', array( $this, 'add_font_display_swap' ), 10, 4 );
		}
	}

	/**
	 * Check if URL is a Google Fonts URL.
	 *
	 * @param string $url URL to check.
	 * @return bool True if Google Fonts URL.
	 */
	private function is_google_fonts_url( $url ) {
		return is_string( $url ) && false !== strpos( $url, 'fonts.googleapis.com' );
	}

	/**
	 * Preconnect to Google Fonts when a Google Fonts stylesheet is enqueued.
	 *
	 * @param array  $urls          Resource hint URLs.
	 * @param string $relation_type Hint type.
	 * @return array
	 */
	public function add_google_preconnect( $urls, $relation_type ) {
		if ( 'preconnect' !== $relation_type ) {
			return $urls;
		}

		global $wp_styles;
		$uses_google = false;
		if ( $wp_styles instanceof \WP_Styles ) {
			foreach ( (array) $wp_styles->queue as $handle ) {
				if ( isset( $wp_styles->registered[ $handle ] ) && $this->is_google_fonts_url( $wp_styles->registered[ $handle ]->src ) ) {
					$uses_google = true;
					break;
				}
			}
		}

		if ( $uses_google ) {
			$urls[] = 'https://fonts.googleapis.com';
			$urls[] = array(
				'href'        => 'https://fonts.gstatic.com',
				'crossorigin' => 'anonymous',
			);
		}

		return $urls;
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
