/**
 * Heading Block - Save Component
 *
 * Generates clean semantic HTML output for the frontend.
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Heading Save Component.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Save component.
 */
export default function save( { attributes } ) {
	const {
		content,
		level,
		textAlign,
		fontWeight,
	} = attributes;

	// Tag name from level.
	const TagName = `h${ level }`;

	// Build class names - only add what's needed.
	const classNames = [];
	if ( textAlign ) {
		classNames.push( `has-text-align-${ textAlign }` );
	}
	if ( fontWeight ) {
		classNames.push( `has-font-weight-${ fontWeight }` );
	}

	// Block props with minimal output.
	const blockProps = useBlockProps.save( {
		className: classNames.length > 0 ? classNames.join( ' ' ) : undefined,
	} );

	return (
		<RichText.Content
			{ ...blockProps }
			tagName={ TagName }
			value={ content }
		/>
	);
}
