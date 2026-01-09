/**
 * Featured Image Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

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
 * Featured Image Edit Component.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const {
		isLink,
		linkTarget,
		imageSize,
		aspectRatio,
		objectFit,
		borderRadius,
		width,
		height,
		showOverlay,
		overlayColor,
	} = attributes;

	const { postId, postType } = context;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-featured-image',
	} );

	// Get featured image from post
	const { featuredImage, postLink } = useSelect(
		( select ) => {
			const post = select( 'core' ).getEditedEntityRecord( 'postType', postType || 'post', postId );
			const featuredMediaId = post?.featured_media;
			
			if ( featuredMediaId ) {
				const media = select( 'core' ).getMedia( featuredMediaId, { context: 'view' } );
				return {
					featuredImage: media?.source_url || media?.media_details?.sizes?.[ imageSize ]?.source_url,
					postLink: post?.link || '#',
				};
			}
			
			return {
				featuredImage: null,
				postLink: post?.link || '#',
			};
		},
		[ postId, postType, imageSize ]
	);

	const imageStyle = {
		width: width || undefined,
		height: height !== 'auto' ? height : undefined,
		aspectRatio: aspectRatio || undefined,
		objectFit: objectFit || undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
	};

	const overlayStyle = {
		backgroundColor: overlayColor || undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
	};

	const ImageContent = () => (
		<div className="wp-block-gambol-featured-image__wrapper" style={ imageStyle }>
			{ featuredImage ? (
				<img
					src={ featuredImage }
					alt=""
					className="wp-block-gambol-featured-image__img"
				/>
			) : (
				<div className="wp-block-gambol-featured-image__placeholder">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
						<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
					</svg>
					<span>{ __( 'Featured Image', 'gambol-builder' ) }</span>
				</div>
			) }
			{ showOverlay && (
				<div className="wp-block-gambol-featured-image__overlay" style={ overlayStyle } />
			) }
		</div>
	);

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Featured Image', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Image', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Size', 'gambol-builder' ) }
									value={ imageSize }
									onChange={ ( value ) => setAttributes( { imageSize: value } ) }
									options={ [
										{ value: 'thumbnail', label: __( 'Thumb', 'gambol-builder' ) },
										{ value: 'medium', label: __( 'Medium', 'gambol-builder' ) },
										{ value: 'large', label: __( 'Large', 'gambol-builder' ) },
										{ value: 'full', label: __( 'Full', 'gambol-builder' ) },
									] }
								/>
								<ButtonGroup
									label={ __( 'Aspect Ratio', 'gambol-builder' ) }
									value={ aspectRatio }
									onChange={ ( value ) => setAttributes( { aspectRatio: value } ) }
									options={ [
										{ value: '', label: __( 'Auto', 'gambol-builder' ) },
										{ value: '1/1', label: '1:1' },
										{ value: '4/3', label: '4:3' },
										{ value: '16/9', label: '16:9' },
										{ value: '21/9', label: '21:9' },
									] }
								/>
								<ButtonGroup
									label={ __( 'Object Fit', 'gambol-builder' ) }
									value={ objectFit }
									onChange={ ( value ) => setAttributes( { objectFit: value } ) }
									options={ [
										{ value: 'cover', label: __( 'Cover', 'gambol-builder' ) },
										{ value: 'contain', label: __( 'Contain', 'gambol-builder' ) },
										{ value: 'fill', label: __( 'Fill', 'gambol-builder' ) },
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

							<Section title={ __( 'Overlay', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Overlay', 'gambol-builder' ) }
									checked={ showOverlay }
									onChange={ ( value ) => setAttributes( { showOverlay: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Dimensions', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Width', 'gambol-builder' ) }
									value={ width }
									onChange={ ( value ) => setAttributes( { width: value } ) }
									placeholder="100%, 300px, etc."
								/>
								<TextInput
									label={ __( 'Height', 'gambol-builder' ) }
									value={ height }
									onChange={ ( value ) => setAttributes( { height: value } ) }
									placeholder="auto, 200px, etc."
								/>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 50 }
								/>
							</Section>

							{ showOverlay && (
								<Section title={ __( 'Overlay Color', 'gambol-builder' ) }>
									<GambolColorPicker
										label={ __( 'Color', 'gambol-builder' ) }
										value={ overlayColor }
										onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
									/>
								</Section>
							) }
						</>
					}
				/>
			</InspectorControls>

			<figure { ...blockProps }>
				{ isLink ? (
					<a href={ postLink } className="wp-block-gambol-featured-image__link">
						<ImageContent />
					</a>
				) : (
					<ImageContent />
				) }
			</figure>
		</>
	);
}
