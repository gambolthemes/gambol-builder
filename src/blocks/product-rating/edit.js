/**
 * Product Rating Block - Edit Component
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
 * Product Rating Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		textAlign,
		showCount,
		starSize,
		starColor,
		starEmptyColor,
		countColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-product-rating',
		style: {
			justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
		},
	} );

	const rating = 4.5;
	const reviewCount = 24;

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Product Rating', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Settings', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Alignment', 'gambol-builder' ) }
									value={ textAlign }
									onChange={ ( value ) => setAttributes( { textAlign: value } ) }
									options={ [
										{ value: 'left', label: 'Left' },
										{ value: 'center', label: 'Center' },
										{ value: 'right', label: 'Right' },
									] }
								/>
								<Toggle
									label={ __( 'Show Review Count', 'gambol-builder' ) }
									checked={ showCount }
									onChange={ ( value ) => setAttributes( { showCount: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Stars', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Size', 'gambol-builder' ) }
									value={ starSize }
									onChange={ ( value ) => setAttributes( { starSize: value } ) }
									min={ 12 }
									max={ 40 }
								/>
								<GambolColorPicker
									label={ __( 'Star Color', 'gambol-builder' ) }
									value={ starColor }
									onChange={ ( value ) => setAttributes( { starColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Empty Star', 'gambol-builder' ) }
									value={ starEmptyColor }
									onChange={ ( value ) => setAttributes( { starEmptyColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Count', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ countColor }
									onChange={ ( value ) => setAttributes( { countColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-gambol-product-rating__stars">
					{ Array.from( { length: 5 } ).map( ( _, i ) => {
						const filled = i < Math.floor( rating );
						const halfFilled = ! filled && i < rating;
						
						return (
							<svg
								key={ i }
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								width={ starSize }
								height={ starSize }
								fill={ filled ? starColor : ( halfFilled ? starColor : starEmptyColor ) }
							>
								<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
							</svg>
						);
					} ) }
				</div>
				{ showCount && (
					<span className="wp-block-gambol-product-rating__count" style={ { color: countColor } }>
						({ reviewCount } { __( 'reviews', 'gambol-builder' ) })
					</span>
				) }
			</div>
		</>
	);
}
