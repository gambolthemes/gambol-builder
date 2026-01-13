/**
 * Loop Grid Block - Edit Component
 *
 * @package GambolBuilder
 */

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
 * Loop Grid Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		postType,
		postsPerPage,
		columns,
		orderBy,
		order,
		layout,
		showImage,
		imagePosition,
		imageRatio,
		showTitle,
		titleTag,
		showMeta,
		metaPosition,
		showExcerpt,
		excerptLength,
		showReadMore,
		readMoreText,
		showCategory,
		gap,
		rowGap,
		cardPadding,
		backgroundColor,
		titleColor,
		metaColor,
		excerptColor,
		categoryColor,
		categoryBgColor,
		readMoreColor,
		borderRadius,
		imageRadius,
		showShadow,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-loop-grid layout-${ layout } ${ showShadow ? 'has-shadow' : '' }`,
		style: {
			'--grid-columns': columns,
			'--grid-gap': `${ gap }px`,
			'--grid-row-gap': `${ rowGap }px`,
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

			const postsData = select( 'core' ).getEntityRecords( 'postType', postType, query );
			const categoriesData = select( 'core' ).getEntityRecords( 'taxonomy', 'category', { per_page: -1 } );

			return {
				posts: postsData,
				categories: categoriesData,
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

	const TitleTag = titleTag;

	const cardStyle = {
		backgroundColor: backgroundColor || undefined,
		borderRadius: `${ borderRadius }px`,
		padding: `${ cardPadding }px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Loop Grid', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
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
									label={ __( 'Posts Per Page', 'gambol-builder' ) }
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

							<Section title={ __( 'Grid', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Layout', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'default', label: 'Default' },
										{ value: 'masonry', label: 'Masonry' },
										{ value: 'overlay', label: 'Overlay' },
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
									label={ __( 'Column Gap', 'gambol-builder' ) }
									value={ gap }
									onChange={ ( value ) => setAttributes( { gap: value } ) }
									min={ 0 }
									max={ 60 }
								/>
								<RangeSlider
									label={ __( 'Row Gap', 'gambol-builder' ) }
									value={ rowGap }
									onChange={ ( value ) => setAttributes( { rowGap: value } ) }
									min={ 0 }
									max={ 60 }
								/>
							</Section>

							<Section title={ __( 'Image', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Image', 'gambol-builder' ) }
									checked={ showImage }
									onChange={ ( value ) => setAttributes( { showImage: value } ) }
								/>
								{ showImage && (
									<>
										<ButtonGroup
											label={ __( 'Position', 'gambol-builder' ) }
											value={ imagePosition }
											onChange={ ( value ) => setAttributes( { imagePosition: value } ) }
											options={ [
												{ value: 'top', label: 'Top' },
												{ value: 'left', label: 'Left' },
												{ value: 'right', label: 'Right' },
											] }
										/>
										<ButtonGroup
											label={ __( 'Aspect Ratio', 'gambol-builder' ) }
											value={ imageRatio }
											onChange={ ( value ) => setAttributes( { imageRatio: value } ) }
											options={ [
												{ value: '1/1', label: '1:1' },
												{ value: '4/3', label: '4:3' },
												{ value: '16/9', label: '16:9' },
											] }
										/>
									</>
								) }
							</Section>

							<Section title={ __( 'Content', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Category Badge', 'gambol-builder' ) }
									checked={ showCategory }
									onChange={ ( value ) => setAttributes( { showCategory: value } ) }
								/>
								<Toggle
									label={ __( 'Title', 'gambol-builder' ) }
									checked={ showTitle }
									onChange={ ( value ) => setAttributes( { showTitle: value } ) }
								/>
								{ showTitle && (
									<ButtonGroup
										label={ __( 'Title Tag', 'gambol-builder' ) }
										value={ titleTag }
										onChange={ ( value ) => setAttributes( { titleTag: value } ) }
										options={ [
											{ value: 'h2', label: 'H2' },
											{ value: 'h3', label: 'H3' },
											{ value: 'h4', label: 'H4' },
										] }
									/>
								) }
								<Toggle
									label={ __( 'Meta', 'gambol-builder' ) }
									checked={ showMeta }
									onChange={ ( value ) => setAttributes( { showMeta: value } ) }
								/>
								{ showMeta && (
									<ButtonGroup
										label={ __( 'Meta Position', 'gambol-builder' ) }
										value={ metaPosition }
										onChange={ ( value ) => setAttributes( { metaPosition: value } ) }
										options={ [
											{ value: 'above-title', label: 'Above' },
											{ value: 'below-title', label: 'Below' },
										] }
									/>
								) }
								<Toggle
									label={ __( 'Excerpt', 'gambol-builder' ) }
									checked={ showExcerpt }
									onChange={ ( value ) => setAttributes( { showExcerpt: value } ) }
								/>
								{ showExcerpt && (
									<RangeSlider
										label={ __( 'Excerpt Length', 'gambol-builder' ) }
										value={ excerptLength }
										onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
										min={ 5 }
										max={ 50 }
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
									label={ __( 'Card Padding', 'gambol-builder' ) }
									value={ cardPadding }
									onChange={ ( value ) => setAttributes( { cardPadding: value } ) }
									min={ 0 }
									max={ 50 }
								/>
								<RangeSlider
									label={ __( 'Card Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
								<RangeSlider
									label={ __( 'Image Radius', 'gambol-builder' ) }
									value={ imageRadius }
									onChange={ ( value ) => setAttributes( { imageRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
								<Toggle
									label={ __( 'Show Shadow', 'gambol-builder' ) }
									checked={ showShadow }
									onChange={ ( value ) => setAttributes( { showShadow: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ backgroundColor }
									onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
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
								<GambolColorPicker
									label={ __( 'Category Text', 'gambol-builder' ) }
									value={ categoryColor }
									onChange={ ( value ) => setAttributes( { categoryColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Category Background', 'gambol-builder' ) }
									value={ categoryBgColor }
									onChange={ ( value ) => setAttributes( { categoryBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Read More', 'gambol-builder' ) }
									value={ readMoreColor }
									onChange={ ( value ) => setAttributes( { readMoreColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ isLoading ? (
					<div className="wp-block-gambol-loop-grid__loading">
						<Spinner />
					</div>
				) : posts && posts.length > 0 ? (
					<div className={ `wp-block-gambol-loop-grid__container image-${ imagePosition }` }>
						{ posts.map( ( post ) => {
							const featuredImage = post._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]?.source_url;
							const author = post._embedded?.author?.[ 0 ]?.name;
							const date = new Date( post.date ).toLocaleDateString();
							const firstCategory = post.categories?.[ 0 ] ? getCategoryName( post.categories[ 0 ] ) : '';

							return (
								<article key={ post.id } className="wp-block-gambol-loop-grid__item" style={ cardStyle }>
									{ showImage && (
										<div className="wp-block-gambol-loop-grid__image" style={ { borderRadius: `${ imageRadius }px` } }>
											{ featuredImage ? (
												<img src={ featuredImage } alt="" />
											) : (
												<div className="wp-block-gambol-loop-grid__placeholder">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
														<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
													</svg>
												</div>
											) }
											{ showCategory && firstCategory && (
												<span
													className="wp-block-gambol-loop-grid__category"
													style={ {
														color: categoryColor || '#fff',
														backgroundColor: categoryBgColor || 'var(--gb-colors-primary)',
													} }
												>
													{ firstCategory }
												</span>
											) }
										</div>
									) }
									<div className="wp-block-gambol-loop-grid__content">
										{ showMeta && metaPosition === 'above-title' && (
											<div className="wp-block-gambol-loop-grid__meta" style={ { color: metaColor } }>
												<span>{ date }</span>
												<span className="sep">•</span>
												<span>{ author }</span>
											</div>
										) }
										{ showTitle && (
											<TitleTag className="wp-block-gambol-loop-grid__title" style={ { color: titleColor } }>
												<a href={ post.link }>{ post.title.rendered }</a>
											</TitleTag>
										) }
										{ showMeta && metaPosition === 'below-title' && (
											<div className="wp-block-gambol-loop-grid__meta" style={ { color: metaColor } }>
												<span>{ date }</span>
												<span className="sep">•</span>
												<span>{ author }</span>
											</div>
										) }
										{ showExcerpt && (
											<p className="wp-block-gambol-loop-grid__excerpt" style={ { color: excerptColor } }>
												{ truncateWords( post.excerpt.rendered, excerptLength ) }
											</p>
										) }
										{ showReadMore && (
											<a
												href={ post.link }
												className="wp-block-gambol-loop-grid__read-more"
												style={ { color: readMoreColor || 'var(--gb-colors-primary)' } }
											>
												{ readMoreText }
											</a>
										) }
									</div>
								</article>
							);
						} ) }
					</div>
				) : (
					<div className="wp-block-gambol-loop-grid__empty">
						{ __( 'No posts found.', 'gambol-builder' ) }
					</div>
				) }
			</div>
		</>
	);
}
