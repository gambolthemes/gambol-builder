/**
 * Testimonial Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Quote icon.
 */
const QuoteIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
		<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
	</svg>
);

/**
 * Star icon.
 */
const StarIcon = ( { filled } ) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		{ filled ? (
			<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
		) : (
			<path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
		) }
	</svg>
);

/**
 * Testimonial Save Component.
 */
export default function save( { attributes } ) {
	const {
		content,
		authorName,
		authorTitle,
		authorImage,
		showRating,
		rating,
		ratingColor,
		layout,
		alignment,
		imagePosition,
		imageSize,
		backgroundColor,
		textColor,
		quoteColor,
		showQuoteIcon,
		padding,
		borderRadius,
		boxShadow,
		contentFontSize,
		authorNameSize,
		authorTitleSize,
		htmlId,
		cssClasses,
	} = attributes;

	// Build CSS custom properties
	const cssVars = {
		'--gambol-testimonial-bg': backgroundColor,
		'--gambol-testimonial-color': textColor,
		'--gambol-testimonial-quote-color': quoteColor,
		'--gambol-testimonial-rating-color': ratingColor,
		'--gambol-testimonial-padding': `${ padding.top }px ${ padding.right }px ${ padding.bottom }px ${ padding.left }px`,
		'--gambol-testimonial-radius': borderRadius,
		'--gambol-testimonial-shadow': boxShadow,
		'--gambol-testimonial-content-size': `${ contentFontSize }px`,
		'--gambol-testimonial-name-size': `${ authorNameSize }px`,
		'--gambol-testimonial-title-size': `${ authorTitleSize }px`,
		'--gambol-testimonial-image-size': `${ imageSize }px`,
	};

	// Build class names
	const className = [
		'gambol-testimonial',
		`gambol-testimonial--${ layout }`,
		`gambol-testimonial--align-${ alignment }`,
		`gambol-testimonial--image-${ imagePosition }`,
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps.save( {
		className,
		style: cssVars,
		id: htmlId || undefined,
	} );

	// Render stars
	const renderStars = () => {
		return [ ...Array( 5 ) ].map( ( _, index ) => (
			<span key={ index } className="gambol-testimonial__star">
				<StarIcon filled={ index < rating } />
			</span>
		) );
	};

	return (
		<div { ...blockProps }>
			{ showQuoteIcon && (
				<div className="gambol-testimonial__quote-icon">
					<QuoteIcon />
				</div>
			) }

			{ showRating && (
				<div className="gambol-testimonial__rating" aria-label={ `${ rating } out of 5 stars` }>
					{ renderStars() }
				</div>
			) }

			<RichText.Content
				tagName="blockquote"
				className="gambol-testimonial__content"
				value={ content }
			/>

			<div className="gambol-testimonial__author">
				{ authorImage && (
					<img
						src={ authorImage }
						alt={ authorName }
						className="gambol-testimonial__author-image"
						loading="lazy"
					/>
				) }
				<div className="gambol-testimonial__author-info">
					<RichText.Content
						tagName="cite"
						className="gambol-testimonial__author-name"
						value={ authorName }
					/>
					<RichText.Content
						tagName="span"
						className="gambol-testimonial__author-title"
						value={ authorTitle }
					/>
				</div>
			</div>
		</div>
	);
}
