/**
 * Image Carousel Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	RangeSlider,
} from '../../components/inspector';

/**
 * Image Carousel Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		images,
		slidesToShow,
		slidesToScroll,
		autoplay,
		autoplaySpeed,
		infinite,
		dots,
		arrows,
		pauseOnHover,
		gap,
		aspectRatio,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-image-carousel',
	} );

	const onSelectImages = ( media ) => {
		const newImages = media.map( ( image ) => ( {
			id: image.id,
			url: image.url,
			alt: image.alt || '',
			caption: image.caption || '',
		} ) );
		setAttributes( { images: newImages } );
	};

	const removeImage = ( index ) => {
		const newImages = [ ...images ];
		newImages.splice( index, 1 );
		setAttributes( { images: newImages } );
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Image Carousel', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M2 6h4v12H2V6zm5 0h10v12H7V6zm11 0h4v12h-4V6z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Carousel Settings', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Slides to Show', 'gambol-builder' ) }
									value={ slidesToShow }
									onChange={ ( value ) => setAttributes( { slidesToShow: value } ) }
									min={ 1 }
									max={ 6 }
								/>
								<RangeSlider
									label={ __( 'Slides to Scroll', 'gambol-builder' ) }
									value={ slidesToScroll }
									onChange={ ( value ) => setAttributes( { slidesToScroll: value } ) }
									min={ 1 }
									max={ slidesToShow }
								/>
								<RangeSlider
									label={ __( 'Gap (px)', 'gambol-builder' ) }
									value={ gap }
									onChange={ ( value ) => setAttributes( { gap: value } ) }
									min={ 0 }
									max={ 50 }
								/>
								<ButtonGroup
									label={ __( 'Aspect Ratio', 'gambol-builder' ) }
									value={ aspectRatio }
									onChange={ ( value ) => setAttributes( { aspectRatio: value } ) }
									options={ [
										{ value: '1/1', label: '1:1' },
										{ value: '4/3', label: '4:3' },
										{ value: '16/9', label: '16:9' },
										{ value: '21/9', label: '21:9' },
									] }
								/>
							</Section>

							<Section title={ __( 'Navigation', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Arrows', 'gambol-builder' ) }
									checked={ arrows }
									onChange={ ( value ) => setAttributes( { arrows: value } ) }
								/>
								<Toggle
									label={ __( 'Show Dots', 'gambol-builder' ) }
									checked={ dots }
									onChange={ ( value ) => setAttributes( { dots: value } ) }
								/>
								<Toggle
									label={ __( 'Infinite Loop', 'gambol-builder' ) }
									checked={ infinite }
									onChange={ ( value ) => setAttributes( { infinite: value } ) }
								/>
							</Section>

							<Section title={ __( 'Autoplay', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Autoplay', 'gambol-builder' ) }
									checked={ autoplay }
									onChange={ ( value ) => setAttributes( { autoplay: value } ) }
								/>
								{ autoplay && (
									<>
										<RangeSlider
											label={ __( 'Autoplay Speed (ms)', 'gambol-builder' ) }
											value={ autoplaySpeed }
											onChange={ ( value ) => setAttributes( { autoplaySpeed: value } ) }
											min={ 1000 }
											max={ 10000 }
											step={ 500 }
										/>
										<Toggle
											label={ __( 'Pause on Hover', 'gambol-builder' ) }
											checked={ pauseOnHover }
											onChange={ ( value ) => setAttributes( { pauseOnHover: value } ) }
										/>
									</>
								) }
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ images.length === 0 ? (
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImages }
							allowedTypes={ [ 'image' ] }
							multiple
							gallery
							render={ ( { open } ) => (
								<Button
									onClick={ open }
									variant="secondary"
									className="wp-block-gambol-image-carousel__upload"
								>
									{ __( 'Select Images', 'gambol-builder' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
				) : (
					<>
						<div 
							className="wp-block-gambol-image-carousel__track"
							style={ {
								display: 'flex',
								gap: `${ gap }px`,
							} }
						>
							{ images.slice( 0, slidesToShow ).map( ( image, index ) => (
								<div 
									key={ image.id || index }
									className="wp-block-gambol-image-carousel__slide"
									style={ {
										flex: `0 0 calc(${ 100 / slidesToShow }% - ${ gap * ( slidesToShow - 1 ) / slidesToShow }px)`,
										aspectRatio,
									} }
								>
									<img src={ image.url } alt={ image.alt } />
									<Button
										onClick={ () => removeImage( index ) }
										isDestructive
										isSmall
										className="wp-block-gambol-image-carousel__remove"
									>
										✕
									</Button>
								</div>
							) ) }
						</div>
						<div className="wp-block-gambol-image-carousel__controls">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ onSelectImages }
									allowedTypes={ [ 'image' ] }
									multiple
									gallery
									value={ images.map( ( img ) => img.id ) }
									render={ ( { open } ) => (
										<Button onClick={ open } variant="secondary" isSmall>
											{ __( 'Edit Gallery', 'gambol-builder' ) } ({ images.length } { __( 'images', 'gambol-builder' ) })
										</Button>
									) }
								/>
							</MediaUploadCheck>
						</div>
					</>
				) }
			</div>
		</>
	);
}
