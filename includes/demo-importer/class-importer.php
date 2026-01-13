<?php
/**
 * Demo Importer.
 *
 * Handles the actual import and rollback logic.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\DemoImporter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Importer
 *
 * Manages import operations for demo content.
 */
class Importer {

	/**
	 * Singleton instance.
	 *
	 * @var Importer|null
	 */
	private static $instance = null;

	/**
	 * Option name for storing import history.
	 *
	 * @var string
	 */
	const IMPORT_HISTORY_OPTION = 'gambol_demo_import_history';

	/**
	 * Option name for storing backup data.
	 *
	 * @var string
	 */
	const BACKUP_OPTION = 'gambol_demo_import_backup';

	/**
	 * Get singleton instance.
	 *
	 * @return Importer
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {}

	/**
	 * Import demo content.
	 *
	 * @param string $demo_id Demo ID.
	 * @param array  $options Import options.
	 * @return array|\WP_Error Result array or error.
	 */
	public function import( $demo_id, $options = array() ) {
		$defaults = array(
			'pages'         => true,
			'headers'       => true,
			'footers'       => true,
			'global_styles' => true,
			'create_backup' => true,
		);

		$options = wp_parse_args( $options, $defaults );

		$demo_manager = Demo_Manager::get_instance();
		$demo = $demo_manager->get_demo( $demo_id );

		if ( ! $demo ) {
			return new \WP_Error( 'invalid_demo', __( 'Demo not found.', 'gambol-builder' ) );
		}

		// Create backup if requested.
		if ( $options['create_backup'] ) {
			$this->create_backup( $options );
		}

		$results = array(
			'demo_id'   => $demo_id,
			'demo_name' => $demo['name'],
			'imported'  => array(),
			'errors'    => array(),
			'post_ids'  => array(),
		);

		// Import pages.
		if ( $options['pages'] ) {
			$pages_result = $this->import_pages( $demo_id );
			if ( is_wp_error( $pages_result ) ) {
				$results['errors']['pages'] = $pages_result->get_error_message();
			} else {
				$results['imported']['pages'] = $pages_result['count'];
				$results['post_ids'] = array_merge( $results['post_ids'], $pages_result['post_ids'] );
			}
		}

		// Import headers.
		if ( $options['headers'] ) {
			$headers_result = $this->import_headers( $demo_id );
			if ( is_wp_error( $headers_result ) ) {
				$results['errors']['headers'] = $headers_result->get_error_message();
			} else {
				$results['imported']['headers'] = $headers_result['count'];
				$results['post_ids'] = array_merge( $results['post_ids'], $headers_result['post_ids'] );
			}
		}

		// Import footers.
		if ( $options['footers'] ) {
			$footers_result = $this->import_footers( $demo_id );
			if ( is_wp_error( $footers_result ) ) {
				$results['errors']['footers'] = $footers_result->get_error_message();
			} else {
				$results['imported']['footers'] = $footers_result['count'];
				$results['post_ids'] = array_merge( $results['post_ids'], $footers_result['post_ids'] );
			}
		}

		// Import global styles.
		if ( $options['global_styles'] ) {
			$styles_result = $this->import_global_styles( $demo_id );
			if ( is_wp_error( $styles_result ) ) {
				$results['errors']['global_styles'] = $styles_result->get_error_message();
			} else {
				$results['imported']['global_styles'] = true;
			}
		}

		// Save import history.
		$this->save_import_history( $results );

		return $results;
	}

	/**
	 * Import pages.
	 *
	 * @param string $demo_id Demo ID.
	 * @return array|\WP_Error Result or error.
	 */
	private function import_pages( $demo_id ) {
		$demo_manager = Demo_Manager::get_instance();
		$pages = $demo_manager->get_demo_data( $demo_id, 'pages' );

		if ( false === $pages ) {
			return new \WP_Error( 'no_pages', __( 'No pages data found.', 'gambol-builder' ) );
		}

		$post_ids = array();
		$count = 0;

		foreach ( $pages as $page ) {
			$result = $this->import_post( $page, 'page' );
			if ( ! is_wp_error( $result ) ) {
				$post_ids[] = $result;
				$count++;
			}
		}

		return array(
			'count'    => $count,
			'post_ids' => $post_ids,
		);
	}

	/**
	 * Import headers.
	 *
	 * @param string $demo_id Demo ID.
	 * @return array|\WP_Error Result or error.
	 */
	private function import_headers( $demo_id ) {
		$demo_manager = Demo_Manager::get_instance();
		$headers = $demo_manager->get_demo_data( $demo_id, 'headers' );

		if ( false === $headers ) {
			return new \WP_Error( 'no_headers', __( 'No headers data found.', 'gambol-builder' ) );
		}

		$post_ids = array();
		$count = 0;

		foreach ( $headers as $header ) {
			$header['meta']['_gambol_hf_type'] = 'header';
			$result = $this->import_post( $header, 'gambol_hf' );
			if ( ! is_wp_error( $result ) ) {
				$post_ids[] = $result;
				$count++;
			}
		}

		return array(
			'count'    => $count,
			'post_ids' => $post_ids,
		);
	}

	/**
	 * Import footers.
	 *
	 * @param string $demo_id Demo ID.
	 * @return array|\WP_Error Result or error.
	 */
	private function import_footers( $demo_id ) {
		$demo_manager = Demo_Manager::get_instance();
		$footers = $demo_manager->get_demo_data( $demo_id, 'footers' );

		if ( false === $footers ) {
			return new \WP_Error( 'no_footers', __( 'No footers data found.', 'gambol-builder' ) );
		}

		$post_ids = array();
		$count = 0;

		foreach ( $footers as $footer ) {
			$footer['meta']['_gambol_hf_type'] = 'footer';
			$result = $this->import_post( $footer, 'gambol_hf' );
			if ( ! is_wp_error( $result ) ) {
				$post_ids[] = $result;
				$count++;
			}
		}

		return array(
			'count'    => $count,
			'post_ids' => $post_ids,
		);
	}

	/**
	 * Import global styles.
	 *
	 * @param string $demo_id Demo ID.
	 * @return bool|\WP_Error True on success or error.
	 */
	private function import_global_styles( $demo_id ) {
		$demo_manager = Demo_Manager::get_instance();
		$styles = $demo_manager->get_demo_data( $demo_id, 'global_styles' );

		if ( false === $styles ) {
			return new \WP_Error( 'no_styles', __( 'No global styles data found.', 'gambol-builder' ) );
		}

		// Get the global styles instance.
		if ( ! class_exists( 'GambolBuilder\Global_Styles' ) ) {
			return new \WP_Error( 'no_global_styles', __( 'Global Styles class not found.', 'gambol-builder' ) );
		}

		$global_styles = \GambolBuilder\Global_Styles::get_instance();
		$result = $global_styles->update_styles( $styles );

		return $result ? true : new \WP_Error( 'styles_error', __( 'Failed to update global styles.', 'gambol-builder' ) );
	}

	/**
	 * Import a single post.
	 *
	 * @param array  $data      Post data.
	 * @param string $post_type Post type.
	 * @return int|\WP_Error Post ID or error.
	 */
	private function import_post( $data, $post_type ) {
		$post_data = array(
			'post_title'   => isset( $data['title'] ) ? sanitize_text_field( $data['title'] ) : '',
			'post_content' => isset( $data['content'] ) ? wp_kses_post( $data['content'] ) : '',
			'post_status'  => 'publish',
			'post_type'    => $post_type,
		);

		// Add excerpt if available.
		if ( isset( $data['excerpt'] ) ) {
			$post_data['post_excerpt'] = sanitize_textarea_field( $data['excerpt'] );
		}

		// Add menu order if available.
		if ( isset( $data['menu_order'] ) ) {
			$post_data['menu_order'] = absint( $data['menu_order'] );
		}

		// Check for existing post with same title.
		$existing = get_page_by_title( $post_data['post_title'], OBJECT, $post_type );
		if ( $existing ) {
			$post_data['post_title'] .= ' (Imported)';
		}

		$post_id = wp_insert_post( $post_data, true );

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		// Add post meta.
		if ( isset( $data['meta'] ) && is_array( $data['meta'] ) ) {
			foreach ( $data['meta'] as $key => $value ) {
				update_post_meta( $post_id, sanitize_key( $key ), $value );
			}
		}

		// Mark as imported.
		update_post_meta( $post_id, '_gambol_demo_imported', true );
		update_post_meta( $post_id, '_gambol_demo_import_time', current_time( 'mysql' ) );

		return $post_id;
	}

	/**
	 * Create backup before import.
	 *
	 * @param array $options Import options to know what to backup.
	 * @return bool True on success.
	 */
	public function create_backup( $options ) {
		$backup = array(
			'timestamp' => current_time( 'mysql' ),
			'data'      => array(),
		);

		// Backup global styles.
		if ( $options['global_styles'] ) {
			$backup['data']['global_styles'] = get_option( 'gambol_builder_global_styles', array() );
		}

		// We don't backup existing posts as they're not deleted during import.
		// If you need full rollback, you could store post IDs for deletion.

		update_option( self::BACKUP_OPTION, $backup );

		return true;
	}

	/**
	 * Rollback last import.
	 *
	 * @return array|\WP_Error Result or error.
	 */
	public function rollback() {
		$history = $this->get_import_history();

		if ( empty( $history ) ) {
			return new \WP_Error( 'no_history', __( 'No import history found.', 'gambol-builder' ) );
		}

		$last_import = end( $history );
		$results = array(
			'deleted_posts' => 0,
			'restored'      => array(),
		);

		// Delete imported posts.
		if ( ! empty( $last_import['post_ids'] ) ) {
			foreach ( $last_import['post_ids'] as $post_id ) {
				$deleted = wp_delete_post( $post_id, true );
				if ( $deleted ) {
					$results['deleted_posts']++;
				}
			}
		}

		// Restore backup data.
		$backup = get_option( self::BACKUP_OPTION, array() );

		if ( ! empty( $backup['data']['global_styles'] ) ) {
			update_option( 'gambol_builder_global_styles', $backup['data']['global_styles'] );
			$results['restored']['global_styles'] = true;
		}

		// Remove last import from history.
		array_pop( $history );
		update_option( self::IMPORT_HISTORY_OPTION, $history );

		// Clear backup.
		delete_option( self::BACKUP_OPTION );

		return $results;
	}

	/**
	 * Reset all demo content.
	 *
	 * @return array|\WP_Error Result or error.
	 */
	public function reset_all() {
		$results = array(
			'deleted_posts' => 0,
		);

		// Find all imported posts.
		$imported_posts = get_posts(
			array(
				'post_type'      => array( 'page', 'gambol_hf' ),
				'posts_per_page' => -1,
				'post_status'    => 'any',
				'meta_query'     => array(
					array(
						'key'     => '_gambol_demo_imported',
						'value'   => '1',
						'compare' => '=',
					),
				),
			)
		);

		// Delete imported posts.
		foreach ( $imported_posts as $post ) {
			$deleted = wp_delete_post( $post->ID, true );
			if ( $deleted ) {
				$results['deleted_posts']++;
			}
		}

		// Clear history.
		delete_option( self::IMPORT_HISTORY_OPTION );
		delete_option( self::BACKUP_OPTION );

		return $results;
	}

	/**
	 * Save import history.
	 *
	 * @param array $import_result Import result data.
	 * @return void
	 */
	private function save_import_history( $import_result ) {
		$history = $this->get_import_history();

		$history[] = array(
			'timestamp' => current_time( 'mysql' ),
			'demo_id'   => $import_result['demo_id'],
			'demo_name' => $import_result['demo_name'],
			'imported'  => $import_result['imported'],
			'post_ids'  => $import_result['post_ids'],
		);

		// Keep only last 10 imports.
		if ( count( $history ) > 10 ) {
			$history = array_slice( $history, -10 );
		}

		update_option( self::IMPORT_HISTORY_OPTION, $history );
	}

	/**
	 * Get import history.
	 *
	 * @return array Import history.
	 */
	public function get_import_history() {
		return get_option( self::IMPORT_HISTORY_OPTION, array() );
	}

	/**
	 * Get last import info.
	 *
	 * @return array|false Last import or false.
	 */
	public function get_last_import() {
		$history = $this->get_import_history();
		return ! empty( $history ) ? end( $history ) : false;
	}

	/**
	 * Check if rollback is available.
	 *
	 * @return bool True if rollback is available.
	 */
	public function can_rollback() {
		$history = $this->get_import_history();
		return ! empty( $history );
	}
}
