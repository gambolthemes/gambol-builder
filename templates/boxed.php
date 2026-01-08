<?php
/**
 * Boxed Template.
 *
 * Boxed layout page template.
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
 * Fires before the boxed content.
 *
 * @since 1.0.0
 */
do_action( 'gambol_before_content' );
?>

<main id="gambol-content" class="gambol-boxed-content">
	<div class="gambol-container">
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
	</div>
</main>

<?php
/**
 * Fires after the boxed content.
 *
 * @since 1.0.0
 */
do_action( 'gambol_after_content' );
?>

<?php
get_footer();
