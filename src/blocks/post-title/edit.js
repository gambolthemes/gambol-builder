/**
 * Post Title Block - Edit Component
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
 * Post Title Edit Component.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const {
		level,
		isLink,
		linkTarget,
		textColor,
		hoverColor,
		fontSize,
	} = attributes;

	const { postId, postType } = context;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-post-title',
		style: {
			'--hover-color': hoverColor || undefined,
		},
	} );

	// Get post title and link from context or current post
	const [ title ] = useEntityProp(
		'postType',
		postType || 'post',
		'title',
		postId
	);

	const { permalink } = useSelect(
		( select ) => {
			if ( postId ) {
				const post = select( 'core' ).getEntityRecord( 'postType', postType || 'post', postId );
				return {
					permalink: post?.link || '#',
				};
			}
			const { getEditedPostAttribute } = select( 'core/editor' );
			return {
				permalink: getEditedPostAttribute( 'link' ) || '#',
			};
		},
		[ postId, postType ]
	);

	const TagName = `h${ level }`;

	const titleStyle = {
		color: textColor || undefined,
		fontSize: fontSize || undefined,
	};

	const TitleContent = () => (
		<TagName className="wp-block-gambol-post-title__heading" style={ titleStyle }>
			{ title || __( 'Post Title', 'gambol-builder' ) }
		</TagName>
	);

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Post Title', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M4 6h12V5H4v1zm0 5h16V9H4v2zm0 5h16v-1.5H4V16z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'HTML Tag', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Heading Level', 'gambol-builder' ) }
									value={ level }
									onChange={ ( value ) => setAttributes( { level: value } ) }
									options={ [
										{ value: 1, label: 'H1' },
										{ value: 2, label: 'H2' },
										{ value: 3, label: 'H3' },
										{ value: 4, label: 'H4' },
										{ value: 5, label: 'H5' },
										{ value: 6, label: 'H6' },
									] }
								/>
							</Section>

							<Section title={ __( 'Link', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Link to Post', 'gambol-builder' ) }
									checked={ isLink }
									onChange={ ( value ) => setAttributes( { isLink: value } ) }
								/>
								{ isLink && (
									<ButtonGroup
										label={ __( 'Open In', 'gambol-builder' ) }
										value={ linkTarget }
										onChange={ ( value ) => setAttributes( { linkTarget: value } ) }
										options={ [
											{ value: '_self', label: __( 'Same Tab', 'gambol-builder' ) },
											{ value: '_blank', label: __( 'New Tab', 'gambol-builder' ) },
										] }
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
									placeholder="24px, 1.5rem, etc."
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ textColor }
									onChange={ ( value ) => setAttributes( { textColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Hover Color', 'gambol-builder' ) }
									value={ hoverColor }
									onChange={ ( value ) => setAttributes( { hoverColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ isLink ? (
					<a href={ permalink } className="wp-block-gambol-post-title__link">
						<TitleContent />
					</a>
				) : (
					<TitleContent />
				) }
			</div>
		</>
	);
}
