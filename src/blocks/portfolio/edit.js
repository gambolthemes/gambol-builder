/**
 * Portfolio Block - Edit Component
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
} from '../../components/inspector';

/**
 * Portfolio Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		postType,
		postsPerPage,
		columns,
		orderBy,
		order,
		layout,
		showFilter,
		filterStyle,
		showTitle,
		showCategory,
		showOverlay,
		overlayType,
		showLightbox,
		showLink,
		imageRatio,
		gap,
		overlayColor,
		titleColor,
		categoryColor,
		filterTextColor,
		filterActiveColor,
		filterActiveBgColor,
		borderRadius,
		iconColor,
		iconBgColor,
	} = attributes;

	const [ activeFilter, setActiveFilter ] = useState( 'all' );

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-portfolio layout-${ layout } overlay-${ overlayType }`,
		style: {
			'--portfolio-columns': columns,
			'--portfolio-gap': `${ gap }px`,
			'--image-ratio': imageRatio,
		},
	} );

	// Fetch posts and categories
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

	// Get unique categories from posts
	const postCategories = posts ? Array.from(
		new Set( posts.flatMap( ( post ) => post.categories || [] ) )
	).map( ( catId ) => ( {
		id: catId,
		name: getCategoryName( catId ),
	} ) ).filter( ( cat ) => cat.name ) : [];

	// Filter posts
	const filteredPosts = activeFilter === 'all'
		? posts
		: posts?.filter( ( post ) => post.categories?.includes( activeFilter ) );

	const filterButtonStyle = ( isActive ) => ( {
		color: isActive
			? ( filterActiveColor || '#fff' )
			: ( filterTextColor || 'var(--gb-colors-gray-700)' ),
		backgroundColor: isActive
			? ( filterActiveBgColor || 'var(--gb-colors-primary)' )
			: 'transparent',
	} );

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Portfolio', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"/>
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
									label={ __( 'Items', 'gambol-builder' ) }
									value={ postsPerPage }
									onChange={ ( value ) => setAttributes( { postsPerPage: value } ) }
									min={ 1 }
									max={ 30 }
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

							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'grid', label: 'Grid' },
										{ value: 'masonry', label: 'Masonry' },
									] }
								/>
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
									max={ 50 }
								/>
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
							</Section>

							<Section title={ __( 'Filter', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Filter', 'gambol-builder' ) }
									checked={ showFilter }
									onChange={ ( value ) => setAttributes( { showFilter: value } ) }
								/>
								{ showFilter && (
									<ButtonGroup
										label={ __( 'Filter Style', 'gambol-builder' ) }
										value={ filterStyle }
										onChange={ ( value ) => setAttributes( { filterStyle: value } ) }
										options={ [
											{ value: 'pills', label: 'Pills' },
											{ value: 'underline', label: 'Underline' },
											{ value: 'minimal', label: 'Minimal' },
										] }
									/>
								) }
							</Section>

							<Section title={ __( 'Overlay', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Overlay', 'gambol-builder' ) }
									checked={ showOverlay }
									onChange={ ( value ) => setAttributes( { showOverlay: value } ) }
								/>
								{ showOverlay && (
									<ButtonGroup
										label={ __( 'Overlay Type', 'gambol-builder' ) }
										value={ overlayType }
										onChange={ ( value ) => setAttributes( { overlayType: value } ) }
										options={ [
											{ value: 'hover', label: 'Hover' },
											{ value: 'always', label: 'Always' },
										] }
									/>
								) }
								<Toggle
									label={ __( 'Show Title', 'gambol-builder' ) }
									checked={ showTitle }
									onChange={ ( value ) => setAttributes( { showTitle: value } ) }
								/>
								<Toggle
									label={ __( 'Show Category', 'gambol-builder' ) }
									checked={ showCategory }
									onChange={ ( value ) => setAttributes( { showCategory: value } ) }
								/>
								<Toggle
									label={ __( 'Lightbox Button', 'gambol-builder' ) }
									checked={ showLightbox }
									onChange={ ( value ) => setAttributes( { showLightbox: value } ) }
								/>
								<Toggle
									label={ __( 'Link Button', 'gambol-builder' ) }
									checked={ showLink }
									onChange={ ( value ) => setAttributes( { showLink: value } ) }
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
							</Section>

							<Section title={ __( 'Overlay Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Overlay Color', 'gambol-builder' ) }
									value={ overlayColor }
									onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Title Color', 'gambol-builder' ) }
									value={ titleColor }
									onChange={ ( value ) => setAttributes( { titleColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Category Color', 'gambol-builder' ) }
									value={ categoryColor }
									onChange={ ( value ) => setAttributes( { categoryColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Icon Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Icon Color', 'gambol-builder' ) }
									value={ iconColor }
									onChange={ ( value ) => setAttributes( { iconColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Icon Background', 'gambol-builder' ) }
									value={ iconBgColor }
									onChange={ ( value ) => setAttributes( { iconBgColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Filter Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ filterTextColor }
									onChange={ ( value ) => setAttributes( { filterTextColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Active Text', 'gambol-builder' ) }
									value={ filterActiveColor }
									onChange={ ( value ) => setAttributes( { filterActiveColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Active Background', 'gambol-builder' ) }
									value={ filterActiveBgColor }
									onChange={ ( value ) => setAttributes( { filterActiveBgColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ showFilter && postCategories.length > 0 && (
					<div className={ `wp-block-gambol-portfolio__filter filter-${ filterStyle }` }>
						<button
							className={ `wp-block-gambol-portfolio__filter-btn ${ activeFilter === 'all' ? 'active' : '' }` }
							onClick={ () => setActiveFilter( 'all' ) }
							style={ filterButtonStyle( activeFilter === 'all' ) }
						>
							{ __( 'All', 'gambol-builder' ) }
						</button>
						{ postCategories.map( ( cat ) => (
							<button
								key={ cat.id }
								className={ `wp-block-gambol-portfolio__filter-btn ${ activeFilter === cat.id ? 'active' : '' }` }
								onClick={ () => setActiveFilter( cat.id ) }
								style={ filterButtonStyle( activeFilter === cat.id ) }
							>
								{ cat.name }
							</button>
						) ) }
					</div>
				) }

				{ isLoading ? (
					<div className="wp-block-gambol-portfolio__loading">
						<Spinner />
					</div>
				) : filteredPosts && filteredPosts.length > 0 ? (
					<div className="wp-block-gambol-portfolio__grid">
						{ filteredPosts.map( ( post ) => {
							const featuredImage = post._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]?.source_url;
							const firstCategory = post.categories?.[ 0 ] ? getCategoryName( post.categories[ 0 ] ) : '';

							return (
								<article
									key={ post.id }
									className="wp-block-gambol-portfolio__item"
									style={ { borderRadius: `${ borderRadius }px` } }
								>
									<div className="wp-block-gambol-portfolio__image">
										{ featuredImage ? (
											<img src={ featuredImage } alt="" />
										) : (
											<div className="wp-block-gambol-portfolio__placeholder">
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
													<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
												</svg>
											</div>
										) }
									</div>

									{ showOverlay && (
										<div
											className="wp-block-gambol-portfolio__overlay"
											style={ { backgroundColor: overlayColor } }
										>
											<div className="wp-block-gambol-portfolio__overlay-content">
												{ showCategory && firstCategory && (
													<span
														className="wp-block-gambol-portfolio__category"
														style={ { color: categoryColor } }
													>
														{ firstCategory }
													</span>
												) }
												{ showTitle && (
													<h3
														className="wp-block-gambol-portfolio__title"
														style={ { color: titleColor } }
													>
														{ post.title.rendered }
													</h3>
												) }
												<div className="wp-block-gambol-portfolio__actions">
													{ showLightbox && (
														<button
															className="wp-block-gambol-portfolio__action"
															style={ { color: iconColor, backgroundColor: iconBgColor } }
															aria-label={ __( 'View', 'gambol-builder' ) }
														>
															<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
																<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
															</svg>
														</button>
													) }
													{ showLink && (
														<a
															href={ post.link }
															className="wp-block-gambol-portfolio__action"
															style={ { color: iconColor, backgroundColor: iconBgColor } }
															aria-label={ __( 'Link', 'gambol-builder' ) }
														>
															<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
																<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
															</svg>
														</a>
													) }
												</div>
											</div>
										</div>
									) }
								</article>
							);
						} ) }
					</div>
				) : (
					<div className="wp-block-gambol-portfolio__empty">
						{ __( 'No items found.', 'gambol-builder' ) }
					</div>
				) }
			</div>
		</>
	);
}
