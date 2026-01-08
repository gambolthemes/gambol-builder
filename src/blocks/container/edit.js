/**
 * Container Block - Edit Component
 *
 * Premium InspectorControls UI for Gambol Builder.
 * Precise content width and alignment control.
 *
 * @package GambolBuilder
 */

import { useState, useCallback } from '@wordpress/element';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

// Import Gambol Inspector components
import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	RangeSlider,
	GambolColorPicker,
	SpacingBox,
	Toggle,
	TextInput,
} from '../../components/inspector';

/**
 * Default template for new containers.
 */
const TEMPLATE = [
	[ 'core/paragraph', { placeholder: __( 'Add content...', 'gambol-builder' ) } ],
];

/**
 * Container Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		// Layout
		contentWidth,
		maxWidth,
		maxWidthUnit,
		horizontalPadding,
		contentAlign,
		verticalAlign,
		flexDirection,
		gap,
		// Design
		backgroundColor,
		borderRadius,
		borderColor,
		borderWidth,
		shadowEnabled,
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

	// State for unit
	const [ maxWidthUnitState, setMaxWidthUnitState ] = useState( maxWidthUnit || 'px' );

	/**
	 * Build container styles for live preview.
	 */
	const getContainerStyles = useCallback( () => {
		const styles = {};

		// Max width
		if ( contentWidth === 'custom' && maxWidth ) {
			styles.maxWidth = `${ maxWidth }${ maxWidthUnitState }`;
			styles.marginLeft = 'auto';
			styles.marginRight = 'auto';
			styles.width = '100%';
		}

		// Flex layout
		styles.display = 'flex';
		styles.flexDirection = flexDirection || 'column';

		// Horizontal alignment
		if ( flexDirection === 'column' ) {
			switch ( contentAlign ) {
				case 'center':
					styles.alignItems = 'center';
					break;
				case 'right':
					styles.alignItems = 'flex-end';
					break;
				default:
					styles.alignItems = 'flex-start';
			}
		} else {
			switch ( contentAlign ) {
				case 'center':
					styles.justifyContent = 'center';
					break;
				case 'right':
					styles.justifyContent = 'flex-end';
					break;
				default:
					styles.justifyContent = 'flex-start';
			}
		}

		// Vertical alignment
		if ( flexDirection === 'column' ) {
			switch ( verticalAlign ) {
				case 'center':
					styles.justifyContent = 'center';
					break;
				case 'bottom':
					styles.justifyContent = 'flex-end';
					break;
				default:
					styles.justifyContent = 'flex-start';
			}
		} else {
			switch ( verticalAlign ) {
				case 'center':
					styles.alignItems = 'center';
					break;
				case 'bottom':
					styles.alignItems = 'flex-end';
					break;
				default:
					styles.alignItems = 'flex-start';
			}
		}

		// Gap
		if ( gap > 0 ) {
			styles.gap = `${ gap }px`;
		}

		// Horizontal padding (quick control)
		if ( horizontalPadding > 0 ) {
			styles.paddingLeft = `${ horizontalPadding }px`;
			styles.paddingRight = `${ horizontalPadding }px`;
		}

		// Fine-tuned padding (from Advanced)
		if ( padding ) {
			if ( padding.top > 0 ) styles.paddingTop = `${ padding.top }px`;
			if ( padding.bottom > 0 ) styles.paddingBottom = `${ padding.bottom }px`;
			// Only override horizontal if set differently
			if ( padding.left > 0 && padding.left !== horizontalPadding ) {
				styles.paddingLeft = `${ padding.left }px`;
			}
			if ( padding.right > 0 && padding.right !== horizontalPadding ) {
				styles.paddingRight = `${ padding.right }px`;
			}
		}

		// Background color
		if ( backgroundColor ) {
			styles.backgroundColor = backgroundColor;
		}

		// Border radius
		if ( borderRadius > 0 ) {
			styles.borderRadius = `${ borderRadius }px`;
		}

		// Border
		if ( borderWidth > 0 && borderColor ) {
			styles.border = `${ borderWidth }px solid ${ borderColor }`;
		} else if ( borderWidth > 0 ) {
			styles.border = `${ borderWidth }px solid #e0e0e0`;
		}

		// Shadow
		if ( shadowEnabled ) {
			styles.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
		}

		// Margin
		if ( margin ) {
			if ( margin.top ) styles.marginTop = `${ margin.top }px`;
			if ( margin.bottom ) styles.marginBottom = `${ margin.bottom }px`;
		}

		// Z-index
		if ( zIndex && zIndex !== 0 ) {
			styles.zIndex = zIndex;
			styles.position = 'relative';
		}

		return styles;
	}, [
		contentWidth, maxWidth, maxWidthUnitState, horizontalPadding,
		contentAlign, verticalAlign, flexDirection, gap,
		backgroundColor, borderRadius, borderColor, borderWidth, shadowEnabled,
		margin, padding, zIndex,
	] );

	// Build class names
	const classNames = [ 'wp-block-gambol-container' ];
	if ( contentWidth ) {
		classNames.push( `is-width-${ contentWidth }` );
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
		style: getContainerStyles(),
	} );

	// Inner blocks props - use blockProps directly for clean output
	const innerBlocksProps = useInnerBlocksProps(
		blockProps,
		{
			template: TEMPLATE,
			templateLock: false,
		}
	);

	// ─────────────────────────────────────────────────────────────
	// ICONS
	// ─────────────────────────────────────────────────────────────

	const ContainerIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
			<path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h12c.3 0 .5.2.5.5v12zM7 7.5h10v1.5H7V7.5z"/>
		</svg>
	);

	const AlignLeftIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M4 19h16v-2H4v2zM4 15h10v-2H4v2zM4 11h16V9H4v2zM4 5v2h10V5H4z"/>
		</svg>
	);

	const AlignCenterIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M4 19h16v-2H4v2zM7 15h10v-2H7v2zM4 11h16V9H4v2zM7 5v2h10V5H7z"/>
		</svg>
	);

	const AlignRightIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M4 19h16v-2H4v2zM10 15h10v-2H10v2zM4 11h16V9H4v2zM10 5v2h10V5H10z"/>
		</svg>
	);

	const AlignTopIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M9 20h6V9H9v11zM4 4v1.5h16V4H4z"/>
		</svg>
	);

	const AlignMiddleIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M20 11h-5V4H9v7H4v2h5v7h6v-7h5z"/>
		</svg>
	);

	const AlignBottomIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M9 4h6v11H9V4zM4 18.5V20h16v-1.5H4z"/>
		</svg>
	);

	const RowIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M4 6h5v12H4V6zm6 0h4v12h-4V6zm5 0h5v12h-5V6z"/>
		</svg>
	);

	const ColumnIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
			<path d="M6 4v5h12V4H6zM6 10v4h12v-4H6zM6 15v5h12v-5H6z"/>
		</svg>
	);

	// ─────────────────────────────────────────────────────────────
	// LAYOUT TAB
	// ─────────────────────────────────────────────────────────────

	const LayoutTab = (
		<>
			{/* Content Width */}
			<Section title={ __( 'Content Width', 'gambol-builder' ) }>
				<ButtonGroup
					value={ contentWidth || 'custom' }
					onChange={ ( value ) => setAttributes( { contentWidth: value } ) }
					options={ [
						{ value: 'auto', label: __( 'Auto', 'gambol-builder' ) },
						{ value: 'custom', label: __( 'Custom', 'gambol-builder' ) },
					] }
				/>
			</Section>

			{/* Max Width - only for custom */}
			{ contentWidth === 'custom' && (
				<Section title={ __( 'Max Width', 'gambol-builder' ) }>
					<RangeSlider
						value={ maxWidth || 1200 }
						onChange={ ( value ) => setAttributes( { maxWidth: value } ) }
						min={ 200 }
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

			{/* Horizontal Padding */}
			<Section title={ __( 'Horizontal Padding', 'gambol-builder' ) }>
				<RangeSlider
					value={ horizontalPadding || 0 }
					onChange={ ( value ) => setAttributes( { horizontalPadding: value } ) }
					min={ 0 }
					max={ 100 }
					step={ 4 }
					unit="px"
				/>
			</Section>

			{/* Content Alignment */}
			<Section title={ __( 'Content Alignment', 'gambol-builder' ) }>
				<ButtonGroup
					label={ __( 'Horizontal', 'gambol-builder' ) }
					value={ contentAlign || 'left' }
					onChange={ ( value ) => setAttributes( { contentAlign: value } ) }
					options={ [
						{ value: 'left', icon: <AlignLeftIcon />, label: __( 'Left', 'gambol-builder' ) },
						{ value: 'center', icon: <AlignCenterIcon />, label: __( 'Center', 'gambol-builder' ) },
						{ value: 'right', icon: <AlignRightIcon />, label: __( 'Right', 'gambol-builder' ) },
					] }
				/>
			</Section>

			{/* Vertical Alignment */}
			<Section title={ __( 'Vertical Alignment', 'gambol-builder' ) }>
				<ButtonGroup
					value={ verticalAlign || 'top' }
					onChange={ ( value ) => setAttributes( { verticalAlign: value } ) }
					options={ [
						{ value: 'top', icon: <AlignTopIcon />, label: __( 'Top', 'gambol-builder' ) },
						{ value: 'center', icon: <AlignMiddleIcon />, label: __( 'Center', 'gambol-builder' ) },
						{ value: 'bottom', icon: <AlignBottomIcon />, label: __( 'Bottom', 'gambol-builder' ) },
					] }
				/>
			</Section>

			{/* Flex Direction */}
			<Section title={ __( 'Flex Direction', 'gambol-builder' ) }>
				<ButtonGroup
					value={ flexDirection || 'column' }
					onChange={ ( value ) => setAttributes( { flexDirection: value } ) }
					options={ [
						{ value: 'row', icon: <RowIcon />, label: __( 'Row', 'gambol-builder' ) },
						{ value: 'column', icon: <ColumnIcon />, label: __( 'Column', 'gambol-builder' ) },
					] }
				/>
			</Section>

			{/* Gap */}
			<Section title={ __( 'Gap', 'gambol-builder' ) }>
				<RangeSlider
					value={ gap || 0 }
					onChange={ ( value ) => setAttributes( { gap: value } ) }
					min={ 0 }
					max={ 80 }
					step={ 4 }
					unit="px"
				/>
			</Section>
		</>
	);

	// ─────────────────────────────────────────────────────────────
	// DESIGN TAB
	// ─────────────────────────────────────────────────────────────

	const DesignTab = (
		<>
			{/* Background Color */}
			<Section title={ __( 'Background', 'gambol-builder' ) }>
				<GambolColorPicker
					label={ __( 'Background Color', 'gambol-builder' ) }
					value={ backgroundColor || '' }
					onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
				/>
			</Section>

			{/* Border Radius */}
			<Section title={ __( 'Border Radius', 'gambol-builder' ) }>
				<RangeSlider
					value={ borderRadius || 0 }
					onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
					min={ 0 }
					max={ 50 }
					step={ 1 }
					unit="px"
				/>
			</Section>

			{/* Border */}
			<Section title={ __( 'Border', 'gambol-builder' ) }>
				<RangeSlider
					label={ __( 'Width', 'gambol-builder' ) }
					value={ borderWidth || 0 }
					onChange={ ( value ) => setAttributes( { borderWidth: value } ) }
					min={ 0 }
					max={ 10 }
					step={ 1 }
					unit="px"
				/>
				{ borderWidth > 0 && (
					<div style={ { marginTop: '16px' } }>
						<GambolColorPicker
							label={ __( 'Color', 'gambol-builder' ) }
							value={ borderColor || '#e0e0e0' }
							onChange={ ( value ) => setAttributes( { borderColor: value } ) }
						/>
					</div>
				) }
			</Section>

			{/* Shadow */}
			<Section title={ __( 'Shadow', 'gambol-builder' ) }>
				<Toggle
					label={ __( 'Enable Shadow', 'gambol-builder' ) }
					checked={ shadowEnabled || false }
					onChange={ ( value ) => setAttributes( { shadowEnabled: value } ) }
					help={ shadowEnabled ? __( 'Soft drop shadow applied.', 'gambol-builder' ) : '' }
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

			{/* Padding Fine-tuning */}
			<Section title={ __( 'Padding (Fine-tune)', 'gambol-builder' ) }>
				<SpacingBox
					value={ padding || { top: 0, right: 16, bottom: 0, left: 16 } }
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
					blockTitle={ __( 'Container', 'gambol-builder' ) }
					blockIcon={ <ContainerIcon /> }
					layoutTab={ LayoutTab }
					designTab={ DesignTab }
					advancedTab={ AdvancedTab }
				/>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
