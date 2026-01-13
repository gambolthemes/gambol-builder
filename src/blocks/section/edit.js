/**
 * Section Block - Edit Component
 *
 * Premium InspectorControls UI for Gambol Builder.
 * Professional, modern layout control panel with Layout/Design/Advanced tabs.
 *
 * @package GambolBuilder
 */

import { useState, useCallback } from '@wordpress/element';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	ColorPalette,
	GradientPicker,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Import Gambol Inspector components
import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	RangeSlider,
	Dropdown,
	GambolColorPicker,
	SpacingBox,
	Toggle,
	TextInput,
} from '../../components/inspector';

/**
 * Default template for new sections.
 */
const TEMPLATE = [
	[ 'gambol/container', {} ],
];

/**
 * Box shadow presets mapping.
 */
const BOX_SHADOW_VALUES = {
	none: 'none',
	soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
	medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
	strong: '0 8px 32px rgba(0, 0, 0, 0.18)',
};

/**
 * Section Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		// Layout
		layoutWidth,
		maxWidth,
		maxWidthUnit,
		minHeight,
		minHeightUnit,
		verticalAlign,
		contentGap,
		tagName,
		// Design - Background
		backgroundType,
		backgroundColor,
		backgroundGradient,
		backgroundImage,
		backgroundPosition,
		backgroundSize,
		overlayEnabled,
		overlayColor,
		overlayOpacity,
		// Design - Effects
		borderRadius,
		boxShadow,
		// Advanced
		margin,
		marginLinked,
		padding,
		paddingLinked,
		zIndex,
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
		cssClasses,
	} = attributes;

	// State for unit dropdowns
	const [ maxWidthUnitState, setMaxWidthUnitState ] = useState( maxWidthUnit || 'px' );
	const [ minHeightUnitState, setMinHeightUnitState ] = useState( minHeightUnit || 'px' );

	/**
	 * Build wrapper styles for live preview.
	 */
	const getWrapperStyles = useCallback( () => {
		const styles = {};

		// Min height
		if ( minHeight && minHeight > 0 ) {
			styles.minHeight = `${ minHeight }${ minHeightUnitState }`;
		}

		// Vertical alignment (flex)
		if ( minHeight > 0 || verticalAlign !== 'top' ) {
			styles.display = 'flex';
			styles.flexDirection = 'column';
			switch ( verticalAlign ) {
				case 'center':
					styles.justifyContent = 'center';
					break;
				case 'bottom':
					styles.justifyContent = 'flex-end';
					break;
				case 'stretch':
					styles.alignItems = 'stretch';
					break;
				default:
					styles.justifyContent = 'flex-start';
			}
		}

		// Background
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
				if ( backgroundImage?.url ) {
					styles.backgroundImage = `url(${ backgroundImage.url })`;
					styles.backgroundPosition = backgroundPosition || 'center center';
					styles.backgroundSize = backgroundSize || 'cover';
					styles.backgroundRepeat = 'no-repeat';
				}
				break;
		}

		// Border radius
		if ( borderRadius > 0 ) {
			styles.borderRadius = `${ borderRadius }px`;
		}

		// Box shadow
		if ( boxShadow && boxShadow !== 'none' ) {
			styles.boxShadow = BOX_SHADOW_VALUES[ boxShadow ] || 'none';
		}

		// Margin
		if ( margin ) {
			styles.marginTop = margin.top ? `${ margin.top }px` : undefined;
			styles.marginRight = margin.right ? `${ margin.right }px` : undefined;
			styles.marginBottom = margin.bottom ? `${ margin.bottom }px` : undefined;
			styles.marginLeft = margin.left ? `${ margin.left }px` : undefined;
		}

		// Padding
		if ( padding ) {
			styles.paddingTop = `${ padding.top || 0 }px`;
			styles.paddingRight = `${ padding.right || 0 }px`;
			styles.paddingBottom = `${ padding.bottom || 0 }px`;
			styles.paddingLeft = `${ padding.left || 0 }px`;
		}

		// Z-index
		if ( zIndex && zIndex !== 0 ) {
			styles.zIndex = zIndex;
			styles.position = 'relative';
		}

		return styles;
	}, [
		minHeight, minHeightUnitState, verticalAlign,
		backgroundType, backgroundColor, backgroundGradient, backgroundImage,
		backgroundPosition, backgroundSize,
		borderRadius, boxShadow, margin, padding, zIndex,
	] );

	/**
	 * Build inner content styles.
	 */
	const getInnerStyles = useCallback( () => {
		const styles = {};

		// Max width for boxed layout
		if ( layoutWidth === 'boxed' && maxWidth ) {
			styles.maxWidth = `${ maxWidth }${ maxWidthUnitState }`;
			styles.marginLeft = 'auto';
			styles.marginRight = 'auto';
			styles.width = '100%';
		}

		// Content gap
		if ( contentGap > 0 ) {
			styles.display = 'flex';
			styles.flexDirection = 'column';
			styles.gap = `${ contentGap }px`;
		}

		return styles;
	}, [ layoutWidth, maxWidth, maxWidthUnitState, contentGap ] );

	/**
	 * Build overlay styles.
	 */
	const getOverlayStyles = useCallback( () => {
		if ( ! overlayEnabled || backgroundType === 'none' ) {
			return null;
		}
		return {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: overlayColor || '#000000',
			opacity: ( overlayOpacity || 50 ) / 100,
			pointerEvents: 'none',
			borderRadius: borderRadius > 0 ? `${ borderRadius }px` : undefined,
		};
	}, [ overlayEnabled, backgroundType, overlayColor, overlayOpacity, borderRadius ] );

	// Build class names
	const classNames = [ 'wp-block-gambol-section' ];
	if ( layoutWidth ) {
		classNames.push( `is-layout-${ layoutWidth }` );
	}
	if ( verticalAlign && verticalAlign !== 'top' ) {
		classNames.push( `is-valign-${ verticalAlign }` );
	}
	if ( cssClasses ) {
		classNames.push( cssClasses );
	}
	if ( hideOnDesktop ) classNames.push( 'gambol-hide-desktop' );
	if ( hideOnTablet ) classNames.push( 'gambol-hide-tablet' );
	if ( hideOnMobile ) classNames.push( 'gambol-hide-mobile' );

	// Block props
	const blockProps = useBlockProps( {
		className: classNames.join( ' ' ),
		style: { ...getWrapperStyles(), position: 'relative' },
	} );

	// Inner blocks props - allow all blocks
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'wp-block-gambol-section__inner',
			style: getInnerStyles(),
		},
		{
			template: TEMPLATE,
			templateLock: false,
		}
	);

	// Dynamic tag
	const TagName = tagName || 'section';

	// ─────────────────────────────────────────────────────────────
	// ICONS
	// ─────────────────────────────────────────────────────────────

	const SectionIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
			<path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h12c.3 0 .5.2.5.5v12z"/>
		</svg>
	);

	const AlignTopIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M9 20h6V9H9v11zM4 4v1.5h16V4H4z"/>
		</svg>
	);

	const AlignCenterIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M20 11h-5V4H9v7H4v2h5v7h6v-7h5z"/>
		</svg>
	);

	const AlignBottomIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M9 4h6v11H9V4zM4 18.5V20h16v-1.5H4z"/>
		</svg>
	);

	const AlignStretchIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M4 4v1.5h16V4H4zM9 7h6v10H9V7zM4 18.5V20h16v-1.5H4z"/>
		</svg>
	);

	// ─────────────────────────────────────────────────────────────
	// LAYOUT TAB
	// ─────────────────────────────────────────────────────────────

	const LayoutTab = (
		<>
			{/* Layout Width */}
			<Section title={ __( 'Layout Width', 'gambol-builder' ) }>
				<ButtonGroup
					value={ layoutWidth || 'boxed' }
					onChange={ ( value ) => setAttributes( { layoutWidth: value } ) }
					options={ [
						{ value: 'auto', label: __( 'Auto', 'gambol-builder' ) },
						{ value: 'boxed', label: __( 'Boxed', 'gambol-builder' ) },
						{ value: 'full', label: __( 'Full', 'gambol-builder' ) },
					] }
				/>
			</Section>

			{/* Max Width - only for boxed */}
			{ layoutWidth === 'boxed' && (
				<Section title={ __( 'Max Width', 'gambol-builder' ) }>
					<RangeSlider
						value={ maxWidth || 1200 }
						onChange={ ( value ) => setAttributes( { maxWidth: value } ) }
						min={ 320 }
						max={ maxWidthUnitState === '%' ? 100 : 2000 }
						step={ maxWidthUnitState === '%' ? 1 : 10 }
						unit={ maxWidthUnitState }
						units={ [ 'px', '%', 'rem' ] }
						onUnitChange={ ( unit ) => {
							setMaxWidthUnitState( unit );
							setAttributes( { maxWidthUnit: unit } );
						} }
					/>
				</Section>
			) }

			{/* Min Height */}
			<Section title={ __( 'Min Height', 'gambol-builder' ) }>
				<RangeSlider
					value={ minHeight || 0 }
					onChange={ ( value ) => setAttributes( { minHeight: value } ) }
					min={ 0 }
					max={ minHeightUnitState === 'vh' ? 100 : 1000 }
					step={ minHeightUnitState === 'vh' ? 1 : 10 }
					unit={ minHeightUnitState }
					units={ [ 'px', 'vh', 'rem' ] }
					onUnitChange={ ( unit ) => {
						setMinHeightUnitState( unit );
						setAttributes( { minHeightUnit: unit } );
					} }
				/>
			</Section>

			{/* Vertical Alignment */}
			<Section title={ __( 'Vertical Alignment', 'gambol-builder' ) }>
				<ButtonGroup
					value={ verticalAlign || 'top' }
					onChange={ ( value ) => setAttributes( { verticalAlign: value } ) }
					options={ [
						{ value: 'top', icon: <AlignTopIcon />, label: __( 'Top', 'gambol-builder' ) },
						{ value: 'center', icon: <AlignCenterIcon />, label: __( 'Center', 'gambol-builder' ) },
						{ value: 'bottom', icon: <AlignBottomIcon />, label: __( 'Bottom', 'gambol-builder' ) },
						{ value: 'stretch', icon: <AlignStretchIcon />, label: __( 'Stretch', 'gambol-builder' ) },
					] }
				/>
			</Section>

			{/* Inner Content Gap */}
			<Section title={ __( 'Inner Content Gap', 'gambol-builder' ) }>
				<RangeSlider
					value={ contentGap || 0 }
					onChange={ ( value ) => setAttributes( { contentGap: value } ) }
					min={ 0 }
					max={ 100 }
					step={ 4 }
					unit="px"
				/>
			</Section>

			{/* HTML Tag */}
			<Section title={ __( 'HTML Tag', 'gambol-builder' ) }>
				<Dropdown
					value={ tagName || 'section' }
					onChange={ ( value ) => setAttributes( { tagName: value } ) }
					options={ [
						{ value: 'section', label: __( '<section>', 'gambol-builder' ) },
						{ value: 'div', label: __( '<div>', 'gambol-builder' ) },
						{ value: 'header', label: __( '<header>', 'gambol-builder' ) },
						{ value: 'main', label: __( '<main>', 'gambol-builder' ) },
						{ value: 'footer', label: __( '<footer>', 'gambol-builder' ) },
					] }
					help={ __( 'Semantic HTML element for accessibility.', 'gambol-builder' ) }
				/>
			</Section>
		</>
	);

	// ─────────────────────────────────────────────────────────────
	// DESIGN TAB
	// ─────────────────────────────────────────────────────────────

	const DesignTab = (
		<>
			{/* Background Type */}
			<Section title={ __( 'Background', 'gambol-builder' ) }>
				<ButtonGroup
					label={ __( 'Type', 'gambol-builder' ) }
					value={ backgroundType || 'none' }
					onChange={ ( value ) => setAttributes( { backgroundType: value } ) }
					options={ [
						{ value: 'none', label: __( 'None', 'gambol-builder' ) },
						{ value: 'color', label: __( 'Color', 'gambol-builder' ) },
						{ value: 'gradient', label: __( 'Gradient', 'gambol-builder' ) },
						{ value: 'image', label: __( 'Image', 'gambol-builder' ) },
					] }
				/>

				{/* Color Picker */}
				{ backgroundType === 'color' && (
					<div className="gambol-control-group" style={ { marginTop: '16px' } }>
						<label className="gambol-control-label">
							{ __( 'Color', 'gambol-builder' ) }
						</label>
						<ColorPalette
							value={ backgroundColor }
							onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
							clearable={ true }
						/>
					</div>
				) }

				{/* Gradient Picker */}
				{ backgroundType === 'gradient' && (
					<div className="gambol-control-group" style={ { marginTop: '16px' } }>
						<label className="gambol-control-label">
							{ __( 'Gradient', 'gambol-builder' ) }
						</label>
						<GradientPicker
							value={ backgroundGradient }
							onChange={ ( value ) => setAttributes( { backgroundGradient: value } ) }
						/>
					</div>
				) }

				{/* Image Upload */}
				{ backgroundType === 'image' && (
					<div className="gambol-control-group" style={ { marginTop: '16px' } }>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => setAttributes( {
									backgroundImage: {
										id: media.id,
										url: media.url,
										alt: media.alt,
									},
								} ) }
								allowedTypes={ [ 'image' ] }
								value={ backgroundImage?.id }
								render={ ( { open } ) => (
									<div className="gambol-image-control">
										{ backgroundImage?.url ? (
											<div className="gambol-image-preview">
												<img
													src={ backgroundImage.url }
													alt={ backgroundImage.alt || '' }
													style={ {
														width: '100%',
														height: '120px',
														objectFit: 'cover',
														borderRadius: '6px',
														marginBottom: '8px',
													} }
												/>
												<div style={ { display: 'flex', gap: '8px' } }>
													<Button
														variant="secondary"
														onClick={ open }
														style={ { flex: 1 } }
													>
														{ __( 'Replace', 'gambol-builder' ) }
													</Button>
													<Button
														variant="secondary"
														isDestructive
														onClick={ () => setAttributes( { backgroundImage: {} } ) }
													>
														{ __( 'Remove', 'gambol-builder' ) }
													</Button>
												</div>
											</div>
										) : (
											<Button
												variant="secondary"
												onClick={ open }
												style={ { width: '100%', justifyContent: 'center' } }
											>
												{ __( 'Select Image', 'gambol-builder' ) }
											</Button>
										) }
									</div>
								) }
							/>
						</MediaUploadCheck>

						{/* Background Position */}
						{ backgroundImage?.url && (
							<>
								<div style={ { marginTop: '12px' } }>
									<Dropdown
										label={ __( 'Position', 'gambol-builder' ) }
										value={ backgroundPosition || 'center center' }
										onChange={ ( value ) => setAttributes( { backgroundPosition: value } ) }
										options={ [
											{ value: 'left top', label: __( 'Top Left', 'gambol-builder' ) },
											{ value: 'center top', label: __( 'Top Center', 'gambol-builder' ) },
											{ value: 'right top', label: __( 'Top Right', 'gambol-builder' ) },
											{ value: 'left center', label: __( 'Center Left', 'gambol-builder' ) },
											{ value: 'center center', label: __( 'Center', 'gambol-builder' ) },
											{ value: 'right center', label: __( 'Center Right', 'gambol-builder' ) },
											{ value: 'left bottom', label: __( 'Bottom Left', 'gambol-builder' ) },
											{ value: 'center bottom', label: __( 'Bottom Center', 'gambol-builder' ) },
											{ value: 'right bottom', label: __( 'Bottom Right', 'gambol-builder' ) },
										] }
									/>
								</div>
								<div style={ { marginTop: '12px' } }>
									<Dropdown
										label={ __( 'Size', 'gambol-builder' ) }
										value={ backgroundSize || 'cover' }
										onChange={ ( value ) => setAttributes( { backgroundSize: value } ) }
										options={ [
											{ value: 'cover', label: __( 'Cover', 'gambol-builder' ) },
											{ value: 'contain', label: __( 'Contain', 'gambol-builder' ) },
											{ value: 'auto', label: __( 'Auto', 'gambol-builder' ) },
										] }
									/>
								</div>
							</>
						) }
					</div>
				) }
			</Section>

			{/* Overlay */}
			{ backgroundType !== 'none' && (
				<Section title={ __( 'Overlay', 'gambol-builder' ) }>
					<Toggle
						label={ __( 'Enable Overlay', 'gambol-builder' ) }
						checked={ overlayEnabled || false }
						onChange={ ( value ) => setAttributes( { overlayEnabled: value } ) }
					/>

					{ overlayEnabled && (
						<>
							<div style={ { marginTop: '16px' } }>
								<GambolColorPicker
									label={ __( 'Overlay Color', 'gambol-builder' ) }
									value={ overlayColor || '#000000' }
									onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
								/>
							</div>
							<div style={ { marginTop: '16px' } }>
								<RangeSlider
									label={ __( 'Opacity', 'gambol-builder' ) }
									value={ overlayOpacity || 50 }
									onChange={ ( value ) => setAttributes( { overlayOpacity: value } ) }
									min={ 0 }
									max={ 100 }
									step={ 5 }
									unit="%"
								/>
							</div>
						</>
					) }
				</Section>
			) }

			{/* Border Radius */}
			<Section title={ __( 'Border Radius', 'gambol-builder' ) }>
				<RangeSlider
					value={ borderRadius || 0 }
					onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
					min={ 0 }
					max={ 100 }
					step={ 1 }
					unit="px"
				/>
			</Section>

			{/* Box Shadow */}
			<Section title={ __( 'Box Shadow', 'gambol-builder' ) }>
				<ButtonGroup
					value={ boxShadow || 'none' }
					onChange={ ( value ) => setAttributes( { boxShadow: value } ) }
					options={ [
						{ value: 'none', label: __( 'None', 'gambol-builder' ) },
						{ value: 'soft', label: __( 'Soft', 'gambol-builder' ) },
						{ value: 'medium', label: __( 'Medium', 'gambol-builder' ) },
						{ value: 'strong', label: __( 'Strong', 'gambol-builder' ) },
					] }
				/>
			</Section>
		</>
	);

	// ─────────────────────────────────────────────────────────────
	// ADVANCED TAB
	// ─────────────────────────────────────────────────────────────

	const AdvancedTab = (
		<>
			{/* Margin */}
			<Section title={ __( 'Margin', 'gambol-builder' ) }>
				<SpacingBox
					value={ margin || { top: 0, right: 0, bottom: 0, left: 0 } }
					onChange={ ( value ) => setAttributes( { margin: value } ) }
					linked={ marginLinked }
					onLinkedChange={ ( value ) => setAttributes( { marginLinked: value } ) }
				/>
			</Section>

			{/* Padding */}
			<Section title={ __( 'Padding', 'gambol-builder' ) }>
				<SpacingBox
					value={ padding || { top: 40, right: 20, bottom: 40, left: 20 } }
					onChange={ ( value ) => setAttributes( { padding: value } ) }
					linked={ paddingLinked }
					onLinkedChange={ ( value ) => setAttributes( { paddingLinked: value } ) }
				/>
			</Section>

			{/* Z-Index */}
			<Section title={ __( 'Z-Index', 'gambol-builder' ) }>
				<RangeSlider
					value={ zIndex || 0 }
					onChange={ ( value ) => setAttributes( { zIndex: value } ) }
					min={ -10 }
					max={ 999 }
					step={ 1 }
				/>
			</Section>

			{/* Visibility */}
			<Section title={ __( 'Visibility', 'gambol-builder' ) }>
				<div className="gambol-visibility-controls">
					<Toggle
						label={ __( 'Hide on Desktop', 'gambol-builder' ) }
						checked={ hideOnDesktop || false }
						onChange={ ( value ) => setAttributes( { hideOnDesktop: value } ) }
					/>
					<div style={ { marginTop: '8px' } }>
						<Toggle
							label={ __( 'Hide on Tablet', 'gambol-builder' ) }
							checked={ hideOnTablet || false }
							onChange={ ( value ) => setAttributes( { hideOnTablet: value } ) }
						/>
					</div>
					<div style={ { marginTop: '8px' } }>
						<Toggle
							label={ __( 'Hide on Mobile', 'gambol-builder' ) }
							checked={ hideOnMobile || false }
							onChange={ ( value ) => setAttributes( { hideOnMobile: value } ) }
						/>
					</div>
				</div>
			</Section>

			{/* Custom CSS Class */}
			<Section title={ __( 'Custom CSS', 'gambol-builder' ) }>
				<TextInput
					label={ __( 'CSS Classes', 'gambol-builder' ) }
					value={ cssClasses || '' }
					onChange={ ( value ) => setAttributes( { cssClasses: value } ) }
					placeholder="my-custom-class"
					help={ __( 'Separate multiple classes with spaces.', 'gambol-builder' ) }
				/>
			</Section>
		</>
	);

	// ─────────────────────────────────────────────────────────────
	// RENDER
	// ─────────────────────────────────────────────────────────────

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Section', 'gambol-builder' ) }
					blockIcon={ <SectionIcon /> }
					layoutTab={ LayoutTab }
					designTab={ DesignTab }
					advancedTab={ AdvancedTab }
				/>
			</InspectorControls>

			<TagName { ...blockProps }>
				{/* Overlay layer */}
				{ overlayEnabled && backgroundType !== 'none' && (
					<div
						className="wp-block-gambol-section__overlay"
						style={ getOverlayStyles() }
						aria-hidden="true"
					/>
				) }

				{/* Inner content */}
				<div { ...innerBlocksProps } />
			</TagName>
		</>
	);
}
