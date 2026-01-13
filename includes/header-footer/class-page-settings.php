<?php
/**
 * Page/Post Assignment Meta Box.
 *
 * Allows overriding global header/footer on individual pages/posts.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\HeaderFooter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Page_Settings
 *
 * Manages per-page header/footer assignment.
 */
class Page_Settings {

	/**
	 * Singleton instance.
	 *
	 * @var Page_Settings|null
	 */
	private static $instance = null;

	/**
	 * Post types that support page settings.
	 *
	 * @var array
	 */
	private $supported_post_types = array( 'page', 'post' );

	/**
	 * Get singleton instance.
	 *
	 * @return Page_Settings
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
		add_action( 'add_meta_boxes', array( $this, 'register_meta_box' ) );
		add_action( 'save_post', array( $this, 'save_meta' ), 10, 2 );

		// Allow filtering supported post types.
		$this->supported_post_types = apply_filters( 'gambol_hf_supported_post_types', $this->supported_post_types );
	}

	/**
	 * Register meta box.
	 *
	 * @return void
	 */
	public function register_meta_box() {
		foreach ( $this->supported_post_types as $post_type ) {
			add_meta_box(
				'gambol_page_hf_settings',
				__( 'Header & Footer', 'gambol-builder' ),
				array( $this, 'render_meta_box' ),
				$post_type,
				'side',
				'low'
			);
		}
	}

	/**
	 * Render meta box.
	 *
	 * @param \WP_Post $post Post object.
	 * @return void
	 */
	public function render_meta_box( $post ) {
		wp_nonce_field( 'gambol_page_hf_meta', 'gambol_page_hf_nonce' );

		$override_header = get_post_meta( $post->ID, '_gambol_override_header', true );
		$override_footer = get_post_meta( $post->ID, '_gambol_override_footer', true );
		$custom_header   = get_post_meta( $post->ID, '_gambol_custom_header', true );
		$custom_footer   = get_post_meta( $post->ID, '_gambol_custom_footer', true );
		$disable_header  = get_post_meta( $post->ID, '_gambol_disable_header', true );
		$disable_footer  = get_post_meta( $post->ID, '_gambol_disable_footer', true );

		// Get available headers and footers.
		$headers = $this->get_templates( 'header' );
		$footers = $this->get_templates( 'footer' );
		?>
		<div class="gambol-page-hf-settings">
			<p class="description" style="margin-bottom: 12px;">
				<?php esc_html_e( 'Override the global header/footer for this page.', 'gambol-builder' ); ?>
			</p>

			<div class="gambol-page-hf-field" style="margin-bottom: 15px;">
				<label style="display: block; margin-bottom: 8px;">
					<strong><?php esc_html_e( 'Header', 'gambol-builder' ); ?></strong>
				</label>
				<label style="display: block; margin-bottom: 5px;">
					<input type="checkbox" name="gambol_disable_header" value="1" <?php checked( $disable_header, '1' ); ?> class="gambol-disable-toggle" data-target="header" />
					<?php esc_html_e( 'Disable Header', 'gambol-builder' ); ?>
				</label>
				<div class="gambol-header-select" style="<?php echo $disable_header ? 'display:none;' : ''; ?>">
					<label style="display: block; margin-bottom: 5px;">
						<input type="checkbox" name="gambol_override_header" value="1" <?php checked( $override_header, '1' ); ?> class="gambol-override-toggle" data-target="header" />
						<?php esc_html_e( 'Use Custom Header', 'gambol-builder' ); ?>
					</label>
					<select name="gambol_custom_header" class="widefat gambol-template-select" data-type="header" style="<?php echo ! $override_header ? 'display:none;' : ''; ?>">
						<option value=""><?php esc_html_e( '— Select Header —', 'gambol-builder' ); ?></option>
						<?php foreach ( $headers as $header ) : ?>
							<option value="<?php echo esc_attr( $header->ID ); ?>" <?php selected( $custom_header, $header->ID ); ?>>
								<?php echo esc_html( $header->post_title ); ?>
							</option>
						<?php endforeach; ?>
					</select>
				</div>
			</div>

			<div class="gambol-page-hf-field">
				<label style="display: block; margin-bottom: 8px;">
					<strong><?php esc_html_e( 'Footer', 'gambol-builder' ); ?></strong>
				</label>
				<label style="display: block; margin-bottom: 5px;">
					<input type="checkbox" name="gambol_disable_footer" value="1" <?php checked( $disable_footer, '1' ); ?> class="gambol-disable-toggle" data-target="footer" />
					<?php esc_html_e( 'Disable Footer', 'gambol-builder' ); ?>
				</label>
				<div class="gambol-footer-select" style="<?php echo $disable_footer ? 'display:none;' : ''; ?>">
					<label style="display: block; margin-bottom: 5px;">
						<input type="checkbox" name="gambol_override_footer" value="1" <?php checked( $override_footer, '1' ); ?> class="gambol-override-toggle" data-target="footer" />
						<?php esc_html_e( 'Use Custom Footer', 'gambol-builder' ); ?>
					</label>
					<select name="gambol_custom_footer" class="widefat gambol-template-select" data-type="footer" style="<?php echo ! $override_footer ? 'display:none;' : ''; ?>">
						<option value=""><?php esc_html_e( '— Select Footer —', 'gambol-builder' ); ?></option>
						<?php foreach ( $footers as $footer ) : ?>
							<option value="<?php echo esc_attr( $footer->ID ); ?>" <?php selected( $custom_footer, $footer->ID ); ?>>
								<?php echo esc_html( $footer->post_title ); ?>
							</option>
						<?php endforeach; ?>
					</select>
				</div>
			</div>
		</div>

		<script>
			(function() {
				// Disable toggles.
				document.querySelectorAll('.gambol-disable-toggle').forEach(function(checkbox) {
					checkbox.addEventListener('change', function() {
						var target = this.dataset.target;
						var selectWrapper = document.querySelector('.gambol-' + target + '-select');
						selectWrapper.style.display = this.checked ? 'none' : '';
					});
				});

				// Override toggles.
				document.querySelectorAll('.gambol-override-toggle').forEach(function(checkbox) {
					checkbox.addEventListener('change', function() {
						var target = this.dataset.target;
						var select = document.querySelector('.gambol-template-select[data-type="' + target + '"]');
						select.style.display = this.checked ? '' : 'none';
					});
				});
			})();
		</script>
		<?php
	}

	/**
	 * Get templates by type.
	 *
	 * @param string $type Template type (header/footer).
	 * @return array Array of template posts.
	 */
	private function get_templates( $type ) {
		return get_posts(
			array(
				'post_type'      => Post_Type::POST_TYPE,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'meta_query'     => array(
					array(
						'key'     => '_gambol_hf_type',
						'value'   => $type,
						'compare' => '=',
					),
				),
				'orderby'        => 'title',
				'order'          => 'ASC',
			)
		);
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
		if ( ! isset( $_POST['gambol_page_hf_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['gambol_page_hf_nonce'] ) ), 'gambol_page_hf_meta' ) ) {
			return;
		}

		// Check autosave.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Check post type.
		if ( ! in_array( $post->post_type, $this->supported_post_types, true ) ) {
			return;
		}

		// Check permissions.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		// Save checkboxes.
		$checkboxes = array(
			'gambol_override_header',
			'gambol_override_footer',
			'gambol_disable_header',
			'gambol_disable_footer',
		);

		foreach ( $checkboxes as $checkbox ) {
			$value = isset( $_POST[ $checkbox ] ) ? '1' : '0';
			update_post_meta( $post_id, '_' . $checkbox, $value );
		}

		// Save select fields.
		$selects = array( 'gambol_custom_header', 'gambol_custom_footer' );
		foreach ( $selects as $select ) {
			if ( isset( $_POST[ $select ] ) ) {
				$value = absint( wp_unslash( $_POST[ $select ] ) );
				update_post_meta( $post_id, '_' . $select, $value );
			}
		}
	}

	/**
	 * Get page-specific header.
	 *
	 * @param int $post_id Post ID.
	 * @return int|false|null Header ID, false if disabled, null if not overridden.
	 */
	public function get_page_header( $post_id ) {
		$disable = get_post_meta( $post_id, '_gambol_disable_header', true );
		if ( '1' === $disable ) {
			return false;
		}

		$override = get_post_meta( $post_id, '_gambol_override_header', true );
		if ( '1' === $override ) {
			$custom = get_post_meta( $post_id, '_gambol_custom_header', true );
			return $custom ? absint( $custom ) : null;
		}

		return null;
	}

	/**
	 * Get page-specific footer.
	 *
	 * @param int $post_id Post ID.
	 * @return int|false|null Footer ID, false if disabled, null if not overridden.
	 */
	public function get_page_footer( $post_id ) {
		$disable = get_post_meta( $post_id, '_gambol_disable_footer', true );
		if ( '1' === $disable ) {
			return false;
		}

		$override = get_post_meta( $post_id, '_gambol_override_footer', true );
		if ( '1' === $override ) {
			$custom = get_post_meta( $post_id, '_gambol_custom_footer', true );
			return $custom ? absint( $custom ) : null;
		}

		return null;
	}
}
