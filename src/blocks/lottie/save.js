/**
 * Lottie Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lottie Save Component.
 */
export default function save( { attributes } ) {
	const {
		source,
		url,
		json,
		width,
		height,
		autoplay,
		loop,
		speed,
		direction,
		trigger,
		hoverAction,
		renderer,
		alignment,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-lottie align-${ alignment }`,
	} );

	const containerStyle = {
		width: `${ width }px`,
		height: `${ height }px`,
	};

	const hasAnimation = ( source === 'url' && url ) || ( source === 'json' && json );

	if ( ! hasAnimation ) {
		return null;
	}

	return (
		<div { ...blockProps }>
			<div
				className="lottie-container"
				style={ containerStyle }
				data-lottie-src={ source === 'url' ? url : undefined }
				data-lottie-json={ source === 'json' ? json : undefined }
				data-autoplay={ autoplay }
				data-loop={ loop }
				data-speed={ speed }
				data-direction={ direction }
				data-trigger={ trigger }
				data-hover-action={ hoverAction }
				data-renderer={ renderer }
			>
				{/* Lottie animation will be rendered here via JavaScript */}
			</div>
		</div>
	);
}
