/**
 * Gallery Block - Edit Component
 *
 * @package GambolBuilder
 */

import { useCallback } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	RangeSlider,
	Dropdown,
	Toggle,
	TextInput,
	GambolColorPicker,
} from '../../components/inspector';

/**
 * Gallery header icon.
 */
const GalleryHeaderIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
	</svg>
);

/**
 * Gallery Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		images,
		layout,
		columns,
		columnsTablet,
		columnsMobile,
		gap,
		masonryGutter,
		aspectRatio,
		objectFit,
		borderRadius,
		hoverEffect,
		hoverOverlay,
		overlayColor,
		showCaption,
		captionPosition,
		enableLightbox,
		htmlId,
		cssClasses,
	} = attributes;

	// Handle image selection
	const onSelectImages = useCallback( ( media ) => {
		const newImages = media.map( ( img ) => ( {
			id: img.id,
			url: img.url,
			alt: img.alt || '',
			caption: img.caption || '',
		} ) );
		setAttributes( { images: newImages } );
	}, [ setAttributes ] );

	// Remove image
	const removeImage = useCallback( ( index ) => {
		const newImages = [ ...images ];
		newImages.splice( index, 1 );
		setAttributes( { images: newImages } );
	}, [ images, setAttributes ] );

	// Move image
	const moveImage = useCallback( ( index, direction ) => {
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if ( newIndex < 0 || newIndex >= images.length ) return;
		
		const newImages = [ ...images ];
		[ newImages[ index ], newImages[ newIndex ] ] = [ newImages[ newIndex ], newImages[ index ] ];
		setAttributes( { images: newImages } );
	}, [ images, setAttributes ] );

	// Get aspect ratio padding
	const getAspectRatioPadding = () => {
		switch ( aspectRatio ) {
			case '1:1': return '100%';
			case '4:3': return '75%';
			case '16:9': return '56.25%';
			case '3:2': return '66.67%';
			default: return 'auto';
		}
	};

	// Build CSS custom properties
	const cssVars = {
		'--gambol-gallery-columns': columns,
		'--gambol-gallery-columns-tablet': columnsTablet,
		'--gambol-gallery-columns-mobile': columnsMobile,
		'--gambol-gallery-gap': `${ gap }px`,
		'--gambol-gallery-radius': borderRadius,
		'--gambol-gallery-overlay': overlayColor,
		'--gambol-gallery-aspect': getAspectRatioPadding(),
		'--gambol-gallery-fit': objectFit,
	};

	// Build class names
	const className = [
		'gambol-gallery',
		`gambol-gallery--${ layout }`,
		`gambol-gallery--hover-${ hoverEffect }`,
		hoverOverlay && 'gambol-gallery--has-overlay',
		enableLightbox && 'gambol-gallery--lightbox',
		showCaption && `gambol-gallery--caption-${ captionPosition }`,
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps( {
		className,
		style: cssVars,
		id: htmlId || undefined,
	} );

	// Layout tab content
	const layoutTab = (
		<>
			<Section title={ __( 'Images', 'gambol-builder' ) }>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelectImages }
						allowedTypes={ [ 'image' ] }
						multiple
						gallery
						value={ images.map( ( img ) => img.id ) }
						render={ ( { open } ) => (
							<div className="gambol-gallery-selector">
								{ images.length > 0 ? (
									<>
										<div className="gambol-gallery-preview">
											{ images.map( ( img, index ) => (
												<div key={ img.id } className="gambol-gallery-preview-item">
													<img src={ img.url } alt={ img.alt } />
													<div className="gambol-gallery-preview-actions">
														<button
															type="button"
															onClick={ () => moveImage( index, 'up' ) }
															disabled={ index === 0 }
														>
															←
														</button>
														<button
															type="button"
															onClick={ () => moveImage( index, 'down' ) }
															disabled={ index === images.length - 1 }
														>
															→
														</button>
														<button
															type="button"
															onClick={ () => removeImage( index ) }
															className="gambol-gallery-remove"
														>
															×
														</button>
													</div>
												</div>
											) ) }
										</div>
										<Button
											variant="secondary"
											onClick={ open }
											className="gambol-btn--full"
										>
											{ __( 'Edit Gallery', 'gambol-builder' ) }
										</Button>
									</>
								) : (
									<Button
										variant="secondary"
										onClick={ open }
										className="gambol-btn--full"
									>
										{ __( 'Select Images', 'gambol-builder' ) }
									</Button>
								) }
							</div>
						) }
					/>
				</MediaUploadCheck>
			</Section>

			<Section title={ __( 'Layout', 'gambol-builder' ) }>
				<ButtonGroup
					label={ __( 'Layout Type', 'gambol-builder' ) }
					value={ layout }
					options={ [
						{ value: 'grid', label: __( 'Grid', 'gambol-builder' ) },
						{ value: 'masonry', label: __( 'Masonry', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { layout: value } ) }
				/>

				<RangeSlider
					label={ __( 'Columns (Desktop)', 'gambol-builder' ) }
					value={ columns }
					min={ 1 }
					max={ 6 }
					step={ 1 }
					onChange={ ( value ) => setAttributes( { columns: value } ) }
				/>
				<RangeSlider
					label={ __( 'Columns (Tablet)', 'gambol-builder' ) }
					value={ columnsTablet }
					min={ 1 }
					max={ 4 }
					step={ 1 }
					onChange={ ( value ) => setAttributes( { columnsTablet: value } ) }
				/>
				<RangeSlider
					label={ __( 'Columns (Mobile)', 'gambol-builder' ) }
					value={ columnsMobile }
					min={ 1 }
					max={ 3 }
					step={ 1 }
					onChange={ ( value ) => setAttributes( { columnsMobile: value } ) }
				/>
				<RangeSlider
					label={ __( 'Gap', 'gambol-builder' ) }
					value={ gap }
					min={ 0 }
					max={ 50 }
					step={ 2 }
					onChange={ ( value ) => setAttributes( { gap: value } ) }
				/>
			</Section>

			<Section title={ __( 'Image Display', 'gambol-builder' ) }>
				{ layout === 'grid' && (
					<Dropdown
						label={ __( 'Aspect Ratio', 'gambol-builder' ) }
						value={ aspectRatio }
						options={ [
							{ value: 'auto', label: __( 'Original', 'gambol-builder' ) },
							{ value: '1:1', label: '1:1 (Square)' },
							{ value: '4:3', label: '4:3' },
							{ value: '16:9', label: '16:9' },
							{ value: '3:2', label: '3:2' },
						] }
						onChange={ ( value ) => setAttributes( { aspectRatio: value } ) }
					/>
				) }
				<Dropdown
					label={ __( 'Object Fit', 'gambol-builder' ) }
					value={ objectFit }
					options={ [
						{ value: 'cover', label: __( 'Cover', 'gambol-builder' ) },
						{ value: 'contain', label: __( 'Contain', 'gambol-builder' ) },
						{ value: 'fill', label: __( 'Fill', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { objectFit: value } ) }
				/>
				<TextInput
					label={ __( 'Border Radius', 'gambol-builder' ) }
					value={ borderRadius }
					onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
				/>
			</Section>
		</>
	);

	// Design tab content
	const designTab = (
		<>
			<Section title={ __( 'Hover Effects', 'gambol-builder' ) }>
				<Dropdown
					label={ __( 'Hover Effect', 'gambol-builder' ) }
					value={ hoverEffect }
					options={ [
						{ value: 'none', label: __( 'None', 'gambol-builder' ) },
						{ value: 'zoom', label: __( 'Zoom', 'gambol-builder' ) },
						{ value: 'lift', label: __( 'Lift', 'gambol-builder' ) },
						{ value: 'brightness', label: __( 'Brightness', 'gambol-builder' ) },
						{ value: 'grayscale', label: __( 'Grayscale', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { hoverEffect: value } ) }
				/>
				<Toggle
					label={ __( 'Show Overlay on Hover', 'gambol-builder' ) }
					checked={ hoverOverlay }
					onChange={ ( value ) => setAttributes( { hoverOverlay: value } ) }
				/>
				{ hoverOverlay && (
					<GambolColorPicker
						label={ __( 'Overlay Color', 'gambol-builder' ) }
						value={ overlayColor }
						onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
					/>
				) }
			</Section>

			<Section title={ __( 'Captions', 'gambol-builder' ) }>
				<Toggle
					label={ __( 'Show Captions', 'gambol-builder' ) }
					checked={ showCaption }
					onChange={ ( value ) => setAttributes( { showCaption: value } ) }
				/>
				{ showCaption && (
					<ButtonGroup
						label={ __( 'Caption Position', 'gambol-builder' ) }
						value={ captionPosition }
						options={ [
							{ value: 'overlay', label: __( 'Overlay', 'gambol-builder' ) },
							{ value: 'below', label: __( 'Below', 'gambol-builder' ) },
						] }
						onChange={ ( value ) => setAttributes( { captionPosition: value } ) }
					/>
				) }
			</Section>

			<Section title={ __( 'Lightbox', 'gambol-builder' ) }>
				<Toggle
					label={ __( 'Enable Lightbox', 'gambol-builder' ) }
					checked={ enableLightbox }
					onChange={ ( value ) => setAttributes( { enableLightbox: value } ) }
				/>
			</Section>
		</>
	);

	// Advanced tab content
	const advancedTab = (
		<Section title={ __( 'Attributes', 'gambol-builder' ) }>
			<TextInput
				label={ __( 'HTML ID', 'gambol-builder' ) }
				value={ htmlId }
				onChange={ ( value ) => setAttributes( { htmlId: value } ) }
				placeholder="my-gallery"
			/>
			<TextInput
				label={ __( 'CSS Classes', 'gambol-builder' ) }
				value={ cssClasses }
				onChange={ ( value ) => setAttributes( { cssClasses: value } ) }
				placeholder="class-1 class-2"
			/>
		</Section>
	);

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Gallery', 'gambol-builder' ) }
					blockIcon={ <GalleryHeaderIcon /> }
					layoutTab={ layoutTab }
					designTab={ designTab }
					advancedTab={ advancedTab }
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ images.length > 0 ? (
					<div className="gambol-gallery__grid">
						{ images.map( ( image ) => (
							<figure key={ image.id } className="gambol-gallery__item">
								<div className="gambol-gallery__image-wrapper">
									<img
										src={ image.url }
										alt={ image.alt }
										className="gambol-gallery__image"
									/>
									{ hoverOverlay && <div className="gambol-gallery__overlay" /> }
									{ enableLightbox && (
										<div className="gambol-gallery__zoom">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
												<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2V7z"/>
											</svg>
										</div>
									) }
								</div>
								{ showCaption && image.caption && (
									<figcaption className="gambol-gallery__caption">
										{ image.caption }
									</figcaption>
								) }
							</figure>
						) ) }
					</div>
				) : (
					<div className="gambol-gallery__placeholder">
						<GalleryHeaderIcon />
						<p>{ __( 'Select images to create a gallery', 'gambol-builder' ) }</p>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectImages }
								allowedTypes={ [ 'image' ] }
								multiple
								gallery
								render={ ( { open } ) => (
									<Button variant="primary" onClick={ open }>
										{ __( 'Select Images', 'gambol-builder' ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
					</div>
				) }
			</div>
		</>
	);
}
