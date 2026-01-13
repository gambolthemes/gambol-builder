/**
 * Counter Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Icon library.
 */
const icons = {
	star: '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
	heart: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
	check: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
	users: '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
	clock: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
	trophy: '<path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>',
	rocket: '<path d="M12 2.5c-3.31 0-6 2.69-6 6 0 2.79 1.91 5.13 4.5 5.79v2.91c0 .28.22.5.5.5h2c.28 0 .5-.22.5-.5v-2.91c2.59-.66 4.5-3 4.5-5.79 0-3.31-2.69-6-6-6zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zM5.5 22h13l-6.5-3-6.5 3z"/>',
	award: '<path d="M12 2L9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62z"/>',
	briefcase: '<path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>',
	globe: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>',
	chart: '<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>',
	target: '<path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>',
};

/**
 * Counter Save Component.
 */
export default function save( { attributes } ) {
	const {
		startValue,
		endValue,
		prefix,
		suffix,
		title,
		duration,
		separator,
		showIcon,
		iconType,
		iconPosition,
		alignment,
		backgroundColor,
		numberColor,
		titleColor,
		iconColor,
		iconBgColor,
		numberSize,
		titleSize,
		iconSize,
		padding,
		borderRadius,
		htmlId,
		cssClasses,
	} = attributes;

	// Build CSS custom properties
	const cssVars = {
		'--gambol-counter-bg': backgroundColor,
		'--gambol-counter-number-color': numberColor,
		'--gambol-counter-title-color': titleColor,
		'--gambol-counter-icon-color': iconColor,
		'--gambol-counter-icon-bg': iconBgColor,
		'--gambol-counter-number-size': `${ numberSize }px`,
		'--gambol-counter-title-size': `${ titleSize }px`,
		'--gambol-counter-icon-size': `${ iconSize }px`,
		'--gambol-counter-padding': `${ padding.top }px ${ padding.right }px ${ padding.bottom }px ${ padding.left }px`,
		'--gambol-counter-radius': borderRadius,
	};

	// Build class names
	const className = [
		'gambol-counter',
		`gambol-counter--align-${ alignment }`,
		`gambol-counter--icon-${ iconPosition }`,
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps.save( {
		className,
		style: cssVars,
		id: htmlId || undefined,
		'data-start': startValue,
		'data-end': endValue,
		'data-duration': duration,
		'data-separator': separator ? 'true' : 'false',
	} );

	return (
		<div { ...blockProps }>
			{ showIcon && (
				<div className="gambol-counter__icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						dangerouslySetInnerHTML={ { __html: icons[ iconType ] } }
					/>
				</div>
			) }

			<div className="gambol-counter__content">
				<div className="gambol-counter__number">
					{ prefix && <span className="gambol-counter__prefix">{ prefix }</span> }
					<span className="gambol-counter__value" data-value={ endValue }>
						{ startValue }
					</span>
					{ suffix && <span className="gambol-counter__suffix">{ suffix }</span> }
				</div>

				<RichText.Content
					tagName="div"
					className="gambol-counter__title"
					value={ title }
				/>
			</div>
		</div>
	);
}
