<?php
/**
 * Demo Importer - Importer
 *
 * Imports a demo's pages, headers, footers and global styles, either in one
 * call (import()) or step by step (start_session(), the import_* steps, then
 * finalize()), and records everything it creates so it can be rolled back.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\DemoImporter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Importer Class.
 */
class Importer {

	/**
	 * Singleton instance.
	 *
	 * @var Importer|null
	 */
	private static $instance = null;

	/**
	 * Option name for import history.
	 *
	 * @var string
	 */
	const IMPORT_HISTORY_OPTION = 'gambol_demo_import_history';

	/**
	 * Option name for the pre-import backup.
	 *
	 * @var string
	 */
	const BACKUP_OPTION = 'gambol_demo_import_backup';

	/**
	 * Option name for the step-by-step import in progress.
	 *
	 * @var string
	 */
	const SESSION_OPTION = 'gambol_demo_import_session';

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
	 * Import a whole demo in one request.
	 *
	 * @param string $demo_id Demo ID.
	 * @param array  $options Import options.
	 * @return array|\WP_Error Result array or error.
	 */
	public function import( $demo_id, $options = array() ) {
		$options = wp_parse_args(
			$options,
			array(
				'pages'         => true,
				'headers'       => true,
				'footers'       => true,
				'global_styles' => true,
				'create_backup' => true,
			)
		);

		$demo = Demo_Manager::get_instance()->get_demo( $demo_id );
		if ( ! $demo ) {
			return new \WP_Error( 'invalid_demo', __( 'Demo not found.', 'gambol-builder' ) );
		}

		$this->start_session( $demo_id );

		if ( $options['create_backup'] ) {
			$this->create_backup( $options );
		}

		$errors = array();
		foreach ( array( 'pages', 'headers', 'footers', 'global_styles' ) as $step ) {
			if ( empty( $options[ $step ] ) ) {
				continue;
			}
			$result = $this->run_step( $demo_id, $step );
			if ( is_wp_error( $result ) ) {
				$errors[ $step ] = $result->get_error_message();
			}
		}

		$results           = $this->finalize( $demo_id );
		$results['errors'] = $errors;

		return $results;
	}

	/**
	 * Run one import step.
	 *
	 * @param string $demo_id Demo ID.
	 * @param string $step    One of backup, pages, headers, footers, global_styles, finalize.
	 * @return mixed|\WP_Error Step result.
	 */
	public function run_step( $demo_id, $step ) {
		switch ( $step ) {
			case 'backup':
				$this->start_session( $demo_id );
				return $this->create_backup(
					array(
						'pages'         => true,
						'headers'       => true,
						'footers'       => true,
						'global_styles' => true,
					)
				);
			case 'pages':
				return $this->import_pages( $demo_id );
			case 'headers':
				return $this->import_hf( $demo_id, 'header' );
			case 'footers':
				return $this->import_hf( $demo_id, 'footer' );
			case 'global_styles':
				return $this->import_global_styles( $demo_id );
			case 'finalize':
				return $this->finalize( $demo_id );
		}
		return new \WP_Error( 'invalid_step', __( 'Invalid import step.', 'gambol-builder' ), array( 'status' => 400 ) );
	}

	// ---------------------------------------------------------------------
	// Session: what this import has created so far.
	// ---------------------------------------------------------------------

	/**
	 * Start (or restart) an import session.
	 *
	 * @param string $demo_id Demo ID.
	 * @return void
	 */
	public function start_session( $demo_id ) {
		update_option(
			self::SESSION_OPTION,
			array(
				'demo_id'     => $demo_id,
				'started'     => current_time( 'mysql' ),
				'post_ids'    => array(),
				'pages'       => array(),
				'deactivated' => array(),
				'imported'    => array(),
			),
			false
		);
	}

	/**
	 * Get the current session for a demo, starting one if needed.
	 *
	 * @param string $demo_id Demo ID.
	 * @return array
	 */
	private function get_session( $demo_id ) {
		$session = get_option( self::SESSION_OPTION, array() );
		if ( empty( $session['demo_id'] ) || $session['demo_id'] !== $demo_id ) {
			$this->start_session( $demo_id );
			$session = get_option( self::SESSION_OPTION, array() );
		}
		return $session;
	}

	/**
	 * Merge data into the session.
	 *
	 * @param string $demo_id Demo ID.
	 * @param array  $data    Keys: post_ids, pages (title => id), deactivated, imported (step => value).
	 * @return void
	 */
	private function record( $demo_id, $data ) {
		$session = $this->get_session( $demo_id );
		foreach ( array( 'post_ids', 'deactivated' ) as $key ) {
			if ( ! empty( $data[ $key ] ) ) {
				$session[ $key ] = array_values( array_unique( array_merge( $session[ $key ], array_map( 'absint', $data[ $key ] ) ) ) );
			}
		}
		foreach ( array( 'pages', 'imported' ) as $key ) {
			if ( ! empty( $data[ $key ] ) ) {
				$session[ $key ] = array_merge( $session[ $key ], $data[ $key ] );
			}
		}
		update_option( self::SESSION_OPTION, $session, false );
	}

	// ---------------------------------------------------------------------
	// Steps.
	// ---------------------------------------------------------------------

	/**
	 * Import pages.
	 *
	 * @param string $demo_id Demo ID.
	 * @return array|\WP_Error Result or error.
	 */
	public function import_pages( $demo_id ) {
		$pages = Demo_Manager::get_instance()->get_demo_data( $demo_id, 'pages' );

		if ( false === $pages ) {
			return new \WP_Error( 'no_pages', __( 'No pages data found.', 'gambol-builder' ) );
		}

		$post_ids = array();
		$by_title = array();

		foreach ( $pages as $page ) {
			$result = $this->import_post( $page, 'page' );
			if ( ! is_wp_error( $result ) ) {
				$post_ids[] = $result;
				if ( ! empty( $page['title'] ) ) {
					$by_title[ $page['title'] ] = $result;
				}
			}
		}

		$this->record(
			$demo_id,
			array(
				'post_ids' => $post_ids,
				'pages'    => $by_title,
				'imported' => array( 'pages' => count( $post_ids ) ),
			)
		);

		return array(
			'count'    => count( $post_ids ),
			'post_ids' => $post_ids,
		);
	}

	/**
	 * Import headers.
	 *
	 * @param string $demo_id Demo ID.
	 * @return array|\WP_Error
	 */
	public function import_headers( $demo_id ) {
		return $this->import_hf( $demo_id, 'header' );
	}

	/**
	 * Import footers.
	 *
	 * @param string $demo_id Demo ID.
	 * @return array|\WP_Error
	 */
	public function import_footers( $demo_id ) {
		return $this->import_hf( $demo_id, 'footer' );
	}

	/**
	 * Import headers or footers.
	 *
	 * The demo's active global header/footer replaces the site's current one:
	 * existing active ones of the same type are deactivated (and restored on
	 * rollback) so the site never shows two headers.
	 *
	 * @param string $demo_id Demo ID.
	 * @param string $type    header or footer.
	 * @return array|\WP_Error Result or error.
	 */
	private function import_hf( $demo_id, $type ) {
		$items = Demo_Manager::get_instance()->get_demo_data( $demo_id, 'header' === $type ? 'headers' : 'footers' );

		if ( false === $items ) {
			/* translators: %s: header or footer */
			return new \WP_Error( 'no_' . $type, sprintf( __( 'No %s data found.', 'gambol-builder' ), $type ) );
		}

		$deactivated = $this->deactivate_active_hf( $type );

		$post_ids = array();
		foreach ( $items as $item ) {
			$item['meta']                   = isset( $item['meta'] ) && is_array( $item['meta'] ) ? $item['meta'] : array();
			$item['meta']['_gambol_hf_type'] = $type;
			$result                         = $this->import_post( $item, 'gambol_hf' );
			if ( ! is_wp_error( $result ) ) {
				$post_ids[] = $result;
			}
		}

		$this->record(
			$demo_id,
			array(
				'post_ids'    => $post_ids,
				'deactivated' => $deactivated,
				'imported'    => array( $type . 's' => count( $post_ids ) ),
			)
		);

		return array(
			'count'    => count( $post_ids ),
			'post_ids' => $post_ids,
		);
	}

	/**
	 * Deactivate the currently active headers or footers of one type.
	 *
	 * @param string $type header or footer.
	 * @return int[] IDs that were deactivated.
	 */
	private function deactivate_active_hf( $type ) {
		$ids = get_posts(
			array(
				'post_type'      => 'gambol_hf',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'relation' => 'AND',
					array(
						'key'   => '_gambol_hf_type',
						'value' => $type,
					),
					array(
						'key'   => '_gambol_hf_active',
						'value' => '1',
					),
				),
			)
		);

		foreach ( $ids as $id ) {
			update_post_meta( $id, '_gambol_hf_active', '0' );
		}

		return array_map( 'absint', $ids );
	}

	/**
	 * Import global styles.
	 *
	 * @param string $demo_id Demo ID.
	 * @return bool|\WP_Error True on success or error.
	 */
	public function import_global_styles( $demo_id ) {
		$styles = Demo_Manager::get_instance()->get_demo_data( $demo_id, 'global_styles' );

		if ( false === $styles ) {
			return new \WP_Error( 'no_styles', __( 'No global styles data found.', 'gambol-builder' ) );
		}

		if ( ! class_exists( 'GambolBuilder\Global_Styles' ) ) {
			return new \WP_Error( 'no_global_styles', __( 'Global Styles class not found.', 'gambol-builder' ) );
		}

		$global_styles = \GambolBuilder\Global_Styles::get_instance();
		$global_styles->update_styles( $global_styles->sanitize_styles( $styles ) );

		// update_option() returns false when nothing changed, which is not a failure.
		$this->record( $demo_id, array( 'imported' => array( 'global_styles' => true ) ) );

		return true;
	}

	/**
	 * Finish an import: front page, menu, history.
	 *
	 * @param string $demo_id Demo ID.
	 * @return array Import summary.
	 */
	public function finalize( $demo_id ) {
		$demo    = Demo_Manager::get_instance()->get_demo( $demo_id );
		$session = $this->get_session( $demo_id );

		// Front page.
		$front_title = ! empty( $demo['front_page'] ) ? $demo['front_page'] : '';
		if ( $front_title && ! empty( $session['pages'][ $front_title ] ) ) {
			$backup = get_option( self::BACKUP_OPTION, array() );
			if ( is_array( $backup ) && ! isset( $backup['data']['reading'] ) ) {
				$backup['data']['reading'] = array(
					'show_on_front' => get_option( 'show_on_front' ),
					'page_on_front' => (int) get_option( 'page_on_front' ),
				);
				update_option( self::BACKUP_OPTION, $backup, false );
			}
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', (int) $session['pages'][ $front_title ] );
		}

		// Navigation menu from the imported pages.
		$menu_id = 0;
		if ( ! empty( $session['pages'] ) && ! empty( $demo['menu'] ) ) {
			$menu_id = $this->create_menu( $demo, $session['pages'] );
		}

		$results = array(
			'demo_id'     => $demo_id,
			'demo_name'   => isset( $demo['name'] ) ? $demo['name'] : $demo_id,
			'imported'    => $session['imported'],
			'post_ids'    => $session['post_ids'],
			'deactivated' => $session['deactivated'],
			'menu_id'     => $menu_id,
		);

		$this->save_import_history( $results );
		delete_option( self::SESSION_OPTION );

		return $results;
	}

	/**
	 * Create a navigation menu from the imported pages.
	 *
	 * @param array $demo  Demo config; `menu` is a list of page titles.
	 * @param array $pages Imported pages, title => ID.
	 * @return int Menu ID, or 0.
	 */
	private function create_menu( $demo, $pages ) {
		/* translators: %s: demo name */
		$name    = sprintf( __( '%s menu', 'gambol-builder' ), isset( $demo['name'] ) ? $demo['name'] : 'Demo' );
		$base    = $name;
		$counter = 2;
		while ( wp_get_nav_menu_object( $name ) ) {
			$name = $base . ' ' . $counter++;
		}

		$menu_id = wp_create_nav_menu( $name );
		if ( is_wp_error( $menu_id ) ) {
			return 0;
		}

		foreach ( (array) $demo['menu'] as $title ) {
			if ( empty( $pages[ $title ] ) ) {
				continue;
			}
			wp_update_nav_menu_item(
				$menu_id,
				0,
				array(
					'menu-item-title'     => $title,
					'menu-item-object'    => 'page',
					'menu-item-object-id' => (int) $pages[ $title ],
					'menu-item-type'      => 'post_type',
					'menu-item-status'    => 'publish',
				)
			);
		}

		return (int) $menu_id;
	}

	/**
	 * Import a single post.
	 *
	 * @param array  $data      Post data.
	 * @param string $post_type Post type.
	 * @return int|\WP_Error Post ID or error.
	 */
	private function import_post( $data, $post_type ) {
		$content = isset( $data['content'] ) ? \GambolBuilder\resolve_asset_tokens( (string) $data['content'] ) : '';

		// Demo content is shipped with the plugin; only filter it for users who
		// could not have written it themselves.
		if ( ! current_user_can( 'unfiltered_html' ) ) {
			$content = wp_kses_post( $content );
		}

		$post_data = array(
			'post_title'   => isset( $data['title'] ) ? sanitize_text_field( $data['title'] ) : '',
			'post_content' => $content,
			'post_status'  => 'publish',
			'post_type'    => $post_type,
		);

		if ( isset( $data['excerpt'] ) ) {
			$post_data['post_excerpt'] = sanitize_textarea_field( $data['excerpt'] );
		}

		if ( isset( $data['menu_order'] ) ) {
			$post_data['menu_order'] = absint( $data['menu_order'] );
		}

		if ( isset( $data['slug'] ) ) {
			$post_data['post_name'] = sanitize_title( $data['slug'] );
		}

		if ( $this->title_exists( $post_data['post_title'], $post_type ) ) {
			/* translators: %s: original title */
			$post_data['post_title'] = sprintf( __( '%s (Imported)', 'gambol-builder' ), $post_data['post_title'] );
		}

		// wp_insert_post() unslashes its input: slash it so the JSON escapes in
		// block comments (<, " ...) survive and the blocks stay valid.
		$post_id = wp_insert_post( wp_slash( $post_data ), true );

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		if ( isset( $data['meta'] ) && is_array( $data['meta'] ) ) {
			foreach ( $data['meta'] as $key => $value ) {
				update_post_meta( $post_id, sanitize_key( $key ), wp_slash( $value ) );
			}
		}

		update_post_meta( $post_id, '_gambol_demo_imported', '1' );
		update_post_meta( $post_id, '_gambol_demo_import_time', current_time( 'mysql' ) );

		return $post_id;
	}

	/**
	 * Whether a post with this exact title exists (replaces the deprecated get_page_by_title).
	 *
	 * @param string $title     Title.
	 * @param string $post_type Post type.
	 * @return bool
	 */
	private function title_exists( $title, $post_type ) {
		if ( '' === $title ) {
			return false;
		}
		$query = new \WP_Query(
			array(
				'post_type'              => $post_type,
				'title'                  => $title,
				'post_status'            => 'any',
				'posts_per_page'         => 1,
				'fields'                 => 'ids',
				'no_found_rows'          => true,
				'update_post_meta_cache' => false,
				'update_post_term_cache' => false,
			)
		);
		return ! empty( $query->posts );
	}

	// ---------------------------------------------------------------------
	// Backup, rollback, reset, history.
	// ---------------------------------------------------------------------

	/**
	 * Create backup before import.
	 *
	 * @param array $options Import options to know what to back up.
	 * @return bool True on success.
	 */
	public function create_backup( $options ) {
		$backup = array(
			'timestamp' => current_time( 'mysql' ),
			'data'      => array(),
		);

		if ( ! empty( $options['global_styles'] ) ) {
			$backup['data']['global_styles'] = get_option( 'gambol_builder_global_styles', array() );
		}

		update_option( self::BACKUP_OPTION, $backup, false );

		return true;
	}

	/**
	 * Roll back the last import.
	 *
	 * @return array|\WP_Error Result or error.
	 */
	public function rollback() {
		$history = $this->get_import_history();

		if ( empty( $history ) ) {
			return new \WP_Error( 'no_history', __( 'No import history found.', 'gambol-builder' ) );
		}

		$last_import = end( $history );
		$results     = array(
			'deleted_posts' => 0,
			'restored'      => array(),
		);

		if ( ! empty( $last_import['post_ids'] ) ) {
			foreach ( $last_import['post_ids'] as $post_id ) {
				// Only delete what the importer created.
				if ( get_post_meta( $post_id, '_gambol_demo_imported', true ) && wp_delete_post( $post_id, true ) ) {
					$results['deleted_posts']++;
				}
			}
		}

		if ( ! empty( $last_import['menu_id'] ) ) {
			wp_delete_nav_menu( (int) $last_import['menu_id'] );
		}

		// Re-activate the headers/footers the import switched off.
		if ( ! empty( $last_import['deactivated'] ) ) {
			foreach ( $last_import['deactivated'] as $id ) {
				if ( 'gambol_hf' === get_post_type( $id ) ) {
					update_post_meta( $id, '_gambol_hf_active', '1' );
				}
			}
			$results['restored']['headers_footers'] = count( $last_import['deactivated'] );
		}

		$backup = get_option( self::BACKUP_OPTION, array() );

		// An empty array is a real previous state (defaults), so restore it too.
		if ( isset( $backup['data']['global_styles'] ) ) {
			update_option( 'gambol_builder_global_styles', $backup['data']['global_styles'] );
			$results['restored']['global_styles'] = true;
		}

		if ( isset( $backup['data']['reading'] ) ) {
			update_option( 'show_on_front', $backup['data']['reading']['show_on_front'] );
			update_option( 'page_on_front', (int) $backup['data']['reading']['page_on_front'] );
			$results['restored']['front_page'] = true;
		}

		array_pop( $history );
		update_option( self::IMPORT_HISTORY_OPTION, $history, false );
		delete_option( self::BACKUP_OPTION );

		return $results;
	}

	/**
	 * Delete all demo content ever imported.
	 *
	 * @return array Result.
	 */
	public function reset_all() {
		$results = array( 'deleted_posts' => 0 );

		$imported_posts = get_posts(
			array(
				'post_type'      => array( 'page', 'gambol_hf' ),
				'posts_per_page' => -1,
				'post_status'    => 'any',
				'fields'         => 'ids',
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					array(
						'key'     => '_gambol_demo_imported',
						'compare' => 'EXISTS',
					),
				),
			)
		);

		foreach ( $imported_posts as $post_id ) {
			if ( wp_delete_post( $post_id, true ) ) {
				$results['deleted_posts']++;
			}
		}

		foreach ( $this->get_import_history() as $entry ) {
			if ( ! empty( $entry['menu_id'] ) ) {
				wp_delete_nav_menu( (int) $entry['menu_id'] );
			}
		}

		delete_option( self::IMPORT_HISTORY_OPTION );
		delete_option( self::BACKUP_OPTION );
		delete_option( self::SESSION_OPTION );

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
			'timestamp'   => current_time( 'mysql' ),
			'demo_id'     => $import_result['demo_id'],
			'demo_name'   => $import_result['demo_name'],
			'imported'    => $import_result['imported'],
			'post_ids'    => $import_result['post_ids'],
			'deactivated' => isset( $import_result['deactivated'] ) ? $import_result['deactivated'] : array(),
			'menu_id'     => isset( $import_result['menu_id'] ) ? (int) $import_result['menu_id'] : 0,
		);

		if ( count( $history ) > 10 ) {
			$history = array_slice( $history, -10 );
		}

		update_option( self::IMPORT_HISTORY_OPTION, $history, false );
	}

	/**
	 * Get import history.
	 *
	 * @return array Import history.
	 */
	public function get_import_history() {
		$history = get_option( self::IMPORT_HISTORY_OPTION, array() );
		return is_array( $history ) ? $history : array();
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
		return ! empty( $this->get_import_history() );
	}
}
