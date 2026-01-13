<?php
/**
 * Full Width Template.
 *
 * Full width page template with header and footer.
 *
 * @package GambolBuilder
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<?php
/**
 * Fires before the full width content.
 *
 * @since 1.0.0
 */
do_action( 'gambol_before_content' );
?>

<main id="gambol-content" class="gambol-full-width-content">
	<?php
	/**
	 * Fires at the top of the content area.
	 *
	 * @since 1.0.0
	 */
	do_action( 'gambol_content_top' );
	?>

	<?php
	while ( have_posts() ) :
		the_post();
		the_content();
	endwhile;
	?>

	<?php
	/**
	 * Fires at the bottom of the content area.
	 *
	 * @since 1.0.0
	 */
	do_action( 'gambol_content_bottom' );
	?>
</main>

<?php
/**
 * Fires after the full width content.
 *
 * @since 1.0.0
 */
do_action( 'gambol_after_content' );
?>

<?php
get_footer();
