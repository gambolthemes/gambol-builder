<?php
/**
 * Performance Admin Page.
 *
 * Handles the admin settings interface for performance options.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Performance;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Admin_Page
 *
 * Manages the admin settings page for performance optimization.
 */
class Admin_Page {

	/**
	 * Singleton instance.
	 *
	 * @var Admin_Page|null
	 */
	private static $instance = null;

	/**
	 * Page hook suffix.
	 *
	 * @var string
	 */
	private $page_hook = '';

	/**
	 * Get singleton instance.
	 *
	 * @return Admin_Page
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
		add_action( 'admin_menu', array( $this, 'add_menu_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Add menu page.
	 *
	 * @return void
	 */
	public function add_menu_page() {
		$this->page_hook = add_submenu_page(
			'gambol-builder',
			__( 'Performance', 'gambol-builder' ),
			__( 'Performance', 'gambol-builder' ),
			'manage_options',
			'gambol-performance',
			array( $this, 'render_page' )
		);
	}

	/**
	 * Register settings.
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			'gambol_performance',
			Settings::OPTION_NAME,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( Settings::get_instance(), 'sanitize' ),
				'default'           => Settings::get_instance()->get_defaults(),
			)
		);
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @param string $hook Current admin page hook.
	 * @return void
	 */
	public function enqueue_assets( $hook ) {
		if ( $hook !== $this->page_hook ) {
			return;
		}

		wp_register_style( 'gambol-performance-admin', false, array(), GAMBOL_BUILDER_VERSION );
		wp_enqueue_style( 'gambol-performance-admin' );
		wp_add_inline_style( 'gambol-performance-admin', $this->get_inline_styles() );
	}

	/**
	 * Render admin page.
	 *
	 * @return void
	 */
	public function render_page() {
		$settings = Settings::get_instance();
		$options = $settings->get_all();

		// Handle reset action.
		if ( isset( $_POST['gambol_reset_performance'] ) && check_admin_referer( 'gambol_performance_reset' ) ) {
			$settings->reset();
			$options = $settings->get_all();
			echo '<div class="notice notice-success"><p>' . esc_html__( 'Settings reset to defaults.', 'gambol-builder' ) . '</p></div>';
		}
		?>
		<div class="wrap gambol-performance-settings">
			<h1><?php esc_html_e( 'Performance Optimization', 'gambol-builder' ); ?></h1>

			<form method="post" action="options.php">
				<?php settings_fields( 'gambol_performance' ); ?>

				<!-- CSS Optimization -->
				<div class="gambol-settings-section">
					<h2><?php esc_html_e( 'CSS Optimization', 'gambol-builder' ); ?></h2>

					<table class="form-table">
						<tr>
							<th scope="row">
								<label for="conditional_css"><?php esc_html_e( 'Conditional CSS Loading', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[conditional_css]" id="conditional_css" value="1" <?php checked( $options['conditional_css'] ); ?> />
									<?php esc_html_e( 'Load block CSS only when the block is used on the page', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Reduces CSS payload by only loading styles for blocks that are actually used.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="disable_unused_blocks"><?php esc_html_e( 'Disable Unused Block Assets', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[disable_unused_blocks]" id="disable_unused_blocks" value="1" <?php checked( $options['disable_unused_blocks'] ); ?> />
									<?php esc_html_e( 'Prevent loading of assets for blocks not used in content', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Scans page content and only enqueues necessary block assets.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="disable_editor_frontend"><?php esc_html_e( 'Remove Editor Styles on Frontend', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[disable_editor_frontend]" id="disable_editor_frontend" value="1" <?php checked( $options['disable_editor_frontend'] ); ?> />
									<?php esc_html_e( 'Remove editor-only styles from frontend pages', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Removes unnecessary editor styles that are not needed on the frontend.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
					</table>
				</div>

				<!-- Font Optimization -->
				<div class="gambol-settings-section">
					<h2><?php esc_html_e( 'Font Optimization', 'gambol-builder' ); ?></h2>

					<table class="form-table">
						<tr>
							<th scope="row">
								<label for="optimize_google_fonts"><?php esc_html_e( 'Optimize Google Fonts', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[optimize_google_fonts]" id="optimize_google_fonts" value="1" <?php checked( $options['optimize_google_fonts'] ); ?> />
									<?php esc_html_e( 'Combine and optimize Google Font requests', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Merges multiple Google Font requests into one and adds performance hints.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="font_display"><?php esc_html_e( 'Font Display Strategy', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<select name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[font_display]" id="font_display">
									<option value="auto" <?php selected( $options['font_display'], 'auto' ); ?>><?php esc_html_e( 'Auto', 'gambol-builder' ); ?></option>
									<option value="block" <?php selected( $options['font_display'], 'block' ); ?>><?php esc_html_e( 'Block', 'gambol-builder' ); ?></option>
									<option value="swap" <?php selected( $options['font_display'], 'swap' ); ?>><?php esc_html_e( 'Swap (Recommended)', 'gambol-builder' ); ?></option>
									<option value="fallback" <?php selected( $options['font_display'], 'fallback' ); ?>><?php esc_html_e( 'Fallback', 'gambol-builder' ); ?></option>
									<option value="optional" <?php selected( $options['font_display'], 'optional' ); ?>><?php esc_html_e( 'Optional', 'gambol-builder' ); ?></option>
								</select>
								<p class="description"><?php esc_html_e( 'Controls how fonts are displayed during loading. "Swap" prevents invisible text.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="preload_fonts"><?php esc_html_e( 'Preload Fonts', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[preload_fonts]" id="preload_fonts" value="1" <?php checked( $options['preload_fonts'] ); ?> />
									<?php esc_html_e( 'Add preload hints for critical fonts', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Tells the browser to load fonts earlier for faster rendering.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
					</table>
				</div>

				<!-- Image Optimization -->
				<div class="gambol-settings-section">
					<h2><?php esc_html_e( 'Image Optimization', 'gambol-builder' ); ?></h2>

					<table class="form-table">
						<tr>
							<th scope="row">
								<label for="lazy_load_images"><?php esc_html_e( 'Lazy Load Images', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[lazy_load_images]" id="lazy_load_images" value="1" <?php checked( $options['lazy_load_images'] ); ?> />
									<?php esc_html_e( 'Lazy load images inside Gambol blocks', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Defers loading of off-screen images until they are needed.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="lazy_load_threshold"><?php esc_html_e( 'Lazy Load Threshold', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<input type="text" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[lazy_load_threshold]" id="lazy_load_threshold" value="<?php echo esc_attr( $options['lazy_load_threshold'] ); ?>" class="small-text" />
								<p class="description"><?php esc_html_e( 'Distance from viewport at which to start loading images (e.g., 200px, 50%).', 'gambol-builder' ); ?></p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="add_image_dimensions"><?php esc_html_e( 'Add Image Dimensions', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[add_image_dimensions]" id="add_image_dimensions" value="1" <?php checked( $options['add_image_dimensions'] ); ?> />
									<?php esc_html_e( 'Ensure images have width and height attributes', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Prevents layout shifts (CLS) by reserving space for images.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
					</table>
				</div>

				<!-- Asset Optimization -->
				<div class="gambol-settings-section">
					<h2><?php esc_html_e( 'Asset Optimization', 'gambol-builder' ); ?></h2>

					<table class="form-table">
						<tr>
							<th scope="row">
								<label for="defer_block_scripts"><?php esc_html_e( 'Defer Block Scripts', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[defer_block_scripts]" id="defer_block_scripts" value="1" <?php checked( $options['defer_block_scripts'] ); ?> />
									<?php esc_html_e( 'Add defer attribute to block scripts', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Allows scripts to load without blocking page rendering.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="remove_block_library"><?php esc_html_e( 'Remove Block Library CSS', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[remove_block_library]" id="remove_block_library" value="1" <?php checked( $options['remove_block_library'] ); ?> />
									<?php esc_html_e( 'Remove WordPress core block library CSS', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Only enable if you are not using core Gutenberg blocks. May break some functionality.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="disable_emojis"><?php esc_html_e( 'Disable Emojis', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[disable_emojis]" id="disable_emojis" value="1" <?php checked( $options['disable_emojis'] ); ?> />
									<?php esc_html_e( 'Disable WordPress emoji scripts and styles', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Removes emoji conversion scripts. Native emojis still work.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="disable_embeds"><?php esc_html_e( 'Disable oEmbed', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[disable_embeds]" id="disable_embeds" value="1" <?php checked( $options['disable_embeds'] ); ?> />
									<?php esc_html_e( 'Disable WordPress oEmbed functionality', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Removes embed scripts. YouTube/Twitter embeds will still work via iframes.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
					</table>
				</div>

				<!-- Advanced -->
				<div class="gambol-settings-section">
					<h2><?php esc_html_e( 'Advanced', 'gambol-builder' ); ?></h2>

					<table class="form-table">
						<tr>
							<th scope="row">
								<label for="remove_jquery_migrate"><?php esc_html_e( 'Remove jQuery Migrate', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[remove_jquery_migrate]" id="remove_jquery_migrate" value="1" <?php checked( $options['remove_jquery_migrate'] ); ?> />
									<?php esc_html_e( 'Remove jQuery Migrate on frontend', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Removes legacy jQuery support. May break older plugins.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="disable_dashicons"><?php esc_html_e( 'Disable Dashicons', 'gambol-builder' ); ?></label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>[disable_dashicons]" id="disable_dashicons" value="1" <?php checked( $options['disable_dashicons'] ); ?> />
									<?php esc_html_e( 'Disable Dashicons for non-logged-in users', 'gambol-builder' ); ?>
								</label>
								<p class="description"><?php esc_html_e( 'Removes Dashicons CSS on frontend for visitors.', 'gambol-builder' ); ?></p>
							</td>
						</tr>
					</table>
				</div>

				<?php submit_button( __( 'Save Settings', 'gambol-builder' ) ); ?>
			</form>

			<form method="post" action="" style="margin-top: 20px;">
				<?php wp_nonce_field( 'gambol_performance_reset' ); ?>
				<input type="submit" name="gambol_reset_performance" class="button button-secondary" value="<?php esc_attr_e( 'Reset to Defaults', 'gambol-builder' ); ?>" onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to reset all settings to defaults?', 'gambol-builder' ); ?>');" />
			</form>
		</div>
		<?php
	}

	/**
	 * Get inline styles.
	 *
	 * @return string CSS styles.
	 */
	private function get_inline_styles() {
		return '
			.gambol-performance-settings { max-width: 900px; }
			.gambol-settings-section { background: #fff; border: 1px solid #ccd0d4; border-radius: 4px; padding: 20px; margin-bottom: 20px; }
			.gambol-settings-section h2 { margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid #eee; }
			.gambol-settings-section .form-table th { width: 250px; padding-left: 0; }
			.gambol-settings-section .form-table td { padding-left: 0; }
		';
	}
}
