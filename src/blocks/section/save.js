/**
 * Section Block - Save Component
 *
 * Generates clean, semantic HTML output for the frontend.
 *
 * @package GambolBuilder
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Section Save Component.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Save component.
 */
export default function save( { attributes } ) {
	const {
		contentWidth,
		maxWidth,
		minHeight,
		verticalAlign,
		tagName,
	} = attributes;

	// Build wrapper styles - only add what's needed.
	const wrapperStyle = {};
	if ( minHeight ) {
		wrapperStyle.minHeight = minHeight;
	}

	// Build inner content styles.
	const innerStyle = {};
	if ( contentWidth === 'boxed' && maxWidth ) {
		innerStyle.maxWidth = maxWidth;
	}

	// Build class names - minimal and semantic.
	const classNames = [];
	if ( contentWidth ) {
		classNames.push( `is-content-${ contentWidth }` );
	}
	if ( verticalAlign && verticalAlign !== 'top' ) {
		classNames.push( `is-vertically-aligned-${ verticalAlign }` );
	}

	// Block props with minimal output.
	const blockProps = useBlockProps.save( {
		className: classNames.length > 0 ? classNames.join( ' ' ) : undefined,
		style: Object.keys( wrapperStyle ).length > 0 ? wrapperStyle : undefined,
	} );

	// Inner blocks with minimal wrapper.
	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'wp-block-gambol-section__inner',
		style: Object.keys( innerStyle ).length > 0 ? innerStyle : undefined,
	} );

	// Dynamic tag - defaults to section for semantic HTML.
	const TagName = tagName || 'section';

	return (
		<TagName { ...blockProps }>
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
