/**
 * Sitemap Block - Edit Component
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
	Toggle,
	GambolColorPicker,
	RangeSlider,
	TextInput,
} from '../../components/inspector';

/**
 * Sitemap Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showPages,
		showPosts,
		showCategories,
		showTags,
		columns,
		pagesTitle,
		postsTitle,
		categoriesTitle,
		tagsTitle,
		postsCount,
		headingColor,
		linkColor,
		linkHoverColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-sitemap',
		style: {
			'--sitemap-columns': columns,
			'--link-hover-color': linkHoverColor || 'var(--gb-colors-primary)',
		},
	} );

	// Fetch data
	const { pages, posts, categories, tags, isLoading } = useSelect(
		( select ) => {
			const coreSelect = select( 'core' );
			
			return {
				pages: showPages ? coreSelect.getEntityRecords( 'postType', 'page', { per_page: 50, orderby: 'menu_order', order: 'asc' } ) : [],
				posts: showPosts ? coreSelect.getEntityRecords( 'postType', 'post', { per_page: postsCount, orderby: 'date', order: 'desc' } ) : [],
				categories: showCategories ? coreSelect.getEntityRecords( 'taxonomy', 'category', { per_page: 50 } ) : [],
				tags: showTags ? coreSelect.getEntityRecords( 'taxonomy', 'post_tag', { per_page: 50 } ) : [],
				isLoading: 
					( showPages && ! coreSelect.hasFinishedResolution( 'getEntityRecords', [ 'postType', 'page' ] ) ) ||
					( showPosts && ! coreSelect.hasFinishedResolution( 'getEntityRecords', [ 'postType', 'post' ] ) ),
			};
		},
		[ showPages, showPosts, showCategories, showTags, postsCount ]
	);

	const headingStyle = {
		color: headingColor || undefined,
	};

	const linkStyle = {
		color: linkColor || undefined,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Sitemap', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Content', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Pages', 'gambol-builder' ) }
									checked={ showPages }
									onChange={ ( value ) => setAttributes( { showPages: value } ) }
								/>
								<Toggle
									label={ __( 'Show Posts', 'gambol-builder' ) }
									checked={ showPosts }
									onChange={ ( value ) => setAttributes( { showPosts: value } ) }
								/>
								<Toggle
									label={ __( 'Show Categories', 'gambol-builder' ) }
									checked={ showCategories }
									onChange={ ( value ) => setAttributes( { showCategories: value } ) }
								/>
								<Toggle
									label={ __( 'Show Tags', 'gambol-builder' ) }
									checked={ showTags }
									onChange={ ( value ) => setAttributes( { showTags: value } ) }
								/>
							</Section>

							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Columns', 'gambol-builder' ) }
									value={ columns }
									onChange={ ( value ) => setAttributes( { columns: value } ) }
									min={ 1 }
									max={ 4 }
								/>
								{ showPosts && (
									<RangeSlider
										label={ __( 'Posts Count', 'gambol-builder' ) }
										value={ postsCount }
										onChange={ ( value ) => setAttributes( { postsCount: value } ) }
										min={ 5 }
										max={ 50 }
									/>
								) }
							</Section>

							<Section title={ __( 'Headings', 'gambol-builder' ) }>
								{ showPages && (
									<TextInput
										label={ __( 'Pages Title', 'gambol-builder' ) }
										value={ pagesTitle }
										onChange={ ( value ) => setAttributes( { pagesTitle: value } ) }
									/>
								) }
								{ showPosts && (
									<TextInput
										label={ __( 'Posts Title', 'gambol-builder' ) }
										value={ postsTitle }
										onChange={ ( value ) => setAttributes( { postsTitle: value } ) }
									/>
								) }
								{ showCategories && (
									<TextInput
										label={ __( 'Categories Title', 'gambol-builder' ) }
										value={ categoriesTitle }
										onChange={ ( value ) => setAttributes( { categoriesTitle: value } ) }
									/>
								) }
								{ showTags && (
									<TextInput
										label={ __( 'Tags Title', 'gambol-builder' ) }
										value={ tagsTitle }
										onChange={ ( value ) => setAttributes( { tagsTitle: value } ) }
									/>
								) }
							</Section>
						</>
					}
					styleTab={
						<Section title={ __( 'Colors', 'gambol-builder' ) }>
							<GambolColorPicker
								label={ __( 'Heading Color', 'gambol-builder' ) }
								value={ headingColor }
								onChange={ ( value ) => setAttributes( { headingColor: value } ) }
							/>
							<GambolColorPicker
								label={ __( 'Link Color', 'gambol-builder' ) }
								value={ linkColor }
								onChange={ ( value ) => setAttributes( { linkColor: value } ) }
							/>
							<GambolColorPicker
								label={ __( 'Link Hover Color', 'gambol-builder' ) }
								value={ linkHoverColor }
								onChange={ ( value ) => setAttributes( { linkHoverColor: value } ) }
							/>
						</Section>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ isLoading ? (
					<div className="wp-block-gambol-sitemap__loading">
						<Spinner />
					</div>
				) : (
					<div className="wp-block-gambol-sitemap__grid">
						{ showPages && pages && pages.length > 0 && (
							<div className="wp-block-gambol-sitemap__section">
								<h3 className="wp-block-gambol-sitemap__heading" style={ headingStyle }>
									{ pagesTitle }
								</h3>
								<ul className="wp-block-gambol-sitemap__list">
									{ pages.map( ( page ) => (
										<li key={ page.id }>
											<a href={ page.link } style={ linkStyle }>
												{ page.title.rendered }
											</a>
										</li>
									) ) }
								</ul>
							</div>
						) }

						{ showPosts && posts && posts.length > 0 && (
							<div className="wp-block-gambol-sitemap__section">
								<h3 className="wp-block-gambol-sitemap__heading" style={ headingStyle }>
									{ postsTitle }
								</h3>
								<ul className="wp-block-gambol-sitemap__list">
									{ posts.map( ( post ) => (
										<li key={ post.id }>
											<a href={ post.link } style={ linkStyle }>
												{ post.title.rendered }
											</a>
										</li>
									) ) }
								</ul>
							</div>
						) }

						{ showCategories && categories && categories.length > 0 && (
							<div className="wp-block-gambol-sitemap__section">
								<h3 className="wp-block-gambol-sitemap__heading" style={ headingStyle }>
									{ categoriesTitle }
								</h3>
								<ul className="wp-block-gambol-sitemap__list">
									{ categories.map( ( cat ) => (
										<li key={ cat.id }>
											<a href={ cat.link } style={ linkStyle }>
												{ cat.name } ({ cat.count })
											</a>
										</li>
									) ) }
								</ul>
							</div>
						) }

						{ showTags && tags && tags.length > 0 && (
							<div className="wp-block-gambol-sitemap__section">
								<h3 className="wp-block-gambol-sitemap__heading" style={ headingStyle }>
									{ tagsTitle }
								</h3>
								<ul className="wp-block-gambol-sitemap__list wp-block-gambol-sitemap__list--tags">
									{ tags.map( ( tag ) => (
										<li key={ tag.id }>
											<a href={ tag.link } style={ linkStyle }>
												{ tag.name }
											</a>
										</li>
									) ) }
								</ul>
							</div>
						) }
					</div>
				) }
			</div>
		</>
	);
}
