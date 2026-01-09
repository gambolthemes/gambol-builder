/**
 * Products Block - Edit Component
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
	RangeSlider,
} from '../../components/inspector';

/**
 * Products Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		productsPerPage,
		columns,
		orderBy,
		order,
		showOnSale,
		showFeatured,
		showImage,
		showTitle,
		showPrice,
		showRating,
		showAddToCart,
		showBadge,
		imageRatio,
		gap,
		cardBackgroundColor,
		titleColor,
		priceColor,
		salePriceColor,
		buttonColor,
		buttonBgColor,
		badgeColor,
		badgeBgColor,
		borderRadius,
		showShadow,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-products ${ showShadow ? 'has-shadow' : '' }`,
		style: {
			'--products-columns': columns,
			'--products-gap': `${ gap }px`,
			'--image-ratio': imageRatio,
		},
	} );

	// Sample products for editor preview
	const sampleProducts = Array.from( { length: productsPerPage } ).map( ( _, i ) => ( {
		id: i + 1,
		name: `Product ${ i + 1 }`,
		price: '$49.99',
		salePrice: i % 3 === 0 ? '$39.99' : null,
		rating: 4 + Math.random(),
		onSale: i % 3 === 0,
		featured: i % 5 === 0,
	} ) );

	const cardStyle = {
		backgroundColor: cardBackgroundColor || undefined,
		borderRadius: `${ borderRadius }px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Products', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Query', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Products', 'gambol-builder' ) }
									value={ productsPerPage }
									onChange={ ( value ) => setAttributes( { productsPerPage: value } ) }
									min={ 1 }
									max={ 24 }
								/>
								<ButtonGroup
									label={ __( 'Order By', 'gambol-builder' ) }
									value={ orderBy }
									onChange={ ( value ) => setAttributes( { orderBy: value } ) }
									options={ [
										{ value: 'date', label: 'Date' },
										{ value: 'price', label: 'Price' },
										{ value: 'rating', label: 'Rating' },
										{ value: 'popularity', label: 'Popular' },
									] }
								/>
								<ButtonGroup
									label={ __( 'Order', 'gambol-builder' ) }
									value={ order }
									onChange={ ( value ) => setAttributes( { order: value } ) }
									options={ [
										{ value: 'desc', label: 'DESC' },
										{ value: 'asc', label: 'ASC' },
									] }
								/>
								<Toggle
									label={ __( 'On Sale Only', 'gambol-builder' ) }
									checked={ showOnSale }
									onChange={ ( value ) => setAttributes( { showOnSale: value } ) }
								/>
								<Toggle
									label={ __( 'Featured Only', 'gambol-builder' ) }
									checked={ showFeatured }
									onChange={ ( value ) => setAttributes( { showFeatured: value } ) }
								/>
							</Section>

							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Columns', 'gambol-builder' ) }
									value={ columns }
									onChange={ ( value ) => setAttributes( { columns: value } ) }
									min={ 1 }
									max={ 6 }
								/>
								<RangeSlider
									label={ __( 'Gap', 'gambol-builder' ) }
									value={ gap }
									onChange={ ( value ) => setAttributes( { gap: value } ) }
									min={ 0 }
									max={ 60 }
								/>
								<ButtonGroup
									label={ __( 'Image Ratio', 'gambol-builder' ) }
									value={ imageRatio }
									onChange={ ( value ) => setAttributes( { imageRatio: value } ) }
									options={ [
										{ value: '1/1', label: '1:1' },
										{ value: '4/3', label: '4:3' },
										{ value: '3/4', label: '3:4' },
									] }
								/>
							</Section>

							<Section title={ __( 'Content', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Image', 'gambol-builder' ) }
									checked={ showImage }
									onChange={ ( value ) => setAttributes( { showImage: value } ) }
								/>
								<Toggle
									label={ __( 'Title', 'gambol-builder' ) }
									checked={ showTitle }
									onChange={ ( value ) => setAttributes( { showTitle: value } ) }
								/>
								<Toggle
									label={ __( 'Price', 'gambol-builder' ) }
									checked={ showPrice }
									onChange={ ( value ) => setAttributes( { showPrice: value } ) }
								/>
								<Toggle
									label={ __( 'Rating', 'gambol-builder' ) }
									checked={ showRating }
									onChange={ ( value ) => setAttributes( { showRating: value } ) }
								/>
								<Toggle
									label={ __( 'Add to Cart', 'gambol-builder' ) }
									checked={ showAddToCart }
									onChange={ ( value ) => setAttributes( { showAddToCart: value } ) }
								/>
								<Toggle
									label={ __( 'Sale Badge', 'gambol-builder' ) }
									checked={ showBadge }
									onChange={ ( value ) => setAttributes( { showBadge: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Card', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
								<Toggle
									label={ __( 'Shadow', 'gambol-builder' ) }
									checked={ showShadow }
									onChange={ ( value ) => setAttributes( { showShadow: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ cardBackgroundColor }
									onChange={ ( value ) => setAttributes( { cardBackgroundColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Title', 'gambol-builder' ) }
									value={ titleColor }
									onChange={ ( value ) => setAttributes( { titleColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Price', 'gambol-builder' ) }
									value={ priceColor }
									onChange={ ( value ) => setAttributes( { priceColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Sale Price', 'gambol-builder' ) }
									value={ salePriceColor }
									onChange={ ( value ) => setAttributes( { salePriceColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Button', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ buttonColor }
									onChange={ ( value ) => setAttributes( { buttonColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ buttonBgColor }
									onChange={ ( value ) => setAttributes( { buttonBgColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Badge', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ badgeColor }
									onChange={ ( value ) => setAttributes( { badgeColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ badgeBgColor }
									onChange={ ( value ) => setAttributes( { badgeBgColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-gambol-products__grid">
					{ sampleProducts.map( ( product ) => (
						<article key={ product.id } className="wp-block-gambol-products__item" style={ cardStyle }>
							{ showImage && (
								<div className="wp-block-gambol-products__image">
									<div className="wp-block-gambol-products__placeholder">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
											<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
										</svg>
									</div>
									{ showBadge && product.onSale && (
										<span
											className="wp-block-gambol-products__badge"
											style={ { color: badgeColor, backgroundColor: badgeBgColor } }
										>
											{ __( 'Sale!', 'gambol-builder' ) }
										</span>
									) }
								</div>
							) }
							<div className="wp-block-gambol-products__content">
								{ showTitle && (
									<h3 className="wp-block-gambol-products__title" style={ { color: titleColor } }>
										{ product.name }
									</h3>
								) }
								{ showRating && (
									<div className="wp-block-gambol-products__rating">
										{ Array.from( { length: 5 } ).map( ( _, i ) => (
											<svg key={ i } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={ i < Math.floor( product.rating ) ? '#ffc107' : '#e0e0e0' }>
												<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
											</svg>
										) ) }
									</div>
								) }
								{ showPrice && (
									<div className="wp-block-gambol-products__price">
										{ product.salePrice ? (
											<>
												<del style={ { color: priceColor } }>{ product.price }</del>
												<ins style={ { color: salePriceColor || 'var(--gb-colors-primary)' } }>{ product.salePrice }</ins>
											</>
										) : (
											<span style={ { color: priceColor } }>{ product.price }</span>
										) }
									</div>
								) }
								{ showAddToCart && (
									<button
										className="wp-block-gambol-products__add-to-cart"
										style={ {
											color: buttonColor || '#fff',
											backgroundColor: buttonBgColor || 'var(--gb-colors-primary)',
										} }
									>
										{ __( 'Add to Cart', 'gambol-builder' ) }
									</button>
								) }
							</div>
						</article>
					) ) }
				</div>
			</div>
		</>
	);
}
