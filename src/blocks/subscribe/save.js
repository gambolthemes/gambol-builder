/**
 * Subscribe Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Subscribe Save Component.
 */
export default function save( { attributes } ) {
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

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-subscribe layout-${ layout }`,
		style: {
			gap: layout === 'stacked' ? `${ gap }px` : undefined,
		},
	} );

	const inputStyle = {
		backgroundColor: inputBgColor || undefined,
		borderColor: inputBorderColor || undefined,
		color: inputTextColor || undefined,
		borderRadius: layout === 'inline' ? `${ borderRadius }px 0 0 ${ borderRadius }px` : `${ borderRadius }px`,
		padding: `${ inputPadding }px`,
	};

	const buttonStyle = {
		backgroundColor: buttonBgColor || undefined,
		color: buttonTextColor || undefined,
		borderRadius: layout === 'inline' ? `0 ${ borderRadius }px ${ borderRadius }px 0` : `${ borderRadius }px`,
		padding: `${ inputPadding }px 24px`,
	};

	return (
		<form { ...blockProps } method="post" action="">
			{ showName && (
				<input 
					type="text"
					name="name"
					className="subscribe-name"
					placeholder="Your name"
					style={ inputStyle }
				/>
			) }
			<input 
				type="email"
				name="email"
				className="subscribe-email"
				placeholder={ placeholder }
				required
				style={ inputStyle }
			/>
			<button type="submit" className="subscribe-button" style={ buttonStyle }>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
					<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
				</svg>
				{ buttonText }
			</button>
		</form>
	);
}
