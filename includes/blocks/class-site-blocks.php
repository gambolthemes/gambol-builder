<?php
/**
 * Site / Theme Blocks - Server-Side Rendering
 *
 * Render callbacks for the dynamic site blocks whose save() returns null:
 * nav-menu, site-logo, site-title, page-title, login, table-of-contents.
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
 * Site Blocks Class.
 */
class Site_Blocks {

	/**
	 * Whether the shared inline CSS/JS has been printed.
	 *
	 * @var bool
	 */
	private static $assets_printed = false;

	/**
	 * Heading id maps per post ID (used by the table of contents).
	 *
	 * @var array
	 */
	private static $heading_maps = array();

	/**
	 * Heading ids already handed out to rendered heading blocks, per post ID.
	 *
	 * @var array
	 */
	private static $consumed_ids = array();

	/**
	 * Initialize the class.
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_blocks' ) );
		add_filter( 'render_block', array( __CLASS__, 'add_heading_ids' ), 10, 2 );
	}

	/**
	 * Block definitions mirroring src/blocks/<name>/index.js.
	 *
	 * Note: `anchor` is handled manually (id on the wrapper) so it is
	 * registered as a plain attribute rather than a server-side support.
	 *
	 * @return array
	 */
	private static function get_definitions() {
		return array(
			'nav-menu'          => array(
				'attributes' => array(
					'menuId'           => array( 'type' => 'number', 'default' => 0 ),
					'layout'           => array( 'type' => 'string', 'default' => 'horizontal' ),
					'showDropdownIcon' => array( 'type' => 'boolean', 'default' => true ),
					'mobileBreakpoint' => array( 'type' => 'number', 'default' => 768 ),
					'mobileToggle'     => array( 'type' => 'string', 'default' => 'hamburger' ),
					'textColor'        => array( 'type' => 'string', 'default' => '' ),
					'textHoverColor'   => array( 'type' => 'string', 'default' => '' ),
					'backgroundColor'  => array( 'type' => 'string', 'default' => '' ),
					'fontSize'         => array( 'type' => 'string', 'default' => '' ),
					'gap'              => array( 'type' => 'number', 'default' => 20 ),
					'padding'          => array( 'type' => 'number', 'default' => 10 ),
				),
				'supports'   => array(
					'html'  => false,
					'align' => array( 'left', 'center', 'right', 'wide', 'full' ),
				),
			),
			'site-logo'         => array(
				'attributes' => array(
					'width'        => array( 'type' => 'number', 'default' => 200 ),
					'isLink'       => array( 'type' => 'boolean', 'default' => true ),
					'linkTarget'   => array( 'type' => 'string', 'default' => '_self' ),
					'customLogo'   => array( 'type' => 'string', 'default' => '' ),
					'customLogoId' => array( 'type' => 'number' ),
				),
				'supports'   => array(
					'html'  => false,
					'align' => array( 'left', 'center', 'right' ),
				),
			),
			'site-title'        => array(
				'attributes' => array(
					'level'      => array( 'type' => 'number', 'default' => 1 ),
					'isLink'     => array( 'type' => 'boolean', 'default' => true ),
					'linkTarget' => array( 'type' => 'string', 'default' => '_self' ),
					'textColor'  => array( 'type' => 'string', 'default' => '' ),
					'fontSize'   => array( 'type' => 'string', 'default' => '' ),
				),
				'supports'   => array(
					'html'       => false,
					'align'      => array( 'left', 'center', 'right' ),
					'color'      => array(
						'gradients' => true,
						'link'      => true,
					),
					'typography' => array(
						'fontSize'   => true,
						'lineHeight' => true,
					),
				),
			),
			'page-title'        => array(
				'attributes'   => array(
					'level'      => array( 'type' => 'number', 'default' => 1 ),
					'isLink'     => array( 'type' => 'boolean', 'default' => false ),
					'linkTarget' => array( 'type' => 'string', 'default' => '_self' ),
					'textColor'  => array( 'type' => 'string', 'default' => '' ),
					'fontSize'   => array( 'type' => 'string', 'default' => '' ),
				),
				'supports'     => array(
					'html'       => false,
					'align'      => array( 'left', 'center', 'right' ),
					'color'      => array(
						'gradients' => true,
					),
					'typography' => array(
						'fontSize'   => true,
						'lineHeight' => true,
					),
				),
				'uses_context' => array( 'postId', 'postType' ),
			),
			'login'             => array(
				'attributes' => array(
					'showLabels'         => array( 'type' => 'boolean', 'default' => true ),
					'showRemember'       => array( 'type' => 'boolean', 'default' => true ),
					'showForgotPassword' => array( 'type' => 'boolean', 'default' => true ),
					'showRegisterLink'   => array( 'type' => 'boolean', 'default' => false ),
					'buttonText'         => array( 'type' => 'string', 'default' => 'Log In' ),
					'redirectUrl'        => array( 'type' => 'string', 'default' => '' ),
					'labelColor'         => array( 'type' => 'string', 'default' => '' ),
					'inputBgColor'       => array( 'type' => 'string', 'default' => '' ),
					'inputBorderColor'   => array( 'type' => 'string', 'default' => '' ),
					'buttonBgColor'      => array( 'type' => 'string', 'default' => '' ),
					'buttonTextColor'    => array( 'type' => 'string', 'default' => '' ),
					'linkColor'          => array( 'type' => 'string', 'default' => '' ),
					'borderRadius'       => array( 'type' => 'number', 'default' => 6 ),
				),
				'supports'   => array(
					'html' => false,
				),
			),
			'table-of-contents' => array(
				'attributes' => array(
					'title'           => array( 'type' => 'string', 'default' => 'Table of Contents' ),
					'showTitle'       => array( 'type' => 'boolean', 'default' => true ),
					'headingLevels'   => array( 'type' => 'array', 'default' => array( 2, 3, 4 ) ),
					'listStyle'       => array( 'type' => 'string', 'default' => 'numbered' ),
					'collapsible'     => array( 'type' => 'boolean', 'default' => false ),
					'collapsed'       => array( 'type' => 'boolean', 'default' => false ),
					'showToggle'      => array( 'type' => 'boolean', 'default' => true ),
					'smoothScroll'    => array( 'type' => 'boolean', 'default' => true ),
					'highlightActive' => array( 'type' => 'boolean', 'default' => true ),
					'bgColor'         => array( 'type' => 'string', 'default' => '' ),
					'textColor'       => array( 'type' => 'string', 'default' => '' ),
					'linkColor'       => array( 'type' => 'string', 'default' => '' ),
					'linkHoverColor'  => array( 'type' => 'string', 'default' => '' ),
					'borderColor'     => array( 'type' => 'string', 'default' => '' ),
					'borderRadius'    => array( 'type' => 'number', 'default' => 8 ),
					'padding'         => array( 'type' => 'number', 'default' => 20 ),
				),
				'supports'   => array(
					'html' => false,
				),
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
				'supports'        => $definition['supports'],
				'render_callback' => array( __CLASS__, $method ),
			);

			if ( ! empty( $definition['uses_context'] ) ) {
				$args['uses_context'] = $definition['uses_context'];
			}

			// Handle is registered later on `init` by the main plugin file; it is resolved at enqueue time.
			$args['style'] = 'gambol-builder-style';

			register_block_type( $block_name, $args );
		}
	}

	/*
	 * ---------------------------------------------------------------------
	 * Helpers
	 * ---------------------------------------------------------------------
	 */

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
	 * Sanitize a single CSS value (strip characters that could break out of a declaration).
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
	 * Build an inline style string from property => value pairs, skipping empties.
	 *
	 * @param array $declarations CSS declarations.
	 * @return string
	 */
	private static function style( $declarations ) {
		$out = array();
		foreach ( $declarations as $property => $value ) {
			$value = self::css_value( $value );
			if ( '' === $value ) {
				continue;
			}
			$out[] = $property . ':' . $value;
		}
		return implode( ';', $out );
	}

	/**
	 * Build wrapper attributes (adds anchor id and alignment classes).
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
			$align        = sanitize_html_class( $attributes['align'] );
			$class_list[] = 'align' . $align;
			if ( in_array( $align, array( 'left', 'center', 'right' ), true ) ) {
				$class_list[] = 'has-text-align-' . $align;
			}
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
	 * Rel/target attributes for a link.
	 *
	 * @param string $target Link target.
	 * @return string
	 */
	private static function link_target_attrs( $target ) {
		if ( '_blank' === $target ) {
			return ' target="_blank" rel="noopener noreferrer"';
		}
		return '';
	}

	/**
	 * Clamp a heading level to 1-6.
	 *
	 * @param mixed $level Level.
	 * @return int
	 */
	private static function heading_level( $level ) {
		$level = (int) $level;
		return ( $level >= 1 && $level <= 6 ) ? $level : 1;
	}

	/**
	 * Shared CSS + JS for nav toggles and the table of contents (printed once).
	 *
	 * @return string
	 */
	private static function shared_assets() {
		if ( self::$assets_printed ) {
			return '';
		}
		self::$assets_printed = true;

		$css = '.gambol-sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}'
			. '.wp-block-gambol-nav-menu__item:focus-within>.wp-block-gambol-nav-menu__submenu{display:block}'
			. '.wp-block-gambol-nav-menu__mobile-toggle{color:inherit}'
			. '.wp-block-gambol-table-of-contents .toc-title{flex:1}';

		$js = <<<'JS'
(function(){
	function ready(fn){ if(document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);} }
	ready(function(){
		document.querySelectorAll('.wp-block-gambol-nav-menu__mobile-toggle').forEach(function(btn){
			btn.addEventListener('click',function(){
				var nav=btn.closest('.wp-block-gambol-nav-menu');
				if(!nav){return;}
				var open=nav.classList.toggle('is-open');
				btn.setAttribute('aria-expanded',open?'true':'false');
			});
		});
		document.addEventListener('keydown',function(e){
			if(e.key!=='Escape'){return;}
			document.querySelectorAll('.wp-block-gambol-nav-menu.is-open').forEach(function(nav){
				nav.classList.remove('is-open');
				var b=nav.querySelector('.wp-block-gambol-nav-menu__mobile-toggle');
				if(b){b.setAttribute('aria-expanded','false');b.focus();}
			});
		});
		document.querySelectorAll('.wp-block-gambol-table-of-contents').forEach(function(toc){
			var toggle=toc.querySelector('.toc-toggle');
			if(toggle){
				toggle.addEventListener('click',function(){
					var collapsed=toc.classList.toggle('is-collapsed');
					toggle.setAttribute('aria-expanded',collapsed?'false':'true');
				});
			}
			var links=toc.querySelectorAll('.toc-item a');
			if(toc.getAttribute('data-smooth-scroll')==='1'){
				links.forEach(function(a){
					a.addEventListener('click',function(e){
						var id=decodeURIComponent((a.getAttribute('href')||'').slice(1));
						var target=id?document.getElementById(id):null;
						if(!target){return;}
						e.preventDefault();
						target.scrollIntoView({behavior:'smooth',block:'start'});
						if(history.replaceState){history.replaceState(null,'','#'+id);}
						target.setAttribute('tabindex','-1');
						target.focus({preventScroll:true});
					});
				});
			}
			if(toc.getAttribute('data-highlight-active')==='1' && 'IntersectionObserver' in window){
				var map={};
				links.forEach(function(a){
					var id=decodeURIComponent((a.getAttribute('href')||'').slice(1));
					var el=id?document.getElementById(id):null;
					if(el){map[id]=a.closest('.toc-item');}
				});
				var observer=new IntersectionObserver(function(entries){
					entries.forEach(function(entry){
						if(!entry.isIntersecting){return;}
						Object.keys(map).forEach(function(k){map[k].classList.remove('is-active');});
						if(map[entry.target.id]){map[entry.target.id].classList.add('is-active');}
					});
				},{rootMargin:'0px 0px -70% 0px'});
				Object.keys(map).forEach(function(id){observer.observe(document.getElementById(id));});
			}
		});
	});
})();
JS;

		return '<style id="gambol-site-blocks-css">' . $css . '</style>'
			. '<script id="gambol-site-blocks-js">' . $js . '</script>';
	}

	/*
	 * ---------------------------------------------------------------------
	 * Nav Menu
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Nav Menu block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_nav_menu( $attributes ) {
		$a = self::attrs( 'nav-menu', $attributes );

		$menu_args = array();
		$menu_obj  = null;

		if ( ! empty( $a['menuId'] ) ) {
			$menu_obj = wp_get_nav_menu_object( (int) $a['menuId'] );
		}

		if ( $menu_obj ) {
			$menu_args['menu'] = $menu_obj->term_id;
		} elseif ( has_nav_menu( 'primary' ) ) {
			// Fallback: the theme's primary location.
			$menu_args['theme_location'] = 'primary';
			$locations                   = get_nav_menu_locations();
			$menu_obj                    = isset( $locations['primary'] ) ? wp_get_nav_menu_object( $locations['primary'] ) : null;
		} else {
			return '';
		}

		$layout    = in_array( $a['layout'], array( 'horizontal', 'vertical' ), true ) ? $a['layout'] : 'horizontal';
		$uid       = wp_unique_id( 'gambol-nav-' );
		$list_id   = $uid . '-list';
		$link_css  = self::style(
			array(
				'font-size' => $a['fontSize'],
				'padding'   => $a['padding'] ? (float) $a['padding'] . 'px' : '',
			)
		);
		$list_css  = self::style( array( 'gap' => '' !== (string) $a['gap'] ? (float) $a['gap'] . 'px' : '' ) );
		$show_icon = ! empty( $a['showDropdownIcon'] );

		$walker = new class( $link_css, $show_icon ) extends \Walker_Nav_Menu {
			/**
			 * Inline style for links.
			 *
			 * @var string
			 */
			private $link_css;

			/**
			 * Show dropdown icon.
			 *
			 * @var bool
			 */
			private $show_icon;

			/**
			 * Constructor.
			 *
			 * @param string $link_css  Link style.
			 * @param bool   $show_icon Show dropdown icon.
			 */
			public function __construct( $link_css, $show_icon ) {
				$this->link_css  = $link_css;
				$this->show_icon = $show_icon;
			}

			/**
			 * Start a submenu.
			 *
			 * @param string $output Output.
			 * @param int    $depth  Depth.
			 * @param mixed  $args   Args.
			 */
			public function start_lvl( &$output, $depth = 0, $args = null ) {
				$output .= '<ul class="wp-block-gambol-nav-menu__submenu">';
			}

			/**
			 * End a submenu.
			 *
			 * @param string $output Output.
			 * @param int    $depth  Depth.
			 * @param mixed  $args   Args.
			 */
			public function end_lvl( &$output, $depth = 0, $args = null ) {
				$output .= '</ul>';
			}

			/**
			 * Start an item.
			 *
			 * @param string $output            Output.
			 * @param mixed  $data_object       Menu item.
			 * @param int    $depth             Depth.
			 * @param mixed  $args              Args.
			 * @param int    $current_object_id Current object ID.
			 */
			public function start_el( &$output, $data_object, $depth = 0, $args = null, $current_object_id = 0 ) {
				$item    = $data_object;
				$classes = array( 'wp-block-gambol-nav-menu__item' );
				if ( $this->has_children ) {
					$classes[] = 'has-children';
				}
				if ( ! empty( $item->current ) ) {
					$classes[] = 'is-current';
				}
				if ( ! empty( $item->classes ) && is_array( $item->classes ) ) {
					foreach ( $item->classes as $class ) {
						if ( $class && 0 !== strpos( $class, 'menu-item' ) && 0 !== strpos( $class, 'current' ) && 0 !== strpos( $class, 'page' ) ) {
							$classes[] = sanitize_html_class( $class );
						}
					}
				}

				$atts = array(
					'href'         => ! empty( $item->url ) ? $item->url : '',
					'target'       => ! empty( $item->target ) ? $item->target : '',
					'rel'          => ! empty( $item->xfn ) ? $item->xfn : '',
					'title'        => ! empty( $item->attr_title ) ? $item->attr_title : '',
					'aria-current' => ! empty( $item->current ) ? 'page' : '',
					'style'        => $this->link_css,
				);
				if ( '_blank' === $atts['target'] && '' === $atts['rel'] ) {
					$atts['rel'] = 'noopener noreferrer';
				}
				$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

				$attr_html = '';
				foreach ( (array) $atts as $name => $value ) {
					if ( '' === $value || null === $value || false === $value ) {
						continue;
					}
					$value      = ( 'href' === $name ) ? esc_url( $value ) : esc_attr( $value );
					$attr_html .= ' ' . esc_attr( $name ) . '="' . $value . '"';
				}

				$title = apply_filters( 'the_title', $item->title, $item->ID );
				$title = apply_filters( 'nav_menu_item_title', $title, $item, $args, $depth );

				$output .= '<li class="' . esc_attr( implode( ' ', array_unique( $classes ) ) ) . '">';
				$output .= '<a' . $attr_html . '>' . wp_kses_post( $title );
				if ( $this->has_children && $this->show_icon ) {
					$output .= '<span class="wp-block-gambol-nav-menu__dropdown-icon" aria-hidden="true">&#9660;</span>';
				}
				$output .= '</a>';
			}

			/**
			 * End an item.
			 *
			 * @param string $output      Output.
			 * @param mixed  $data_object Menu item.
			 * @param int    $depth       Depth.
			 * @param mixed  $args        Args.
			 */
			public function end_el( &$output, $data_object, $depth = 0, $args = null ) {
				$output .= '</li>';
			}
		};

		$items_wrap = '<ul id="%1$s" class="%2$s"' . ( $list_css ? ' style="' . esc_attr( $list_css ) . '"' : '' ) . '>%3$s</ul>';

		$menu_html = wp_nav_menu(
			array_merge(
				$menu_args,
				array(
					'container'   => false,
					'menu_id'     => $list_id,
					'menu_class'  => 'wp-block-gambol-nav-menu__list',
					'items_wrap'  => $items_wrap,
					'walker'      => $walker,
					'fallback_cb' => false,
					'echo'        => false,
					'depth'       => 0,
				)
			)
		);

		if ( empty( $menu_html ) ) {
			return '';
		}

		$label = $menu_obj && ! empty( $menu_obj->name ) ? $menu_obj->name : __( 'Main navigation', 'gambol-builder' );

		$wrapper_css = self::style(
			array(
				'background-color'   => $a['backgroundColor'],
				'color'              => $a['textColor'],
				'--item-hover-color' => $a['textHoverColor'],
			)
		);

		// Mobile toggle (CSS only hides the list on the horizontal layout).
		$toggle = '';
		if ( 'horizontal' === $layout ) {
			$icon   = ( 'dropdown' === $a['mobileToggle'] ) ? '&#9660;' : '&#9776;';
			$toggle = sprintf(
				'<button type="button" class="wp-block-gambol-nav-menu__mobile-toggle" aria-expanded="false" aria-controls="%1$s"><span aria-hidden="true">%2$s</span><span class="gambol-sr-only">%3$s</span></button>',
				esc_attr( $list_id ),
				$icon,
				esc_html__( 'Toggle menu', 'gambol-builder' )
			);
		}

		// Custom breakpoint overrides for the hard-coded 768px rule in style.scss.
		$scoped     = '';
		$breakpoint = (int) $a['mobileBreakpoint'];
		if ( 'horizontal' === $layout && $breakpoint > 0 && 768 !== $breakpoint ) {
			$sel = '.' . $uid;
			if ( $breakpoint < 768 ) {
				$scoped = sprintf(
					'@media (min-width:%1$dpx) and (max-width:768px){%2$s .wp-block-gambol-nav-menu__mobile-toggle{display:none}%2$s .wp-block-gambol-nav-menu__list{display:flex;flex-direction:row;width:auto}}',
					$breakpoint + 1,
					$sel
				);
			} else {
				$scoped = sprintf(
					'@media (min-width:769px) and (max-width:%1$dpx){%2$s .wp-block-gambol-nav-menu__mobile-toggle{display:block}%2$s .wp-block-gambol-nav-menu__list{display:none;flex-direction:column;width:100%%}%2$s.is-open .wp-block-gambol-nav-menu__list{display:flex}%2$s .wp-block-gambol-nav-menu__submenu{position:static;box-shadow:none}}',
					$breakpoint,
					$sel
				);
			}
			$scoped = '<style>' . $scoped . '</style>';
		}

		$wrapper = self::wrapper(
			$a,
			'wp-block-gambol-nav-menu wp-block-gambol-nav-menu--' . $layout . ' ' . $uid,
			$wrapper_css,
			array( 'aria-label' => $label )
		);

		return self::shared_assets() . $scoped . '<nav ' . $wrapper . '>' . $toggle . $menu_html . '</nav>';
	}

	/*
	 * ---------------------------------------------------------------------
	 * Site Logo
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Site Logo block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_site_logo( $attributes ) {
		$a         = self::attrs( 'site-logo', $attributes );
		$width     = (float) $a['width'] > 0 ? (float) $a['width'] : 200;
		$img_style = 'width:' . $width . 'px;height:auto';
		$site_name = get_bloginfo( 'name' );
		$img_attrs = array(
			'class'   => 'wp-block-gambol-site-logo__image',
			'style'   => $img_style,
			'loading' => false,
		);

		$image = '';

		$logo_id = ! empty( $a['customLogoId'] ) ? (int) $a['customLogoId'] : 0;
		if ( ! $logo_id && empty( $a['customLogo'] ) ) {
			$logo_id = (int) get_theme_mod( 'custom_logo' );
		}

		if ( $logo_id ) {
			$alt = trim( (string) get_post_meta( $logo_id, '_wp_attachment_image_alt', true ) );
			if ( '' === $alt ) {
				$img_attrs['alt'] = $site_name;
			}
			$image = wp_get_attachment_image( $logo_id, 'full', false, $img_attrs );
		}

		if ( ! $image && ! empty( $a['customLogo'] ) ) {
			$image = sprintf(
				'<img src="%1$s" alt="%2$s" class="wp-block-gambol-site-logo__image" style="%3$s" />',
				esc_url( $a['customLogo'] ),
				esc_attr( $site_name ),
				esc_attr( $img_style )
			);
		}

		// Fallback: site icon.
		if ( ! $image && has_site_icon() ) {
			$image = sprintf(
				'<img src="%1$s" alt="%2$s" class="wp-block-gambol-site-logo__image" style="%3$s" />',
				esc_url( get_site_icon_url( 512 ) ),
				esc_attr( $site_name ),
				esc_attr( $img_style )
			);
		}

		if ( ! $image ) {
			return '';
		}

		if ( ! empty( $a['isLink'] ) ) {
			$aria_current = ( is_front_page() && ! is_paged() ) ? ' aria-current="page"' : '';
			$image        = sprintf(
				'<a href="%1$s" class="wp-block-gambol-site-logo__link" rel="home"%2$s%3$s>%4$s</a>',
				esc_url( home_url( '/' ) ),
				self::link_target_attrs( $a['linkTarget'] ),
				$aria_current,
				$image
			);
		}

		return '<div ' . self::wrapper( $a, 'wp-block-gambol-site-logo' ) . '>' . $image . '</div>';
	}

	/*
	 * ---------------------------------------------------------------------
	 * Site Title
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Site Title block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_site_title( $attributes ) {
		$a     = self::attrs( 'site-title', $attributes );
		$title = get_bloginfo( 'name' );

		if ( '' === trim( (string) $title ) ) {
			return '';
		}

		$level = self::heading_level( $a['level'] );
		$text  = esc_html( $title );

		if ( ! empty( $a['isLink'] ) ) {
			$aria_current = ( is_front_page() && ! is_paged() ) ? ' aria-current="page"' : '';
			$text         = sprintf(
				'<a href="%1$s" class="wp-block-gambol-site-title__link" rel="home"%2$s%3$s>%4$s</a>',
				esc_url( home_url( '/' ) ),
				self::link_target_attrs( $a['linkTarget'] ),
				$aria_current,
				$text
			);
		}

		$heading_css = self::style(
			array(
				'color'     => $a['textColor'],
				'font-size' => $a['fontSize'],
			)
		);

		return sprintf(
			'<div %1$s><h%2$d class="wp-block-gambol-site-title__heading"%3$s>%4$s</h%2$d></div>',
			self::wrapper( $a, 'wp-block-gambol-site-title' ),
			$level,
			$heading_css ? ' style="' . esc_attr( $heading_css ) . '"' : '',
			$text
		);
	}

	/*
	 * ---------------------------------------------------------------------
	 * Page Title
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Render Page Title block.
	 *
	 * @param array     $attributes Block attributes.
	 * @param string    $content    Block content.
	 * @param \WP_Block $block      Block instance.
	 * @return string
	 */
	public static function render_page_title( $attributes, $content = '', $block = null ) {
		$a         = self::attrs( 'page-title', $attributes );
		$title     = '';
		$permalink = '';
		$post_id   = 0;

		if ( $block instanceof \WP_Block && ! empty( $block->context['postId'] ) ) {
			$post_id = (int) $block->context['postId'];
		} elseif ( is_singular() ) {
			$post_id = (int) get_queried_object_id();
		}

		if ( $post_id ) {
			$title     = get_the_title( $post_id );
			$permalink = get_permalink( $post_id );
		} elseif ( is_home() && ! is_front_page() ) {
			$posts_page = (int) get_option( 'page_for_posts' );
			$title      = $posts_page ? get_the_title( $posts_page ) : __( 'Blog', 'gambol-builder' );
		} elseif ( is_search() ) {
			/* translators: %s: search query. */
			$title = sprintf( __( 'Search results for: %s', 'gambol-builder' ), esc_html( get_search_query( false ) ) );
		} elseif ( is_404() ) {
			$title = __( 'Page not found', 'gambol-builder' );
		} elseif ( is_archive() ) {
			$title = get_the_archive_title();
		} elseif ( get_the_ID() ) {
			$title     = get_the_title();
			$permalink = get_permalink();
		}

		if ( '' === trim( wp_strip_all_tags( (string) $title ) ) ) {
			return '';
		}

		$level = self::heading_level( $a['level'] );
		$text  = wp_kses_post( $title );

		if ( ! empty( $a['isLink'] ) && $permalink ) {
			$text = sprintf(
				'<a href="%1$s" class="wp-block-gambol-page-title__link"%2$s>%3$s</a>',
				esc_url( $permalink ),
				self::link_target_attrs( $a['linkTarget'] ),
				$text
			);
		}

		$heading_css = self::style(
			array(
				'color'     => $a['textColor'],
				'font-size' => $a['fontSize'],
			)
		);

		return sprintf(
			'<div %1$s><h%2$d class="wp-block-gambol-page-title__heading"%3$s>%4$s</h%2$d></div>',
			self::wrapper( $a, 'wp-block-gambol-page-title' ),
			$level,
			$heading_css ? ' style="' . esc_attr( $heading_css ) . '"' : '',
			$text
		);
	}

	/*
	 * ---------------------------------------------------------------------
	 * Login
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Current request URL (same approach as wp_login_form()).
	 *
	 * @return string
	 */
	private static function current_url() {
		$host = isset( $_SERVER['HTTP_HOST'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) : '';
		$uri  = isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/';
		if ( '' === $host ) {
			return home_url( '/' );
		}
		return ( is_ssl() ? 'https://' : 'http://' ) . $host . $uri;
	}

	/**
	 * Render Login block.
	 *
	 * Markup is hand-built (instead of wp_login_form()) so the block's
	 * .login-form / .login-field classes apply; field names, action URL and
	 * the login_form_top/middle/bottom filters match wp_login_form().
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_login( $attributes ) {
		$a        = self::attrs( 'login', $attributes );
		$radius   = (float) $a['borderRadius'] . 'px';
		$link_css = self::style( array( 'color' => $a['linkColor'] ? $a['linkColor'] : 'var(--gb-colors-primary)' ) );
		$wrapper  = self::wrapper( $a, 'wp-block-gambol-login' );

		$redirect = ! empty( $a['redirectUrl'] ) ? wp_validate_redirect( $a['redirectUrl'], self::current_url() ) : self::current_url();

		// Logged-in state.
		if ( is_user_logged_in() ) {
			$user = wp_get_current_user();
			return sprintf(
				'<div %1$s><p class="login-logged-in">%2$s <a href="%3$s" style="%4$s">%5$s</a></p></div>',
				$wrapper,
				/* translators: %s: user display name. */
				esc_html( sprintf( __( 'Logged in as %s.', 'gambol-builder' ), $user->display_name ) ),
				esc_url( wp_logout_url( $redirect ) ),
				esc_attr( $link_css ),
				esc_html__( 'Log out', 'gambol-builder' )
			);
		}

		$uid         = wp_unique_id( 'gambol-login-' );
		$label_css   = self::style( array( 'color' => $a['labelColor'] ) );
		$input_css   = self::style(
			array(
				'background-color' => $a['inputBgColor'] ? $a['inputBgColor'] : '#fff',
				'border-color'     => $a['inputBorderColor'],
				'border-radius'    => $radius,
			)
		);
		$button_css  = self::style(
			array(
				'background-color' => $a['buttonBgColor'] ? $a['buttonBgColor'] : 'var(--gb-colors-primary)',
				'color'            => $a['buttonTextColor'] ? $a['buttonTextColor'] : '#fff',
				'border-radius'    => $radius,
			)
		);
		$show_labels = ! empty( $a['showLabels'] );
		$label_class = $show_labels ? '' : ' class="gambol-sr-only"';
		$button_text = '' !== trim( (string) $a['buttonText'] ) ? $a['buttonText'] : __( 'Log In', 'gambol-builder' );

		$filter_args = array(
			'echo'           => false,
			'redirect'       => $redirect,
			'form_id'        => $uid,
			'label_username' => __( 'Username or Email', 'gambol-builder' ),
			'label_password' => __( 'Password', 'gambol-builder' ),
			'label_remember' => __( 'Remember me', 'gambol-builder' ),
			'label_log_in'   => $button_text,
			'id_username'    => $uid . '-user',
			'id_password'    => $uid . '-pass',
			'id_remember'    => $uid . '-remember',
			'id_submit'      => $uid . '-submit',
			'remember'       => ! empty( $a['showRemember'] ),
			'value_username' => '',
			'value_remember' => false,
		);

		ob_start();
		?>
		<div <?php echo $wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<form class="login-form" id="<?php echo esc_attr( $uid ); ?>" action="<?php echo esc_url( site_url( 'wp-login.php', 'login_post' ) ); ?>" method="post">
				<?php echo apply_filters( 'login_form_top', '', $filter_args ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<div class="login-field">
					<label for="<?php echo esc_attr( $uid . '-user' ); ?>"<?php echo $label_class; // phpcs:ignore ?><?php echo $label_css ? ' style="' . esc_attr( $label_css ) . '"' : ''; ?>><?php esc_html_e( 'Username or Email', 'gambol-builder' ); ?></label>
					<input type="text" name="log" id="<?php echo esc_attr( $uid . '-user' ); ?>" autocomplete="username" required style="<?php echo esc_attr( $input_css ); ?>"<?php echo $show_labels ? '' : ' placeholder="' . esc_attr__( 'Username or Email', 'gambol-builder' ) . '"'; ?> />
				</div>
				<div class="login-field">
					<label for="<?php echo esc_attr( $uid . '-pass' ); ?>"<?php echo $label_class; // phpcs:ignore ?><?php echo $label_css ? ' style="' . esc_attr( $label_css ) . '"' : ''; ?>><?php esc_html_e( 'Password', 'gambol-builder' ); ?></label>
					<input type="password" name="pwd" id="<?php echo esc_attr( $uid . '-pass' ); ?>" autocomplete="current-password" spellcheck="false" required style="<?php echo esc_attr( $input_css ); ?>"<?php echo $show_labels ? '' : ' placeholder="' . esc_attr__( 'Password', 'gambol-builder' ) . '"'; ?> />
				</div>
				<?php echo apply_filters( 'login_form_middle', '', $filter_args ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php if ( ! empty( $a['showRemember'] ) || ! empty( $a['showForgotPassword'] ) ) : ?>
					<div class="login-options">
						<?php if ( ! empty( $a['showRemember'] ) ) : ?>
							<label class="remember-me" for="<?php echo esc_attr( $uid . '-remember' ); ?>">
								<input type="checkbox" name="rememberme" id="<?php echo esc_attr( $uid . '-remember' ); ?>" value="forever" />
								<span><?php esc_html_e( 'Remember me', 'gambol-builder' ); ?></span>
							</label>
						<?php endif; ?>
						<?php if ( ! empty( $a['showForgotPassword'] ) ) : ?>
							<a href="<?php echo esc_url( wp_lostpassword_url( $redirect ) ); ?>" class="forgot-password" style="<?php echo esc_attr( $link_css ); ?>"><?php esc_html_e( 'Forgot password?', 'gambol-builder' ); ?></a>
						<?php endif; ?>
					</div>
				<?php endif; ?>
				<button type="submit" class="login-button" id="<?php echo esc_attr( $uid . '-submit' ); ?>" style="<?php echo esc_attr( $button_css ); ?>"><?php echo esc_html( $button_text ); ?></button>
				<input type="hidden" name="redirect_to" value="<?php echo esc_url( $redirect ); ?>" />
				<?php echo apply_filters( 'login_form_bottom', '', $filter_args ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php if ( ! empty( $a['showRegisterLink'] ) && get_option( 'users_can_register' ) ) : ?>
					<p class="register-link">
						<?php esc_html_e( "Don't have an account?", 'gambol-builder' ); ?>
						<a href="<?php echo esc_url( wp_registration_url() ); ?>" style="<?php echo esc_attr( $link_css ); ?>"><?php esc_html_e( 'Register', 'gambol-builder' ); ?></a>
					</p>
				<?php endif; ?>
			</form>
		</div>
		<?php
		return ob_get_clean();
	}

	/*
	 * ---------------------------------------------------------------------
	 * Table of Contents
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Resolve the post the TOC belongs to.
	 *
	 * @return \WP_Post|null
	 */
	private static function toc_post() {
		$post_id = is_singular() ? (int) get_queried_object_id() : 0;
		if ( ! $post_id ) {
			$post_id = (int) get_the_ID();
		}
		$post = $post_id ? get_post( $post_id ) : null;
		return ( $post instanceof \WP_Post ) ? $post : null;
	}

	/**
	 * Plain text of a heading's inner HTML (entities decoded).
	 *
	 * @param string $html Heading inner HTML.
	 * @return string
	 */
	private static function heading_text( $html ) {
		$text = html_entity_decode( wp_strip_all_tags( (string) $html ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
		return trim( preg_replace( '/\s+/u', ' ', $text ) );
	}

	/**
	 * Build (and cache) the ordered list of headings for a post by parsing the
	 * raw post_content. Never runs the_content, so there is no recursion.
	 *
	 * @param \WP_Post $post Post.
	 * @return array List of [ 'level', 'text', 'id', 'has_id' ].
	 */
	private static function get_heading_map( $post ) {
		if ( isset( self::$heading_maps[ $post->ID ] ) ) {
			return self::$heading_maps[ $post->ID ];
		}

		$headings = array();
		$used     = array();

		if ( preg_match_all( '/<h([1-6])\b([^>]*)>(.*?)<\/h\1\s*>/is', (string) $post->post_content, $matches, PREG_SET_ORDER ) ) {
			// First pass: reserve existing ids.
			foreach ( $matches as $match ) {
				if ( preg_match( '/\sid\s*=\s*(["\'])(.*?)\1/i', $match[2], $id_match ) && '' !== $id_match[2] ) {
					$used[ $id_match[2] ] = true;
				}
			}

			$index = 0;
			foreach ( $matches as $match ) {
				$text = self::heading_text( $match[3] );
				if ( '' === $text ) {
					continue;
				}
				$index++;

				$id     = '';
				$has_id = false;
				if ( preg_match( '/\sid\s*=\s*(["\'])(.*?)\1/i', $match[2], $id_match ) && '' !== $id_match[2] ) {
					$id     = $id_match[2];
					$has_id = true;
				} else {
					$base = sanitize_title( $text );
					if ( '' === $base ) {
						$base = 'heading-' . $index;
					}
					$id     = $base;
					$suffix = 2;
					while ( isset( $used[ $id ] ) ) {
						$id = $base . '-' . $suffix;
						$suffix++;
					}
					$used[ $id ] = true;
				}

				$headings[] = array(
					'level'  => (int) $match[1],
					'text'   => $text,
					'id'     => $id,
					'has_id' => $has_id,
				);
			}
		}

		self::$heading_maps[ $post->ID ] = $headings;
		return $headings;
	}

	/**
	 * Add matching ids to rendered heading blocks of a post that contains a TOC.
	 *
	 * @param string $block_content Rendered block.
	 * @param array  $block         Parsed block.
	 * @return string
	 */
	public static function add_heading_ids( $block_content, $block ) {
		if ( empty( $block['blockName'] ) || ! in_array( $block['blockName'], array( 'core/heading', 'gambol/heading' ), true ) ) {
			return $block_content;
		}
		if ( ! doing_filter( 'the_content' ) || is_admin() ) {
			return $block_content;
		}

		$post = get_post();
		if ( ! $post || ! has_block( 'gambol/table-of-contents', $post ) ) {
			return $block_content;
		}

		if ( ! preg_match( '/<h([1-6])\b([^>]*)>(.*?)<\/h\1\s*>/is', $block_content, $match ) ) {
			return $block_content;
		}
		if ( preg_match( '/\sid\s*=/i', $match[2] ) ) {
			return $block_content;
		}

		$text = self::heading_text( $match[3] );
		if ( '' === $text ) {
			return $block_content;
		}

		if ( ! isset( self::$consumed_ids[ $post->ID ] ) ) {
			self::$consumed_ids[ $post->ID ] = array();
		}

		foreach ( self::get_heading_map( $post ) as $heading ) {
			if ( $heading['has_id'] || isset( self::$consumed_ids[ $post->ID ][ $heading['id'] ] ) ) {
				continue;
			}
			if ( (int) $match[1] === $heading['level'] && $heading['text'] === $text ) {
				self::$consumed_ids[ $post->ID ][ $heading['id'] ] = true;
				$open_tag = '<h' . $match[1] . $match[2] . '>';
				$new_tag  = '<h' . $match[1] . ' id="' . esc_attr( $heading['id'] ) . '"' . $match[2] . '>';
				$pos      = strpos( $block_content, $open_tag );
				if ( false !== $pos ) {
					$block_content = substr_replace( $block_content, $new_tag, $pos, strlen( $open_tag ) );
				}
				break;
			}
		}

		return $block_content;
	}

	/**
	 * Render Table of Contents block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_table_of_contents( $attributes ) {
		$a    = self::attrs( 'table-of-contents', $attributes );
		$post = self::toc_post();

		if ( ! $post ) {
			return '';
		}

		$levels = array_map( 'intval', is_array( $a['headingLevels'] ) ? $a['headingLevels'] : array( 2, 3, 4 ) );

		$headings = array_values(
			array_filter(
				self::get_heading_map( $post ),
				function ( $heading ) use ( $levels ) {
					return in_array( $heading['level'], $levels, true );
				}
			)
		);

		if ( empty( $headings ) ) {
			return '';
		}

		$min_level   = min( wp_list_pluck( $headings, 'level' ) );
		$list_style  = in_array( $a['listStyle'], array( 'numbered', 'bullets', 'none' ), true ) ? $a['listStyle'] : 'numbered';
		$list_tag    = 'numbered' === $list_style ? 'ol' : 'ul';
		$uid         = wp_unique_id( 'gambol-toc-' );
		$content_id  = $uid . '-content';
		$title_id    = $uid . '-title';
		$collapsible = ! empty( $a['collapsible'] );
		$show_toggle = $collapsible && ! empty( $a['showToggle'] ) && ! empty( $a['showTitle'] );
		$collapsed   = $show_toggle && ! empty( $a['collapsed'] );
		$link_css    = self::style( array( 'color' => $a['linkColor'] ) );

		$classes = 'wp-block-gambol-table-of-contents list-' . $list_style . ' ' . $uid;
		if ( $collapsible ) {
			$classes .= ' is-collapsible';
		}
		if ( $collapsed ) {
			$classes .= ' is-collapsed';
		}

		$wrapper_css = self::style(
			array(
				'background-color' => $a['bgColor'],
				'border-color'     => $a['borderColor'],
				'border-radius'    => (float) $a['borderRadius'] . 'px',
				'padding'          => (float) $a['padding'] . 'px',
				'color'            => $a['textColor'],
			)
		);

		$extra = array(
			'data-smooth-scroll'    => ! empty( $a['smoothScroll'] ) ? '1' : '0',
			'data-highlight-active' => ! empty( $a['highlightActive'] ) ? '1' : '0',
		);
		$title = trim( (string) $a['title'] );
		if ( ! empty( $a['showTitle'] ) && '' !== $title ) {
			$extra['aria-labelledby'] = $title_id;
		} else {
			$extra['aria-label'] = __( 'Table of Contents', 'gambol-builder' );
		}

		$hover = self::css_value( $a['linkHoverColor'] );
		$style = $hover ? '<style>.' . $uid . ' .toc-item a:hover,.' . $uid . ' .toc-item a:focus{color:' . $hover . '!important}</style>' : '';

		$html  = $style;
		$html .= '<nav ' . self::wrapper( $a, $classes, $wrapper_css, $extra ) . '>';

		if ( ! empty( $a['showTitle'] ) && '' !== $title ) {
			$html .= '<div class="toc-header">';
			$html .= '<h2 class="toc-title" id="' . esc_attr( $title_id ) . '">' . wp_kses_post( $title ) . '</h2>';
			if ( $show_toggle ) {
				$html .= sprintf(
					'<button class="toc-toggle" type="button" aria-expanded="%1$s" aria-controls="%2$s"><span class="toggle-icon" aria-hidden="true">&#9660;</span><span class="gambol-sr-only">%3$s</span></button>',
					$collapsed ? 'false' : 'true',
					esc_attr( $content_id ),
					esc_html__( 'Toggle table of contents', 'gambol-builder' )
				);
			}
			$html .= '</div>';
		}

		$html .= '<div class="toc-content" id="' . esc_attr( $content_id ) . '">';
		$html .= '<' . $list_tag . ' class="toc-list">';
		foreach ( $headings as $heading ) {
			$indent = ( $heading['level'] - $min_level ) * 16;
			$html  .= sprintf(
				'<li class="toc-item toc-level-%1$d"%2$s><a href="#%3$s"%4$s>%5$s</a></li>',
				$heading['level'],
				$indent ? ' style="margin-left:' . (int) $indent . 'px"' : '',
				esc_attr( rawurlencode( $heading['id'] ) ),
				$link_css ? ' style="' . esc_attr( $link_css ) . '"' : '',
				esc_html( $heading['text'] )
			);
		}
		$html .= '</' . $list_tag . '>';
		$html .= '</div></nav>';

		return self::shared_assets() . $html;
	}
}

// Initialize.
Site_Blocks::init();
