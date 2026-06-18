<?php
/**
 * Dynamic Content / Smart Fields System.
 *
 * Processes {{tag_name}} placeholders in Gambol block content
 * and replaces them with dynamic values on render.
 *
 * Supported tags (extendable via 'gambol_dynamic_tags' filter):
 *   {{post_title}}, {{post_excerpt}}, {{post_url}}, {{post_date}},
 *   {{author_name}}, {{author_bio}}, {{author_url}},
 *   {{site_name}}, {{site_tagline}}, {{site_url}},
 *   {{current_date}}, {{current_year}}, {{current_month}},
 *   {{current_user_name}}, {{current_user_email}}
 *
 * @package GambolBuilder
 */

namespace GambolBuilder;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Dynamic_Tags
 */
class Dynamic_Tags {

	private static $instance = null;
	private $tags            = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		// Process gambol/heading and gambol/text blocks on render.
		add_filter( 'render_block', array( $this, 'process_block' ), 20, 2 );
	}

	/**
	 * Process a rendered block, replacing {{tags}} in content.
	 *
	 * @param string $block_content Rendered HTML.
	 * @param array  $block         Block data.
	 * @return string
	 */
	public function process_block( $block_content, $block ) {
		$supported_blocks = array( 'gambol/heading', 'gambol/text', 'gambol/button', 'gambol/page-title', 'gambol/post-title' );

		if ( ! in_array( $block['blockName'] ?? '', $supported_blocks, true ) ) {
			return $block_content;
		}

		if ( strpos( $block_content, '{{' ) === false ) {
			return $block_content;
		}

		return $this->process_content( $block_content );
	}

	/**
	 * Replace all {{tag}} placeholders in a string.
	 *
	 * @param string $content Content with tag placeholders.
	 * @return string Processed content.
	 */
	public function process_content( $content ) {
		$tags = $this->get_tags();

		return preg_replace_callback(
			'/\{\{([a-z_]+)\}\}/',
			function( $matches ) use ( $tags ) {
				$tag = $matches[1];
				if ( isset( $tags[ $tag ] ) ) {
					$value = is_callable( $tags[ $tag ] ) ? call_user_func( $tags[ $tag ] ) : $tags[ $tag ];
					return esc_html( (string) $value );
				}
				return $matches[0]; // Return original if tag not found.
			},
			$content
		);
	}

	/**
	 * Get all registered tags.
	 *
	 * @return array Map of tag => value|callable.
	 */
	public function get_tags() {
		if ( null !== $this->tags ) {
			return $this->tags;
		}

		$this->tags = array(
			// Post / Page
			'post_title'           => function() { return get_the_title() ?: get_bloginfo( 'name' ); },
			'post_excerpt'         => function() { return get_the_excerpt() ?: ''; },
			'post_url'             => function() { return get_permalink() ?: home_url(); },
			'post_date'            => function() { return get_the_date() ?: ''; },
			'post_modified_date'   => function() { return get_the_modified_date() ?: ''; },
			'post_id'              => function() { return get_the_ID() ?: ''; },
			'post_category'        => function() {
				$cats = get_the_category();
				return $cats ? esc_html( $cats[0]->name ) : '';
			},

			// Author
			'author_name'          => function() { return get_the_author() ?: ''; },
			'author_bio'           => function() { return get_the_author_meta( 'description' ) ?: ''; },
			'author_url'           => function() { return get_the_author_meta( 'url' ) ?: ''; },
			'author_email'         => function() { return get_the_author_meta( 'user_email' ) ?: ''; },

			// Site
			'site_name'            => function() { return get_bloginfo( 'name' ); },
			'site_tagline'         => function() { return get_bloginfo( 'description' ); },
			'site_url'             => function() { return home_url(); },

			// Date / Time
			'current_date'         => function() { return wp_date( get_option( 'date_format' ) ); },
			'current_time'         => function() { return wp_date( get_option( 'time_format' ) ); },
			'current_year'         => function() { return wp_date( 'Y' ); },
			'current_month'        => function() { return wp_date( 'F' ); },
			'current_month_num'    => function() { return wp_date( 'n' ); },
			'current_day'          => function() { return wp_date( 'j' ); },

			// Current User
			'current_user_name'    => function() {
				$user = wp_get_current_user();
				return $user->exists() ? $user->display_name : '';
			},
			'current_user_email'   => function() {
				$user = wp_get_current_user();
				return $user->exists() ? $user->user_email : '';
			},
			'current_user_login'   => function() {
				$user = wp_get_current_user();
				return $user->exists() ? $user->user_login : '';
			},
		);

		/**
		 * Filter to allow plugins/themes to add custom dynamic tags.
		 *
		 * @param array $tags Map of tag_name => value|callable.
		 */
		$this->tags = apply_filters( 'gambol_dynamic_tags', $this->tags );

		return $this->tags;
	}

	/**
	 * Get all tag names for the editor UI.
	 *
	 * @return array List of available tags with label/value.
	 */
	public function get_tag_list() {
		return array_keys( $this->get_tags() );
	}
}

// Initialize.
add_action( 'plugins_loaded', function() {
	Dynamic_Tags::get_instance();
} );
