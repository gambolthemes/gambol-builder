/**
 * Video Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Video Save Component.
 */
export default function save( { attributes } ) {
	const {
		videoType,
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

	const blockProps = useBlockProps.save( {
		className,
		style: cssVars,
		id: htmlId || undefined,
	} );

	// Generate embed URL
	const getEmbedUrl = () => {
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
	};

	const embedUrl = getEmbedUrl();

	return (
		<div { ...blockProps } data-video-type={ videoType } data-video-id={ videoId || '' }>
			<div className="gambol-video__wrapper">
				{ posterImage && openInLightbox ? (
					// Lightbox mode - show poster with play button
					<button
						type="button"
						className="gambol-video__trigger"
						data-video-url={ embedUrl || selfHostedUrl }
						aria-label="Play video"
					>
						<img src={ posterImage } alt="" className="gambol-video__poster" />
						{ showPlayIcon && (
							<span className="gambol-video__play">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
									<path d="M8 5v14l11-7z"/>
								</svg>
							</span>
						) }
						{ showOverlay && <span className="gambol-video__overlay" /> }
					</button>
				) : (
					// Inline mode
					<>
						{ ( videoType === 'youtube' || videoType === 'vimeo' ) && embedUrl && (
							<iframe
								src={ embedUrl }
								title="Video"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								loading="lazy"
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
								playsInline
							/>
						) }
					</>
				) }
			</div>
		</div>
	);
}
