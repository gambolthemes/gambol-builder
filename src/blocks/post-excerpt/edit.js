/**
 * Post Excerpt Block - Edit Component
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
import { RawHTML } from '@wordpress/element';

import {
	InspectorSidebar,
	Section,
	Toggle,
	GambolColorPicker,
	RangeSlider,
	TextInput,
} from '../../components/inspector';

/**
 * Truncate text to a certain number of words.
 */
const truncateWords = ( text, numWords ) => {
	if ( ! text ) return '';
	const words = text.split( /\s+/ );
	if ( words.length <= numWords ) return text;
	return words.slice( 0, numWords ).join( ' ' ) + '...';
};

/**
 * Post Excerpt Edit Component.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const {
		excerptLength,
		showReadMore,
		readMoreText,
		textColor,
		linkColor,
		fontSize,
		lineHeight,
	} = attributes;

	const { postId, postType } = context;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-post-excerpt',
	} );

	// Get excerpt and link from post
	const [ excerpt ] = useEntityProp(
		'postType',
		postType || 'post',
		'excerpt',
		postId
	);

	const { postLink } = useSelect(
		( select ) => {
			const post = select( 'core' ).getEditedEntityRecord( 'postType', postType || 'post', postId );
			return {
				postLink: post?.link || '#',
			};
		},
		[ postId, postType ]
	);

	const excerptStyle = {
		color: textColor || undefined,
		fontSize: fontSize || undefined,
		lineHeight: lineHeight || undefined,
	};

	const linkStyle = {
		color: linkColor || 'var(--gb-colors-primary)',
	};

	const excerptText = excerpt?.rendered || excerpt?.raw || '';
	// Strip HTML tags for word count
	const plainText = excerptText.replace( /<[^>]+>/g, '' );
	const truncatedExcerpt = truncateWords( plainText, excerptLength );

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Post Excerpt', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M4 6h16V5H4v1zm0 3h10V8H4v1zm0 3h16v-1H4v1zm0 3h10v-1H4v1z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Excerpt', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Excerpt Length (words)', 'gambol-builder' ) }
									value={ excerptLength }
									onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
									min={ 10 }
									max={ 100 }
								/>
							</Section>

							<Section title={ __( 'Read More Link', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Read More', 'gambol-builder' ) }
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
							<Section title={ __( 'Typography', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Font Size', 'gambol-builder' ) }
									value={ fontSize }
									onChange={ ( value ) => setAttributes( { fontSize: value } ) }
									placeholder="16px, 1rem, etc."
								/>
								<TextInput
									label={ __( 'Line Height', 'gambol-builder' ) }
									value={ lineHeight }
									onChange={ ( value ) => setAttributes( { lineHeight: value } ) }
									placeholder="1.6, 1.8, etc."
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
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps } style={ excerptStyle }>
				<p className="wp-block-gambol-post-excerpt__text">
					{ truncatedExcerpt || __( 'This is a sample excerpt. The actual excerpt will be displayed on the frontend.', 'gambol-builder' ) }
				</p>
				{ showReadMore && (
					<a 
						href={ postLink } 
						className="wp-block-gambol-post-excerpt__read-more"
						style={ linkStyle }
					>
						{ readMoreText }
					</a>
				) }
			</div>
		</>
	);
}
