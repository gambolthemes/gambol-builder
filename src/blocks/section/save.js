/**
 * Section Block - Save Component
 *
 * Generates clean, semantic HTML output for the frontend.
 *
 * @package GambolBuilder
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Section Save Component.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Save component.
 */
export default function save( { attributes } ) {
	const {
		contentWidth,
		maxWidth,
		minHeight,
		verticalAlign,
		tagName,
		backgroundType,
		backgroundImage,
		backgroundVideoUrl,
		backgroundVideoType,
		backgroundVideoLoop,
		parallaxEnabled,
		parallaxSpeed,
		parallaxDirection,
	} = attributes;

	// Build wrapper styles - only add what's needed.
	const wrapperStyle = {};
	if ( minHeight ) {
		wrapperStyle.minHeight = minHeight;
	}

	// Static image/parallax background via CSS.
	if ( backgroundType === 'parallax' && backgroundImage?.url ) {
		wrapperStyle.backgroundImage = `url(${ backgroundImage.url })`;
		wrapperStyle.backgroundSize = 'cover';
		wrapperStyle.backgroundPosition = 'center center';
	}

	// Build inner content styles.
	const innerStyle = {};
	if ( contentWidth === 'boxed' && maxWidth ) {
		innerStyle.maxWidth = maxWidth;
	}

	// Build class names - minimal and semantic.
	const classNames = [];
	if ( contentWidth ) {
		classNames.push( `is-content-${ contentWidth }` );
	}
	if ( verticalAlign && verticalAlign !== 'top' ) {
		classNames.push( `is-vertically-aligned-${ verticalAlign }` );
	}
	if ( backgroundType === 'video' ) {
		classNames.push( 'has-video-background' );
	}
	if ( backgroundType === 'parallax' ) {
		classNames.push( 'has-parallax-background' );
	}

	// Parallax data attributes.
	const parallaxProps = backgroundType === 'parallax' ? {
		'data-parallax': 'true',
		'data-parallax-speed': parallaxSpeed || 0.5,
		'data-parallax-direction': parallaxDirection || 'up',
	} : {};

	// Block props with minimal output.
	const blockProps = useBlockProps.save( {
		className: classNames.length > 0 ? classNames.join( ' ' ) : undefined,
		style: Object.keys( wrapperStyle ).length > 0 ? wrapperStyle : undefined,
		...parallaxProps,
	} );

	// Inner blocks with minimal wrapper.
	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'wp-block-gambol-section__inner',
		style: Object.keys( innerStyle ).length > 0 ? innerStyle : undefined,
	} );

	// Dynamic tag - defaults to section for semantic HTML.
	const TagName = tagName || 'section';

	/**
	 * Render video background element based on video type.
	 */
	const renderVideoBackground = () => {
		if ( backgroundType !== 'video' || ! backgroundVideoUrl ) {
			return null;
		}

		const loop = backgroundVideoLoop !== false;

		if ( backgroundVideoType === 'youtube' ) {
			// Extract YouTube video ID.
			const ytMatch = backgroundVideoUrl.match(
				/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
			);
			const ytId = ytMatch ? ytMatch[ 1 ] : '';
			if ( ! ytId ) return null;
			const ytSrc = `https://www.youtube.com/embed/${ ytId }?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=${ loop ? 1 : 0 }&playlist=${ ytId }`;
			return (
				<div className="gambol-section__video-bg" aria-hidden="true">
					<iframe
						src={ ytSrc }
						allow="autoplay; encrypted-media"
						allowFullScreen={ false }
						title=""
					/>
				</div>
			);
		}

		if ( backgroundVideoType === 'vimeo' ) {
			const vmMatch = backgroundVideoUrl.match( /vimeo\.com\/(\d+)/ );
			const vmId = vmMatch ? vmMatch[ 1 ] : '';
			if ( ! vmId ) return null;
			const vmSrc = `https://player.vimeo.com/video/${ vmId }?autoplay=1&muted=1&background=1&loop=${ loop ? 1 : 0 }`;
			return (
				<div className="gambol-section__video-bg" aria-hidden="true">
					<iframe
						src={ vmSrc }
						allow="autoplay; fullscreen; picture-in-picture"
						title=""
					/>
				</div>
			);
		}

		// Self-hosted MP4.
		return (
			<div className="gambol-section__video-bg" aria-hidden="true">
				<video
					autoPlay
					muted
					loop={ loop }
					playsInline
					preload="none"
					data-src={ backgroundVideoUrl }
				/>
			</div>
		);
	};

	return (
		<TagName { ...blockProps }>
			{ renderVideoBackground() }
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
