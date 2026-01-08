<?php
/**
 * Performance Optimization Settings.
 *
 * Manages performance settings storage and retrieval.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Performance;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Settings
 *
 * Handles performance settings storage and defaults.
 */
class Settings {

	/**
	 * Option name for storing settings.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'gambol_performance_settings';

	/**
	 * Singleton instance.
	 *
	 * @var Settings|null
	 */
	private static $instance = null;

	/**
	 * Cached settings.
	 *
	 * @var array|null
	 */
	private $settings = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Settings
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
	private function __construct() {}

	/**
	 * Get default settings.
	 *
	 * @return array Default settings.
	 */
	public function get_defaults() {
		return array(
			// CSS Optimization.
			'conditional_css'         => true,
			'disable_unused_blocks'   => false,
			'disable_editor_frontend' => true,

			// Font Optimization.
			'optimize_google_fonts'   => true,
			'font_display'            => 'swap',
			'preload_fonts'           => true,

			// Image Optimization.
			'lazy_load_images'        => true,
			'lazy_load_threshold'     => '200px',
			'add_image_dimensions'    => true,

			// Asset Optimization.
			'defer_block_scripts'     => true,
			'remove_block_library'    => false,
			'disable_emojis'          => true,
			'disable_embeds'          => false,

			// Advanced.
			'remove_jquery_migrate'   => true,
			'disable_dashicons'       => true,
			'prefetch_dns'            => array(),
			'preconnect_origins'      => array(),
		);
	}

	/**
	 * Get all settings.
	 *
	 * @return array All settings merged with defaults.
	 */
	public function get_all() {
		if ( null === $this->settings ) {
			$saved = get_option( self::OPTION_NAME, array() );
			$this->settings = wp_parse_args( $saved, $this->get_defaults() );
		}
		return $this->settings;
	}

	/**
	 * Get a specific setting.
	 *
	 * @param string $key     Setting key.
	 * @param mixed  $default Default value if not set.
	 * @return mixed Setting value.
	 */
	public function get( $key, $default = null ) {
		$settings = $this->get_all();

		if ( isset( $settings[ $key ] ) ) {
			return $settings[ $key ];
		}

		if ( null !== $default ) {
			return $default;
		}

		$defaults = $this->get_defaults();
		return isset( $defaults[ $key ] ) ? $defaults[ $key ] : null;
	}

	/**
	 * Update settings.
	 *
	 * @param array $new_settings Settings to update.
	 * @return bool True on success.
	 */
	public function update( $new_settings ) {
		$current = $this->get_all();
		$merged = wp_parse_args( $new_settings, $current );

		// Sanitize settings.
		$sanitized = $this->sanitize( $merged );

		// Update option.
		$result = update_option( self::OPTION_NAME, $sanitized );

		// Clear cache.
		$this->settings = null;

		return $result;
	}

	/**
	 * Sanitize settings.
	 *
	 * @param array $settings Settings to sanitize.
	 * @return array Sanitized settings.
	 */
	public function sanitize( $settings ) {
		$sanitized = array();
		$defaults = $this->get_defaults();

		// Boolean fields.
		$boolean_fields = array(
			'conditional_css',
			'disable_unused_blocks',
			'disable_editor_frontend',
			'optimize_google_fonts',
			'preload_fonts',
			'lazy_load_images',
			'add_image_dimensions',
			'defer_block_scripts',
			'remove_block_library',
			'disable_emojis',
			'disable_embeds',
			'remove_jquery_migrate',
			'disable_dashicons',
		);

		foreach ( $boolean_fields as $field ) {
			$sanitized[ $field ] = ! empty( $settings[ $field ] );
		}

		// Font display.
		$allowed_font_display = array( 'auto', 'block', 'swap', 'fallback', 'optional' );
		$sanitized['font_display'] = in_array( $settings['font_display'] ?? 'swap', $allowed_font_display, true )
			? $settings['font_display']
			: 'swap';

		// Lazy load threshold.
		$sanitized['lazy_load_threshold'] = sanitize_text_field( $settings['lazy_load_threshold'] ?? '200px' );

		// Arrays.
		$sanitized['prefetch_dns'] = isset( $settings['prefetch_dns'] ) && is_array( $settings['prefetch_dns'] )
			? array_map( 'esc_url_raw', $settings['prefetch_dns'] )
			: array();

		$sanitized['preconnect_origins'] = isset( $settings['preconnect_origins'] ) && is_array( $settings['preconnect_origins'] )
			? array_map( 'esc_url_raw', $settings['preconnect_origins'] )
			: array();

		return $sanitized;
	}

	/**
	 * Reset settings to defaults.
	 *
	 * @return bool True on success.
	 */
	public function reset() {
		$this->settings = null;
		return delete_option( self::OPTION_NAME );
	}

	/**
	 * Check if a feature is enabled.
	 *
	 * @param string $feature Feature key.
	 * @return bool True if enabled.
	 */
	public function is_enabled( $feature ) {
		return (bool) $this->get( $feature, false );
	}
}
