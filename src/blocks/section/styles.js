/**
 * Section Block - shared style builders.
 *
 * Used by both edit.js (live preview) and save.js (frontend markup) so the
 * editor and the published page can never disagree.
 *
 * @package GambolBuilder
 */

export const BOX_SHADOW_VALUES = {
	none: 'none',
	soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
	medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
	strong: '0 8px 32px rgba(0, 0, 0, 0.18)',
};

const px = ( value ) => `${ value }px`;

/**
 * Outer element styles.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} React style object.
 */
export function getWrapperStyles( attributes ) {
	const {
		minHeight,
		minHeightUnit,
		verticalAlign,
		backgroundType,
		backgroundColor,
		backgroundGradient,
		backgroundImage,
		backgroundPosition,
		backgroundSize,
		backgroundRepeat,
		borderRadius,
		boxShadow,
		margin,
		padding,
		zIndex,
	} = attributes;

	const styles = {};

	if ( minHeight && minHeight > 0 ) {
		styles.minHeight = `${ minHeight }${ minHeightUnit || 'px' }`;
	}

	if ( ( minHeight && minHeight > 0 ) || ( verticalAlign && verticalAlign !== 'top' ) ) {
		styles.display = 'flex';
		styles.flexDirection = 'column';
		if ( verticalAlign === 'center' ) {
			styles.justifyContent = 'center';
		} else if ( verticalAlign === 'bottom' ) {
			styles.justifyContent = 'flex-end';
		} else if ( verticalAlign === 'stretch' ) {
			styles.alignItems = 'stretch';
		} else {
			styles.justifyContent = 'flex-start';
		}
	}

	switch ( backgroundType ) {
		case 'color':
			if ( backgroundColor ) {
				styles.backgroundColor = backgroundColor;
			}
			break;
		case 'gradient':
			if ( backgroundGradient ) {
				styles.background = backgroundGradient;
			}
			break;
		case 'image':
		case 'parallax':
			if ( backgroundImage?.url ) {
				styles.backgroundImage = `url(${ backgroundImage.url })`;
				styles.backgroundPosition = backgroundPosition || 'center center';
				styles.backgroundSize = backgroundSize || 'cover';
				styles.backgroundRepeat = backgroundRepeat || 'no-repeat';
			}
			break;
	}

	if ( borderRadius > 0 ) {
		styles.borderRadius = px( borderRadius );
	}

	if ( boxShadow && boxShadow !== 'none' && BOX_SHADOW_VALUES[ boxShadow ] ) {
		styles.boxShadow = BOX_SHADOW_VALUES[ boxShadow ];
	}

	if ( margin ) {
		if ( margin.top ) {
			styles.marginTop = px( margin.top );
		}
		if ( margin.right ) {
			styles.marginRight = px( margin.right );
		}
		if ( margin.bottom ) {
			styles.marginBottom = px( margin.bottom );
		}
		if ( margin.left ) {
			styles.marginLeft = px( margin.left );
		}
	}

	if ( padding ) {
		styles.paddingTop = px( padding.top || 0 );
		styles.paddingRight = px( padding.right || 0 );
		styles.paddingBottom = px( padding.bottom || 0 );
		styles.paddingLeft = px( padding.left || 0 );
	}

	if ( zIndex ) {
		styles.zIndex = zIndex;
	}

	return styles;
}

/**
 * Inner (content) element styles.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} React style object.
 */
export function getInnerStyles( attributes ) {
	const { layoutWidth, maxWidth, maxWidthUnit, contentGap } = attributes;
	const styles = {};

	if ( layoutWidth === 'boxed' && maxWidth ) {
		styles.maxWidth = `${ maxWidth }${ maxWidthUnit || 'px' }`;
		styles.marginLeft = 'auto';
		styles.marginRight = 'auto';
		styles.width = '100%';
	}

	if ( contentGap > 0 ) {
		styles.display = 'flex';
		styles.flexDirection = 'column';
		styles.gap = px( contentGap );
	}

	return styles;
}

/**
 * Overlay styles, or null when there is no overlay.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object|null} React style object.
 */
export function getOverlayStyles( attributes ) {
	const { overlayEnabled, backgroundType, overlayColor, overlayOpacity, borderRadius } = attributes;

	if ( ! overlayEnabled || ! backgroundType || backgroundType === 'none' ) {
		return null;
	}

	const opacity = typeof overlayOpacity === 'number' ? overlayOpacity : 50;

	return {
		backgroundColor: overlayColor || '#000000',
		opacity: opacity / 100,
		borderRadius: borderRadius > 0 ? px( borderRadius ) : undefined,
	};
}

/**
 * Class names (besides the block's own wp-block-gambol-section).
 *
 * @param {Object} attributes Block attributes.
 * @return {string[]} Class names.
 */
export function getClassNames( attributes ) {
	const {
		layoutWidth,
		verticalAlign,
		backgroundType,
		cssClasses,
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
		overlayEnabled,
	} = attributes;

	const classNames = [];

	if ( layoutWidth ) {
		classNames.push( `is-layout-${ layoutWidth }` );
	}
	if ( verticalAlign && verticalAlign !== 'top' ) {
		classNames.push( `is-valign-${ verticalAlign }` );
	}
	if ( backgroundType === 'video' ) {
		classNames.push( 'has-video-background' );
	}
	if ( backgroundType === 'parallax' ) {
		classNames.push( 'has-parallax-background' );
	}
	if ( overlayEnabled && backgroundType && backgroundType !== 'none' ) {
		classNames.push( 'has-overlay' );
	}
	if ( cssClasses ) {
		classNames.push( cssClasses.trim() );
	}
	if ( hideOnDesktop ) {
		classNames.push( 'gambol-hide-desktop' );
	}
	if ( hideOnTablet ) {
		classNames.push( 'gambol-hide-tablet' );
	}
	if ( hideOnMobile ) {
		classNames.push( 'gambol-hide-mobile' );
	}

	return classNames;
}
