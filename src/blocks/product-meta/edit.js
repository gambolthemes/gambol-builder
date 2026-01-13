/**
 * Product Meta Block - Edit Component
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
 * Product Meta Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showSku,
		showCategories,
		showTags,
		layout,
		gap,
		labelColor,
		valueColor,
		linkColor,
		fontSize,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-product-meta layout-${ layout }`,
		style: {
			gap: `${ gap }px`,
			fontSize: `${ fontSize }px`,
		},
	} );

	const labelStyle = {
		color: labelColor || 'inherit',
	};

	const valueStyle = {
		color: valueColor || 'inherit',
	};

	const linkStyle = {
		color: linkColor || 'var(--gb-colors-primary)',
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Product Meta', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16zM16 17H5V7h11l3.55 5L16 17z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Display', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show SKU', 'gambol-builder' ) }
									checked={ showSku }
									onChange={ ( value ) => setAttributes( { showSku: value } ) }
								/>
								<Toggle
									label={ __( 'Show Categories', 'gambol-builder' ) }
									checked={ showCategories }
									onChange={ ( value ) => setAttributes( { showCategories: value } ) }
								/>
								<Toggle
									label={ __( 'Show Tags', 'gambol-builder' ) }
									checked={ showTags }
									onChange={ ( value ) => setAttributes( { showTags: value } ) }
								/>
							</Section>

							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'stacked', label: 'Stacked' },
										{ value: 'inline', label: 'Inline' },
									] }
								/>
								<RangeSlider
									label={ __( 'Gap', 'gambol-builder' ) }
									value={ gap }
									onChange={ ( value ) => setAttributes( { gap: value } ) }
									min={ 0 }
									max={ 30 }
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
									max={ 20 }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Label Color', 'gambol-builder' ) }
									value={ labelColor }
									onChange={ ( value ) => setAttributes( { labelColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Value Color', 'gambol-builder' ) }
									value={ valueColor }
									onChange={ ( value ) => setAttributes( { valueColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Link Color', 'gambol-builder' ) }
									value={ linkColor }
									onChange={ ( value ) => setAttributes( { linkColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ showSku && (
					<div className="product-meta__item">
						<span className="product-meta__label" style={ labelStyle }>SKU:</span>
						<span className="product-meta__value" style={ valueStyle }>ABC-12345</span>
					</div>
				) }
				
				{ showCategories && (
					<div className="product-meta__item">
						<span className="product-meta__label" style={ labelStyle }>Category:</span>
						<span className="product-meta__value">
							<a href="#" style={ linkStyle }>Electronics</a>, <a href="#" style={ linkStyle }>Accessories</a>
						</span>
					</div>
				) }
				
				{ showTags && (
					<div className="product-meta__item">
						<span className="product-meta__label" style={ labelStyle }>Tags:</span>
						<span className="product-meta__value">
							<a href="#" style={ linkStyle }>New</a>, <a href="#" style={ linkStyle }>Featured</a>, <a href="#" style={ linkStyle }>Popular</a>
						</span>
					</div>
				) }
			</div>
		</>
	);
}
