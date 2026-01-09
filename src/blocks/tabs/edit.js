/**
 * Tabs Block - Edit Component
 *
 * @package GambolBuilder
 */

import { useState, useCallback, useEffect } from '@wordpress/element';
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
	TextInput,
	GambolColorPicker,
	SpacingBox,
} from '../../components/inspector';

/**
 * Tabs header icon.
 */
const TabsHeaderIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z"/>
	</svg>
);

/**
 * Generate unique ID.
 */
const generateId = () => `tab-${ Math.random().toString( 36 ).substr( 2, 9 ) }`;

/**
 * Tabs Edit Component.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
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

	// Track which tab is being edited
	const [ editingTabId, setEditingTabId ] = useState( null );

	// Add new tab
	const addTab = useCallback( () => {
		const newTab = {
			id: generateId(),
			title: `Tab ${ tabs.length + 1 }`,
		};
		setAttributes( {
			tabs: [ ...tabs, newTab ],
		} );
	}, [ tabs, setAttributes ] );

	// Remove tab
	const removeTab = useCallback( ( tabId ) => {
		if ( tabs.length <= 1 ) return;
		
		const newTabs = tabs.filter( ( t ) => t.id !== tabId );
		setAttributes( { tabs: newTabs } );
		
		if ( activeTab === tabId ) {
			setAttributes( { activeTab: newTabs[ 0 ].id } );
		}
	}, [ tabs, activeTab, setAttributes ] );

	// Update tab title
	const updateTabTitle = useCallback( ( tabId, title ) => {
		const newTabs = tabs.map( ( t ) =>
			t.id === tabId ? { ...t, title } : t
		);
		setAttributes( { tabs: newTabs } );
	}, [ tabs, setAttributes ] );

	// Move tab
	const moveTab = useCallback( ( tabId, direction ) => {
		const index = tabs.findIndex( ( t ) => t.id === tabId );
		if ( index === -1 ) return;
		
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if ( newIndex < 0 || newIndex >= tabs.length ) return;
		
		const newTabs = [ ...tabs ];
		[ newTabs[ index ], newTabs[ newIndex ] ] = [ newTabs[ newIndex ], newTabs[ index ] ];
		setAttributes( { tabs: newTabs } );
	}, [ tabs, setAttributes ] );

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

	const blockProps = useBlockProps( {
		className,
		style: cssVars,
		id: htmlId || undefined,
	} );

	// Inner blocks for tab content
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'gambol-tabs__content' },
		{
			allowedBlocks: [ 'gambol/tab-panel' ],
			template: tabs.map( ( tab ) => [
				'gambol/tab-panel',
				{ tabId: tab.id },
			] ),
			templateLock: 'all',
		}
	);

	// Layout tab content
	const layoutTab = (
		<>
			<Section title={ __( 'Tabs', 'gambol-builder' ) }>
				<div className="gambol-tabs-editor">
					{ tabs.map( ( tab, index ) => (
						<div key={ tab.id } className="gambol-tab-editor-item">
							{ editingTabId === tab.id ? (
								<input
									type="text"
									value={ tab.title }
									onChange={ ( e ) => updateTabTitle( tab.id, e.target.value ) }
									onBlur={ () => setEditingTabId( null ) }
									onKeyDown={ ( e ) => e.key === 'Enter' && setEditingTabId( null ) }
									autoFocus
									className="gambol-tab-title-input"
								/>
							) : (
								<span
									className="gambol-tab-title"
									onClick={ () => setEditingTabId( tab.id ) }
								>
									{ tab.title }
								</span>
							) }
							<div className="gambol-tab-actions">
								<button
									type="button"
									onClick={ () => moveTab( tab.id, 'up' ) }
									disabled={ index === 0 }
									title={ __( 'Move up', 'gambol-builder' ) }
								>
									↑
								</button>
								<button
									type="button"
									onClick={ () => moveTab( tab.id, 'down' ) }
									disabled={ index === tabs.length - 1 }
									title={ __( 'Move down', 'gambol-builder' ) }
								>
									↓
								</button>
								<button
									type="button"
									onClick={ () => removeTab( tab.id ) }
									disabled={ tabs.length <= 1 }
									title={ __( 'Remove', 'gambol-builder' ) }
									className="gambol-tab-remove"
								>
									×
								</button>
							</div>
						</div>
					) ) }
					<button
						type="button"
						className="gambol-btn gambol-btn--secondary gambol-btn--full"
						onClick={ addTab }
					>
						{ __( '+ Add Tab', 'gambol-builder' ) }
					</button>
				</div>
			</Section>

			<Section title={ __( 'Layout', 'gambol-builder' ) }>
				<Dropdown
					label={ __( 'Tab Position', 'gambol-builder' ) }
					value={ tabPosition }
					options={ [
						{ value: 'top', label: __( 'Top', 'gambol-builder' ) },
						{ value: 'bottom', label: __( 'Bottom', 'gambol-builder' ) },
						{ value: 'left', label: __( 'Left', 'gambol-builder' ) },
						{ value: 'right', label: __( 'Right', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { tabPosition: value } ) }
				/>

				<ButtonGroup
					label={ __( 'Tab Alignment', 'gambol-builder' ) }
					value={ tabAlignment }
					options={ [
						{ value: 'left', label: __( 'Left', 'gambol-builder' ) },
						{ value: 'center', label: __( 'Center', 'gambol-builder' ) },
						{ value: 'right', label: __( 'Right', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { tabAlignment: value } ) }
				/>

				<Dropdown
					label={ __( 'Tab Width', 'gambol-builder' ) }
					value={ tabWidth }
					options={ [
						{ value: 'auto', label: __( 'Auto', 'gambol-builder' ) },
						{ value: 'full', label: __( 'Full Width', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { tabWidth: value } ) }
				/>

				<RangeSlider
					label={ __( 'Tab Gap', 'gambol-builder' ) }
					value={ tabGap }
					min={ 0 }
					max={ 20 }
					step={ 1 }
					onChange={ ( value ) => setAttributes( { tabGap: value } ) }
				/>
			</Section>
		</>
	);

	// Design tab content
	const designTab = (
		<>
			<Section title={ __( 'Tab Styling', 'gambol-builder' ) }>
				<GambolColorPicker
					label={ __( 'Background', 'gambol-builder' ) }
					value={ tabBackgroundColor }
					onChange={ ( value ) => setAttributes( { tabBackgroundColor: value } ) }
				/>
				<GambolColorPicker
					label={ __( 'Active Background', 'gambol-builder' ) }
					value={ tabActiveBackgroundColor }
					onChange={ ( value ) => setAttributes( { tabActiveBackgroundColor: value } ) }
				/>
				<GambolColorPicker
					label={ __( 'Text Color', 'gambol-builder' ) }
					value={ tabTextColor }
					onChange={ ( value ) => setAttributes( { tabTextColor: value } ) }
				/>
				<GambolColorPicker
					label={ __( 'Active Text Color', 'gambol-builder' ) }
					value={ tabActiveTextColor }
					onChange={ ( value ) => setAttributes( { tabActiveTextColor: value } ) }
				/>
				<TextInput
					label={ __( 'Border Radius', 'gambol-builder' ) }
					value={ tabBorderRadius }
					onChange={ ( value ) => setAttributes( { tabBorderRadius: value } ) }
				/>
				<SpacingBox
					label={ __( 'Tab Padding', 'gambol-builder' ) }
					value={ tabPadding }
					onChange={ ( value ) => setAttributes( { tabPadding: value } ) }
				/>
			</Section>

			<Section title={ __( 'Content Styling', 'gambol-builder' ) }>
				<GambolColorPicker
					label={ __( 'Background', 'gambol-builder' ) }
					value={ contentBackgroundColor }
					onChange={ ( value ) => setAttributes( { contentBackgroundColor: value } ) }
				/>
				<GambolColorPicker
					label={ __( 'Border Color', 'gambol-builder' ) }
					value={ contentBorderColor }
					onChange={ ( value ) => setAttributes( { contentBorderColor: value } ) }
				/>
				<RangeSlider
					label={ __( 'Border Width', 'gambol-builder' ) }
					value={ contentBorderWidth }
					min={ 0 }
					max={ 5 }
					step={ 1 }
					onChange={ ( value ) => setAttributes( { contentBorderWidth: value } ) }
				/>
				<TextInput
					label={ __( 'Border Radius', 'gambol-builder' ) }
					value={ contentBorderRadius }
					onChange={ ( value ) => setAttributes( { contentBorderRadius: value } ) }
				/>
				<SpacingBox
					label={ __( 'Content Padding', 'gambol-builder' ) }
					value={ contentPadding }
					onChange={ ( value ) => setAttributes( { contentPadding: value } ) }
				/>
			</Section>
		</>
	);

	// Advanced tab content
	const advancedTab = (
		<>
			<Section title={ __( 'Animation', 'gambol-builder' ) }>
				<Dropdown
					label={ __( 'Animation Type', 'gambol-builder' ) }
					value={ animationType }
					options={ [
						{ value: 'none', label: __( 'None', 'gambol-builder' ) },
						{ value: 'fade', label: __( 'Fade', 'gambol-builder' ) },
						{ value: 'slide', label: __( 'Slide', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { animationType: value } ) }
				/>
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
					placeholder="my-tabs"
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
					blockTitle={ __( 'Tabs', 'gambol-builder' ) }
					blockIcon={ <TabsHeaderIcon /> }
					layoutTab={ layoutTab }
					designTab={ designTab }
					advancedTab={ advancedTab }
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="gambol-tabs__nav" role="tablist">
					{ tabs.map( ( tab ) => (
						<button
							key={ tab.id }
							type="button"
							role="tab"
							id={ tab.id }
							aria-selected={ activeTab === tab.id }
							aria-controls={ `panel-${ tab.id }` }
							className={ `gambol-tabs__tab ${ activeTab === tab.id ? 'is-active' : '' }` }
							onClick={ () => setAttributes( { activeTab: tab.id } ) }
						>
							{ tab.title }
						</button>
					) ) }
				</div>

				<div { ...innerBlocksProps }>
					{ tabs.map( ( tab, index ) => (
						<div
							key={ tab.id }
							className={ `gambol-tabs__panel ${ activeTab === tab.id ? 'is-active' : '' }` }
							role="tabpanel"
							id={ `panel-${ tab.id }` }
							aria-labelledby={ tab.id }
							hidden={ activeTab !== tab.id }
						>
							{ /* Content rendered by inner blocks */ }
						</div>
					) ) }
				</div>
			</div>
		</>
	);
}
