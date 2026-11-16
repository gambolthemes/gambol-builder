<?php
/**
 * Forms - Submission backend for the Form and Subscribe blocks.
 *
 * The gambol/form and gambol/subscribe blocks save static markup with
 * `<form method="post" action="">`. This class provides a REST endpoint
 * that the frontend script (src/frontend/forms.js) posts to, so that the
 * saved block markup never has to change.
 *
 * Configuration that is not present in the markup (recipient, success
 * message, visible fields) is always read server-side from the post's
 * parsed blocks, so a visitor can never choose the recipient.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Forms;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Forms Class.
 */
class Forms {

	/**
	 * REST namespace.
	 */
	const REST_NAMESPACE = 'gambol-builder/v1';

	/**
	 * REST route.
	 */
	const REST_ROUTE = '/forms/submit';

	/**
	 * Entry post type.
	 */
	const POST_TYPE = 'gambol_form_entry';

	/**
	 * Minimum time (seconds) between page load and submit.
	 */
	const MIN_FILL_SECONDS = 3;

	/**
	 * Max successful submissions per IP within the rate limit window.
	 */
	const RATE_LIMIT = 5;

	/**
	 * Rate limit window in seconds.
	 */
	const RATE_WINDOW = 600;

	/**
	 * Supported block names.
	 *
	 * @var string[]
	 */
	private static $block_names = array( 'gambol/form', 'gambol/subscribe' );

	/**
	 * Attribute defaults, mirroring src/blocks/{form,subscribe}/index.js.
	 * Parsed blocks omit attributes left at their default value.
	 *
	 * @var array
	 */
	private static $defaults = array(
		'gambol/form'      => array(
			'formType'       => 'contact',
			'showName'       => true,
			'showEmail'      => true,
			'showPhone'      => false,
			'showSubject'    => true,
			'showMessage'    => true,
			'successMessage' => 'Thank you for your message!',
			'emailTo'        => '',
		),
		'gambol/subscribe' => array(
			'showName'       => false,
			'successMessage' => 'Thank you for subscribing!',
		),
	);

	/**
	 * Per-request cache of forms found per post.
	 *
	 * @var array
	 */
	private static $forms_cache = array();

	/**
	 * Initialize hooks.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_post_type' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'localize_frontend' ), 20 );

		// Admin list table + entry details.
		add_filter( 'manage_' . self::POST_TYPE . '_posts_columns', array( __CLASS__, 'admin_columns' ) );
		add_action( 'manage_' . self::POST_TYPE . '_posts_custom_column', array( __CLASS__, 'admin_column_content' ), 10, 2 );
		add_action( 'add_meta_boxes_' . self::POST_TYPE, array( __CLASS__, 'add_meta_boxes' ) );
	}

	// =============================================
	// POST TYPE
	// =============================================

	/**
	 * Register the private entry post type.
	 *
	 * @return void
	 */
	public static function register_post_type() {
		$parent = class_exists( '\GambolBuilder\Admin_Page' ) ? \GambolBuilder\Admin_Page::MENU_SLUG : true;

		register_post_type(
			self::POST_TYPE,
			array(
				'labels'              => array(
					'name'          => __( 'Form Entries', 'gambol-builder' ),
					'singular_name' => __( 'Form Entry', 'gambol-builder' ),
					'menu_name'     => __( 'Form Entries', 'gambol-builder' ),
					'all_items'     => __( 'Form Entries', 'gambol-builder' ),
					'edit_item'     => __( 'View Form Entry', 'gambol-builder' ),
					'search_items'  => __( 'Search Entries', 'gambol-builder' ),
					'not_found'     => __( 'No entries found.', 'gambol-builder' ),
				),
				'public'              => false,
				'publicly_queryable'  => false,
				'exclude_from_search' => true,
				'show_ui'             => true,
				'show_in_menu'        => $parent,
				'show_in_nav_menus'   => false,
				'show_in_admin_bar'   => false,
				'show_in_rest'        => false,
				'query_var'           => false,
				'rewrite'             => false,
				'has_archive'         => false,
				'hierarchical'        => false,
				'supports'            => array( 'title' ),
				'map_meta_cap'        => false,
				'capabilities'        => array(
					'edit_post'              => 'manage_options',
					'read_post'              => 'manage_options',
					'delete_post'            => 'manage_options',
					'edit_posts'             => 'manage_options',
					'edit_others_posts'      => 'manage_options',
					'edit_private_posts'     => 'manage_options',
					'edit_published_posts'   => 'manage_options',
					'publish_posts'          => 'manage_options',
					'read_private_posts'     => 'manage_options',
					'delete_posts'           => 'manage_options',
					'delete_others_posts'    => 'manage_options',
					'delete_private_posts'   => 'manage_options',
					'delete_published_posts' => 'manage_options',
					'create_posts'           => 'do_not_allow',
				),
			)
		);
	}

	/**
	 * Admin list columns.
	 *
	 * @param array $columns Columns.
	 * @return array
	 */
	public static function admin_columns( $columns ) {
		return array(
			'cb'           => isset( $columns['cb'] ) ? $columns['cb'] : '<input type="checkbox" />',
			'title'        => __( 'Entry', 'gambol-builder' ),
			'gambol_form'  => __( 'Form / Page', 'gambol-builder' ),
			'gambol_email' => __( 'Email', 'gambol-builder' ),
			'gambol_name'  => __( 'Name', 'gambol-builder' ),
			'date'         => __( 'Date', 'gambol-builder' ),
		);
	}

	/**
	 * Admin list column content.
	 *
	 * @param string $column  Column key.
	 * @param int    $post_id Entry ID.
	 * @return void
	 */
	public static function admin_column_content( $column, $post_id ) {
		switch ( $column ) {
			case 'gambol_form':
				$source_id = (int) get_post_meta( $post_id, '_gambol_source_post_id', true );
				$type      = (string) get_post_meta( $post_id, '_gambol_form_type', true );
				$label     = 'subscribe' === $type ? __( 'Subscribe', 'gambol-builder' ) : __( 'Form', 'gambol-builder' );
				echo esc_html( $label );
				if ( $source_id && get_post( $source_id ) ) {
					echo ' &mdash; <a href="' . esc_url( get_permalink( $source_id ) ) . '">' . esc_html( get_the_title( $source_id ) ) . '</a>';
				}
				break;

			case 'gambol_email':
				$email = (string) get_post_meta( $post_id, '_gambol_email', true );
				if ( $email ) {
					echo '<a href="' . esc_url( 'mailto:' . $email ) . '">' . esc_html( $email ) . '</a>';
				}
				break;

			case 'gambol_name':
				echo esc_html( (string) get_post_meta( $post_id, '_gambol_name', true ) );
				break;
		}
	}

	/**
	 * Register the read-only details meta box.
	 *
	 * @return void
	 */
	public static function add_meta_boxes() {
		add_meta_box(
			'gambol-form-entry-fields',
			__( 'Submitted Data', 'gambol-builder' ),
			array( __CLASS__, 'render_entry_meta_box' ),
			self::POST_TYPE,
			'normal',
			'high'
		);
	}

	/**
	 * Render the submitted fields (escaped, read-only).
	 *
	 * @param \WP_Post $post Entry post.
	 * @return void
	 */
	public static function render_entry_meta_box( $post ) {
		$fields    = get_post_meta( $post->ID, '_gambol_fields', true );
		$source_id = (int) get_post_meta( $post->ID, '_gambol_source_post_id', true );
		$mail_sent = get_post_meta( $post->ID, '_gambol_mail_sent', true );

		echo '<table class="widefat striped"><tbody>';
		if ( is_array( $fields ) ) {
			foreach ( $fields as $key => $value ) {
				echo '<tr><th scope="row" style="width:20%">' . esc_html( self::field_label( $key ) ) . '</th><td>' . nl2br( esc_html( (string) $value ) ) . '</td></tr>';
			}
		}
		if ( $source_id ) {
			echo '<tr><th scope="row">' . esc_html__( 'Page', 'gambol-builder' ) . '</th><td><a href="' . esc_url( get_permalink( $source_id ) ) . '">' . esc_html( get_the_title( $source_id ) ) . '</a></td></tr>';
		}
		echo '<tr><th scope="row">' . esc_html__( 'Notification', 'gambol-builder' ) . '</th><td>' . ( '1' === (string) $mail_sent ? esc_html__( 'Sent', 'gambol-builder' ) : esc_html__( 'Not sent', 'gambol-builder' ) ) . '</td></tr>';
		echo '</tbody></table>';
	}

	// =============================================
	// BLOCK LOOKUP
	// =============================================

	/**
	 * Get all gambol form/subscribe blocks in a post, in document order.
	 * Recurses into inner blocks and reusable (core/block) references.
	 *
	 * @param int $post_id Post ID.
	 * @return array[] List of parsed blocks.
	 */
	public static function get_post_forms( $post_id ) {
		$post_id = (int) $post_id;
		if ( isset( self::$forms_cache[ $post_id ] ) ) {
			return self::$forms_cache[ $post_id ];
		}

		$forms = array();
		$post  = get_post( $post_id );
		if ( $post && has_blocks( $post->post_content ) ) {
			self::collect_forms( parse_blocks( $post->post_content ), $forms, 0, array( $post_id ) );
		}

		self::$forms_cache[ $post_id ] = $forms;
		return $forms;
	}

	/**
	 * Recursively collect form blocks.
	 *
	 * @param array $blocks  Parsed blocks.
	 * @param array $forms   Collected forms (by reference).
	 * @param int   $depth   Recursion depth.
	 * @param int[] $visited Visited reusable block IDs (loop guard).
	 * @return void
	 */
	private static function collect_forms( $blocks, &$forms, $depth, $visited ) {
		if ( $depth > 20 ) {
			return;
		}

		foreach ( $blocks as $block ) {
			$name = isset( $block['blockName'] ) ? $block['blockName'] : '';

			if ( in_array( $name, self::$block_names, true ) ) {
				$forms[] = $block;
			}

			if ( 'core/block' === $name && ! empty( $block['attrs']['ref'] ) ) {
				$ref = (int) $block['attrs']['ref'];
				if ( ! in_array( $ref, $visited, true ) ) {
					$reusable = get_post( $ref );
					if ( $reusable && 'wp_block' === $reusable->post_type && 'publish' === $reusable->post_status ) {
						self::collect_forms( parse_blocks( $reusable->post_content ), $forms, $depth + 1, array_merge( $visited, array( $ref ) ) );
					}
				}
			}

			if ( ! empty( $block['innerBlocks'] ) ) {
				self::collect_forms( $block['innerBlocks'], $forms, $depth + 1, $visited );
			}
		}
	}

	/**
	 * Get block attributes merged with defaults.
	 *
	 * @param array $block Parsed block.
	 * @return array
	 */
	private static function get_attrs( $block ) {
		$attrs = isset( $block['attrs'] ) && is_array( $block['attrs'] ) ? $block['attrs'] : array();
		return array_merge( self::$defaults[ $block['blockName'] ], $attrs );
	}

	/**
	 * Field schema a given block actually renders.
	 *
	 * @param array $block Parsed block.
	 * @return array field => array( type, required )
	 */
	private static function get_field_schema( $block ) {
		$attrs  = self::get_attrs( $block );
		$schema = array();

		if ( 'gambol/subscribe' === $block['blockName'] ) {
			if ( ! empty( $attrs['showName'] ) ) {
				$schema['name'] = array( 'type' => 'text', 'required' => false );
			}
			$schema['email'] = array( 'type' => 'email', 'required' => true );
			return $schema;
		}

		if ( ! empty( $attrs['showName'] ) ) {
			$schema['name'] = array( 'type' => 'text', 'required' => true );
		}
		if ( ! empty( $attrs['showEmail'] ) ) {
			$schema['email'] = array( 'type' => 'email', 'required' => true );
		}
		if ( ! empty( $attrs['showPhone'] ) ) {
			$schema['phone'] = array( 'type' => 'tel', 'required' => false );
		}
		if ( ! empty( $attrs['showSubject'] ) ) {
			$schema['subject'] = array( 'type' => 'text', 'required' => true );
		}
		if ( ! empty( $attrs['showMessage'] ) ) {
			$schema['message'] = array( 'type' => 'textarea', 'required' => true );
		}

		return $schema;
	}

	/**
	 * Human readable label for a field key.
	 *
	 * @param string $key Field key.
	 * @return string
	 */
	private static function field_label( $key ) {
		$labels = array(
			'name'    => __( 'Name', 'gambol-builder' ),
			'email'   => __( 'Email', 'gambol-builder' ),
			'phone'   => __( 'Phone', 'gambol-builder' ),
			'subject' => __( 'Subject', 'gambol-builder' ),
			'message' => __( 'Message', 'gambol-builder' ),
		);
		return isset( $labels[ $key ] ) ? $labels[ $key ] : ucfirst( (string) $key );
	}

	// =============================================
	// TOKENS
	// =============================================

	/**
	 * Signed token identifying a form on a post (for logged-out visitors,
	 * whose pages may be cached longer than a nonce lives).
	 *
	 * @param int $post_id    Post ID.
	 * @param int $form_index Form index.
	 * @return string
	 */
	public static function get_token( $post_id, $form_index ) {
		return hash_hmac( 'sha256', 'gambol-form|' . (int) $post_id . '|' . (int) $form_index, wp_salt( 'nonce' ) );
	}

	// =============================================
	// FRONTEND DATA
	// =============================================

	/**
	 * Attach window.gambolForms to the frontend script.
	 *
	 * @return void
	 */
	public static function localize_frontend() {
		if ( ! is_singular() || ! wp_script_is( 'gambol-builder-frontend', 'enqueued' ) ) {
			return;
		}

		$post_id = (int) get_queried_object_id();
		$post    = get_post( $post_id );
		if ( ! $post ) {
			return;
		}

		$has_form = has_block( 'gambol/form', $post ) || has_block( 'gambol/subscribe', $post );
		$forms    = self::get_post_forms( $post_id );
		if ( ! $has_form && empty( $forms ) ) {
			return;
		}

		$entries = array();
		foreach ( $forms as $index => $block ) {
			$entries[] = array(
				'index' => $index,
				'type'  => 'gambol/subscribe' === $block['blockName'] ? 'subscribe' : 'form',
				'token' => self::get_token( $post_id, $index ),
			);
		}

		$data = array(
			'restUrl' => esc_url_raw( rest_url( self::REST_NAMESPACE . self::REST_ROUTE ) ),
			'nonce'   => is_user_logged_in() ? wp_create_nonce( 'wp_rest' ) : '',
			'postId'  => $post_id,
			'forms'   => $entries,
			'i18n'    => array(
				'sending'      => __( 'Sending…', 'gambol-builder' ),
				'error'        => __( 'Something went wrong. Please try again.', 'gambol-builder' ),
				'network'      => __( 'Could not reach the server. Please check your connection and try again.', 'gambol-builder' ),
				'unavailable'  => __( 'This form cannot be submitted right now.', 'gambol-builder' ),
				'fixErrors'    => __( 'Please correct the highlighted fields.', 'gambol-builder' ),
				'honeypot'     => __( 'Leave this field empty', 'gambol-builder' ),
			),
		);

		wp_add_inline_script(
			'gambol-builder-frontend',
			'window.gambolForms = ' . wp_json_encode( $data ) . ';',
			'before'
		);
	}

	// =============================================
	// REST
	// =============================================

	/**
	 * Register REST route.
	 *
	 * @return void
	 */
	public static function register_routes() {
		register_rest_route(
			self::REST_NAMESPACE,
			self::REST_ROUTE,
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'handle_submit' ),
				// Public endpoint: authorization is enforced in handle_submit()
				// (published post, signed token / nonce, honeypot, timing, rate limit).
				'permission_callback' => '__return_true',
				'args'                => array(
					'post_id'    => array(
						'type'     => 'integer',
						'required' => true,
						'minimum'  => 1,
					),
					'form_index' => array(
						'type'     => 'integer',
						'required' => true,
						'minimum'  => 0,
					),
					'fields'     => array(
						'type'     => 'object',
						'required' => true,
					),
					'token'      => array(
						'type'    => 'string',
						'default' => '',
					),
					'hp'         => array(
						'type'    => 'string',
						'default' => '',
					),
					'timestamp'  => array(
						'type'    => 'integer',
						'default' => 0,
					),
					'elapsed'    => array(
						'type'    => 'integer',
						'default' => 0,
					),
				),
			)
		);
	}

	/**
	 * Build an error response.
	 *
	 * @param string $message Message.
	 * @param int    $status  HTTP status.
	 * @param array  $errors  Per-field errors.
	 * @return \WP_REST_Response
	 */
	private static function error( $message, $status, $errors = array() ) {
		return new \WP_REST_Response(
			array(
				'success' => false,
				'message' => $message,
				'errors'  => (object) $errors,
			),
			$status
		);
	}

	/**
	 * Handle a form submission.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response
	 */
	public static function handle_submit( \WP_REST_Request $request ) {
		$generic    = __( 'This form could not be submitted. Please reload the page and try again.', 'gambol-builder' );
		$post_id    = (int) $request->get_param( 'post_id' );
		$form_index = (int) $request->get_param( 'form_index' );

		// 1. Post must exist, be published, publicly viewable and not password protected.
		$post = get_post( $post_id );
		if (
			! $post
			|| 'publish' !== $post->post_status
			|| ! is_post_publicly_viewable( $post )
			|| post_password_required( $post )
			|| '' !== $post->post_password
		) {
			return self::error( $generic, 404 );
		}

		// 2. Form block must exist at that index.
		$forms = self::get_post_forms( $post_id );
		if ( ! isset( $forms[ $form_index ] ) ) {
			return self::error( $generic, 404 );
		}
		$block = $forms[ $form_index ];
		$attrs = self::get_attrs( $block );

		// 3. Signed token (logged-out) or valid REST nonce (logged-in).
		$token     = (string) $request->get_param( 'token' );
		$valid_tok = '' !== $token && hash_equals( self::get_token( $post_id, $form_index ), $token );
		$nonce     = (string) $request->get_header( 'X-WP-Nonce' );
		$valid_nc  = is_user_logged_in() && '' !== $nonce && false !== wp_verify_nonce( $nonce, 'wp_rest' );
		if ( ! $valid_tok && ! $valid_nc ) {
			return self::error( $generic, 403 );
		}

		// 4. Honeypot must be empty.
		if ( '' !== trim( (string) $request->get_param( 'hp' ) ) ) {
			return self::error( $generic, 400 );
		}

		// 5. Minimum fill time.
		$timestamp = (int) $request->get_param( 'timestamp' );
		$elapsed   = (int) $request->get_param( 'elapsed' );
		if ( $timestamp <= 0 || $elapsed < self::MIN_FILL_SECONDS * 1000 ) {
			return self::error( __( 'That was quick! Please wait a moment and submit again.', 'gambol-builder' ), 400 );
		}

		// 6. Rate limit per hashed IP.
		$rate_key = self::rate_limit_key();
		$hits     = (int) get_transient( $rate_key );
		if ( $hits >= self::RATE_LIMIT ) {
			return self::error( __( 'Too many submissions. Please try again in a few minutes.', 'gambol-builder' ), 429 );
		}

		// 7. Sanitize + validate only the fields this block renders.
		$raw    = $request->get_param( 'fields' );
		$raw    = is_array( $raw ) ? $raw : array();
		$schema = self::get_field_schema( $block );
		$data   = array();
		$errors = array();

		foreach ( $schema as $key => $rule ) {
			$value = isset( $raw[ $key ] ) && is_scalar( $raw[ $key ] ) ? (string) $raw[ $key ] : '';
			$label = self::field_label( $key );

			switch ( $rule['type'] ) {
				case 'email':
					// Something was typed but it is not an address: say so,
					// rather than calling the field empty.
					if ( '' !== trim( $value ) && ! is_email( sanitize_email( $value ) ) ) {
						$errors[ $key ] = __( 'Please enter a valid email address.', 'gambol-builder' );
						$data[ $key ]   = '';
						continue 2;
					}
					$value = sanitize_email( $value );
					break;
				case 'textarea':
					$value = sanitize_textarea_field( $value );
					break;
				default:
					$value = sanitize_text_field( $value );
			}
			$value = trim( $value );

			$max = 'textarea' === $rule['type'] ? 5000 : 200;

			if ( '' === $value ) {
				if ( $rule['required'] ) {
					/* translators: %s: field label */
					$errors[ $key ] = sprintf( __( '%s is required.', 'gambol-builder' ), $label );
				}
			} elseif ( 'email' === $rule['type'] && ! is_email( $value ) ) {
				$errors[ $key ] = __( 'Please enter a valid email address.', 'gambol-builder' );
			} elseif ( 'tel' === $rule['type'] && ! preg_match( '/^[0-9 +().\-\/]{5,30}$/', $value ) ) {
				$errors[ $key ] = __( 'Please enter a valid phone number.', 'gambol-builder' );
			} elseif ( function_exists( 'mb_strlen' ) ? mb_strlen( $value ) > $max : strlen( $value ) > $max ) {
				/* translators: 1: field label, 2: max characters */
				$errors[ $key ] = sprintf( __( '%1$s must be %2$d characters or fewer.', 'gambol-builder' ), $label, $max );
			}

			$data[ $key ] = $value;
		}

		if ( $errors ) {
			return self::error( __( 'Please correct the highlighted fields.', 'gambol-builder' ), 422, $errors );
		}

		// Count this submission against the rate limit.
		set_transient( $rate_key, $hits + 1, self::RATE_WINDOW );

		$is_subscribe = 'gambol/subscribe' === $block['blockName'];
		$entry_id     = self::store_entry( $post, $form_index, $is_subscribe ? 'subscribe' : 'form', $data, $attrs );
		if ( ! $entry_id ) {
			return self::error( __( 'Your submission could not be saved. Please try again later.', 'gambol-builder' ), 500 );
		}

		// Integrations for subscribe forms (Mailchimp etc.). Return WP_Error to report failure.
		if ( $is_subscribe ) {
			/**
			 * Filter a subscribe submission for third-party integrations.
			 *
			 * @param true|\WP_Error $result   Result; return WP_Error to fail.
			 * @param array          $data     Sanitized fields (email, maybe name).
			 * @param int            $entry_id Stored entry ID.
			 * @param array          $attrs    Block attributes.
			 * @param \WP_Post       $post     Source post.
			 */
			$result = apply_filters( 'gambol_forms_subscribe', true, $data, $entry_id, $attrs, $post );
			if ( is_wp_error( $result ) ) {
				return self::error( $result->get_error_message(), 502 );
			}
		}

		$sent = self::send_notification( $post, $data, $attrs, $is_subscribe );
		update_post_meta( $entry_id, '_gambol_mail_sent', $sent ? '1' : '0' );

		/**
		 * Fires after a form submission is stored.
		 *
		 * @param int   $entry_id Entry post ID.
		 * @param array $context  { fields, post_id, form_index, form_type, attributes }.
		 */
		do_action(
			'gambol_form_submitted',
			$entry_id,
			array(
				'fields'     => $data,
				'post_id'    => $post_id,
				'form_index' => $form_index,
				'form_type'  => $is_subscribe ? 'subscribe' : 'form',
				'attributes' => $attrs,
			)
		);

		$message = isset( $attrs['successMessage'] ) && is_string( $attrs['successMessage'] ) && '' !== trim( $attrs['successMessage'] )
			? sanitize_text_field( $attrs['successMessage'] )
			: ( $is_subscribe ? __( 'Thank you for subscribing!', 'gambol-builder' ) : __( 'Thank you for your message!', 'gambol-builder' ) );

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => $message,
			),
			200
		);
	}

	/**
	 * Transient key for the client's hashed IP.
	 *
	 * @return string
	 */
	private static function rate_limit_key() {
		return 'gambol_form_rl_' . md5( self::client_ip_hash() );
	}

	/**
	 * Hash of the client IP (REMOTE_ADDR only; proxies can filter it).
	 *
	 * @return string
	 */
	private static function client_ip_hash() {
		$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		/**
		 * Filter the client IP used for rate limiting (e.g. behind a trusted proxy).
		 *
		 * @param string $ip Client IP.
		 */
		$ip = (string) apply_filters( 'gambol_forms_client_ip', $ip );
		return hash_hmac( 'sha256', $ip, wp_salt( 'auth' ) );
	}

	/**
	 * Store the entry as a private CPT post with data in meta.
	 *
	 * @param \WP_Post $post       Source post.
	 * @param int      $form_index Form index.
	 * @param string   $type       form|subscribe.
	 * @param array    $data       Sanitized fields.
	 * @param array    $attrs      Block attributes.
	 * @return int Entry ID or 0.
	 */
	private static function store_entry( $post, $form_index, $type, $data, $attrs ) {
		$who   = ! empty( $data['name'] ) ? $data['name'] : ( ! empty( $data['email'] ) ? $data['email'] : __( 'Anonymous', 'gambol-builder' ) );
		$title = sprintf(
			/* translators: 1: submitter, 2: page title */
			__( '%1$s — %2$s', 'gambol-builder' ),
			$who,
			wp_strip_all_tags( get_the_title( $post ) )
		);

		$entry_id = wp_insert_post(
			array(
				'post_type'    => self::POST_TYPE,
				'post_status'  => 'private',
				'post_title'   => $title,
				'post_content' => '',
				'post_author'  => 0,
			),
			true
		);

		if ( is_wp_error( $entry_id ) || ! $entry_id ) {
			return 0;
		}

		update_post_meta( $entry_id, '_gambol_fields', $data );
		update_post_meta( $entry_id, '_gambol_email', isset( $data['email'] ) ? $data['email'] : '' );
		update_post_meta( $entry_id, '_gambol_name', isset( $data['name'] ) ? $data['name'] : '' );
		update_post_meta( $entry_id, '_gambol_source_post_id', (int) $post->ID );
		update_post_meta( $entry_id, '_gambol_form_index', (int) $form_index );
		update_post_meta( $entry_id, '_gambol_form_type', $type );
		if ( 'form' === $type && ! empty( $attrs['formType'] ) ) {
			update_post_meta( $entry_id, '_gambol_form_subtype', sanitize_key( $attrs['formType'] ) );
		}
		update_post_meta( $entry_id, '_gambol_ip_hash', self::client_ip_hash() );

		return (int) $entry_id;
	}

	/**
	 * Resolve recipients: block emailTo (comma separated, each validated) or admin email.
	 *
	 * @param array $attrs Block attributes.
	 * @return string[]
	 */
	private static function get_recipients( $attrs ) {
		$recipients = array();
		if ( ! empty( $attrs['emailTo'] ) && is_string( $attrs['emailTo'] ) ) {
			foreach ( explode( ',', $attrs['emailTo'] ) as $candidate ) {
				$candidate = sanitize_email( trim( $candidate ) );
				if ( $candidate && is_email( $candidate ) ) {
					$recipients[] = $candidate;
				}
			}
		}
		if ( empty( $recipients ) ) {
			$recipients[] = get_option( 'admin_email' );
		}
		return $recipients;
	}

	/**
	 * Send the plain-text notification email.
	 *
	 * @param \WP_Post $post         Source post.
	 * @param array    $data         Sanitized fields.
	 * @param array    $attrs        Block attributes.
	 * @param bool     $is_subscribe Subscribe form.
	 * @return bool
	 */
	private static function send_notification( $post, $data, $attrs, $is_subscribe ) {
		/**
		 * Whether to email a notification for this submission.
		 *
		 * @param bool  $send  Send.
		 * @param array $data  Fields.
		 * @param array $attrs Block attributes.
		 */
		if ( ! apply_filters( 'gambol_forms_send_email', true, $data, $attrs ) ) {
			return false;
		}

		$site       = wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES );
		$page_title = wp_specialchars_decode( wp_strip_all_tags( get_the_title( $post ) ), ENT_QUOTES );
		$recipients = $is_subscribe ? array( get_option( 'admin_email' ) ) : self::get_recipients( $attrs );

		$subject = $is_subscribe
			/* translators: 1: site name, 2: page title */
			? sprintf( __( '[%1$s] New subscriber from %2$s', 'gambol-builder' ), $site, $page_title )
			/* translators: 1: site name, 2: page title */
			: sprintf( __( '[%1$s] New message from %2$s', 'gambol-builder' ), $site, $page_title );
		$subject = str_replace( array( "\r", "\n" ), ' ', $subject );

		$lines = array();
		foreach ( $data as $key => $value ) {
			if ( 'message' === $key ) {
				continue;
			}
			$lines[] = self::field_label( $key ) . ': ' . $value;
		}
		if ( isset( $data['message'] ) ) {
			$lines[] = '';
			$lines[] = self::field_label( 'message' ) . ':';
			$lines[] = $data['message'];
		}
		$lines[] = '';
		$lines[] = '--';
		/* translators: %s: page URL */
		$lines[] = sprintf( __( 'Sent from: %s', 'gambol-builder' ), get_permalink( $post ) );

		$headers = array( 'Content-Type: text/plain; charset=UTF-8' );
		if ( ! empty( $data['email'] ) && is_email( $data['email'] ) ) {
			$name = isset( $data['name'] ) ? trim( str_replace( array( '"', '<', '>', ',', ';', "\r", "\n" ), '', $data['name'] ) ) : '';
			$headers[] = 'Reply-To: ' . ( '' !== $name ? '"' . $name . '" <' . $data['email'] . '>' : $data['email'] );
		}

		return (bool) wp_mail( $recipients, $subject, implode( "\n", $lines ), $headers );
	}
}

// Initialize.
Forms::init();
