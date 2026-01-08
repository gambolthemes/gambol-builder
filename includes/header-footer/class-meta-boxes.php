<?php
/**
 * Header Footer Meta Boxes.
 *
 * Handles meta box registration and saving for header/footer settings.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\HeaderFooter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Meta_Boxes
 *
 * Manages meta boxes for header/footer configuration.
 */
class Meta_Boxes {

	/**
	 * Singleton instance.
	 *
	 * @var Meta_Boxes|null
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Meta_Boxes
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
		add_action( 'add_meta_boxes', array( $this, 'register_meta_boxes' ) );
		add_action( 'save_post_' . Post_Type::POST_TYPE, array( $this, 'save_meta' ), 10, 2 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	/**
	 * Register meta boxes.
	 *
	 * @return void
	 */
	public function register_meta_boxes() {
		add_meta_box(
			'gambol_hf_settings',
			__( 'Header/Footer Settings', 'gambol-builder' ),
			array( $this, 'render_settings_meta_box' ),
			Post_Type::POST_TYPE,
			'side',
			'high'
		);

		add_meta_box(
			'gambol_hf_display_rules',
			__( 'Display Rules', 'gambol-builder' ),
			array( $this, 'render_display_rules_meta_box' ),
			Post_Type::POST_TYPE,
			'side',
			'default'
		);
	}

	/**
	 * Render settings meta box.
	 *
	 * @param \WP_Post $post Post object.
	 * @return void
	 */
	public function render_settings_meta_box( $post ) {
		wp_nonce_field( 'gambol_hf_meta', 'gambol_hf_nonce' );

		$type          = get_post_meta( $post->ID, '_gambol_hf_type', true );
		$is_active     = get_post_meta( $post->ID, '_gambol_hf_active', true );
		$is_sticky     = get_post_meta( $post->ID, '_gambol_hf_sticky', true );
		$sticky_offset = get_post_meta( $post->ID, '_gambol_hf_sticky_offset', true );
		$visibility    = get_post_meta( $post->ID, '_gambol_hf_visibility', true );

		// Set defaults.
		$type       = $type ?: 'header';
		$is_active  = '' === $is_active ? '1' : $is_active;
		$visibility = $visibility ?: 'all';
		?>
		<div class="gambol-meta-field">
			<label for="gambol_hf_type">
				<strong><?php esc_html_e( 'Type', 'gambol-builder' ); ?></strong>
			</label>
			<select id="gambol_hf_type" name="gambol_hf_type" class="widefat">
				<option value="header" <?php selected( $type, 'header' ); ?>><?php esc_html_e( 'Header', 'gambol-builder' ); ?></option>
				<option value="footer" <?php selected( $type, 'footer' ); ?>><?php esc_html_e( 'Footer', 'gambol-builder' ); ?></option>
			</select>
		</div>

		<div class="gambol-meta-field">
			<label for="gambol_hf_active">
				<input type="checkbox" id="gambol_hf_active" name="gambol_hf_active" value="1" <?php checked( $is_active, '1' ); ?> />
				<strong><?php esc_html_e( 'Active', 'gambol-builder' ); ?></strong>
			</label>
			<p class="description"><?php esc_html_e( 'Enable this header/footer on the frontend.', 'gambol-builder' ); ?></p>
		</div>

		<div class="gambol-meta-field gambol-header-only" style="<?php echo 'header' !== $type ? 'display:none;' : ''; ?>">
			<label for="gambol_hf_sticky">
				<input type="checkbox" id="gambol_hf_sticky" name="gambol_hf_sticky" value="1" <?php checked( $is_sticky, '1' ); ?> />
				<strong><?php esc_html_e( 'Sticky Header', 'gambol-builder' ); ?></strong>
			</label>
			<p class="description"><?php esc_html_e( 'Make the header stick to the top on scroll.', 'gambol-builder' ); ?></p>
		</div>

		<div class="gambol-meta-field gambol-sticky-options" style="<?php echo ( 'header' !== $type || ! $is_sticky ) ? 'display:none;' : ''; ?>">
			<label for="gambol_hf_sticky_offset">
				<strong><?php esc_html_e( 'Sticky Offset (px)', 'gambol-builder' ); ?></strong>
			</label>
			<input type="number" id="gambol_hf_sticky_offset" name="gambol_hf_sticky_offset" value="<?php echo esc_attr( $sticky_offset ?: '0' ); ?>" class="widefat" min="0" step="1" />
			<p class="description"><?php esc_html_e( 'Scroll distance before header becomes sticky.', 'gambol-builder' ); ?></p>
		</div>

		<div class="gambol-meta-field">
			<label for="gambol_hf_visibility">
				<strong><?php esc_html_e( 'Device Visibility', 'gambol-builder' ); ?></strong>
			</label>
			<select id="gambol_hf_visibility" name="gambol_hf_visibility" class="widefat">
				<option value="all" <?php selected( $visibility, 'all' ); ?>><?php esc_html_e( 'All Devices', 'gambol-builder' ); ?></option>
				<option value="desktop" <?php selected( $visibility, 'desktop' ); ?>><?php esc_html_e( 'Desktop Only', 'gambol-builder' ); ?></option>
				<option value="tablet" <?php selected( $visibility, 'tablet' ); ?>><?php esc_html_e( 'Tablet Only', 'gambol-builder' ); ?></option>
				<option value="mobile" <?php selected( $visibility, 'mobile' ); ?>><?php esc_html_e( 'Mobile Only', 'gambol-builder' ); ?></option>
				<option value="desktop_tablet" <?php selected( $visibility, 'desktop_tablet' ); ?>><?php esc_html_e( 'Desktop & Tablet', 'gambol-builder' ); ?></option>
				<option value="tablet_mobile" <?php selected( $visibility, 'tablet_mobile' ); ?>><?php esc_html_e( 'Tablet & Mobile', 'gambol-builder' ); ?></option>
			</select>
		</div>

		<style>
			.gambol-meta-field { margin-bottom: 15px; }
			.gambol-meta-field:last-child { margin-bottom: 0; }
			.gambol-meta-field label { display: block; margin-bottom: 5px; }
			.gambol-meta-field .description { margin-top: 5px; font-style: italic; color: #666; }
		</style>

		<script>
			(function() {
				var typeSelect = document.getElementById('gambol_hf_type');
				var stickyCheck = document.getElementById('gambol_hf_sticky');
				var headerOnlyFields = document.querySelectorAll('.gambol-header-only');
				var stickyOptions = document.querySelectorAll('.gambol-sticky-options');

				function toggleHeaderFields() {
					var isHeader = typeSelect.value === 'header';
					headerOnlyFields.forEach(function(field) {
						field.style.display = isHeader ? '' : 'none';
					});
					toggleStickyOptions();
				}

				function toggleStickyOptions() {
					var show = typeSelect.value === 'header' && stickyCheck.checked;
					stickyOptions.forEach(function(field) {
						field.style.display = show ? '' : 'none';
					});
				}

				typeSelect.addEventListener('change', toggleHeaderFields);
				stickyCheck.addEventListener('change', toggleStickyOptions);
			})();
		</script>
		<?php
	}

	/**
	 * Render display rules meta box.
	 *
	 * @param \WP_Post $post Post object.
	 * @return void
	 */
	public function render_display_rules_meta_box( $post ) {
		$display_on      = get_post_meta( $post->ID, '_gambol_hf_display_on', true );
		$specific_ids    = get_post_meta( $post->ID, '_gambol_hf_specific_ids', true );
		$exclude_ids     = get_post_meta( $post->ID, '_gambol_hf_exclude_ids', true );
		$user_roles      = get_post_meta( $post->ID, '_gambol_hf_user_roles', true );

		$display_on   = $display_on ?: 'global';
		$specific_ids = $specific_ids ?: '';
		$exclude_ids  = $exclude_ids ?: '';
		$user_roles   = is_array( $user_roles ) ? $user_roles : array();

		$post_type_instance = Post_Type::get_instance();
		$locations = $post_type_instance->get_display_locations();
		?>
		<div class="gambol-meta-field">
			<label for="gambol_hf_display_on">
				<strong><?php esc_html_e( 'Display On', 'gambol-builder' ); ?></strong>
			</label>
			<select id="gambol_hf_display_on" name="gambol_hf_display_on" class="widefat">
				<?php foreach ( $locations as $value => $label ) : ?>
					<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $display_on, $value ); ?>><?php echo esc_html( $label ); ?></option>
				<?php endforeach; ?>
			</select>
		</div>

		<div class="gambol-meta-field gambol-specific-pages" style="<?php echo 'specific_pages' !== $display_on ? 'display:none;' : ''; ?>">
			<label for="gambol_hf_specific_ids">
				<strong><?php esc_html_e( 'Page/Post IDs', 'gambol-builder' ); ?></strong>
			</label>
			<input type="text" id="gambol_hf_specific_ids" name="gambol_hf_specific_ids" value="<?php echo esc_attr( $specific_ids ); ?>" class="widefat" placeholder="1, 2, 3" />
			<p class="description"><?php esc_html_e( 'Comma-separated list of page/post IDs.', 'gambol-builder' ); ?></p>
		</div>

		<div class="gambol-meta-field">
			<label for="gambol_hf_exclude_ids">
				<strong><?php esc_html_e( 'Exclude IDs', 'gambol-builder' ); ?></strong>
			</label>
			<input type="text" id="gambol_hf_exclude_ids" name="gambol_hf_exclude_ids" value="<?php echo esc_attr( $exclude_ids ); ?>" class="widefat" placeholder="4, 5, 6" />
			<p class="description"><?php esc_html_e( 'Comma-separated list of page/post IDs to exclude.', 'gambol-builder' ); ?></p>
		</div>

		<div class="gambol-meta-field">
			<label>
				<strong><?php esc_html_e( 'User Roles', 'gambol-builder' ); ?></strong>
			</label>
			<p class="description" style="margin-bottom: 8px;"><?php esc_html_e( 'Show only to specific user roles (leave unchecked for all).', 'gambol-builder' ); ?></p>
			<?php
			$roles = wp_roles()->get_names();
			foreach ( $roles as $role_key => $role_name ) :
				?>
				<label style="display: block; margin-bottom: 5px;">
					<input type="checkbox" name="gambol_hf_user_roles[]" value="<?php echo esc_attr( $role_key ); ?>" <?php checked( in_array( $role_key, $user_roles, true ) ); ?> />
					<?php echo esc_html( translate_user_role( $role_name ) ); ?>
				</label>
			<?php endforeach; ?>
		</div>

		<script>
			(function() {
				var displaySelect = document.getElementById('gambol_hf_display_on');
				var specificFields = document.querySelectorAll('.gambol-specific-pages');

				displaySelect.addEventListener('change', function() {
					var show = this.value === 'specific_pages';
					specificFields.forEach(function(field) {
						field.style.display = show ? '' : 'none';
					});
				});
			})();
		</script>
		<?php
	}

	/**
	 * Save meta data.
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    Post object.
	 * @return void
	 */
	public function save_meta( $post_id, $post ) {
		// Verify nonce.
		if ( ! isset( $_POST['gambol_hf_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['gambol_hf_nonce'] ) ), 'gambol_hf_meta' ) ) {
			return;
		}

		// Check autosave.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Check permissions.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		// Sanitize and save fields.
		$fields = array(
			'gambol_hf_type'          => 'sanitize_key',
			'gambol_hf_display_on'    => 'sanitize_key',
			'gambol_hf_specific_ids'  => 'sanitize_text_field',
			'gambol_hf_exclude_ids'   => 'sanitize_text_field',
			'gambol_hf_visibility'    => 'sanitize_key',
			'gambol_hf_sticky_offset' => 'absint',
		);

		foreach ( $fields as $field => $sanitize ) {
			if ( isset( $_POST[ $field ] ) ) {
				$value = call_user_func( $sanitize, wp_unslash( $_POST[ $field ] ) );
				update_post_meta( $post_id, '_' . $field, $value );
			}
		}

		// Handle checkboxes.
		$checkboxes = array( 'gambol_hf_active', 'gambol_hf_sticky' );
		foreach ( $checkboxes as $checkbox ) {
			$value = isset( $_POST[ $checkbox ] ) ? '1' : '0';
			update_post_meta( $post_id, '_' . $checkbox, $value );
		}

		// Handle user roles array.
		$user_roles = array();
		if ( isset( $_POST['gambol_hf_user_roles'] ) && is_array( $_POST['gambol_hf_user_roles'] ) ) {
			$user_roles = array_map( 'sanitize_key', wp_unslash( $_POST['gambol_hf_user_roles'] ) );
		}
		update_post_meta( $post_id, '_gambol_hf_user_roles', $user_roles );
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @param string $hook Current admin page.
	 * @return void
	 */
	public function enqueue_admin_assets( $hook ) {
		global $post_type;

		if ( Post_Type::POST_TYPE !== $post_type ) {
			return;
		}

		// Add inline styles for admin columns.
		$css = '
			.gambol-status {
				display: inline-block;
				padding: 3px 8px;
				border-radius: 3px;
				font-size: 12px;
				font-weight: 500;
			}
			.gambol-status--active {
				background: #d4edda;
				color: #155724;
			}
			.gambol-status--inactive {
				background: #f8d7da;
				color: #721c24;
			}
		';

		wp_add_inline_style( 'wp-admin', $css );
	}
}
