/**
 * Mini Cart Block - Edit Component
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

/**
 * Mini Cart Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showIcon,
		showCount,
		showTotal,
		iconSize,
		iconColor,
		countBgColor,
		countTextColor,
		totalColor,
		dropdownStyle,
		textAlign,
	} = attributes;

	const [ showDropdown, setShowDropdown ] = useState( false );

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-mini-cart',
		style: {
			justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
		},
	} );

	// Sample cart data
	const cartCount = 3;
	const cartTotal = 149.97;
	const cartItems = [
		{ name: 'Product 1', price: 49.99, quantity: 2 },
		{ name: 'Product 2', price: 49.99, quantity: 1 },
	];

	const countStyle = {
		backgroundColor: countBgColor || 'var(--gb-colors-primary)',
		color: countTextColor || '#fff',
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Mini Cart', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Display', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Icon', 'gambol-builder' ) }
									checked={ showIcon }
									onChange={ ( value ) => setAttributes( { showIcon: value } ) }
								/>
								<Toggle
									label={ __( 'Show Count', 'gambol-builder' ) }
									checked={ showCount }
									onChange={ ( value ) => setAttributes( { showCount: value } ) }
								/>
								<Toggle
									label={ __( 'Show Total', 'gambol-builder' ) }
									checked={ showTotal }
									onChange={ ( value ) => setAttributes( { showTotal: value } ) }
								/>
							</Section>

							<Section title={ __( 'Settings', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Dropdown Style', 'gambol-builder' ) }
									value={ dropdownStyle }
									onChange={ ( value ) => setAttributes( { dropdownStyle: value } ) }
									options={ [
										{ value: 'dropdown', label: 'Dropdown' },
										{ value: 'sidebar', label: 'Sidebar' },
									] }
								/>
								<ButtonGroup
									label={ __( 'Alignment', 'gambol-builder' ) }
									value={ textAlign }
									onChange={ ( value ) => setAttributes( { textAlign: value } ) }
									options={ [
										{ value: 'left', label: 'Left' },
										{ value: 'center', label: 'Center' },
										{ value: 'right', label: 'Right' },
									] }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Icon', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Size', 'gambol-builder' ) }
									value={ iconSize }
									onChange={ ( value ) => setAttributes( { iconSize: value } ) }
									min={ 16 }
									max={ 48 }
								/>
								<GambolColorPicker
									label={ __( 'Color', 'gambol-builder' ) }
									value={ iconColor }
									onChange={ ( value ) => setAttributes( { iconColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Count Badge', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ countBgColor }
									onChange={ ( value ) => setAttributes( { countBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ countTextColor }
									onChange={ ( value ) => setAttributes( { countTextColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Total', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Color', 'gambol-builder' ) }
									value={ totalColor }
									onChange={ ( value ) => setAttributes( { totalColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="mini-cart__toggle" onClick={ () => setShowDropdown( ! showDropdown ) }>
					{ showIcon && (
						<span className="mini-cart__icon" style={ { color: iconColor || 'inherit' } }>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={ iconSize } height={ iconSize }>
								<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
							</svg>
							{ showCount && (
								<span className="mini-cart__count" style={ countStyle }>{ cartCount }</span>
							) }
						</span>
					) }
					{ showTotal && (
						<span className="mini-cart__total" style={ { color: totalColor || 'inherit' } }>
							${ cartTotal.toFixed( 2 ) }
						</span>
					) }
				</div>

				{ showDropdown && (
					<div className="mini-cart__dropdown">
						<div className="mini-cart__items">
							{ cartItems.map( ( item, index ) => (
								<div key={ index } className="mini-cart__item">
									<div className="item-image">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
											<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
										</svg>
									</div>
									<div className="item-details">
										<span className="item-name">{ item.name }</span>
										<span className="item-qty-price">{ item.quantity } × ${ item.price.toFixed( 2 ) }</span>
									</div>
									<button className="item-remove">×</button>
								</div>
							) ) }
						</div>
						<div className="mini-cart__footer">
							<div className="subtotal">
								<span>Subtotal:</span>
								<strong>${ cartTotal.toFixed( 2 ) }</strong>
							</div>
							<div className="buttons">
								<button className="view-cart-btn">View Cart</button>
								<button className="checkout-btn">Checkout</button>
							</div>
						</div>
					</div>
				) }
			</div>
		</>
	);
}
