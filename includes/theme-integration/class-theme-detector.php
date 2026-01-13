<?php
/**
 * Theme Detector.
 *
 * Detects active theme and its capabilities.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\ThemeIntegration;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Theme_Detector
 *
 * Detects active theme and provides compatibility information.
 */
class Theme_Detector {

	/**
	 * Singleton instance.
	 *
	 * @var Theme_Detector|null
	 */
	private static $instance = null;

	/**
	 * Cached theme data.
	 *
	 * @var array|null
	 */
	private $theme_data = null;

	/**
	 * Compatible theme slugs.
	 *
	 * @var array
	 */
	private $compatible_themes = array(
		'gambol',
		'gambol-theme',
		'gambol-starter',
	);

	/**
	 * Get singleton instance.
	 *
	 * @return Theme_Detector
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
		// Cache theme data after theme setup.
		add_action( 'after_setup_theme', array( $this, 'cache_theme_data' ), 5 );

		// Allow themes to register as compatible.
		add_action( 'after_setup_theme', array( $this, 'check_theme_declaration' ), 10 );
	}

	/**
	 * Cache theme data.
	 *
	 * @return void
	 */
	public function cache_theme_data() {
		$theme = wp_get_theme();

		$this->theme_data = array(
			'name'        => $theme->get( 'Name' ),
			'slug'        => $theme->get_stylesheet(),
			'version'     => $theme->get( 'Version' ),
			'parent'      => $theme->parent() ? $theme->parent()->get_stylesheet() : null,
			'text_domain' => $theme->get( 'TextDomain' ),
			'author'      => $theme->get( 'Author' ),
		);
	}

	/**
	 * Check if theme has declared Gambol Builder support.
	 *
	 * @return void
	 */
	public function check_theme_declaration() {
		// Theme can declare support via add_theme_support.
		if ( current_theme_supports( 'gambol-builder' ) ) {
			$support = get_theme_support( 'gambol-builder' );

			/**
			 * Fires when a theme declares Gambol Builder support.
			 *
			 * @since 1.0.0
			 *
			 * @param array $support Theme support arguments.
			 */
			do_action( 'gambol_theme_support_declared', $support );
		}
	}

	/**
	 * Check if Gambol Theme is active.
	 *
	 * @return bool True if Gambol Theme is active.
	 */
	public function is_gambol_theme() {
		$slug = $this->get_theme_slug();

		// Check direct match.
		if ( in_array( $slug, $this->compatible_themes, true ) ) {
			return true;
		}

		// Check parent theme.
		$parent = $this->get_parent_theme();
		if ( $parent && in_array( $parent, $this->compatible_themes, true ) ) {
			return true;
		}

		// Check if theme declared support.
		if ( current_theme_supports( 'gambol-builder' ) ) {
			return true;
		}

		/**
		 * Filter whether current theme is considered a Gambol theme.
		 *
		 * @since 1.0.0
		 *
		 * @param bool   $is_gambol Whether theme is Gambol theme.
		 * @param string $slug      Current theme slug.
		 */
		return apply_filters( 'gambol_is_gambol_theme', false, $slug );
	}

	/**
	 * Check if theme is compatible with Gambol Builder.
	 *
	 * @return bool True if compatible.
	 */
	public function is_compatible() {
		// Gambol themes are always compatible.
		if ( $this->is_gambol_theme() ) {
			return true;
		}

		// Check for block theme support.
		if ( wp_is_block_theme() ) {
			return true;
		}

		// Check for theme support declarations.
		if ( current_theme_supports( 'gambol-builder' ) ) {
			return true;
		}

		/**
		 * Filter theme compatibility.
		 *
		 * @since 1.0.0
		 *
		 * @param bool   $compatible Whether theme is compatible.
		 * @param string $slug       Theme slug.
		 */
		return apply_filters( 'gambol_theme_compatible', true, $this->get_theme_slug() );
	}

	/**
	 * Get current theme slug.
	 *
	 * @return string Theme slug.
	 */
	public function get_theme_slug() {
		if ( null === $this->theme_data ) {
			return get_stylesheet();
		}
		return $this->theme_data['slug'];
	}

	/**
	 * Get parent theme slug.
	 *
	 * @return string|null Parent theme slug or null.
	 */
	public function get_parent_theme() {
		if ( null === $this->theme_data ) {
			$theme = wp_get_theme();
			return $theme->parent() ? $theme->parent()->get_stylesheet() : null;
		}
		return $this->theme_data['parent'];
	}

	/**
	 * Get theme version.
	 *
	 * @return string Theme version.
	 */
	public function get_theme_version() {
		if ( null === $this->theme_data ) {
			return wp_get_theme()->get( 'Version' );
		}
		return $this->theme_data['version'];
	}

	/**
	 * Get theme name.
	 *
	 * @return string Theme name.
	 */
	public function get_theme_name() {
		if ( null === $this->theme_data ) {
			return wp_get_theme()->get( 'Name' );
		}
		return $this->theme_data['name'];
	}

	/**
	 * Get all theme data.
	 *
	 * @return array Theme data.
	 */
	public function get_theme_data() {
		if ( null === $this->theme_data ) {
			$this->cache_theme_data();
		}
		return $this->theme_data;
	}

	/**
	 * Check if theme has specific feature.
	 *
	 * @param string $feature Feature to check.
	 * @return bool True if feature is supported.
	 */
	public function theme_has_feature( $feature ) {
		// Check native WordPress theme supports.
		if ( current_theme_supports( $feature ) ) {
			return true;
		}

		// Check Gambol-specific features.
		$support = get_theme_support( 'gambol-builder' );

		if ( is_array( $support ) && isset( $support[0] ) && is_array( $support[0] ) ) {
			return in_array( $feature, $support[0], true );
		}

		return false;
	}

	/**
	 * Get theme feature value.
	 *
	 * @param string $feature Feature key.
	 * @param mixed  $default Default value.
	 * @return mixed Feature value or default.
	 */
	public function get_theme_feature( $feature, $default = null ) {
		$support = get_theme_support( 'gambol-builder' );

		if ( is_array( $support ) && isset( $support[0] ) && is_array( $support[0] ) ) {
			if ( isset( $support[0][ $feature ] ) ) {
				return $support[0][ $feature ];
			}
		}

		return $default;
	}

	/**
	 * Add a compatible theme slug.
	 *
	 * @param string $slug Theme slug.
	 * @return void
	 */
	public function add_compatible_theme( $slug ) {
		if ( ! in_array( $slug, $this->compatible_themes, true ) ) {
			$this->compatible_themes[] = $slug;
		}
	}

	/**
	 * Get list of compatible themes.
	 *
	 * @return array Compatible theme slugs.
	 */
	public function get_compatible_themes() {
		/**
		 * Filter list of compatible themes.
		 *
		 * @since 1.0.0
		 *
		 * @param array $themes Compatible theme slugs.
		 */
		return apply_filters( 'gambol_compatible_themes', $this->compatible_themes );
	}
}
