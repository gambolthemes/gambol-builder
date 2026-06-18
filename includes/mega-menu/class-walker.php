<?php
/**
 * Gambol Mega Menu Walker.
 *
 * Extends Walker_Nav_Menu to render Gambol block content inside
 * menu items that have been assigned a gambol_mega_menu post.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\MegaMenu;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Walker
 */
class Walker extends \Walker_Nav_Menu {

	/**
	 * Start the list element output.
	 *
	 * @param string   $output Passed by reference.
	 * @param WP_Post  $item   Menu item object.
	 * @param int      $depth  Depth of menu item.
	 * @param stdClass $args   Additional args.
	 * @param int      $id     Current item ID.
	 */
	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
		parent::start_el( $output, $item, $depth, $args, $id );

		// Only add mega panel at depth 0.
		if ( $depth > 0 ) {
			return;
		}

		$mega_menu_id = (int) get_post_meta( $item->ID, '_gambol_mega_menu_id', true );
		if ( ! $mega_menu_id ) {
			return;
		}

		$post = get_post( $mega_menu_id );
		if ( ! $post || 'gambol_mega_menu' !== $post->post_type || 'publish' !== $post->post_status ) {
			return;
		}

		// Replace the default sub-menu UL that Walker_Nav_Menu would add.
		$mega_content = do_blocks( $post->post_content );

		$output .= sprintf(
			'<div class="gambol-mega-menu__panel" role="region" aria-label="%s">%s</div>',
			esc_attr( $item->title ),
			$mega_content
		);
	}
}
