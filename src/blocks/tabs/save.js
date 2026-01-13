/**
 * Tabs Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Tabs Save Component.
 */
export default function save( { attributes } ) {
	const {
		tabs,
		activeTab,
		tabPosition,
		tabAlignment,
		tabWidth,
		tabBackgroundColor,
		tabActiveBackgroundColor,
		tabTextColor,
		tabActiveTextColor,
		tabBorderRadius,
		tabPadding,
		tabGap,
		contentBackgroundColor,
		contentBorderColor,
		contentBorderWidth,
		contentBorderRadius,
		contentPadding,
		animationType,
		animationDuration,
		htmlId,
		cssClasses,
	} = attributes;

	// Build CSS custom properties
	const cssVars = {
		'--gambol-tab-bg': tabBackgroundColor,
		'--gambol-tab-active-bg': tabActiveBackgroundColor,
		'--gambol-tab-color': tabTextColor,
		'--gambol-tab-active-color': tabActiveTextColor,
		'--gambol-tab-radius': tabBorderRadius,
		'--gambol-tab-padding': `${ tabPadding.top }px ${ tabPadding.right }px ${ tabPadding.bottom }px ${ tabPadding.left }px`,
		'--gambol-tab-gap': `${ tabGap }px`,
		'--gambol-content-bg': contentBackgroundColor,
		'--gambol-content-border': `${ contentBorderWidth }px solid ${ contentBorderColor }`,
		'--gambol-content-radius': contentBorderRadius,
		'--gambol-content-padding': `${ contentPadding.top }px ${ contentPadding.right }px ${ contentPadding.bottom }px ${ contentPadding.left }px`,
		'--gambol-tab-animation': `${ animationDuration }ms`,
	};

	// Build class names
	const className = [
		'gambol-tabs',
		`gambol-tabs--position-${ tabPosition }`,
		`gambol-tabs--align-${ tabAlignment }`,
		`gambol-tabs--animation-${ animationType }`,
		tabWidth === 'full' ? 'gambol-tabs--full-width' : '',
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps.save( {
		className,
		style: cssVars,
		id: htmlId || undefined,
		'data-active-tab': activeTab,
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'gambol-tabs__content',
	} );

	return (
		<div { ...blockProps }>
			<div className="gambol-tabs__nav" role="tablist">
				{ tabs.map( ( tab, index ) => (
					<button
						type="button"
						role="tab"
						id={ tab.id }
						aria-selected={ index === 0 ? 'true' : 'false' }
						aria-controls={ `panel-${ tab.id }` }
						className={ `gambol-tabs__tab ${ index === 0 ? 'is-active' : '' }` }
						tabIndex={ index === 0 ? 0 : -1 }
					>
						{ tab.title }
					</button>
				) ) }
			</div>

			<div { ...innerBlocksProps } />
		</div>
	);
}
