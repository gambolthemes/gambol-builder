<?php
/**
 * WooCommerce Blocks - Server-Side Rendering
 *
 * Render callbacks for the dynamic WooCommerce blocks whose save() returns
 * null. Blocks are always registered; every render returns an empty string
 * when WooCommerce is not active.
 *
 * Markup and class names mirror each block's edit.js preview so the
 * existing style.scss rules apply on the frontend.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Blocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Woo Blocks Class.
 */
class Woo_Blocks {

	/**
	 * Whether the shared inline CSS/JS has been printed.
	 *
	 * @var bool
	 */
	private static $assets_printed = false;

	/**
	 * Recursion guard for the product tabs block (description tab runs the_content).
	 *
	 * @var bool
	 */
	private static $rendering_tabs = false;

	/**
	 * Initialize the class.
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_blocks' ) );
		add_filter( 'woocommerce_add_to_cart_fragments', array( __CLASS__, 'cart_fragments' ) );
	}

	/**
	 * Block definitions mirroring src/blocks/<name>/index.js.
	 *
	 * @return array
	 */
	private static function get_definitions() {
		$product_context = array( 'postId', 'postType' );

		return array(
			'add-to-cart'               => array(
				'attributes'   => array(
					'showQuantity'        => array( 'type' => 'boolean', 'default' => true ),
					'buttonText'          => array( 'type' => 'string', 'default' => 'Add to Cart' ),
					'buttonWidth'         => array( 'type' => 'string', 'default' => 'auto' ),
					'buttonAlign'         => array( 'type' => 'string', 'default' => 'left' ),
					'buttonColor'         => array( 'type' => 'string', 'default' => '#ffffff' ),
					'buttonBgColor'       => array( 'type' => 'string', 'default' => '' ),
					'buttonHoverBgColor'  => array( 'type' => 'string', 'default' => '' ),
					'borderRadius'        => array( 'type' => 'number', 'default' => 6 ),
					'fontSize'            => array( 'type' => 'number', 'default' => 16 ),
					'paddingX'            => array( 'type' => 'number', 'default' => 24 ),
					'paddingY'            => array( 'type' => 'number', 'default' => 14 ),
					'quantityBorderColor' => array( 'type' => 'string', 'default' => '' ),
				),
				'uses_context' => $product_context,
			),
			'cart'                      => array(
				'attributes' => array(
					'showProductImages' => array( 'type' => 'boolean', 'default' => true ),
					'showQuantity'      => array( 'type' => 'boolean', 'default' => true ),
					'showSubtotal'      => array( 'type' => 'boolean', 'default' => true ),
					'showRemoveButton'  => array( 'type' => 'boolean', 'default' => true ),
					'showCouponForm'    => array( 'type' => 'boolean', 'default' => true ),
					'showTotals'        => array( 'type' => 'boolean', 'default' => true ),
					'layout'            => array( 'type' => 'string', 'default' => 'two-columns' ),
					'headerBgColor'     => array( 'type' => 'string', 'default' => '' ),
					'borderColor'       => array( 'type' => 'string', 'default' => '' ),
					'buttonBgColor'     => array( 'type' => 'string', 'default' => '' ),
					'buttonTextColor'   => array( 'type' => 'string', 'default' => '' ),
				),
			),
			'mini-cart'                 => array(
				'attributes' => array(
					'showIcon'       => array( 'type' => 'boolean', 'default' => true ),
					'showCount'      => array( 'type' => 'boolean', 'default' => true ),
					'showTotal'      => array( 'type' => 'boolean', 'default' => true ),
					'iconSize'       => array( 'type' => 'number', 'default' => 24 ),
					'iconColor'      => array( 'type' => 'string', 'default' => '' ),
					'countBgColor'   => array( 'type' => 'string', 'default' => '' ),
					'countTextColor' => array( 'type' => 'string', 'default' => '' ),
					'totalColor'     => array( 'type' => 'string', 'default' => '' ),
					'dropdownStyle'  => array( 'type' => 'string', 'default' => 'dropdown' ),
					'textAlign'      => array( 'type' => 'string', 'default' => 'left' ),
				),
			),
			'products'                  => array(
				'attributes' => array(
					'productsPerPage'     => array( 'type' => 'number', 'default' => 8 ),
					'columns'             => array( 'type' => 'number', 'default' => 4 ),
					'orderBy'             => array( 'type' => 'string', 'default' => 'date' ),
					'order'               => array( 'type' => 'string', 'default' => 'desc' ),
					'showOnSale'          => array( 'type' => 'boolean', 'default' => false ),
					'showFeatured'        => array( 'type' => 'boolean', 'default' => false ),
					'showImage'           => array( 'type' => 'boolean', 'default' => true ),
					'showTitle'           => array( 'type' => 'boolean', 'default' => true ),
					'showPrice'           => array( 'type' => 'boolean', 'default' => true ),
					'showRating'          => array( 'type' => 'boolean', 'default' => true ),
					'showAddToCart'       => array( 'type' => 'boolean', 'default' => true ),
					'showBadge'           => array( 'type' => 'boolean', 'default' => true ),
					'imageRatio'          => array( 'type' => 'string', 'default' => '1/1' ),
					'gap'                 => array( 'type' => 'number', 'default' => 24 ),
					'cardBackgroundColor' => array( 'type' => 'string', 'default' => '#ffffff' ),
					'titleColor'          => array( 'type' => 'string', 'default' => '' ),
					'priceColor'          => array( 'type' => 'string', 'default' => '' ),
					'salePriceColor'      => array( 'type' => 'string', 'default' => '' ),
					'buttonColor'         => array( 'type' => 'string', 'default' => '' ),
					'buttonBgColor'       => array( 'type' => 'string', 'default' => '' ),
					'badgeColor'          => array( 'type' => 'string', 'default' => '#ffffff' ),
					'badgeBgColor'        => array( 'type' => 'string', 'default' => '#ff4757' ),
					'borderRadius'        => array( 'type' => 'number', 'default' => 8 ),
					'showShadow'          => array( 'type' => 'boolean', 'default' => true ),
				),
				'supports'   => array(
					'html'  => false,
					'align' => array( 'wide', 'full' ),
				),
			),
			'product-image'             => array(
				'attributes'   => array(
					'showSaleBadge' => array( 'type' => 'boolean', 'default' => true ),
					'showGallery'   => array( 'type' => 'boolean', 'default' => true ),
					'showZoom'      => array( 'type' => 'boolean', 'default' => true ),
					'showLightbox'  => array( 'type' => 'boolean', 'default' => true ),
					'imageSize'     => array( 'type' => 'string', 'default' => 'woocommerce_single' ),
					'borderRadius'  => array( 'type' => 'number', 'default' => 8 ),
					'badgeColor'    => array( 'type' => 'string', 'default' => '#ffffff' ),
					'badgeBgColor'  => array( 'type' => 'string', 'default' => '#ff4757' ),
				),
				'uses_context' => $product_context,
			),
			'product-meta'              => array(
				'attributes'   => array(
					'showSku'        => array( 'type' => 'boolean', 'default' => true ),
					'showCategories' => array( 'type' => 'boolean', 'default' => true ),
					'showTags'       => array( 'type' => 'boolean', 'default' => true ),
					'layout'         => array( 'type' => 'string', 'default' => 'stacked' ),
					'gap'            => array( 'type' => 'number', 'default' => 8 ),
					'labelColor'     => array( 'type' => 'string', 'default' => '' ),
					'valueColor'     => array( 'type' => 'string', 'default' => '' ),
					'linkColor'      => array( 'type' => 'string', 'default' => '' ),
					'fontSize'       => array( 'type' => 'number', 'default' => 14 ),
				),
				'uses_context' => $product_context,
			),
			'product-price'             => array(
				'attributes'   => array(
					'textAlign'         => array( 'type' => 'string', 'default' => 'left' ),
					'priceColor'        => array( 'type' => 'string', 'default' => '' ),
					'salePriceColor'    => array( 'type' => 'string', 'default' => '' ),
					'regularPriceColor' => array( 'type' => 'string', 'default' => '' ),
					'fontSize'          => array( 'type' => 'number', 'default' => 24 ),
					'fontWeight'        => array( 'type' => 'string', 'default' => '700' ),
				),
				'uses_context' => $product_context,
			),
			'product-rating'            => array(
				'attributes'   => array(
					'textAlign'      => array( 'type' => 'string', 'default' => 'left' ),
					'showCount'      => array( 'type' => 'boolean', 'default' => true ),
					'starSize'       => array( 'type' => 'number', 'default' => 18 ),
					'starColor'      => array( 'type' => 'string', 'default' => '#ffc107' ),
					'starEmptyColor' => array( 'type' => 'string', 'default' => '#e0e0e0' ),
					'countColor'     => array( 'type' => 'string', 'default' => '' ),
				),
				'uses_context' => $product_context,
			),
			'product-related'           => array(
				'attributes'   => array(
					'columns'         => array( 'type' => 'number', 'default' => 4 ),
					'productsPerPage' => array( 'type' => 'number', 'default' => 4 ),
					'showTitle'       => array( 'type' => 'boolean', 'default' => true ),
					'title'           => array( 'type' => 'string', 'default' => 'Related Products' ),
					'gap'             => array( 'type' => 'number', 'default' => 24 ),
					'showPrice'       => array( 'type' => 'boolean', 'default' => true ),
					'showRating'      => array( 'type' => 'boolean', 'default' => true ),
					'showAddToCart'   => array( 'type' => 'boolean', 'default' => true ),
					'titleColor'      => array( 'type' => 'string', 'default' => '' ),
				),
				'uses_context' => $product_context,
			),
			'product-short-description' => array(
				'attributes'   => array(
					'textAlign'  => array( 'type' => 'string', 'default' => 'left' ),
					'fontSize'   => array( 'type' => 'number', 'default' => 16 ),
					'lineHeight' => array( 'type' => 'number', 'default' => 1.6 ),
					'textColor'  => array( 'type' => 'string', 'default' => '' ),
				),
				'uses_context' => $product_context,
			),
			'product-stock'             => array(
				'attributes'   => array(
					'showIcon'        => array( 'type' => 'boolean', 'default' => true ),
					'showQuantity'    => array( 'type' => 'boolean', 'default' => false ),
					'textAlign'       => array( 'type' => 'string', 'default' => 'left' ),
					'fontSize'        => array( 'type' => 'number', 'default' => 14 ),
					'inStockColor'    => array( 'type' => 'string', 'default' => '#28a745' ),
					'lowStockColor'   => array( 'type' => 'string', 'default' => '#ffc107' ),
					'outOfStockColor' => array( 'type' => 'string', 'default' => '#dc3545' ),
				),
				'uses_context' => $product_context,
			),
			'product-tabs'              => array(
				'attributes'   => array(
					'showDescription'    => array( 'type' => 'boolean', 'default' => true ),
					'showReviews'        => array( 'type' => 'boolean', 'default' => true ),
					'showAdditionalInfo' => array( 'type' => 'boolean', 'default' => true ),
					'layout'             => array( 'type' => 'string', 'default' => 'horizontal' ),
					'tabBgColor'         => array( 'type' => 'string', 'default' => '' ),
					'tabActiveColor'     => array( 'type' => 'string', 'default' => '' ),
					'tabTextColor'       => array( 'type' => 'string', 'default' => '' ),
					'tabActiveTextColor' => array( 'type' => 'string', 'default' => '' ),
					'borderRadius'       => array( 'type' => 'number', 'default' => 0 ),
					'contentPadding'     => array( 'type' => 'number', 'default' => 24 ),
				),
				'uses_context' => $product_context,
			),
			'product-title'             => array(
				'attributes'   => array(
					'tag'        => array( 'type' => 'string', 'default' => 'h1' ),
					'textAlign'  => array( 'type' => 'string', 'default' => 'left' ),
					'titleColor' => array( 'type' => 'string', 'default' => '' ),
					'fontSize'   => array( 'type' => 'number', 'default' => 32 ),
					'fontWeight' => array( 'type' => 'string', 'default' => '700' ),
					'lineHeight' => array( 'type' => 'number', 'default' => 1.2 ),
				),
				'uses_context' => $product_context,
			),
			'product-upsells'           => array(
				'attributes'   => array(
					'columns'         => array( 'type' => 'number', 'default' => 4 ),
					'productsPerPage' => array( 'type' => 'number', 'default' => 4 ),
					'showTitle'       => array( 'type' => 'boolean', 'default' => true ),
					'title'           => array( 'type' => 'string', 'default' => 'You may also like…' ),
					'gap'             => array( 'type' => 'number', 'default' => 24 ),
					'showPrice'       => array( 'type' => 'boolean', 'default' => true ),
					'showRating'      => array( 'type' => 'boolean', 'default' => true ),
					'showAddToCart'   => array( 'type' => 'boolean', 'default' => true ),
					'titleColor'      => array( 'type' => 'string', 'default' => '' ),
				),
				'uses_context' => $product_context,
			),
		);
	}

	/**
	 * Register the blocks with render callbacks.
	 */
	public static function register_blocks() {
		$registry = \WP_Block_Type_Registry::get_instance();

		foreach ( self::get_definitions() as $name => $definition ) {
			$block_name = 'gambol/' . $name;
			$method     = 'render_' . str_replace( '-', '_', $name );

			if ( $registry->is_registered( $block_name ) || ! method_exists( __CLASS__, $method ) ) {
				continue;
			}

			$attributes           = $definition['attributes'];
			$attributes['anchor'] = array( 'type' => 'string' );

			$args = array(
				'api_version'     => 3,
				'attributes'      => $attributes,
				'supports'        => isset( $definition['supports'] ) ? $definition['supports'] : array( 'html' => false ),
				'render_callback' => array( __CLASS__, $method ),
				// Handle is registered later on `init` by the main plugin file; it is resolved at enqueue time.
				'style'           => 'gambol-builder-style',
			);

			if ( ! empty( $definition['uses_context'] ) ) {
				$args['uses_context'] = $definition['uses_context'];
			}

			register_block_type( $block_name, $args );
		}
	}

	/*
	 * ---------------------------------------------------------------------
	 * Helpers
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Whether WooCommerce is available.
	 *
	 * @return bool
	 */
	private static function wc_active() {
		return class_exists( 'WooCommerce' ) && function_exists( 'wc_get_product' ) && function_exists( 'WC' );
	}

	/**
	 * Merge attributes with the index.js defaults.
	 *
	 * @param string $name       Block name without namespace.
	 * @param array  $attributes Block attributes.
	 * @return array
	 */
	private static function attrs( $name, $attributes ) {
		$definitions = self::get_definitions();
		$defaults    = array();

		if ( isset( $definitions[ $name ] ) ) {
			foreach ( $definitions[ $name ]['attributes'] as $key => $schema ) {
				$defaults[ $key ] = isset( $schema['default'] ) ? $schema['default'] : null;
			}
		}

		return wp_parse_args( is_array( $attributes ) ? $attributes : array(), $defaults );
	}

	/**
	 * Sanitize a single CSS value.
	 *
	 * @param mixed $value Raw value.
	 * @return string
	 */
	private static function css_value( $value ) {
		if ( ! is_scalar( $value ) ) {
			return '';
		}
		$value = trim( (string) $value );
		$value = preg_replace( '/[;{}<>"\\\\]/', '', $value );
		if ( false !== stripos( $value, 'url(' ) || false !== stripos( $value, 'expression(' ) ) {
			return '';
		}
		return $value;
	}

	/**
	 * Build an inline style string, skipping empty values.
	 *
	 * @param array $declarations CSS declarations.
	 * @return string
	 */
	private static function style( $declarations ) {
		$out = array();
		foreach ( $declarations as $property => $value ) {
			$value = self::css_value( $value );
			if ( '' !== $value ) {
				$out[] = $property . ':' . $value;
			}
		}
		return implode( ';', $out );
	}

	/**
	 * Build a scoped <style> element from selector => declarations.
	 *
	 * @param array $rules Rules.
	 * @return string
	 */
	private static function scoped_style( $rules ) {
		$css = '';
		foreach ( $rules as $selector => $declarations ) {
			$body = self::style( $declarations );
			if ( '' !== $body ) {
				$css .= $selector . '{' . $body . '}';
			}
		}
		return '' === $css ? '' : '<style>' . $css . '</style>';
	}

	/**
	 * Inline style attribute (with leading space) or empty string.
	 *
	 * @param array $declarations CSS declarations.
	 * @return string
	 */
	private static function style_attr( $declarations ) {
		$style = self::style( $declarations );
		return '' === $style ? '' : ' style="' . esc_attr( $style ) . '"';
	}

	/**
	 * Build wrapper attributes (adds anchor id and alignment class).
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $classes    Extra classes.
	 * @param string $style      Inline style.
	 * @param array  $extra      Additional attributes.
	 * @return string
	 */
	private static function wrapper( $attributes, $classes, $style = '', $extra = array() ) {
		$class_list = array( $classes );
		if ( ! empty( $attributes['align'] ) && is_string( $attributes['align'] ) ) {
			$class_list[] = 'align' . sanitize_html_class( $attributes['align'] );
		}
		$extra['class'] = implode( ' ', array_filter( $class_list ) );
		if ( '' !== $style ) {
			$extra['style'] = $style;
		}
		if ( ! empty( $attributes['anchor'] ) && is_string( $attributes['anchor'] ) ) {
			$extra['id'] = $attributes['anchor'];
		}
		return get_block_wrapper_attributes( $extra );
	}

	/**
	 * Map a text alignment to a flex justify-content value.
	 *
	 * @param string $align Alignment.
	 * @return string
	 */
	private static function justify( $align ) {
		if ( 'center' === $align ) {
			return 'center';
		}
		if ( 'right' === $align ) {
			return 'flex-end';
		}
		return 'flex-start';
	}

	/**
	 * Whitelisted text-align value.
	 *
	 * @param string $align Alignment.
	 * @return string
	 */
	private static function text_align( $align ) {
		return in_array( $align, array( 'left', 'center', 'right', 'justify' ), true ) ? $align : 'left';
	}

	/**
	 * Resolve the product for a product-* block.
	 *
	 * Order: productId attribute (if present) -> block context postId ->
	 * global $product -> get_the_ID() / queried object.
	 *
	 * @param array          $attributes Block attributes.
	 * @param \WP_Block|null $block      Block instance.
	 * @return \WC_Product|null
	 */
	private static function get_product( $attributes, $block = null ) {
		if ( ! self::wc_active() ) {
			return null;
		}

		$candidates = array();

		if ( ! empty( $attributes['productId'] ) ) {
			$candidates[] = (int) $attributes['productId'];
		}
		if ( $block instanceof \WP_Block && ! empty( $block->context['postId'] ) ) {
			$candidates[] = (int) $block->context['postId'];
		}

		foreach ( $candidates as $id ) {
			$candidate = wc_get_product( $id );
			if ( $candidate instanceof \WC_Product ) {
				return $candidate;
			}
		}

		global $product;
		if ( $product instanceof \WC_Product ) {
			return $product;
		}

		$ids = array( (int) get_the_ID() );
		if ( is_singular( 'product' ) ) {
			array_unshift( $ids, (int) get_queried_object_id() );
		}
		foreach ( array_filter( $ids ) as $id ) {
			$found = wc_get_product( $id );
			if ( $found instanceof \WC_Product ) {
				return $found;
			}
		}

		return null;
	}

	/**
	 * Run a callback with the global $product / $post set to a product
	 * (needed by WooCommerce template functions), then restore them.
	 *
	 * @param \WC_Product $the_product Product.
	 * @param callable    $callback    Callback.
	 * @return mixed
	 */
	private static function with_product_globals( $the_product, $callback ) {
		global $product, $post;

		$previous_product = $product;
		$previous_post    = $post;

		$product_post = get_post( $the_product->get_id() );
		$product      = $the_product;
		if ( $product_post ) {
			$post = $product_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			setup_postdata( $post );
		}

		$result = call_user_func( $callback );

		$product = $previous_product;
		$post    = $previous_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		if ( $previous_post instanceof \WP_Post ) {
			setup_postdata( $previous_post );
		}

		return $result;
	}

	/**
	 * Five SVG stars (filled / empty).
	 *
	 * @param float  $rating      Average rating.
	 * @param int    $size        Star size in px.
	 * @param string $fill        Filled colour.
	 * @param string $empty       Empty colour.
	 * @return string
	 */
	private static function svg_stars( $rating, $size, $fill, $empty ) {
		$fill  = self::css_value( $fill ) ? self::css_value( $fill ) : '#ffc107';
		$empty = self::css_value( $empty ) ? self::css_value( $empty ) : '#e0e0e0';
		$html  = '';
		for ( $i = 0; $i < 5; $i++ ) {
			$on    = $i < round( $rating * 2 ) / 2;
			$html .= sprintf(
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="%1$d" height="%1$d" fill="%2$s" aria-hidden="true" focusable="false"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
				(int) $size,
				esc_attr( $on ? $fill : $empty )
			);
		}
		return $html;
	}

	/**
	 * Loop-style add to cart link (same attributes as WooCommerce's loop button).
	 *
	 * @param \WC_Product $product Product.
	 * @param string      $class   CSS class.
	 * @param string      $style   Inline style.
	 * @return string
	 */
	private static function loop_add_to_cart( $product, $class, $style = '' ) {
		$classes = array( $class, 'button', 'product_type_' . $product->get_type() );
		if ( $product->is_purchasable() && $product->is_in_stock() ) {
			$classes[] = 'add_to_cart_button';
			if ( $product->supports( 'ajax_add_to_cart' ) ) {
				$classes[] = 'ajax_add_to_cart';
			}
		}

		return sprintf(
			'<a href="%1$s" data-quantity="1" data-product_id="%2$d" data-product_sku="%3$s" class="%4$s" aria-label="%5$s" rel="nofollow"%6$s>%7$s</a>',
			esc_url( $product->add_to_cart_url() ),
			(int) $product->get_id(),
			esc_attr( $product->get_sku() ),
			esc_attr( implode( ' ', array_map( 'sanitize_html_class', $classes ) ) ),
			esc_attr( wp_strip_all_tags( $product->add_to_cart_description() ) ),
			$style ? ' style="' . esc_attr( $style ) . '"' : '',
			esc_html( $product->add_to_cart_text() )
		);
	}

	/**
	 * Accessible rating label.
	 *
	 * @param float $rating Rating.
	 * @return string
	 */
	private static function rating_label( $rating ) {
		/* translators: %s: average rating. */
		return sprintf( __( 'Rated %s out of 5', 'gambol-builder' ), number_format_i18n( (float) $rating, 2 ) );
	}

	/**
	 * Shared CSS + JS (printed once).
	 *
	 * @return string
	 */
	private static function shared_assets() {
		if ( self::$assets_printed ) {
			return '';
		}
		self::$assets_printed = true;

		$css = '.gambol-sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}'
			. '.mini-cart__toggle{background:none;border:0;color:inherit;font:inherit}'
			. '.mini-cart__dropdown[hidden]{display:none}'
			. '.mini-cart__dropdown.is-sidebar{position:fixed;top:0;right:0;bottom:0;width:min(360px,100%);margin:0;border-radius:0;overflow:auto;z-index:99999}'
			. '.mini-cart__close{position:absolute;top:8px;right:8px;background:none;border:0;font-size:24px;line-height:1;cursor:pointer;color:inherit}'
			. '.wp-block-gambol-product-image__main img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .3s ease}'
			. '.wp-block-gambol-product-image.has-zoom .wp-block-gambol-product-image__main:hover img{transform:scale(1.5)}'
			. '.wp-block-gambol-product-image__thumb{padding:0;border:2px solid transparent;background:none}'
			. '.wp-block-gambol-product-image__thumb[aria-pressed="true"]{border-color:var(--gb-colors-primary)}'
			. '.wp-block-gambol-product-image__thumb img{width:100%;height:100%;object-fit:cover}'
			. '.wp-block-gambol-product-image__lightbox-btn:focus{opacity:1}'
			. '.product-tabs__panel[hidden]{display:none}'
			. '.wp-block-gambol-products__image img,.related-product-card__image img,.upsell-product-card__image img{display:block}';

		$js = <<<'JS'
(function(){
	function ready(fn){ if(document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);} }
	ready(function(){
		/* Quantity +/- buttons */
		document.addEventListener('click',function(e){
			var btn=e.target.closest('.wp-block-gambol-add-to-cart__quantity .qty-btn');
			if(!btn){return;}
			var input=btn.parentNode.querySelector('input.qty');
			if(!input){return;}
			try{ if(btn.classList.contains('minus')){input.stepDown();}else{input.stepUp();} }catch(err){}
			input.dispatchEvent(new Event('change',{bubbles:true}));
		});
		/* Mini cart */
		document.querySelectorAll('.wp-block-gambol-mini-cart').forEach(function(mc){
			var toggle=mc.querySelector('.mini-cart__toggle');
			var panel=mc.querySelector('.mini-cart__dropdown');
			if(!toggle||!panel){return;}
			function setOpen(open){
				panel.hidden=!open;
				toggle.setAttribute('aria-expanded',open?'true':'false');
				if(!open){return;}
				var f=panel.querySelector('a,button,input');
				if(f && panel.classList.contains('is-sidebar')){f.focus();}
			}
			toggle.addEventListener('click',function(){setOpen(panel.hidden);});
			var close=panel.querySelector('.mini-cart__close');
			if(close){close.addEventListener('click',function(){setOpen(false);toggle.focus();});}
			document.addEventListener('keydown',function(e){ if(e.key==='Escape' && !panel.hidden){setOpen(false);toggle.focus();} });
			document.addEventListener('click',function(e){ if(!panel.hidden && !mc.contains(e.target)){setOpen(false);} });
		});
		/* Product tabs */
		document.querySelectorAll('.wp-block-gambol-product-tabs').forEach(function(wrap){
			var tabs=Array.prototype.slice.call(wrap.querySelectorAll('.product-tabs__tab'));
			function activate(tab,focus){
				tabs.forEach(function(t){
					var on=t===tab;
					t.classList.toggle('is-active',on);
					t.setAttribute('aria-selected',on?'true':'false');
					t.setAttribute('tabindex',on?'0':'-1');
					var p=document.getElementById(t.getAttribute('aria-controls'));
					if(p){p.hidden=!on;}
				});
				if(focus){tab.focus();}
			}
			tabs.forEach(function(tab,i){
				tab.addEventListener('click',function(){activate(tab,false);});
				tab.addEventListener('keydown',function(e){
					var n=null;
					if(e.key==='ArrowRight'||e.key==='ArrowDown'){n=tabs[(i+1)%tabs.length];}
					else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){n=tabs[(i-1+tabs.length)%tabs.length];}
					else if(e.key==='Home'){n=tabs[0];}
					else if(e.key==='End'){n=tabs[tabs.length-1];}
					if(n){e.preventDefault();activate(n,true);}
				});
			});
			if(window.location.hash){
				var t=wrap.querySelector('.product-tabs__tab[data-tab="'+window.location.hash.slice(1).replace(/^tab-/,'')+'"]');
				if(t){activate(t,false);}
			}
		});
		/* Product image gallery */
		document.querySelectorAll('.wp-block-gambol-product-image').forEach(function(wrap){
			var main=wrap.querySelector('.wp-block-gambol-product-image__main img');
			var lb=wrap.querySelector('.wp-block-gambol-product-image__lightbox-btn');
			var thumbs=wrap.querySelectorAll('.wp-block-gambol-product-image__thumb');
			thumbs.forEach(function(th){
				th.addEventListener('click',function(){
					if(main){
						main.src=th.getAttribute('data-src');
						if(th.getAttribute('data-srcset')){main.srcset=th.getAttribute('data-srcset');}else{main.removeAttribute('srcset');}
						main.alt=th.getAttribute('data-alt')||'';
					}
					if(lb){lb.href=th.getAttribute('data-full');}
					thumbs.forEach(function(o){o.setAttribute('aria-pressed',o===th?'true':'false');});
				});
			});
		});
	});
})();
JS;

		return '<style id="gambol-woo-blocks-css">' . $css . '</style>'
			. '<script id="gambol-woo-blocks-js">' . $js . '</script>';
	}

	/**
	 * Keep the mini cart count/total in sync via WooCommerce cart fragments.
	 *
	 * @param array $fragments Fragments.
	 * @return array
	 */
	public static function cart_fragments( $fragments ) {
		if ( ! self::wc_active() || ! WC()->cart ) {
			return $fragments;
		}
		$fragments['span.gambol-mini-cart-count-value'] = '<span class="gambol-mini-cart-count-value">' . esc_html( WC()->cart->get_cart_contents_count() ) . '</span>';
		$fragments['span.gambol-mini-cart-total-value'] = '<span class="gambol-mini-cart-total-value">' . wp_kses_post( WC()->cart->get_cart_subtotal() ) . '</span>';
		return $fragments;
	}

	/*
	 * ---------------------------------------------------------------------
	 * Add to Cart
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Add to Cart block.
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Content.
	 * @param \WP_Block $block      Block.
	 * @return string
	 */
	public static function render_add_to_cart( $attributes, $content = '', $block = null ) {
		$product = self::get_product( $attributes, $block );
		if ( ! $product ) {
			return '';
		}

		$a       = self::attrs( 'add-to-cart', $attributes );
		$uid     = wp_unique_id( 'gambol-atc-' );
		$radius  = (float) $a['borderRadius'] . 'px';
		$justify = self::justify( $a['buttonAlign'] );

		$hover = self::scoped_style(
			array(
				'.' . $uid . ' .wp-block-gambol-add-to-cart__button:hover' => array( 'background-color' => $a['buttonHoverBgColor'] ? self::css_value( $a['buttonHoverBgColor'] ) . '!important' : '' ),
			)
		);

		// Variable, grouped, external, etc: use WooCommerce's own form inside the wrapper.
		if ( ! $product->is_type( 'simple' ) ) {
			if ( ! function_exists( 'woocommerce_template_single_add_to_cart' ) ) {
				return '';
			}
			$form = self::with_product_globals(
				$product,
				function () {
					ob_start();
					woocommerce_template_single_add_to_cart();
					return ob_get_clean();
				}
			);
			if ( '' === trim( (string) $form ) ) {
				return '';
			}
			return self::shared_assets() . $hover . '<div ' . self::wrapper( $a, 'wp-block-gambol-add-to-cart ' . $uid, self::style( array( 'justify-content' => $justify ) ) ) . '>' . $form . '</div>';
		}

		if ( ! $product->is_purchasable() || ! $product->is_in_stock() ) {
			// Show WooCommerce's stock message (e.g. "Out of stock") instead of a dead button.
			$stock = wc_get_stock_html( $product );
			return $stock ? '<div ' . self::wrapper( $a, 'wp-block-gambol-add-to-cart ' . $uid ) . '>' . wp_kses_post( $stock ) . '</div>' : '';
		}

		$button_css = self::style(
			array(
				'color'            => $a['buttonColor'] ? $a['buttonColor'] : '#fff',
				'background-color' => $a['buttonBgColor'] ? $a['buttonBgColor'] : 'var(--gb-colors-primary)',
				'border-radius'    => $radius,
				'font-size'        => (float) $a['fontSize'] . 'px',
				'padding'          => (float) $a['paddingY'] . 'px ' . (float) $a['paddingX'] . 'px',
				'width'            => 'full' === $a['buttonWidth'] ? '100%' : 'auto',
			)
		);
		$qty_css    = self::style(
			array(
				'border-color'  => $a['quantityBorderColor'] ? $a['quantityBorderColor'] : 'var(--gb-colors-gray-300)',
				'border-radius' => $radius,
			)
		);

		$button_text = '' !== trim( (string) $a['buttonText'] ) ? $a['buttonText'] : $product->single_add_to_cart_text();
		$min         = $product->get_min_purchase_quantity();
		$max         = $product->get_max_purchase_quantity();
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		$value   = isset( $_POST['quantity'] ) ? wc_stock_amount( wp_unslash( $_POST['quantity'] ) ) : $min;
		$qty_id  = $uid . '-qty';
		$action  = apply_filters( 'woocommerce_add_to_cart_form_action', $product->get_permalink() );
		$show_qt = ! empty( $a['showQuantity'] ) && ! $product->is_sold_individually();

		ob_start();
		?>
		<form <?php echo self::wrapper( $a, 'wp-block-gambol-add-to-cart cart ' . $uid, self::style( array( 'justify-content' => $justify ) ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> action="<?php echo esc_url( $action ); ?>" method="post" enctype="multipart/form-data">
			<?php do_action( 'woocommerce_before_add_to_cart_button' ); ?>
			<?php if ( $show_qt ) : ?>
				<?php do_action( 'woocommerce_before_add_to_cart_quantity' ); ?>
				<div class="wp-block-gambol-add-to-cart__quantity quantity" style="<?php echo esc_attr( $qty_css ); ?>">
					<button type="button" class="qty-btn minus" aria-label="<?php esc_attr_e( 'Decrease quantity', 'gambol-builder' ); ?>" aria-controls="<?php echo esc_attr( $qty_id ); ?>">&minus;</button>
					<label class="gambol-sr-only" for="<?php echo esc_attr( $qty_id ); ?>">
						<?php
						/* translators: %s: product name. */
						echo esc_html( sprintf( __( '%s quantity', 'gambol-builder' ), $product->get_name() ) );
						?>
					</label>
					<input type="number" id="<?php echo esc_attr( $qty_id ); ?>" class="input-text qty text" name="quantity" value="<?php echo esc_attr( $value ); ?>" min="<?php echo esc_attr( $min ); ?>"<?php echo ( $max > 0 ) ? ' max="' . esc_attr( $max ) . '"' : ''; ?> step="1" inputmode="numeric" autocomplete="off" />
					<button type="button" class="qty-btn plus" aria-label="<?php esc_attr_e( 'Increase quantity', 'gambol-builder' ); ?>" aria-controls="<?php echo esc_attr( $qty_id ); ?>">+</button>
				</div>
				<?php do_action( 'woocommerce_after_add_to_cart_quantity' ); ?>
			<?php endif; ?>
			<button type="submit" name="add-to-cart" value="<?php echo esc_attr( $product->get_id() ); ?>" class="wp-block-gambol-add-to-cart__button single_add_to_cart_button" style="<?php echo esc_attr( $button_css ); ?>">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true" focusable="false"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
				<span><?php echo esc_html( $button_text ); ?></span>
			</button>
			<?php do_action( 'woocommerce_after_add_to_cart_button' ); ?>
		</form>
		<?php
		return self::shared_assets() . $hover . ob_get_clean();
	}

	/*
	 * ---------------------------------------------------------------------
	 * Cart
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Cart block (WooCommerce's cart shortcode, restyled via scoped CSS).
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_cart( $attributes ) {
		if ( ! self::wc_active() || ! WC()->cart ) {
			return '';
		}

		$a      = self::attrs( 'cart', $attributes );
		$layout = in_array( $a['layout'], array( 'two-columns', 'one-column' ), true ) ? $a['layout'] : 'two-columns';
		$uid    = wp_unique_id( 'gambol-cart-' );
		$s      = '.' . $uid;
		$hide   = array( 'display' => 'none' );

		$rules = array(
			$s . ' table.shop_table thead th' => array( 'background-color' => $a['headerBgColor'] ),
			$s . ' table.shop_table,' . $s . ' table.shop_table td,' . $s . ' table.shop_table th,' . $s . ' .cart_totals' => array( 'border-color' => $a['borderColor'] ),
			$s . ' .button,' . $s . ' .checkout-button' => array(
				'background-color' => $a['buttonBgColor'],
				'color'            => $a['buttonTextColor'],
			),
		);
		if ( empty( $a['showProductImages'] ) ) {
			$rules[ $s . ' .product-thumbnail' ] = $hide;
		}
		if ( empty( $a['showQuantity'] ) ) {
			$rules[ $s . ' .product-quantity' ] = $hide;
		}
		if ( empty( $a['showSubtotal'] ) ) {
			$rules[ $s . ' .woocommerce-cart-form .product-subtotal' ] = $hide;
		}
		if ( empty( $a['showRemoveButton'] ) ) {
			$rules[ $s . ' .product-remove' ] = $hide;
		}
		if ( empty( $a['showCouponForm'] ) ) {
			$rules[ $s . ' .coupon' ] = $hide;
		}
		if ( empty( $a['showTotals'] ) ) {
			$rules[ $s . ' .cart-collaterals' ] = $hide;
		}

		$style = self::scoped_style( $rules );
		if ( 'two-columns' === $layout && ! empty( $a['showTotals'] ) ) {
			$style .= '<style>@media (min-width:900px){' . $s . ' .woocommerce{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:32px;align-items:start}' . $s . ' .woocommerce>*:not(.woocommerce-cart-form):not(.cart-collaterals){grid-column:1/-1}' . $s . ' .cart-collaterals .cart_totals{width:100%;float:none}}</style>';
		}

		$cart = do_shortcode( '[woocommerce_cart]' );
		if ( '' === trim( $cart ) ) {
			return '';
		}

		return $style . '<div ' . self::wrapper( $a, 'wp-block-gambol-cart layout-' . $layout . ' ' . $uid ) . '>' . $cart . '</div>';
	}

	/*
	 * ---------------------------------------------------------------------
	 * Mini Cart
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Mini Cart block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_mini_cart( $attributes ) {
		if ( ! self::wc_active() || ! WC()->cart || ! function_exists( 'woocommerce_mini_cart' ) ) {
			return '';
		}

		$a        = self::attrs( 'mini-cart', $attributes );
		$uid      = wp_unique_id( 'gambol-mini-cart-' );
		$panel_id = $uid . '-panel';
		$sidebar  = 'sidebar' === $a['dropdownStyle'];
		$size     = max( 8, (int) $a['iconSize'] );
		$count    = WC()->cart->get_cart_contents_count();

		if ( wp_script_is( 'wc-cart-fragments', 'registered' ) ) {
			wp_enqueue_script( 'wc-cart-fragments' );
		}

		ob_start();
		woocommerce_mini_cart();
		$mini_cart = ob_get_clean();

		ob_start();
		?>
		<div <?php echo self::wrapper( $a, 'wp-block-gambol-mini-cart', self::style( array( 'justify-content' => self::justify( $a['textAlign'] ) ) ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<button type="button" class="mini-cart__toggle" aria-expanded="false" aria-controls="<?php echo esc_attr( $panel_id ); ?>">
				<span class="gambol-sr-only"><?php esc_html_e( 'Shopping cart', 'gambol-builder' ); ?></span>
				<?php if ( ! empty( $a['showIcon'] ) ) : ?>
					<span class="mini-cart__icon"<?php echo self::style_attr( array( 'color' => $a['iconColor'] ? $a['iconColor'] : 'inherit' ) ); // phpcs:ignore ?>>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="<?php echo (int) $size; ?>" height="<?php echo (int) $size; ?>" aria-hidden="true" focusable="false"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
						<?php if ( ! empty( $a['showCount'] ) ) : ?>
							<span class="mini-cart__count"<?php echo self::style_attr( array( 'background-color' => $a['countBgColor'] ? $a['countBgColor'] : 'var(--gb-colors-primary)', 'color' => $a['countTextColor'] ? $a['countTextColor'] : '#fff' ) ); // phpcs:ignore ?>><span class="gambol-mini-cart-count-value"><?php echo esc_html( $count ); ?></span><span class="gambol-sr-only"> <?php esc_html_e( 'items', 'gambol-builder' ); ?></span></span>
						<?php endif; ?>
					</span>
				<?php elseif ( ! empty( $a['showCount'] ) ) : ?>
					<span class="mini-cart__count"<?php echo self::style_attr( array( 'position' => 'static', 'background-color' => $a['countBgColor'] ? $a['countBgColor'] : 'var(--gb-colors-primary)', 'color' => $a['countTextColor'] ? $a['countTextColor'] : '#fff' ) ); // phpcs:ignore ?>><span class="gambol-mini-cart-count-value"><?php echo esc_html( $count ); ?></span><span class="gambol-sr-only"> <?php esc_html_e( 'items', 'gambol-builder' ); ?></span></span>
				<?php endif; ?>
				<?php if ( ! empty( $a['showTotal'] ) ) : ?>
					<span class="mini-cart__total"<?php echo self::style_attr( array( 'color' => $a['totalColor'] ? $a['totalColor'] : 'inherit' ) ); // phpcs:ignore ?>><span class="gambol-mini-cart-total-value"><?php echo wp_kses_post( WC()->cart->get_cart_subtotal() ); ?></span></span>
				<?php endif; ?>
			</button>
			<div id="<?php echo esc_attr( $panel_id ); ?>" class="mini-cart__dropdown<?php echo $sidebar ? ' is-sidebar' : ''; ?>"<?php echo $sidebar ? ' role="dialog" aria-label="' . esc_attr__( 'Shopping cart', 'gambol-builder' ) . '"' : ''; ?> hidden>
				<?php if ( $sidebar ) : ?>
					<button type="button" class="mini-cart__close" aria-label="<?php esc_attr_e( 'Close cart', 'gambol-builder' ); ?>">&times;</button>
				<?php endif; ?>
				<div class="mini-cart__items"><div class="widget_shopping_cart_content"><?php echo $mini_cart; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- WooCommerce template output. ?></div></div>
			</div>
		</div>
		<?php
		return self::shared_assets() . ob_get_clean();
	}

	/*
	 * ---------------------------------------------------------------------
	 * Products grid
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Products block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_products( $attributes ) {
		if ( ! self::wc_active() || ! function_exists( 'wc_get_products' ) ) {
			return '';
		}

		$a     = self::attrs( 'products', $attributes );
		$limit = max( 1, min( 100, (int) $a['productsPerPage'] ) );
		$order = 'asc' === strtolower( (string) $a['order'] ) ? 'ASC' : 'DESC';

		$args = array(
			'status'     => 'publish',
			'limit'      => $limit,
			'visibility' => 'catalog',
			'order'      => $order,
			'orderby'    => 'date',
			'return'     => 'objects',
		);

		switch ( $a['orderBy'] ) {
			case 'price':
				$args['orderby']  = 'meta_value_num';
				$args['meta_key'] = '_price'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				break;
			case 'popularity':
				$args['orderby']  = 'meta_value_num';
				$args['meta_key'] = 'total_sales'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				break;
			case 'rating':
				$args['orderby']  = 'meta_value_num';
				$args['meta_key'] = '_wc_average_rating'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				break;
		}

		if ( 'yes' === get_option( 'woocommerce_hide_out_of_stock_items' ) ) {
			$args['stock_status'] = 'instock';
		}
		if ( ! empty( $a['showFeatured'] ) ) {
			$args['featured'] = true;
		}
		if ( ! empty( $a['showOnSale'] ) ) {
			$on_sale = wc_get_product_ids_on_sale();
			if ( empty( $on_sale ) ) {
				return '';
			}
			$args['include'] = $on_sale;
		}

		$products = wc_get_products( $args );
		if ( empty( $products ) ) {
			return '';
		}

		$uid       = wp_unique_id( 'gambol-products-' );
		$s         = '.' . $uid;
		$columns   = max( 1, min( 6, (int) $a['columns'] ) );
		$ratio     = preg_match( '#^\d+(\.\d+)?\s*/\s*\d+(\.\d+)?$#', (string) $a['imageRatio'] ) ? $a['imageRatio'] : '1/1';
		$card_css  = self::style(
			array(
				'background-color' => $a['cardBackgroundColor'],
				'border-radius'    => (float) $a['borderRadius'] . 'px',
			)
		);
		$btn_css   = self::style(
			array(
				'color'            => $a['buttonColor'],
				'background-color' => $a['buttonBgColor'],
			)
		);
		$badge_css = self::style(
			array(
				'color'            => $a['badgeColor'],
				'background-color' => $a['badgeBgColor'],
			)
		);

		$style = self::scoped_style(
			array(
				$s . ' .wp-block-gambol-products__price'     => array( 'color' => $a['priceColor'] ),
				$s . ' .wp-block-gambol-products__price ins' => array( 'color' => $a['salePriceColor'] ? $a['salePriceColor'] : 'var(--gb-colors-primary)' ),
				$s . ' .wp-block-gambol-products__title a'   => array( 'color' => $a['titleColor'] ? $a['titleColor'] : 'inherit' ),
			)
		);

		$wrapper_css = self::style(
			array(
				'--products-columns' => $columns,
				'--products-gap'     => (float) $a['gap'] . 'px',
				'--image-ratio'      => $ratio,
			)
		);

		$classes = 'wp-block-gambol-products ' . $uid . ( ! empty( $a['showShadow'] ) ? ' has-shadow' : '' );

		$html = $style . '<div ' . self::wrapper( $a, $classes, $wrapper_css ) . '><div class="wp-block-gambol-products__grid">';

		foreach ( $products as $product ) {
			if ( ! $product instanceof \WC_Product || ! $product->is_visible() ) {
				continue;
			}
			$link  = $product->get_permalink();
			$html .= '<article class="wp-block-gambol-products__item"' . ( $card_css ? ' style="' . esc_attr( $card_css ) . '"' : '' ) . '>';

			if ( ! empty( $a['showImage'] ) ) {
				$html .= '<div class="wp-block-gambol-products__image">';
				$html .= '<a href="' . esc_url( $link ) . '" tabindex="-1" aria-hidden="true">' . $product->get_image( 'woocommerce_thumbnail', array( 'alt' => '' ) ) . '</a>';
				if ( ! empty( $a['showBadge'] ) && $product->is_on_sale() ) {
					$html .= '<span class="wp-block-gambol-products__badge"' . ( $badge_css ? ' style="' . esc_attr( $badge_css ) . '"' : '' ) . '>' . esc_html__( 'Sale!', 'gambol-builder' ) . '</span>';
				}
				$html .= '</div>';
			}

			$html .= '<div class="wp-block-gambol-products__content">';
			if ( ! empty( $a['showTitle'] ) ) {
				$html .= '<h3 class="wp-block-gambol-products__title"><a href="' . esc_url( $link ) . '">' . esc_html( $product->get_name() ) . '</a></h3>';
			}
			if ( ! empty( $a['showRating'] ) && wc_review_ratings_enabled() && $product->get_average_rating() > 0 ) {
				$rating = (float) $product->get_average_rating();
				$html  .= '<div class="wp-block-gambol-products__rating" role="img" aria-label="' . esc_attr( self::rating_label( $rating ) ) . '">' . self::svg_stars( $rating, 16, '#ffc107', '#e0e0e0' ) . '</div>';
			}
			if ( ! empty( $a['showPrice'] ) ) {
				$price = $product->get_price_html();
				if ( $price ) {
					$html .= '<div class="wp-block-gambol-products__price">' . wp_kses_post( $price ) . '</div>';
				}
			}
			if ( ! empty( $a['showAddToCart'] ) ) {
				$html .= self::loop_add_to_cart( $product, 'wp-block-gambol-products__add-to-cart', $btn_css );
			}
			$html .= '</div></article>';
		}

		$html .= '</div></div>';

		return $html;
	}

	/*
	 * ---------------------------------------------------------------------
	 * Product Image
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Product Image block.
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Content.
	 * @param \WP_Block $block      Block.
	 * @return string
	 */
	public static function render_product_image( $attributes, $content = '', $block = null ) {
		$product = self::get_product( $attributes, $block );
		if ( ! $product ) {
			return '';
		}

		$a        = self::attrs( 'product-image', $attributes );
		$size     = is_string( $a['imageSize'] ) && '' !== $a['imageSize'] ? $a['imageSize'] : 'woocommerce_single';
		$radius   = (float) $a['borderRadius'];
		$image_id = (int) $product->get_image_id();
		$name     = $product->get_name();

		$main_img = $image_id
			? wp_get_attachment_image( $image_id, $size, false, array( 'class' => 'wp-block-gambol-product-image__img' ) )
			: wc_placeholder_img( $size );

		$html  = '<div class="wp-block-gambol-product-image__main" style="border-radius:' . esc_attr( $radius ) . 'px">';
		$html .= $main_img;

		if ( ! empty( $a['showSaleBadge'] ) && $product->is_on_sale() ) {
			$html .= '<span class="wp-block-gambol-product-image__badge"' . self::style_attr(
				array(
					'color'            => $a['badgeColor'],
					'background-color' => $a['badgeBgColor'],
				)
			) . '>' . esc_html__( 'Sale!', 'gambol-builder' ) . '</span>';
		}

		if ( ! empty( $a['showLightbox'] ) && $image_id ) {
			$full = wp_get_attachment_image_url( $image_id, 'full' );
			if ( $full ) {
				$html .= sprintf(
					'<a class="wp-block-gambol-product-image__lightbox-btn" href="%1$s" target="_blank" rel="noopener" aria-label="%2$s"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/></svg></a>',
					esc_url( $full ),
					/* translators: %s: product name. */
					esc_attr( sprintf( __( 'View full-size image of %s (opens in a new tab)', 'gambol-builder' ), $name ) )
				);
			}
		}
		$html .= '</div>';

		$gallery_ids = $product->get_gallery_image_ids();
		if ( ! empty( $a['showGallery'] ) && $image_id && ! empty( $gallery_ids ) ) {
			$thumb_radius = max( 4, $radius / 2 );
			$ids          = array_merge( array( $image_id ), array_map( 'intval', $gallery_ids ) );
			$html        .= '<div class="wp-block-gambol-product-image__gallery">';
			foreach ( $ids as $i => $id ) {
				$src = wp_get_attachment_image_src( $id, $size );
				if ( ! $src ) {
					continue;
				}
				$alt   = (string) get_post_meta( $id, '_wp_attachment_image_alt', true );
				$html .= sprintf(
					'<button type="button" class="wp-block-gambol-product-image__thumb" style="border-radius:%1$spx" data-src="%2$s" data-srcset="%3$s" data-full="%4$s" data-alt="%5$s" aria-pressed="%6$s" aria-label="%7$s">%8$s</button>',
					esc_attr( $thumb_radius ),
					esc_url( $src[0] ),
					esc_attr( (string) wp_get_attachment_image_srcset( $id, $size ) ),
					esc_url( (string) wp_get_attachment_image_url( $id, 'full' ) ),
					esc_attr( $alt ),
					0 === $i ? 'true' : 'false',
					/* translators: 1: image number, 2: total images. */
					esc_attr( sprintf( __( 'Show image %1$d of %2$d', 'gambol-builder' ), $i + 1, count( $ids ) ) ),
					wp_get_attachment_image( $id, 'woocommerce_gallery_thumbnail', false, array( 'alt' => '' ) )
				);
			}
			$html .= '</div>';
		}

		$classes = 'wp-block-gambol-product-image' . ( ! empty( $a['showZoom'] ) ? ' has-zoom' : '' );

		return self::shared_assets() . '<div ' . self::wrapper( $a, $classes ) . '>' . $html . '</div>';
	}

	/*
	 * ---------------------------------------------------------------------
	 * Product Meta
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Product Meta block.
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Content.
	 * @param \WP_Block $block      Block.
	 * @return string
	 */
	public static function render_product_meta( $attributes, $content = '', $block = null ) {
		$product = self::get_product( $attributes, $block );
		if ( ! $product ) {
			return '';
		}

		$a          = self::attrs( 'product-meta', $attributes );
		$layout     = 'inline' === $a['layout'] ? 'inline' : 'stacked';
		$uid        = wp_unique_id( 'gambol-meta-' );
		$label_attr = self::style_attr( array( 'color' => $a['labelColor'] ? $a['labelColor'] : 'inherit' ) );
		$value_attr = self::style_attr( array( 'color' => $a['valueColor'] ? $a['valueColor'] : 'inherit' ) );
		$items      = '';

		$item = function ( $label, $value ) use ( $label_attr, $value_attr ) {
			return '<div class="product-meta__item"><span class="product-meta__label"' . $label_attr . '>' . esc_html( $label ) . '</span> <span class="product-meta__value"' . $value_attr . '>' . $value . '</span></div>';
		};

		if ( ! empty( $a['showSku'] ) && wc_product_sku_enabled() ) {
			$sku = $product->get_sku();
			if ( $sku ) {
				$items .= $item( __( 'SKU:', 'gambol-builder' ), esc_html( $sku ) );
			}
		}
		if ( ! empty( $a['showCategories'] ) ) {
			$cat_count = count( $product->get_category_ids() );
			$cats      = wc_get_product_category_list( $product->get_id(), ', ' );
			if ( $cats ) {
				$items .= $item( _n( 'Category:', 'Categories:', $cat_count, 'gambol-builder' ), wp_kses_post( $cats ) );
			}
		}
		if ( ! empty( $a['showTags'] ) ) {
			$tag_count = count( $product->get_tag_ids() );
			$tags      = wc_get_product_tag_list( $product->get_id(), ', ' );
			if ( $tags ) {
				$items .= $item( _n( 'Tag:', 'Tags:', $tag_count, 'gambol-builder' ), wp_kses_post( $tags ) );
			}
		}

		if ( '' === $items ) {
			return '';
		}

		$style = self::scoped_style(
			array(
				'.' . $uid . ' .product-meta__value a' => array( 'color' => $a['linkColor'] ? $a['linkColor'] : 'var(--gb-colors-primary)' ),
			)
		);

		$wrapper_css = self::style(
			array(
				'gap'       => (float) $a['gap'] . 'px',
				'font-size' => (float) $a['fontSize'] . 'px',
			)
		);

		return $style . '<div ' . self::wrapper( $a, 'wp-block-gambol-product-meta layout-' . $layout . ' ' . $uid, $wrapper_css ) . '>' . $items . '</div>';
	}

	/*
	 * ---------------------------------------------------------------------
	 * Product Price
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Product Price block.
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Content.
	 * @param \WP_Block $block      Block.
	 * @return string
	 */
	public static function render_product_price( $attributes, $content = '', $block = null ) {
		$product = self::get_product( $attributes, $block );
		if ( ! $product ) {
			return '';
		}

		$price = $product->get_price_html();
		if ( '' === trim( (string) $price ) ) {
			return '';
		}

		$a   = self::attrs( 'product-price', $attributes );
		$uid = wp_unique_id( 'gambol-price-' );
		$s   = '.' . $uid . ' .wp-block-gambol-product-price__wrapper';

		$style = self::scoped_style(
			array(
				$s           => array( 'color' => $a['priceColor'] ),
				$s . ' del'  => array( 'color' => $a['regularPriceColor'] ? $a['regularPriceColor'] : 'var(--gb-colors-gray-400)' ),
				$s . ' ins'  => array( 'color' => $a['salePriceColor'] ? $a['salePriceColor'] : ( $a['priceColor'] ? $a['priceColor'] : 'var(--gb-colors-primary)' ) ),
			)
		);

		$inner_css = self::style_attr(
			array(
				'font-size'   => (float) $a['fontSize'] . 'px',
				'font-weight' => preg_match( '/^[1-9]00$|^(normal|bold)$/', (string) $a['fontWeight'] ) ? $a['fontWeight'] : '',
			)
		);

		return $style . '<div ' . self::wrapper( $a, 'wp-block-gambol-product-price ' . $uid, self::style( array( 'text-align' => self::text_align( $a['textAlign'] ) ) ) ) . '>'
			. '<div class="wp-block-gambol-product-price__wrapper price"' . $inner_css . '>' . wp_kses_post( $price ) . '</div></div>';
	}

	/*
	 * ---------------------------------------------------------------------
	 * Product Rating
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Product Rating block.
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Content.
	 * @param \WP_Block $block      Block.
	 * @return string
	 */
	public static function render_product_rating( $attributes, $content = '', $block = null ) {
		$product = self::get_product( $attributes, $block );
		if ( ! $product || ! wc_review_ratings_enabled() ) {
			return '';
		}

		$rating = (float) $product->get_average_rating();
		$count  = (int) $product->get_review_count();
		if ( $rating <= 0 ) {
			return '';
		}

		$a    = self::attrs( 'product-rating', $attributes );
		$html = '<div class="wp-block-gambol-product-rating__stars" role="img" aria-label="' . esc_attr( self::rating_label( $rating ) ) . '">'
			. self::svg_stars( $rating, max( 8, (int) $a['starSize'] ), $a['starColor'], $a['starEmptyColor'] )
			. '</div>';

		if ( ! empty( $a['showCount'] ) && $count > 0 ) {
			/* translators: %s: number of reviews. */
			$label = sprintf( _n( '%s review', '%s reviews', $count, 'gambol-builder' ), number_format_i18n( $count ) );
			$html .= '<span class="wp-block-gambol-product-rating__count"' . self::style_attr( array( 'color' => $a['countColor'] ) ) . '>('
				. ( comments_open( $product->get_id() ) ? '<a href="' . esc_url( get_permalink( $product->get_id() ) . '#reviews' ) . '" style="color:inherit">' . esc_html( $label ) . '</a>' : esc_html( $label ) )
				. ')</span>';
		}

		return '<div ' . self::wrapper( $a, 'wp-block-gambol-product-rating', self::style( array( 'justify-content' => self::justify( $a['textAlign'] ) ) ) ) . '>' . $html . '</div>';
	}

	/*
	 * ---------------------------------------------------------------------
	 * Related / Upsells
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render a related/upsell style card grid.
	 *
	 * @param array  $a        Attributes.
	 * @param array  $products Products.
	 * @param string $prefix   Class prefix ("related" or "upsells").
	 * @param string $class    Wrapper class.
	 * @return string
	 */
	private static function render_card_grid( $a, $products, $prefix, $class ) {
		$card    = 'related' === $prefix ? 'related-product-card' : 'upsell-product-card';
		$title_c = 'related' === $prefix ? 'related-products__title' : 'upsells__title';
		$grid_c  = 'related' === $prefix ? 'related-products__grid' : 'upsells__grid';
		$columns = max( 1, min( 6, (int) $a['columns'] ) );

		$html = '<div ' . self::wrapper( $a, $class ) . '>';

		if ( ! empty( $a['showTitle'] ) && '' !== trim( (string) $a['title'] ) ) {
			$html .= '<h2 class="' . esc_attr( $title_c ) . '"' . self::style_attr( array( 'color' => $a['titleColor'] ? $a['titleColor'] : 'inherit' ) ) . '>' . esc_html( $a['title'] ) . '</h2>';
		}

		$html .= '<div class="' . esc_attr( $grid_c ) . '"' . self::style_attr(
			array(
				'grid-template-columns' => 'repeat(' . $columns . ', 1fr)',
				'gap'                   => (float) $a['gap'] . 'px',
			)
		) . '>';

		foreach ( $products as $product ) {
			$link  = $product->get_permalink();
			$html .= '<div class="' . esc_attr( $card ) . '">';
			$html .= '<div class="' . esc_attr( $card ) . '__image">';
			if ( 'upsells' === $prefix ) {
				$html .= '<span class="upsell-badge">' . esc_html__( 'Upgrade', 'gambol-builder' ) . '</span>';
			}
			$html .= '<a href="' . esc_url( $link ) . '" tabindex="-1" aria-hidden="true">' . $product->get_image( 'woocommerce_thumbnail', array( 'alt' => '' ) ) . '</a>';
			$html .= '</div>';
			$html .= '<div class="' . esc_attr( $card ) . '__content">';
			$html .= '<h3 class="product-name"><a href="' . esc_url( $link ) . '">' . esc_html( $product->get_name() ) . '</a></h3>';

			if ( ! empty( $a['showRating'] ) && wc_review_ratings_enabled() && $product->get_average_rating() > 0 ) {
				$rating = (float) $product->get_average_rating();
				$html  .= '<div class="product-rating" role="img" aria-label="' . esc_attr( self::rating_label( $rating ) ) . '">';
				for ( $i = 0; $i < 5; $i++ ) {
					$state = $i < floor( $rating ) ? ' filled' : ( $i < $rating ? ' half' : '' );
					$html .= '<span class="star' . $state . '" aria-hidden="true">&#9733;</span>';
				}
				$html .= '</div>';
			}
			if ( ! empty( $a['showPrice'] ) ) {
				$price = $product->get_price_html();
				if ( $price ) {
					$html .= '<span class="product-price">' . wp_kses_post( $price ) . '</span>';
				}
			}
			if ( ! empty( $a['showAddToCart'] ) ) {
				$html .= self::loop_add_to_cart( $product, 'add-to-cart-btn' );
			}
			$html .= '</div></div>';
		}

		$html .= '</div></div>';

		return $html;
	}

	/**
	 * Load visible products from ids.
	 *
	 * @param array $ids   Product ids.
	 * @param int   $limit Limit.
	 * @return \WC_Product[]
	 */
	private static function load_products( $ids, $limit ) {
		$products = array();
		foreach ( (array) $ids as $id ) {
			$product = wc_get_product( $id );
			if ( $product instanceof \WC_Product && $product->is_visible() ) {
				$products[] = $product;
			}
			if ( count( $products ) >= $limit ) {
				break;
			}
		}
		return $products;
	}

	/**
	 * Render Related Products block.
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Content.
	 * @param \WP_Block $block      Block.
	 * @return string
	 */
	public static function render_product_related( $attributes, $content = '', $block = null ) {
		$product = self::get_product( $attributes, $block );
		if ( ! $product || ! function_exists( 'wc_get_related_products' ) ) {
			return '';
		}

		$a        = self::attrs( 'product-related', $attributes );
		$limit    = max( 1, min( 24, (int) $a['productsPerPage'] ) );
		$products = self::load_products( wc_get_related_products( $product->get_id(), $limit ), $limit );

		if ( empty( $products ) ) {
			return '';
		}

		return self::render_card_grid( $a, $products, 'related', 'wp-block-gambol-product-related' );
	}

	/**
	 * Render Upsells block.
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Content.
	 * @param \WP_Block $block      Block.
	 * @return string
	 */
	public static function render_product_upsells( $attributes, $content = '', $block = null ) {
		$product = self::get_product( $attributes, $block );
		if ( ! $product ) {
			return '';
		}

		$a        = self::attrs( 'product-upsells', $attributes );
		$limit    = max( 1, min( 24, (int) $a['productsPerPage'] ) );
		$products = self::load_products( $product->get_upsell_ids(), $limit );

		if ( empty( $products ) ) {
			return '';
		}

		return self::render_card_grid( $a, $products, 'upsells', 'wp-block-gambol-product-upsells' );
	}

	/*
	 * ---------------------------------------------------------------------
	 * Short description / Stock / Title
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Product Short Description block.
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Content.
	 * @param \WP_Block $block      Block.
	 * @return string
	 */
	public static function render_product_short_description( $attributes, $content = '', $block = null ) {
		$product = self::get_product( $attributes, $block );
		if ( ! $product ) {
			return '';
		}

		$description = $product->get_short_description();
		if ( '' === trim( (string) $description ) ) {
			return '';
		}

		// WooCommerce's own formatting filter (wpautop, shortcodes, etc.) — not the_content.
		$description = apply_filters( 'woocommerce_short_description', $description );

		$a   = self::attrs( 'product-short-description', $attributes );
		$css = self::style(
			array(
				'text-align'  => self::text_align( $a['textAlign'] ),
				'font-size'   => (float) $a['fontSize'] . 'px',
				'line-height' => (float) $a['lineHeight'],
				'color'       => $a['textColor'],
			)
		);

		return '<div ' . self::wrapper( $a, 'wp-block-gambol-product-short-description', $css ) . '>' . wp_kses_post( $description ) . '</div>';
	}

	/**
	 * Render Product Stock block.
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Content.
	 * @param \WP_Block $block      Block.
	 * @return string
	 */
	public static function render_product_stock( $attributes, $content = '', $block = null ) {
		$product = self::get_product( $attributes, $block );
		if ( ! $product ) {
			return '';
		}

		$a        = self::attrs( 'product-stock', $attributes );
		$status   = $product->get_stock_status();
		$managing = $product->managing_stock();
		$qty      = $managing ? (int) $product->get_stock_quantity() : null;
		$low      = (int) get_option( 'woocommerce_notify_low_stock_amount', 2 );
		$show_qty = ! empty( $a['showQuantity'] ) && $managing && null !== $qty;

		if ( 'outofstock' === $status ) {
			$state = 'out-of-stock';
			$color = $a['outOfStockColor'];
			$text  = __( 'Out of Stock', 'gambol-builder' );
		} elseif ( 'onbackorder' === $status ) {
			$state = 'low-stock';
			$color = $a['lowStockColor'];
			$text  = __( 'Available on backorder', 'gambol-builder' );
		} elseif ( $managing && null !== $qty && $qty > 0 && $qty <= $low ) {
			$state = 'low-stock';
			$color = $a['lowStockColor'];
			/* translators: %s: stock quantity. */
			$text = $show_qty ? sprintf( __( 'Only %s left', 'gambol-builder' ), number_format_i18n( $qty ) ) : __( 'Low Stock', 'gambol-builder' );
		} else {
			$state = 'in-stock';
			$color = $a['inStockColor'];
			/* translators: %s: stock quantity. */
			$text = $show_qty ? sprintf( __( '%s in stock', 'gambol-builder' ), number_format_i18n( $qty ) ) : __( 'In Stock', 'gambol-builder' );
		}

		$icon = '';
		if ( ! empty( $a['showIcon'] ) ) {
			$path = 'out-of-stock' === $state
				? 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
				: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z';
			$icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true" focusable="false"><path d="' . $path . '"/></svg>';
		}

		$css = self::style(
			array(
				'text-align' => self::text_align( $a['textAlign'] ),
				'font-size'  => (float) $a['fontSize'] . 'px',
			)
		);

		return '<div ' . self::wrapper( $a, 'wp-block-gambol-product-stock', $css ) . '>'
			. '<span class="product-stock__status product-stock__status--' . esc_attr( $state ) . '"' . self::style_attr( array( 'color' => $color ) ) . '>'
			. $icon . esc_html( $text )
			. '</span></div>';
	}

	/**
	 * Render Product Title block.
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Content.
	 * @param \WP_Block $block      Block.
	 * @return string
	 */
	public static function render_product_title( $attributes, $content = '', $block = null ) {
		$product = self::get_product( $attributes, $block );
		if ( ! $product ) {
			return '';
		}

		$title = $product->get_name();
		if ( '' === trim( (string) $title ) ) {
			return '';
		}

		$a   = self::attrs( 'product-title', $attributes );
		$tag = in_array( $a['tag'], array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span' ), true ) ? $a['tag'] : 'h1';

		$css = self::style_attr(
			array(
				'color'       => $a['titleColor'],
				'font-size'   => (float) $a['fontSize'] . 'px',
				'font-weight' => preg_match( '/^[1-9]00$|^(normal|bold)$/', (string) $a['fontWeight'] ) ? $a['fontWeight'] : '',
				'line-height' => (float) $a['lineHeight'],
				'text-align'  => self::text_align( $a['textAlign'] ),
				'margin'      => '0',
			)
		);

		return '<div ' . self::wrapper( $a, 'wp-block-gambol-product-title' ) . '><' . $tag . ' class="product_title"' . $css . '>' . esc_html( $title ) . '</' . $tag . '></div>';
	}

	/*
	 * ---------------------------------------------------------------------
	 * Product Tabs
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Product Tabs block (WooCommerce's woocommerce_product_tabs).
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Content.
	 * @param \WP_Block $block      Block.
	 * @return string
	 */
	public static function render_product_tabs( $attributes, $content = '', $block = null ) {
		// The description tab runs the_content on the product; if this block lives in
		// that content we would recurse forever.
		if ( self::$rendering_tabs ) {
			return '';
		}

		$product = self::get_product( $attributes, $block );
		if ( ! $product ) {
			return '';
		}

		$a = self::attrs( 'product-tabs', $attributes );

		self::$rendering_tabs = true;

		$panels = self::with_product_globals(
			$product,
			function () use ( $a ) {
				$tabs = apply_filters( 'woocommerce_product_tabs', array() );
				if ( empty( $a['showDescription'] ) ) {
					unset( $tabs['description'] );
				}
				if ( empty( $a['showAdditionalInfo'] ) ) {
					unset( $tabs['additional_information'] );
				}
				if ( empty( $a['showReviews'] ) ) {
					unset( $tabs['reviews'] );
				}

				$out = array();
				foreach ( $tabs as $key => $tab ) {
					if ( empty( $tab['callback'] ) || ! is_callable( $tab['callback'] ) ) {
						continue;
					}
					ob_start();
					call_user_func( $tab['callback'], $key, $tab );
					$html = ob_get_clean();
					if ( '' === trim( $html ) ) {
						continue;
					}
					$out[ $key ] = array(
						'title'   => isset( $tab['title'] ) ? apply_filters( 'woocommerce_product_' . $key . '_tab_title', $tab['title'], $key ) : $key,
						'content' => $html,
					);
				}
				return $out;
			}
		);

		self::$rendering_tabs = false;

		if ( empty( $panels ) ) {
			return '';
		}

		$layout = 'vertical' === $a['layout'] ? 'vertical' : 'horizontal';
		$uid    = wp_unique_id( 'gambol-tabs-' );
		$s      = '.' . $uid . '.wp-block-gambol-product-tabs';
		$radius = (float) $a['borderRadius'] . 'px';

		$style = self::scoped_style(
			array(
				$s . ' .product-tabs__tab'           => array(
					'background-color' => $a['tabBgColor'] ? $a['tabBgColor'] : 'var(--gb-colors-gray-100)',
					'color'            => $a['tabTextColor'] ? $a['tabTextColor'] : 'inherit',
					'border-radius'    => $radius,
				),
				$s . ' .product-tabs__tab.is-active' => array(
					'background-color' => $a['tabActiveColor'] ? $a['tabActiveColor'] : 'var(--gb-colors-primary)',
					'color'            => $a['tabActiveTextColor'] ? $a['tabActiveTextColor'] : '#fff',
				),
			)
		);

		$nav    = '';
		$bodies = '';
		$first  = true;
		foreach ( $panels as $key => $panel ) {
			$slug     = sanitize_html_class( $key );
			$tab_id   = $uid . '-tab-' . $slug;
			$panel_id = $uid . '-panel-' . $slug;

			$nav .= sprintf(
				'<button type="button" role="tab" id="%1$s" class="product-tabs__tab%2$s" aria-selected="%3$s" aria-controls="%4$s" tabindex="%5$s" data-tab="%6$s">%7$s</button>',
				esc_attr( $tab_id ),
				$first ? ' is-active' : '',
				$first ? 'true' : 'false',
				esc_attr( $panel_id ),
				$first ? '0' : '-1',
				esc_attr( $slug ),
				wp_kses_post( $panel['title'] )
			);

			$bodies .= sprintf(
				'<div role="tabpanel" id="%1$s" class="product-tabs__panel" aria-labelledby="%2$s" tabindex="0"%3$s>%4$s</div>',
				esc_attr( $panel_id ),
				esc_attr( $tab_id ),
				$first ? '' : ' hidden',
				$panel['content'] // WooCommerce template output.
			);

			$first = false;
		}

		return self::shared_assets() . $style
			. '<div ' . self::wrapper( $a, 'wp-block-gambol-product-tabs layout-' . $layout . ' ' . $uid ) . '>'
			. '<div class="product-tabs__nav" role="tablist" aria-orientation="' . esc_attr( $layout ) . '">' . $nav . '</div>'
			. '<div class="product-tabs__content"' . self::style_attr( array( 'padding' => (float) $a['contentPadding'] . 'px' ) ) . '>' . $bodies . '</div>'
			. '</div>';
	}
}

// Initialize.
Woo_Blocks::init();
