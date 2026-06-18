<?php
/**
 * Template Library Manager.
 *
 * Manages templates from three sources:
 * 1. Bundled JSON files shipped with the plugin
 * 2. Remotely fetched templates (cached via transients)
 * 3. Locally saved templates (via gambol_template CPT)
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\TemplateLibrary;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Template_Manager
 */
class Template_Manager {

	const TRANSIENT_KEY     = 'gambol_remote_templates';
	const TRANSIENT_EXPIRY  = DAY_IN_SECONDS;
	const TEMPLATES_DIR     = GAMBOL_BUILDER_PATH . 'includes/template-library/templates/';

	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {}

	/**
	 * Get all templates (bundled + remote + local).
	 *
	 * @param array $filters Optional. category, type, search.
	 * @return array
	 */
	public function get_templates( $filters = array() ) {
		$templates = array_merge(
			$this->get_bundled_templates(),
			$this->get_local_templates()
		);

		// Apply filters.
		if ( ! empty( $filters['category'] ) ) {
			$cat       = sanitize_text_field( $filters['category'] );
			$templates = array_filter( $templates, function( $t ) use ( $cat ) {
				return in_array( $cat, (array) $t['categories'], true );
			} );
		}

		if ( ! empty( $filters['type'] ) ) {
			$type      = sanitize_text_field( $filters['type'] );
			$templates = array_filter( $templates, function( $t ) use ( $type ) {
				return isset( $t['type'] ) && $t['type'] === $type;
			} );
		}

		if ( ! empty( $filters['search'] ) ) {
			$search    = strtolower( sanitize_text_field( $filters['search'] ) );
			$templates = array_filter( $templates, function( $t ) use ( $search ) {
				return strpos( strtolower( $t['title'] ), $search ) !== false;
			} );
		}

		return array_values( $templates );
	}

	/**
	 * Get bundled templates from JSON files.
	 *
	 * @return array
	 */
	private function get_bundled_templates() {
		$templates = array();

		if ( ! is_dir( self::TEMPLATES_DIR ) ) {
			return $templates;
		}

		$files = glob( self::TEMPLATES_DIR . '*.json' );
		if ( empty( $files ) ) {
			return $templates;
		}

		foreach ( $files as $file ) {
			$json = file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
			if ( ! $json ) {
				continue;
			}
			$data = json_decode( $json, true );
			if ( ! is_array( $data ) ) {
				continue;
			}
			$data['source'] = 'bundled';
			$data['id']     = $data['id'] ?? 'bundled-' . sanitize_title( basename( $file, '.json' ) );
			$templates[]    = $data;
		}

		return $templates;
	}

	/**
	 * Get locally saved templates from gambol_template CPT.
	 *
	 * @return array
	 */
	private function get_local_templates() {
		$templates = array();

		$posts = get_posts( array(
			'post_type'      => 'gambol_template',
			'post_status'    => 'publish',
			'posts_per_page' => 100,
			'fields'         => 'all',
		) );

		foreach ( $posts as $post ) {
			$templates[] = array(
				'id'          => 'local-' . $post->ID,
				'post_id'     => $post->ID,
				'title'       => $post->post_title,
				'type'        => get_post_meta( $post->ID, '_gambol_template_type', true ) ?: 'section',
				'categories'  => (array) get_post_meta( $post->ID, '_gambol_template_categories', true ),
				'thumbnail'   => get_post_meta( $post->ID, '_gambol_template_thumbnail', true ) ?: '',
				'content'     => $post->post_content,
				'source'      => 'local',
			);
		}

		return $templates;
	}

	/**
	 * Save a template locally.
	 *
	 * @param array $data Template data: title, type, categories, content, thumbnail.
	 * @return int|\WP_Error Post ID on success.
	 */
	public function save_template( $data ) {
		if ( empty( $data['title'] ) || empty( $data['content'] ) ) {
			return new \WP_Error( 'missing_data', __( 'Title and content are required.', 'gambol-builder' ) );
		}

		$post_id = wp_insert_post( array(
			'post_type'    => 'gambol_template',
			'post_status'  => 'publish',
			'post_title'   => sanitize_text_field( $data['title'] ),
			'post_content' => wp_kses_post( $data['content'] ),
		) );

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		update_post_meta( $post_id, '_gambol_template_type',       sanitize_key( $data['type'] ?? 'section' ) );
		update_post_meta( $post_id, '_gambol_template_categories', array_map( 'sanitize_key', (array) ( $data['categories'] ?? array() ) ) );
		update_post_meta( $post_id, '_gambol_template_thumbnail',  esc_url_raw( $data['thumbnail'] ?? '' ) );

		return $post_id;
	}

	/**
	 * Delete a local template.
	 *
	 * @param int $post_id Template post ID.
	 * @return bool|\WP_Error
	 */
	public function delete_template( $post_id ) {
		$post = get_post( absint( $post_id ) );
		if ( ! $post || 'gambol_template' !== $post->post_type ) {
			return new \WP_Error( 'not_found', __( 'Template not found.', 'gambol-builder' ) );
		}
		wp_delete_post( $post_id, true );
		return true;
	}

	/**
	 * Get template content by ID for import.
	 *
	 * @param string $id Template ID (local-{n} or bundled-{slug}).
	 * @return string Block HTML content.
	 */
	public function get_template_content( $id ) {
		if ( strpos( $id, 'local-' ) === 0 ) {
			$post_id = (int) str_replace( 'local-', '', $id );
			$post    = get_post( $post_id );
			return $post ? $post->post_content : '';
		}

		// Bundled template.
		$slug  = str_replace( 'bundled-', '', $id );
		$file  = self::TEMPLATES_DIR . $slug . '.json';
		if ( ! file_exists( $file ) ) {
			return '';
		}
		$json = file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$data = json_decode( $json, true );
		return $data['content'] ?? '';
	}
}
