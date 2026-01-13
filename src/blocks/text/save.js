/**
 * Text Block - Save Component
 *
 * Generates clean semantic HTML output for the frontend.
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Text Save Component.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Save component.
 */
export default function save( { attributes } ) {
	const {
		content,
		textAlign,
	} = attributes;

	// Build class names - only add what's needed.
	const classNames = [];
	if ( textAlign ) {
		classNames.push( `has-text-align-${ textAlign }` );
	}

	// Block props with minimal output.
	const blockProps = useBlockProps.save( {
		className: classNames.length > 0 ? classNames.join( ' ' ) : undefined,
	} );

	return (
		<RichText.Content
			{ ...blockProps }
			tagName="p"
			value={ content }
		/>
	);
}
