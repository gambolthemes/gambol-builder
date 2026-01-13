/**
 * Popup Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Popup Save Component.
 */
export default function save( { attributes } ) {
	const {
		popupId,
		triggerType,
		triggerText,
		triggerDelay,
		popupWidth,
		overlayColor,
		bgColor,
		borderRadius,
		padding,
		showCloseButton,
		closeOnOverlay,
		closeOnEsc,
		animation,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-popup trigger-${ triggerType } animation-${ animation }`,
		'data-popup-id': popupId,
		'data-trigger': triggerType,
		'data-delay': triggerDelay,
		'data-close-overlay': closeOnOverlay,
		'data-close-esc': closeOnEsc,
	} );

	const popupContentStyle = {
		maxWidth: `${ popupWidth }px`,
		backgroundColor: bgColor,
		borderRadius: `${ borderRadius }px`,
		padding: `${ padding }px`,
	};

	return (
		<div { ...blockProps }>
			{ triggerType === 'click' && (
				<button
					className="popup-trigger-button"
					data-popup-target={ popupId }
				>
					{ triggerText }
				</button>
			) }

			<div
				className="popup-overlay"
				style={ { backgroundColor: overlayColor } }
			>
				<div className="popup-content" style={ popupContentStyle }>
					{ showCloseButton && (
						<button className="popup-close" aria-label="Close popup">
							×
						</button>
					) }
					<div { ...useInnerBlocksProps.save( { className: 'popup-inner' } ) } />
				</div>
			</div>
		</div>
	);
}
