/**
 * Product Related Block - Edit Component
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
 * Product Related Edit Component.
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
		className: 'wp-block-gambol-product-related',
	} );

	// Sample related products for preview
	const sampleProducts = [
		{ name: 'Related Product 1', price: '$45.00', rating: 4.5 },
		{ name: 'Related Product 2', price: '$59.00', rating: 4.0 },
		{ name: 'Related Product 3', price: '$35.00', rating: 5.0 },
		{ name: 'Related Product 4', price: '$75.00', rating: 4.2 },
	].slice( 0, productsPerPage );

	const renderStars = ( rating ) => {
		return (
			<div className="product-rating">
				{ [ ...Array( 5 ) ].map( ( _, i ) => (
					<span key={ i } className={ `star ${ i < Math.floor( rating ) ? 'filled' : i < rating ? 'half' : '' }` }>★</span>
				) ) }
			</div>
		);
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Related Products', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
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
					<h2 className="related-products__title" style={ { color: titleColor || 'inherit' } }>
						{ title }
					</h2>
				) }
				
				<div 
					className="related-products__grid"
					style={ { 
						gridTemplateColumns: `repeat(${ columns }, 1fr)`,
						gap: `${ gap }px`,
					} }
				>
					{ sampleProducts.map( ( product, index ) => (
						<div key={ index } className="related-product-card">
							<div className="related-product-card__image">
								<div className="placeholder-image">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
										<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
									</svg>
								</div>
							</div>
							<div className="related-product-card__content">
								<h3 className="product-name">{ product.name }</h3>
								{ showRating && renderStars( product.rating ) }
								{ showPrice && <span className="product-price">{ product.price }</span> }
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
