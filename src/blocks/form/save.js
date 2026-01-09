/**
 * Form Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Form Save Component.
 */
export default function save( { attributes } ) {
	const {
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

	const blockProps = useBlockProps.save( {
		className: 'wp-block-gambol-form',
		style: {
			gap: `${ gap }px`,
		},
	} );

	const inputStyle = {
		backgroundColor: inputBgColor || undefined,
		borderColor: inputBorderColor || undefined,
		color: inputTextColor || undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
	};

	const labelStyle = {
		color: labelColor || undefined,
	};

	const buttonStyle = {
		backgroundColor: buttonBgColor || undefined,
		color: buttonTextColor || undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
	};

	return (
		<form { ...blockProps } method="post" action="">
			{ showName && (
				<div className="form-field">
					<label style={ labelStyle }>Name</label>
					<input type="text" name="name" placeholder="Your name" required style={ inputStyle } />
				</div>
			) }
			
			{ showEmail && (
				<div className="form-field">
					<label style={ labelStyle }>Email</label>
					<input type="email" name="email" placeholder="your@email.com" required style={ inputStyle } />
				</div>
			) }
			
			{ showPhone && (
				<div className="form-field">
					<label style={ labelStyle }>Phone</label>
					<input type="tel" name="phone" placeholder="Your phone number" style={ inputStyle } />
				</div>
			) }
			
			{ showSubject && (
				<div className="form-field">
					<label style={ labelStyle }>Subject</label>
					<input type="text" name="subject" placeholder="Subject" required style={ inputStyle } />
				</div>
			) }
			
			{ showMessage && (
				<div className="form-field">
					<label style={ labelStyle }>Message</label>
					<textarea name="message" placeholder="Your message..." rows="5" required style={ inputStyle }></textarea>
				</div>
			) }
			
			<div className="form-field form-submit">
				<button type="submit" style={ buttonStyle }>
					{ submitText }
				</button>
			</div>
		</form>
	);
}
