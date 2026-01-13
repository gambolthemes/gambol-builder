<?php
/**
 * Template Override.
 *
 * Allows theme to override default page templates.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\ThemeIntegration;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Template_Override
 *
 * Manages template hierarchy and overrides.
 */
class Template_Override {

	/**
	 * Singleton instance.
	 *
	 * @var Template_Override|null
	 */
	private static $instance = null;

	/**
	 * Template locations.
	 *
	 * @var array
	 */
	private $template_locations = array();

	/**
	 * Get singleton instance.
	 *
	 * @return Template_Override
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
		$this->set_template_locations();
		$this->init();
	}

	/**
	 * Set template search locations.
	 *
	 * @return void
	 */
	private function set_template_locations() {
		$this->template_locations = array(
			get_stylesheet_directory() . '/gambol/',
			get_stylesheet_directory() . '/gambol-builder/',
			get_template_directory() . '/gambol/',
			get_template_directory() . '/gambol-builder/',
			GAMBOL_BUILDER_PATH . 'templates/',
		);

		/**
		 * Filter template search locations.
		 *
		 * @since 1.0.0
		 *
		 * @param array $locations Template locations.
		 */
		$this->template_locations = apply_filters( 'gambol_template_locations', $this->template_locations );
	}

	/**
	 * Initialize.
	 *
	 * @return void
	 */
	private function init() {
		// Filter page templates.
		add_filter( 'template_include', array( $this, 'maybe_override_template' ), 99 );

		// Add custom page templates.
		add_filter( 'theme_page_templates', array( $this, 'add_page_templates' ) );

		// Handle canvas template.
		add_filter( 'template_include', array( $this, 'handle_canvas_template' ), 100 );

		// Allow theme to control header/footer.
		add_action( 'gambol_before_header', array( $this, 'before_header_hook' ) );
		add_action( 'gambol_after_footer', array( $this, 'after_footer_hook' ) );
	}

	/**
	 * Maybe override template based on theme configuration.
	 *
	 * @param string $template Template file path.
	 * @return string Modified template path.
	 */
	public function maybe_override_template( $template ) {
		$detector = Theme_Detector::get_instance();

		// Check if theme wants to override.
		if ( ! $detector->get_theme_feature( 'override_templates', true ) ) {
			return $template;
		}

		// Get template type.
		$template_type = $this->get_current_template_type();

		if ( ! $template_type ) {
			return $template;
		}

		// Look for Gambol-specific template.
		$gambol_template = $this->locate_template( "gambol-{$template_type}.php" );

		if ( $gambol_template ) {
			return $gambol_template;
		}

		return $template;
	}

	/**
	 * Get current template type.
	 *
	 * @return string|null Template type.
	 */
	private function get_current_template_type() {
		if ( is_singular( 'page' ) ) {
			return 'page';
		}

		if ( is_singular( 'post' ) ) {
			return 'single';
		}

		if ( is_archive() ) {
			return 'archive';
		}

		if ( is_home() ) {
			return 'home';
		}

		if ( is_search() ) {
			return 'search';
		}

		if ( is_404() ) {
			return '404';
		}

		return null;
	}

	/**
	 * Locate template file.
	 *
	 * @param string $template_name Template file name.
	 * @return string|false Template path or false.
	 */
	public function locate_template( $template_name ) {
		foreach ( $this->template_locations as $location ) {
			$path = $location . $template_name;

			if ( file_exists( $path ) ) {
				return $path;
			}
		}

		return false;
	}

	/**
	 * Add custom page templates.
	 *
	 * @param array $templates Page templates.
	 * @return array Modified templates.
	 */
	public function add_page_templates( $templates ) {
		// Gambol Builder Canvas template.
		$templates['gambol-canvas.php'] = __( 'Gambol Canvas (No Header/Footer)', 'gambol-builder' );

		// Gambol Builder Full Width template.
		$templates['gambol-full-width.php'] = __( 'Gambol Full Width', 'gambol-builder' );

		// Gambol Builder Boxed template.
		$templates['gambol-boxed.php'] = __( 'Gambol Boxed', 'gambol-builder' );

		/**
		 * Filter custom page templates.
		 *
		 * @since 1.0.0
		 *
		 * @param array $templates Page templates.
		 */
		return apply_filters( 'gambol_page_templates', $templates );
	}

	/**
	 * Handle canvas template.
	 *
	 * @param string $template Template path.
	 * @return string Modified template path.
	 */
	public function handle_canvas_template( $template ) {
		if ( ! is_singular() ) {
			return $template;
		}

		$page_template = get_page_template_slug();

		// Canvas template - no header/footer.
		if ( 'gambol-canvas.php' === $page_template ) {
			$canvas_template = $this->locate_template( 'canvas.php' );

			if ( $canvas_template ) {
				// Disable header/footer.
				add_filter( 'gambol_render_header', '__return_false' );
				add_filter( 'gambol_render_footer', '__return_false' );

				return $canvas_template;
			}
		}

		// Full width template.
		if ( 'gambol-full-width.php' === $page_template ) {
			$full_width_template = $this->locate_template( 'full-width.php' );

			if ( $full_width_template ) {
				add_filter( 'body_class', array( $this, 'add_full_width_class' ) );
				return $full_width_template;
			}
		}

		// Boxed template.
		if ( 'gambol-boxed.php' === $page_template ) {
			$boxed_template = $this->locate_template( 'boxed.php' );

			if ( $boxed_template ) {
				add_filter( 'body_class', array( $this, 'add_boxed_class' ) );
				return $boxed_template;
			}
		}

		return $template;
	}

	/**
	 * Add full width body class.
	 *
	 * @param array $classes Body classes.
	 * @return array Modified classes.
	 */
	public function add_full_width_class( $classes ) {
		$classes[] = 'gambol-full-width';
		return $classes;
	}

	/**
	 * Add boxed body class.
	 *
	 * @param array $classes Body classes.
	 * @return array Modified classes.
	 */
	public function add_boxed_class( $classes ) {
		$classes[] = 'gambol-boxed-layout';
		return $classes;
	}

	/**
	 * Before header hook - allows theme to inject content.
	 *
	 * @return void
	 */
	public function before_header_hook() {
		/**
		 * Fires before the header is rendered.
		 *
		 * @since 1.0.0
		 */
		do_action( 'gambol_theme_before_header' );
	}

	/**
	 * After footer hook - allows theme to inject content.
	 *
	 * @return void
	 */
	public function after_footer_hook() {
		/**
		 * Fires after the footer is rendered.
		 *
		 * @since 1.0.0
		 */
		do_action( 'gambol_theme_after_footer' );
	}

	/**
	 * Check if using a Gambol template.
	 *
	 * @return bool True if using Gambol template.
	 */
	public function is_gambol_template() {
		if ( ! is_singular() ) {
			return false;
		}

		$template = get_page_template_slug();

		return strpos( $template, 'gambol' ) !== false;
	}

	/**
	 * Get template part.
	 *
	 * @param string $slug Template slug.
	 * @param string $name Optional template name.
	 * @param array  $args Arguments to pass to template.
	 * @return void
	 */
	public function get_template_part( $slug, $name = null, $args = array() ) {
		$templates = array();

		if ( $name ) {
			$templates[] = "{$slug}-{$name}.php";
		}

		$templates[] = "{$slug}.php";

		foreach ( $templates as $template_name ) {
			$template = $this->locate_template( $template_name );

			if ( $template ) {
				// Extract args for template use.
				if ( ! empty( $args ) && is_array( $args ) ) {
					extract( $args, EXTR_SKIP ); // phpcs:ignore
				}

				include $template;
				return;
			}
		}

		// Fallback to WordPress template part.
		get_template_part( $slug, $name, $args );
	}

	/**
	 * Check if theme is controlling header/footer.
	 *
	 * @return bool True if theme controls header/footer.
	 */
	public function theme_controls_header_footer() {
		$detector = Theme_Detector::get_instance();

		// Check if Gambol theme.
		if ( $detector->is_gambol_theme() ) {
			return $detector->get_theme_feature( 'control_header_footer', true );
		}

		/**
		 * Filter whether theme controls header/footer.
		 *
		 * @since 1.0.0
		 *
		 * @param bool $controls Whether theme controls header/footer.
		 */
		return apply_filters( 'gambol_theme_controls_header_footer', false );
	}

	/**
	 * Should render builder header.
	 *
	 * @return bool True if builder should render header.
	 */
	public function should_render_header() {
		// If theme controls header/footer, let theme decide.
		if ( $this->theme_controls_header_footer() ) {
			/**
			 * Filter whether to render builder header.
			 *
			 * @since 1.0.0
			 *
			 * @param bool $render Whether to render header.
			 */
			return apply_filters( 'gambol_render_header', true );
		}

		// Canvas template disables header.
		if ( is_singular() && 'gambol-canvas.php' === get_page_template_slug() ) {
			return false;
		}

		return apply_filters( 'gambol_render_header', true );
	}

	/**
	 * Should render builder footer.
	 *
	 * @return bool True if builder should render footer.
	 */
	public function should_render_footer() {
		// If theme controls header/footer, let theme decide.
		if ( $this->theme_controls_header_footer() ) {
			/**
			 * Filter whether to render builder footer.
			 *
			 * @since 1.0.0
			 *
			 * @param bool $render Whether to render footer.
			 */
			return apply_filters( 'gambol_render_footer', true );
		}

		// Canvas template disables footer.
		if ( is_singular() && 'gambol-canvas.php' === get_page_template_slug() ) {
			return false;
		}

		return apply_filters( 'gambol_render_footer', true );
	}
}
