/**
 * Accordion Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Get icon SVG based on type.
 */
const getIconSvg = ( iconType ) => {
	switch ( iconType ) {
		case 'plus-minus':
			return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="gambol-accordion-icon-plus"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="gambol-accordion-icon-minus"><path d="M19 13H5v-2h14v2z"/></svg>';
		case 'arrow':
			return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>';
		default:
			return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>';
	}
};

/**
 * Accordion Save Component.
 */
export default function save( { attributes } ) {
	const {
		items,
		allowMultiple,
		defaultOpen,
		headerBackgroundColor,
		headerActiveBackgroundColor,
		headerTextColor,
		headerPadding,
		headerFontSize,
		headerFontWeight,
		iconType,
		iconPosition,
		iconColor,
		contentBackgroundColor,
		contentPadding,
		borderColor,
		borderWidth,
		borderRadius,
		itemGap,
		animationDuration,
		htmlId,
		cssClasses,
	} = attributes;

	// Build CSS custom properties
	const cssVars = {
		'--gambol-accordion-header-bg': headerBackgroundColor,
		'--gambol-accordion-header-active-bg': headerActiveBackgroundColor,
		'--gambol-accordion-header-color': headerTextColor,
		'--gambol-accordion-header-padding': `${ headerPadding.top }px ${ headerPadding.right }px ${ headerPadding.bottom }px ${ headerPadding.left }px`,
		'--gambol-accordion-header-font-size': `${ headerFontSize }px`,
		'--gambol-accordion-header-font-weight': headerFontWeight,
		'--gambol-accordion-icon-color': iconColor,
		'--gambol-accordion-content-bg': contentBackgroundColor,
		'--gambol-accordion-content-padding': `${ contentPadding.top }px ${ contentPadding.right }px ${ contentPadding.bottom }px ${ contentPadding.left }px`,
		'--gambol-accordion-border': `${ borderWidth }px solid ${ borderColor }`,
		'--gambol-accordion-radius': borderRadius,
		'--gambol-accordion-gap': `${ itemGap }px`,
		'--gambol-accordion-duration': `${ animationDuration }ms`,
	};

	// Build class names
	const className = [
		'gambol-accordion',
		`gambol-accordion--icon-${ iconPosition }`,
		`gambol-accordion--icon-${ iconType }`,
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps.save( {
		className,
		style: cssVars,
		id: htmlId || undefined,
		'data-allow-multiple': allowMultiple ? 'true' : 'false',
		'data-default-open': defaultOpen,
	} );

	// Determine which items are open by default
	const getIsOpen = ( index ) => {
		if ( defaultOpen === 'none' ) return false;
		if ( defaultOpen === 'all' && allowMultiple ) return true;
		if ( defaultOpen === 'first' && index === 0 ) return true;
		return false;
	};

	return (
		<div { ...blockProps }>
			{ items.map( ( item, index ) => {
				const isOpen = getIsOpen( index );

				return (
					<div
						key={ item.id }
						className={ `gambol-accordion-item ${ isOpen ? 'is-open' : '' }` }
						data-item-id={ item.id }
					>
						<button
							type="button"
							className="gambol-accordion-item__header"
							aria-expanded={ isOpen ? 'true' : 'false' }
							aria-controls={ `content-${ item.id }` }
							id={ `header-${ item.id }` }
						>
							{ iconPosition === 'left' && (
								<span
									className="gambol-accordion-item__icon"
									dangerouslySetInnerHTML={ { __html: getIconSvg( iconType ) } }
								/>
							) }
							<span className="gambol-accordion-item__title">
								{ item.title }
							</span>
							{ iconPosition === 'right' && (
								<span
									className="gambol-accordion-item__icon"
									dangerouslySetInnerHTML={ { __html: getIconSvg( iconType ) } }
								/>
							) }
						</button>
						<div
							className="gambol-accordion-item__body"
							id={ `content-${ item.id }` }
							role="region"
							aria-labelledby={ `header-${ item.id }` }
							hidden={ ! isOpen }
						>
							<div className="gambol-accordion-item__content">
								{ /* Inner blocks content would go here */ }
							</div>
						</div>
					</div>
				);
			} ) }
		</div>
	);
}
