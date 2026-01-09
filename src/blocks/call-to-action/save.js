/**
 * Call to Action Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Call to Action Save Component.
 */
export default function save( { attributes } ) {
	const {
		title,
		description,
		buttonText,
		buttonUrl,
		buttonTarget,
		layout,
		contentAlignment,
		bgColor,
		bgImage,
		overlayColor,
		overlayOpacity,
		titleColor,
		descriptionColor,
		buttonBgColor,
		buttonTextColor,
		padding,
		borderRadius,
		titleSize,
		descriptionSize,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-call-to-action layout-${ layout } align-${ contentAlignment }`,
		style: {
			backgroundColor: bgColor || undefined,
			backgroundImage: bgImage ? `url(${ bgImage })` : undefined,
			borderRadius: `${ borderRadius }px`,
			padding: `${ padding }px`,
		},
	} );

	const titleStyle = {
		color: titleColor || undefined,
		fontSize: `${ titleSize }px`,
	};

	const descriptionStyle = {
		color: descriptionColor || undefined,
		fontSize: `${ descriptionSize }px`,
	};

	const buttonStyle = {
		backgroundColor: buttonBgColor || undefined,
		color: buttonTextColor || undefined,
	};

	const overlayStyle = overlayColor ? {
		backgroundColor: overlayColor,
		opacity: overlayOpacity / 100,
	} : {};

	return (
		<div { ...blockProps }>
			{ bgImage && overlayColor && (
				<div className="cta-overlay" style={ overlayStyle }></div>
			) }
			
			<div className="cta-content">
				<div className="cta-text">
					<RichText.Content
						tagName="h3"
						className="cta-title"
						style={ titleStyle }
						value={ title }
					/>
					<RichText.Content
						tagName="p"
						className="cta-description"
						style={ descriptionStyle }
						value={ description }
					/>
				</div>
				
				<div className="cta-button-wrapper">
					<a
						href={ buttonUrl }
						className="cta-button"
						style={ buttonStyle }
						target={ buttonTarget ? '_blank' : undefined }
						rel={ buttonTarget ? 'noopener noreferrer' : undefined }
					>
						{ buttonText }
					</a>
				</div>
			</div>
		</div>
	);
}
