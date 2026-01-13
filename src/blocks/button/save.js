/**
 * Button Block - Save Component
 *
 * Generates accessible HTML output for the frontend.
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Button Save Component.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Save component.
 */
export default function save( { attributes } ) {
	const {
		text,
		url,
		linkTarget,
		rel,
		textAlign,
		hoverBackgroundColor,
		hoverTextColor,
	} = attributes;

	// Build wrapper class names.
	const wrapperClassNames = [ 'wp-block-gambol-button__wrapper' ];
	if ( textAlign ) {
		wrapperClassNames.push( `has-text-align-${ textAlign }` );
	}

	// Block props.
	const blockProps = useBlockProps.save( {
		className: wrapperClassNames.join( ' ' ),
	} );

	// Build button class names.
	const buttonClassNames = [ 'wp-block-gambol-button__link' ];

	// Build inline styles for hover (CSS custom properties).
	const buttonStyle = {};
	if ( hoverBackgroundColor ) {
		buttonStyle[ '--gb-button-hover-bg' ] = hoverBackgroundColor;
	}
	if ( hoverTextColor ) {
		buttonStyle[ '--gb-button-hover-color' ] = hoverTextColor;
	}

	// Render as link if URL exists, otherwise as button.
	const ButtonTag = url ? 'a' : 'button';

	// Link-specific props.
	const linkProps = url
		? {
				href: url,
				target: linkTarget || undefined,
				rel: rel || undefined,
		  }
		: {
				type: 'button',
		  };

	return (
		<div { ...blockProps }>
			<RichText.Content
				tagName={ ButtonTag }
				className={ buttonClassNames.join( ' ' ) }
				style={ Object.keys( buttonStyle ).length > 0 ? buttonStyle : undefined }
				value={ text }
				{ ...linkProps }
			/>
		</div>
	);
}
