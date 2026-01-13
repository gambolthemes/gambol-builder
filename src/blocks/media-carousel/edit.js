/**
 * Media Carousel Block - Edit Component
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
 * Media Carousel Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		items,
		slidesToShow,
		autoplay,
		autoplaySpeed,
		infinite,
		dots,
		arrows,
		thumbnails,
		aspectRatio,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-media-carousel',
	} );

	const onSelectMedia = ( media ) => {
		const newItems = media.map( ( item ) => ( {
			id: item.id,
			url: item.url,
			type: item.type, // 'image' or 'video'
			alt: item.alt || '',
			caption: item.caption || '',
			thumbnail: item.type === 'video' ? item.image?.src : item.url,
		} ) );
		setAttributes( { items: newItems } );
	};

	const removeItem = ( index ) => {
		const newItems = [ ...items ];
		newItems.splice( index, 1 );
		setAttributes( { items: newItems } );
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Media Carousel', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M4 6h4v12H4V6zm6 0h4v12h-4V6zm6 0h4v12h-4V6zM10 10l4 2-4 2v-4z"/>
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
									max={ 4 }
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
									label={ __( 'Show Thumbnails', 'gambol-builder' ) }
									checked={ thumbnails }
									onChange={ ( value ) => setAttributes( { thumbnails: value } ) }
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
									<RangeSlider
										label={ __( 'Autoplay Speed (ms)', 'gambol-builder' ) }
										value={ autoplaySpeed }
										onChange={ ( value ) => setAttributes( { autoplaySpeed: value } ) }
										min={ 1000 }
										max={ 10000 }
										step={ 500 }
									/>
								) }
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ items.length === 0 ? (
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectMedia }
							allowedTypes={ [ 'image', 'video' ] }
							multiple
							gallery
							render={ ( { open } ) => (
								<Button
									onClick={ open }
									variant="secondary"
									className="wp-block-gambol-media-carousel__upload"
								>
									{ __( 'Select Media', 'gambol-builder' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
				) : (
					<>
						<div className="wp-block-gambol-media-carousel__track">
							{ items.slice( 0, slidesToShow ).map( ( item, index ) => (
								<div 
									key={ item.id || index }
									className="wp-block-gambol-media-carousel__slide"
									style={ { aspectRatio } }
								>
									{ item.type === 'video' ? (
										<video src={ item.url } poster={ item.thumbnail } controls />
									) : (
										<img src={ item.url } alt={ item.alt } />
									) }
									<span className="wp-block-gambol-media-carousel__type">
										{ item.type === 'video' ? '▶' : '🖼' }
									</span>
									<Button
										onClick={ () => removeItem( index ) }
										isDestructive
										isSmall
										className="wp-block-gambol-media-carousel__remove"
									>
										✕
									</Button>
								</div>
							) ) }
						</div>
						<div className="wp-block-gambol-media-carousel__controls">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ onSelectMedia }
									allowedTypes={ [ 'image', 'video' ] }
									multiple
									gallery
									value={ items.map( ( item ) => item.id ) }
									render={ ( { open } ) => (
										<Button onClick={ open } variant="secondary" isSmall>
											{ __( 'Edit Media', 'gambol-builder' ) } ({ items.length } { __( 'items', 'gambol-builder' ) })
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
