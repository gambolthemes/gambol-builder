/**
 * Image Carousel Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Image Carousel Save Component.
 */
export default function save( { attributes } ) {
	const {
		images,
		slidesToShow,
		slidesToScroll,
		autoplay,
		autoplaySpeed,
		infinite,
		dots,
		arrows,
		pauseOnHover,
		gap,
		aspectRatio,
	} = attributes;

	if ( images.length === 0 ) {
		return null;
	}

	const blockProps = useBlockProps.save( {
		className: 'wp-block-gambol-image-carousel',
		'data-slides-to-show': slidesToShow,
		'data-slides-to-scroll': slidesToScroll,
		'data-autoplay': autoplay,
		'data-autoplay-speed': autoplaySpeed,
		'data-infinite': infinite,
		'data-dots': dots,
		'data-arrows': arrows,
		'data-pause-on-hover': pauseOnHover,
		'data-gap': gap,
	} );

	return (
		<div { ...blockProps }>
			{ arrows && (
				<button className="wp-block-gambol-image-carousel__arrow wp-block-gambol-image-carousel__arrow--prev" aria-label="Previous">
					‹
				</button>
			) }
			
			<div className="wp-block-gambol-image-carousel__viewport">
				<div 
					className="wp-block-gambol-image-carousel__track"
					style={ { gap: `${ gap }px` } }
				>
					{ images.map( ( image, index ) => (
						<div 
							key={ image.id || index }
							className="wp-block-gambol-image-carousel__slide"
							style={ { aspectRatio } }
						>
							<img 
								src={ image.url } 
								alt={ image.alt }
								loading={ index === 0 ? 'eager' : 'lazy' }
							/>
							{ image.caption && (
								<figcaption className="wp-block-gambol-image-carousel__caption">
									{ image.caption }
								</figcaption>
							) }
						</div>
					) ) }
				</div>
			</div>

			{ arrows && (
				<button className="wp-block-gambol-image-carousel__arrow wp-block-gambol-image-carousel__arrow--next" aria-label="Next">
					›
				</button>
			) }

			{ dots && (
				<div className="wp-block-gambol-image-carousel__dots">
					{ images.map( ( _, index ) => (
						<button
							key={ index }
							className={ `wp-block-gambol-image-carousel__dot${ index === 0 ? ' is-active' : '' }` }
							aria-label={ `Go to slide ${ index + 1 }` }
						/>
					) ) }
				</div>
			) }
		</div>
	);
}
