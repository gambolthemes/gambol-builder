/**
 * Login Block - Edit Component
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
	Toggle,
	GambolColorPicker,
	RangeSlider,
	TextInput,
} from '../../components/inspector';

/**
 * Login Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showLabels,
		showRemember,
		showForgotPassword,
		showRegisterLink,
		buttonText,
		labelColor,
		inputBgColor,
		inputBorderColor,
		buttonBgColor,
		buttonTextColor,
		linkColor,
		borderRadius,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-login',
	} );

	const inputStyle = {
		backgroundColor: inputBgColor || '#fff',
		borderColor: inputBorderColor || 'var(--gb-colors-gray-300)',
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

	const linkStyle = {
		color: linkColor || 'var(--gb-colors-primary)',
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Login', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Display', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Labels', 'gambol-builder' ) }
									checked={ showLabels }
									onChange={ ( value ) => setAttributes( { showLabels: value } ) }
								/>
								<Toggle
									label={ __( 'Remember Me', 'gambol-builder' ) }
									checked={ showRemember }
									onChange={ ( value ) => setAttributes( { showRemember: value } ) }
								/>
								<Toggle
									label={ __( 'Forgot Password Link', 'gambol-builder' ) }
									checked={ showForgotPassword }
									onChange={ ( value ) => setAttributes( { showForgotPassword: value } ) }
								/>
								<Toggle
									label={ __( 'Register Link', 'gambol-builder' ) }
									checked={ showRegisterLink }
									onChange={ ( value ) => setAttributes( { showRegisterLink: value } ) }
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

							<Section title={ __( 'Links', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Color', 'gambol-builder' ) }
									value={ linkColor }
									onChange={ ( value ) => setAttributes( { linkColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<form className="login-form">
					<div className="login-field">
						{ showLabels && <label style={ labelStyle }>Username or Email</label> }
						<input 
							type="text" 
							placeholder={ ! showLabels ? 'Username or Email' : '' }
							style={ inputStyle } 
						/>
					</div>
					
					<div className="login-field">
						{ showLabels && <label style={ labelStyle }>Password</label> }
						<input 
							type="password" 
							placeholder={ ! showLabels ? 'Password' : '' }
							style={ inputStyle } 
						/>
					</div>
					
					<div className="login-options">
						{ showRemember && (
							<label className="remember-me">
								<input type="checkbox" />
								<span>Remember me</span>
							</label>
						) }
						
						{ showForgotPassword && (
							<a href="#" className="forgot-password" style={ linkStyle }>Forgot password?</a>
						) }
					</div>
					
					<button type="submit" className="login-button" style={ buttonStyle }>
						{ buttonText }
					</button>
					
					{ showRegisterLink && (
						<p className="register-link">
							Don't have an account? <a href="#" style={ linkStyle }>Register</a>
						</p>
					) }
				</form>
			</div>
		</>
	);
}
