/**
 * Nav Menu Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { SelectControl, Spinner } from '@wordpress/components';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	RangeSlider,
	TextInput,
} from '../../components/inspector';

/**
 * Nav Menu Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		menuId,
		layout,
		showDropdownIcon,
		mobileBreakpoint,
		mobileToggle,
		textColor,
		textHoverColor,
		backgroundColor,
		fontSize,
		gap,
		padding,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-nav-menu wp-block-gambol-nav-menu--${ layout }`,
	} );

	// Fetch available menus
	const { menus, isLoading, menuItems } = useSelect( ( select ) => {
		const menusList = select( 'core' ).getMenus() || [];
		const loading = select( 'core/data' ).isResolving( 'core', 'getMenus' );
		
		let items = [];
		if ( menuId ) {
			items = select( 'core' ).getMenuItems( { menus: menuId, per_page: 100 } ) || [];
		}
		
		return {
			menus: menusList,
			isLoading: loading,
			menuItems: items,
		};
	}, [ menuId ] );

	const menuOptions = [
		{ value: 0, label: __( 'Select a Menu', 'gambol-builder' ) },
		...menus.map( ( menu ) => ( {
			value: menu.id,
			label: menu.name,
		} ) ),
	];

	const wrapperStyle = {
		backgroundColor: backgroundColor || undefined,
	};

	const itemStyle = {
		color: textColor || undefined,
		fontSize: fontSize || undefined,
		padding: padding ? `${ padding }px` : undefined,
		'--item-hover-color': textHoverColor || undefined,
	};

	const navStyle = {
		gap: gap ? `${ gap }px` : undefined,
	};

	// Render menu items
	const renderMenuItems = ( items, parentId = 0 ) => {
		return items
			.filter( ( item ) => item.parent === parentId )
			.map( ( item ) => {
				const children = items.filter( ( child ) => child.parent === item.id );
				const hasChildren = children.length > 0;

				return (
					<li 
						key={ item.id } 
						className={ `wp-block-gambol-nav-menu__item ${ hasChildren ? 'has-children' : '' }` }
					>
						<a href={ item.url } style={ itemStyle }>
							{ item.title.rendered }
							{ hasChildren && showDropdownIcon && (
								<span className="wp-block-gambol-nav-menu__dropdown-icon">▼</span>
							) }
						</a>
						{ hasChildren && (
							<ul className="wp-block-gambol-nav-menu__submenu">
								{ renderMenuItems( items, item.id ) }
							</ul>
						) }
					</li>
				);
			} );
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Nav Menu', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M5 5v1.5h14V5H5zm0 7.5h14V11H5v1.5zm0 6h14V17H5v1.5z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Menu', 'gambol-builder' ) }>
								{ isLoading ? (
									<Spinner />
								) : (
									<SelectControl
										label={ __( 'Select Menu', 'gambol-builder' ) }
										value={ menuId }
										options={ menuOptions }
										onChange={ ( value ) => setAttributes( { menuId: parseInt( value ) } ) }
									/>
								) }
							</Section>

							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Direction', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'horizontal', label: __( 'Horizontal', 'gambol-builder' ) },
										{ value: 'vertical', label: __( 'Vertical', 'gambol-builder' ) },
									] }
								/>
								<RangeSlider
									label={ __( 'Items Gap', 'gambol-builder' ) }
									value={ gap }
									onChange={ ( value ) => setAttributes( { gap: value } ) }
									min={ 0 }
									max={ 50 }
								/>
								<Toggle
									label={ __( 'Show Dropdown Icon', 'gambol-builder' ) }
									checked={ showDropdownIcon }
									onChange={ ( value ) => setAttributes( { showDropdownIcon: value } ) }
								/>
							</Section>

							<Section title={ __( 'Mobile', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Breakpoint', 'gambol-builder' ) }
									value={ mobileBreakpoint }
									onChange={ ( value ) => setAttributes( { mobileBreakpoint: value } ) }
									min={ 320 }
									max={ 1200 }
								/>
								<ButtonGroup
									label={ __( 'Toggle Type', 'gambol-builder' ) }
									value={ mobileToggle }
									onChange={ ( value ) => setAttributes( { mobileToggle: value } ) }
									options={ [
										{ value: 'hamburger', label: '☰' },
										{ value: 'dropdown', label: '▼' },
									] }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Typography', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Font Size', 'gambol-builder' ) }
									value={ fontSize }
									onChange={ ( value ) => setAttributes( { fontSize: value } ) }
									placeholder="16px"
								/>
								<RangeSlider
									label={ __( 'Item Padding', 'gambol-builder' ) }
									value={ padding }
									onChange={ ( value ) => setAttributes( { padding: value } ) }
									min={ 0 }
									max={ 30 }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ textColor }
									onChange={ ( value ) => setAttributes( { textColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Hover Color', 'gambol-builder' ) }
									value={ textHoverColor }
									onChange={ ( value ) => setAttributes( { textHoverColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Background Color', 'gambol-builder' ) }
									value={ backgroundColor }
									onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<nav { ...blockProps } style={ wrapperStyle }>
				{ ! menuId ? (
					<div className="wp-block-gambol-nav-menu__placeholder">
						<span>{ __( 'Select a menu from the sidebar', 'gambol-builder' ) }</span>
					</div>
				) : menuItems.length === 0 ? (
					<div className="wp-block-gambol-nav-menu__placeholder">
						<Spinner />
					</div>
				) : (
					<ul className="wp-block-gambol-nav-menu__list" style={ navStyle }>
						{ renderMenuItems( menuItems ) }
					</ul>
				) }
			</nav>
		</>
	);
}
