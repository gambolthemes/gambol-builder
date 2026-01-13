<?php
/**
 * Header Footer Post Type Registration.
 *
 * Registers the custom post type for headers and footers.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\HeaderFooter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Post_Type
 *
 * Handles custom post type registration for headers and footers.
 */
class Post_Type {

	/**
	 * Post type slug.
	 *
	 * @var string
	 */
	const POST_TYPE = 'gambol_hf';

	/**
	 * Singleton instance.
	 *
	 * @var Post_Type|null
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Post_Type
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
	private function __construct() {
		$this->init();
	}

	/**
	 * Initialize hooks.
	 *
	 * @return void
	 */
	private function init() {
		add_action( 'init', array( $this, 'register_post_type' ) );
		add_filter( 'manage_' . self::POST_TYPE . '_posts_columns', array( $this, 'add_admin_columns' ) );
		add_action( 'manage_' . self::POST_TYPE . '_posts_custom_column', array( $this, 'render_admin_columns' ), 10, 2 );
		add_filter( 'post_row_actions', array( $this, 'modify_row_actions' ), 10, 2 );
	}

	/**
	 * Register the custom post type.
	 *
	 * @return void
	 */
	public function register_post_type() {
		$labels = array(
			'name'                  => _x( 'Theme Builder', 'Post type general name', 'gambol-builder' ),
			'singular_name'         => _x( 'Template', 'Post type singular name', 'gambol-builder' ),
			'menu_name'             => _x( 'Theme Builder', 'Admin Menu text', 'gambol-builder' ),
			'name_admin_bar'        => _x( 'Template', 'Add New on Toolbar', 'gambol-builder' ),
			'add_new'               => __( 'Add New', 'gambol-builder' ),
			'add_new_item'          => __( 'Add New Template', 'gambol-builder' ),
			'new_item'              => __( 'New Template', 'gambol-builder' ),
			'edit_item'             => __( 'Edit Template', 'gambol-builder' ),
			'view_item'             => __( 'View Template', 'gambol-builder' ),
			'all_items'             => __( 'Theme Builder', 'gambol-builder' ),
			'search_items'          => __( 'Search Templates', 'gambol-builder' ),
			'not_found'             => __( 'No templates found.', 'gambol-builder' ),
			'not_found_in_trash'    => __( 'No templates found in Trash.', 'gambol-builder' ),
			'filter_items_list'     => _x( 'Filter templates list', 'Screen reader text', 'gambol-builder' ),
			'items_list_navigation' => _x( 'Templates list navigation', 'Screen reader text', 'gambol-builder' ),
			'items_list'            => _x( 'Templates list', 'Screen reader text', 'gambol-builder' ),
		);

		$args = array(
			'labels'              => $labels,
			'public'              => false,
			'publicly_queryable'  => false,
			'show_ui'             => true,
			'show_in_menu'        => 'gambol-builder', // Show under main Gambol menu.
			'query_var'           => false,
			'rewrite'             => false,
			'capability_type'     => 'post',
			'has_archive'         => false,
			'hierarchical'        => false,
			'supports'            => array( 'title', 'editor', 'revisions' ),
			'show_in_rest'        => true,
			'exclude_from_search' => true,
		);

		register_post_type( self::POST_TYPE, $args );
	}

	/**
	 * Add custom admin columns.
	 *
	 * @param array $columns Existing columns.
	 * @return array Modified columns.
	 */
	public function add_admin_columns( $columns ) {
		$new_columns = array();

		foreach ( $columns as $key => $value ) {
			if ( 'title' === $key ) {
				$new_columns[ $key ] = $value;
				$new_columns['gambol_type'] = __( 'Type', 'gambol-builder' );
				$new_columns['gambol_location'] = __( 'Display On', 'gambol-builder' );
				$new_columns['gambol_status'] = __( 'Status', 'gambol-builder' );
			} elseif ( 'date' === $key ) {
				$new_columns[ $key ] = $value;
			}
		}

		return $new_columns;
	}

	/**
	 * Render custom admin columns.
	 *
	 * @param string $column  Column name.
	 * @param int    $post_id Post ID.
	 * @return void
	 */
	public function render_admin_columns( $column, $post_id ) {
		switch ( $column ) {
			case 'gambol_type':
				$type = get_post_meta( $post_id, '_gambol_hf_type', true );
				$types = array(
					'header' => __( 'Header', 'gambol-builder' ),
					'footer' => __( 'Footer', 'gambol-builder' ),
				);
				echo esc_html( isset( $types[ $type ] ) ? $types[ $type ] : '—' );
				break;

			case 'gambol_location':
				$location = get_post_meta( $post_id, '_gambol_hf_display_on', true );
				$locations = $this->get_display_locations();
				echo esc_html( isset( $locations[ $location ] ) ? $locations[ $location ] : __( 'Not Set', 'gambol-builder' ) );
				break;

			case 'gambol_status':
				$is_active = get_post_meta( $post_id, '_gambol_hf_active', true );
				if ( $is_active ) {
					echo '<span class="gambol-status gambol-status--active">' . esc_html__( 'Active', 'gambol-builder' ) . '</span>';
				} else {
					echo '<span class="gambol-status gambol-status--inactive">' . esc_html__( 'Inactive', 'gambol-builder' ) . '</span>';
				}
				break;
		}
	}

	/**
	 * Get display location options.
	 *
	 * @return array Location options.
	 */
	public function get_display_locations() {
		return array(
			'global'         => __( 'Entire Website', 'gambol-builder' ),
			'front_page'     => __( 'Front Page', 'gambol-builder' ),
			'blog'           => __( 'Blog / Posts Page', 'gambol-builder' ),
			'singular_post'  => __( 'All Posts', 'gambol-builder' ),
			'singular_page'  => __( 'All Pages', 'gambol-builder' ),
			'archive'        => __( 'All Archives', 'gambol-builder' ),
			'search'         => __( 'Search Results', 'gambol-builder' ),
			'404'            => __( '404 Page', 'gambol-builder' ),
			'specific_pages' => __( 'Specific Pages/Posts', 'gambol-builder' ),
		);
	}

	/**
	 * Modify row actions.
	 *
	 * @param array    $actions Row actions.
	 * @param \WP_Post $post    Post object.
	 * @return array Modified actions.
	 */
	public function modify_row_actions( $actions, $post ) {
		if ( self::POST_TYPE !== $post->post_type ) {
			return $actions;
		}

		// Remove view action since it's not publicly queryable.
		unset( $actions['view'] );

		return $actions;
	}
}
