<?php
/**
 * License API.
 *
 * Handles remote license validation.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Licensing;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class License_API
 *
 * Handles communication with license server.
 */
class License_API {

	/**
	 * Singleton instance.
	 *
	 * @var License_API|null
	 */
	private static $instance = null;

	/**
	 * API endpoint URL.
	 *
	 * @var string
	 */
	private $api_url = '';

	/**
	 * API timeout in seconds.
	 *
	 * @var int
	 */
	private $timeout = 15;

	/**
	 * Product ID for API requests.
	 *
	 * @var string
	 */
	private $product_id = 'gambol-builder-pro';

	/**
	 * Get singleton instance.
	 *
	 * @return License_API
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
		/**
		 * Filter the license API URL.
		 *
		 * @since 1.0.0
		 *
		 * @param string $url API URL.
		 */
		$this->api_url = apply_filters( 'gambol_license_api_url', 'https://licenses.gambol.dev/api/v1' );

		/**
		 * Filter the API timeout.
		 *
		 * @since 1.0.0
		 *
		 * @param int $timeout Timeout in seconds.
		 */
		$this->timeout = apply_filters( 'gambol_license_api_timeout', 15 );

		/**
		 * Filter the product ID.
		 *
		 * @since 1.0.0
		 *
		 * @param string $product_id Product ID.
		 */
		$this->product_id = apply_filters( 'gambol_license_product_id', 'gambol-builder-pro' );
	}

	/**
	 * Activate license.
	 *
	 * @param string $license_key License key.
	 * @return array Result.
	 */
	public function activate( $license_key ) {
		$response = $this->request( 'activate', array(
			'license_key' => $license_key,
			'site_url'    => $this->get_site_url(),
			'product_id'  => $this->product_id,
		) );

		return $this->parse_response( $response );
	}

	/**
	 * Deactivate license.
	 *
	 * @param string $license_key License key.
	 * @return array Result.
	 */
	public function deactivate( $license_key ) {
		$response = $this->request( 'deactivate', array(
			'license_key' => $license_key,
			'site_url'    => $this->get_site_url(),
			'product_id'  => $this->product_id,
		) );

		return $this->parse_response( $response );
	}

	/**
	 * Validate license.
	 *
	 * @param string $license_key License key.
	 * @return array Result.
	 */
	public function validate( $license_key ) {
		$response = $this->request( 'validate', array(
			'license_key' => $license_key,
			'site_url'    => $this->get_site_url(),
			'product_id'  => $this->product_id,
		) );

		return $this->parse_response( $response );
	}

	/**
	 * Check for updates.
	 *
	 * @param string $license_key License key.
	 * @param string $version     Current version.
	 * @return array Result.
	 */
	public function check_update( $license_key, $version ) {
		$response = $this->request( 'check-update', array(
			'license_key' => $license_key,
			'site_url'    => $this->get_site_url(),
			'product_id'  => $this->product_id,
			'version'     => $version,
		) );

		return $this->parse_response( $response );
	}

	/**
	 * Make API request.
	 *
	 * @param string $endpoint API endpoint.
	 * @param array  $data     Request data.
	 * @return array|\WP_Error Response or error.
	 */
	private function request( $endpoint, $data = array() ) {
		$url = trailingslashit( $this->api_url ) . $endpoint;

		// Add common data.
		$data['plugin_version'] = GAMBOL_BUILDER_VERSION;
		$data['wp_version'] = get_bloginfo( 'version' );
		$data['php_version'] = PHP_VERSION;

		$args = array(
			'method'      => 'POST',
			'timeout'     => $this->timeout,
			'redirection' => 5,
			'httpversion' => '1.1',
			'blocking'    => true,
			'headers'     => array(
				'Content-Type' => 'application/json',
				'Accept'       => 'application/json',
				'X-Gambol-License-Request' => '1',
			),
			'body'        => wp_json_encode( $data ),
			'sslverify'   => true,
		);

		/**
		 * Filter API request arguments.
		 *
		 * @since 1.0.0
		 *
		 * @param array  $args     Request arguments.
		 * @param string $endpoint Endpoint.
		 * @param array  $data     Request data.
		 */
		$args = apply_filters( 'gambol_license_api_request_args', $args, $endpoint, $data );

		$response = wp_remote_post( $url, $args );

		/**
		 * Fires after API request is made.
		 *
		 * @since 1.0.0
		 *
		 * @param array|\WP_Error $response Response.
		 * @param string          $endpoint Endpoint.
		 * @param array           $data     Request data.
		 */
		do_action( 'gambol_license_api_response', $response, $endpoint, $data );

		return $response;
	}

	/**
	 * Parse API response.
	 *
	 * @param array|\WP_Error $response Response.
	 * @return array Parsed result.
	 */
	private function parse_response( $response ) {
		// Check for WP_Error.
		if ( is_wp_error( $response ) ) {
			return array(
				'success'       => false,
				'message'       => $response->get_error_message(),
				'error_code'    => 'connection_error',
				'is_api_error'  => true,
			);
		}

		// Check HTTP status.
		$status_code = wp_remote_retrieve_response_code( $response );

		if ( $status_code < 200 || $status_code >= 300 ) {
			return array(
				'success'       => false,
				'message'       => sprintf(
					/* translators: %d: HTTP status code */
					__( 'Server returned error code: %d', 'gambol-builder' ),
					$status_code
				),
				'error_code'    => 'http_error',
				'status_code'   => $status_code,
				'is_api_error'  => true,
			);
		}

		// Parse body.
		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body, true );

		if ( json_last_error() !== JSON_ERROR_NONE ) {
			return array(
				'success'       => false,
				'message'       => __( 'Invalid response from license server.', 'gambol-builder' ),
				'error_code'    => 'json_error',
				'is_api_error'  => true,
			);
		}

		// Ensure success key exists.
		if ( ! isset( $data['success'] ) ) {
			$data['success'] = false;
		}

		// Add default message if missing.
		if ( ! isset( $data['message'] ) ) {
			$data['message'] = $data['success']
				? __( 'License validated successfully.', 'gambol-builder' )
				: __( 'License validation failed.', 'gambol-builder' );
		}

		$data['is_api_error'] = false;

		return $data;
	}

	/**
	 * Get site URL for license validation.
	 *
	 * @return string Site URL.
	 */
	private function get_site_url() {
		$url = home_url();

		// Normalize URL.
		$url = preg_replace( '#^https?://#', '', $url );
		$url = untrailingslashit( $url );
		$url = strtolower( $url );

		// Remove www.
		$url = preg_replace( '#^www\.#', '', $url );

		/**
		 * Filter site URL for license validation.
		 *
		 * @since 1.0.0
		 *
		 * @param string $url Site URL.
		 */
		return apply_filters( 'gambol_license_site_url', $url );
	}

	/**
	 * Check if API is reachable.
	 *
	 * @return bool True if reachable.
	 */
	public function is_api_reachable() {
		$response = wp_remote_get( trailingslashit( $this->api_url ) . 'ping', array(
			'timeout'   => 5,
			'sslverify' => true,
		) );

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$status_code = wp_remote_retrieve_response_code( $response );

		return $status_code >= 200 && $status_code < 300;
	}

	/**
	 * Get API URL.
	 *
	 * @return string API URL.
	 */
	public function get_api_url() {
		return $this->api_url;
	}

	/**
	 * Set API URL.
	 *
	 * @param string $url API URL.
	 * @return void
	 */
	public function set_api_url( $url ) {
		$this->api_url = $url;
	}
}
