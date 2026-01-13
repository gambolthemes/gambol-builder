/**
 * Post Content Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';

import {
	InspectorSidebar,
	Section,
	GambolColorPicker,
	TextInput,
} from '../../components/inspector';

/**
 * Post Content Edit Component.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const {
		textColor,
		fontSize,
		lineHeight,
	} = attributes;

	const { postId, postType } = context;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-post-content',
	} );

	// Get post content from context or current post
	const [ content ] = useEntityProp(
		'postType',
		postType || 'post',
		'content',
		postId
	);

	const contentStyle = {
		color: textColor || undefined,
		fontSize: fontSize || undefined,
		lineHeight: lineHeight || undefined,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Post Content', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M4 6h16V5H4v1zm0 3h16V8H4v1zm0 3h16v-1H4v1zm0 3h16v-1H4v1zm0 3h10v-1H4v1z"/>
						</svg>
					}
					layoutTab={
						<Section title={ __( 'Info', 'gambol-builder' ) }>
							<p className="components-base-control__help">
								{ __( 'This block displays the full content of the current post.', 'gambol-builder' ) }
							</p>
						</Section>
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
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps } style={ contentStyle }>
				{ content?.rendered ? (
					<RawHTML>{ content.rendered }</RawHTML>
				) : (
					<div className="wp-block-gambol-post-content__placeholder">
						<p>{ __( 'This block will display the post content on the frontend.', 'gambol-builder' ) }</p>
						<p>{ __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', 'gambol-builder' ) }</p>
					</div>
				) }
			</div>
		</>
	);
}
