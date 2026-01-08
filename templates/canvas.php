<?php
/**
 * Canvas Template.
 *
 * Blank canvas template with no header or footer.
 *
 * @package GambolBuilder
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'gambol-canvas' ); ?>>
<?php wp_body_open(); ?>

<?php
/**
 * Fires before the canvas content.
 *
 * @since 1.0.0
 */
do_action( 'gambol_before_canvas' );
?>

<div id="gambol-canvas" class="gambol-canvas-wrapper">
	<?php
	while ( have_posts() ) :
		the_post();
		the_content();
	endwhile;
	?>
</div>

<?php
/**
 * Fires after the canvas content.
 *
 * @since 1.0.0
 */
do_action( 'gambol_after_canvas' );
?>

<?php wp_footer(); ?>
</body>
</html>
