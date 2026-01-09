/**
 * Add to Cart Block - Edit Component
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
	TextInput,
} from '../../components/inspector';

/**
 * Add to Cart Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showQuantity,
		buttonText,
		buttonWidth,
		buttonAlign,
		buttonColor,
		buttonBgColor,
		borderRadius,
		fontSize,
		paddingX,
		paddingY,
		quantityBorderColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-add-to-cart',
		style: {
			justifyContent: buttonAlign === 'center' ? 'center' : buttonAlign === 'right' ? 'flex-end' : 'flex-start',
		},
	} );

	const buttonStyle = {
		color: buttonColor || '#fff',
		backgroundColor: buttonBgColor || 'var(--gb-colors-primary)',
		borderRadius: `${ borderRadius }px`,
		fontSize: `${ fontSize }px`,
		padding: `${ paddingY }px ${ paddingX }px`,
		width: buttonWidth === 'full' ? '100%' : 'auto',
	};

	const quantityStyle = {
		borderColor: quantityBorderColor || 'var(--gb-colors-gray-300)',
		borderRadius: `${ borderRadius }px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Add to Cart', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Settings', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Quantity', 'gambol-builder' ) }
									checked={ showQuantity }
									onChange={ ( value ) => setAttributes( { showQuantity: value } ) }
								/>
								<TextInput
									label={ __( 'Button Text', 'gambol-builder' ) }
									value={ buttonText }
									onChange={ ( value ) => setAttributes( { buttonText: value } ) }
								/>
								<ButtonGroup
									label={ __( 'Width', 'gambol-builder' ) }
									value={ buttonWidth }
									onChange={ ( value ) => setAttributes( { buttonWidth: value } ) }
									options={ [
										{ value: 'auto', label: 'Auto' },
										{ value: 'full', label: 'Full' },
									] }
								/>
								<ButtonGroup
									label={ __( 'Alignment', 'gambol-builder' ) }
									value={ buttonAlign }
									onChange={ ( value ) => setAttributes( { buttonAlign: value } ) }
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
							<Section title={ __( 'Button', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Font Size', 'gambol-builder' ) }
									value={ fontSize }
									onChange={ ( value ) => setAttributes( { fontSize: value } ) }
									min={ 12 }
									max={ 24 }
								/>
								<RangeSlider
									label={ __( 'Padding X', 'gambol-builder' ) }
									value={ paddingX }
									onChange={ ( value ) => setAttributes( { paddingX: value } ) }
									min={ 8 }
									max={ 60 }
								/>
								<RangeSlider
									label={ __( 'Padding Y', 'gambol-builder' ) }
									value={ paddingY }
									onChange={ ( value ) => setAttributes( { paddingY: value } ) }
									min={ 8 }
									max={ 30 }
								/>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ buttonColor }
									onChange={ ( value ) => setAttributes( { buttonColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ buttonBgColor }
									onChange={ ( value ) => setAttributes( { buttonBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Hover Background', 'gambol-builder' ) }
									value={ buttonHoverBgColor }
									onChange={ ( value ) => setAttributes( { buttonHoverBgColor: value } ) }
								/>
							</Section>

							{ showQuantity && (
								<Section title={ __( 'Quantity', 'gambol-builder' ) }>
									<GambolColorPicker
										label={ __( 'Border Color', 'gambol-builder' ) }
										value={ quantityBorderColor }
										onChange={ ( value ) => setAttributes( { quantityBorderColor: value } ) }
									/>
								</Section>
							) }
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ showQuantity && (
					<div className="wp-block-gambol-add-to-cart__quantity" style={ quantityStyle }>
						<button className="qty-btn minus">−</button>
						<input type="number" value="1" readOnly />
						<button className="qty-btn plus">+</button>
					</div>
				) }
				<button className="wp-block-gambol-add-to-cart__button" style={ buttonStyle }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
						<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
					</svg>
					{ buttonText }
				</button>
			</div>
		</>
	);
}
