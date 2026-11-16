/**
 * Section Block - Save Component
 *
 * Writes every design setting the inspector offers (background, overlay,
 * spacing, radius, shadow, height, boxed width, device visibility) using the
 * same builders as the editor preview (styles.js).
 *
 * Markup changed in 1.1: the previous output lives in deprecated.js.
 *
 * @package GambolBuilder
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { getWrapperStyles, getInnerStyles, getOverlayStyles, getClassNames } from './styles';

const isEmpty = ( obj ) => ! obj || Object.keys( obj ).length === 0;

/**
 * Background video element.
 *
 * @param {Object} attributes Block attributes.
 * @return {JSX.Element|null} Video background.
 */
function VideoBackground( { attributes } ) {
	const { backgroundType, backgroundVideoUrl, backgroundVideoType, backgroundVideoLoop } = attributes;

	if ( backgroundType !== 'video' || ! backgroundVideoUrl ) {
		return null;
	}

	const loop = backgroundVideoLoop !== false;

	if ( backgroundVideoType === 'youtube' ) {
		const match = backgroundVideoUrl.match(
			/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
		);
		const id = match ? match[ 1 ] : '';
		if ( ! id ) {
			return null;
		}
		return (
			<div className="gambol-section__video-bg" aria-hidden="true">
				<iframe
					src={ `https://www.youtube-nocookie.com/embed/${ id }?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=${ loop ? 1 : 0 }&playlist=${ id }` }
					allow="autoplay; encrypted-media"
					title="Background video"
					tabIndex="-1"
					loading="lazy"
				/>
			</div>
		);
	}

	if ( backgroundVideoType === 'vimeo' ) {
		const match = backgroundVideoUrl.match( /vimeo\.com\/(\d+)/ );
		const id = match ? match[ 1 ] : '';
		if ( ! id ) {
			return null;
		}
		return (
			<div className="gambol-section__video-bg" aria-hidden="true">
				<iframe
					src={ `https://player.vimeo.com/video/${ id }?autoplay=1&muted=1&background=1&loop=${ loop ? 1 : 0 }` }
					allow="autoplay; fullscreen; picture-in-picture"
					title="Background video"
					tabIndex="-1"
					loading="lazy"
				/>
			</div>
		);
	}

	return (
		<div className="gambol-section__video-bg" aria-hidden="true">
			<video autoPlay muted loop={ loop } playsInline preload="none" data-src={ backgroundVideoUrl } />
		</div>
	);
}

/**
 * Section Save Component.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Save component.
 */
export default function save( { attributes } ) {
	const { tagName, backgroundType, parallaxSpeed, parallaxDirection } = attributes;

	const wrapperStyle = getWrapperStyles( attributes );
	const innerStyle = getInnerStyles( attributes );
	const overlayStyle = getOverlayStyles( attributes );
	const classNames = getClassNames( attributes );

	const parallaxProps =
		backgroundType === 'parallax'
			? {
					'data-parallax': 'true',
					'data-parallax-speed': parallaxSpeed || 0.5,
					'data-parallax-direction': parallaxDirection || 'up',
			  }
			: {};

	const blockProps = useBlockProps.save( {
		className: classNames.length ? classNames.join( ' ' ) : undefined,
		style: isEmpty( wrapperStyle ) ? undefined : wrapperStyle,
		...parallaxProps,
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'wp-block-gambol-section__inner',
		style: isEmpty( innerStyle ) ? undefined : innerStyle,
	} );

	const TagName = tagName || 'section';

	return (
		<TagName { ...blockProps }>
			<VideoBackground attributes={ attributes } />
			{ overlayStyle && (
				<span className="wp-block-gambol-section__overlay" style={ overlayStyle } aria-hidden="true" />
			) }
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
