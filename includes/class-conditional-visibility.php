<?php
/**
 * Conditional Visibility — Server-Side Rendering.
 *
 * Hooks into render_block to conditionally suppress output based on:
 *   - User login status (everyone / logged_in / logged_out)
 *   - Schedule (visibilityShowAfter / visibilityHideAfter)
 *
 * Device-based visibility (desktop/tablet/mobile) is handled purely via CSS
 * classes in the frontend rather than hiding HTML server-side, so search
 * engines still index the content.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Conditional_Visibility
 */
class Conditional_Visibility {

	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		// Run at priority 30 (after animations at 10, dynamic tags at 20).
		add_filter( 'render_block', array( $this, 'maybe_hide_block' ), 30, 2 );
		add_filter( 'render_block', array( $this, 'inject_device_classes' ), 31, 2 );
	}

	/**
	 * Suppress block HTML when visibility rules don't pass.
	 *
	 * @param string $content Rendered block HTML.
	 * @param array  $block   Block data.
	 * @return string
	 */
	public function maybe_hide_block( $content, $block ) {
		if ( ! isset( $block['blockName'] ) || ! str_starts_with( $block['blockName'], 'gambol/' ) ) {
			return $content;
		}

		$attrs = $block['attrs'] ?? array();

		// --- User Status ---
		$user_status = $attrs['visibilityUserStatus'] ?? 'everyone';
		if ( 'logged_in' === $user_status && ! is_user_logged_in() ) {
			return '';
		}
		if ( 'logged_out' === $user_status && is_user_logged_in() ) {
			return '';
		}

		// --- Schedule ---
		$show_after = $attrs['visibilityShowAfter'] ?? '';
		if ( $show_after ) {
			$show_ts = strtotime( $show_after );
			if ( $show_ts && time() < $show_ts ) {
				return '';
			}
		}

		$hide_after = $attrs['visibilityHideAfter'] ?? '';
		if ( $hide_after ) {
			$hide_ts = strtotime( $hide_after );
			if ( $hide_ts && time() > $hide_ts ) {
				return '';
			}
		}

		return $content;
	}

	/**
	 * Inject CSS classes for device visibility (hide-on-desktop, etc.).
	 *
	 * @param string $content Rendered block HTML.
	 * @param array  $block   Block data.
	 * @return string
	 */
	public function inject_device_classes( $content, $block ) {
		if ( empty( $content ) ) {
			return $content;
		}
		if ( ! isset( $block['blockName'] ) || ! str_starts_with( $block['blockName'], 'gambol/' ) ) {
			return $content;
		}

		$attrs   = $block['attrs'] ?? array();
		$devices = $attrs['visibilityDevices'] ?? array();

		if ( empty( $devices ) ) {
			return $content;
		}

		$classes = array();
		if ( isset( $devices['desktop'] ) && false === $devices['desktop'] ) {
			$classes[] = 'gambol-hide-desktop';
		}
		if ( isset( $devices['tablet'] ) && false === $devices['tablet'] ) {
			$classes[] = 'gambol-hide-tablet';
		}
		if ( isset( $devices['mobile'] ) && false === $devices['mobile'] ) {
			$classes[] = 'gambol-hide-mobile';
		}

		if ( empty( $classes ) ) {
			return $content;
		}

		// Append classes to the first HTML tag.
		$class_str = implode( ' ', $classes );
		return preg_replace( '/^(<[^>]+class=")/U', '$1' . $class_str . ' ', $content, 1 );
	}

	/**
	 * Inject sticky data attributes into block HTML.
	 *
	 * @param string $content Rendered block HTML.
	 * @param array  $block   Block data.
	 * @return string
	 */
	public static function inject_sticky_attributes( $content, $block ) {
		if ( empty( $block['attrs']['stickyEnabled'] ) ) {
			return $content;
		}
		if ( ! str_starts_with( $block['blockName'] ?? '', 'gambol/' ) ) {
			return $content;
		}

		$offset   = (int) ( $block['attrs']['stickyOffset']   ?? 0 );
		$behavior = sanitize_key( $block['attrs']['stickyBehavior'] ?? 'always' );

		return preg_replace_callback(
			'/<([a-zA-Z][^\s\/>]*)(\s|>)/U',
			function( $m ) use ( $offset, $behavior ) {
				return '<' . $m[1]
					. ' data-gambol-sticky="true"'
					. ' data-sticky-offset="' . esc_attr( (string) $offset ) . '"'
					. ' data-sticky-behavior="' . esc_attr( $behavior ) . '"'
					. $m[2];
			},
			$content,
			1
		);
	}
}

// Initialize.
add_action( 'plugins_loaded', function() {
	Conditional_Visibility::get_instance();
} );

// Register sticky attribute injection filter (can run standalone).
add_filter( 'render_block', array( 'GambolBuilder\Conditional_Visibility', 'inject_sticky_attributes' ), 25, 2 );
