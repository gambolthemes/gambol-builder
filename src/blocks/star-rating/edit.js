/**
 * Star Rating Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

/**
 * Star Icon Component.
 */
const StarIcon = ( { filled, half, filledColor, emptyColor, size } ) => {
	if ( half ) {
		return (
			<svg viewBox="0 0 24 24" width={ size } height={ size }>
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
		<svg viewBox="0 0 24 24" width={ size } height={ size } fill={ filled ? filledColor : emptyColor }>
			<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
		</svg>
	);
};

/**
 * Star Rating Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
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

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-star-rating wp-block-gambol-star-rating--label-${ labelPosition }`,
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
					onClick={ () => setAttributes( { rating: i } ) }
					onKeyDown={ ( e ) => e.key === 'Enter' && setAttributes( { rating: i } ) }
					role="button"
					tabIndex={ 0 }
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
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Star Rating', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Rating', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Rating', 'gambol-builder' ) }
									value={ rating }
									onChange={ ( value ) => setAttributes( { rating: value } ) }
									min={ 0 }
									max={ scale }
									step={ 0.5 }
								/>
								<RangeSlider
									label={ __( 'Scale (Max Stars)', 'gambol-builder' ) }
									value={ scale }
									onChange={ ( value ) => setAttributes( { scale: value } ) }
									min={ 1 }
									max={ 10 }
								/>
							</Section>

							<Section title={ __( 'Label', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Label', 'gambol-builder' ) }
									checked={ showLabel }
									onChange={ ( value ) => setAttributes( { showLabel: value } ) }
								/>
								{ showLabel && (
									<>
										<ButtonGroup
											label={ __( 'Position', 'gambol-builder' ) }
											value={ labelPosition }
											onChange={ ( value ) => setAttributes( { labelPosition: value } ) }
											options={ [
												{ value: 'left', label: __( 'Left', 'gambol-builder' ) },
												{ value: 'right', label: __( 'Right', 'gambol-builder' ) },
											] }
										/>
										<ButtonGroup
											label={ __( 'Format', 'gambol-builder' ) }
											value={ labelFormat }
											onChange={ ( value ) => setAttributes( { labelFormat: value } ) }
											options={ [
												{ value: 'rating', label: '4.5' },
												{ value: 'rating-scale', label: '4.5/5' },
												{ value: 'percentage', label: '90%' },
											] }
										/>
									</>
								) }
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Size', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Star Size (px)', 'gambol-builder' ) }
									value={ size }
									onChange={ ( value ) => setAttributes( { size: value } ) }
									min={ 12 }
									max={ 80 }
								/>
								<RangeSlider
									label={ __( 'Spacing (px)', 'gambol-builder' ) }
									value={ spacing }
									onChange={ ( value ) => setAttributes( { spacing: value } ) }
									min={ 0 }
									max={ 20 }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Filled Color', 'gambol-builder' ) }
									value={ filledColor }
									onChange={ ( value ) => setAttributes( { filledColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Empty Color', 'gambol-builder' ) }
									value={ emptyColor }
									onChange={ ( value ) => setAttributes( { emptyColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ showLabel && labelPosition === 'left' && (
					<span className="wp-block-gambol-star-rating__label">{ getLabel() }</span>
				) }
				
				<div className="wp-block-gambol-star-rating__stars">
					{ renderStars() }
				</div>
				
				{ showLabel && labelPosition === 'right' && (
					<span className="wp-block-gambol-star-rating__label">{ getLabel() }</span>
				) }
			</div>
		</>
	);
}
