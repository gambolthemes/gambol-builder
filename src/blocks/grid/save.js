/**
 * Grid Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Grid Save Component.
 */
export default function save( { attributes } ) {
	const {
		columns,
		columnsTablet,
		columnsMobile,
		gap,
		rowGap,
		minColumnWidth,
		autoFit,
		alignItems,
		justifyItems,
	} = attributes;

	const gridTemplateColumns = autoFit && minColumnWidth
		? `repeat(auto-fit, minmax(${ minColumnWidth }, 1fr))`
		: `repeat(${ columns }, 1fr)`;

	const blockProps = useBlockProps.save( {
		className: 'wp-block-gambol-grid',
		style: {
			display: 'grid',
			gridTemplateColumns,
			gap: `${ rowGap }px ${ gap }px`,
			alignItems,
			justifyItems,
			'--grid-columns-tablet': columnsTablet,
			'--grid-columns-mobile': columnsMobile,
		},
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
