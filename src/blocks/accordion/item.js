/**
 * Accordion Item block.
 *
 * Each item saves its own header (a real button) and its own content (inner
 * blocks), so an accordion's content is always part of the saved post.
 * The icon for every style is saved; the parent's class picks which shows.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, useInnerBlocksProps, RichText } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const newId = () => `item-${ Math.random().toString( 36 ).slice( 2, 11 ) }`;

/**
 * All icon variants; CSS shows the one matching .gambol-accordion--icon-*.
 */
const Icons = () => (
	<span className="gambol-accordion-item__icon" aria-hidden="true">
		<svg className="gambol-accordion-icon-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" focusable="false">
			<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
		</svg>
		<svg className="gambol-accordion-icon-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" focusable="false">
			<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
		</svg>
		<svg className="gambol-accordion-icon-plus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" focusable="false">
			<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
		</svg>
		<svg className="gambol-accordion-icon-minus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" focusable="false">
			<path d="M19 13H5v-2h14v2z" />
		</svg>
	</span>
);

registerBlockType( 'gambol/accordion-item', {
	apiVersion: 3,
	title: __( 'Accordion Item', 'gambol-builder' ),
	description: __( 'One collapsible item: a title and its content.', 'gambol-builder' ),
	category: 'gambol-content',
	icon: 'text',
	parent: [ 'gambol/accordion' ],
	attributes: {
		itemId: {
			type: 'string',
			default: '',
		},
		title: {
			type: 'string',
			source: 'html',
			selector: '.gambol-accordion-item__title',
			default: '',
		},
	},
	supports: {
		html: false,
		reusable: false,
	},

	edit( { attributes, setAttributes } ) {
		const { itemId, title } = attributes;

		// Every item needs a stable id for aria-controls / aria-labelledby.
		useEffect( () => {
			if ( ! itemId ) {
				setAttributes( { itemId: newId() } );
			}
		}, [ itemId, setAttributes ] );

		const blockProps = useBlockProps( { className: 'gambol-accordion-item is-open' } );
		const innerBlocksProps = useInnerBlocksProps(
			{ className: 'gambol-accordion-item__content' },
			{
				template: [ [ 'core/paragraph', { placeholder: __( 'Add the answer or content…', 'gambol-builder' ) } ] ],
				templateLock: false,
			}
		);

		return (
			<div { ...blockProps }>
				<div className="gambol-accordion-item__header">
					<RichText
						tagName="span"
						className="gambol-accordion-item__title"
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Item title', 'gambol-builder' ) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
					<Icons />
				</div>
				<div className="gambol-accordion-item__body">
					<div { ...innerBlocksProps } />
				</div>
			</div>
		);
	},

	save( { attributes } ) {
		const { itemId, title } = attributes;
		const id = itemId || 'item';

		const blockProps = useBlockProps.save( { className: 'gambol-accordion-item' } );
		const innerBlocksProps = useInnerBlocksProps.save( { className: 'gambol-accordion-item__content' } );

		// The body is not hidden in the saved markup: without JavaScript every
		// answer stays readable. The frontend script collapses closed items.
		return (
			<div { ...blockProps } data-item-id={ id }>
				<button
					type="button"
					className="gambol-accordion-item__header"
					aria-expanded="true"
					aria-controls={ `content-${ id }` }
					id={ `header-${ id }` }
				>
					<RichText.Content tagName="span" className="gambol-accordion-item__title" value={ title } />
					<Icons />
				</button>
				<div className="gambol-accordion-item__body" id={ `content-${ id }` } role="region" aria-labelledby={ `header-${ id }` }>
					<div { ...innerBlocksProps } />
				</div>
			</div>
		);
	},
} );
