/**
 * Column Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Column Save Component.
 */
export default function save( { attributes } ) {
	const {
		width,
		verticalAlign,
		horizontalAlign,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: 'wp-block-gambol-column',
		style: {
			flex: width ? `0 0 ${ width }` : undefined,
			maxWidth: width || undefined,
			alignItems: horizontalAlign,
			justifyContent: verticalAlign,
		},
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
