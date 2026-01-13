/**
 * Star Rating Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Star Icon Component.
 */
const StarIcon = ( { filled, half, filledColor, emptyColor, size } ) => {
	if ( half ) {
		return (
			<svg viewBox="0 0 24 24" width={ size } height={ size } aria-hidden="true">
				<defs>
					<linearGradient id="halfGrad">
						<stop offset="50%" stopColor={ filledColor } />
						<stop offset="50%" stopColor={ emptyColor } />
					</linearGradient>
				</defs>
				<path
					d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
					fill="url(#halfGrad)"
				/>
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 24 24" width={ size } height={ size } fill={ filled ? filledColor : emptyColor } aria-hidden="true">
			<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
		</svg>
	);
};

/**
 * Star Rating Save Component.
 */
export default function save( { attributes } ) {
	const {
		rating,
		scale,
		size,
		spacing,
		filledColor,
		emptyColor,
		showLabel,
		labelPosition,
		labelFormat,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-star-rating wp-block-gambol-star-rating--label-${ labelPosition }`,
		'aria-label': `Rating: ${ rating } out of ${ scale } stars`,
	} );

	const renderStars = () => {
		const stars = [];
		for ( let i = 1; i <= scale; i++ ) {
			const filled = i <= Math.floor( rating );
			const half = ! filled && i === Math.ceil( rating ) && rating % 1 !== 0;

			stars.push(
				<span
					key={ i }
					className="wp-block-gambol-star-rating__star"
					style={ { marginRight: i < scale ? `${ spacing }px` : 0 } }
				>
					<StarIcon
						filled={ filled }
						half={ half }
						filledColor={ filledColor }
						emptyColor={ emptyColor }
						size={ size }
					/>
				</span>
			);
		}
		return stars;
	};

	const getLabel = () => {
		switch ( labelFormat ) {
			case 'rating':
				return `${ rating }`;
			case 'rating-scale':
				return `${ rating }/${ scale }`;
			case 'percentage':
				return `${ Math.round( ( rating / scale ) * 100 ) }%`;
			default:
				return `${ rating }`;
		}
	};

	return (
		<div { ...blockProps }>
			{ showLabel && labelPosition === 'left' && (
				<span className="wp-block-gambol-star-rating__label">{ getLabel() }</span>
			) }
			
			<div className="wp-block-gambol-star-rating__stars" role="img">
				{ renderStars() }
			</div>
			
			{ showLabel && labelPosition === 'right' && (
				<span className="wp-block-gambol-star-rating__label">{ getLabel() }</span>
			) }
		</div>
	);
}
