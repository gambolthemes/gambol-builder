/**
 * Form Block - Edit Component
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
 * Form Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		formType,
		showName,
		showEmail,
		showPhone,
		showSubject,
		showMessage,
		submitText,
		labelColor,
		inputBgColor,
		inputBorderColor,
		inputTextColor,
		buttonBgColor,
		buttonTextColor,
		borderRadius,
		gap,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-form',
		style: {
			gap: `${ gap }px`,
		},
	} );

	const inputStyle = {
		backgroundColor: inputBgColor || '#fff',
		borderColor: inputBorderColor || 'var(--gb-colors-gray-300)',
		color: inputTextColor || 'inherit',
		borderRadius: `${ borderRadius }px`,
	};

	const labelStyle = {
		color: labelColor || 'inherit',
	};

	const buttonStyle = {
		backgroundColor: buttonBgColor || 'var(--gb-colors-primary)',
		color: buttonTextColor || '#fff',
		borderRadius: `${ borderRadius }px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Form', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Form Type', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Type', 'gambol-builder' ) }
									value={ formType }
									onChange={ ( value ) => setAttributes( { formType: value } ) }
									options={ [
										{ value: 'contact', label: 'Contact' },
										{ value: 'newsletter', label: 'Newsletter' },
										{ value: 'custom', label: 'Custom' },
									] }
								/>
							</Section>

							<Section title={ __( 'Fields', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Name', 'gambol-builder' ) }
									checked={ showName }
									onChange={ ( value ) => setAttributes( { showName: value } ) }
								/>
								<Toggle
									label={ __( 'Email', 'gambol-builder' ) }
									checked={ showEmail }
									onChange={ ( value ) => setAttributes( { showEmail: value } ) }
								/>
								<Toggle
									label={ __( 'Phone', 'gambol-builder' ) }
									checked={ showPhone }
									onChange={ ( value ) => setAttributes( { showPhone: value } ) }
								/>
								<Toggle
									label={ __( 'Subject', 'gambol-builder' ) }
									checked={ showSubject }
									onChange={ ( value ) => setAttributes( { showSubject: value } ) }
								/>
								<Toggle
									label={ __( 'Message', 'gambol-builder' ) }
									checked={ showMessage }
									onChange={ ( value ) => setAttributes( { showMessage: value } ) }
								/>
							</Section>

							<Section title={ __( 'Button', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Button Text', 'gambol-builder' ) }
									value={ submitText }
									onChange={ ( value ) => setAttributes( { submitText: value } ) }
								/>
							</Section>

							<Section title={ __( 'Spacing', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Gap', 'gambol-builder' ) }
									value={ gap }
									onChange={ ( value ) => setAttributes( { gap: value } ) }
									min={ 0 }
									max={ 40 }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Labels', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Color', 'gambol-builder' ) }
									value={ labelColor }
									onChange={ ( value ) => setAttributes( { labelColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Inputs', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 20 }
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

			<form { ...blockProps }>
				{ showName && (
					<div className="form-field">
						<label style={ labelStyle }>Name</label>
						<input type="text" placeholder="Your name" style={ inputStyle } />
					</div>
				) }
				
				{ showEmail && (
					<div className="form-field">
						<label style={ labelStyle }>Email</label>
						<input type="email" placeholder="your@email.com" style={ inputStyle } />
					</div>
				) }
				
				{ showPhone && (
					<div className="form-field">
						<label style={ labelStyle }>Phone</label>
						<input type="tel" placeholder="Your phone number" style={ inputStyle } />
					</div>
				) }
				
				{ showSubject && (
					<div className="form-field">
						<label style={ labelStyle }>Subject</label>
						<input type="text" placeholder="Subject" style={ inputStyle } />
					</div>
				) }
				
				{ showMessage && (
					<div className="form-field">
						<label style={ labelStyle }>Message</label>
						<textarea placeholder="Your message..." rows="5" style={ inputStyle }></textarea>
					</div>
				) }
				
				<div className="form-field form-submit">
					<button type="submit" style={ buttonStyle }>
						{ submitText }
					</button>
				</div>
			</form>
		</>
	);
}
