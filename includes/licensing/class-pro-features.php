<?php
/**
 * Pro Features.
 *
 * Manages Pro feature access and gating.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Licensing;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Pro_Features
 *
 * Manages which features are Pro-only and gates access.
 */
class Pro_Features {

	/**
	 * Singleton instance.
	 *
	 * @var Pro_Features|null
	 */
	private static $instance = null;

	/**
	 * Registered Pro features.
	 *
	 * @var array
	 */
	private $features = array();

	/**
	 * Cached Pro status.
	 *
	 * @var bool|null
	 */
	private $is_pro_cached = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Pro_Features
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
		$this->register_default_features();
		$this->init();
	}

	/**
	 * Register default Pro features.
	 *
	 * @return void
	 */
	private function register_default_features() {
		$this->features = array(
			// Pro Blocks.
			'advanced-slider' => array(
				'name'        => __( 'Advanced Slider', 'gambol-builder' ),
				'description' => __( 'Create beautiful, responsive sliders.', 'gambol-builder' ),
				'category'    => 'blocks',
			),
			'mega-menu' => array(
				'name'        => __( 'Mega Menu', 'gambol-builder' ),
				'description' => __( 'Build advanced navigation menus.', 'gambol-builder' ),
				'category'    => 'blocks',
			),
			'forms' => array(
				'name'        => __( 'Form Builder', 'gambol-builder' ),
				'description' => __( 'Create contact forms and more.', 'gambol-builder' ),
				'category'    => 'blocks',
			),
			'pricing-table' => array(
				'name'        => __( 'Pricing Table', 'gambol-builder' ),
				'description' => __( 'Display pricing plans beautifully.', 'gambol-builder' ),
				'category'    => 'blocks',
			),
			'posts-grid' => array(
				'name'        => __( 'Posts Grid/List', 'gambol-builder' ),
				'description' => __( 'Display posts in various layouts.', 'gambol-builder' ),
				'category'    => 'blocks',
			),
			'testimonials' => array(
				'name'        => __( 'Testimonials', 'gambol-builder' ),
				'description' => __( 'Showcase customer reviews.', 'gambol-builder' ),
				'category'    => 'blocks',
			),
			'countdown' => array(
				'name'        => __( 'Countdown Timer', 'gambol-builder' ),
				'description' => __( 'Add urgency with countdown timers.', 'gambol-builder' ),
				'category'    => 'blocks',
			),
			'animated-headline' => array(
				'name'        => __( 'Animated Headline', 'gambol-builder' ),
				'description' => __( 'Eye-catching animated text effects.', 'gambol-builder' ),
				'category'    => 'blocks',
			),

			// Pro Features.
			'global-colors' => array(
				'name'        => __( 'Global Colors', 'gambol-builder' ),
				'description' => __( 'Define and reuse colors across your site.', 'gambol-builder' ),
				'category'    => 'features',
			),
			'global-typography' => array(
				'name'        => __( 'Global Typography', 'gambol-builder' ),
				'description' => __( 'Consistent typography settings.', 'gambol-builder' ),
				'category'    => 'features',
			),
			'custom-css' => array(
				'name'        => __( 'Custom CSS', 'gambol-builder' ),
				'description' => __( 'Add custom CSS to blocks and pages.', 'gambol-builder' ),
				'category'    => 'features',
			),
			'dynamic-content' => array(
				'name'        => __( 'Dynamic Content', 'gambol-builder' ),
				'description' => __( 'Display dynamic post data.', 'gambol-builder' ),
				'category'    => 'features',
			),
			'popup-builder' => array(
				'name'        => __( 'Popup Builder', 'gambol-builder' ),
				'description' => __( 'Create popups and lightboxes.', 'gambol-builder' ),
				'category'    => 'features',
			),
			'sticky-elements' => array(
				'name'        => __( 'Sticky Elements', 'gambol-builder' ),
				'description' => __( 'Make any element sticky.', 'gambol-builder' ),
				'category'    => 'features',
			),
			'motion-effects' => array(
				'name'        => __( 'Motion Effects', 'gambol-builder' ),
				'description' => __( 'Add scroll and hover animations.', 'gambol-builder' ),
				'category'    => 'features',
			),
			'display-conditions' => array(
				'name'        => __( 'Display Conditions', 'gambol-builder' ),
				'description' => __( 'Show/hide content based on conditions.', 'gambol-builder' ),
				'category'    => 'features',
			),

			// Templates and support.
			'premium-templates' => array(
				'name'        => __( 'Premium Templates', 'gambol-builder' ),
				'description' => __( 'Access 100+ premium templates.', 'gambol-builder' ),
				'category'    => 'templates',
			),
			'priority-support' => array(
				'name'        => __( 'Priority Support', 'gambol-builder' ),
				'description' => __( 'Fast, dedicated support channel.', 'gambol-builder' ),
				'category'    => 'support',
			),
		);

		/**
		 * Filter registered Pro features.
		 *
		 * @since 1.0.0
		 *
		 * @param array $features Pro features.
		 */
		$this->features = apply_filters( 'gambol_pro_features', $this->features );
	}

	/**
	 * Initialize.
	 *
	 * @return void
	 */
	private function init() {
		// Gate Pro features in editor.
		add_filter( 'gambol_block_supports', array( $this, 'filter_block_supports' ), 10, 2 );

		// Filter available blocks.
		add_filter( 'allowed_block_types_all', array( $this, 'filter_allowed_blocks' ), 10, 2 );

		// Add Pro badges in editor.
		add_action( 'enqueue_block_editor_assets', array( $this, 'localize_pro_status' ) );

		// Gate features in REST API.
		add_filter( 'rest_pre_dispatch', array( $this, 'gate_rest_endpoints' ), 10, 3 );
	}

	/**
	 * Check if Pro is active.
	 *
	 * @return bool True if Pro is active.
	 */
	public function is_pro() {
		if ( null === $this->is_pro_cached ) {
			$this->is_pro_cached = License_Manager::get_instance()->is_pro();
		}
		return $this->is_pro_cached;
	}

	/**
	 * Check if a feature is available.
	 *
	 * @param string $feature_id Feature ID.
	 * @return bool True if available.
	 */
	public function is_feature_available( $feature_id ) {
		// Feature doesn't exist or is not Pro.
		if ( ! isset( $this->features[ $feature_id ] ) ) {
			return true;
		}

		// Pro users have access.
		if ( $this->is_pro() ) {
			return true;
		}

		/**
		 * Filter whether a Pro feature is available.
		 *
		 * @since 1.0.0
		 *
		 * @param bool   $available  Whether feature is available.
		 * @param string $feature_id Feature ID.
		 */
		return apply_filters( 'gambol_feature_available', false, $feature_id );
	}

	/**
	 * Get feature info.
	 *
	 * @param string $feature_id Feature ID.
	 * @return array|null Feature info or null.
	 */
	public function get_feature( $feature_id ) {
		return isset( $this->features[ $feature_id ] ) ? $this->features[ $feature_id ] : null;
	}

	/**
	 * Get all features.
	 *
	 * @return array All features.
	 */
	public function get_all_features() {
		return $this->features;
	}

	/**
	 * Get features by category.
	 *
	 * @param string $category Category.
	 * @return array Features in category.
	 */
	public function get_features_by_category( $category ) {
		return array_filter( $this->features, function( $feature ) use ( $category ) {
			return isset( $feature['category'] ) && $feature['category'] === $category;
		} );
	}

	/**
	 * Register a Pro feature.
	 *
	 * @param string $feature_id Feature ID.
	 * @param array  $args       Feature arguments.
	 * @return void
	 */
	public function register_feature( $feature_id, $args ) {
		$defaults = array(
			'name'        => '',
			'description' => '',
			'category'    => 'features',
		);

		$this->features[ $feature_id ] = wp_parse_args( $args, $defaults );
	}

	/**
	 * Filter block supports for Pro blocks.
	 *
	 * @param array  $supports   Block supports.
	 * @param string $block_name Block name.
	 * @return array Modified supports.
	 */
	public function filter_block_supports( $supports, $block_name ) {
		// Check if this is a Pro block.
		$block_id = str_replace( 'gambol/', '', $block_name );

		if ( isset( $this->features[ $block_id ] ) && ! $this->is_pro() ) {
			// Mark as unavailable.
			$supports['gambol_pro_required'] = true;
		}

		return $supports;
	}

	/**
	 * Filter allowed block types.
	 *
	 * @param bool|array              $allowed_blocks Allowed blocks.
	 * @param \WP_Block_Editor_Context $context        Editor context.
	 * @return bool|array Modified allowed blocks.
	 */
	public function filter_allowed_blocks( $allowed_blocks, $context ) {
		// Don't filter if Pro is active.
		if ( $this->is_pro() ) {
			return $allowed_blocks;
		}

		// Don't filter if already restricted.
		if ( is_array( $allowed_blocks ) ) {
			return $allowed_blocks;
		}

		// Pro blocks are still shown but disabled in editor.
		return $allowed_blocks;
	}

	/**
	 * Localize Pro status for editor.
	 *
	 * @return void
	 */
	public function localize_pro_status() {
		$pro_blocks = array();
		$pro_features = array();

		foreach ( $this->features as $id => $feature ) {
			if ( isset( $feature['category'] ) && 'blocks' === $feature['category'] ) {
				$pro_blocks[] = $id;
			} else {
				$pro_features[] = $id;
			}
		}

		wp_localize_script(
			'gambol-builder-editor',
			'gambolPro',
			array(
				'isPro'       => $this->is_pro(),
				'proBlocks'   => $pro_blocks,
				'proFeatures' => $pro_features,
				'upgradeUrl'  => admin_url( 'admin.php?page=gambol-license' ),
				'messages'    => array(
					'proRequired'   => __( 'This feature requires Gambol Builder Pro.', 'gambol-builder' ),
					'upgradeNow'    => __( 'Upgrade to Pro', 'gambol-builder' ),
					'blockLocked'   => __( 'This block is available with Pro.', 'gambol-builder' ),
				),
			)
		);
	}

	/**
	 * Gate REST API endpoints for Pro features.
	 *
	 * @param mixed            $result  Response.
	 * @param \WP_REST_Server  $server  Server.
	 * @param \WP_REST_Request $request Request.
	 * @return mixed Response.
	 */
	public function gate_rest_endpoints( $result, $server, $request ) {
		$route = $request->get_route();

		// Check if route is Pro-only.
		$pro_routes = array(
			'/gambol-builder/v1/popup',
			'/gambol-builder/v1/forms',
			'/gambol-builder/v1/dynamic-content',
		);

		/**
		 * Filter Pro-only REST routes.
		 *
		 * @since 1.0.0
		 *
		 * @param array $routes Pro routes.
		 */
		$pro_routes = apply_filters( 'gambol_pro_rest_routes', $pro_routes );

		foreach ( $pro_routes as $pro_route ) {
			if ( strpos( $route, $pro_route ) === 0 && ! $this->is_pro() ) {
				return new \WP_Error(
					'gambol_pro_required',
					__( 'This feature requires Gambol Builder Pro.', 'gambol-builder' ),
					array( 'status' => 403 )
				);
			}
		}

		return $result;
	}

	/**
	 * Execute callback only if Pro is active.
	 *
	 * @param callable $callback  Callback to execute.
	 * @param mixed    $fallback  Fallback value if not Pro.
	 * @param mixed    ...$args   Arguments for callback.
	 * @return mixed Callback result or fallback.
	 */
	public function if_pro( $callback, $fallback = null, ...$args ) {
		if ( $this->is_pro() && is_callable( $callback ) ) {
			return call_user_func_array( $callback, $args );
		}
		return $fallback;
	}

	/**
	 * Check feature and maybe show upgrade notice.
	 *
	 * @param string $feature_id Feature ID.
	 * @return bool True if available.
	 */
	public function check_feature( $feature_id ) {
		if ( $this->is_feature_available( $feature_id ) ) {
			return true;
		}

		/**
		 * Fires when a Pro feature is accessed without license.
		 *
		 * @since 1.0.0
		 *
		 * @param string $feature_id Feature ID.
		 */
		do_action( 'gambol_pro_feature_blocked', $feature_id );

		return false;
	}

	/**
	 * Get upgrade URL.
	 *
	 * @param string $source Tracking source.
	 * @return string Upgrade URL.
	 */
	public function get_upgrade_url( $source = '' ) {
		$url = 'https://gambol.dev/pricing';

		if ( $source ) {
			$url = add_query_arg( 'utm_source', sanitize_key( $source ), $url );
		}

		/**
		 * Filter upgrade URL.
		 *
		 * @since 1.0.0
		 *
		 * @param string $url    Upgrade URL.
		 * @param string $source Tracking source.
		 */
		return apply_filters( 'gambol_upgrade_url', $url, $source );
	}

	/**
	 * Clear cached Pro status.
	 *
	 * @return void
	 */
	public function clear_cache() {
		$this->is_pro_cached = null;
	}
}

/**
 * Helper: Check if Pro is active.
 *
 * @return bool True if Pro is active.
 */
function gambol_is_pro() {
	return Pro_Features::get_instance()->is_pro();
}

/**
 * Helper: Check if feature is available.
 *
 * @param string $feature_id Feature ID.
 * @return bool True if available.
 */
function gambol_has_feature( $feature_id ) {
	return Pro_Features::get_instance()->is_feature_available( $feature_id );
}
