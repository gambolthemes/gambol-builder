<?php
/**
 * Mega Menu Meta Box.
 *
 * Adds a "Mega Menu" panel to Appearance > Menus allowing editors
 * to attach a gambol_mega_menu post to any top-level menu item.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\MegaMenu;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Meta_Box
 */
class Meta_Box {

	/**
	 * Initialize.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'wp_nav_menu_item_custom_fields', array( __CLASS__, 'render_field' ), 10, 2 );
		add_action( 'wp_update_nav_menu_item',        array( __CLASS__, 'save_field' ),   10, 2 );
		add_action( 'admin_enqueue_scripts',          array( __CLASS__, 'enqueue_scripts' ) );
	}

	/**
	 * Render the mega menu select field inside a menu item.
	 *
	 * @param int    $item_id Menu item post ID.
	 * @param object $item    Menu item object.
	 * @return void
	 */
	public static function render_field( $item_id, $item ) {
		$panels = get_posts( array(
			'post_type'      => 'gambol_mega_menu',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
			'orderby'        => 'title',
			'order'          => 'ASC',
		) );

		if ( empty( $panels ) ) {
			return;
		}

		$current = (int) get_post_meta( $item_id, '_gambol_mega_menu_id', true );
		$nonce   = wp_create_nonce( 'gambol_mega_menu_' . $item_id );
		?>
		<p class="field-gambol-mega-menu description description-wide">
			<label for="gambol-mega-menu-<?php echo esc_attr( $item_id ); ?>">
				<?php esc_html_e( 'Mega Menu Panel', 'gambol-builder' ); ?>
				<select
					name="gambol_mega_menu[<?php echo esc_attr( $item_id ); ?>]"
					id="gambol-mega-menu-<?php echo esc_attr( $item_id ); ?>"
					class="gambol-mega-menu-select"
					style="width:100%;margin-top:5px;"
				>
					<option value="0"><?php esc_html_e( '— None —', 'gambol-builder' ); ?></option>
					<?php foreach ( $panels as $panel ) : ?>
						<option value="<?php echo esc_attr( $panel->ID ); ?>" <?php selected( $current, $panel->ID ); ?>>
							<?php echo esc_html( $panel->post_title ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</label>
			<input type="hidden" name="gambol_mega_menu_nonce[<?php echo esc_attr( $item_id ); ?>]" value="<?php echo esc_attr( $nonce ); ?>">
		</p>
		<?php
	}

	/**
	 * Save the mega menu selection.
	 *
	 * @param int $menu_id      Nav menu ID.
	 * @param int $menu_item_id Menu item post ID.
	 * @return void
	 */
	public static function save_field( $menu_id, $menu_item_id ) {
		$nonce = $_POST['gambol_mega_menu_nonce'][ $menu_item_id ] ?? '';
		if ( ! wp_verify_nonce( $nonce, 'gambol_mega_menu_' . $menu_item_id ) ) {
			return;
		}

		$mega_menu_id = (int) ( $_POST['gambol_mega_menu'][ $menu_item_id ] ?? 0 );
		if ( $mega_menu_id ) {
			update_post_meta( $menu_item_id, '_gambol_mega_menu_id', $mega_menu_id );
		} else {
			delete_post_meta( $menu_item_id, '_gambol_mega_menu_id' );
		}
	}

	/**
	 * Enqueue a tiny bit of admin CSS for the mega menu select.
	 *
	 * @param string $hook Current admin page hook.
	 * @return void
	 */
	public static function enqueue_scripts( $hook ) {
		if ( 'nav-menus.php' !== $hook ) {
			return;
		}
		$css = '.field-gambol-mega-menu { border-top: 1px solid #eee; padding-top: 8px; margin-top: 8px; }';
		wp_add_inline_style( 'wp-admin', $css );
	}
}
