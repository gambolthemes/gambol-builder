/**
 * Column Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Column Save Component.
 */
export default function save( { attributes } ) {
	const {
		width,
		verticalAlign,
		horizontalAlign,
	} = attributes;

	const style = {};
	
	if ( width ) {
		style.flex = `0 0 ${ width }`;
		style.maxWidth = width;
	}
	
	if ( horizontalAlign && horizontalAlign !== 'flex-start' ) {
		style.alignItems = horizontalAlign;
	}
	
	if ( verticalAlign && verticalAlign !== 'flex-start' ) {
		style.justifyContent = verticalAlign;
	}

	const blockProps = useBlockProps.save( {
		className: 'wp-block-gambol-column',
		style: Object.keys( style ).length > 0 ? style : undefined,
	} );

	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
}
