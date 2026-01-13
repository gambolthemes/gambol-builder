/**
 * Testimonial Carousel Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Star Rating Component.
 */
const StarRating = ( { rating, color } ) => {
	return (
		<div className="wp-block-gambol-testimonial-carousel__rating">
			{ [ 1, 2, 3, 4, 5 ].map( ( star ) => (
				<span
					key={ star }
					style={ { color: star <= rating ? color : '#ddd' } }
				>
					★
				</span>
			) ) }
		</div>
	);
};

/**
 * Testimonial Carousel Save Component.
 */
export default function save( { attributes } ) {
	const {
		testimonials,
		layout,
		slidesToShow,
		autoplay,
		autoplaySpeed,
		showDots,
		showArrows,
		showRating,
		showImage,
		cardBackgroundColor,
		textColor,
		authorColor,
		ratingColor,
		borderRadius,
		padding,
	} = attributes;

	if ( ! testimonials || testimonials.length === 0 ) {
		return null;
	}

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-testimonial-carousel wp-block-gambol-testimonial-carousel--${ layout }`,
		'data-slides-to-show': slidesToShow,
		'data-autoplay': autoplay,
		'data-autoplay-speed': autoplaySpeed,
	} );

	const cardStyle = {
		backgroundColor: cardBackgroundColor || undefined,
		color: textColor || undefined,
		borderRadius: `${ borderRadius }px`,
		padding: `${ padding }px`,
	};

	return (
		<div { ...blockProps }>
			{ showArrows && (
				<button className="wp-block-gambol-testimonial-carousel__arrow wp-block-gambol-testimonial-carousel__arrow--prev" aria-label="Previous">
					<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
						<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
					</svg>
				</button>
			) }

			<div className="wp-block-gambol-testimonial-carousel__viewport">
				<div className="wp-block-gambol-testimonial-carousel__track">
					{ testimonials.map( ( testimonial, index ) => (
						<div
							key={ index }
							className="wp-block-gambol-testimonial-carousel__slide"
							style={ cardStyle }
						>
							{ showRating && testimonial.rating > 0 && (
								<StarRating rating={ testimonial.rating } color={ ratingColor } />
							) }

							<blockquote className="wp-block-gambol-testimonial-carousel__content">
								<p>{ testimonial.content }</p>
							</blockquote>

							<div className="wp-block-gambol-testimonial-carousel__author">
								{ showImage && testimonial.image && (
									<img
										src={ testimonial.image }
										alt={ testimonial.author }
										className="wp-block-gambol-testimonial-carousel__image"
										loading="lazy"
									/>
								) }
								<div className="wp-block-gambol-testimonial-carousel__info">
									<cite style={ { color: authorColor || undefined } }>
										{ testimonial.author }
									</cite>
									{ testimonial.position && (
										<span className="wp-block-gambol-testimonial-carousel__position">
											{ testimonial.position }
										</span>
									) }
								</div>
							</div>
						</div>
					) ) }
				</div>
			</div>

			{ showArrows && (
				<button className="wp-block-gambol-testimonial-carousel__arrow wp-block-gambol-testimonial-carousel__arrow--next" aria-label="Next">
					<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
						<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
					</svg>
				</button>
			) }

			{ showDots && testimonials.length > 1 && (
				<div className="wp-block-gambol-testimonial-carousel__dots">
					{ testimonials.map( ( _, index ) => (
						<button
							key={ index }
							className={ `wp-block-gambol-testimonial-carousel__dot ${ index === 0 ? 'is-active' : '' }` }
							aria-label={ `Go to slide ${ index + 1 }` }
						/>
					) ) }
				</div>
			) }
		</div>
	);
}
