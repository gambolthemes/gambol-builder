/**
 * Grid Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

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

	const style = {
		display: 'grid',
		gridTemplateColumns,
		gap: `${ rowGap }px ${ gap }px`,
		'--grid-columns-tablet': columnsTablet,
		'--grid-columns-mobile': columnsMobile,
	};
	
	if ( alignItems && alignItems !== 'stretch' ) {
		style.alignItems = alignItems;
	}
	
	if ( justifyItems && justifyItems !== 'stretch' ) {
		style.justifyItems = justifyItems;
	}

	const blockProps = useBlockProps.save( {
		className: 'wp-block-gambol-grid',
		style,
	} );

	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
}
