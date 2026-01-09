/**
 * Icon Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Icon library paths (must match edit.js).
 */
const ICON_PATHS = {
	star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
	heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
	check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
	arrow: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z',
	play: 'M8 5v14l11-7L8 5z',
	settings: 'M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94 0 .31.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
	user: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
	mail: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
	phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
	location: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
	calendar: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z',
	clock: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
};

/**
 * Icon Save Component.
 */
export default function save( { attributes } ) {
	const {
		iconType,
		customSvg,
		size,
		sizeTablet,
		sizeMobile,
		iconColor,
		backgroundColor,
		hoverColor,
		hoverBackgroundColor,
		padding,
		borderRadius,
		rotation,
		linkUrl,
		linkTarget,
		alignment,
		hoverAnimation,
		htmlId,
		cssClasses,
	} = attributes;

	// Build inline styles
	const iconStyles = {
		'--gambol-icon-size': `${ size }px`,
		'--gambol-icon-size-tablet': `${ sizeTablet }px`,
		'--gambol-icon-size-mobile': `${ sizeMobile }px`,
		'--gambol-icon-color': iconColor,
		'--gambol-icon-bg': backgroundColor || 'transparent',
		'--gambol-icon-hover-color': hoverColor || iconColor,
		'--gambol-icon-hover-bg': hoverBackgroundColor || backgroundColor || 'transparent',
		'--gambol-icon-padding': `${ padding }px`,
		'--gambol-icon-radius': borderRadius,
		'--gambol-icon-rotation': `${ rotation }deg`,
		textAlign: alignment !== 'center' ? alignment : undefined,
	};

	// Build class names
	const className = [
		'gambol-icon',
		hoverAnimation !== 'none' ? `gambol-icon--hover-${ hoverAnimation }` : '',
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps.save( {
		className,
		style: iconStyles,
		id: htmlId || undefined,
	} );

	// Get icon path
	const iconPath = customSvg || ICON_PATHS[ iconType ] || ICON_PATHS.star;

	// Icon SVG element
	const iconElement = (
		<span className="gambol-icon__wrapper">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				className="gambol-icon__svg"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d={ iconPath } />
			</svg>
		</span>
	);

	// Wrap with link if URL provided
	const content = linkUrl ? (
		<a
			href={ linkUrl }
			target={ linkTarget }
			rel={ linkTarget === '_blank' ? 'noopener noreferrer' : undefined }
			className="gambol-icon__link"
		>
			{ iconElement }
		</a>
	) : (
		iconElement
	);

	return (
		<div { ...blockProps }>
			{ content }
		</div>
	);
}
