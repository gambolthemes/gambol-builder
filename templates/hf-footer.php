<?php
/**
 * Document close used when Gambol replaces a classic theme's footer.php.
 *
 * The Gambol footer itself is printed on wp_footer (priority 5), before
 * the scripts other plugins print there.
 *
 * @package GambolBuilder
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
	</div><!-- #content -->
</div><!-- #page -->
<?php wp_footer(); ?>
</body>
</html>
