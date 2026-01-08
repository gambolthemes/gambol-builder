<?php
/**
 * License Admin Page.
 *
 * License activation screen in WordPress admin.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Licensing;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class License_Admin
 *
 * Admin interface for license management.
 */
class License_Admin {

	/**
	 * Singleton instance.
	 *
	 * @var License_Admin|null
	 */
	private static $instance = null;

	/**
	 * Page slug.
	 *
	 * @var string
	 */
	const PAGE_SLUG = 'gambol-license';

	/**
	 * Nonce action.
	 *
	 * @var string
	 */
	const NONCE_ACTION = 'gambol_license_action';

	/**
	 * Get singleton instance.
	 *
	 * @return License_Admin
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
	 * Initialize.
	 *
	 * @return void
	 */
	private function init() {
		add_action( 'admin_menu', array( $this, 'add_menu_page' ) );
		add_action( 'admin_init', array( $this, 'handle_form_submission' ) );
		add_action( 'admin_notices', array( $this, 'display_admin_notices' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		// AJAX handlers.
		add_action( 'wp_ajax_gambol_activate_license', array( $this, 'ajax_activate' ) );
		add_action( 'wp_ajax_gambol_deactivate_license', array( $this, 'ajax_deactivate' ) );
		add_action( 'wp_ajax_gambol_refresh_license', array( $this, 'ajax_refresh' ) );
	}

	/**
	 * Add menu page.
	 *
	 * @return void
	 */
	public function add_menu_page() {
		add_submenu_page(
			'gambol-builder',
			__( 'License', 'gambol-builder' ),
			__( 'License', 'gambol-builder' ),
			'manage_options',
			self::PAGE_SLUG,
			array( $this, 'render_page' )
		);
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @param string $hook Current admin page.
	 * @return void
	 */
	public function enqueue_assets( $hook ) {
		if ( strpos( $hook, self::PAGE_SLUG ) === false ) {
			return;
		}

		wp_enqueue_style(
			'gambol-license-admin',
			GAMBOL_BUILDER_URL . 'assets/css/license-admin.css',
			array(),
			GAMBOL_BUILDER_VERSION
		);
	}

	/**
	 * Handle form submission.
	 *
	 * @return void
	 */
	public function handle_form_submission() {
		if ( ! isset( $_POST['gambol_license_action'] ) ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( ! wp_verify_nonce( $_POST['_wpnonce'], self::NONCE_ACTION ) ) {
			add_settings_error(
				'gambol_license',
				'invalid_nonce',
				__( 'Security check failed. Please try again.', 'gambol-builder' ),
				'error'
			);
			return;
		}

		$action = sanitize_text_field( $_POST['gambol_license_action'] );
		$manager = License_Manager::get_instance();

		switch ( $action ) {
			case 'activate':
				$license_key = isset( $_POST['license_key'] ) ? sanitize_text_field( $_POST['license_key'] ) : '';
				$result = $manager->activate( $license_key );

				if ( $result['success'] ) {
					add_settings_error(
						'gambol_license',
						'activated',
						$result['message'],
						'success'
					);
				} else {
					add_settings_error(
						'gambol_license',
						'activation_failed',
						$result['message'],
						'error'
					);
				}
				break;

			case 'deactivate':
				$result = $manager->deactivate();

				add_settings_error(
					'gambol_license',
					'deactivated',
					$result['message'],
					$result['success'] ? 'success' : 'error'
				);
				break;

			case 'refresh':
				$manager->scheduled_validation();

				add_settings_error(
					'gambol_license',
					'refreshed',
					__( 'License status refreshed.', 'gambol-builder' ),
					'success'
				);
				break;
		}
	}

	/**
	 * Display admin notices.
	 *
	 * @return void
	 */
	public function display_admin_notices() {
		$screen = get_current_screen();

		if ( ! $screen || strpos( $screen->id, self::PAGE_SLUG ) === false ) {
			return;
		}

		settings_errors( 'gambol_license' );
	}

	/**
	 * Render admin page.
	 *
	 * @return void
	 */
	public function render_page() {
		$manager = License_Manager::get_instance();
		$license_data = $manager->get_license_data();
		$is_active = $manager->is_valid();
		$is_pro = $manager->is_pro();
		?>
		<div class="wrap gambol-license-page">
			<h1><?php esc_html_e( 'Gambol Builder License', 'gambol-builder' ); ?></h1>

			<div class="gambol-license-container">
				<?php if ( $is_active && ! empty( $license_data['key'] ) ) : ?>
					<?php $this->render_active_license( $license_data, $manager ); ?>
				<?php else : ?>
					<?php $this->render_activation_form(); ?>
				<?php endif; ?>

				<?php $this->render_pro_features( $is_pro ); ?>
			</div>
		</div>

		<style>
			.gambol-license-page {
				max-width: 800px;
			}
			.gambol-license-container {
				display: grid;
				gap: 24px;
				margin-top: 20px;
			}
			.gambol-license-box {
				background: #fff;
				border: 1px solid #c3c4c7;
				border-radius: 4px;
				padding: 24px;
			}
			.gambol-license-box h2 {
				margin-top: 0;
				padding-bottom: 12px;
				border-bottom: 1px solid #f0f0f1;
			}
			.gambol-license-status {
				display: flex;
				align-items: center;
				gap: 16px;
				margin-bottom: 20px;
			}
			.gambol-status-badge {
				display: inline-flex;
				align-items: center;
				padding: 4px 12px;
				border-radius: 4px;
				font-weight: 600;
				font-size: 13px;
			}
			.gambol-status-badge.active {
				background: #d4edda;
				color: #155724;
			}
			.gambol-status-badge.inactive {
				background: #f8d7da;
				color: #721c24;
			}
			.gambol-status-badge.expired {
				background: #fff3cd;
				color: #856404;
			}
			.gambol-license-info {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 16px;
				margin-bottom: 20px;
			}
			.gambol-license-info-item {
				padding: 12px;
				background: #f8f9fa;
				border-radius: 4px;
			}
			.gambol-license-info-item label {
				display: block;
				font-size: 11px;
				text-transform: uppercase;
				color: #646970;
				margin-bottom: 4px;
			}
			.gambol-license-info-item span {
				font-size: 14px;
				font-weight: 500;
			}
			.gambol-license-actions {
				display: flex;
				gap: 12px;
				margin-top: 20px;
				padding-top: 20px;
				border-top: 1px solid #f0f0f1;
			}
			.gambol-license-form .form-row {
				margin-bottom: 16px;
			}
			.gambol-license-form label {
				display: block;
				font-weight: 600;
				margin-bottom: 8px;
			}
			.gambol-license-form input[type="text"] {
				width: 100%;
				max-width: 400px;
				padding: 10px 12px;
				font-size: 14px;
			}
			.gambol-pro-features {
				margin-top: 0;
			}
			.gambol-pro-features ul {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 8px;
				margin: 0;
				padding: 0;
				list-style: none;
			}
			.gambol-pro-features li {
				display: flex;
				align-items: center;
				gap: 8px;
				padding: 8px 0;
			}
			.gambol-pro-features .dashicons {
				font-size: 16px;
				width: 16px;
				height: 16px;
			}
			.gambol-pro-features .dashicons-yes-alt {
				color: #00a32a;
			}
			.gambol-pro-features .dashicons-lock {
				color: #d63638;
			}
			.gambol-get-pro {
				margin-top: 20px;
				padding-top: 20px;
				border-top: 1px solid #f0f0f1;
			}
		</style>
		<?php
	}

	/**
	 * Render active license section.
	 *
	 * @param array           $license_data License data.
	 * @param License_Manager $manager      License manager.
	 * @return void
	 */
	private function render_active_license( $license_data, $manager ) {
		$status = $manager->get_status();
		$status_class = License_Manager::STATUS_VALID === $status ? 'active' : 'inactive';

		if ( License_Manager::STATUS_EXPIRED === $status ) {
			$status_class = 'expired';
		}

		$days_left = $manager->get_days_until_expiry();
		?>
		<div class="gambol-license-box">
			<h2><?php esc_html_e( 'License Status', 'gambol-builder' ); ?></h2>

			<div class="gambol-license-status">
				<span class="gambol-status-badge <?php echo esc_attr( $status_class ); ?>">
					<?php echo esc_html( $manager->get_status_label() ); ?>
				</span>
				<span class="gambol-license-type">
					<?php echo esc_html( $manager->get_type_label() ); ?>
				</span>
			</div>

			<div class="gambol-license-info">
				<div class="gambol-license-info-item">
					<label><?php esc_html_e( 'License Key', 'gambol-builder' ); ?></label>
					<span><?php echo esc_html( $manager->mask_key() ); ?></span>
				</div>

				<?php if ( ! empty( $license_data['customer_email'] ) ) : ?>
				<div class="gambol-license-info-item">
					<label><?php esc_html_e( 'Registered To', 'gambol-builder' ); ?></label>
					<span><?php echo esc_html( $license_data['customer_email'] ); ?></span>
				</div>
				<?php endif; ?>

				<?php if ( null !== $days_left ) : ?>
				<div class="gambol-license-info-item">
					<label><?php esc_html_e( 'Expires', 'gambol-builder' ); ?></label>
					<span>
						<?php
						if ( $days_left > 0 ) {
							printf(
								/* translators: %s: expiration date */
								esc_html__( '%s (%d days)', 'gambol-builder' ),
								esc_html( date_i18n( get_option( 'date_format' ), strtotime( $license_data['expires'] ) ) ),
								esc_html( $days_left )
							);
						} else {
							esc_html_e( 'Expired', 'gambol-builder' );
						}
						?>
					</span>
				</div>
				<?php elseif ( $manager->is_lifetime() ) : ?>
				<div class="gambol-license-info-item">
					<label><?php esc_html_e( 'Expires', 'gambol-builder' ); ?></label>
					<span><?php esc_html_e( 'Never (Lifetime)', 'gambol-builder' ); ?></span>
				</div>
				<?php endif; ?>

				<div class="gambol-license-info-item">
					<label><?php esc_html_e( 'Last Checked', 'gambol-builder' ); ?></label>
					<span>
						<?php
						if ( ! empty( $license_data['last_check'] ) ) {
							echo esc_html( human_time_diff( strtotime( $license_data['last_check'] ) ) . ' ' . __( 'ago', 'gambol-builder' ) );
						} else {
							esc_html_e( 'Never', 'gambol-builder' );
						}
						?>
					</span>
				</div>
			</div>

			<div class="gambol-license-actions">
				<form method="post">
					<?php wp_nonce_field( self::NONCE_ACTION ); ?>
					<input type="hidden" name="gambol_license_action" value="refresh">
					<button type="submit" class="button button-secondary">
						<?php esc_html_e( 'Refresh Status', 'gambol-builder' ); ?>
					</button>
				</form>

				<form method="post">
					<?php wp_nonce_field( self::NONCE_ACTION ); ?>
					<input type="hidden" name="gambol_license_action" value="deactivate">
					<button type="submit" class="button button-link-delete" onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to deactivate this license?', 'gambol-builder' ); ?>');">
						<?php esc_html_e( 'Deactivate License', 'gambol-builder' ); ?>
					</button>
				</form>
			</div>
		</div>
		<?php
	}

	/**
	 * Render activation form.
	 *
	 * @return void
	 */
	private function render_activation_form() {
		?>
		<div class="gambol-license-box">
			<h2><?php esc_html_e( 'Activate License', 'gambol-builder' ); ?></h2>

			<p><?php esc_html_e( 'Enter your license key to unlock Pro features and receive updates.', 'gambol-builder' ); ?></p>

			<form method="post" class="gambol-license-form">
				<?php wp_nonce_field( self::NONCE_ACTION ); ?>
				<input type="hidden" name="gambol_license_action" value="activate">

				<div class="form-row">
					<label for="license_key"><?php esc_html_e( 'License Key', 'gambol-builder' ); ?></label>
					<input type="text" id="license_key" name="license_key" placeholder="XXXX-XXXX-XXXX-XXXX" required>
				</div>

				<button type="submit" class="button button-primary button-hero">
					<?php esc_html_e( 'Activate License', 'gambol-builder' ); ?>
				</button>
			</form>

			<div class="gambol-get-pro">
				<p>
					<?php esc_html_e( "Don't have a license key?", 'gambol-builder' ); ?>
					<a href="https://gambol.dev/pricing" target="_blank" rel="noopener">
						<?php esc_html_e( 'Get Gambol Builder Pro', 'gambol-builder' ); ?>
					</a>
				</p>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Pro features section.
	 *
	 * @param bool $is_pro Whether Pro is active.
	 * @return void
	 */
	private function render_pro_features( $is_pro ) {
		$features = Pro_Features::get_instance()->get_all_features();
		?>
		<div class="gambol-license-box gambol-pro-features">
			<h2><?php esc_html_e( 'Pro Features', 'gambol-builder' ); ?></h2>

			<ul>
				<?php foreach ( $features as $feature_id => $feature ) : ?>
				<li>
					<?php if ( $is_pro ) : ?>
						<span class="dashicons dashicons-yes-alt"></span>
					<?php else : ?>
						<span class="dashicons dashicons-lock"></span>
					<?php endif; ?>
					<span><?php echo esc_html( $feature['name'] ); ?></span>
				</li>
				<?php endforeach; ?>
			</ul>

			<?php if ( ! $is_pro ) : ?>
			<div class="gambol-get-pro">
				<a href="https://gambol.dev/pricing" target="_blank" rel="noopener" class="button button-primary">
					<?php esc_html_e( 'Upgrade to Pro', 'gambol-builder' ); ?>
				</a>
			</div>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * AJAX: Activate license.
	 *
	 * @return void
	 */
	public function ajax_activate() {
		check_ajax_referer( 'gambol_license_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Permission denied.', 'gambol-builder' ) ) );
		}

		$license_key = isset( $_POST['license_key'] ) ? sanitize_text_field( $_POST['license_key'] ) : '';

		$manager = License_Manager::get_instance();
		$result = $manager->activate( $license_key );

		if ( $result['success'] ) {
			wp_send_json_success( $result );
		} else {
			wp_send_json_error( $result );
		}
	}

	/**
	 * AJAX: Deactivate license.
	 *
	 * @return void
	 */
	public function ajax_deactivate() {
		check_ajax_referer( 'gambol_license_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Permission denied.', 'gambol-builder' ) ) );
		}

		$manager = License_Manager::get_instance();
		$result = $manager->deactivate();

		if ( $result['success'] ) {
			wp_send_json_success( $result );
		} else {
			wp_send_json_error( $result );
		}
	}

	/**
	 * AJAX: Refresh license status.
	 *
	 * @return void
	 */
	public function ajax_refresh() {
		check_ajax_referer( 'gambol_license_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Permission denied.', 'gambol-builder' ) ) );
		}

		$manager = License_Manager::get_instance();
		$manager->scheduled_validation();

		wp_send_json_success( array(
			'message' => __( 'License status refreshed.', 'gambol-builder' ),
			'status'  => $manager->get_status(),
			'is_pro'  => $manager->is_pro(),
		) );
	}
}
