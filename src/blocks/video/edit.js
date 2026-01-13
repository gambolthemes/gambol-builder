/**
 * Video Block - Edit Component
 *
 * @package GambolBuilder
 */

import { useCallback, useMemo } from '@wordpress/element';
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
 * Video header icon.
 */
const VideoHeaderIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
	</svg>
);

/**
 * Play icon SVG.
 */
const PlayIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
		<path d="M8 5v14l11-7z"/>
	</svg>
);

/**
 * Parse video URL to get ID and type.
 */
const parseVideoUrl = ( url ) => {
	if ( ! url ) return { type: null, id: null };

	// YouTube patterns
	const youtubePatterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/youtube\.com\/watch\?.*v=([^&\n?#]+)/,
	];

	for ( const pattern of youtubePatterns ) {
		const match = url.match( pattern );
		if ( match ) {
			return { type: 'youtube', id: match[ 1 ] };
		}
	}

	// Vimeo pattern
	const vimeoPattern = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
	const vimeoMatch = url.match( vimeoPattern );
	if ( vimeoMatch ) {
		return { type: 'vimeo', id: vimeoMatch[ 1 ] };
	}

	return { type: 'unknown', id: null };
};

/**
 * Video Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		videoType,
		videoUrl,
		videoId,
		selfHostedUrl,
		aspectRatio,
		posterImage,
		showPlayIcon,
		playIconSize,
		playIconColor,
		playIconBgColor,
		autoplay,
		muted,
		loop,
		controls,
		openInLightbox,
		showOverlay,
		overlayColor,
		borderRadius,
		boxShadow,
		htmlId,
		cssClasses,
	} = attributes;

	// Handle URL change
	const handleUrlChange = useCallback( ( url ) => {
		setAttributes( { videoUrl: url } );
		const parsed = parseVideoUrl( url );
		if ( parsed.type && parsed.id ) {
			setAttributes( {
				videoType: parsed.type,
				videoId: parsed.id,
			} );
		}
	}, [ setAttributes ] );

	// Get embed URL for preview
	const embedUrl = useMemo( () => {
		if ( videoType === 'youtube' && videoId ) {
			const params = new URLSearchParams( {
				autoplay: autoplay ? '1' : '0',
				mute: muted ? '1' : '0',
				loop: loop ? '1' : '0',
				controls: controls ? '1' : '0',
			} );
			return `https://www.youtube.com/embed/${ videoId }?${ params }`;
		}
		if ( videoType === 'vimeo' && videoId ) {
			const params = new URLSearchParams( {
				autoplay: autoplay ? '1' : '0',
				muted: muted ? '1' : '0',
				loop: loop ? '1' : '0',
			} );
			return `https://player.vimeo.com/video/${ videoId }?${ params }`;
		}
		return null;
	}, [ videoType, videoId, autoplay, muted, loop, controls ] );

	// Calculate padding for aspect ratio
	const getAspectRatioPadding = () => {
		switch ( aspectRatio ) {
			case '16:9': return '56.25%';
			case '4:3': return '75%';
			case '21:9': return '42.86%';
			case '1:1': return '100%';
			case '9:16': return '177.78%';
			default: return '56.25%';
		}
	};

	// Build CSS custom properties
	const cssVars = {
		'--gambol-video-aspect': getAspectRatioPadding(),
		'--gambol-video-radius': borderRadius,
		'--gambol-video-shadow': boxShadow,
		'--gambol-video-overlay': overlayColor,
		'--gambol-video-play-size': `${ playIconSize }px`,
		'--gambol-video-play-color': playIconColor,
		'--gambol-video-play-bg': playIconBgColor,
	};

	// Build class names
	const className = [
		'gambol-video',
		showOverlay && 'gambol-video--has-overlay',
		openInLightbox && 'gambol-video--lightbox',
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
			<Section title={ __( 'Video Source', 'gambol-builder' ) }>
				<ButtonGroup
					label={ __( 'Source Type', 'gambol-builder' ) }
					value={ videoType }
					options={ [
						{ value: 'youtube', label: 'YouTube' },
						{ value: 'vimeo', label: 'Vimeo' },
						{ value: 'self', label: __( 'Self Hosted', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { videoType: value } ) }
				/>

				{ ( videoType === 'youtube' || videoType === 'vimeo' ) && (
					<TextInput
						label={ __( 'Video URL', 'gambol-builder' ) }
						value={ videoUrl }
						onChange={ handleUrlChange }
						placeholder={ videoType === 'youtube' 
							? 'https://www.youtube.com/watch?v=...' 
							: 'https://vimeo.com/...' 
						}
					/>
				) }

				{ videoType === 'self' && (
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { selfHostedUrl: media.url } ) }
							allowedTypes={ [ 'video' ] }
							render={ ( { open } ) => (
								<div className="gambol-media-upload">
									{ selfHostedUrl ? (
										<div className="gambol-media-preview">
											<video src={ selfHostedUrl } muted />
											<button type="button" onClick={ () => setAttributes( { selfHostedUrl: '' } ) }>
												×
											</button>
										</div>
									) : (
										<Button variant="secondary" onClick={ open }>
											{ __( 'Select Video', 'gambol-builder' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				) }
			</Section>

			<Section title={ __( 'Display', 'gambol-builder' ) }>
				<Dropdown
					label={ __( 'Aspect Ratio', 'gambol-builder' ) }
					value={ aspectRatio }
					options={ [
						{ value: '16:9', label: '16:9 (Widescreen)' },
						{ value: '4:3', label: '4:3 (Standard)' },
						{ value: '21:9', label: '21:9 (Cinematic)' },
						{ value: '1:1', label: '1:1 (Square)' },
						{ value: '9:16', label: '9:16 (Vertical)' },
					] }
					onChange={ ( value ) => setAttributes( { aspectRatio: value } ) }
				/>

				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) => setAttributes( { posterImage: media.url } ) }
						allowedTypes={ [ 'image' ] }
						render={ ( { open } ) => (
							<div className="gambol-control">
								<label className="gambol-control__label">
									{ __( 'Poster Image', 'gambol-builder' ) }
								</label>
								{ posterImage ? (
									<div className="gambol-media-preview">
										<img src={ posterImage } alt="" />
										<button type="button" onClick={ () => setAttributes( { posterImage: '' } ) }>
											×
										</button>
									</div>
								) : (
									<Button variant="secondary" onClick={ open } className="gambol-btn--full">
										{ __( 'Select Poster', 'gambol-builder' ) }
									</Button>
								) }
							</div>
						) }
					/>
				</MediaUploadCheck>
			</Section>

			<Section title={ __( 'Play Icon', 'gambol-builder' ) }>
				<Toggle
					label={ __( 'Show Play Icon', 'gambol-builder' ) }
					checked={ showPlayIcon }
					onChange={ ( value ) => setAttributes( { showPlayIcon: value } ) }
				/>
				{ showPlayIcon && (
					<>
						<RangeSlider
							label={ __( 'Icon Size', 'gambol-builder' ) }
							value={ playIconSize }
							min={ 40 }
							max={ 150 }
							step={ 5 }
							onChange={ ( value ) => setAttributes( { playIconSize: value } ) }
						/>
						<GambolColorPicker
							label={ __( 'Icon Color', 'gambol-builder' ) }
							value={ playIconColor }
							onChange={ ( value ) => setAttributes( { playIconColor: value } ) }
						/>
						<GambolColorPicker
							label={ __( 'Background Color', 'gambol-builder' ) }
							value={ playIconBgColor }
							onChange={ ( value ) => setAttributes( { playIconBgColor: value } ) }
						/>
					</>
				) }
			</Section>

			<Section title={ __( 'Playback', 'gambol-builder' ) }>
				<Toggle
					label={ __( 'Autoplay', 'gambol-builder' ) }
					checked={ autoplay }
					onChange={ ( value ) => setAttributes( { autoplay: value } ) }
				/>
				<Toggle
					label={ __( 'Muted', 'gambol-builder' ) }
					checked={ muted }
					onChange={ ( value ) => setAttributes( { muted: value } ) }
				/>
				<Toggle
					label={ __( 'Loop', 'gambol-builder' ) }
					checked={ loop }
					onChange={ ( value ) => setAttributes( { loop: value } ) }
				/>
				<Toggle
					label={ __( 'Show Controls', 'gambol-builder' ) }
					checked={ controls }
					onChange={ ( value ) => setAttributes( { controls: value } ) }
				/>
				<Toggle
					label={ __( 'Open in Lightbox', 'gambol-builder' ) }
					checked={ openInLightbox }
					onChange={ ( value ) => setAttributes( { openInLightbox: value } ) }
				/>
			</Section>
		</>
	);

	// Design tab content
	const designTab = (
		<>
			<Section title={ __( 'Overlay', 'gambol-builder' ) }>
				<Toggle
					label={ __( 'Show Overlay', 'gambol-builder' ) }
					checked={ showOverlay }
					onChange={ ( value ) => setAttributes( { showOverlay: value } ) }
				/>
				{ showOverlay && (
					<GambolColorPicker
						label={ __( 'Overlay Color', 'gambol-builder' ) }
						value={ overlayColor }
						onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
					/>
				) }
			</Section>

			<Section title={ __( 'Border', 'gambol-builder' ) }>
				<TextInput
					label={ __( 'Border Radius', 'gambol-builder' ) }
					value={ borderRadius }
					onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
				/>
				<Dropdown
					label={ __( 'Box Shadow', 'gambol-builder' ) }
					value={ boxShadow }
					options={ [
						{ value: 'none', label: __( 'None', 'gambol-builder' ) },
						{ value: '0 2px 8px rgba(0,0,0,0.1)', label: __( 'Small', 'gambol-builder' ) },
						{ value: '0 4px 16px rgba(0,0,0,0.12)', label: __( 'Medium', 'gambol-builder' ) },
						{ value: '0 8px 30px rgba(0,0,0,0.15)', label: __( 'Large', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { boxShadow: value } ) }
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
				placeholder="my-video"
			/>
			<TextInput
				label={ __( 'CSS Classes', 'gambol-builder' ) }
				value={ cssClasses }
				onChange={ ( value ) => setAttributes( { cssClasses: value } ) }
				placeholder="class-1 class-2"
			/>
		</Section>
	);

	// Check if we have a valid video
	const hasVideo = ( videoType === 'youtube' || videoType === 'vimeo' ) && videoId
		|| videoType === 'self' && selfHostedUrl;

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Video', 'gambol-builder' ) }
					blockIcon={ <VideoHeaderIcon /> }
					layoutTab={ layoutTab }
					designTab={ designTab }
					advancedTab={ advancedTab }
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="gambol-video__wrapper">
					{ hasVideo ? (
						<>
							{ ( videoType === 'youtube' || videoType === 'vimeo' ) && (
								<iframe
									src={ embedUrl }
									title={ __( 'Video', 'gambol-builder' ) }
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							) }
							{ videoType === 'self' && selfHostedUrl && (
								<video
									src={ selfHostedUrl }
									controls={ controls }
									muted={ muted }
									loop={ loop }
									autoPlay={ autoplay }
									poster={ posterImage }
								/>
							) }
							{ showOverlay && <div className="gambol-video__overlay" /> }
							{ showPlayIcon && (
								<div className="gambol-video__play">
									<PlayIcon />
								</div>
							) }
						</>
					) : (
						<div className="gambol-video__placeholder">
							<VideoHeaderIcon />
							<p>{ __( 'Enter a video URL or select a video file', 'gambol-builder' ) }</p>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
