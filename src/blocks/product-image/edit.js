/**
 * Product Image Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	Toggle,
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

/**
 * Product Image Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showSaleBadge,
		showGallery,
		showZoom,
		showLightbox,
		borderRadius,
		badgeColor,
		badgeBgColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-product-image',
	} );

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Product Image', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Features', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Sale Badge', 'gambol-builder' ) }
									checked={ showSaleBadge }
									onChange={ ( value ) => setAttributes( { showSaleBadge: value } ) }
								/>
								<Toggle
									label={ __( 'Gallery Thumbnails', 'gambol-builder' ) }
									checked={ showGallery }
									onChange={ ( value ) => setAttributes( { showGallery: value } ) }
								/>
								<Toggle
									label={ __( 'Zoom on Hover', 'gambol-builder' ) }
									checked={ showZoom }
									onChange={ ( value ) => setAttributes( { showZoom: value } ) }
								/>
								<Toggle
									label={ __( 'Lightbox', 'gambol-builder' ) }
									checked={ showLightbox }
									onChange={ ( value ) => setAttributes( { showLightbox: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Image', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
							</Section>

							<Section title={ __( 'Badge', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ badgeColor }
									onChange={ ( value ) => setAttributes( { badgeColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ badgeBgColor }
									onChange={ ( value ) => setAttributes( { badgeBgColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-gambol-product-image__main" style={ { borderRadius: `${ borderRadius }px` } }>
					<div className="wp-block-gambol-product-image__placeholder">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
							<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
						</svg>
					</div>
					{ showSaleBadge && (
						<span
							className="wp-block-gambol-product-image__badge"
							style={ { color: badgeColor, backgroundColor: badgeBgColor } }
						>
							{ __( 'Sale!', 'gambol-builder' ) }
						</span>
					) }
					{ showLightbox && (
						<button className="wp-block-gambol-product-image__lightbox-btn">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
								<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
								<path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
							</svg>
						</button>
					) }
				</div>
				{ showGallery && (
					<div className="wp-block-gambol-product-image__gallery">
						{ Array.from( { length: 4 } ).map( ( _, i ) => (
							<div key={ i } className="wp-block-gambol-product-image__thumb" style={ { borderRadius: `${ Math.max( 4, borderRadius / 2 ) }px` } }>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
									<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
								</svg>
							</div>
						) ) }
					</div>
				) }
			</div>
		</>
	);
}
