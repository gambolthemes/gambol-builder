/**
 * Cart Block - Edit Component
 *
 * @package GambolBuilder
 */

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
} from '../../components/inspector';

/**
 * Cart Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showProductImages,
		showQuantity,
		showSubtotal,
		showRemoveButton,
		showCouponForm,
		showTotals,
		layout,
		headerBgColor,
		borderColor,
		buttonBgColor,
		buttonTextColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-cart layout-${ layout }`,
	} );

	// Sample cart items
	const cartItems = [
		{ name: 'Sample Product 1', price: 49.99, quantity: 2, subtotal: 99.98 },
		{ name: 'Sample Product 2', price: 29.99, quantity: 1, subtotal: 29.99 },
	];

	const subtotal = 129.97;
	const shipping = 10.00;
	const total = 139.97;

	const headerStyle = {
		backgroundColor: headerBgColor || 'var(--gb-colors-gray-100)',
	};

	const borderStyle = borderColor ? { borderColor } : {};

	const buttonStyle = {
		backgroundColor: buttonBgColor || 'var(--gb-colors-primary)',
		color: buttonTextColor || '#fff',
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Cart', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'two-columns', label: '2 Columns' },
										{ value: 'one-column', label: '1 Column' },
									] }
								/>
							</Section>

							<Section title={ __( 'Cart Table', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Product Images', 'gambol-builder' ) }
									checked={ showProductImages }
									onChange={ ( value ) => setAttributes( { showProductImages: value } ) }
								/>
								<Toggle
									label={ __( 'Quantity', 'gambol-builder' ) }
									checked={ showQuantity }
									onChange={ ( value ) => setAttributes( { showQuantity: value } ) }
								/>
								<Toggle
									label={ __( 'Subtotal', 'gambol-builder' ) }
									checked={ showSubtotal }
									onChange={ ( value ) => setAttributes( { showSubtotal: value } ) }
								/>
								<Toggle
									label={ __( 'Remove Button', 'gambol-builder' ) }
									checked={ showRemoveButton }
									onChange={ ( value ) => setAttributes( { showRemoveButton: value } ) }
								/>
							</Section>

							<Section title={ __( 'Cart Totals', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Coupon Form', 'gambol-builder' ) }
									checked={ showCouponForm }
									onChange={ ( value ) => setAttributes( { showCouponForm: value } ) }
								/>
								<Toggle
									label={ __( 'Cart Totals', 'gambol-builder' ) }
									checked={ showTotals }
									onChange={ ( value ) => setAttributes( { showTotals: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Header Background', 'gambol-builder' ) }
									value={ headerBgColor }
									onChange={ ( value ) => setAttributes( { headerBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Border Color', 'gambol-builder' ) }
									value={ borderColor }
									onChange={ ( value ) => setAttributes( { borderColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Button', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ buttonBgColor }
									onChange={ ( value ) => setAttributes( { buttonBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ buttonTextColor }
									onChange={ ( value ) => setAttributes( { buttonTextColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="cart__main">
					<table className="cart__table" style={ borderStyle }>
						<thead style={ headerStyle }>
							<tr>
								{ showRemoveButton && <th className="remove-col"></th> }
								{ showProductImages && <th className="image-col"></th> }
								<th className="product-col">Product</th>
								<th className="price-col">Price</th>
								{ showQuantity && <th className="qty-col">Quantity</th> }
								{ showSubtotal && <th className="subtotal-col">Subtotal</th> }
							</tr>
						</thead>
						<tbody>
							{ cartItems.map( ( item, index ) => (
								<tr key={ index }>
									{ showRemoveButton && (
										<td className="remove-col">
											<button className="remove-btn">×</button>
										</td>
									) }
									{ showProductImages && (
										<td className="image-col">
											<div className="product-thumbnail">
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
													<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
												</svg>
											</div>
										</td>
									) }
									<td className="product-col">{ item.name }</td>
									<td className="price-col">${ item.price.toFixed( 2 ) }</td>
									{ showQuantity && (
										<td className="qty-col">
											<div className="qty-input">
												<button>−</button>
												<input type="number" value={ item.quantity } readOnly />
												<button>+</button>
											</div>
										</td>
									) }
									{ showSubtotal && (
										<td className="subtotal-col">${ item.subtotal.toFixed( 2 ) }</td>
									) }
								</tr>
							) ) }
						</tbody>
					</table>

					{ showCouponForm && (
						<div className="cart__coupon">
							<input type="text" placeholder="Coupon code" />
							<button style={ buttonStyle }>Apply Coupon</button>
						</div>
					) }
				</div>

				{ showTotals && (
					<div className="cart__totals" style={ borderStyle }>
						<h2>Cart Totals</h2>
						<table>
							<tbody>
								<tr>
									<th>Subtotal</th>
									<td>${ subtotal.toFixed( 2 ) }</td>
								</tr>
								<tr>
									<th>Shipping</th>
									<td>${ shipping.toFixed( 2 ) }</td>
								</tr>
								<tr className="total-row">
									<th>Total</th>
									<td>${ total.toFixed( 2 ) }</td>
								</tr>
							</tbody>
						</table>
						<button className="checkout-btn" style={ buttonStyle }>
							Proceed to Checkout
						</button>
					</div>
				) }
			</div>
		</>
	);
}
