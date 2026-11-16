/**
 * Accordion Block - Save Component
 *
 * The accordion is a styled wrapper; each gambol/accordion-item saves its
 * own header and content. The v1 markup (no item content) is in deprecated.js.
 *
 * @package GambolBuilder
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * CSS custom properties shared by edit and save.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object.
 */
export function getAccordionVars( attributes ) {
	const {
		headerBackgroundColor,
		headerActiveBackgroundColor,
		headerTextColor,
		headerPadding,
		headerFontSize,
		headerFontWeight,
		iconColor,
		contentBackgroundColor,
		contentPadding,
		borderColor,
		borderWidth,
		borderRadius,
		itemGap,
		animationDuration,
	} = attributes;

	const box = ( v ) => ( v ? `${ v.top || 0 }px ${ v.right || 0 }px ${ v.bottom || 0 }px ${ v.left || 0 }px` : undefined );

	return {
		'--gambol-accordion-header-bg': headerBackgroundColor || undefined,
		'--gambol-accordion-header-active-bg': headerActiveBackgroundColor || undefined,
		'--gambol-accordion-header-color': headerTextColor || undefined,
		'--gambol-accordion-header-padding': box( headerPadding ),
		'--gambol-accordion-header-font-size': headerFontSize ? `${ headerFontSize }px` : undefined,
		'--gambol-accordion-header-font-weight': headerFontWeight || undefined,
		'--gambol-accordion-icon-color': iconColor || undefined,
		'--gambol-accordion-content-bg': contentBackgroundColor || undefined,
		'--gambol-accordion-content-padding': box( contentPadding ),
		'--gambol-accordion-border': borderColor ? `${ borderWidth || 0 }px solid ${ borderColor }` : undefined,
		'--gambol-accordion-radius': typeof borderRadius === 'number' ? `${ borderRadius }px` : undefined,
		'--gambol-accordion-gap': typeof itemGap === 'number' ? `${ itemGap }px` : undefined,
		'--gambol-accordion-duration': animationDuration ? `${ animationDuration }ms` : undefined,
	};
}

/**
 * Class names shared by edit and save.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Class names.
 */
export function getAccordionClassName( attributes ) {
	const { iconPosition, iconType, cssClasses } = attributes;
	return [
		'gambol-accordion',
		`gambol-accordion--icon-${ iconPosition || 'right' }`,
		`gambol-accordion--icon-${ iconType || 'chevron' }`,
		cssClasses,
	]
		.filter( Boolean )
		.join( ' ' );
}

/**
 * Accordion Save Component.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Save component.
 */
export default function save( { attributes } ) {
	const { allowMultiple, defaultOpen, htmlId } = attributes;

	const blockProps = useBlockProps.save( {
		className: getAccordionClassName( attributes ),
		style: getAccordionVars( attributes ),
		id: htmlId || undefined,
		'data-allow-multiple': allowMultiple ? 'true' : 'false',
		'data-default-open': defaultOpen || 'first',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
}
