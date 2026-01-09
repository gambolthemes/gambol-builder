/**
 * Divider Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
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
	SelectControl,
} from '../../components/inspector';

/**
 * Divider Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		style,
		width,
		weight,
		color,
		alignment,
		addElement,
		elementType,
		icon,
		elementText,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-divider align-${ alignment }`,
	} );

	const dividerStyle = {
		borderTopStyle: style,
		borderTopWidth: `${ weight }px`,
		borderTopColor: color || 'currentColor',
		width: `${ width }%`,
	};

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ alignment }
					onChange={ ( value ) => setAttributes( { alignment: value } ) }
				/>
			</BlockControls>

			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Divider', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M4 11h16v2H4z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Divider Settings', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ style }
									onChange={ ( value ) => setAttributes( { style: value } ) }
									options={ [
										{ value: 'solid', label: __( 'Solid', 'gambol-builder' ) },
										{ value: 'dashed', label: __( 'Dashed', 'gambol-builder' ) },
										{ value: 'dotted', label: __( 'Dotted', 'gambol-builder' ) },
										{ value: 'double', label: __( 'Double', 'gambol-builder' ) },
									] }
								/>
								<RangeSlider
									label={ __( 'Width (%)', 'gambol-builder' ) }
									value={ width }
									onChange={ ( value ) => setAttributes( { width: value } ) }
									min={ 1 }
									max={ 100 }
								/>
								<RangeSlider
									label={ __( 'Weight (px)', 'gambol-builder' ) }
									value={ weight }
									onChange={ ( value ) => setAttributes( { weight: value } ) }
									min={ 1 }
									max={ 20 }
								/>
							</Section>

							<Section title={ __( 'Element', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Add Element', 'gambol-builder' ) }
									checked={ addElement }
									onChange={ ( value ) => setAttributes( { addElement: value } ) }
								/>
								{ addElement && (
									<>
										<ButtonGroup
											label={ __( 'Element Type', 'gambol-builder' ) }
											value={ elementType }
											onChange={ ( value ) => setAttributes( { elementType: value } ) }
											options={ [
												{ value: 'icon', label: __( 'Icon', 'gambol-builder' ) },
												{ value: 'text', label: __( 'Text', 'gambol-builder' ) },
											] }
										/>
										{ elementType === 'text' && (
											<TextInput
												label={ __( 'Text', 'gambol-builder' ) }
												value={ elementText }
												onChange={ ( value ) => setAttributes( { elementText: value } ) }
											/>
										) }
									</>
								) }
							</Section>
						</>
					}
					styleTab={
						<Section title={ __( 'Colors', 'gambol-builder' ) }>
							<GambolColorPicker
								label={ __( 'Color', 'gambol-builder' ) }
								value={ color }
								onChange={ ( value ) => setAttributes( { color: value } ) }
							/>
						</Section>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ addElement ? (
					<div className="wp-block-gambol-divider__wrapper">
						<span className="wp-block-gambol-divider__line wp-block-gambol-divider__line--before" style={ dividerStyle }></span>
						<span className="wp-block-gambol-divider__element">
							{ elementType === 'icon' ? '★' : elementText }
						</span>
						<span className="wp-block-gambol-divider__line wp-block-gambol-divider__line--after" style={ dividerStyle }></span>
					</div>
				) : (
					<hr className="wp-block-gambol-divider__line" style={ dividerStyle } />
				) }
			</div>
		</>
	);
}
