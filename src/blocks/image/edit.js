/**
 * Image Block - Edit Component
 *
 * @package GambolBuilder
 */

import { useCallback } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	RangeSlider,
	Dropdown,
	Toggle,
	TextInput,
	SpacingBox,
} from '../../components/inspector';

/**
 * Image icon for header.
 */
const ImageBlockIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5z"/>
	</svg>
);

/**
 * Placeholder component.
 */
const ImagePlaceholder = ( { onSelect } ) => (
	<MediaUploadCheck>
		<MediaUpload
			onSelect={ onSelect }
			allowedTypes={ [ 'image' ] }
			render={ ( { open } ) => (
				<div className="gambol-image-placeholder" onClick={ open }>
					<div className="gambol-image-placeholder__icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
							<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm.5 16c0 .3-.2.5-.5.5H5c-.3 0-.5-.2-.5-.5V5c0-.3.2-.5.5-.5h14c.3 0 .5.2.5.5v14zm-7-8h2v2h-2v2h-2v-2H8.5v-2h2V9h2v2z"/>
						</svg>
					</div>
					<span className="gambol-image-placeholder__text">
						{ __( 'Click to select image', 'gambol-builder' ) }
					</span>
				</div>
			) }
		/>
	</MediaUploadCheck>
);

/**
 * Image Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		mediaId,
		mediaUrl,
		alt,
		caption,
		width,
		maxWidth,
		height,
		objectFit,
		linkUrl,
		linkTarget,
		borderRadius,
		boxShadow,
		opacity,
		hasOverlay,
		overlayColor,
		hoverEffect,
		hoverScale,
		alignment,
		margin,
		htmlId,
		cssClasses,
	} = attributes;

	// Handle image selection
	const onSelectImage = useCallback( ( media ) => {
		setAttributes( {
			mediaId: media.id,
			mediaUrl: media.url,
			alt: media.alt || '',
		} );
	}, [ setAttributes ] );

	// Handle image removal
	const onRemoveImage = useCallback( () => {
		setAttributes( {
			mediaId: undefined,
			mediaUrl: '',
			alt: '',
		} );
	}, [ setAttributes ] );

	// Build inline styles
	const imageStyles = {
		width,
		maxWidth: maxWidth || undefined,
		height,
		objectFit,
		borderRadius,
		boxShadow: boxShadow !== 'none' ? boxShadow : undefined,
		opacity,
	};

	const wrapperStyles = {
		textAlign: alignment,
		marginTop: margin.top ? `${ margin.top }px` : undefined,
		marginRight: margin.right ? `${ margin.right }px` : undefined,
		marginBottom: margin.bottom ? `${ margin.bottom }px` : undefined,
		marginLeft: margin.left ? `${ margin.left }px` : undefined,
	};

	// Build class names
	const className = [
		'gambol-image',
		hoverEffect !== 'none' ? `gambol-image--hover-${ hoverEffect }` : '',
		hasOverlay ? 'gambol-image--has-overlay' : '',
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps( {
		className,
		style: wrapperStyles,
		id: htmlId || undefined,
	} );

	// Layout tab content
	const layoutTab = (
		<>
			<Section title={ __( 'Image', 'gambol-builder' ) }>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelectImage }
						allowedTypes={ [ 'image' ] }
						value={ mediaId }
						render={ ( { open } ) => (
							<div className="gambol-image-control">
								{ mediaUrl ? (
									<>
										<img
											src={ mediaUrl }
											alt={ alt }
											className="gambol-image-preview"
										/>
										<div className="gambol-image-actions">
											<button
												type="button"
												className="gambol-btn gambol-btn--secondary"
												onClick={ open }
											>
												{ __( 'Replace', 'gambol-builder' ) }
											</button>
											<button
												type="button"
												className="gambol-btn gambol-btn--danger"
												onClick={ onRemoveImage }
											>
												{ __( 'Remove', 'gambol-builder' ) }
											</button>
										</div>
									</>
								) : (
									<button
										type="button"
										className="gambol-btn gambol-btn--primary gambol-btn--full"
										onClick={ open }
									>
										{ __( 'Select Image', 'gambol-builder' ) }
									</button>
								) }
							</div>
						) }
					/>
				</MediaUploadCheck>

				<TextInput
					label={ __( 'Alt Text', 'gambol-builder' ) }
					value={ alt }
					onChange={ ( value ) => setAttributes( { alt: value } ) }
					placeholder={ __( 'Describe this image', 'gambol-builder' ) }
				/>
			</Section>

			<Section title={ __( 'Size', 'gambol-builder' ) }>
				<TextInput
					label={ __( 'Width', 'gambol-builder' ) }
					value={ width }
					onChange={ ( value ) => setAttributes( { width: value } ) }
					placeholder="100%"
				/>
				<TextInput
					label={ __( 'Max Width', 'gambol-builder' ) }
					value={ maxWidth }
					onChange={ ( value ) => setAttributes( { maxWidth: value } ) }
					placeholder="none"
				/>
				<TextInput
					label={ __( 'Height', 'gambol-builder' ) }
					value={ height }
					onChange={ ( value ) => setAttributes( { height: value } ) }
					placeholder="auto"
				/>
				<Dropdown
					label={ __( 'Object Fit', 'gambol-builder' ) }
					value={ objectFit }
					options={ [
						{ value: 'cover', label: __( 'Cover', 'gambol-builder' ) },
						{ value: 'contain', label: __( 'Contain', 'gambol-builder' ) },
						{ value: 'fill', label: __( 'Fill', 'gambol-builder' ) },
						{ value: 'none', label: __( 'None', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { objectFit: value } ) }
				/>
			</Section>

			<Section title={ __( 'Link', 'gambol-builder' ) }>
				<TextInput
					label={ __( 'URL', 'gambol-builder' ) }
					value={ linkUrl }
					onChange={ ( value ) => setAttributes( { linkUrl: value } ) }
					placeholder="https://"
				/>
				<Dropdown
					label={ __( 'Open in', 'gambol-builder' ) }
					value={ linkTarget }
					options={ [
						{ value: '_self', label: __( 'Same Window', 'gambol-builder' ) },
						{ value: '_blank', label: __( 'New Tab', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { linkTarget: value } ) }
				/>
			</Section>

			<Section title={ __( 'Alignment', 'gambol-builder' ) }>
				<ButtonGroup
					value={ alignment }
					options={ [
						{ value: 'left', label: __( 'Left', 'gambol-builder' ) },
						{ value: 'center', label: __( 'Center', 'gambol-builder' ) },
						{ value: 'right', label: __( 'Right', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { alignment: value } ) }
				/>
			</Section>
		</>
	);

	// Design tab content
	const designTab = (
		<>
			<Section title={ __( 'Border', 'gambol-builder' ) }>
				<TextInput
					label={ __( 'Border Radius', 'gambol-builder' ) }
					value={ borderRadius }
					onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
					placeholder="0px"
				/>
			</Section>

			<Section title={ __( 'Shadow', 'gambol-builder' ) }>
				<Dropdown
					label={ __( 'Box Shadow', 'gambol-builder' ) }
					value={ boxShadow }
					options={ [
						{ value: 'none', label: __( 'None', 'gambol-builder' ) },
						{ value: '0 2px 8px rgba(0,0,0,0.08)', label: __( 'Soft', 'gambol-builder' ) },
						{ value: '0 4px 16px rgba(0,0,0,0.12)', label: __( 'Medium', 'gambol-builder' ) },
						{ value: '0 8px 32px rgba(0,0,0,0.18)', label: __( 'Strong', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { boxShadow: value } ) }
				/>
			</Section>

			<Section title={ __( 'Effects', 'gambol-builder' ) }>
				<RangeSlider
					label={ __( 'Opacity', 'gambol-builder' ) }
					value={ opacity }
					min={ 0 }
					max={ 1 }
					step={ 0.05 }
					onChange={ ( value ) => setAttributes( { opacity: value } ) }
				/>

				<Toggle
					label={ __( 'Enable Overlay', 'gambol-builder' ) }
					checked={ hasOverlay }
					onChange={ ( value ) => setAttributes( { hasOverlay: value } ) }
				/>

				{ hasOverlay && (
					<TextInput
						label={ __( 'Overlay Color', 'gambol-builder' ) }
						value={ overlayColor }
						onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
						placeholder="rgba(0,0,0,0.3)"
					/>
				) }
			</Section>

			<Section title={ __( 'Hover Effect', 'gambol-builder' ) }>
				<Dropdown
					label={ __( 'Effect Type', 'gambol-builder' ) }
					value={ hoverEffect }
					options={ [
						{ value: 'none', label: __( 'None', 'gambol-builder' ) },
						{ value: 'zoom', label: __( 'Zoom', 'gambol-builder' ) },
						{ value: 'brightness', label: __( 'Brighten', 'gambol-builder' ) },
						{ value: 'grayscale', label: __( 'Grayscale', 'gambol-builder' ) },
						{ value: 'blur', label: __( 'Blur', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { hoverEffect: value } ) }
				/>

				{ hoverEffect === 'zoom' && (
					<RangeSlider
						label={ __( 'Zoom Scale', 'gambol-builder' ) }
						value={ hoverScale }
						min={ 1 }
						max={ 1.5 }
						step={ 0.05 }
						onChange={ ( value ) => setAttributes( { hoverScale: value } ) }
					/>
				) }
			</Section>

			<Section title={ __( 'Spacing', 'gambol-builder' ) }>
				<SpacingBox
					label={ __( 'Margin', 'gambol-builder' ) }
					value={ margin }
					onChange={ ( value ) => setAttributes( { margin: value } ) }
				/>
			</Section>
		</>
	);

	// Advanced tab content
	const advancedTab = (
		<>
			<Section title={ __( 'Attributes', 'gambol-builder' ) }>
				<TextInput
					label={ __( 'HTML ID', 'gambol-builder' ) }
					value={ htmlId }
					onChange={ ( value ) => setAttributes( { htmlId: value } ) }
					placeholder="my-image"
				/>
				<TextInput
					label={ __( 'CSS Classes', 'gambol-builder' ) }
					value={ cssClasses }
					onChange={ ( value ) => setAttributes( { cssClasses: value } ) }
					placeholder="class-1 class-2"
				/>
			</Section>

			<Section title={ __( 'Caption', 'gambol-builder' ) }>
				<TextInput
					label={ __( 'Caption Text', 'gambol-builder' ) }
					value={ caption }
					onChange={ ( value ) => setAttributes( { caption: value } ) }
					placeholder={ __( 'Image caption...', 'gambol-builder' ) }
				/>
			</Section>
		</>
	);

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Image', 'gambol-builder' ) }
					blockIcon={ <ImageBlockIcon /> }
					layoutTab={ layoutTab }
					designTab={ designTab }
					advancedTab={ advancedTab }
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ mediaUrl ? (
					<figure className="gambol-image__figure">
						<img
							src={ mediaUrl }
							alt={ alt }
							style={ imageStyles }
							className="gambol-image__img"
						/>
						{ hasOverlay && (
							<div
								className="gambol-image__overlay"
								style={ { backgroundColor: overlayColor } }
							/>
						) }
						{ caption && (
							<RichText
								tagName="figcaption"
								className="gambol-image__caption"
								value={ caption }
								onChange={ ( value ) => setAttributes( { caption: value } ) }
								placeholder={ __( 'Add caption...', 'gambol-builder' ) }
							/>
						) }
					</figure>
				) : (
					<ImagePlaceholder onSelect={ onSelectImage } />
				) }
			</div>
		</>
	);
}
