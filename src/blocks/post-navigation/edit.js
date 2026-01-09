/**
 * Post Navigation Block - Edit Component
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
	TextInput,
} from '../../components/inspector';

/**
 * Arrow icons.
 */
const ArrowLeft = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
	</svg>
);

const ArrowRight = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
	</svg>
);

/**
 * Post Navigation Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showThumbnail,
		thumbnailSize,
		showLabel,
		prevLabel,
		nextLabel,
		showArrow,
		labelColor,
		titleColor,
		titleHoverColor,
		backgroundColor,
		padding,
		borderRadius,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-post-navigation',
		style: {
			'--title-hover-color': titleHoverColor || 'var(--gb-colors-primary)',
		},
	} );

	const itemStyle = {
		backgroundColor: backgroundColor || undefined,
		padding: padding ? `${ padding }px` : undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
	};

	const labelStyle = {
		color: labelColor || 'var(--gb-colors-gray-500)',
	};

	const titleStyle = {
		color: titleColor || undefined,
	};

	const thumbnailStyle = {
		width: `${ thumbnailSize }px`,
		height: `${ thumbnailSize }px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Post Navigation', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M8 12l6-6v4h6v4h-6v4L8 12zm-2 0L1 7v10l5-5z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Thumbnail', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Thumbnail', 'gambol-builder' ) }
									checked={ showThumbnail }
									onChange={ ( value ) => setAttributes( { showThumbnail: value } ) }
								/>
								{ showThumbnail && (
									<RangeSlider
										label={ __( 'Thumbnail Size', 'gambol-builder' ) }
										value={ thumbnailSize }
										onChange={ ( value ) => setAttributes( { thumbnailSize: value } ) }
										min={ 40 }
										max={ 120 }
									/>
								) }
							</Section>

							<Section title={ __( 'Labels', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Label', 'gambol-builder' ) }
									checked={ showLabel }
									onChange={ ( value ) => setAttributes( { showLabel: value } ) }
								/>
								{ showLabel && (
									<>
										<TextInput
											label={ __( 'Previous Label', 'gambol-builder' ) }
											value={ prevLabel }
											onChange={ ( value ) => setAttributes( { prevLabel: value } ) }
										/>
										<TextInput
											label={ __( 'Next Label', 'gambol-builder' ) }
											value={ nextLabel }
											onChange={ ( value ) => setAttributes( { nextLabel: value } ) }
										/>
									</>
								) }
							</Section>

							<Section title={ __( 'Arrow', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Arrow', 'gambol-builder' ) }
									checked={ showArrow }
									onChange={ ( value ) => setAttributes( { showArrow: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Box Style', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Padding', 'gambol-builder' ) }
									value={ padding }
									onChange={ ( value ) => setAttributes( { padding: value } ) }
									min={ 0 }
									max={ 50 }
								/>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
								<GambolColorPicker
									label={ __( 'Background Color', 'gambol-builder' ) }
									value={ backgroundColor }
									onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Label Color', 'gambol-builder' ) }
									value={ labelColor }
									onChange={ ( value ) => setAttributes( { labelColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Title Color', 'gambol-builder' ) }
									value={ titleColor }
									onChange={ ( value ) => setAttributes( { titleColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Title Hover Color', 'gambol-builder' ) }
									value={ titleHoverColor }
									onChange={ ( value ) => setAttributes( { titleHoverColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<nav { ...blockProps } aria-label={ __( 'Post Navigation', 'gambol-builder' ) }>
				<div className="wp-block-gambol-post-navigation__prev" style={ itemStyle }>
					<a href="#" className="wp-block-gambol-post-navigation__link">
						{ showArrow && (
							<span className="wp-block-gambol-post-navigation__arrow">
								<ArrowLeft />
							</span>
						) }
						{ showThumbnail && (
							<div className="wp-block-gambol-post-navigation__thumbnail" style={ thumbnailStyle }>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
									<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
								</svg>
							</div>
						) }
						<div className="wp-block-gambol-post-navigation__content">
							{ showLabel && (
								<span className="wp-block-gambol-post-navigation__label" style={ labelStyle }>
									{ prevLabel }
								</span>
							) }
							<span className="wp-block-gambol-post-navigation__title" style={ titleStyle }>
								{ __( 'Previous Post Title', 'gambol-builder' ) }
							</span>
						</div>
					</a>
				</div>

				<div className="wp-block-gambol-post-navigation__next" style={ itemStyle }>
					<a href="#" className="wp-block-gambol-post-navigation__link">
						<div className="wp-block-gambol-post-navigation__content">
							{ showLabel && (
								<span className="wp-block-gambol-post-navigation__label" style={ labelStyle }>
									{ nextLabel }
								</span>
							) }
							<span className="wp-block-gambol-post-navigation__title" style={ titleStyle }>
								{ __( 'Next Post Title', 'gambol-builder' ) }
							</span>
						</div>
						{ showThumbnail && (
							<div className="wp-block-gambol-post-navigation__thumbnail" style={ thumbnailStyle }>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
									<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
								</svg>
							</div>
						) }
						{ showArrow && (
							<span className="wp-block-gambol-post-navigation__arrow">
								<ArrowRight />
							</span>
						) }
					</a>
				</div>
			</nav>
		</>
	);
}
