/**
 * Divider Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Divider Save Component.
 */
export default function save( { attributes } ) {
	const {
		style,
		width,
		weight,
		color,
		alignment,
		addElement,
		elementType,
		elementText,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-divider align-${ alignment }`,
	} );

	const dividerStyle = {
		borderTopStyle: style,
		borderTopWidth: `${ weight }px`,
		borderTopColor: color || undefined,
		width: `${ width }%`,
	};

	return (
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
	);
}
