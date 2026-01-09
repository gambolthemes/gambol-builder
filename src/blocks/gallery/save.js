/**
 * Gallery Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Gallery Save Component.
 */
export default function save( { attributes } ) {
	const {
		images,
		layout,
		columns,
		columnsTablet,
		columnsMobile,
		gap,
		aspectRatio,
		objectFit,
		borderRadius,
		hoverEffect,
		hoverOverlay,
		overlayColor,
		showCaption,
		captionPosition,
		enableLightbox,
		htmlId,
		cssClasses,
	} = attributes;

	// Get aspect ratio padding
	const getAspectRatioPadding = () => {
		switch ( aspectRatio ) {
			case '1:1': return '100%';
			case '4:3': return '75%';
			case '16:9': return '56.25%';
			case '3:2': return '66.67%';
			default: return 'auto';
		}
	};

	// Build CSS custom properties
	const cssVars = {
		'--gambol-gallery-columns': columns,
		'--gambol-gallery-columns-tablet': columnsTablet,
		'--gambol-gallery-columns-mobile': columnsMobile,
		'--gambol-gallery-gap': `${ gap }px`,
		'--gambol-gallery-radius': borderRadius,
		'--gambol-gallery-overlay': overlayColor,
		'--gambol-gallery-aspect': getAspectRatioPadding(),
		'--gambol-gallery-fit': objectFit,
	};

	// Build class names
	const className = [
		'gambol-gallery',
		`gambol-gallery--${ layout }`,
		`gambol-gallery--hover-${ hoverEffect }`,
		hoverOverlay && 'gambol-gallery--has-overlay',
		enableLightbox && 'gambol-gallery--lightbox',
		showCaption && `gambol-gallery--caption-${ captionPosition }`,
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps.save( {
		className,
		style: cssVars,
		id: htmlId || undefined,
	} );

	if ( ! images.length ) {
		return null;
	}

	return (
		<div { ...blockProps }>
			<div className="gambol-gallery__grid">
				{ images.map( ( image, index ) => (
					<figure key={ image.id } className="gambol-gallery__item">
						<div className="gambol-gallery__image-wrapper">
							{ enableLightbox ? (
								<a
									href={ image.url }
									className="gambol-gallery__link"
									data-lightbox="gallery"
									data-index={ index }
								>
									<img
										src={ image.url }
										alt={ image.alt }
										className="gambol-gallery__image"
										loading="lazy"
									/>
									{ hoverOverlay && <span className="gambol-gallery__overlay" /> }
									<span className="gambol-gallery__zoom">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
											<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2V7z"/>
										</svg>
									</span>
								</a>
							) : (
								<>
									<img
										src={ image.url }
										alt={ image.alt }
										className="gambol-gallery__image"
										loading="lazy"
									/>
									{ hoverOverlay && <span className="gambol-gallery__overlay" /> }
								</>
							) }
						</div>
						{ showCaption && image.caption && (
							<figcaption className="gambol-gallery__caption">
								{ image.caption }
							</figcaption>
						) }
					</figure>
				) ) }
			</div>
		</div>
	);
}
