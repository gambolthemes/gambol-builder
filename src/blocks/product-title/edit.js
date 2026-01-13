/**
 * Product Title Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

/**
 * Product Title Edit Component.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const {
		tag,
		textAlign,
		titleColor,
		fontSize,
		fontWeight,
		lineHeight,
	} = attributes;

	const { postId, postType } = context;

	const [ title ] = useEntityProp( 'postType', postType, 'title', postId );

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-product-title',
	} );

	const TitleTag = tag;

	const titleStyle = {
		color: titleColor || undefined,
		fontSize: `${ fontSize }px`,
		fontWeight: fontWeight,
		lineHeight: lineHeight,
		textAlign: textAlign,
		margin: 0,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Product Title', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M5 4v3h5.5v12h3V7H19V4H5z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Settings', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'HTML Tag', 'gambol-builder' ) }
									value={ tag }
									onChange={ ( value ) => setAttributes( { tag: value } ) }
									options={ [
										{ value: 'h1', label: 'H1' },
										{ value: 'h2', label: 'H2' },
										{ value: 'h3', label: 'H3' },
										{ value: 'h4', label: 'H4' },
										{ value: 'p', label: 'P' },
									] }
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
									max={ 80 }
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
								<RangeSlider
									label={ __( 'Line Height', 'gambol-builder' ) }
									value={ lineHeight }
									onChange={ ( value ) => setAttributes( { lineHeight: value } ) }
									min={ 1 }
									max={ 2 }
									step={ 0.1 }
								/>
							</Section>

							<Section title={ __( 'Color', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Title Color', 'gambol-builder' ) }
									value={ titleColor }
									onChange={ ( value ) => setAttributes( { titleColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<TitleTag style={ titleStyle }>
					{ title || __( 'Product Title', 'gambol-builder' ) }
				</TitleTag>
			</div>
		</>
	);
}
