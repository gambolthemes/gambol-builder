/**
 * Product Upsells Block - Edit Component
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
	Toggle,
	GambolColorPicker,
	RangeSlider,
	TextInput,
} from '../../components/inspector';

/**
 * Product Upsells Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		columns,
		productsPerPage,
		showTitle,
		title,
		gap,
		showPrice,
		showRating,
		showAddToCart,
		titleColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-product-upsells',
	} );

	// Sample upsell products for preview
	const sampleProducts = [
		{ name: 'Premium Product', price: '$99.00', originalPrice: '$149.00', rating: 5.0 },
		{ name: 'Deluxe Version', price: '$129.00', rating: 4.8 },
		{ name: 'Pro Bundle', price: '$199.00', rating: 4.9 },
		{ name: 'Complete Package', price: '$249.00', rating: 5.0 },
	].slice( 0, productsPerPage );

	const renderStars = ( rating ) => {
		return (
			<div className="product-rating">
				{ [ ...Array( 5 ) ].map( ( _, i ) => (
					<span key={ i } className={ `star ${ i < Math.floor( rating ) ? 'filled' : '' }` }>★</span>
				) ) }
			</div>
		);
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Product Upsells', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Title', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Title', 'gambol-builder' ) }
									checked={ showTitle }
									onChange={ ( value ) => setAttributes( { showTitle: value } ) }
								/>
								{ showTitle && (
									<TextInput
										label={ __( 'Title Text', 'gambol-builder' ) }
										value={ title }
										onChange={ ( value ) => setAttributes( { title: value } ) }
									/>
								) }
							</Section>

							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Columns', 'gambol-builder' ) }
									value={ columns }
									onChange={ ( value ) => setAttributes( { columns: value } ) }
									min={ 2 }
									max={ 6 }
								/>
								<RangeSlider
									label={ __( 'Products Count', 'gambol-builder' ) }
									value={ productsPerPage }
									onChange={ ( value ) => setAttributes( { productsPerPage: value } ) }
									min={ 1 }
									max={ 12 }
								/>
								<RangeSlider
									label={ __( 'Gap', 'gambol-builder' ) }
									value={ gap }
									onChange={ ( value ) => setAttributes( { gap: value } ) }
									min={ 0 }
									max={ 60 }
								/>
							</Section>

							<Section title={ __( 'Display', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Price', 'gambol-builder' ) }
									checked={ showPrice }
									onChange={ ( value ) => setAttributes( { showPrice: value } ) }
								/>
								<Toggle
									label={ __( 'Show Rating', 'gambol-builder' ) }
									checked={ showRating }
									onChange={ ( value ) => setAttributes( { showRating: value } ) }
								/>
								<Toggle
									label={ __( 'Show Add to Cart', 'gambol-builder' ) }
									checked={ showAddToCart }
									onChange={ ( value ) => setAttributes( { showAddToCart: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Title Color', 'gambol-builder' ) }
									value={ titleColor }
									onChange={ ( value ) => setAttributes( { titleColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ showTitle && (
					<h2 className="upsells__title" style={ { color: titleColor || 'inherit' } }>
						{ title }
					</h2>
				) }
				
				<div 
					className="upsells__grid"
					style={ { 
						gridTemplateColumns: `repeat(${ columns }, 1fr)`,
						gap: `${ gap }px`,
					} }
				>
					{ sampleProducts.map( ( product, index ) => (
						<div key={ index } className="upsell-product-card">
							<div className="upsell-product-card__image">
								<span className="upsell-badge">Upgrade</span>
								<div className="placeholder-image">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
										<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
									</svg>
								</div>
							</div>
							<div className="upsell-product-card__content">
								<h3 className="product-name">{ product.name }</h3>
								{ showRating && renderStars( product.rating ) }
								{ showPrice && (
									<span className="product-price">
										{ product.originalPrice && (
											<del>{ product.originalPrice }</del>
										) }
										<ins>{ product.price }</ins>
									</span>
								) }
								{ showAddToCart && (
									<button className="add-to-cart-btn">Add to Cart</button>
								) }
							</div>
						</div>
					) ) }
				</div>
			</div>
		</>
	);
}
