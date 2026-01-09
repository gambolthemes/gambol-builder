/**
 * Subscribe Block - Edit Component
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
 * Subscribe Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		layout,
		showName,
		placeholder,
		buttonText,
		gap,
		inputBgColor,
		inputBorderColor,
		inputTextColor,
		buttonBgColor,
		buttonTextColor,
		borderRadius,
		inputPadding,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-subscribe layout-${ layout }`,
		style: {
			gap: layout === 'stacked' ? `${ gap }px` : undefined,
		},
	} );

	const inputStyle = {
		backgroundColor: inputBgColor || '#fff',
		borderColor: inputBorderColor || 'var(--gb-colors-gray-300)',
		color: inputTextColor || 'inherit',
		borderRadius: layout === 'inline' ? `${ borderRadius }px 0 0 ${ borderRadius }px` : `${ borderRadius }px`,
		padding: `${ inputPadding }px`,
	};

	const buttonStyle = {
		backgroundColor: buttonBgColor || 'var(--gb-colors-primary)',
		color: buttonTextColor || '#fff',
		borderRadius: layout === 'inline' ? `0 ${ borderRadius }px ${ borderRadius }px 0` : `${ borderRadius }px`,
		padding: `${ inputPadding }px 24px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Subscribe', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'inline', label: 'Inline' },
										{ value: 'stacked', label: 'Stacked' },
									] }
								/>
								{ layout === 'stacked' && (
									<RangeSlider
										label={ __( 'Gap', 'gambol-builder' ) }
										value={ gap }
										onChange={ ( value ) => setAttributes( { gap: value } ) }
										min={ 0 }
										max={ 20 }
									/>
								) }
							</Section>

							<Section title={ __( 'Fields', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Name Field', 'gambol-builder' ) }
									checked={ showName }
									onChange={ ( value ) => setAttributes( { showName: value } ) }
								/>
								<TextInput
									label={ __( 'Email Placeholder', 'gambol-builder' ) }
									value={ placeholder }
									onChange={ ( value ) => setAttributes( { placeholder: value } ) }
								/>
							</Section>

							<Section title={ __( 'Button', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Button Text', 'gambol-builder' ) }
									value={ buttonText }
									onChange={ ( value ) => setAttributes( { buttonText: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Input', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Padding', 'gambol-builder' ) }
									value={ inputPadding }
									onChange={ ( value ) => setAttributes( { inputPadding: value } ) }
									min={ 8 }
									max={ 24 }
								/>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ inputBgColor }
									onChange={ ( value ) => setAttributes( { inputBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Border Color', 'gambol-builder' ) }
									value={ inputBorderColor }
									onChange={ ( value ) => setAttributes( { inputBorderColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ inputTextColor }
									onChange={ ( value ) => setAttributes( { inputTextColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Button', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ buttonBgColor }
									onChange={ ( value ) => setAttributes( { buttonBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ buttonTextColor }
									onChange={ ( value ) => setAttributes( { buttonTextColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ showName && (
					<input 
						type="text" 
						className="subscribe-name"
						placeholder="Your name"
						style={ inputStyle }
					/>
				) }
				<input 
					type="email" 
					className="subscribe-email"
					placeholder={ placeholder }
					style={ inputStyle }
				/>
				<button type="submit" className="subscribe-button" style={ buttonStyle }>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
						<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
					</svg>
					{ buttonText }
				</button>
			</div>
		</>
	);
}
