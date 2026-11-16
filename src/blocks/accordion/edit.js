/**
 * Accordion Block - Edit Component
 *
 * @package GambolBuilder
 */

import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __, sprintf } from '@wordpress/i18n';

import { getAccordionVars, getAccordionClassName } from './save';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	RangeSlider,
	Dropdown,
	Toggle,
	TextInput,
	GambolColorPicker,
	SpacingBox,
} from '../../components/inspector';

/**
 * Accordion header icon.
 */
const AccordionHeaderIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
	</svg>
);

/**
 * Toggle icons.
 */
const ChevronIcon = ( { isOpen } ) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="20"
		height="20"
		fill="currentColor"
		style={ { transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' } }
	>
		<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
	</svg>
);

const PlusMinusIcon = ( { isOpen } ) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="20"
		height="20"
		fill="currentColor"
	>
		{ isOpen ? (
			<path d="M19 13H5v-2h14v2z"/>
		) : (
			<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
		) }
	</svg>
);

const ArrowIcon = ( { isOpen } ) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="20"
		height="20"
		fill="currentColor"
		style={ { transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.3s' } }
	>
		<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
	</svg>
);

/**
 * Generate unique ID.
 */
const generateId = () => `item-${ Math.random().toString( 36 ).substr( 2, 9 ) }`;

/**
 * Accordion Edit Component.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
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

	const { insertBlock } = useDispatch( 'core/block-editor' );
	const itemCount = useSelect(
		( select ) => select( 'core/block-editor' ).getBlockCount( clientId ),
		[ clientId ]
	);

	const addItem = () => {
		insertBlock(
			createBlock(
				'gambol/accordion-item',
				{
					/* translators: %d: item number */
					title: sprintf( __( 'Item %d', 'gambol-builder' ), itemCount + 1 ),
				},
				[ createBlock( 'core/paragraph' ) ]
			),
			itemCount,
			clientId
		);
	};

	// Same builders as save.js.
	const blockProps = useBlockProps( {
		className: getAccordionClassName( attributes ),
		style: getAccordionVars( attributes ),
		id: htmlId || undefined,
	} );

	// Items are inner blocks; new accordions start from the legacy `items` titles.
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'gambol/accordion-item' ],
		template: ( items || [] ).map( ( item ) => [
			'gambol/accordion-item',
			{ itemId: item.id, title: item.title },
			[ [ 'core/paragraph' ] ],
		] ),
		renderAppender: false,
	} );

	// Layout tab content
	const layoutTab = (
		<>
			<Section title={ __( 'Items', 'gambol-builder' ) }>
				<p className="gambol-accordion-help">
					{ __( 'Edit titles and content directly on the canvas. Use the block toolbar to move or remove an item.', 'gambol-builder' ) }
				</p>
				<button
					type="button"
					className="gambol-btn gambol-btn--secondary gambol-btn--full"
					onClick={ addItem }
				>
					{ __( 'Add item', 'gambol-builder' ) }
				</button>
			</Section>

			<Section title={ __( 'Behavior', 'gambol-builder' ) }>
				<Toggle
					label={ __( 'Allow Multiple Open', 'gambol-builder' ) }
					checked={ allowMultiple }
					onChange={ ( value ) => setAttributes( { allowMultiple: value } ) }
				/>
				<Dropdown
					label={ __( 'Default Open', 'gambol-builder' ) }
					value={ defaultOpen }
					options={ [
						{ value: 'first', label: __( 'First Item', 'gambol-builder' ) },
						{ value: 'none', label: __( 'None', 'gambol-builder' ) },
						{ value: 'all', label: __( 'All (if multiple)', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { defaultOpen: value } ) }
				/>
			</Section>

			<Section title={ __( 'Icon', 'gambol-builder' ) }>
				<Dropdown
					label={ __( 'Icon Type', 'gambol-builder' ) }
					value={ iconType }
					options={ [
						{ value: 'chevron', label: __( 'Chevron', 'gambol-builder' ) },
						{ value: 'plus-minus', label: __( 'Plus/Minus', 'gambol-builder' ) },
						{ value: 'arrow', label: __( 'Arrow', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { iconType: value } ) }
				/>
				<ButtonGroup
					label={ __( 'Icon Position', 'gambol-builder' ) }
					value={ iconPosition }
					options={ [
						{ value: 'left', label: __( 'Left', 'gambol-builder' ) },
						{ value: 'right', label: __( 'Right', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { iconPosition: value } ) }
				/>
				<GambolColorPicker
					label={ __( 'Icon Color', 'gambol-builder' ) }
					value={ iconColor }
					onChange={ ( value ) => setAttributes( { iconColor: value } ) }
				/>
			</Section>
		</>
	);

	// Design tab content
	const designTab = (
		<>
			<Section title={ __( 'Header Styling', 'gambol-builder' ) }>
				<GambolColorPicker
					label={ __( 'Background', 'gambol-builder' ) }
					value={ headerBackgroundColor }
					onChange={ ( value ) => setAttributes( { headerBackgroundColor: value } ) }
				/>
				<GambolColorPicker
					label={ __( 'Active Background', 'gambol-builder' ) }
					value={ headerActiveBackgroundColor }
					onChange={ ( value ) => setAttributes( { headerActiveBackgroundColor: value } ) }
				/>
				<GambolColorPicker
					label={ __( 'Text Color', 'gambol-builder' ) }
					value={ headerTextColor }
					onChange={ ( value ) => setAttributes( { headerTextColor: value } ) }
				/>
				<RangeSlider
					label={ __( 'Font Size', 'gambol-builder' ) }
					value={ headerFontSize }
					min={ 12 }
					max={ 32 }
					step={ 1 }
					onChange={ ( value ) => setAttributes( { headerFontSize: value } ) }
				/>
				<Dropdown
					label={ __( 'Font Weight', 'gambol-builder' ) }
					value={ headerFontWeight }
					options={ [
						{ value: '400', label: __( 'Normal', 'gambol-builder' ) },
						{ value: '500', label: __( 'Medium', 'gambol-builder' ) },
						{ value: '600', label: __( 'Semi Bold', 'gambol-builder' ) },
						{ value: '700', label: __( 'Bold', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { headerFontWeight: value } ) }
				/>
				<SpacingBox
					label={ __( 'Padding', 'gambol-builder' ) }
					value={ headerPadding }
					onChange={ ( value ) => setAttributes( { headerPadding: value } ) }
				/>
			</Section>

			<Section title={ __( 'Content Styling', 'gambol-builder' ) }>
				<GambolColorPicker
					label={ __( 'Background', 'gambol-builder' ) }
					value={ contentBackgroundColor }
					onChange={ ( value ) => setAttributes( { contentBackgroundColor: value } ) }
				/>
				<SpacingBox
					label={ __( 'Padding', 'gambol-builder' ) }
					value={ contentPadding }
					onChange={ ( value ) => setAttributes( { contentPadding: value } ) }
				/>
			</Section>

			<Section title={ __( 'Border', 'gambol-builder' ) }>
				<GambolColorPicker
					label={ __( 'Border Color', 'gambol-builder' ) }
					value={ borderColor }
					onChange={ ( value ) => setAttributes( { borderColor: value } ) }
				/>
				<RangeSlider
					label={ __( 'Border Width', 'gambol-builder' ) }
					value={ borderWidth }
					min={ 0 }
					max={ 5 }
					step={ 1 }
					onChange={ ( value ) => setAttributes( { borderWidth: value } ) }
				/>
				<TextInput
					label={ __( 'Border Radius', 'gambol-builder' ) }
					value={ borderRadius }
					onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
				/>
				<RangeSlider
					label={ __( 'Item Gap', 'gambol-builder' ) }
					value={ itemGap }
					min={ 0 }
					max={ 24 }
					step={ 1 }
					onChange={ ( value ) => setAttributes( { itemGap: value } ) }
				/>
			</Section>
		</>
	);

	// Advanced tab content
	const advancedTab = (
		<>
			<Section title={ __( 'Animation', 'gambol-builder' ) }>
				<RangeSlider
					label={ __( 'Duration (ms)', 'gambol-builder' ) }
					value={ animationDuration }
					min={ 100 }
					max={ 1000 }
					step={ 50 }
					onChange={ ( value ) => setAttributes( { animationDuration: value } ) }
				/>
			</Section>

			<Section title={ __( 'Attributes', 'gambol-builder' ) }>
				<TextInput
					label={ __( 'HTML ID', 'gambol-builder' ) }
					value={ htmlId }
					onChange={ ( value ) => setAttributes( { htmlId: value } ) }
					placeholder="my-accordion"
				/>
				<TextInput
					label={ __( 'CSS Classes', 'gambol-builder' ) }
					value={ cssClasses }
					onChange={ ( value ) => setAttributes( { cssClasses: value } ) }
					placeholder="class-1 class-2"
				/>
			</Section>
		</>
	);

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Accordion', 'gambol-builder' ) }
					blockIcon={ <AccordionHeaderIcon /> }
					layoutTab={ layoutTab }
					designTab={ designTab }
					advancedTab={ advancedTab }
				/>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
