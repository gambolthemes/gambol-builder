/**
 * Product Price Block - Edit Component
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
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

/**
 * Product Price Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		textAlign,
		priceColor,
		salePriceColor,
		regularPriceColor,
		fontSize,
		fontWeight,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-product-price',
		style: {
			textAlign: textAlign,
		},
	} );

	const priceStyle = {
		fontSize: `${ fontSize }px`,
		fontWeight: fontWeight,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Product Price', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
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
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Typography', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Font Size', 'gambol-builder' ) }
									value={ fontSize }
									onChange={ ( value ) => setAttributes( { fontSize: value } ) }
									min={ 12 }
									max={ 60 }
								/>
								<ButtonGroup
									label={ __( 'Font Weight', 'gambol-builder' ) }
									value={ fontWeight }
									onChange={ ( value ) => setAttributes( { fontWeight: value } ) }
									options={ [
										{ value: '400', label: 'Normal' },
										{ value: '500', label: 'Medium' },
										{ value: '600', label: 'Semi' },
										{ value: '700', label: 'Bold' },
									] }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Price Color', 'gambol-builder' ) }
									value={ priceColor }
									onChange={ ( value ) => setAttributes( { priceColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Sale Price', 'gambol-builder' ) }
									value={ salePriceColor }
									onChange={ ( value ) => setAttributes( { salePriceColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Regular Price', 'gambol-builder' ) }
									value={ regularPriceColor }
									onChange={ ( value ) => setAttributes( { regularPriceColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-gambol-product-price__wrapper" style={ priceStyle }>
					<del style={ { color: regularPriceColor || 'var(--gb-colors-gray-400)' } }>$59.99</del>
					<ins style={ { color: salePriceColor || priceColor || 'var(--gb-colors-primary)' } }>$49.99</ins>
				</div>
			</div>
		</>
	);
}
