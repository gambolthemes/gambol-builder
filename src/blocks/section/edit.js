/**
 * Section Block - Edit Component
 *
 * Editor interface for the Section block.
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Allowed blocks inside Section.
 * Restrict to layout-focused blocks for clean architecture.
 */
const ALLOWED_BLOCKS = [
	'core/columns',
	'core/column',
	'core/group',
	'core/paragraph',
	'core/heading',
	'core/image',
	'core/buttons',
	'core/list',
	'core/spacer',
	'core/separator',
];

/**
 * Default template for new sections.
 */
const TEMPLATE = [
	[ 'core/paragraph', { placeholder: __( 'Add content to this section...', 'gambol-builder' ) } ],
];

/**
 * Section Edit Component.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set attributes.
 * @return {JSX.Element} Edit component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		contentWidth,
		maxWidth,
		minHeight,
		verticalAlign,
		tagName,
	} = attributes;

	// Build wrapper styles.
	const wrapperStyle = {};
	if ( minHeight ) {
		wrapperStyle.minHeight = minHeight;
	}

	// Build content styles.
	const contentStyle = {};
	if ( contentWidth === 'boxed' && maxWidth ) {
		contentStyle.maxWidth = maxWidth;
		contentStyle.marginLeft = 'auto';
		contentStyle.marginRight = 'auto';
	}

	// Vertical alignment class.
	const verticalAlignClass = verticalAlign !== 'top' ? `gb-valign-${ verticalAlign }` : '';

	// Block props.
	const blockProps = useBlockProps( {
		className: `gb-section ${ verticalAlignClass }`.trim(),
		style: wrapperStyle,
	} );

	// Inner blocks props.
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'gb-section__inner',
			style: contentStyle,
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			templateLock: false,
			renderAppender: undefined,
		}
	);

	// Tag name options.
	const tagOptions = [
		{ label: __( 'Section', 'gambol-builder' ), value: 'section' },
		{ label: __( 'Div', 'gambol-builder' ), value: 'div' },
		{ label: __( 'Article', 'gambol-builder' ), value: 'article' },
		{ label: __( 'Header', 'gambol-builder' ), value: 'header' },
		{ label: __( 'Footer', 'gambol-builder' ), value: 'footer' },
	];

	// Content width options.
	const widthOptions = [
		{ label: __( 'Boxed', 'gambol-builder' ), value: 'boxed' },
		{ label: __( 'Full Width', 'gambol-builder' ), value: 'full' },
	];

	// Vertical alignment options.
	const alignOptions = [
		{ label: __( 'Top', 'gambol-builder' ), value: 'top' },
		{ label: __( 'Center', 'gambol-builder' ), value: 'center' },
		{ label: __( 'Bottom', 'gambol-builder' ), value: 'bottom' },
		{ label: __( 'Stretch', 'gambol-builder' ), value: 'stretch' },
	];

	// Dynamic tag wrapper.
	const TagName = tagName || 'section';

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Section Settings', 'gambol-builder' ) }>
					<SelectControl
						label={ __( 'Content Width', 'gambol-builder' ) }
						value={ contentWidth }
						options={ widthOptions }
						onChange={ ( value ) => setAttributes( { contentWidth: value } ) }
					/>

					{ contentWidth === 'boxed' && (
						<UnitControl
							label={ __( 'Max Width', 'gambol-builder' ) }
							value={ maxWidth }
							onChange={ ( value ) => setAttributes( { maxWidth: value } ) }
							units={ [
								{ value: 'px', label: 'px' },
								{ value: '%', label: '%' },
								{ value: 'rem', label: 'rem' },
							] }
						/>
					) }

					<UnitControl
						label={ __( 'Minimum Height', 'gambol-builder' ) }
						value={ minHeight }
						onChange={ ( value ) => setAttributes( { minHeight: value } ) }
						units={ [
							{ value: 'px', label: 'px' },
							{ value: 'vh', label: 'vh' },
							{ value: 'rem', label: 'rem' },
						] }
					/>

					<SelectControl
						label={ __( 'Vertical Alignment', 'gambol-builder' ) }
						value={ verticalAlign }
						options={ alignOptions }
						onChange={ ( value ) => setAttributes( { verticalAlign: value } ) }
					/>

					<SelectControl
						label={ __( 'HTML Tag', 'gambol-builder' ) }
						value={ tagName }
						options={ tagOptions }
						onChange={ ( value ) => setAttributes( { tagName: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<TagName { ...blockProps }>
				<div { ...innerBlocksProps } />
			</TagName>
		</>
	);
}
