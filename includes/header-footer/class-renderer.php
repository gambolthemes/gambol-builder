<?php
/**
 * Header Footer Frontend Renderer.
 *
 * Handles frontend display of custom headers and footers.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\HeaderFooter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Renderer
 *
 * Manages frontend rendering of headers and footers.
 */
class Renderer {

	/**
	 * Singleton instance.
	 *
	 * @var Renderer|null
	 */
	private static $instance = null;

	/**
	 * Cached header post.
	 *
	 * @var \WP_Post|null|false
	 */
	private $header = null;

	/**
	 * Cached footer post.
	 *
	 * @var \WP_Post|null|false
	 */
	private $footer = null;

	/**
	 * Whether we've initialized the cache.
	 *
	 * @var bool
	 */
	private $cache_initialized = false;

	/**
	 * Get singleton instance.
	 *
	 * @return Renderer
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
		// Don't run on admin.
		if ( is_admin() ) {
			return;
		}

		// Use template_redirect to ensure conditionals work.
		add_action( 'template_redirect', array( $this, 'setup_cache' ) );

		// Hook into theme.
		add_action( 'wp_body_open', array( $this, 'render_header' ), 5 );
		add_action( 'wp_footer', array( $this, 'render_footer' ), 5 );

		// Replace (not just add to) the theme's own header and footer.
		add_action( 'get_header', array( $this, 'replace_theme_header' ), 1 );
		add_action( 'get_footer', array( $this, 'replace_theme_footer' ), 1 );
		add_filter( 'render_block_core/template-part', array( $this, 'filter_block_theme_part' ), 10, 2 );

		// Enqueue assets.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		// Add body classes.
		add_filter( 'body_class', array( $this, 'add_body_classes' ) );
	}

	/**
	 * Setup cache for current page.
	 *
	 * @return void
	 */
	public function setup_cache() {
		if ( $this->cache_initialized ) {
			return;
		}

		// The Canvas page template has no header or footer at all.
		if ( is_singular() && 'gambol-canvas.php' === get_page_template_slug() ) {
			$this->header            = false;
			$this->footer            = false;
			$this->cache_initialized = true;
			return;
		}

		// Check for per-page overrides first.
		$page_header = $this->get_page_override( 'header' );
		$page_footer = $this->get_page_override( 'footer' );

		// Get header - check for disable/override.
		if ( false === $page_header ) {
			$this->header = false; // Disabled for this page.
		} elseif ( is_int( $page_header ) ) {
			$this->header = get_post( $page_header ); // Custom header selected.
		} else {
			$this->header = $this->get_matching_template( 'header' ); // Use global matching.
		}

		// Get footer - check for disable/override.
		if ( false === $page_footer ) {
			$this->footer = false; // Disabled for this page.
		} elseif ( is_int( $page_footer ) ) {
			$this->footer = get_post( $page_footer ); // Custom footer selected.
		} else {
			$this->footer = $this->get_matching_template( 'footer' ); // Use global matching.
		}

		/**
		 * Filter whether the Gambol header/footer render on this request.
		 *
		 * @param bool   $render Whether to render.
		 * @param string $type   header or footer.
		 */
		if ( $this->header && ! apply_filters( 'gambol_render_header', true, 'header' ) ) {
			$this->header = false;
		}
		if ( $this->footer && ! apply_filters( 'gambol_render_footer', true, 'footer' ) ) {
			$this->footer = false;
		}

		$this->cache_initialized = true;
	}

	/**
	 * Header/footer builder settings.
	 *
	 * @return array
	 */
	private function get_settings() {
		$settings = get_option( 'gambol_hf_settings', array() );
		return wp_parse_args(
			is_array( $settings ) ? $settings : array(),
			array(
				'disable_theme_header' => false,
				'disable_theme_footer' => false,
			)
		);
	}

	/**
	 * Whether the theme's own header/footer should be replaced on this request.
	 *
	 * True when a Gambol header/footer renders here, or when the site setting
	 * hides the theme's one even without a replacement.
	 *
	 * @param string $type header or footer.
	 * @return bool
	 */
	private function should_replace( $type ) {
		$this->setup_cache();
		$has      = 'header' === $type ? (bool) $this->header : (bool) $this->footer;
		$settings = $this->get_settings();
		$replace  = $has || ! empty( $settings[ 'disable_theme_' . $type ] );

		/**
		 * Filter whether Gambol replaces the theme's header or footer.
		 *
		 * @param bool   $replace Whether to replace.
		 * @param string $type    header or footer.
		 */
		return (bool) apply_filters( 'gambol_replace_theme_' . $type, $replace, $type );
	}

	/**
	 * Classic themes: print a minimal document head instead of the theme's
	 * header.php. The Gambol header is printed by render_header() on
	 * wp_body_open, which the shell calls.
	 *
	 * @param string|null $name Header name passed to get_header().
	 * @return void
	 */
	public function replace_theme_header( $name ) {
		if ( ! $this->should_replace( 'header' ) ) {
			return;
		}

		require GAMBOL_BUILDER_PATH . 'templates/hf-header.php';

		// Run the theme's header template into a discarded buffer so it neither
		// prints nor calls wp_head() a second time.
		$templates = array();
		if ( $name ) {
			$templates[] = 'header-' . $name . '.php';
		}
		$templates[] = 'header.php';

		remove_all_actions( 'wp_head' );
		remove_all_actions( 'wp_body_open' );
		ob_start();
		locate_template( $templates, true, false );
		ob_end_clean();
	}

	/**
	 * Classic themes: print the Gambol footer and close the document instead
	 * of the theme's footer.php.
	 *
	 * @param string|null $name Footer name passed to get_footer().
	 * @return void
	 */
	public function replace_theme_footer( $name ) {
		if ( ! $this->should_replace( 'footer' ) ) {
			return;
		}

		require GAMBOL_BUILDER_PATH . 'templates/hf-footer.php';

		$templates = array();
		if ( $name ) {
			$templates[] = 'footer-' . $name . '.php';
		}
		$templates[] = 'footer.php';

		remove_all_actions( 'wp_footer' );
		ob_start();
		locate_template( $templates, true, false );
		ob_end_clean();
	}

	/**
	 * Block themes: drop the theme's header/footer template part when Gambol
	 * renders its own.
	 *
	 * @param string $content Rendered template part.
	 * @param array  $block   Parsed block.
	 * @return string
	 */
	public function filter_block_theme_part( $content, $block ) {
		$attrs = isset( $block['attrs'] ) ? $block['attrs'] : array();
		$area  = isset( $attrs['area'] ) ? $attrs['area'] : '';
		$slug  = isset( $attrs['slug'] ) ? $attrs['slug'] : '';
		$tag   = isset( $attrs['tagName'] ) ? $attrs['tagName'] : '';

		foreach ( array( 'header', 'footer' ) as $type ) {
			if ( $type === $area || $type === $slug || $type === $tag ) {
				return $this->should_replace( $type ) ? '' : $content;
			}
		}

		return $content;
	}

	/**
	 * Get page-level override for header/footer.
	 *
	 * @param string $type Type (header/footer).
	 * @return int|false|null Post ID if overridden, false if disabled, null if not overridden.
	 */
	private function get_page_override( $type ) {
		if ( ! is_singular() ) {
			return null;
		}

		$post_id = get_the_ID();
		if ( ! $post_id ) {
			return null;
		}

		// Check if disabled.
		$disable_key = '_gambol_disable_' . $type;
		$is_disabled = get_post_meta( $post_id, $disable_key, true );
		if ( '1' === $is_disabled ) {
			return false;
		}

		// Check if overridden.
		$override_key = '_gambol_override_' . $type;
		$is_overridden = get_post_meta( $post_id, $override_key, true );
		if ( '1' === $is_overridden ) {
			$custom_key = '_gambol_custom_' . $type;
			$custom_id = absint( get_post_meta( $post_id, $custom_key, true ) );
			// Only a published header/footer may be rendered as an override,
			// never an arbitrary (possibly private) post ID.
			$custom = $custom_id ? get_post( $custom_id ) : null;
			if ( ! $custom || Post_Type::POST_TYPE !== $custom->post_type || 'publish' !== $custom->post_status ) {
				return null;
			}
			return $custom_id;
		}

		return null;
	}

	/**
	 * Get matching template for current page.
	 *
	 * @param string $type Template type (header/footer).
	 * @return \WP_Post|false Post object or false if none found.
	 */
	private function get_matching_template( $type ) {
		$args = array(
			'post_type'      => Post_Type::POST_TYPE,
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'meta_query'     => array(
				'relation' => 'AND',
				array(
					'key'     => '_gambol_hf_type',
					'value'   => $type,
					'compare' => '=',
				),
				array(
					'key'     => '_gambol_hf_active',
					'value'   => '1',
					'compare' => '=',
				),
			),
			'orderby'        => 'menu_order',
			'order'          => 'ASC',
		);

		$posts = get_posts( $args );

		if ( empty( $posts ) ) {
			return false;
		}

		// The most specific matching rule wins (a front-page header beats an
		// entire-site one); menu_order breaks ties.
		$specificity = array(
			'specific_pages' => 100,
			'front_page'     => 90,
			'404'            => 80,
			'search'         => 80,
			'singular_post'  => 70,
			'singular_page'  => 70,
			'blog'           => 60,
			'archive'        => 60,
			'global'         => 10,
		);

		$best       = false;
		$best_score = -1;
		foreach ( $posts as $post ) {
			if ( ! $this->template_matches_current_page( $post ) ) {
				continue;
			}
			$rule  = get_post_meta( $post->ID, '_gambol_hf_display_on', true );
			$score = isset( $specificity[ $rule ] ) ? $specificity[ $rule ] : 0;
			if ( $score > $best_score ) {
				$best       = $post;
				$best_score = $score;
			}
		}

		return $best;
	}

	/**
	 * Check if template matches current page.
	 *
	 * @param \WP_Post $post Template post.
	 * @return bool Whether the template matches.
	 */
	private function template_matches_current_page( $post ) {
		$display_on   = get_post_meta( $post->ID, '_gambol_hf_display_on', true );
		$specific_ids = get_post_meta( $post->ID, '_gambol_hf_specific_ids', true );
		$exclude_ids  = get_post_meta( $post->ID, '_gambol_hf_exclude_ids', true );
		$user_roles   = get_post_meta( $post->ID, '_gambol_hf_user_roles', true );
		$visibility   = get_post_meta( $post->ID, '_gambol_hf_visibility', true );

		// Check user roles.
		if ( ! empty( $user_roles ) && is_array( $user_roles ) ) {
			if ( ! is_user_logged_in() ) {
				return false;
			}
			$user = wp_get_current_user();
			if ( empty( array_intersect( $user_roles, $user->roles ) ) ) {
				return false;
			}
		}

		// Check excluded IDs.
		if ( ! empty( $exclude_ids ) ) {
			$excluded = array_map( 'absint', array_map( 'trim', explode( ',', $exclude_ids ) ) );
			if ( is_singular() && in_array( get_the_ID(), $excluded, true ) ) {
				return false;
			}
		}

		// Check display location.
		$matches = false;

		switch ( $display_on ) {
			case 'global':
				$matches = true;
				break;

			case 'front_page':
				$matches = is_front_page();
				break;

			case 'blog':
				$matches = is_home() || ( is_front_page() && is_home() );
				break;

			case 'singular_post':
				$matches = is_singular( 'post' );
				break;

			case 'singular_page':
				$matches = is_singular( 'page' );
				break;

			case 'archive':
				$matches = is_archive();
				break;

			case 'search':
				$matches = is_search();
				break;

			case '404':
				$matches = is_404();
				break;

			case 'specific_pages':
				if ( ! empty( $specific_ids ) && is_singular() ) {
					$ids = array_map( 'absint', array_map( 'trim', explode( ',', $specific_ids ) ) );
					$matches = in_array( get_the_ID(), $ids, true );
				}
				break;
		}

		return $matches;
	}

	/**
	 * Check device visibility.
	 *
	 * Note: Server-side detection is limited. We'll use CSS classes
	 * and let CSS handle responsive visibility for better caching.
	 *
	 * @param string $visibility Visibility setting.
	 * @return string CSS class for visibility.
	 */
	private function get_visibility_class( $visibility ) {
		$classes = array(
			'desktop'        => 'gambol-hf--desktop-only',
			'tablet'         => 'gambol-hf--tablet-only',
			'mobile'         => 'gambol-hf--mobile-only',
			'desktop_tablet' => 'gambol-hf--desktop-tablet',
			'tablet_mobile'  => 'gambol-hf--tablet-mobile',
		);

		return isset( $classes[ $visibility ] ) ? $classes[ $visibility ] : '';
	}

	/**
	 * Render header.
	 *
	 * @return void
	 */
	public function render_header() {
		$this->setup_cache();

		if ( ! $this->header ) {
			return;
		}

		$this->render_template( $this->header, 'header' );
	}

	/**
	 * Render footer.
	 *
	 * @return void
	 */
	public function render_footer() {
		$this->setup_cache();

		if ( ! $this->footer ) {
			return;
		}

		$this->render_template( $this->footer, 'footer' );
	}

	/**
	 * Render a template.
	 *
	 * @param \WP_Post $post Template post.
	 * @param string   $type Template type (header/footer).
	 * @return void
	 */
	private function render_template( $post, $type ) {
		$visibility   = get_post_meta( $post->ID, '_gambol_hf_visibility', true );
		$is_sticky    = get_post_meta( $post->ID, '_gambol_hf_sticky', true );
		$sticky_offset = get_post_meta( $post->ID, '_gambol_hf_sticky_offset', true );

		$classes = array(
			'gambol-hf',
			'gambol-hf--' . $type,
		);

		// Add visibility class.
		$visibility_class = $this->get_visibility_class( $visibility );
		if ( $visibility_class ) {
			$classes[] = $visibility_class;
		}

		// Add sticky class for headers.
		if ( 'header' === $type && $is_sticky ) {
			$classes[] = 'gambol-hf--sticky';
		}

		$wrapper_attrs = array(
			'class' => implode( ' ', $classes ),
			'id'    => 'gambol-' . $type,
			'role'  => 'header' === $type ? 'banner' : 'contentinfo',
		);

		// Add sticky offset data attribute.
		if ( 'header' === $type && $is_sticky && $sticky_offset ) {
			$wrapper_attrs['data-sticky-offset'] = absint( $sticky_offset );
		}

		$attrs_string = '';
		foreach ( $wrapper_attrs as $attr => $value ) {
			$attrs_string .= sprintf( ' %s="%s"', esc_attr( $attr ), esc_attr( $value ) );
		}

		// Render the blocks directly rather than through the_content, so other
		// plugins' post-content filters (share buttons, related posts, ...) do
		// not run inside the site header and footer.
		$content = do_blocks( $post->post_content );
		$content = do_shortcode( $content );
		$content = wp_filter_content_tags( $content, 'gambol_hf' );

		printf(
			'<%1$s%2$s>%3$s</%1$s>',
			'header' === $type ? 'header' : 'footer',
			$attrs_string,
			$content
		);
	}

	/**
	 * Enqueue frontend assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$this->setup_cache();

		// Only enqueue if we have custom header/footer.
		if ( ! $this->header && ! $this->footer ) {
			return;
		}

		$css = $this->get_inline_css();
		$js  = $this->get_inline_js();

		// Add inline CSS.
		wp_register_style( 'gambol-hf', false, array(), GAMBOL_BUILDER_VERSION );
		wp_enqueue_style( 'gambol-hf' );
		wp_add_inline_style( 'gambol-hf', $css );

		// Add inline JS only if we have sticky header.
		if ( $this->header ) {
			$is_sticky = get_post_meta( $this->header->ID, '_gambol_hf_sticky', true );
			if ( $is_sticky ) {
				wp_register_script( 'gambol-hf', false, array(), GAMBOL_BUILDER_VERSION, true );
				wp_enqueue_script( 'gambol-hf' );
				wp_add_inline_script( 'gambol-hf', $js );
			}
		}
	}

	/**
	 * Get inline CSS.
	 *
	 * @return string CSS code.
	 */
	private function get_inline_css() {
		$css = '
			/* Gambol Header/Footer Base Styles */
			.gambol-hf {
				width: 100%;
			}

			/* Sticky Header */
			.gambol-hf--sticky {
				position: relative;
				z-index: 999;
			}

			.gambol-hf--sticky.is-stuck {
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				animation: gambol-slide-down 0.3s ease-out;
			}

			.gambol-hf--sticky.is-stuck + .gambol-hf-placeholder {
				display: block;
			}

			.gambol-hf-placeholder {
				display: none;
			}

			@keyframes gambol-slide-down {
				from {
					transform: translateY(-100%);
				}
				to {
					transform: translateY(0);
				}
			}

			/* Responsive Visibility */
			@media (max-width: 767px) {
				.gambol-hf--desktop-only,
				.gambol-hf--desktop-tablet {
					display: none !important;
				}
			}

			@media (min-width: 768px) and (max-width: 1024px) {
				.gambol-hf--desktop-only,
				.gambol-hf--mobile-only {
					display: none !important;
				}
			}

			@media (min-width: 1025px) {
				.gambol-hf--mobile-only,
				.gambol-hf--tablet-only,
				.gambol-hf--tablet-mobile {
					display: none !important;
				}
			}

			@media (min-width: 768px) {
				.gambol-hf--mobile-only {
					display: none !important;
				}
			}

			@media (max-width: 1024px) {
				.gambol-hf--desktop-only {
					display: none !important;
				}
			}
		';

		return $this->minify_css( $css );
	}

	/**
	 * Get inline JavaScript.
	 *
	 * @return string JavaScript code.
	 */
	private function get_inline_js() {
		$js = "
			(function() {
				'use strict';

				var header = document.querySelector('.gambol-hf--sticky');
				if (!header) return;

				var placeholder = null;
				var headerHeight = 0;
				var stickyOffset = parseInt(header.dataset.stickyOffset || '0', 10);
				var isStuck = false;
				var ticking = false;

				function init() {
					// Create placeholder element.
					placeholder = document.createElement('div');
					placeholder.className = 'gambol-hf-placeholder';
					placeholder.setAttribute('aria-hidden', 'true');
					header.parentNode.insertBefore(placeholder, header.nextSibling);

					// Initial height calculation.
					updateHeaderHeight();

					// Listen for scroll.
					window.addEventListener('scroll', onScroll, { passive: true });

					// Recalculate on resize.
					window.addEventListener('resize', debounce(updateHeaderHeight, 150));
				}

				function updateHeaderHeight() {
					// Temporarily remove stuck state for accurate measurement.
					var wasStuck = isStuck;
					if (wasStuck) {
						header.classList.remove('is-stuck');
					}

					headerHeight = header.offsetHeight;
					placeholder.style.height = headerHeight + 'px';

					if (wasStuck) {
						header.classList.add('is-stuck');
					}
				}

				function onScroll() {
					if (!ticking) {
						requestAnimationFrame(updateSticky);
						ticking = true;
					}
				}

				function updateSticky() {
					var scrollY = window.pageYOffset || document.documentElement.scrollTop;

					if (scrollY > stickyOffset && !isStuck) {
						header.classList.add('is-stuck');
						isStuck = true;
					} else if (scrollY <= stickyOffset && isStuck) {
						header.classList.remove('is-stuck');
						isStuck = false;
					}

					ticking = false;
				}

				function debounce(func, wait) {
					var timeout;
					return function() {
						var context = this;
						var args = arguments;
						clearTimeout(timeout);
						timeout = setTimeout(function() {
							func.apply(context, args);
						}, wait);
					};
				}

				// Initialize when DOM is ready.
				if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', init);
				} else {
					init();
				}
			})();
		";

		return $js;
	}

	/**
	 * Minify CSS.
	 *
	 * @param string $css CSS code.
	 * @return string Minified CSS.
	 */
	private function minify_css( $css ) {
		// Remove comments.
		$css = preg_replace( '!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css );
		// Remove whitespace.
		$css = preg_replace( '/\s+/', ' ', $css );
		// Remove unnecessary spaces.
		$css = preg_replace( '/\s*([\{\};:,>])\s*/', '$1', $css );
		// Remove trailing semicolons before closing braces.
		$css = preg_replace( '/;}/', '}', $css );

		return trim( $css );
	}

	/**
	 * Add body classes.
	 *
	 * @param array $classes Body classes.
	 * @return array Modified classes.
	 */
	public function add_body_classes( $classes ) {
		$this->setup_cache();

		if ( $this->header ) {
			$classes[] = 'has-gambol-header';

			$is_sticky = get_post_meta( $this->header->ID, '_gambol_hf_sticky', true );
			if ( $is_sticky ) {
				$classes[] = 'has-gambol-sticky-header';
			}
		}

		if ( $this->footer ) {
			$classes[] = 'has-gambol-footer';
		}

		return $classes;
	}

	/**
	 * Check if custom header exists.
	 *
	 * @return bool
	 */
	public function has_header() {
		$this->setup_cache();
		return (bool) $this->header;
	}

	/**
	 * Check if custom footer exists.
	 *
	 * @return bool
	 */
	public function has_footer() {
		$this->setup_cache();
		return (bool) $this->footer;
	}

	/**
	 * Get header post.
	 *
	 * @return \WP_Post|false
	 */
	public function get_header() {
		$this->setup_cache();
		return $this->header;
	}

	/**
	 * Get footer post.
	 *
	 * @return \WP_Post|false
	 */
	public function get_footer() {
		$this->setup_cache();
		return $this->footer;
	}
}
