<?php
/**
 * Global Styles System for Gambol Builder.
 *
 * Manages global design tokens including colors, typography, and spacing.
 * Outputs CSS custom properties to :root for use across all blocks.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Global_Styles
 *
 * Handles registration, storage, and output of global design tokens.
 */
class Global_Styles {

	/**
	 * Option name for storing global styles.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'gambol_builder_global_styles';

	/**
	 * Singleton instance.
	 *
	 * @var Global_Styles|null
	 */
	private static $instance = null;

	/**
	 * Cached styles.
	 *
	 * @var array|null
	 */
	private $styles = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Global_Styles
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
		add_action( 'wp_head', array( $this, 'output_css_variables' ), 1 );
		add_action( 'admin_head', array( $this, 'output_css_variables' ), 1 );
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Get default styles.
	 *
	 * @return array Default global styles.
	 */
	public function get_defaults() {
		return array(
			// Colors.
			'colors'     => array(
				'primary'    => '#00d4aa',
				'secondary'  => '#6366f1',
				'heading'    => '#1a1a1a',
				'text'       => '#4a4a4a',
				'text-light' => '#757575',
				'background' => '#ffffff',
				'surface'    => '#f8f9fa',
				'border'     => '#e0e0e0',
				'success'    => '#10b981',
				'warning'    => '#f59e0b',
				'error'      => '#ef4444',
			),
			// Typography.
			'typography' => array(
				'font-family-base'    => '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
				'font-family-heading' => '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
				'font-family-mono'    => 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
				'font-size-base'      => '16px',
				'font-size-sm'        => '14px',
				'font-size-lg'        => '18px',
				'line-height-base'    => '1.6',
				'line-height-heading' => '1.3',
				'heading-scale-h1'    => '2.5',
				'heading-scale-h2'    => '2',
				'heading-scale-h3'    => '1.75',
				'heading-scale-h4'    => '1.5',
				'heading-scale-h5'    => '1.25',
				'heading-scale-h6'    => '1',
			),
			// Spacing.
			'spacing'    => array(
				'xs'  => '4px',
				'sm'  => '8px',
				'md'  => '16px',
				'lg'  => '24px',
				'xl'  => '32px',
				'2xl' => '48px',
				'3xl' => '64px',
			),
			// Buttons.
			'buttons'    => array(
				'border-radius'    => '6px',
				'padding-x'        => '24px',
				'padding-y'        => '12px',
				'font-size'        => '15px',
				'font-weight'      => '500',
				'bg-color'         => '#00d4aa',
				'text-color'       => '#ffffff',
				'hover-bg-color'   => '#00b894',
				'hover-text-color' => '#ffffff',
			),
			// Container.
			'container'  => array(
				'max-width' => '1200px',
				'padding'   => '16px',
			),
			// Border radius.
			'radius'     => array(
				'sm'   => '4px',
				'base' => '6px',
				'md'   => '8px',
				'lg'   => '12px',
				'xl'   => '16px',
				'full' => '9999px',
			),
			// Transitions.
			'transition' => array(
				'fast'   => '150ms',
				'base'   => '200ms',
				'slow'   => '300ms',
				'easing' => 'cubic-bezier(0.4, 0, 0.2, 1)',
			),
		);
	}

	/**
	 * Get global styles.
	 *
	 * @return array Global styles merged with defaults.
	 */
	public function get_styles() {
		if ( null !== $this->styles ) {
			return $this->styles;
		}

		$saved_styles  = get_option( self::OPTION_NAME, array() );
		$this->styles  = $this->merge_styles( $this->get_defaults(), $saved_styles );

		return $this->styles;
	}

	/**
	 * Merge saved styles with defaults.
	 *
	 * @param array $defaults Default styles.
	 * @param array $saved    Saved styles.
	 * @return array Merged styles.
	 */
	private function merge_styles( $defaults, $saved ) {
		$merged = $defaults;

		foreach ( $saved as $category => $values ) {
			if ( isset( $merged[ $category ] ) && is_array( $values ) ) {
				$merged[ $category ] = array_merge( $merged[ $category ], $values );
			}
		}

		return $merged;
	}

	/**
	 * Update global styles.
	 *
	 * @param array $styles New styles to save.
	 * @return bool Whether the update was successful.
	 */
	public function update_styles( $styles ) {
		$this->styles = null; // Clear cache.
		return update_option( self::OPTION_NAME, $styles );
	}

	/**
	 * Output CSS variables.
	 *
	 * @return void
	 */
	public function output_css_variables() {
		$styles = $this->get_styles();
		$css    = $this->generate_css( $styles );

		if ( empty( $css ) ) {
			return;
		}

		printf(
			"<style id=\"gambol-builder-global-styles\">\n:root {\n%s}\n</style>\n",
			$css // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
	}

	/**
	 * Generate CSS from styles array.
	 *
	 * @param array $styles Styles array.
	 * @return string Generated CSS.
	 */
	private function generate_css( $styles ) {
		$css = '';

		foreach ( $styles as $category => $values ) {
			if ( ! is_array( $values ) ) {
				continue;
			}

			foreach ( $values as $key => $value ) {
				$property = sprintf( '--gb-%s-%s', $category, $key );
				$css     .= sprintf( "\t%s: %s;\n", $property, esc_attr( $value ) );
			}
		}

		return $css;
	}

	/**
	 * Register settings.
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			'gambol_builder_settings',
			self::OPTION_NAME,
			array(
				'type'              => 'object',
				'sanitize_callback' => array( $this, 'sanitize_styles' ),
				'default'           => $this->get_defaults(),
			)
		);
	}

	/**
	 * Sanitize styles.
	 *
	 * @param array $styles Styles to sanitize.
	 * @return array Sanitized styles.
	 */
	public function sanitize_styles( $styles ) {
		if ( ! is_array( $styles ) ) {
			return $this->get_defaults();
		}

		$sanitized = array();
		$defaults  = $this->get_defaults();

		foreach ( $defaults as $category => $values ) {
			if ( ! isset( $styles[ $category ] ) || ! is_array( $styles[ $category ] ) ) {
				continue;
			}

			$sanitized[ $category ] = array();

			foreach ( $values as $key => $default_value ) {
				if ( isset( $styles[ $category ][ $key ] ) ) {
					$sanitized[ $category ][ $key ] = sanitize_text_field( $styles[ $category ][ $key ] );
				}
			}
		}

		return $sanitized;
	}

	/**
	 * Register REST API routes.
	 *
	 * @return void
	 */
	public function register_rest_routes() {
		register_rest_route(
			'gambol-builder/v1',
			'/global-styles',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_styles_endpoint' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_styles_endpoint' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);
	}

	/**
	 * Check permissions for REST API.
	 *
	 * @return bool Whether the user has permission.
	 */
	public function check_permissions() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Get styles REST endpoint.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_styles_endpoint() {
		return rest_ensure_response( $this->get_styles() );
	}

	/**
	 * Update styles REST endpoint.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function update_styles_endpoint( $request ) {
		$styles = $request->get_json_params();

		if ( empty( $styles ) ) {
			return new \WP_Error(
				'invalid_styles',
				__( 'Invalid styles data.', 'gambol-builder' ),
				array( 'status' => 400 )
			);
		}

		$sanitized = $this->sanitize_styles( $styles );
		$updated   = $this->update_styles( $sanitized );

		if ( ! $updated ) {
			return new \WP_Error(
				'update_failed',
				__( 'Failed to update styles.', 'gambol-builder' ),
				array( 'status' => 500 )
			);
		}

		return rest_ensure_response( $this->get_styles() );
	}

	/**
	 * Get a specific style value.
	 *
	 * @param string $category Style category.
	 * @param string $key      Style key.
	 * @return string|null Style value or null if not found.
	 */
	public function get_style( $category, $key ) {
		$styles = $this->get_styles();

		return $styles[ $category ][ $key ] ?? null;
	}

	/**
	 * Get CSS variable name.
	 *
	 * @param string $category Style category.
	 * @param string $key      Style key.
	 * @return string CSS variable name.
	 */
	public static function get_css_var( $category, $key ) {
		return sprintf( 'var(--gb-%s-%s)', $category, $key );
	}
}

/**
 * Initialize Global Styles.
 *
 * @return Global_Styles
 */
function global_styles() {
	return Global_Styles::get_instance();
}

// Initialize on plugins_loaded.
add_action( 'plugins_loaded', __NAMESPACE__ . '\global_styles' );
