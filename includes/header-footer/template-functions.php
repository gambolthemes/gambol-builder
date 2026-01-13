<?php
/**
 * Header Footer Template Functions.
 *
 * Public template functions for theme integration.
 *
 * @package GambolBuilder
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if a custom Gambol header exists for the current page.
 *
 * @return bool True if custom header exists.
 */
function gambol_has_header() {
	if ( ! class_exists( 'GambolBuilder\HeaderFooter\Renderer' ) ) {
		return false;
	}
	return \GambolBuilder\HeaderFooter\Renderer::get_instance()->has_header();
}

/**
 * Check if a custom Gambol footer exists for the current page.
 *
 * @return bool True if custom footer exists.
 */
function gambol_has_footer() {
	if ( ! class_exists( 'GambolBuilder\HeaderFooter\Renderer' ) ) {
		return false;
	}
	return \GambolBuilder\HeaderFooter\Renderer::get_instance()->has_footer();
}

/**
 * Render the custom Gambol header.
 *
 * @return void
 */
function gambol_render_header() {
	if ( ! class_exists( 'GambolBuilder\HeaderFooter\Renderer' ) ) {
		return;
	}
	\GambolBuilder\HeaderFooter\Renderer::get_instance()->render_header();
}

/**
 * Render the custom Gambol footer.
 *
 * @return void
 */
function gambol_render_footer() {
	if ( ! class_exists( 'GambolBuilder\HeaderFooter\Renderer' ) ) {
		return;
	}
	\GambolBuilder\HeaderFooter\Renderer::get_instance()->render_footer();
}

/**
 * Get the current page's custom header post.
 *
 * @return WP_Post|false Header post object or false.
 */
function gambol_get_header() {
	if ( ! class_exists( 'GambolBuilder\HeaderFooter\Renderer' ) ) {
		return false;
	}
	return \GambolBuilder\HeaderFooter\Renderer::get_instance()->get_header();
}

/**
 * Get the current page's custom footer post.
 *
 * @return WP_Post|false Footer post object or false.
 */
function gambol_get_footer() {
	if ( ! class_exists( 'GambolBuilder\HeaderFooter\Renderer' ) ) {
		return false;
	}
	return \GambolBuilder\HeaderFooter\Renderer::get_instance()->get_footer();
}

/**
 * Check if the current header is sticky.
 *
 * @return bool True if header is sticky.
 */
function gambol_is_header_sticky() {
	$header = gambol_get_header();
	if ( ! $header ) {
		return false;
	}
	return (bool) get_post_meta( $header->ID, '_gambol_hf_sticky', true );
}

/**
 * Get header/footer content by ID.
 *
 * Useful for rendering specific headers/footers programmatically.
 *
 * @param int $post_id Header/Footer post ID.
 * @return string Rendered content or empty string.
 */
function gambol_get_hf_content( $post_id ) {
	$post = get_post( $post_id );

	if ( ! $post || 'gambol_hf' !== $post->post_type || 'publish' !== $post->post_status ) {
		return '';
	}

	return apply_filters( 'the_content', $post->post_content );
}
