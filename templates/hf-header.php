<?php
/**
 * Document head used when Gambol replaces a classic theme's header.php.
 *
 * The Gambol header itself is printed on wp_body_open.
 *
 * @package GambolBuilder
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
	<style id="gambol-hf-shell">.gambol-hf-replaced .skip-link{position:absolute;left:-9999px;top:0;z-index:100000;padding:12px 16px;background:#fff;color:#111}.gambol-hf-replaced .skip-link:focus{left:8px;top:8px}</style>
</head>
<body <?php body_class( 'gambol-hf-replaced' ); ?>>
<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'gambol-builder' ); ?></a>
<?php wp_body_open(); ?>
<div id="page" class="site gambol-site">
	<div id="content" class="site-content">
