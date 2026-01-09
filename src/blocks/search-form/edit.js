/**
 * Search Form Block - Edit Component
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
 * Search icon SVG.
 */
const SearchIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M13 5c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7l-3.8 3.8 1.1 1.1 3.8-3.8c1 .8 2.3 1.3 3.7 1.3 3.3 0 6-2.7 6-6S16.3 5 13 5zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
	</svg>
);

/**
 * Search Form Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		placeholder,
		buttonText,
		showButton,
		buttonIcon,
		layout,
		inputBackgroundColor,
		inputTextColor,
		inputBorderColor,
		buttonBackgroundColor,
		buttonTextColor,
		borderRadius,
		inputHeight,
		width,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-search-form wp-block-gambol-search-form--${ layout }`,
	} );

	const formStyle = {
		width: width || undefined,
	};

	const inputStyle = {
		backgroundColor: inputBackgroundColor || undefined,
		color: inputTextColor || undefined,
		borderColor: inputBorderColor || undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
		height: inputHeight ? `${ inputHeight }px` : undefined,
	};

	const buttonStyle = {
		backgroundColor: buttonBackgroundColor || 'var(--gb-colors-primary)',
		color: buttonTextColor || undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
		height: inputHeight ? `${ inputHeight }px` : undefined,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Search Form', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M13 5c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7l-3.8 3.8 1.1 1.1 3.8-3.8c1 .8 2.3 1.3 3.7 1.3 3.3 0 6-2.7 6-6S16.3 5 13 5zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Content', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Placeholder', 'gambol-builder' ) }
									value={ placeholder }
									onChange={ ( value ) => setAttributes( { placeholder: value } ) }
								/>
								<TextInput
									label={ __( 'Button Text', 'gambol-builder' ) }
									value={ buttonText }
									onChange={ ( value ) => setAttributes( { buttonText: value } ) }
								/>
							</Section>

							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'inline', label: __( 'Inline', 'gambol-builder' ) },
										{ value: 'stacked', label: __( 'Stacked', 'gambol-builder' ) },
										{ value: 'minimal', label: __( 'Minimal', 'gambol-builder' ) },
									] }
								/>
								<TextInput
									label={ __( 'Width', 'gambol-builder' ) }
									value={ width }
									onChange={ ( value ) => setAttributes( { width: value } ) }
									placeholder="100%, 300px, etc."
								/>
							</Section>

							<Section title={ __( 'Button', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Button', 'gambol-builder' ) }
									checked={ showButton }
									onChange={ ( value ) => setAttributes( { showButton: value } ) }
								/>
								{ showButton && (
									<Toggle
										label={ __( 'Icon Only', 'gambol-builder' ) }
										checked={ buttonIcon }
										onChange={ ( value ) => setAttributes( { buttonIcon: value } ) }
									/>
								) }
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Dimensions', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Input Height', 'gambol-builder' ) }
									value={ inputHeight }
									onChange={ ( value ) => setAttributes( { inputHeight: value } ) }
									min={ 30 }
									max={ 80 }
								/>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 50 }
								/>
							</Section>

							<Section title={ __( 'Input Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background Color', 'gambol-builder' ) }
									value={ inputBackgroundColor }
									onChange={ ( value ) => setAttributes( { inputBackgroundColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ inputTextColor }
									onChange={ ( value ) => setAttributes( { inputTextColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Border Color', 'gambol-builder' ) }
									value={ inputBorderColor }
									onChange={ ( value ) => setAttributes( { inputBorderColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Button Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background Color', 'gambol-builder' ) }
									value={ buttonBackgroundColor }
									onChange={ ( value ) => setAttributes( { buttonBackgroundColor: value } ) }
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
				<form className="wp-block-gambol-search-form__form" style={ formStyle } role="search">
					<input
						type="search"
						className="wp-block-gambol-search-form__input"
						placeholder={ placeholder }
						style={ inputStyle }
						disabled
					/>
					{ showButton && (
						<button
							type="submit"
							className="wp-block-gambol-search-form__button"
							style={ buttonStyle }
							disabled
						>
							{ buttonIcon ? <SearchIcon /> : buttonText }
						</button>
					) }
				</form>
			</div>
		</>
	);
}
