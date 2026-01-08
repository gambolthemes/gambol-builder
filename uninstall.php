<?php
/**
 * Gambol Builder Uninstall.
 *
 * Fired when the plugin is uninstalled.
 *
 * @package GambolBuilder
 */

// If uninstall not called from WordPress, exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * Clean up plugin data on uninstall.
 *
 * Only runs when user deletes the plugin (not deactivation).
 */
function gambol_builder_uninstall() {
	global $wpdb;

	// Check if we should delete data.
	$delete_data = get_option( 'gambol_builder_delete_data_on_uninstall', false );

	if ( ! $delete_data ) {
		return;
	}

	// Delete plugin options.
	$options = array(
		'gambol_builder_global_styles',
		'gambol_builder_license',
		'gambol_builder_performance',
		'gambol_builder_delete_data_on_uninstall',
		'gambol_builder_version',
	);

	foreach ( $options as $option ) {
		delete_option( $option );
	}

	// Delete transients.
	$wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
			'%_transient_gambol_%',
			'%_transient_timeout_gambol_%'
		)
	);

	// Delete Header/Footer posts.
	$hf_posts = get_posts( array(
		'post_type'      => 'gambol_hf',
		'posts_per_page' => -1,
		'post_status'    => 'any',
		'fields'         => 'ids',
	) );

	foreach ( $hf_posts as $post_id ) {
		wp_delete_post( $post_id, true );
	}

	// Delete post meta.
	$wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$wpdb->postmeta} WHERE meta_key LIKE %s",
			'_gambol_%'
		)
	);

	// Clear scheduled events.
	wp_clear_scheduled_hook( 'gambol_daily_license_check' );

	// Clear any cached data.
	wp_cache_flush();
}

gambol_builder_uninstall();
