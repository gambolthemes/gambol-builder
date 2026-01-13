/**
 * Image Block - Save Component
 *
 * Clean, semantic HTML output.
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Image Save Component.
 */
export default function save( { attributes } ) {
	const {
		mediaUrl,
		alt,
		caption,
		width,
		maxWidth,
		height,
		objectFit,
		linkUrl,
		linkTarget,
		borderRadius,
		boxShadow,
		opacity,
		hasOverlay,
		overlayColor,
		hoverEffect,
		hoverScale,
		alignment,
		margin,
		htmlId,
		cssClasses,
	} = attributes;

	// Don't render if no image
	if ( ! mediaUrl ) {
		return null;
	}

	// Build inline styles
	const imageStyles = {
		width,
		maxWidth: maxWidth || undefined,
		height,
		objectFit,
		borderRadius,
		boxShadow: boxShadow !== 'none' ? boxShadow : undefined,
		opacity: opacity !== 1 ? opacity : undefined,
		'--gambol-hover-scale': hoverEffect === 'zoom' ? hoverScale : undefined,
	};

	const wrapperStyles = {
		textAlign: alignment !== 'center' ? alignment : undefined,
		marginTop: margin.top ? `${ margin.top }px` : undefined,
		marginRight: margin.right ? `${ margin.right }px` : undefined,
		marginBottom: margin.bottom ? `${ margin.bottom }px` : undefined,
		marginLeft: margin.left ? `${ margin.left }px` : undefined,
	};

	// Build class names
	const className = [
		'gambol-image',
		hoverEffect !== 'none' ? `gambol-image--hover-${ hoverEffect }` : '',
		hasOverlay ? 'gambol-image--has-overlay' : '',
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps.save( {
		className,
		style: wrapperStyles,
		id: htmlId || undefined,
	} );

	// Image element
	const imageElement = (
		<>
			<img
				src={ mediaUrl }
				alt={ alt }
				style={ imageStyles }
				className="gambol-image__img"
				loading="lazy"
			/>
			{ hasOverlay && (
				<span
					className="gambol-image__overlay"
					style={ { backgroundColor: overlayColor } }
					aria-hidden="true"
				/>
			) }
		</>
	);

	// Wrap with link if URL provided
	const content = linkUrl ? (
		<a
			href={ linkUrl }
			target={ linkTarget }
			rel={ linkTarget === '_blank' ? 'noopener noreferrer' : undefined }
			className="gambol-image__link"
		>
			{ imageElement }
		</a>
	) : (
		imageElement
	);

	return (
		<figure { ...blockProps }>
			<div className="gambol-image__wrapper">
				{ content }
			</div>
			{ caption && (
				<RichText.Content
					tagName="figcaption"
					className="gambol-image__caption"
					value={ caption }
				/>
			) }
		</figure>
	);
}
