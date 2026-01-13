/**
 * Video Popup Block - Edit Component
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
	GambolColorPicker,
	RangeSlider,
	TextInput,
} from '../../components/inspector';

/**
 * Get YouTube thumbnail from URL.
 */
const getYouTubeThumbnail = ( url ) => {
	const match = url.match( /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/ );
	return match ? `https://img.youtube.com/vi/${ match[ 1 ] }/maxresdefault.jpg` : '';
};

/**
 * Video Popup Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		videoUrl,
		videoType,
		thumbnailUrl,
		thumbnailId,
		title,
		playIconSize,
		playIconColor,
		playIconBackground,
		overlayColor,
		aspectRatio,
		autoplay,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-video-popup',
	} );

	const onSelectThumbnail = ( media ) => {
		setAttributes( {
			thumbnailUrl: media.url,
			thumbnailId: media.id,
		} );
	};

	const autoGenerateThumbnail = () => {
		if ( videoType === 'youtube' && videoUrl ) {
			const thumbnail = getYouTubeThumbnail( videoUrl );
			if ( thumbnail ) {
				setAttributes( { thumbnailUrl: thumbnail } );
			}
		}
	};

	const displayThumbnail = thumbnailUrl || ( videoType === 'youtube' && videoUrl ? getYouTubeThumbnail( videoUrl ) : '' );

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Video Popup', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM10 8v8l6-4-6-4z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Video Settings', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Video Type', 'gambol-builder' ) }
									value={ videoType }
									onChange={ ( value ) => setAttributes( { videoType: value } ) }
									options={ [
										{ value: 'youtube', label: 'YouTube' },
										{ value: 'vimeo', label: 'Vimeo' },
										{ value: 'self', label: __( 'Self Hosted', 'gambol-builder' ) },
									] }
								/>
								<TextInput
									label={ __( 'Video URL', 'gambol-builder' ) }
									value={ videoUrl }
									onChange={ ( value ) => setAttributes( { videoUrl: value } ) }
									placeholder={ videoType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://...' }
								/>
								<TextInput
									label={ __( 'Title (Accessibility)', 'gambol-builder' ) }
									value={ title }
									onChange={ ( value ) => setAttributes( { title: value } ) }
									placeholder={ __( 'Video title', 'gambol-builder' ) }
								/>
								<Toggle
									label={ __( 'Autoplay on Open', 'gambol-builder' ) }
									checked={ autoplay }
									onChange={ ( value ) => setAttributes( { autoplay: value } ) }
								/>
							</Section>

							<Section title={ __( 'Thumbnail', 'gambol-builder' ) }>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ onSelectThumbnail }
										allowedTypes={ [ 'image' ] }
										value={ thumbnailId }
										render={ ( { open } ) => (
											<Button onClick={ open } variant="secondary" isSmall>
												{ thumbnailUrl ? __( 'Change Thumbnail', 'gambol-builder' ) : __( 'Select Thumbnail', 'gambol-builder' ) }
											</Button>
										) }
									/>
								</MediaUploadCheck>
								{ videoType === 'youtube' && videoUrl && ! thumbnailUrl && (
									<Button onClick={ autoGenerateThumbnail } variant="link" isSmall>
										{ __( 'Use YouTube thumbnail', 'gambol-builder' ) }
									</Button>
								) }
							</Section>

							<Section title={ __( 'Aspect Ratio', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Ratio', 'gambol-builder' ) }
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
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Play Button', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Size (px)', 'gambol-builder' ) }
									value={ playIconSize }
									onChange={ ( value ) => setAttributes( { playIconSize: value } ) }
									min={ 40 }
									max={ 150 }
								/>
								<GambolColorPicker
									label={ __( 'Icon Color', 'gambol-builder' ) }
									value={ playIconColor }
									onChange={ ( value ) => setAttributes( { playIconColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Background Color', 'gambol-builder' ) }
									value={ playIconBackground }
									onChange={ ( value ) => setAttributes( { playIconBackground: value } ) }
								/>
							</Section>

							<Section title={ __( 'Overlay', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Overlay Color', 'gambol-builder' ) }
									value={ overlayColor }
									onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div 
					className="wp-block-gambol-video-popup__wrapper"
					style={ { aspectRatio } }
				>
					{ displayThumbnail ? (
						<img
							src={ displayThumbnail }
							alt={ title || __( 'Video thumbnail', 'gambol-builder' ) }
							className="wp-block-gambol-video-popup__thumbnail"
						/>
					) : (
						<div className="wp-block-gambol-video-popup__placeholder">
							{ __( 'Add video URL or thumbnail', 'gambol-builder' ) }
						</div>
					) }
					
					<div 
						className="wp-block-gambol-video-popup__overlay"
						style={ { backgroundColor: overlayColor } }
					/>
					
					<button
						className="wp-block-gambol-video-popup__play"
						style={ {
							width: `${ playIconSize }px`,
							height: `${ playIconSize }px`,
							backgroundColor: playIconBackground,
							color: playIconColor,
						} }
						aria-label={ __( 'Play video', 'gambol-builder' ) }
					>
						<svg viewBox="0 0 24 24" fill="currentColor" width="40%" height="40%">
							<path d="M8 5v14l11-7z" />
						</svg>
					</button>
				</div>
			</div>
		</>
	);
}
