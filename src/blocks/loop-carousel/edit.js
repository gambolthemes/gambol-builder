/**
 * Loop Carousel Block - Edit Component
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

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
 * Loop Carousel Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		postType,
		postsPerPage,
		slidesToShow,
		orderBy,
		order,
		autoplay,
		autoplaySpeed,
		loop,
		pauseOnHover,
		showArrows,
		showDots,
		arrowStyle,
		spacing,
		showImage,
		imageRatio,
		showTitle,
		showExcerpt,
		excerptLength,
		showMeta,
		showCategory,
		showReadMore,
		readMoreText,
		cardBackgroundColor,
		cardPadding,
		borderRadius,
		titleColor,
		metaColor,
		excerptColor,
		arrowColor,
		arrowBgColor,
		dotColor,
		dotActiveColor,
	} = attributes;

	const [ currentSlide, setCurrentSlide ] = useState( 0 );

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-loop-carousel',
		style: {
			'--slides-to-show': slidesToShow,
			'--carousel-spacing': `${ spacing }px`,
			'--image-ratio': imageRatio,
		},
	} );

	// Fetch posts
	const { posts, isLoading, categories } = useSelect(
		( select ) => {
			const query = {
				per_page: postsPerPage,
				orderby: orderBy,
				order: order,
				_embed: true,
			};

			return {
				posts: select( 'core' ).getEntityRecords( 'postType', postType, query ),
				categories: select( 'core' ).getEntityRecords( 'taxonomy', 'category', { per_page: -1 } ),
				isLoading: ! select( 'core' ).hasFinishedResolution( 'getEntityRecords', [ 'postType', postType, query ] ),
			};
		},
		[ postType, postsPerPage, orderBy, order ]
	);

	const getCategoryName = ( catId ) => {
		if ( ! categories ) return '';
		const cat = categories.find( ( c ) => c.id === catId );
		return cat ? cat.name : '';
	};

	const truncateWords = ( text, numWords ) => {
		if ( ! text ) return '';
		const stripped = text.replace( /<[^>]+>/g, '' );
		const words = stripped.split( /\s+/ );
		if ( words.length <= numWords ) return stripped;
		return words.slice( 0, numWords ).join( ' ' ) + '...';
	};

	const maxSlide = posts ? Math.max( 0, posts.length - slidesToShow ) : 0;

	const nextSlide = () => {
		setCurrentSlide( ( prev ) => ( loop ? ( prev + 1 ) % ( maxSlide + 1 ) : Math.min( prev + 1, maxSlide ) ) );
	};

	const prevSlide = () => {
		setCurrentSlide( ( prev ) => ( loop ? ( prev - 1 + maxSlide + 1 ) % ( maxSlide + 1 ) : Math.max( prev - 1, 0 ) ) );
	};

	const cardStyle = {
		backgroundColor: cardBackgroundColor || undefined,
		padding: `${ cardPadding }px`,
		borderRadius: `${ borderRadius }px`,
	};

	const arrowStyles = {
		color: arrowColor || '#fff',
		backgroundColor: arrowBgColor || 'var(--gb-colors-primary)',
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Loop Carousel', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M2 6h4v12H2V6zm5 0h10v12H7V6zm11 0h4v12h-4V6z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Query', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Post Type', 'gambol-builder' ) }
									value={ postType }
									onChange={ ( value ) => setAttributes( { postType: value } ) }
									options={ [
										{ value: 'post', label: 'Post' },
										{ value: 'page', label: 'Page' },
									] }
								/>
								<RangeSlider
									label={ __( 'Total Posts', 'gambol-builder' ) }
									value={ postsPerPage }
									onChange={ ( value ) => setAttributes( { postsPerPage: value } ) }
									min={ 1 }
									max={ 20 }
								/>
								<ButtonGroup
									label={ __( 'Order By', 'gambol-builder' ) }
									value={ orderBy }
									onChange={ ( value ) => setAttributes( { orderBy: value } ) }
									options={ [
										{ value: 'date', label: 'Date' },
										{ value: 'title', label: 'Title' },
										{ value: 'rand', label: 'Random' },
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
							</Section>

							<Section title={ __( 'Carousel', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Slides to Show', 'gambol-builder' ) }
									value={ slidesToShow }
									onChange={ ( value ) => setAttributes( { slidesToShow: value } ) }
									min={ 1 }
									max={ 6 }
								/>
								<RangeSlider
									label={ __( 'Spacing', 'gambol-builder' ) }
									value={ spacing }
									onChange={ ( value ) => setAttributes( { spacing: value } ) }
									min={ 0 }
									max={ 50 }
								/>
								<Toggle
									label={ __( 'Autoplay', 'gambol-builder' ) }
									checked={ autoplay }
									onChange={ ( value ) => setAttributes( { autoplay: value } ) }
								/>
								{ autoplay && (
									<>
										<RangeSlider
											label={ __( 'Autoplay Speed (ms)', 'gambol-builder' ) }
											value={ autoplaySpeed }
											onChange={ ( value ) => setAttributes( { autoplaySpeed: value } ) }
											min={ 1000 }
											max={ 10000 }
											step={ 500 }
										/>
										<Toggle
											label={ __( 'Pause on Hover', 'gambol-builder' ) }
											checked={ pauseOnHover }
											onChange={ ( value ) => setAttributes( { pauseOnHover: value } ) }
										/>
									</>
								) }
								<Toggle
									label={ __( 'Infinite Loop', 'gambol-builder' ) }
									checked={ loop }
									onChange={ ( value ) => setAttributes( { loop: value } ) }
								/>
							</Section>

							<Section title={ __( 'Navigation', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Arrows', 'gambol-builder' ) }
									checked={ showArrows }
									onChange={ ( value ) => setAttributes( { showArrows: value } ) }
								/>
								{ showArrows && (
									<ButtonGroup
										label={ __( 'Arrow Style', 'gambol-builder' ) }
										value={ arrowStyle }
										onChange={ ( value ) => setAttributes( { arrowStyle: value } ) }
										options={ [
											{ value: 'circle', label: 'Circle' },
											{ value: 'square', label: 'Square' },
											{ value: 'plain', label: 'Plain' },
										] }
									/>
								) }
								<Toggle
									label={ __( 'Dots', 'gambol-builder' ) }
									checked={ showDots }
									onChange={ ( value ) => setAttributes( { showDots: value } ) }
								/>
							</Section>

							<Section title={ __( 'Content', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Featured Image', 'gambol-builder' ) }
									checked={ showImage }
									onChange={ ( value ) => setAttributes( { showImage: value } ) }
								/>
								{ showImage && (
									<ButtonGroup
										label={ __( 'Image Ratio', 'gambol-builder' ) }
										value={ imageRatio }
										onChange={ ( value ) => setAttributes( { imageRatio: value } ) }
										options={ [
											{ value: '1/1', label: '1:1' },
											{ value: '4/3', label: '4:3' },
											{ value: '16/9', label: '16:9' },
										] }
									/>
								) }
								<Toggle
									label={ __( 'Category', 'gambol-builder' ) }
									checked={ showCategory }
									onChange={ ( value ) => setAttributes( { showCategory: value } ) }
								/>
								<Toggle
									label={ __( 'Title', 'gambol-builder' ) }
									checked={ showTitle }
									onChange={ ( value ) => setAttributes( { showTitle: value } ) }
								/>
								<Toggle
									label={ __( 'Meta', 'gambol-builder' ) }
									checked={ showMeta }
									onChange={ ( value ) => setAttributes( { showMeta: value } ) }
								/>
								<Toggle
									label={ __( 'Excerpt', 'gambol-builder' ) }
									checked={ showExcerpt }
									onChange={ ( value ) => setAttributes( { showExcerpt: value } ) }
								/>
								{ showExcerpt && (
									<RangeSlider
										label={ __( 'Excerpt Words', 'gambol-builder' ) }
										value={ excerptLength }
										onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
										min={ 5 }
										max={ 40 }
									/>
								) }
								<Toggle
									label={ __( 'Read More', 'gambol-builder' ) }
									checked={ showReadMore }
									onChange={ ( value ) => setAttributes( { showReadMore: value } ) }
								/>
								{ showReadMore && (
									<TextInput
										label={ __( 'Read More Text', 'gambol-builder' ) }
										value={ readMoreText }
										onChange={ ( value ) => setAttributes( { readMoreText: value } ) }
									/>
								) }
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Card', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Padding', 'gambol-builder' ) }
									value={ cardPadding }
									onChange={ ( value ) => setAttributes( { cardPadding: value } ) }
									min={ 0 }
									max={ 50 }
								/>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ cardBackgroundColor }
									onChange={ ( value ) => setAttributes( { cardBackgroundColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Typography Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Title', 'gambol-builder' ) }
									value={ titleColor }
									onChange={ ( value ) => setAttributes( { titleColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Meta', 'gambol-builder' ) }
									value={ metaColor }
									onChange={ ( value ) => setAttributes( { metaColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Excerpt', 'gambol-builder' ) }
									value={ excerptColor }
									onChange={ ( value ) => setAttributes( { excerptColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Navigation Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Arrow Color', 'gambol-builder' ) }
									value={ arrowColor }
									onChange={ ( value ) => setAttributes( { arrowColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Arrow Background', 'gambol-builder' ) }
									value={ arrowBgColor }
									onChange={ ( value ) => setAttributes( { arrowBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Dot Color', 'gambol-builder' ) }
									value={ dotColor }
									onChange={ ( value ) => setAttributes( { dotColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Dot Active', 'gambol-builder' ) }
									value={ dotActiveColor }
									onChange={ ( value ) => setAttributes( { dotActiveColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ isLoading ? (
					<div className="wp-block-gambol-loop-carousel__loading">
						<Spinner />
					</div>
				) : posts && posts.length > 0 ? (
					<div className="wp-block-gambol-loop-carousel__wrapper">
						{ showArrows && (
							<button
								className={ `wp-block-gambol-loop-carousel__arrow arrow-prev arrow-${ arrowStyle }` }
								onClick={ prevSlide }
								style={ arrowStyles }
								aria-label={ __( 'Previous', 'gambol-builder' ) }
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
									<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
								</svg>
							</button>
						) }

						<div className="wp-block-gambol-loop-carousel__track">
							<div
								className="wp-block-gambol-loop-carousel__slides"
								style={ {
									transform: `translateX(-${ currentSlide * ( 100 / slidesToShow ) }%)`,
								} }
							>
								{ posts.map( ( post ) => {
									const featuredImage = post._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]?.source_url;
									const author = post._embedded?.author?.[ 0 ]?.name;
									const date = new Date( post.date ).toLocaleDateString();
									const firstCategory = post.categories?.[ 0 ] ? getCategoryName( post.categories[ 0 ] ) : '';

									return (
										<article key={ post.id } className="wp-block-gambol-loop-carousel__slide" style={ cardStyle }>
											{ showImage && (
												<div className="wp-block-gambol-loop-carousel__image">
													{ featuredImage ? (
														<img src={ featuredImage } alt="" />
													) : (
														<div className="wp-block-gambol-loop-carousel__placeholder">
															<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
																<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
															</svg>
														</div>
													) }
													{ showCategory && firstCategory && (
														<span className="wp-block-gambol-loop-carousel__category">
															{ firstCategory }
														</span>
													) }
												</div>
											) }
											<div className="wp-block-gambol-loop-carousel__content">
												{ showMeta && (
													<div className="wp-block-gambol-loop-carousel__meta" style={ { color: metaColor } }>
														<span>{ date }</span>
														<span className="sep">•</span>
														<span>{ author }</span>
													</div>
												) }
												{ showTitle && (
													<h3 className="wp-block-gambol-loop-carousel__title" style={ { color: titleColor } }>
														<a href={ post.link }>{ post.title.rendered }</a>
													</h3>
												) }
												{ showExcerpt && (
													<p className="wp-block-gambol-loop-carousel__excerpt" style={ { color: excerptColor } }>
														{ truncateWords( post.excerpt.rendered, excerptLength ) }
													</p>
												) }
												{ showReadMore && (
													<a href={ post.link } className="wp-block-gambol-loop-carousel__read-more">
														{ readMoreText }
													</a>
												) }
											</div>
										</article>
									);
								} ) }
							</div>
						</div>

						{ showArrows && (
							<button
								className={ `wp-block-gambol-loop-carousel__arrow arrow-next arrow-${ arrowStyle }` }
								onClick={ nextSlide }
								style={ arrowStyles }
								aria-label={ __( 'Next', 'gambol-builder' ) }
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
									<path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
								</svg>
							</button>
						) }

						{ showDots && (
							<div className="wp-block-gambol-loop-carousel__dots">
								{ Array.from( { length: maxSlide + 1 } ).map( ( _, index ) => (
									<button
										key={ index }
										className={ `wp-block-gambol-loop-carousel__dot ${ currentSlide === index ? 'active' : '' }` }
										onClick={ () => setCurrentSlide( index ) }
										style={ {
											backgroundColor: currentSlide === index
												? ( dotActiveColor || 'var(--gb-colors-primary)' )
												: ( dotColor || 'var(--gb-colors-gray-300)' ),
										} }
										aria-label={ `Go to slide ${ index + 1 }` }
									/>
								) ) }
							</div>
						) }
					</div>
				) : (
					<div className="wp-block-gambol-loop-carousel__empty">
						{ __( 'No posts found.', 'gambol-builder' ) }
					</div>
				) }
			</div>
		</>
	);
}
