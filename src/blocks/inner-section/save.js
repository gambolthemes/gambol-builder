/**
 * Inner Section Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Inner Section Save Component.
 */
export default function save( { attributes } ) {
	const {
		columns,
		columnGap,
		rowGap,
		verticalAlign,
		horizontalAlign,
		reverseColumns,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: 'wp-block-gambol-inner-section',
		style: {
			'--columns': columns,
			'--column-gap': `${ columnGap }px`,
			'--row-gap': `${ rowGap }px`,
			alignItems: verticalAlign,
			justifyContent: horizontalAlign,
			flexDirection: reverseColumns ? 'row-reverse' : 'row',
		},
	} );

	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
}
