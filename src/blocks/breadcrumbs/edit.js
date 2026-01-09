/**
 * Breadcrumbs Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	TextInput,
} from '../../components/inspector';

/**
 * Breadcrumbs Edit Component.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const {
		showHome,
		homeText,
		separator,
		showCurrentPage,
		linkCurrentPage,
		textColor,
		linkColor,
		separatorColor,
		fontSize,
	} = attributes;

	const { postId, postType } = context;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-breadcrumbs',
	} );

	// Get current post title
	const [ title ] = useEntityProp(
		'postType',
		postType || 'post',
		'title',
		postId
	);

	const { categories, siteUrl } = useSelect(
		( select ) => {
			const post = select( 'core' ).getEditedEntityRecord( 'postType', postType || 'post', postId );
			const site = select( 'core' ).getSite();
			
			let cats = [];
			if ( post?.categories && post.categories.length > 0 ) {
				const category = select( 'core' ).getEntityRecord( 'taxonomy', 'category', post.categories[ 0 ] );
				if ( category ) {
					cats.push( {
						id: category.id,
						name: category.name,
						link: category.link,
					} );
				}
			}
			
			return {
				categories: cats,
				siteUrl: site?.url || '#',
			};
		},
		[ postId, postType ]
	);

	const wrapperStyle = {
		fontSize: fontSize || undefined,
	};

	const linkStyle = {
		color: linkColor || 'var(--gb-colors-primary)',
	};

	const textStyle = {
		color: textColor || undefined,
	};

	const separatorStyle = {
		color: separatorColor || 'var(--gb-colors-gray-400)',
	};

	// Build breadcrumbs
	const breadcrumbs = [];
	
	if ( showHome ) {
		breadcrumbs.push( {
			text: homeText,
			link: siteUrl,
			isLink: true,
		} );
	}
	
	categories.forEach( ( cat ) => {
		breadcrumbs.push( {
			text: cat.name,
			link: cat.link,
			isLink: true,
		} );
	} );
	
	if ( showCurrentPage ) {
		breadcrumbs.push( {
			text: title || __( 'Current Page', 'gambol-builder' ),
			link: '#',
			isLink: linkCurrentPage,
		} );
	}

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Breadcrumbs', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M4 11h6V9H4v2zm8 0h6V9h-6v2zm8 0h2V9h-2v2zM4 15h2v-2H4v2zm4 0h6v-2H8v2zm8 0h6v-2h-6v2z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Home', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Home', 'gambol-builder' ) }
									checked={ showHome }
									onChange={ ( value ) => setAttributes( { showHome: value } ) }
								/>
								{ showHome && (
									<TextInput
										label={ __( 'Home Text', 'gambol-builder' ) }
										value={ homeText }
										onChange={ ( value ) => setAttributes( { homeText: value } ) }
									/>
								) }
							</Section>

							<Section title={ __( 'Separator', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Type', 'gambol-builder' ) }
									value={ separator }
									onChange={ ( value ) => setAttributes( { separator: value } ) }
									options={ [
										{ value: '/', label: '/' },
										{ value: '›', label: '›' },
										{ value: '→', label: '→' },
										{ value: '»', label: '»' },
										{ value: '|', label: '|' },
									] }
								/>
							</Section>

							<Section title={ __( 'Current Page', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Current Page', 'gambol-builder' ) }
									checked={ showCurrentPage }
									onChange={ ( value ) => setAttributes( { showCurrentPage: value } ) }
								/>
								{ showCurrentPage && (
									<Toggle
										label={ __( 'Link Current Page', 'gambol-builder' ) }
										checked={ linkCurrentPage }
										onChange={ ( value ) => setAttributes( { linkCurrentPage: value } ) }
									/>
								) }
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Typography', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Font Size', 'gambol-builder' ) }
									value={ fontSize }
									onChange={ ( value ) => setAttributes( { fontSize: value } ) }
									placeholder="14px"
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ textColor }
									onChange={ ( value ) => setAttributes( { textColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Link Color', 'gambol-builder' ) }
									value={ linkColor }
									onChange={ ( value ) => setAttributes( { linkColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Separator Color', 'gambol-builder' ) }
									value={ separatorColor }
									onChange={ ( value ) => setAttributes( { separatorColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<nav { ...blockProps } style={ wrapperStyle } aria-label={ __( 'Breadcrumbs', 'gambol-builder' ) }>
				<ol className="wp-block-gambol-breadcrumbs__list">
					{ breadcrumbs.map( ( item, index ) => (
						<li key={ index } className="wp-block-gambol-breadcrumbs__item">
							{ item.isLink ? (
								<a 
									href={ item.link } 
									className="wp-block-gambol-breadcrumbs__link"
									style={ linkStyle }
								>
									{ item.text }
								</a>
							) : (
								<span 
									className="wp-block-gambol-breadcrumbs__current"
									style={ textStyle }
								>
									{ item.text }
								</span>
							) }
							{ index < breadcrumbs.length - 1 && (
								<span 
									className="wp-block-gambol-breadcrumbs__separator"
									style={ separatorStyle }
								>
									{ separator }
								</span>
							) }
						</li>
					) ) }
				</ol>
			</nav>
		</>
	);
}
