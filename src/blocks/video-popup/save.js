/**
 * Video Popup Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Get YouTube thumbnail from URL.
 */
const getYouTubeThumbnail = ( url ) => {
	const match = url.match( /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/ );
	return match ? `https://img.youtube.com/vi/${ match[ 1 ] }/maxresdefault.jpg` : '';
};

/**
 * Video Popup Save Component.
 */
export default function save( { attributes } ) {
	const {
		videoUrl,
		videoType,
		thumbnailUrl,
		title,
		playIconSize,
		playIconColor,
		playIconBackground,
		overlayColor,
		aspectRatio,
		autoplay,
	} = attributes;

	if ( ! videoUrl ) {
		return null;
	}

	const displayThumbnail = thumbnailUrl || ( videoType === 'youtube' ? getYouTubeThumbnail( videoUrl ) : '' );

	const blockProps = useBlockProps.save( {
		className: 'wp-block-gambol-video-popup',
		'data-video-url': videoUrl,
		'data-video-type': videoType,
		'data-autoplay': autoplay,
	} );

	return (
		<div { ...blockProps }>
			<button
				className="wp-block-gambol-video-popup__wrapper"
				style={ { aspectRatio } }
				aria-label={ title || 'Play video' }
			>
				{ displayThumbnail && (
					<img
						src={ displayThumbnail }
						alt={ title || 'Video thumbnail' }
						className="wp-block-gambol-video-popup__thumbnail"
						loading="lazy"
					/>
				) }
				
				<div 
					className="wp-block-gambol-video-popup__overlay"
					style={ { backgroundColor: overlayColor } }
				/>
				
				<span
					className="wp-block-gambol-video-popup__play"
					style={ {
						width: `${ playIconSize }px`,
						height: `${ playIconSize }px`,
						backgroundColor: playIconBackground,
						color: playIconColor,
					} }
				>
					<svg viewBox="0 0 24 24" fill="currentColor" width="40%" height="40%">
						<path d="M8 5v14l11-7z" />
					</svg>
				</span>
			</button>

			{/* Lightbox container - hidden by default */}
			<div className="wp-block-gambol-video-popup__lightbox" aria-hidden="true">
				<div className="wp-block-gambol-video-popup__lightbox-overlay"></div>
				<div className="wp-block-gambol-video-popup__lightbox-content">
					<button className="wp-block-gambol-video-popup__lightbox-close" aria-label="Close">
						✕
					</button>
					<div className="wp-block-gambol-video-popup__lightbox-video"></div>
				</div>
			</div>
		</div>
	);
}
