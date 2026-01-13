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
		contentWidth,
		maxWidth,
		maxWidthUnit,
		contentAlign,
		flexDirection,
		gap,
		backgroundColor,
		borderRadius,
		borderColor,
		borderWidth,
		padding,
	} = attributes;

	// Build container styles - only add what's needed.
	const containerStyle = {};
	
	if ( contentWidth === 'custom' && maxWidth ) {
		containerStyle.maxWidth = `${ maxWidth }${ maxWidthUnit || 'px' }`;
		containerStyle.marginLeft = 'auto';
		containerStyle.marginRight = 'auto';
		containerStyle.width = '100%';
	}
	
	// Flex layout
	containerStyle.display = 'flex';
	containerStyle.flexDirection = flexDirection || 'column';
	
	if ( gap ) {
		containerStyle.gap = `${ gap }px`;
	}
	
	if ( backgroundColor ) {
		containerStyle.backgroundColor = backgroundColor;
	}
	
	if ( borderRadius ) {
		containerStyle.borderRadius = `${ borderRadius }px`;
	}
	
	if ( borderWidth && borderColor ) {
		containerStyle.border = `${ borderWidth }px solid ${ borderColor }`;
	}
	
	if ( padding ) {
		containerStyle.paddingTop = `${ padding.top || 0 }px`;
		containerStyle.paddingRight = `${ padding.right || 16 }px`;
		containerStyle.paddingBottom = `${ padding.bottom || 0 }px`;
		containerStyle.paddingLeft = `${ padding.left || 16 }px`;
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
