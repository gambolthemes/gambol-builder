/**
 * Spacer Block - Edit Component
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	RangeSlider,
	Dropdown,
	Toggle,
	TextInput,
	GambolColorPicker,
} from '../../components/inspector';

/**
 * Spacer icon for header.
 */
const SpacerBlockIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M3 7h18v2H3V7zm0 8h18v2H3v-2z"/>
	</svg>
);

/**
 * Device icons.
 */
const DesktopIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
		<path d="M20 3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6v2H7v2h10v-2h-3v-2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H4V5h16v10z"/>
	</svg>
);

const TabletIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
		<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h12v16zm-6-1c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
	</svg>
);

const MobileIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
		<path d="M16 1H8c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 20H8V3h8v18zm-4-2c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
	</svg>
);

/**
 * Spacer Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		height,
		heightTablet,
		heightMobile,
		unit,
		showDivider,
		dividerStyle,
		dividerWidth,
		dividerColor,
		dividerAlignment,
		dividerLength,
		htmlId,
		cssClasses,
	} = attributes;

	const [ activeDevice, setActiveDevice ] = useState( 'desktop' );

	// Get current height based on device
	const getCurrentHeight = () => {
		switch ( activeDevice ) {
			case 'tablet':
				return heightTablet;
			case 'mobile':
				return heightMobile;
			default:
				return height;
		}
	};

	// Set height for current device
	const setCurrentHeight = ( value ) => {
		switch ( activeDevice ) {
			case 'tablet':
				setAttributes( { heightTablet: value } );
				break;
			case 'mobile':
				setAttributes( { heightMobile: value } );
				break;
			default:
				setAttributes( { height: value } );
		}
	};

	// Build inline styles
	const spacerStyles = {
		height: `${ height }${ unit }`,
	};

	const dividerStyles = showDivider ? {
		borderTopStyle: dividerStyle,
		borderTopWidth: `${ dividerWidth }px`,
		borderTopColor: dividerColor,
		width: `${ dividerLength }%`,
	} : {};

	// Build class names
	const className = [
		'gambol-spacer',
		showDivider ? 'gambol-spacer--has-divider' : '',
		showDivider ? `gambol-spacer--align-${ dividerAlignment }` : '',
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps( {
		className,
		style: spacerStyles,
		id: htmlId || undefined,
	} );

	// Layout tab content
	const layoutTab = (
		<>
			<Section title={ __( 'Height', 'gambol-builder' ) }>
				<div className="gambol-device-switcher">
					<button
						type="button"
						className={ `gambol-device-btn ${ activeDevice === 'desktop' ? 'is-active' : '' }` }
						onClick={ () => setActiveDevice( 'desktop' ) }
						title={ __( 'Desktop', 'gambol-builder' ) }
					>
						<DesktopIcon />
					</button>
					<button
						type="button"
						className={ `gambol-device-btn ${ activeDevice === 'tablet' ? 'is-active' : '' }` }
						onClick={ () => setActiveDevice( 'tablet' ) }
						title={ __( 'Tablet', 'gambol-builder' ) }
					>
						<TabletIcon />
					</button>
					<button
						type="button"
						className={ `gambol-device-btn ${ activeDevice === 'mobile' ? 'is-active' : '' }` }
						onClick={ () => setActiveDevice( 'mobile' ) }
						title={ __( 'Mobile', 'gambol-builder' ) }
					>
						<MobileIcon />
					</button>
				</div>

				<RangeSlider
					label={ __( 'Height', 'gambol-builder' ) + ` (${ activeDevice })` }
					value={ getCurrentHeight() }
					min={ 0 }
					max={ 500 }
					step={ 1 }
					onChange={ setCurrentHeight }
				/>

				<ButtonGroup
					label={ __( 'Unit', 'gambol-builder' ) }
					value={ unit }
					options={ [
						{ value: 'px', label: 'px' },
						{ value: 'vh', label: 'vh' },
						{ value: 'rem', label: 'rem' },
					] }
					onChange={ ( value ) => setAttributes( { unit: value } ) }
				/>
			</Section>
		</>
	);

	// Design tab content
	const designTab = (
		<>
			<Section title={ __( 'Divider', 'gambol-builder' ) }>
				<Toggle
					label={ __( 'Show Divider', 'gambol-builder' ) }
					checked={ showDivider }
					onChange={ ( value ) => setAttributes( { showDivider: value } ) }
				/>

				{ showDivider && (
					<>
						<Dropdown
							label={ __( 'Style', 'gambol-builder' ) }
							value={ dividerStyle }
							options={ [
								{ value: 'solid', label: __( 'Solid', 'gambol-builder' ) },
								{ value: 'dashed', label: __( 'Dashed', 'gambol-builder' ) },
								{ value: 'dotted', label: __( 'Dotted', 'gambol-builder' ) },
								{ value: 'double', label: __( 'Double', 'gambol-builder' ) },
							] }
							onChange={ ( value ) => setAttributes( { dividerStyle: value } ) }
						/>

						<RangeSlider
							label={ __( 'Width', 'gambol-builder' ) }
							value={ dividerWidth }
							min={ 1 }
							max={ 10 }
							step={ 1 }
							onChange={ ( value ) => setAttributes( { dividerWidth: value } ) }
						/>

						<GambolColorPicker
							label={ __( 'Color', 'gambol-builder' ) }
							value={ dividerColor }
							onChange={ ( value ) => setAttributes( { dividerColor: value } ) }
						/>

						<RangeSlider
							label={ __( 'Length', 'gambol-builder' ) }
							value={ dividerLength }
							min={ 10 }
							max={ 100 }
							step={ 5 }
							onChange={ ( value ) => setAttributes( { dividerLength: value } ) }
						/>

						<ButtonGroup
							label={ __( 'Alignment', 'gambol-builder' ) }
							value={ dividerAlignment }
							options={ [
								{ value: 'left', label: __( 'Left', 'gambol-builder' ) },
								{ value: 'center', label: __( 'Center', 'gambol-builder' ) },
								{ value: 'right', label: __( 'Right', 'gambol-builder' ) },
							] }
							onChange={ ( value ) => setAttributes( { dividerAlignment: value } ) }
						/>
					</>
				) }
			</Section>
		</>
	);

	// Advanced tab content
	const advancedTab = (
		<>
			<Section title={ __( 'Attributes', 'gambol-builder' ) }>
				<TextInput
					label={ __( 'HTML ID', 'gambol-builder' ) }
					value={ htmlId }
					onChange={ ( value ) => setAttributes( { htmlId: value } ) }
					placeholder="my-spacer"
				/>
				<TextInput
					label={ __( 'CSS Classes', 'gambol-builder' ) }
					value={ cssClasses }
					onChange={ ( value ) => setAttributes( { cssClasses: value } ) }
					placeholder="class-1 class-2"
				/>
			</Section>

			<Section title={ __( 'Responsive Values', 'gambol-builder' ) }>
				<p className="gambol-help-text">
					{ __( 'Current responsive heights:', 'gambol-builder' ) }
				</p>
				<ul className="gambol-values-list">
					<li><strong>{ __( 'Desktop:', 'gambol-builder' ) }</strong> { height }{ unit }</li>
					<li><strong>{ __( 'Tablet:', 'gambol-builder' ) }</strong> { heightTablet }{ unit }</li>
					<li><strong>{ __( 'Mobile:', 'gambol-builder' ) }</strong> { heightMobile }{ unit }</li>
				</ul>
			</Section>
		</>
	);

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Spacer', 'gambol-builder' ) }
					blockIcon={ <SpacerBlockIcon /> }
					layoutTab={ layoutTab }
					designTab={ designTab }
					advancedTab={ advancedTab }
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ showDivider && (
					<hr
						className="gambol-spacer__divider"
						style={ dividerStyles }
						aria-hidden="true"
					/>
				) }
				<span className="gambol-spacer__label">
					{ height }{ unit }
				</span>
			</div>
		</>
	);
}
