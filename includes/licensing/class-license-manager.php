<?php
/**
 * License Manager.
 *
 * Core license handling and storage.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Licensing;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class License_Manager
 *
 * Manages license key storage and validation state.
 */
class License_Manager {

	/**
	 * Singleton instance.
	 *
	 * @var License_Manager|null
	 */
	private static $instance = null;

	/**
	 * Option key for license data.
	 *
	 * @var string
	 */
	const OPTION_KEY = 'gambol_builder_license';

	/**
	 * License types.
	 */
	const TYPE_FREE     = 'free';
	const TYPE_YEARLY   = 'yearly';
	const TYPE_LIFETIME = 'lifetime';

	/**
	 * License statuses.
	 */
	const STATUS_INACTIVE = 'inactive';
	const STATUS_VALID    = 'valid';
	const STATUS_EXPIRED  = 'expired';
	const STATUS_INVALID  = 'invalid';

	/**
	 * Cached license data.
	 *
	 * @var array|null
	 */
	private $license_data = null;

	/**
	 * Grace period in days when server is unreachable.
	 *
	 * @var int
	 */
	private $grace_period_days = 7;

	/**
	 * Get singleton instance.
	 *
	 * @return License_Manager
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
		// Schedule daily license check.
		add_action( 'gambol_daily_license_check', array( $this, 'scheduled_validation' ) );

		if ( ! wp_next_scheduled( 'gambol_daily_license_check' ) ) {
			wp_schedule_event( time(), 'daily', 'gambol_daily_license_check' );
		}

		// Clear schedule on deactivation - handled via gambol_builder_deactivate action.
		add_action( 'gambol_builder_deactivate', array( $this, 'clear_scheduled_events' ) );
	}

	/**
	 * Get license data.
	 *
	 * @return array License data.
	 */
	public function get_license_data() {
		if ( null === $this->license_data ) {
			$this->license_data = $this->load_license_data();
		}
		return $this->license_data;
	}

	/**
	 * Load license data from database.
	 *
	 * @return array License data.
	 */
	private function load_license_data() {
		$defaults = array(
			'key'              => '',
			'status'           => self::STATUS_INACTIVE,
			'type'             => self::TYPE_FREE,
			'expires'          => '',
			'activated_at'     => '',
			'last_check'       => '',
			'last_valid_check' => '',
			'site_count'       => 1,
			'customer_email'   => '',
			'customer_name'    => '',
		);

		$data = get_option( self::OPTION_KEY, array() );

		// Decrypt sensitive data.
		if ( ! empty( $data['key'] ) ) {
			$data['key'] = $this->decrypt( $data['key'] );
		}

		return wp_parse_args( $data, $defaults );
	}

	/**
	 * Save license data.
	 *
	 * @param array $data License data to save.
	 * @return bool True on success.
	 */
	public function save_license_data( $data ) {
		$current = $this->get_license_data();
		$data = wp_parse_args( $data, $current );

		// Encrypt sensitive data before saving.
		$save_data = $data;
		if ( ! empty( $save_data['key'] ) ) {
			$save_data['key'] = $this->encrypt( $save_data['key'] );
		}

		$result = update_option( self::OPTION_KEY, $save_data, false );

		// Update cache.
		$this->license_data = $data;

		return $result;
	}

	/**
	 * Get license key.
	 *
	 * @return string License key.
	 */
	public function get_license_key() {
		$data = $this->get_license_data();
		return $data['key'];
	}

	/**
	 * Get license status.
	 *
	 * @return string License status.
	 */
	public function get_status() {
		$data = $this->get_license_data();
		return $data['status'];
	}

	/**
	 * Get license type.
	 *
	 * @return string License type.
	 */
	public function get_type() {
		$data = $this->get_license_data();
		return $data['type'];
	}

	/**
	 * Check if license is active and valid.
	 *
	 * @return bool True if license is valid.
	 */
	public function is_valid() {
		$data = $this->get_license_data();

		// Check status.
		if ( self::STATUS_VALID !== $data['status'] ) {
			return $this->check_grace_period();
		}

		// Check expiration for yearly licenses.
		if ( self::TYPE_YEARLY === $data['type'] && ! empty( $data['expires'] ) ) {
			$expires = strtotime( $data['expires'] );
			if ( $expires && $expires < time() ) {
				$this->save_license_data( array( 'status' => self::STATUS_EXPIRED ) );
				return false;
			}
		}

		return true;
	}

	/**
	 * Check if in grace period (server unreachable).
	 *
	 * @return bool True if in grace period.
	 */
	private function check_grace_period() {
		$data = $this->get_license_data();

		// If never validated, no grace period.
		if ( empty( $data['last_valid_check'] ) ) {
			return false;
		}

		$last_valid = strtotime( $data['last_valid_check'] );
		$grace_end = $last_valid + ( $this->grace_period_days * DAY_IN_SECONDS );

		return time() < $grace_end;
	}

	/**
	 * Check if this is a Pro license.
	 *
	 * @return bool True if Pro license.
	 */
	public function is_pro() {
		if ( ! $this->is_valid() ) {
			return false;
		}

		$type = $this->get_type();

		return in_array( $type, array( self::TYPE_YEARLY, self::TYPE_LIFETIME ), true );
	}

	/**
	 * Check if license is lifetime.
	 *
	 * @return bool True if lifetime license.
	 */
	public function is_lifetime() {
		return $this->is_valid() && self::TYPE_LIFETIME === $this->get_type();
	}

	/**
	 * Activate license.
	 *
	 * @param string $license_key License key to activate.
	 * @return array Result with success and message.
	 */
	public function activate( $license_key ) {
		$license_key = $this->sanitize_key( $license_key );

		if ( empty( $license_key ) ) {
			return array(
				'success' => false,
				'message' => __( 'Please enter a valid license key.', 'gambol-builder' ),
			);
		}

		// Validate via API.
		$api = License_API::get_instance();
		$result = $api->activate( $license_key );

		if ( $result['success'] ) {
			$this->save_license_data( array(
				'key'              => $license_key,
				'status'           => self::STATUS_VALID,
				'type'             => isset( $result['type'] ) ? $result['type'] : self::TYPE_YEARLY,
				'expires'          => isset( $result['expires'] ) ? $result['expires'] : '',
				'activated_at'     => current_time( 'mysql' ),
				'last_check'       => current_time( 'mysql' ),
				'last_valid_check' => current_time( 'mysql' ),
				'site_count'       => isset( $result['site_count'] ) ? $result['site_count'] : 1,
				'customer_email'   => isset( $result['customer_email'] ) ? $result['customer_email'] : '',
				'customer_name'    => isset( $result['customer_name'] ) ? $result['customer_name'] : '',
			) );

			/**
			 * Fires when license is activated.
			 *
			 * @since 1.0.0
			 *
			 * @param string $license_key License key.
			 * @param array  $result      API result.
			 */
			do_action( 'gambol_license_activated', $license_key, $result );
		}

		return $result;
	}

	/**
	 * Deactivate license.
	 *
	 * @return array Result with success and message.
	 */
	public function deactivate() {
		$license_key = $this->get_license_key();

		if ( empty( $license_key ) ) {
			return array(
				'success' => false,
				'message' => __( 'No license key to deactivate.', 'gambol-builder' ),
			);
		}

		// Deactivate via API.
		$api = License_API::get_instance();
		$result = $api->deactivate( $license_key );

		// Always clear local license data.
		$this->clear_license_data();

		/**
		 * Fires when license is deactivated.
		 *
		 * @since 1.0.0
		 *
		 * @param string $license_key License key.
		 */
		do_action( 'gambol_license_deactivated', $license_key );

		return array(
			'success' => true,
			'message' => __( 'License deactivated successfully.', 'gambol-builder' ),
		);
	}

	/**
	 * Clear license data.
	 *
	 * @return void
	 */
	public function clear_license_data() {
		delete_option( self::OPTION_KEY );
		$this->license_data = null;
	}

	/**
	 * Scheduled validation check.
	 *
	 * @return void
	 */
	public function scheduled_validation() {
		$license_key = $this->get_license_key();

		if ( empty( $license_key ) ) {
			return;
		}

		$api = License_API::get_instance();
		$result = $api->validate( $license_key );

		$update_data = array(
			'last_check' => current_time( 'mysql' ),
		);

		if ( $result['success'] ) {
			$update_data['status'] = self::STATUS_VALID;
			$update_data['last_valid_check'] = current_time( 'mysql' );

			if ( isset( $result['expires'] ) ) {
				$update_data['expires'] = $result['expires'];
			}
		} elseif ( isset( $result['status'] ) ) {
			// API returned specific status.
			$update_data['status'] = $result['status'];
		}
		// If API unreachable, don't update status (grace period).

		$this->save_license_data( $update_data );
	}

	/**
	 * Clear scheduled events.
	 *
	 * @return void
	 */
	public function clear_scheduled_events() {
		wp_clear_scheduled_hook( 'gambol_daily_license_check' );
	}

	/**
	 * Sanitize license key.
	 *
	 * @param string $key License key.
	 * @return string Sanitized key.
	 */
	private function sanitize_key( $key ) {
		$key = trim( $key );
		$key = sanitize_text_field( $key );
		$key = strtoupper( $key );
		return $key;
	}

	/**
	 * Encrypt sensitive data.
	 *
	 * @param string $data Data to encrypt.
	 * @return string Encrypted data.
	 */
	private function encrypt( $data ) {
		if ( empty( $data ) ) {
			return '';
		}

		$key = $this->get_encryption_key();

		// Use OpenSSL if available.
		if ( function_exists( 'openssl_encrypt' ) ) {
			$iv = openssl_random_pseudo_bytes( 16 );
			$encrypted = openssl_encrypt( $data, 'AES-256-CBC', $key, 0, $iv );
			return base64_encode( $iv . $encrypted );
		}

		// Fallback: simple obfuscation (not true encryption).
		return base64_encode( $data . '|' . wp_hash( $data . $key ) );
	}

	/**
	 * Decrypt sensitive data.
	 *
	 * @param string $data Encrypted data.
	 * @return string Decrypted data.
	 */
	private function decrypt( $data ) {
		if ( empty( $data ) ) {
			return '';
		}

		$key = $this->get_encryption_key();

		// Use OpenSSL if available.
		if ( function_exists( 'openssl_encrypt' ) ) {
			$data = base64_decode( $data );
			$iv = substr( $data, 0, 16 );
			$encrypted = substr( $data, 16 );
			return openssl_decrypt( $encrypted, 'AES-256-CBC', $key, 0, $iv );
		}

		// Fallback: simple de-obfuscation.
		$decoded = base64_decode( $data );
		$parts = explode( '|', $decoded );
		return isset( $parts[0] ) ? $parts[0] : '';
	}

	/**
	 * Get encryption key.
	 *
	 * @return string Encryption key.
	 */
	private function get_encryption_key() {
		// Use WordPress salts for encryption key.
		if ( defined( 'SECURE_AUTH_KEY' ) && SECURE_AUTH_KEY ) {
			return hash( 'sha256', SECURE_AUTH_KEY . 'gambol_license' );
		}

		// Fallback to AUTH_KEY.
		if ( defined( 'AUTH_KEY' ) && AUTH_KEY ) {
			return hash( 'sha256', AUTH_KEY . 'gambol_license' );
		}

		// Last resort fallback.
		return hash( 'sha256', 'gambol_builder_default_key' );
	}

	/**
	 * Get days until expiration.
	 *
	 * @return int|null Days until expiration or null if lifetime/no expiry.
	 */
	public function get_days_until_expiry() {
		$data = $this->get_license_data();

		if ( self::TYPE_LIFETIME === $data['type'] ) {
			return null;
		}

		if ( empty( $data['expires'] ) ) {
			return null;
		}

		$expires = strtotime( $data['expires'] );
		$now = time();

		if ( $expires < $now ) {
			return 0;
		}

		return (int) floor( ( $expires - $now ) / DAY_IN_SECONDS );
	}

	/**
	 * Get license status label.
	 *
	 * @return string Status label.
	 */
	public function get_status_label() {
		$status = $this->get_status();

		$labels = array(
			self::STATUS_INACTIVE => __( 'Inactive', 'gambol-builder' ),
			self::STATUS_VALID    => __( 'Active', 'gambol-builder' ),
			self::STATUS_EXPIRED  => __( 'Expired', 'gambol-builder' ),
			self::STATUS_INVALID  => __( 'Invalid', 'gambol-builder' ),
		);

		return isset( $labels[ $status ] ) ? $labels[ $status ] : __( 'Unknown', 'gambol-builder' );
	}

	/**
	 * Get license type label.
	 *
	 * @return string Type label.
	 */
	public function get_type_label() {
		$type = $this->get_type();

		$labels = array(
			self::TYPE_FREE     => __( 'Free', 'gambol-builder' ),
			self::TYPE_YEARLY   => __( 'Pro (Yearly)', 'gambol-builder' ),
			self::TYPE_LIFETIME => __( 'Pro (Lifetime)', 'gambol-builder' ),
		);

		return isset( $labels[ $type ] ) ? $labels[ $type ] : __( 'Unknown', 'gambol-builder' );
	}

	/**
	 * Mask license key for display.
	 *
	 * @param string $key License key.
	 * @return string Masked key.
	 */
	public function mask_key( $key = null ) {
		if ( null === $key ) {
			$key = $this->get_license_key();
		}

		if ( empty( $key ) || strlen( $key ) < 8 ) {
			return $key;
		}

		$visible = 4;
		$start = substr( $key, 0, $visible );
		$end = substr( $key, -$visible );
		$middle = str_repeat( '*', max( strlen( $key ) - ( $visible * 2 ), 4 ) );

		return $start . $middle . $end;
	}
}
