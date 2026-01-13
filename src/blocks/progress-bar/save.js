/**
 * Progress Bar Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Progress Bar Save Component.
 */
export default function save( { attributes } ) {
	const {
		title,
		percentage,
		showPercentage,
		percentagePosition,
		height,
		barColor,
		backgroundColor,
		textColor,
		borderRadius,
		style,
		animate,
		animationDuration,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-progress-bar wp-block-gambol-progress-bar--${ style }`,
		'data-percentage': percentage,
		'data-animate': animate,
		'data-duration': animationDuration,
	} );

	const trackStyle = {
		height: `${ height }px`,
		backgroundColor: backgroundColor || undefined,
		borderRadius: `${ borderRadius }px`,
	};

	const barStyle = {
		width: animate ? '0%' : `${ percentage }%`,
		backgroundColor: barColor || undefined,
		borderRadius: `${ borderRadius }px`,
		color: textColor || undefined,
		transitionDuration: `${ animationDuration }ms`,
	};

	return (
		<div { ...blockProps }>
			<div className="wp-block-gambol-progress-bar__header">
				<RichText.Content
					tagName="span"
					className="wp-block-gambol-progress-bar__title"
					value={ title }
				/>
				{ showPercentage && percentagePosition === 'title' && (
					<span className="wp-block-gambol-progress-bar__percentage">{ percentage }%</span>
				) }
			</div>

			<div 
				className="wp-block-gambol-progress-bar__track" 
				style={ trackStyle }
				role="progressbar"
				aria-valuenow={ percentage }
				aria-valuemin="0"
				aria-valuemax="100"
			>
				<div className="wp-block-gambol-progress-bar__bar" style={ barStyle }>
					{ showPercentage && percentagePosition === 'inside' && height >= 20 && (
						<span className="wp-block-gambol-progress-bar__percentage">{ percentage }%</span>
					) }
				</div>
			</div>

			{ showPercentage && percentagePosition === 'outside' && (
				<span className="wp-block-gambol-progress-bar__percentage wp-block-gambol-progress-bar__percentage--outside">
					{ percentage }%
				</span>
			) }
		</div>
	);
}
