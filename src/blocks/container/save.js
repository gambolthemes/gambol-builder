/**
 * Container Block - Save Component
 *
 * Generates clean div output for the frontend.
 *
 * @package GambolBuilder
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Container Save Component.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Save component.
 */
export default function save( { attributes } ) {
	const {
		maxWidth,
		paddingLeft,
		paddingRight,
		contentAlign,
	} = attributes;

	// Build container styles - only add what's needed.
	const containerStyle = {};
	if ( maxWidth ) {
		containerStyle.maxWidth = maxWidth;
	}
	if ( paddingLeft ) {
		containerStyle.paddingLeft = paddingLeft;
	}
	if ( paddingRight ) {
		containerStyle.paddingRight = paddingRight;
	}

	// Build class names.
	const classNames = [];
	if ( contentAlign && contentAlign !== 'left' ) {
		classNames.push( `has-text-align-${ contentAlign }` );
	}

	// Block props with minimal output.
	const blockProps = useBlockProps.save( {
		className: classNames.length > 0 ? classNames.join( ' ' ) : undefined,
		style: Object.keys( containerStyle ).length > 0 ? containerStyle : undefined,
	} );

	// Inner blocks.
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
}
