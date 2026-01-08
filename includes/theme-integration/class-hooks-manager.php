<?php
/**
 * Hooks Manager.
 *
 * Exposes hooks and filters for theme customization.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\ThemeIntegration;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Hooks_Manager
 *
 * Manages hooks and filters for theme integration.
 */
class Hooks_Manager {

	/**
	 * Singleton instance.
	 *
	 * @var Hooks_Manager|null
	 */
	private static $instance = null;

	/**
	 * Registered hook locations.
	 *
	 * @var array
	 */
	private $hook_locations = array();

	/**
	 * Get singleton instance.
	 *
	 * @return Hooks_Manager
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
		$this->register_hook_locations();
		$this->init();
	}

	/**
	 * Register default hook locations.
	 *
	 * @return void
	 */
	private function register_hook_locations() {
		$this->hook_locations = array(
			// Page structure hooks.
			'before_page'          => array(
				'name'        => __( 'Before Page', 'gambol-builder' ),
				'description' => __( 'Fires before the page wrapper.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'after_page'           => array(
				'name'        => __( 'After Page', 'gambol-builder' ),
				'description' => __( 'Fires after the page wrapper.', 'gambol-builder' ),
				'priority'    => 10,
			),

			// Header hooks.
			'before_header'        => array(
				'name'        => __( 'Before Header', 'gambol-builder' ),
				'description' => __( 'Fires before the header.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'header_top'           => array(
				'name'        => __( 'Header Top', 'gambol-builder' ),
				'description' => __( 'Fires at the top of the header.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'header_bottom'        => array(
				'name'        => __( 'Header Bottom', 'gambol-builder' ),
				'description' => __( 'Fires at the bottom of the header.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'after_header'         => array(
				'name'        => __( 'After Header', 'gambol-builder' ),
				'description' => __( 'Fires after the header.', 'gambol-builder' ),
				'priority'    => 10,
			),

			// Content hooks.
			'before_content'       => array(
				'name'        => __( 'Before Content', 'gambol-builder' ),
				'description' => __( 'Fires before the main content area.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'content_top'          => array(
				'name'        => __( 'Content Top', 'gambol-builder' ),
				'description' => __( 'Fires at the top of the content area.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'content_bottom'       => array(
				'name'        => __( 'Content Bottom', 'gambol-builder' ),
				'description' => __( 'Fires at the bottom of the content area.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'after_content'        => array(
				'name'        => __( 'After Content', 'gambol-builder' ),
				'description' => __( 'Fires after the main content area.', 'gambol-builder' ),
				'priority'    => 10,
			),

			// Footer hooks.
			'before_footer'        => array(
				'name'        => __( 'Before Footer', 'gambol-builder' ),
				'description' => __( 'Fires before the footer.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'footer_top'           => array(
				'name'        => __( 'Footer Top', 'gambol-builder' ),
				'description' => __( 'Fires at the top of the footer.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'footer_bottom'        => array(
				'name'        => __( 'Footer Bottom', 'gambol-builder' ),
				'description' => __( 'Fires at the bottom of the footer.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'after_footer'         => array(
				'name'        => __( 'After Footer', 'gambol-builder' ),
				'description' => __( 'Fires after the footer.', 'gambol-builder' ),
				'priority'    => 10,
			),

			// Single post hooks.
			'before_post_title'    => array(
				'name'        => __( 'Before Post Title', 'gambol-builder' ),
				'description' => __( 'Fires before the post title.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'after_post_title'     => array(
				'name'        => __( 'After Post Title', 'gambol-builder' ),
				'description' => __( 'Fires after the post title.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'before_post_content'  => array(
				'name'        => __( 'Before Post Content', 'gambol-builder' ),
				'description' => __( 'Fires before the post content.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'after_post_content'   => array(
				'name'        => __( 'After Post Content', 'gambol-builder' ),
				'description' => __( 'Fires after the post content.', 'gambol-builder' ),
				'priority'    => 10,
			),

			// Sidebar hooks.
			'before_sidebar'       => array(
				'name'        => __( 'Before Sidebar', 'gambol-builder' ),
				'description' => __( 'Fires before the sidebar.', 'gambol-builder' ),
				'priority'    => 10,
			),
			'after_sidebar'        => array(
				'name'        => __( 'After Sidebar', 'gambol-builder' ),
				'description' => __( 'Fires after the sidebar.', 'gambol-builder' ),
				'priority'    => 10,
			),
		);

		/**
		 * Filter registered hook locations.
		 *
		 * @since 1.0.0
		 *
		 * @param array $locations Hook locations.
		 */
		$this->hook_locations = apply_filters( 'gambol_hook_locations', $this->hook_locations );
	}

	/**
	 * Initialize.
	 *
	 * @return void
	 */
	private function init() {
		// Register all hooks.
		add_action( 'init', array( $this, 'setup_hooks' ), 5 );

		// Allow themes to register callbacks.
		add_action( 'after_setup_theme', array( $this, 'process_theme_callbacks' ), 25 );
	}

	/**
	 * Setup action hooks.
	 *
	 * @return void
	 */
	public function setup_hooks() {
		// Create wrapper actions for each hook location.
		foreach ( array_keys( $this->hook_locations ) as $location ) {
			add_action( "gambol_{$location}", array( $this, 'execute_hook' ), 10, 1 );
		}
	}

	/**
	 * Process theme-registered callbacks.
	 *
	 * @return void
	 */
	public function process_theme_callbacks() {
		$detector = Theme_Detector::get_instance();
		$callbacks = $detector->get_theme_feature( 'hooks' );

		if ( ! is_array( $callbacks ) ) {
			return;
		}

		foreach ( $callbacks as $location => $callback_data ) {
			if ( ! isset( $this->hook_locations[ $location ] ) ) {
				continue;
			}

			// Handle single callback.
			if ( is_callable( $callback_data ) ) {
				add_action( "gambol_{$location}", $callback_data );
				continue;
			}

			// Handle array of callbacks with priority.
			if ( is_array( $callback_data ) ) {
				foreach ( $callback_data as $callback ) {
					if ( is_callable( $callback ) ) {
						add_action( "gambol_{$location}", $callback );
					} elseif ( is_array( $callback ) && isset( $callback['callback'] ) ) {
						$priority = isset( $callback['priority'] ) ? $callback['priority'] : 10;
						add_action( "gambol_{$location}", $callback['callback'], $priority );
					}
				}
			}
		}
	}

	/**
	 * Execute hook.
	 *
	 * @param mixed $args Hook arguments.
	 * @return void
	 */
	public function execute_hook( $args = null ) {
		$hook = current_action();

		/**
		 * Fires when a Gambol hook is executed.
		 *
		 * @since 1.0.0
		 *
		 * @param string $hook Hook name.
		 * @param mixed  $args Hook arguments.
		 */
		do_action( 'gambol_hook_executed', $hook, $args );
	}

	/**
	 * Get hook location.
	 *
	 * @param string $location Location key.
	 * @return array|null Location data or null.
	 */
	public function get_location( $location ) {
		return isset( $this->hook_locations[ $location ] ) ? $this->hook_locations[ $location ] : null;
	}

	/**
	 * Get all hook locations.
	 *
	 * @return array All locations.
	 */
	public function get_all_locations() {
		return $this->hook_locations;
	}

	/**
	 * Register a new hook location.
	 *
	 * @param string $key  Location key.
	 * @param array  $data Location data.
	 * @return void
	 */
	public function register_location( $key, $data ) {
		$defaults = array(
			'name'        => '',
			'description' => '',
			'priority'    => 10,
		);

		$this->hook_locations[ $key ] = wp_parse_args( $data, $defaults );
	}

	/**
	 * Trigger a hook at a location.
	 *
	 * @param string $location Location key.
	 * @param mixed  $args     Optional arguments.
	 * @return void
	 */
	public function do_location( $location, $args = null ) {
		if ( ! isset( $this->hook_locations[ $location ] ) ) {
			return;
		}

		/**
		 * Fires at a specific hook location.
		 *
		 * The dynamic portion of the hook name, `$location`, refers to
		 * the hook location key.
		 *
		 * @since 1.0.0
		 *
		 * @param mixed $args Optional arguments.
		 */
		do_action( "gambol_{$location}", $args );
	}

	/**
	 * Check if location has callbacks.
	 *
	 * @param string $location Location key.
	 * @return bool True if has callbacks.
	 */
	public function has_callbacks( $location ) {
		return has_action( "gambol_{$location}" );
	}

	/**
	 * Get callbacks for a location.
	 *
	 * @param string $location Location key.
	 * @return array Callbacks.
	 */
	public function get_callbacks( $location ) {
		global $wp_filter;

		$hook = "gambol_{$location}";

		if ( ! isset( $wp_filter[ $hook ] ) ) {
			return array();
		}

		return $wp_filter[ $hook ]->callbacks;
	}

	/**
	 * Remove all callbacks from a location.
	 *
	 * @param string $location Location key.
	 * @return void
	 */
	public function remove_all_callbacks( $location ) {
		remove_all_actions( "gambol_{$location}" );
	}

	/**
	 * Register theme hook callback.
	 *
	 * @param string   $location Location key.
	 * @param callable $callback Callback function.
	 * @param int      $priority Priority.
	 * @return void
	 */
	public function add_callback( $location, $callback, $priority = 10 ) {
		if ( ! is_callable( $callback ) ) {
			return;
		}

		add_action( "gambol_{$location}", $callback, $priority );
	}

	/**
	 * Remove theme hook callback.
	 *
	 * @param string   $location Location key.
	 * @param callable $callback Callback function.
	 * @param int      $priority Priority.
	 * @return void
	 */
	public function remove_callback( $location, $callback, $priority = 10 ) {
		remove_action( "gambol_{$location}", $callback, $priority );
	}
}

/**
 * Helper function to trigger hook location.
 *
 * @param string $location Location key.
 * @param mixed  $args     Optional arguments.
 * @return void
 */
function gambol_do_location( $location, $args = null ) {
	Hooks_Manager::get_instance()->do_location( $location, $args );
}
