/**
 * Spacer Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Spacer Save Component.
 */
export default function save( { attributes } ) {
	const {
		height,
		heightTablet,
		heightMobile,
		unit,
		showDivider,
		dividerStyle,
		dividerWidth,
		dividerColor,
		dividerAlignment,
		dividerLength,
		htmlId,
		cssClasses,
	} = attributes;

	// Build inline styles with CSS custom properties for responsive
	const spacerStyles = {
		'--gambol-spacer-height': `${ height }${ unit }`,
		'--gambol-spacer-height-tablet': `${ heightTablet }${ unit }`,
		'--gambol-spacer-height-mobile': `${ heightMobile }${ unit }`,
	};

	const dividerStyles = showDivider ? {
		borderTopStyle: dividerStyle,
		borderTopWidth: `${ dividerWidth }px`,
		borderTopColor: dividerColor,
		width: `${ dividerLength }%`,
	} : {};

	// Build class names
	const className = [
		'gambol-spacer',
		showDivider ? 'gambol-spacer--has-divider' : '',
		showDivider ? `gambol-spacer--align-${ dividerAlignment }` : '',
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps.save( {
		className,
		style: spacerStyles,
		id: htmlId || undefined,
		'aria-hidden': 'true',
	} );

	return (
		<div { ...blockProps }>
			{ showDivider && (
				<hr
					className="gambol-spacer__divider"
					style={ dividerStyles }
				/>
			) }
		</div>
	);
}
