/**
 * Product Stock Block - Edit Component
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
 * Product Stock Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showIcon,
		showQuantity,
		textAlign,
		fontSize,
		inStockColor,
		lowStockColor,
		outOfStockColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-product-stock',
		style: {
			textAlign,
			fontSize: `${ fontSize }px`,
		},
	} );

	// Sample: show in stock status
	const stockStatus = 'instock';
	const stockQuantity = 24;

	const getStatusColor = () => {
		switch ( stockStatus ) {
			case 'instock':
				return inStockColor;
			case 'lowstock':
				return lowStockColor;
			case 'outofstock':
				return outOfStockColor;
			default:
				return inStockColor;
		}
	};

	const getStatusText = () => {
		switch ( stockStatus ) {
			case 'instock':
				return showQuantity ? `${ stockQuantity } in stock` : 'In Stock';
			case 'lowstock':
				return showQuantity ? `Only ${ stockQuantity } left` : 'Low Stock';
			case 'outofstock':
				return 'Out of Stock';
			default:
				return 'In Stock';
		}
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Product Stock', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4l16-.01V7z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Display', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Icon', 'gambol-builder' ) }
									checked={ showIcon }
									onChange={ ( value ) => setAttributes( { showIcon: value } ) }
								/>
								<Toggle
									label={ __( 'Show Quantity', 'gambol-builder' ) }
									checked={ showQuantity }
									onChange={ ( value ) => setAttributes( { showQuantity: value } ) }
								/>
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
									max={ 24 }
								/>
							</Section>

							<Section title={ __( 'Status Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'In Stock', 'gambol-builder' ) }
									value={ inStockColor }
									onChange={ ( value ) => setAttributes( { inStockColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Low Stock', 'gambol-builder' ) }
									value={ lowStockColor }
									onChange={ ( value ) => setAttributes( { lowStockColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Out of Stock', 'gambol-builder' ) }
									value={ outOfStockColor }
									onChange={ ( value ) => setAttributes( { outOfStockColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<span className="product-stock__status" style={ { color: getStatusColor() } }>
					{ showIcon && (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
						</svg>
					) }
					{ getStatusText() }
				</span>
			</div>
		</>
	);
}
