/**
 * Accordion Block - Edit Component
 *
 * @package GambolBuilder
 */

import { useState, useCallback } from '@wordpress/element';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

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
export default function Edit( { attributes, setAttributes } ) {
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

	const [ editingItemId, setEditingItemId ] = useState( null );

	// Toggle item open/closed
	const toggleItem = useCallback( ( itemId ) => {
		const newItems = items.map( ( item ) => {
			if ( item.id === itemId ) {
				return { ...item, isOpen: ! item.isOpen };
			}
			if ( ! allowMultiple ) {
				return { ...item, isOpen: false };
			}
			return item;
		} );
		setAttributes( { items: newItems } );
	}, [ items, allowMultiple, setAttributes ] );

	// Add new item
	const addItem = useCallback( () => {
		const newItem = {
			id: generateId(),
			title: `Accordion Item ${ items.length + 1 }`,
			isOpen: false,
		};
		setAttributes( { items: [ ...items, newItem ] } );
	}, [ items, setAttributes ] );

	// Remove item
	const removeItem = useCallback( ( itemId ) => {
		if ( items.length <= 1 ) return;
		setAttributes( { items: items.filter( ( i ) => i.id !== itemId ) } );
	}, [ items, setAttributes ] );

	// Update item title
	const updateItemTitle = useCallback( ( itemId, title ) => {
		const newItems = items.map( ( i ) =>
			i.id === itemId ? { ...i, title } : i
		);
		setAttributes( { items: newItems } );
	}, [ items, setAttributes ] );

	// Move item
	const moveItem = useCallback( ( itemId, direction ) => {
		const index = items.findIndex( ( i ) => i.id === itemId );
		if ( index === -1 ) return;
		
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if ( newIndex < 0 || newIndex >= items.length ) return;
		
		const newItems = [ ...items ];
		[ newItems[ index ], newItems[ newIndex ] ] = [ newItems[ newIndex ], newItems[ index ] ];
		setAttributes( { items: newItems } );
	}, [ items, setAttributes ] );

	// Get icon component
	const getIcon = ( isOpen ) => {
		switch ( iconType ) {
			case 'plus-minus':
				return <PlusMinusIcon isOpen={ isOpen } />;
			case 'arrow':
				return <ArrowIcon isOpen={ isOpen } />;
			default:
				return <ChevronIcon isOpen={ isOpen } />;
		}
	};

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
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps( {
		className,
		style: cssVars,
		id: htmlId || undefined,
	} );

	// Layout tab content
	const layoutTab = (
		<>
			<Section title={ __( 'Items', 'gambol-builder' ) }>
				<div className="gambol-accordion-editor">
					{ items.map( ( item, index ) => (
						<div key={ item.id } className="gambol-accordion-editor-item">
							{ editingItemId === item.id ? (
								<input
									type="text"
									value={ item.title }
									onChange={ ( e ) => updateItemTitle( item.id, e.target.value ) }
									onBlur={ () => setEditingItemId( null ) }
									onKeyDown={ ( e ) => e.key === 'Enter' && setEditingItemId( null ) }
									autoFocus
									className="gambol-accordion-title-input"
								/>
							) : (
								<span
									className="gambol-accordion-title"
									onClick={ () => setEditingItemId( item.id ) }
								>
									{ item.title }
								</span>
							) }
							<div className="gambol-accordion-actions">
								<button
									type="button"
									onClick={ () => moveItem( item.id, 'up' ) }
									disabled={ index === 0 }
								>
									↑
								</button>
								<button
									type="button"
									onClick={ () => moveItem( item.id, 'down' ) }
									disabled={ index === items.length - 1 }
								>
									↓
								</button>
								<button
									type="button"
									onClick={ () => removeItem( item.id ) }
									disabled={ items.length <= 1 }
									className="gambol-accordion-remove"
								>
									×
								</button>
							</div>
						</div>
					) ) }
					<button
						type="button"
						className="gambol-btn gambol-btn--secondary gambol-btn--full"
						onClick={ addItem }
					>
						{ __( '+ Add Item', 'gambol-builder' ) }
					</button>
				</div>
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

			<div { ...blockProps }>
				{ items.map( ( item ) => (
					<div
						key={ item.id }
						className={ `gambol-accordion-item ${ item.isOpen ? 'is-open' : '' }` }
					>
						<button
							type="button"
							className="gambol-accordion-item__header"
							onClick={ () => toggleItem( item.id ) }
							aria-expanded={ item.isOpen }
							aria-controls={ `content-${ item.id }` }
							id={ `header-${ item.id }` }
						>
							{ iconPosition === 'left' && (
								<span className="gambol-accordion-item__icon">
									{ getIcon( item.isOpen ) }
								</span>
							) }
							<span className="gambol-accordion-item__title">
								{ item.title }
							</span>
							{ iconPosition === 'right' && (
								<span className="gambol-accordion-item__icon">
									{ getIcon( item.isOpen ) }
								</span>
							) }
						</button>
						<div
							className="gambol-accordion-item__body"
							id={ `content-${ item.id }` }
							role="region"
							aria-labelledby={ `header-${ item.id }` }
							hidden={ ! item.isOpen }
						>
							<div className="gambol-accordion-item__content">
								<p>{ __( 'Accordion content goes here...', 'gambol-builder' ) }</p>
							</div>
						</div>
					</div>
				) ) }
			</div>
		</>
	);
}
