/**
 * Posts Block - Edit Component
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
 * Truncate text to words.
 */
const truncateWords = ( text, numWords ) => {
	if ( ! text ) return '';
	const stripped = text.replace( /<[^>]+>/g, '' );
	const words = stripped.split( /\s+/ );
	if ( words.length <= numWords ) return stripped;
	return words.slice( 0, numWords ).join( ' ' ) + '...';
};

/**
 * Posts Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		postType,
		postsPerPage,
		columns,
		orderBy,
		order,
		showFeaturedImage,
		showTitle,
		showExcerpt,
		excerptLength,
		showMeta,
		showDate,
		showAuthor,
		showReadMore,
		readMoreText,
		imageRatio,
		gap,
		cardBackgroundColor,
		titleColor,
		metaColor,
		excerptColor,
		borderRadius,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-posts',
		style: {
			'--posts-columns': columns,
			'--posts-gap': `${ gap }px`,
			'--image-ratio': imageRatio,
		},
	} );

	// Fetch posts
	const { posts, isLoading } = useSelect(
		( select ) => {
			const query = {
				per_page: postsPerPage,
				orderby: orderBy,
				order: order,
				_embed: true,
			};
			
			const postsData = select( 'core' ).getEntityRecords( 'postType', postType, query );
			
			return {
				posts: postsData,
				isLoading: ! select( 'core' ).hasFinishedResolution( 'getEntityRecords', [ 'postType', postType, query ] ),
			};
		},
		[ postType, postsPerPage, orderBy, order ]
	);

	const cardStyle = {
		backgroundColor: cardBackgroundColor || undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
	};

	const titleStyle = {
		color: titleColor || undefined,
	};

	const metaStyle = {
		color: metaColor || 'var(--gb-colors-gray-500)',
	};

	const excerptStyle = {
		color: excerptColor || undefined,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Posts', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"/>
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
										{ value: 'post', label: __( 'Posts', 'gambol-builder' ) },
										{ value: 'page', label: __( 'Pages', 'gambol-builder' ) },
									] }
								/>
								<RangeSlider
									label={ __( 'Posts Per Page', 'gambol-builder' ) }
									value={ postsPerPage }
									onChange={ ( value ) => setAttributes( { postsPerPage: value } ) }
									min={ 1 }
									max={ 24 }
								/>
								<ButtonGroup
									label={ __( 'Order By', 'gambol-builder' ) }
									value={ orderBy }
									onChange={ ( value ) => setAttributes( { orderBy: value } ) }
									options={ [
										{ value: 'date', label: __( 'Date', 'gambol-builder' ) },
										{ value: 'title', label: __( 'Title', 'gambol-builder' ) },
										{ value: 'rand', label: __( 'Random', 'gambol-builder' ) },
									] }
								/>
								<ButtonGroup
									label={ __( 'Order', 'gambol-builder' ) }
									value={ order }
									onChange={ ( value ) => setAttributes( { order: value } ) }
									options={ [
										{ value: 'desc', label: __( 'DESC', 'gambol-builder' ) },
										{ value: 'asc', label: __( 'ASC', 'gambol-builder' ) },
									] }
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
										{ value: '16/9', label: '16:9' },
										{ value: '21/9', label: '21:9' },
									] }
								/>
							</Section>

							<Section title={ __( 'Content', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Featured Image', 'gambol-builder' ) }
									checked={ showFeaturedImage }
									onChange={ ( value ) => setAttributes( { showFeaturedImage: value } ) }
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
								{ showMeta && (
									<>
										<Toggle
											label={ __( 'Date', 'gambol-builder' ) }
											checked={ showDate }
											onChange={ ( value ) => setAttributes( { showDate: value } ) }
										/>
										<Toggle
											label={ __( 'Author', 'gambol-builder' ) }
											checked={ showAuthor }
											onChange={ ( value ) => setAttributes( { showAuthor: value } ) }
										/>
									</>
								) }
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
							<Section title={ __( 'Card Style', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
								<GambolColorPicker
									label={ __( 'Card Background', 'gambol-builder' ) }
									value={ cardBackgroundColor }
									onChange={ ( value ) => setAttributes( { cardBackgroundColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Title Color', 'gambol-builder' ) }
									value={ titleColor }
									onChange={ ( value ) => setAttributes( { titleColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Meta Color', 'gambol-builder' ) }
									value={ metaColor }
									onChange={ ( value ) => setAttributes( { metaColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Excerpt Color', 'gambol-builder' ) }
									value={ excerptColor }
									onChange={ ( value ) => setAttributes( { excerptColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ isLoading ? (
					<div className="wp-block-gambol-posts__loading">
						<Spinner />
					</div>
				) : posts && posts.length > 0 ? (
					<div className="wp-block-gambol-posts__grid">
						{ posts.map( ( post ) => {
							const featuredImage = post._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]?.source_url;
							const author = post._embedded?.author?.[ 0 ]?.name;
							const date = new Date( post.date ).toLocaleDateString();
							
							return (
								<article key={ post.id } className="wp-block-gambol-posts__item" style={ cardStyle }>
									{ showFeaturedImage && (
										<div className="wp-block-gambol-posts__image">
											{ featuredImage ? (
												<img src={ featuredImage } alt="" />
											) : (
												<div className="wp-block-gambol-posts__image-placeholder">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
														<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
													</svg>
												</div>
											) }
										</div>
									) }
									<div className="wp-block-gambol-posts__content">
										{ showMeta && ( showDate || showAuthor ) && (
											<div className="wp-block-gambol-posts__meta" style={ metaStyle }>
												{ showDate && <span>{ date }</span> }
												{ showDate && showAuthor && <span className="sep">•</span> }
												{ showAuthor && <span>{ author }</span> }
											</div>
										) }
										{ showTitle && (
											<h3 className="wp-block-gambol-posts__title" style={ titleStyle }>
												<a href={ post.link }>{ post.title.rendered }</a>
											</h3>
										) }
										{ showExcerpt && (
											<p className="wp-block-gambol-posts__excerpt" style={ excerptStyle }>
												{ truncateWords( post.excerpt.rendered, excerptLength ) }
											</p>
										) }
										{ showReadMore && (
											<a href={ post.link } className="wp-block-gambol-posts__read-more">
												{ readMoreText }
											</a>
										) }
									</div>
								</article>
							);
						} ) }
					</div>
				) : (
					<div className="wp-block-gambol-posts__no-posts">
						{ __( 'No posts found.', 'gambol-builder' ) }
					</div>
				) }
			</div>
		</>
	);
}
