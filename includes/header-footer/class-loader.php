<?php
/**
 * Header Footer Builder Module Loader.
 *
 * Main entry point for the Header & Footer Builder feature.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\HeaderFooter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Include required files.
require_once __DIR__ . '/class-post-type.php';
require_once __DIR__ . '/class-meta-boxes.php';
require_once __DIR__ . '/class-page-settings.php';
require_once __DIR__ . '/class-renderer.php';

/**
 * Class Loader
 *
 * Initializes all Header Footer Builder components.
 */
class Loader {

	/**
	 * Singleton instance.
	 *
	 * @var Loader|null
	 */
	private static $instance = null;

	/**
	 * Component instances.
	 *
	 * @var array
	 */
	private $components = array();

	/**
	 * Get singleton instance.
	 *
	 * @return Loader
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
	 * Initialize components.
	 *
	 * @return void
	 */
	private function init() {
		// Initialize post type.
		$this->components['post_type'] = Post_Type::get_instance();

		// Initialize meta boxes (admin only).
		if ( is_admin() ) {
			$this->components['meta_boxes']    = Meta_Boxes::get_instance();
			$this->components['page_settings'] = Page_Settings::get_instance();
		}

		// Initialize renderer (frontend only).
		if ( ! is_admin() || wp_doing_ajax() ) {
			$this->components['renderer'] = Renderer::get_instance();
		}

		// Add hooks.
		add_action( 'admin_menu', array( $this, 'add_submenu' ) );
		add_filter( 'plugin_action_links_' . plugin_basename( GAMBOL_BUILDER_PATH . 'gambol-builder.php' ), array( $this, 'add_plugin_links' ) );
	}

	/**
	 * Add submenu page under main menu.
	 *
	 * @return void
	 */
	public function add_submenu() {
		add_submenu_page(
			'gambol-builder',
			__( 'Theme Builder Settings', 'gambol-builder' ),
			__( 'TB Settings', 'gambol-builder' ),
			'manage_options',
			'gambol-hf-settings',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Render settings page.
	 *
	 * @return void
	 */
	public function render_settings_page() {
		// Handle form submission.
		if ( isset( $_POST['gambol_hf_settings_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['gambol_hf_settings_nonce'] ) ), 'gambol_hf_settings' ) ) {
			$this->save_settings();
		}

		$settings = $this->get_settings();
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Theme Builder Settings', 'gambol-builder' ); ?></h1>

			<form method="post" action="">
				<?php wp_nonce_field( 'gambol_hf_settings', 'gambol_hf_settings_nonce' ); ?>

				<table class="form-table" role="presentation">
					<tbody>
						<tr>
							<th scope="row">
								<label for="gambol_hf_disable_theme_header">
									<?php esc_html_e( 'Theme Header', 'gambol-builder' ); ?>
								</label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="gambol_hf_disable_theme_header" id="gambol_hf_disable_theme_header" value="1" <?php checked( $settings['disable_theme_header'], true ); ?> />
									<?php esc_html_e( 'Disable theme header when using Gambol header', 'gambol-builder' ); ?>
								</label>
								<p class="description">
									<?php esc_html_e( 'This adds a filter to disable get_header() output. May not work with all themes.', 'gambol-builder' ); ?>
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="gambol_hf_disable_theme_footer">
									<?php esc_html_e( 'Theme Footer', 'gambol-builder' ); ?>
								</label>
							</th>
							<td>
								<label>
									<input type="checkbox" name="gambol_hf_disable_theme_footer" id="gambol_hf_disable_theme_footer" value="1" <?php checked( $settings['disable_theme_footer'], true ); ?> />
									<?php esc_html_e( 'Disable theme footer when using Gambol footer', 'gambol-builder' ); ?>
								</label>
								<p class="description">
									<?php esc_html_e( 'This adds a filter to disable get_footer() output. May not work with all themes.', 'gambol-builder' ); ?>
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="gambol_hf_sticky_breakpoint">
									<?php esc_html_e( 'Mobile Breakpoint', 'gambol-builder' ); ?>
								</label>
							</th>
							<td>
								<input type="number" name="gambol_hf_sticky_breakpoint" id="gambol_hf_sticky_breakpoint" value="<?php echo esc_attr( $settings['mobile_breakpoint'] ); ?>" class="small-text" min="320" max="1200" step="1" /> px
								<p class="description">
									<?php esc_html_e( 'Screen width below which "mobile" visibility rules apply.', 'gambol-builder' ); ?>
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="gambol_hf_tablet_breakpoint">
									<?php esc_html_e( 'Tablet Breakpoint', 'gambol-builder' ); ?>
								</label>
							</th>
							<td>
								<input type="number" name="gambol_hf_tablet_breakpoint" id="gambol_hf_tablet_breakpoint" value="<?php echo esc_attr( $settings['tablet_breakpoint'] ); ?>" class="small-text" min="480" max="1440" step="1" /> px
								<p class="description">
									<?php esc_html_e( 'Screen width below which "tablet" visibility rules apply.', 'gambol-builder' ); ?>
								</p>
							</td>
						</tr>
					</tbody>
				</table>

				<?php submit_button( __( 'Save Settings', 'gambol-builder' ) ); ?>
			</form>

			<hr />

			<h2><?php esc_html_e( 'Theme Integration', 'gambol-builder' ); ?></h2>
			<p><?php esc_html_e( 'For best results, your theme should support the wp_body_open hook. If your theme doesn\'t support it, add this code to your theme\'s header.php after the opening <body> tag:', 'gambol-builder' ); ?></p>
			<pre style="background: #f5f5f5; padding: 15px; border: 1px solid #ddd;">&lt;?php do_action( 'wp_body_open' ); ?&gt;</pre>

			<h3><?php esc_html_e( 'Template Functions', 'gambol-builder' ); ?></h3>
			<p><?php esc_html_e( 'You can also manually render headers/footers in your theme using:', 'gambol-builder' ); ?></p>
			<pre style="background: #f5f5f5; padding: 15px; border: 1px solid #ddd;">// Check if custom header exists
if ( function_exists( 'gambol_has_header' ) && gambol_has_header() ) {
    gambol_render_header();
}

// Check if custom footer exists
if ( function_exists( 'gambol_has_footer' ) && gambol_has_footer() ) {
    gambol_render_footer();
}</pre>
		</div>
		<?php
	}

	/**
	 * Get settings.
	 *
	 * @return array Settings array.
	 */
	public function get_settings() {
		$defaults = array(
			'disable_theme_header' => false,
			'disable_theme_footer' => false,
			'mobile_breakpoint'    => 768,
			'tablet_breakpoint'    => 1024,
		);

		$saved = get_option( 'gambol_hf_settings', array() );

		return wp_parse_args( $saved, $defaults );
	}

	/**
	 * Save settings.
	 *
	 * @return void
	 */
	private function save_settings() {
		$settings = array(
			'disable_theme_header' => isset( $_POST['gambol_hf_disable_theme_header'] ),
			'disable_theme_footer' => isset( $_POST['gambol_hf_disable_theme_footer'] ),
			'mobile_breakpoint'    => isset( $_POST['gambol_hf_sticky_breakpoint'] ) ? absint( $_POST['gambol_hf_sticky_breakpoint'] ) : 768,
			'tablet_breakpoint'    => isset( $_POST['gambol_hf_tablet_breakpoint'] ) ? absint( $_POST['gambol_hf_tablet_breakpoint'] ) : 1024,
		);

		update_option( 'gambol_hf_settings', $settings );

		add_settings_error(
			'gambol_hf_settings',
			'settings_updated',
			__( 'Settings saved.', 'gambol-builder' ),
			'updated'
		);
		settings_errors( 'gambol_hf_settings' );
	}

	/**
	 * Add plugin action links.
	 *
	 * @param array $links Existing links.
	 * @return array Modified links.
	 */
	public function add_plugin_links( $links ) {
		$custom_links = array(
			'<a href="' . admin_url( 'edit.php?post_type=' . Post_Type::POST_TYPE ) . '">' . __( 'Theme Builder', 'gambol-builder' ) . '</a>',
		);

		return array_merge( $custom_links, $links );
	}

	/**
	 * Get component.
	 *
	 * @param string $name Component name.
	 * @return object|null Component instance or null.
	 */
	public function get_component( $name ) {
		return isset( $this->components[ $name ] ) ? $this->components[ $name ] : null;
	}
}

/**
 * Initialize the Header Footer Builder.
 *
 * @return Loader
 */
function gambol_header_footer() {
	return Loader::get_instance();
}

// Initialize on plugins_loaded.
add_action( 'plugins_loaded', __NAMESPACE__ . '\gambol_header_footer', 15 );
