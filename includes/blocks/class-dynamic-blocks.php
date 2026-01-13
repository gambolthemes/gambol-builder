<?php
/**
 * Dynamic Blocks - Server-Side Rendering
 *
 * Handles PHP rendering for dynamic blocks that return null from save().
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\Blocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dynamic Blocks Class.
 */
class Dynamic_Blocks {

	/**
	 * List of dynamic blocks.
	 *
	 * @var array
	 */
	private static $dynamic_blocks = array(
		'breadcrumbs',
		'author-box',
		'post-navigation',
		'comments',
		'sitemap',
		'posts',
		'loop-grid',
		'loop-carousel',
		'post-title',
		'post-content',
		'post-excerpt',
		'featured-image',
		'portfolio',
		'shortcode',
	);

	/**
	 * Initialize the class.
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_dynamic_blocks' ) );
	}

	/**
	 * Register dynamic blocks with render callbacks.
	 */
	public static function register_dynamic_blocks() {
		foreach ( self::$dynamic_blocks as $block ) {
			$method_name = 'render_' . str_replace( '-', '_', $block );
			
			if ( method_exists( __CLASS__, $method_name ) ) {
				register_block_type(
					'gambol/' . $block,
					array(
						'render_callback' => array( __CLASS__, $method_name ),
					)
				);
			}
		}
	}

	/**
	 * Render Breadcrumbs block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_breadcrumbs( $attributes ) {
		$show_home         = isset( $attributes['showHome'] ) ? $attributes['showHome'] : true;
		$home_text         = isset( $attributes['homeText'] ) ? $attributes['homeText'] : 'Home';
		$separator         = isset( $attributes['separator'] ) ? $attributes['separator'] : '/';
		$show_current_page = isset( $attributes['showCurrentPage'] ) ? $attributes['showCurrentPage'] : true;
		$link_current_page = isset( $attributes['linkCurrentPage'] ) ? $attributes['linkCurrentPage'] : false;
		$text_color        = isset( $attributes['textColor'] ) ? $attributes['textColor'] : '';
		$link_color        = isset( $attributes['linkColor'] ) ? $attributes['linkColor'] : '';
		$separator_color   = isset( $attributes['separatorColor'] ) ? $attributes['separatorColor'] : '';
		$font_size         = isset( $attributes['fontSize'] ) ? $attributes['fontSize'] : '';

		$wrapper_style = $font_size ? 'font-size:' . esc_attr( $font_size ) . ';' : '';
		$link_style    = $link_color ? 'color:' . esc_attr( $link_color ) . ';' : '';
		$text_style    = $text_color ? 'color:' . esc_attr( $text_color ) . ';' : '';
		$sep_style     = $separator_color ? 'color:' . esc_attr( $separator_color ) . ';' : '';

		$breadcrumbs = array();

		if ( $show_home ) {
			$breadcrumbs[] = array(
				'text'    => $home_text,
				'link'    => home_url( '/' ),
				'is_link' => true,
			);
		}

		// Add category if on single post.
		if ( is_single() ) {
			$categories = get_the_category();
			if ( ! empty( $categories ) ) {
				$breadcrumbs[] = array(
					'text'    => $categories[0]->name,
					'link'    => get_category_link( $categories[0]->term_id ),
					'is_link' => true,
				);
			}
		}

		// Add current page.
		if ( $show_current_page ) {
			$breadcrumbs[] = array(
				'text'    => get_the_title(),
				'link'    => get_permalink(),
				'is_link' => $link_current_page,
			);
		}

		ob_start();
		?>
		<nav class="wp-block-gambol-breadcrumbs" aria-label="<?php esc_attr_e( 'Breadcrumbs', 'gambol-builder' ); ?>" style="<?php echo esc_attr( $wrapper_style ); ?>">
			<ol class="wp-block-gambol-breadcrumbs__list">
				<?php foreach ( $breadcrumbs as $index => $item ) : ?>
					<li class="wp-block-gambol-breadcrumbs__item">
						<?php if ( $item['is_link'] ) : ?>
							<a href="<?php echo esc_url( $item['link'] ); ?>" class="wp-block-gambol-breadcrumbs__link" style="<?php echo esc_attr( $link_style ); ?>">
								<?php echo esc_html( $item['text'] ); ?>
							</a>
						<?php else : ?>
							<span class="wp-block-gambol-breadcrumbs__current" style="<?php echo esc_attr( $text_style ); ?>">
								<?php echo esc_html( $item['text'] ); ?>
							</span>
						<?php endif; ?>
						<?php if ( $index < count( $breadcrumbs ) - 1 ) : ?>
							<span class="wp-block-gambol-breadcrumbs__separator" style="<?php echo esc_attr( $sep_style ); ?>">
								<?php echo esc_html( $separator ); ?>
							</span>
						<?php endif; ?>
					</li>
				<?php endforeach; ?>
			</ol>
		</nav>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render Author Box block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_author_box( $attributes ) {
		$show_avatar  = isset( $attributes['showAvatar'] ) ? $attributes['showAvatar'] : true;
		$avatar_size  = isset( $attributes['avatarSize'] ) ? $attributes['avatarSize'] : 80;
		$show_name    = isset( $attributes['showName'] ) ? $attributes['showName'] : true;
		$show_bio     = isset( $attributes['showBio'] ) ? $attributes['showBio'] : true;
		$show_link    = isset( $attributes['showLink'] ) ? $attributes['showLink'] : true;
		$link_text    = isset( $attributes['linkText'] ) ? $attributes['linkText'] : 'View all posts';

		$author_id = get_the_author_meta( 'ID' );
		$author_name = get_the_author();
		$author_bio = get_the_author_meta( 'description' );
		$author_url = get_author_posts_url( $author_id );

		ob_start();
		?>
		<div class="wp-block-gambol-author-box">
			<?php if ( $show_avatar ) : ?>
				<div class="wp-block-gambol-author-box__avatar">
					<?php echo get_avatar( $author_id, $avatar_size ); ?>
				</div>
			<?php endif; ?>
			<div class="wp-block-gambol-author-box__content">
				<?php if ( $show_name ) : ?>
					<h4 class="wp-block-gambol-author-box__name"><?php echo esc_html( $author_name ); ?></h4>
				<?php endif; ?>
				<?php if ( $show_bio && $author_bio ) : ?>
					<p class="wp-block-gambol-author-box__bio"><?php echo esc_html( $author_bio ); ?></p>
				<?php endif; ?>
				<?php if ( $show_link ) : ?>
					<a href="<?php echo esc_url( $author_url ); ?>" class="wp-block-gambol-author-box__link">
						<?php echo esc_html( $link_text ); ?>
					</a>
				<?php endif; ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render Post Navigation block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_post_navigation( $attributes ) {
		$show_title = isset( $attributes['showTitle'] ) ? $attributes['showTitle'] : true;
		$prev_text  = isset( $attributes['prevText'] ) ? $attributes['prevText'] : 'Previous';
		$next_text  = isset( $attributes['nextText'] ) ? $attributes['nextText'] : 'Next';

		$prev_post = get_previous_post();
		$next_post = get_next_post();

		if ( ! $prev_post && ! $next_post ) {
			return '';
		}

		ob_start();
		?>
		<nav class="wp-block-gambol-post-navigation" aria-label="<?php esc_attr_e( 'Post Navigation', 'gambol-builder' ); ?>">
			<?php if ( $prev_post ) : ?>
				<a href="<?php echo esc_url( get_permalink( $prev_post ) ); ?>" class="wp-block-gambol-post-navigation__prev">
					<span class="wp-block-gambol-post-navigation__label"><?php echo esc_html( $prev_text ); ?></span>
					<?php if ( $show_title ) : ?>
						<span class="wp-block-gambol-post-navigation__title"><?php echo esc_html( $prev_post->post_title ); ?></span>
					<?php endif; ?>
				</a>
			<?php endif; ?>
			<?php if ( $next_post ) : ?>
				<a href="<?php echo esc_url( get_permalink( $next_post ) ); ?>" class="wp-block-gambol-post-navigation__next">
					<span class="wp-block-gambol-post-navigation__label"><?php echo esc_html( $next_text ); ?></span>
					<?php if ( $show_title ) : ?>
						<span class="wp-block-gambol-post-navigation__title"><?php echo esc_html( $next_post->post_title ); ?></span>
					<?php endif; ?>
				</a>
			<?php endif; ?>
		</nav>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render Comments block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_comments( $attributes ) {
		if ( ! comments_open() && ! get_comments_number() ) {
			return '';
		}

		ob_start();
		?>
		<div class="wp-block-gambol-comments">
			<?php
			if ( comments_open() || get_comments_number() ) {
				comments_template();
			}
			?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render Sitemap block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_sitemap( $attributes ) {
		$show_pages      = isset( $attributes['showPages'] ) ? $attributes['showPages'] : true;
		$show_posts      = isset( $attributes['showPosts'] ) ? $attributes['showPosts'] : true;
		$show_categories = isset( $attributes['showCategories'] ) ? $attributes['showCategories'] : true;
		$show_tags       = isset( $attributes['showTags'] ) ? $attributes['showTags'] : false;
		$pages_title     = isset( $attributes['pagesTitle'] ) ? $attributes['pagesTitle'] : 'Pages';
		$posts_title     = isset( $attributes['postsTitle'] ) ? $attributes['postsTitle'] : 'Posts';
		$categories_title = isset( $attributes['categoriesTitle'] ) ? $attributes['categoriesTitle'] : 'Categories';
		$tags_title      = isset( $attributes['tagsTitle'] ) ? $attributes['tagsTitle'] : 'Tags';

		ob_start();
		?>
		<div class="wp-block-gambol-sitemap">
			<?php if ( $show_pages ) : ?>
				<div class="wp-block-gambol-sitemap__section">
					<h3 class="wp-block-gambol-sitemap__heading"><?php echo esc_html( $pages_title ); ?></h3>
					<ul class="wp-block-gambol-sitemap__list">
						<?php wp_list_pages( array( 'title_li' => '' ) ); ?>
					</ul>
				</div>
			<?php endif; ?>

			<?php if ( $show_posts ) : ?>
				<div class="wp-block-gambol-sitemap__section">
					<h3 class="wp-block-gambol-sitemap__heading"><?php echo esc_html( $posts_title ); ?></h3>
					<ul class="wp-block-gambol-sitemap__list">
						<?php
						$posts = get_posts( array( 'numberposts' => -1 ) );
						foreach ( $posts as $post ) :
							?>
							<li><a href="<?php echo esc_url( get_permalink( $post ) ); ?>"><?php echo esc_html( $post->post_title ); ?></a></li>
						<?php endforeach; ?>
					</ul>
				</div>
			<?php endif; ?>

			<?php if ( $show_categories ) : ?>
				<div class="wp-block-gambol-sitemap__section">
					<h3 class="wp-block-gambol-sitemap__heading"><?php echo esc_html( $categories_title ); ?></h3>
					<ul class="wp-block-gambol-sitemap__list">
						<?php wp_list_categories( array( 'title_li' => '', 'show_count' => true ) ); ?>
					</ul>
				</div>
			<?php endif; ?>

			<?php if ( $show_tags ) : ?>
				<div class="wp-block-gambol-sitemap__section">
					<h3 class="wp-block-gambol-sitemap__heading"><?php echo esc_html( $tags_title ); ?></h3>
					<div class="wp-block-gambol-sitemap__list wp-block-gambol-sitemap__list--tags">
						<?php
						$tags = get_tags();
						foreach ( $tags as $tag ) :
							?>
							<a href="<?php echo esc_url( get_tag_link( $tag ) ); ?>" class="tag-link"><?php echo esc_html( $tag->name ); ?></a>
						<?php endforeach; ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render Posts block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_posts( $attributes ) {
		$post_type          = isset( $attributes['postType'] ) ? $attributes['postType'] : 'post';
		$posts_per_page     = isset( $attributes['postsPerPage'] ) ? $attributes['postsPerPage'] : 6;
		$columns            = isset( $attributes['columns'] ) ? $attributes['columns'] : 3;
		$order_by           = isset( $attributes['orderBy'] ) ? $attributes['orderBy'] : 'date';
		$order              = isset( $attributes['order'] ) ? $attributes['order'] : 'desc';
		$show_featured_image = isset( $attributes['showFeaturedImage'] ) ? $attributes['showFeaturedImage'] : true;
		$show_title         = isset( $attributes['showTitle'] ) ? $attributes['showTitle'] : true;
		$show_excerpt       = isset( $attributes['showExcerpt'] ) ? $attributes['showExcerpt'] : true;
		$excerpt_length     = isset( $attributes['excerptLength'] ) ? $attributes['excerptLength'] : 20;
		$show_meta          = isset( $attributes['showMeta'] ) ? $attributes['showMeta'] : true;
		$show_date          = isset( $attributes['showDate'] ) ? $attributes['showDate'] : true;
		$show_author        = isset( $attributes['showAuthor'] ) ? $attributes['showAuthor'] : true;
		$show_read_more     = isset( $attributes['showReadMore'] ) ? $attributes['showReadMore'] : true;
		$read_more_text     = isset( $attributes['readMoreText'] ) ? $attributes['readMoreText'] : 'Read More';
		$gap                = isset( $attributes['gap'] ) ? $attributes['gap'] : 24;

		$query_args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $posts_per_page,
			'orderby'        => $order_by,
			'order'          => $order,
		);

		$query = new \WP_Query( $query_args );

		if ( ! $query->have_posts() ) {
			return '<p>' . esc_html__( 'No posts found.', 'gambol-builder' ) . '</p>';
		}

		$style = '--posts-columns:' . intval( $columns ) . ';--posts-gap:' . intval( $gap ) . 'px;';

		ob_start();
		?>
		<div class="wp-block-gambol-posts" style="<?php echo esc_attr( $style ); ?>">
			<div class="wp-block-gambol-posts__grid">
				<?php
				while ( $query->have_posts() ) :
					$query->the_post();
					?>
					<article class="wp-block-gambol-posts__item">
						<?php if ( $show_featured_image && has_post_thumbnail() ) : ?>
							<div class="wp-block-gambol-posts__image">
								<a href="<?php the_permalink(); ?>">
									<?php the_post_thumbnail( 'medium_large' ); ?>
								</a>
							</div>
						<?php endif; ?>
						<div class="wp-block-gambol-posts__content">
							<?php if ( $show_meta && ( $show_date || $show_author ) ) : ?>
								<div class="wp-block-gambol-posts__meta">
									<?php if ( $show_date ) : ?>
										<span><?php echo get_the_date(); ?></span>
									<?php endif; ?>
									<?php if ( $show_date && $show_author ) : ?>
										<span class="sep">•</span>
									<?php endif; ?>
									<?php if ( $show_author ) : ?>
										<span><?php the_author(); ?></span>
									<?php endif; ?>
								</div>
							<?php endif; ?>
							<?php if ( $show_title ) : ?>
								<h3 class="wp-block-gambol-posts__title">
									<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
								</h3>
							<?php endif; ?>
							<?php if ( $show_excerpt ) : ?>
								<p class="wp-block-gambol-posts__excerpt">
									<?php echo wp_trim_words( get_the_excerpt(), $excerpt_length ); ?>
								</p>
							<?php endif; ?>
							<?php if ( $show_read_more ) : ?>
								<a href="<?php the_permalink(); ?>" class="wp-block-gambol-posts__read-more">
									<?php echo esc_html( $read_more_text ); ?>
								</a>
							<?php endif; ?>
						</div>
					</article>
				<?php endwhile; ?>
			</div>
		</div>
		<?php
		wp_reset_postdata();
		return ob_get_clean();
	}

	/**
	 * Render Loop Grid block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_loop_grid( $attributes ) {
		$post_type      = isset( $attributes['postType'] ) ? $attributes['postType'] : 'post';
		$posts_per_page = isset( $attributes['postsPerPage'] ) ? $attributes['postsPerPage'] : 9;
		$columns        = isset( $attributes['columns'] ) ? $attributes['columns'] : 3;
		$order_by       = isset( $attributes['orderBy'] ) ? $attributes['orderBy'] : 'date';
		$order          = isset( $attributes['order'] ) ? $attributes['order'] : 'desc';
		$show_image     = isset( $attributes['showImage'] ) ? $attributes['showImage'] : true;
		$show_title     = isset( $attributes['showTitle'] ) ? $attributes['showTitle'] : true;
		$show_excerpt   = isset( $attributes['showExcerpt'] ) ? $attributes['showExcerpt'] : true;
		$excerpt_length = isset( $attributes['excerptLength'] ) ? $attributes['excerptLength'] : 15;
		$show_meta      = isset( $attributes['showMeta'] ) ? $attributes['showMeta'] : true;
		$show_category  = isset( $attributes['showCategory'] ) ? $attributes['showCategory'] : true;
		$gap            = isset( $attributes['gap'] ) ? $attributes['gap'] : 24;

		$query_args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $posts_per_page,
			'orderby'        => $order_by,
			'order'          => $order,
		);

		$query = new \WP_Query( $query_args );

		if ( ! $query->have_posts() ) {
			return '<p>' . esc_html__( 'No posts found.', 'gambol-builder' ) . '</p>';
		}

		$style = '--loop-grid-columns:' . intval( $columns ) . ';--loop-grid-gap:' . intval( $gap ) . 'px;';

		ob_start();
		?>
		<div class="wp-block-gambol-loop-grid" style="<?php echo esc_attr( $style ); ?>">
			<div class="wp-block-gambol-loop-grid__container">
				<?php
				while ( $query->have_posts() ) :
					$query->the_post();
					$categories = get_the_category();
					$first_category = ! empty( $categories ) ? $categories[0]->name : '';
					?>
					<article class="wp-block-gambol-loop-grid__item">
						<?php if ( $show_image && has_post_thumbnail() ) : ?>
							<div class="wp-block-gambol-loop-grid__image">
								<a href="<?php the_permalink(); ?>">
									<?php the_post_thumbnail( 'medium_large' ); ?>
								</a>
								<?php if ( $show_category && $first_category ) : ?>
									<span class="wp-block-gambol-loop-grid__category"><?php echo esc_html( $first_category ); ?></span>
								<?php endif; ?>
							</div>
						<?php endif; ?>
						<div class="wp-block-gambol-loop-grid__content">
							<?php if ( $show_meta ) : ?>
								<div class="wp-block-gambol-loop-grid__meta">
									<span><?php echo get_the_date(); ?></span>
									<span class="sep">•</span>
									<span><?php the_author(); ?></span>
								</div>
							<?php endif; ?>
							<?php if ( $show_title ) : ?>
								<h3 class="wp-block-gambol-loop-grid__title">
									<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
								</h3>
							<?php endif; ?>
							<?php if ( $show_excerpt ) : ?>
								<p class="wp-block-gambol-loop-grid__excerpt">
									<?php echo wp_trim_words( get_the_excerpt(), $excerpt_length ); ?>
								</p>
							<?php endif; ?>
						</div>
					</article>
				<?php endwhile; ?>
			</div>
		</div>
		<?php
		wp_reset_postdata();
		return ob_get_clean();
	}

	/**
	 * Render Loop Carousel block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_loop_carousel( $attributes ) {
		$post_type      = isset( $attributes['postType'] ) ? $attributes['postType'] : 'post';
		$posts_per_page = isset( $attributes['postsPerPage'] ) ? $attributes['postsPerPage'] : 6;
		$slides_to_show = isset( $attributes['slidesToShow'] ) ? $attributes['slidesToShow'] : 3;
		$autoplay       = isset( $attributes['autoplay'] ) ? $attributes['autoplay'] : false;
		$autoplay_speed = isset( $attributes['autoplaySpeed'] ) ? $attributes['autoplaySpeed'] : 3000;
		$show_arrows    = isset( $attributes['showArrows'] ) ? $attributes['showArrows'] : true;
		$show_dots      = isset( $attributes['showDots'] ) ? $attributes['showDots'] : true;
		$show_image     = isset( $attributes['showImage'] ) ? $attributes['showImage'] : true;
		$show_title     = isset( $attributes['showTitle'] ) ? $attributes['showTitle'] : true;
		$show_excerpt   = isset( $attributes['showExcerpt'] ) ? $attributes['showExcerpt'] : true;
		$excerpt_length = isset( $attributes['excerptLength'] ) ? $attributes['excerptLength'] : 15;
		$show_meta      = isset( $attributes['showMeta'] ) ? $attributes['showMeta'] : true;
		$order_by       = isset( $attributes['orderBy'] ) ? $attributes['orderBy'] : 'date';
		$order          = isset( $attributes['order'] ) ? $attributes['order'] : 'desc';

		$query_args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $posts_per_page,
			'orderby'        => $order_by,
			'order'          => $order,
		);

		$query = new \WP_Query( $query_args );

		if ( ! $query->have_posts() ) {
			return '<p>' . esc_html__( 'No posts found.', 'gambol-builder' ) . '</p>';
		}

		$carousel_data = wp_json_encode( array(
			'slidesToShow'  => $slides_to_show,
			'autoplay'      => $autoplay,
			'autoplaySpeed' => $autoplay_speed,
		) );

		ob_start();
		?>
		<div class="wp-block-gambol-loop-carousel" data-carousel="<?php echo esc_attr( $carousel_data ); ?>">
			<?php if ( $show_arrows ) : ?>
				<button class="wp-block-gambol-loop-carousel__arrow arrow-prev" aria-label="<?php esc_attr_e( 'Previous', 'gambol-builder' ); ?>">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
				</button>
			<?php endif; ?>

			<div class="wp-block-gambol-loop-carousel__track">
				<div class="wp-block-gambol-loop-carousel__slides" style="--slides-to-show:<?php echo intval( $slides_to_show ); ?>;">
					<?php
					while ( $query->have_posts() ) :
						$query->the_post();
						?>
						<article class="wp-block-gambol-loop-carousel__slide">
							<?php if ( $show_image && has_post_thumbnail() ) : ?>
								<div class="wp-block-gambol-loop-carousel__image">
									<a href="<?php the_permalink(); ?>">
										<?php the_post_thumbnail( 'medium_large' ); ?>
									</a>
								</div>
							<?php endif; ?>
							<div class="wp-block-gambol-loop-carousel__content">
								<?php if ( $show_meta ) : ?>
									<div class="wp-block-gambol-loop-carousel__meta">
										<span><?php echo get_the_date(); ?></span>
										<span class="sep">•</span>
										<span><?php the_author(); ?></span>
									</div>
								<?php endif; ?>
								<?php if ( $show_title ) : ?>
									<h3 class="wp-block-gambol-loop-carousel__title">
										<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
									</h3>
								<?php endif; ?>
								<?php if ( $show_excerpt ) : ?>
									<p class="wp-block-gambol-loop-carousel__excerpt">
										<?php echo wp_trim_words( get_the_excerpt(), $excerpt_length ); ?>
									</p>
								<?php endif; ?>
							</div>
						</article>
					<?php endwhile; ?>
				</div>
			</div>

			<?php if ( $show_arrows ) : ?>
				<button class="wp-block-gambol-loop-carousel__arrow arrow-next" aria-label="<?php esc_attr_e( 'Next', 'gambol-builder' ); ?>">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
				</button>
			<?php endif; ?>

			<?php if ( $show_dots ) : ?>
				<div class="wp-block-gambol-loop-carousel__dots"></div>
			<?php endif; ?>
		</div>
		<?php
		wp_reset_postdata();
		return ob_get_clean();
	}

	/**
	 * Render Post Title block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_post_title( $attributes ) {
		$tag        = isset( $attributes['level'] ) ? 'h' . intval( $attributes['level'] ) : 'h1';
		$link       = isset( $attributes['isLink'] ) ? $attributes['isLink'] : false;
		$text_align = isset( $attributes['textAlign'] ) ? $attributes['textAlign'] : '';
		$color      = isset( $attributes['textColor'] ) ? $attributes['textColor'] : '';

		$style = '';
		if ( $text_align ) {
			$style .= 'text-align:' . esc_attr( $text_align ) . ';';
		}
		if ( $color ) {
			$style .= 'color:' . esc_attr( $color ) . ';';
		}

		$title = get_the_title();

		if ( $link ) {
			$title = '<a href="' . esc_url( get_permalink() ) . '">' . esc_html( $title ) . '</a>';
		} else {
			$title = esc_html( $title );
		}

		return sprintf(
			'<%1$s class="wp-block-gambol-post-title" style="%2$s">%3$s</%1$s>',
			$tag,
			esc_attr( $style ),
			$title
		);
	}

	/**
	 * Render Post Content block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_post_content( $attributes ) {
		$content = apply_filters( 'the_content', get_the_content() );
		
		return sprintf(
			'<div class="wp-block-gambol-post-content entry-content">%s</div>',
			$content
		);
	}

	/**
	 * Render Post Excerpt block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_post_excerpt( $attributes ) {
		$excerpt_length = isset( $attributes['excerptLength'] ) ? $attributes['excerptLength'] : 55;
		$show_read_more = isset( $attributes['showReadMore'] ) ? $attributes['showReadMore'] : true;
		$read_more_text = isset( $attributes['readMoreText'] ) ? $attributes['readMoreText'] : 'Read More';

		$excerpt = wp_trim_words( get_the_excerpt(), $excerpt_length );

		ob_start();
		?>
		<div class="wp-block-gambol-post-excerpt">
			<p><?php echo esc_html( $excerpt ); ?></p>
			<?php if ( $show_read_more ) : ?>
				<a href="<?php the_permalink(); ?>" class="wp-block-gambol-post-excerpt__more">
					<?php echo esc_html( $read_more_text ); ?>
				</a>
			<?php endif; ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render Featured Image block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_featured_image( $attributes ) {
		if ( ! has_post_thumbnail() ) {
			return '';
		}

		$size       = isset( $attributes['sizeSlug'] ) ? $attributes['sizeSlug'] : 'large';
		$is_link    = isset( $attributes['isLink'] ) ? $attributes['isLink'] : false;
		$link_target = isset( $attributes['linkTarget'] ) ? $attributes['linkTarget'] : '_self';

		$image = get_the_post_thumbnail( null, $size, array( 'class' => 'wp-block-gambol-featured-image__img' ) );

		if ( $is_link ) {
			$image = sprintf(
				'<a href="%1$s" target="%2$s">%3$s</a>',
				esc_url( get_permalink() ),
				esc_attr( $link_target ),
				$image
			);
		}

		return sprintf(
			'<figure class="wp-block-gambol-featured-image">%s</figure>',
			$image
		);
	}

	/**
	 * Render Portfolio block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_portfolio( $attributes ) {
		$post_type      = isset( $attributes['postType'] ) ? $attributes['postType'] : 'post';
		$posts_per_page = isset( $attributes['postsPerPage'] ) ? $attributes['postsPerPage'] : 9;
		$columns        = isset( $attributes['columns'] ) ? $attributes['columns'] : 3;
		$order_by       = isset( $attributes['orderBy'] ) ? $attributes['orderBy'] : 'date';
		$order          = isset( $attributes['order'] ) ? $attributes['order'] : 'desc';
		$show_filter    = isset( $attributes['showFilter'] ) ? $attributes['showFilter'] : true;
		$show_title     = isset( $attributes['showTitle'] ) ? $attributes['showTitle'] : true;
		$show_category  = isset( $attributes['showCategory'] ) ? $attributes['showCategory'] : true;
		$show_overlay   = isset( $attributes['showOverlay'] ) ? $attributes['showOverlay'] : true;
		$gap            = isset( $attributes['gap'] ) ? $attributes['gap'] : 16;

		$query_args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $posts_per_page,
			'orderby'        => $order_by,
			'order'          => $order,
		);

		$query = new \WP_Query( $query_args );

		if ( ! $query->have_posts() ) {
			return '<p>' . esc_html__( 'No items found.', 'gambol-builder' ) . '</p>';
		}

		// Get unique categories.
		$all_categories = array();
		$temp_query = new \WP_Query( $query_args );
		while ( $temp_query->have_posts() ) {
			$temp_query->the_post();
			$cats = get_the_category();
			foreach ( $cats as $cat ) {
				$all_categories[ $cat->term_id ] = $cat;
			}
		}
		wp_reset_postdata();

		$style = '--portfolio-columns:' . intval( $columns ) . ';--portfolio-gap:' . intval( $gap ) . 'px;';

		ob_start();
		?>
		<div class="wp-block-gambol-portfolio" style="<?php echo esc_attr( $style ); ?>">
			<?php if ( $show_filter && ! empty( $all_categories ) ) : ?>
				<div class="wp-block-gambol-portfolio__filter">
					<button class="wp-block-gambol-portfolio__filter-btn active" data-filter="all">
						<?php esc_html_e( 'All', 'gambol-builder' ); ?>
					</button>
					<?php foreach ( $all_categories as $cat ) : ?>
						<button class="wp-block-gambol-portfolio__filter-btn" data-filter="<?php echo esc_attr( $cat->slug ); ?>">
							<?php echo esc_html( $cat->name ); ?>
						</button>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<div class="wp-block-gambol-portfolio__grid">
				<?php
				while ( $query->have_posts() ) :
					$query->the_post();
					$categories = get_the_category();
					$cat_slugs = array_map( function( $c ) { return $c->slug; }, $categories );
					$first_category = ! empty( $categories ) ? $categories[0]->name : '';
					?>
					<article class="wp-block-gambol-portfolio__item" data-categories="<?php echo esc_attr( implode( ',', $cat_slugs ) ); ?>">
						<div class="wp-block-gambol-portfolio__image">
							<?php if ( has_post_thumbnail() ) : ?>
								<?php the_post_thumbnail( 'medium_large' ); ?>
							<?php else : ?>
								<div class="wp-block-gambol-portfolio__placeholder">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
										<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
									</svg>
								</div>
							<?php endif; ?>
						</div>
						<?php if ( $show_overlay ) : ?>
							<div class="wp-block-gambol-portfolio__overlay">
								<div class="wp-block-gambol-portfolio__overlay-content">
									<?php if ( $show_category && $first_category ) : ?>
										<span class="wp-block-gambol-portfolio__category"><?php echo esc_html( $first_category ); ?></span>
									<?php endif; ?>
									<?php if ( $show_title ) : ?>
										<h3 class="wp-block-gambol-portfolio__title">
											<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
										</h3>
									<?php endif; ?>
								</div>
							</div>
						<?php endif; ?>
					</article>
				<?php endwhile; ?>
			</div>
		</div>
		<?php
		wp_reset_postdata();
		return ob_get_clean();
	}

	/**
	 * Render Shortcode block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public static function render_shortcode( $attributes ) {
		$shortcode = isset( $attributes['shortcode'] ) ? $attributes['shortcode'] : '';

		if ( empty( $shortcode ) ) {
			return '';
		}

		$wrapper_attributes = get_block_wrapper_attributes( array(
			'class' => 'wp-block-gambol-shortcode',
		) );

		ob_start();
		?>
		<div <?php echo $wrapper_attributes; ?>>
			<?php echo do_shortcode( $shortcode ); ?>
		</div>
		<?php
		return ob_get_clean();
	}
}

// Initialize.
Dynamic_Blocks::init();
