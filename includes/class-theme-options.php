<?php
/**
 * Theme Options Panel.
 *
 * Comprehensive site-wide settings panel — equivalent to Avada's Theme Options.
 * Covers: Header, Footer, Blog, Social, Custom Code, Performance.
 *
 * Storage: gambol_theme_options wp_options key.
 * REST: gambol-builder/v1/theme-options
 *
 * @package GambolBuilder
 */

namespace GambolBuilder;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Theme_Options
 */
class Theme_Options {

	const OPTION_NAME = 'gambol_theme_options';
	const NAMESPACE   = 'gambol-builder/v1';

	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		add_action( 'wp_head',       array( $this, 'output_custom_head_code' ),   999 );
		add_action( 'wp_footer',     array( $this, 'output_custom_footer_code' ), 999 );

		// Back-to-top button.
		add_action( 'wp_footer', array( $this, 'output_back_to_top' ), 100 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_back_to_top' ) );
	}

	/**
	 * Default theme options.
	 *
	 * @return array
	 */
	public function get_defaults() {
		return array(
			'header'  => array(
				'logo_max_height'    => '60px',
				'sticky'             => false,
				'sticky_shrink'      => true,
				'sticky_offset'      => '0',
				'nav_alignment'      => 'right',
				'mobile_breakpoint'  => '768',
			),
			'footer'  => array(
				'columns'            => '4',
				'copyright_text'     => sprintf( '&copy; %s {site_name}. All rights reserved.', wp_date( 'Y' ) ),
				'back_to_top'        => true,
			),
			'blog'    => array(
				'layout'             => 'grid',
				'excerpt_length'     => '20',
				'read_more_text'     => 'Read More',
				'date_format'        => 'F j, Y',
				'show_author'        => true,
				'show_date'          => true,
				'show_categories'    => true,
			),
			'social'  => array(
				'facebook'           => '',
				'twitter'            => '',
				'instagram'          => '',
				'linkedin'           => '',
				'youtube'            => '',
				'github'             => '',
				'pinterest'          => '',
				'tiktok'             => '',
			),
			'code'    => array(
				'head_scripts'       => '',
				'footer_scripts'     => '',
			),
			'performance' => array(
				'lazy_load_images'   => true,
				'defer_js'           => false,
				'preconnect_origins' => '',
			),
		);
	}

	/**
	 * Get theme options (merged with defaults).
	 *
	 * @return array
	 */
	public function get_options() {
		$saved = get_option( self::OPTION_NAME, array() );
		return $this->deep_merge( $this->get_defaults(), $saved );
	}

	/**
	 * Deep merge two arrays.
	 *
	 * @param array $defaults
	 * @param array $override
	 * @return array
	 */
	private function deep_merge( $defaults, $override ) {
		foreach ( $override as $key => $value ) {
			if ( is_array( $value ) && isset( $defaults[ $key ] ) && is_array( $defaults[ $key ] ) ) {
				$defaults[ $key ] = $this->deep_merge( $defaults[ $key ], $value );
			} else {
				$defaults[ $key ] = $value;
			}
		}
		return $defaults;
	}

	/**
	 * Register REST routes.
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route( self::NAMESPACE, '/theme-options', array(
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_options_endpoint' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			),
			array(
				'methods'             => \WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_options_endpoint' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			),
		) );
	}

	/**
	 * @return bool
	 */
	public function check_permissions() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * GET endpoint.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_options_endpoint() {
		return rest_ensure_response( $this->get_options() );
	}

	/**
	 * POST endpoint.
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function update_options_endpoint( $request ) {
		$data = $request->get_json_params();
		if ( empty( $data ) ) {
			return new \WP_Error( 'missing_data', __( 'No data provided.', 'gambol-builder' ), array( 'status' => 400 ) );
		}

		$sanitized = $this->sanitize_options( $data );
		update_option( self::OPTION_NAME, $sanitized );

		return rest_ensure_response( $this->get_options() );
	}

	/**
	 * Sanitize incoming options.
	 *
	 * @param array $data
	 * @return array
	 */
	private function sanitize_options( $data ) {
		$clean    = array();
		$defaults = $this->get_defaults();

		foreach ( $defaults as $section => $fields ) {
			if ( ! isset( $data[ $section ] ) ) {
				continue;
			}
			$clean[ $section ] = array();
			foreach ( $fields as $key => $default ) {
				if ( ! array_key_exists( $key, $data[ $section ] ) ) {
					continue;
				}
				$val = $data[ $section ][ $key ];
				if ( is_bool( $default ) ) {
					$clean[ $section ][ $key ] = (bool) $val;
				} elseif ( is_numeric( $default ) ) {
					$clean[ $section ][ $key ] = sanitize_text_field( (string) $val );
				} elseif ( $section === 'code' ) {
					// Allow script tags in custom code fields.
					$clean[ $section ][ $key ] = wp_kses( $val, array(
						'script' => array( 'src' => true, 'type' => true, 'async' => true, 'defer' => true ),
						'link'   => array( 'href' => true, 'rel' => true, 'type' => true ),
						'style'  => array(),
						'meta'   => array( 'name' => true, 'content' => true, 'property' => true ),
					) );
				} else {
					$clean[ $section ][ $key ] = sanitize_text_field( (string) $val );
				}
			}
		}

		return $clean;
	}

	/**
	 * Output custom <head> code.
	 *
	 * @return void
	 */
	public function output_custom_head_code() {
		$options = $this->get_options();
		$code    = $options['code']['head_scripts'] ?? '';
		if ( ! empty( $code ) ) {
			echo "\n" . $code . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}

	/**
	 * Output custom footer code.
	 *
	 * @return void
	 */
	public function output_custom_footer_code() {
		$options = $this->get_options();
		$code    = $options['code']['footer_scripts'] ?? '';
		if ( ! empty( $code ) ) {
			echo "\n" . $code . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}

	/**
	 * Output back-to-top button HTML.
	 *
	 * @return void
	 */
	public function output_back_to_top() {
		$options = $this->get_options();
		if ( empty( $options['footer']['back_to_top'] ) ) {
			return;
		}
		echo '<button id="gambol-back-to-top" class="gambol-back-to-top" aria-label="' . esc_attr__( 'Back to top', 'gambol-builder' ) . '" hidden>';
		echo '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
		echo '</button>';
	}

	/**
	 * Enqueue back-to-top inline JS + CSS.
	 *
	 * @return void
	 */
	public function enqueue_back_to_top() {
		$options = $this->get_options();
		if ( empty( $options['footer']['back_to_top'] ) ) {
			return;
		}

		// Inline CSS.
		$css = '#gambol-back-to-top{position:fixed;bottom:24px;right:24px;z-index:9999;background:var(--gb-colors-primary,#00d4aa);color:#000;border:none;width:44px;height:44px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.2);transition:opacity .2s,transform .2s}#gambol-back-to-top[hidden]{display:none}#gambol-back-to-top.is-visible{display:flex}#gambol-back-to-top:hover{transform:translateY(-2px)}';
		wp_add_inline_style( 'gambol-builder-style', $css );

		// Inline JS.
		$js = '(function(){var btn=document.getElementById("gambol-back-to-top");if(!btn)return;window.addEventListener("scroll",function(){btn.hidden=window.scrollY<300;},{ passive:true });btn.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"});});})();';
		wp_add_inline_script( 'gambol-builder-frontend', $js );
	}
}

// Initialize.
add_action( 'plugins_loaded', function() {
	Theme_Options::get_instance();
} );
