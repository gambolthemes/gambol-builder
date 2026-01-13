/**
 * Media Carousel Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Media Carousel Save Component.
 */
export default function save( { attributes } ) {
	const {
		items,
		slidesToShow,
		autoplay,
		autoplaySpeed,
		infinite,
		dots,
		arrows,
		thumbnails,
		aspectRatio,
	} = attributes;

	if ( items.length === 0 ) {
		return null;
	}

	const blockProps = useBlockProps.save( {
		className: 'wp-block-gambol-media-carousel',
		'data-slides-to-show': slidesToShow,
		'data-autoplay': autoplay,
		'data-autoplay-speed': autoplaySpeed,
		'data-infinite': infinite,
		'data-dots': dots,
		'data-arrows': arrows,
		'data-thumbnails': thumbnails,
	} );

	return (
		<div { ...blockProps }>
			{ arrows && (
				<button className="wp-block-gambol-media-carousel__arrow wp-block-gambol-media-carousel__arrow--prev" aria-label="Previous">
					‹
				</button>
			) }
			
			<div className="wp-block-gambol-media-carousel__viewport">
				<div className="wp-block-gambol-media-carousel__track">
					{ items.map( ( item, index ) => (
						<div 
							key={ index }
							className="wp-block-gambol-media-carousel__slide"
							style={ { aspectRatio } }
							data-type={ item.type }
						>
							{ item.type === 'video' ? (
								<>
									<img 
										src={ item.thumbnail } 
										alt={ item.alt }
										className="wp-block-gambol-media-carousel__poster"
										loading={ index === 0 ? 'eager' : 'lazy' }
									/>
									<button className="wp-block-gambol-media-carousel__play" aria-label="Play video" data-src={ item.url }>
										▶
									</button>
								</>
							) : (
								<img 
									src={ item.url } 
									alt={ item.alt }
									loading={ index === 0 ? 'eager' : 'lazy' }
								/>
							) }
						</div>
					) ) }
				</div>
			</div>

			{ arrows && (
				<button className="wp-block-gambol-media-carousel__arrow wp-block-gambol-media-carousel__arrow--next" aria-label="Next">
					›
				</button>
			) }

			{ dots && (
				<div className="wp-block-gambol-media-carousel__dots">
					{ items.map( ( _, index ) => (
						<button
							key={ index }
							className={ `wp-block-gambol-media-carousel__dot${ index === 0 ? ' is-active' : '' }` }
							aria-label={ `Go to slide ${ index + 1 }` }
						/>
					) ) }
				</div>
			) }

			{ thumbnails && (
				<div className="wp-block-gambol-media-carousel__thumbnails">
					{ items.map( ( item, index ) => (
						<button
							key={ index }
							className={ `wp-block-gambol-media-carousel__thumbnail${ index === 0 ? ' is-active' : '' }` }
							aria-label={ `Go to slide ${ index + 1 }` }
						>
							<img src={ item.thumbnail || item.url } alt="" loading="lazy" />
							{ item.type === 'video' && <span className="wp-block-gambol-media-carousel__thumbnail-play">▶</span> }
						</button>
					) ) }
				</div>
			) }
		</div>
	);
}
