<?php
/**
 * Lazy Loading Handler.
 *
 * Handles lazy loading for images and iframes.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Performance;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Lazy_Loading
 *
 * Manages image and iframe lazy loading.
 */
class Lazy_Loading {

	/**
	 * Singleton instance.
	 *
	 * @var Lazy_Loading|null
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Lazy_Loading
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
		// Don't run in admin.
		if ( is_admin() ) {
			return;
		}

		$settings = Settings::get_instance();

		if ( $settings->is_enabled( 'lazy_load_images' ) ) {
			// Add lazy loading to images.
			add_filter( 'the_content', array( $this, 'add_lazy_loading_to_content' ), 99 );
			add_filter( 'wp_get_attachment_image_attributes', array( $this, 'add_lazy_loading_to_attachment' ), 10, 3 );

			// Add Intersection Observer script.
			add_action( 'wp_footer', array( $this, 'output_lazy_load_script' ), 99 );

			// Add CSS for placeholder.
			add_action( 'wp_head', array( $this, 'output_lazy_load_styles' ), 99 );
		}

		// Lazy load iframes.
		if ( $settings->is_enabled( 'lazy_load_iframes' ) ) {
			add_filter( 'the_content', array( $this, 'add_lazy_loading_to_iframes' ), 99 );
		}

		// Add loading=lazy to offscreen images.
		if ( $settings->is_enabled( 'native_lazy_loading' ) ) {
			add_filter( 'wp_img_tag_add_loading_attr', array( $this, 'enable_native_lazy_loading' ), 10, 3 );
		}

		// Add width and height to images.
		if ( $settings->is_enabled( 'add_image_dimensions' ) ) {
			add_filter( 'the_content', array( $this, 'add_missing_dimensions' ), 98 );
		}
	}

	/**
	 * Add lazy loading to images in content.
	 *
	 * @param string $content Post content.
	 * @return string Modified content.
	 */
	public function add_lazy_loading_to_content( $content ) {
		if ( empty( $content ) ) {
			return $content;
		}

		// Don't lazy load in feeds.
		if ( is_feed() ) {
			return $content;
		}

		// Match all img tags.
		$pattern = '/<img\s+[^>]*src=["\']([^"\']+)["\'][^>]*>/i';

		$content = preg_replace_callback( $pattern, array( $this, 'process_image_tag' ), $content );

		return $content;
	}

	/**
	 * Process image tag for lazy loading.
	 *
	 * @param array $matches Regex matches.
	 * @return string Modified image tag.
	 */
	private function process_image_tag( $matches ) {
		$img_tag = $matches[0];
		$src = $matches[1];

		// Skip if already has loading attribute.
		if ( strpos( $img_tag, 'loading=' ) !== false ) {
			return $img_tag;
		}

		// Skip if already lazy loaded.
		if ( strpos( $img_tag, 'data-src' ) !== false ) {
			return $img_tag;
		}

		// Skip if has skip-lazy class.
		if ( strpos( $img_tag, 'skip-lazy' ) !== false || strpos( $img_tag, 'no-lazy' ) !== false ) {
			return $img_tag;
		}

		// Skip small inline images (data URIs).
		if ( strpos( $src, 'data:' ) === 0 ) {
			return $img_tag;
		}

		// Get placeholder.
		$placeholder = $this->get_placeholder( $img_tag );

		// Add lazy loading attributes.
		$lazy_img = str_replace( 'src=', 'data-src=', $img_tag );
		$lazy_img = str_replace( 'srcset=', 'data-srcset=', $lazy_img );
		$lazy_img = str_replace( '<img', '<img src="' . esc_attr( $placeholder ) . '"', $lazy_img );

		// Add lazy class.
		if ( strpos( $lazy_img, 'class="' ) !== false ) {
			$lazy_img = preg_replace( '/class="([^"]*)"/', 'class="$1 gambol-lazy"', $lazy_img );
		} else {
			$lazy_img = str_replace( '<img', '<img class="gambol-lazy"', $lazy_img );
		}

		return $lazy_img;
	}

	/**
	 * Get placeholder for lazy loaded image.
	 *
	 * @param string $img_tag Image tag.
	 * @return string Placeholder data URI.
	 */
	private function get_placeholder( $img_tag ) {
		// Extract width and height.
		$width = 1;
		$height = 1;

		if ( preg_match( '/width=["\'](\d+)["\']/', $img_tag, $w_match ) ) {
			$width = intval( $w_match[1] );
		}

		if ( preg_match( '/height=["\'](\d+)["\']/', $img_tag, $h_match ) ) {
			$height = intval( $h_match[1] );
		}

		// Generate transparent SVG placeholder.
		$svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' . $width . '" height="' . $height . '" viewBox="0 0 ' . $width . ' ' . $height . '"></svg>';

		return 'data:image/svg+xml;base64,' . base64_encode( $svg );
	}

	/**
	 * Add lazy loading to attachment images.
	 *
	 * @param array        $attr       Attributes.
	 * @param \WP_Post     $attachment Attachment post.
	 * @param string|array $size       Size.
	 * @return array Modified attributes.
	 */
	public function add_lazy_loading_to_attachment( $attr, $attachment, $size ) {
		// Skip if already has loading attribute.
		if ( isset( $attr['loading'] ) ) {
			return $attr;
		}

		// Skip if skip-lazy class exists.
		if ( isset( $attr['class'] ) && ( strpos( $attr['class'], 'skip-lazy' ) !== false || strpos( $attr['class'], 'no-lazy' ) !== false ) ) {
			return $attr;
		}

		$attr['loading'] = 'lazy';

		return $attr;
	}

	/**
	 * Add lazy loading to iframes.
	 *
	 * @param string $content Post content.
	 * @return string Modified content.
	 */
	public function add_lazy_loading_to_iframes( $content ) {
		if ( empty( $content ) ) {
			return $content;
		}

		// Match all iframe tags.
		$pattern = '/<iframe\s+[^>]*src=["\']([^"\']+)["\'][^>]*>/i';

		$content = preg_replace_callback( $pattern, array( $this, 'process_iframe_tag' ), $content );

		return $content;
	}

	/**
	 * Process iframe tag for lazy loading.
	 *
	 * @param array $matches Regex matches.
	 * @return string Modified iframe tag.
	 */
	private function process_iframe_tag( $matches ) {
		$iframe_tag = $matches[0];

		// Skip if already has loading attribute.
		if ( strpos( $iframe_tag, 'loading=' ) !== false ) {
			return $iframe_tag;
		}

		// Skip if has skip-lazy class.
		if ( strpos( $iframe_tag, 'skip-lazy' ) !== false || strpos( $iframe_tag, 'no-lazy' ) !== false ) {
			return $iframe_tag;
		}

		// Add loading=lazy.
		$lazy_iframe = str_replace( '<iframe', '<iframe loading="lazy"', $iframe_tag );

		return $lazy_iframe;
	}

	/**
	 * Enable native lazy loading.
	 *
	 * @param string|bool $value   Current value.
	 * @param string      $image   Image HTML.
	 * @param string      $context Context.
	 * @return string Loading value.
	 */
	public function enable_native_lazy_loading( $value, $image, $context ) {
		return 'lazy';
	}

	/**
	 * Add missing dimensions to images.
	 *
	 * @param string $content Post content.
	 * @return string Modified content.
	 */
	public function add_missing_dimensions( $content ) {
		if ( empty( $content ) ) {
			return $content;
		}

		// Match img tags without width or height.
		$pattern = '/<img\s+[^>]*src=["\']([^"\']+)["\'][^>]*>/i';

		$content = preg_replace_callback( $pattern, array( $this, 'add_dimensions_to_image' ), $content );

		return $content;
	}

	/**
	 * Add dimensions to image tag.
	 *
	 * @param array $matches Regex matches.
	 * @return string Modified image tag.
	 */
	private function add_dimensions_to_image( $matches ) {
		$img_tag = $matches[0];
		$src = $matches[1];

		// Skip if already has both dimensions.
		if ( strpos( $img_tag, 'width=' ) !== false && strpos( $img_tag, 'height=' ) !== false ) {
			return $img_tag;
		}

		// Try to get attachment ID from URL.
		$attachment_id = attachment_url_to_postid( $src );

		if ( $attachment_id ) {
			$image_data = wp_get_attachment_image_src( $attachment_id, 'full' );

			if ( $image_data ) {
				$width = $image_data[1];
				$height = $image_data[2];

				// Add missing width.
				if ( strpos( $img_tag, 'width=' ) === false ) {
					$img_tag = str_replace( '<img', '<img width="' . esc_attr( $width ) . '"', $img_tag );
				}

				// Add missing height.
				if ( strpos( $img_tag, 'height=' ) === false ) {
					$img_tag = str_replace( '<img', '<img height="' . esc_attr( $height ) . '"', $img_tag );
				}
			}
		}

		return $img_tag;
	}

	/**
	 * Output lazy loading JavaScript.
	 *
	 * @return void
	 */
	public function output_lazy_load_script() {
		$settings = Settings::get_instance();
		$threshold = $settings->get( 'lazy_load_threshold', 200 );
		?>
		<script id="gambol-lazy-load">
		(function() {
			'use strict';

			if (!('IntersectionObserver' in window)) {
				// Fallback for browsers without IntersectionObserver.
				var lazyImages = document.querySelectorAll('.gambol-lazy');
				lazyImages.forEach(function(img) {
					if (img.dataset.src) {
						img.src = img.dataset.src;
					}
					if (img.dataset.srcset) {
						img.srcset = img.dataset.srcset;
					}
					img.classList.remove('gambol-lazy');
					img.classList.add('gambol-lazy-loaded');
				});
				return;
			}

			var observer = new IntersectionObserver(function(entries, observer) {
				entries.forEach(function(entry) {
					if (entry.isIntersecting) {
						var img = entry.target;

						if (img.dataset.src) {
							img.src = img.dataset.src;
						}

						if (img.dataset.srcset) {
							img.srcset = img.dataset.srcset;
						}

						img.classList.remove('gambol-lazy');
						img.classList.add('gambol-lazy-loaded');
						observer.unobserve(img);
					}
				});
			}, {
				rootMargin: '<?php echo intval( $threshold ); ?>px 0px',
				threshold: 0.01
			});

			// Observe lazy images.
			var lazyImages = document.querySelectorAll('.gambol-lazy');
			lazyImages.forEach(function(img) {
				observer.observe(img);
			});

			// Handle dynamically added images.
			var mutationObserver = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					mutation.addedNodes.forEach(function(node) {
						if (node.nodeType !== 1) return;

						if (node.classList && node.classList.contains('gambol-lazy')) {
							observer.observe(node);
						}

						var lazyChildren = node.querySelectorAll ? node.querySelectorAll('.gambol-lazy') : [];
						lazyChildren.forEach(function(child) {
							observer.observe(child);
						});
					});
				});
			});

			mutationObserver.observe(document.body, {
				childList: true,
				subtree: true
			});
		})();
		</script>
		<?php
	}

	/**
	 * Output lazy loading styles.
	 *
	 * @return void
	 */
	public function output_lazy_load_styles() {
		?>
		<style id="gambol-lazy-load-styles">
			.gambol-lazy {
				opacity: 0;
				transition: opacity 0.3s ease;
			}
			.gambol-lazy-loaded {
				opacity: 1;
			}
		</style>
		<?php
	}
}
