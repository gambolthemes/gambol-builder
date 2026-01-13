/**
 * Product Short Description Block - Edit Component
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
 * Product Short Description Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		textAlign,
		fontSize,
		lineHeight,
		textColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-product-short-description',
		style: {
			textAlign,
			fontSize: `${ fontSize }px`,
			lineHeight,
			color: textColor || 'inherit',
		},
	} );

	// Sample description for editor preview
	const sampleDescription = 'This is a sample product short description. It provides a quick overview of the product features and benefits to help customers make informed purchasing decisions.';

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Product Short Description', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-9-8h6v2h-6v-2zm0 4h4v2h-4v-2zm-4-4h2v6H8v-6z"/>
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
									max={ 24 }
								/>
								<RangeSlider
									label={ __( 'Line Height', 'gambol-builder' ) }
									value={ lineHeight }
									onChange={ ( value ) => setAttributes( { lineHeight: value } ) }
									min={ 1 }
									max={ 2.5 }
									step={ 0.1 }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ textColor }
									onChange={ ( value ) => setAttributes( { textColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<p>{ sampleDescription }</p>
			</div>
		</>
	);
}
