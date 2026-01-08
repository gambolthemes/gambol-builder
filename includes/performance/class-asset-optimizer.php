<?php
/**
 * Asset Optimizer.
 *
 * Handles JavaScript and general asset optimizations.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Performance;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Asset_Optimizer
 *
 * Manages JavaScript and asset optimization.
 */
class Asset_Optimizer {

	/**
	 * Singleton instance.
	 *
	 * @var Asset_Optimizer|null
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Asset_Optimizer
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

		// Defer block scripts.
		if ( $settings->is_enabled( 'defer_block_scripts' ) ) {
			add_filter( 'script_loader_tag', array( $this, 'add_defer_attribute' ), 10, 2 );
		}

		// Disable emojis.
		if ( $settings->is_enabled( 'disable_emojis' ) ) {
			$this->disable_emojis();
		}

		// Disable embeds.
		if ( $settings->is_enabled( 'disable_embeds' ) ) {
			$this->disable_embeds();
		}

		// Remove jQuery migrate.
		if ( $settings->is_enabled( 'remove_jquery_migrate' ) ) {
			add_action( 'wp_default_scripts', array( $this, 'remove_jquery_migrate' ) );
		}

		// Disable dashicons.
		if ( $settings->is_enabled( 'disable_dashicons' ) ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'disable_dashicons' ) );
		}

		// Add DNS prefetch and preconnect hints.
		add_action( 'wp_head', array( $this, 'add_resource_hints' ), 1 );
	}

	/**
	 * Add defer attribute to scripts.
	 *
	 * @param string $tag    Script tag.
	 * @param string $handle Script handle.
	 * @return string Modified script tag.
	 */
	public function add_defer_attribute( $tag, $handle ) {
		// Scripts to defer.
		$defer_scripts = array(
			'gambol-builder-editor',
			'gambol-hf',
		);

		// Allow filtering.
		$defer_scripts = apply_filters( 'gambol_defer_scripts', $defer_scripts );

		if ( in_array( $handle, $defer_scripts, true ) ) {
			// Don't add if already has defer or async.
			if ( strpos( $tag, 'defer' ) !== false || strpos( $tag, 'async' ) !== false ) {
				return $tag;
			}

			return str_replace( ' src', ' defer src', $tag );
		}

		return $tag;
	}

	/**
	 * Disable WordPress emojis.
	 *
	 * @return void
	 */
	private function disable_emojis() {
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
		remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
		remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );

		add_filter( 'tiny_mce_plugins', array( $this, 'disable_emojis_tinymce' ) );
		add_filter( 'wp_resource_hints', array( $this, 'disable_emojis_dns_prefetch' ), 10, 2 );
		add_filter( 'emoji_svg_url', '__return_false' );
	}

	/**
	 * Remove TinyMCE emoji plugin.
	 *
	 * @param array $plugins TinyMCE plugins.
	 * @return array Modified plugins.
	 */
	public function disable_emojis_tinymce( $plugins ) {
		if ( is_array( $plugins ) ) {
			return array_diff( $plugins, array( 'wpemoji' ) );
		}
		return $plugins;
	}

	/**
	 * Remove emoji DNS prefetch.
	 *
	 * @param array  $urls          Resource URLs.
	 * @param string $relation_type Relation type.
	 * @return array Modified URLs.
	 */
	public function disable_emojis_dns_prefetch( $urls, $relation_type ) {
		if ( 'dns-prefetch' === $relation_type ) {
			$emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );
			$urls = array_diff( $urls, array( $emoji_svg_url ) );
		}
		return $urls;
	}

	/**
	 * Disable WordPress embeds.
	 *
	 * @return void
	 */
	private function disable_embeds() {
		// Remove oEmbed discovery links.
		remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );

		// Remove oEmbed REST API endpoint.
		remove_action( 'rest_api_init', 'wp_oembed_register_route' );

		// Remove embed JavaScript.
		add_action( 'wp_footer', array( $this, 'deregister_embed_script' ) );

		// Remove embed rewrite rules.
		add_filter( 'rewrite_rules_array', array( $this, 'disable_embeds_rewrites' ) );

		// Remove embed query var.
		add_filter( 'query_vars', array( $this, 'disable_embeds_query_var' ) );

		// Prevent oEmbed discovery.
		add_filter( 'embed_oembed_discover', '__return_false' );

		// Remove related links.
		remove_action( 'wp_head', 'wp_oembed_add_host_js' );
		remove_filter( 'oembed_dataparse', 'wp_filter_oembed_result', 10 );
		remove_filter( 'pre_oembed_result', 'wp_filter_pre_oembed_result', 10 );
	}

	/**
	 * Deregister embed script.
	 *
	 * @return void
	 */
	public function deregister_embed_script() {
		wp_dequeue_script( 'wp-embed' );
	}

	/**
	 * Remove embed rewrites.
	 *
	 * @param array $rules Rewrite rules.
	 * @return array Modified rules.
	 */
	public function disable_embeds_rewrites( $rules ) {
		foreach ( $rules as $rule => $rewrite ) {
			if ( strpos( $rewrite, 'embed=true' ) !== false ) {
				unset( $rules[ $rule ] );
			}
		}
		return $rules;
	}

	/**
	 * Remove embed query var.
	 *
	 * @param array $vars Query vars.
	 * @return array Modified vars.
	 */
	public function disable_embeds_query_var( $vars ) {
		return array_diff( $vars, array( 'embed' ) );
	}

	/**
	 * Remove jQuery Migrate.
	 *
	 * @param \WP_Scripts $scripts Scripts object.
	 * @return void
	 */
	public function remove_jquery_migrate( $scripts ) {
		if ( ! is_admin() && isset( $scripts->registered['jquery'] ) ) {
			$script = $scripts->registered['jquery'];

			if ( $script->deps ) {
				$script->deps = array_diff( $script->deps, array( 'jquery-migrate' ) );
			}
		}
	}

	/**
	 * Disable Dashicons for non-logged-in users.
	 *
	 * @return void
	 */
	public function disable_dashicons() {
		if ( ! is_user_logged_in() ) {
			wp_dequeue_style( 'dashicons' );
			wp_deregister_style( 'dashicons' );
		}
	}

	/**
	 * Add DNS prefetch and preconnect resource hints.
	 *
	 * @return void
	 */
	public function add_resource_hints() {
		$settings = Settings::get_instance();

		// DNS prefetch.
		$prefetch_domains = $settings->get( 'prefetch_dns', array() );

		// Add Google Fonts if enabled.
		if ( $settings->is_enabled( 'optimize_google_fonts' ) ) {
			$prefetch_domains[] = 'https://fonts.googleapis.com';
			$prefetch_domains[] = 'https://fonts.gstatic.com';
		}

		// Allow filtering.
		$prefetch_domains = apply_filters( 'gambol_dns_prefetch', $prefetch_domains );

		if ( ! is_array( $prefetch_domains ) ) {
			$prefetch_domains = array();
		}

		$prefetch_domains = array_unique( array_filter( $prefetch_domains ) );

		foreach ( $prefetch_domains as $domain ) {
			$parsed = wp_parse_url( $domain );
			$host = isset( $parsed['host'] ) ? $parsed['host'] : $domain;
			printf( '<link rel="dns-prefetch" href="//%s">' . "\n", esc_attr( $host ) );
		}

		// Preconnect.
		$preconnect_origins = $settings->get( 'preconnect_origins', array() );

		// Add Google Fonts preconnect.
		if ( $settings->is_enabled( 'optimize_google_fonts' ) ) {
			$preconnect_origins[] = 'https://fonts.gstatic.com';
		}

		// Allow filtering.
		$preconnect_origins = apply_filters( 'gambol_preconnect', $preconnect_origins );

		if ( ! is_array( $preconnect_origins ) ) {
			$preconnect_origins = array();
		}

		$preconnect_origins = array_unique( array_filter( $preconnect_origins ) );

		foreach ( $preconnect_origins as $origin ) {
			printf( '<link rel="preconnect" href="%s" crossorigin>' . "\n", esc_url( $origin ) );
		}
	}
}
