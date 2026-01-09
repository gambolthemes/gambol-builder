/**
 * Alert Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

const ALERT_ICONS = {
	info: 'ℹ',
	success: '✓',
	warning: '⚠',
	danger: '✕',
};

/**
 * Alert Save Component.
 */
export default function save( { attributes } ) {
	const {
		type,
		title,
		content,
		showIcon,
		dismissible,
		customIconColor,
		customBackgroundColor,
		customBorderColor,
		customTextColor,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-alert alert-${ type }${ dismissible ? ' is-dismissible' : '' }`,
		style: {
			'--alert-bg': customBackgroundColor || undefined,
			'--alert-border': customBorderColor || undefined,
			'--alert-text': customTextColor || undefined,
			'--alert-icon': customIconColor || undefined,
		},
	} );

	return (
		<div { ...blockProps } role="alert">
			{ showIcon && (
				<span className="wp-block-gambol-alert__icon" aria-hidden="true">
					{ ALERT_ICONS[ type ] }
				</span>
			) }
			
			<div className="wp-block-gambol-alert__content">
				{ title && (
					<RichText.Content
						tagName="strong"
						className="wp-block-gambol-alert__title"
						value={ title }
					/>
				) }
				{ content && (
					<RichText.Content
						tagName="p"
						className="wp-block-gambol-alert__message"
						value={ content }
					/>
				) }
			</div>

			{ dismissible && (
				<button type="button" className="wp-block-gambol-alert__dismiss" aria-label="Dismiss">
					✕
				</button>
			) }
		</div>
	);
}
