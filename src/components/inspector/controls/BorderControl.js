/**
 * Border Control Component
 *
 * Control for configuring CSS borders.
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ColorControl from './ColorControl';

/**
 * Border style options.
 */
const BORDER_STYLES = [
	{ value: 'none', label: __( 'None', 'gambol-builder' ) },
	{ value: 'solid', label: __( 'Solid', 'gambol-builder' ) },
	{ value: 'dashed', label: __( 'Dashed', 'gambol-builder' ) },
	{ value: 'dotted', label: __( 'Dotted', 'gambol-builder' ) },
	{ value: 'double', label: __( 'Double', 'gambol-builder' ) },
];

/**
 * Default border values.
 */
const DEFAULT_BORDER = {
	width: 0,
	style: 'solid',
	color: '#dddddd',
	radius: {
		topLeft: 0,
		topRight: 0,
		bottomRight: 0,
		bottomLeft: 0,
	},
};

/**
 * Border Control Component
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.label     Control label.
 * @param {Object}   props.value     Border values.
 * @param {Function} props.onChange  Change callback.
 * @param {boolean}  props.showRadius Show border radius controls.
 * @return {JSX.Element} Border control element.
 */
const BorderControl = ( {
	label = __( 'Border', 'gambol-builder' ),
	value = DEFAULT_BORDER,
	onChange,
	showRadius = true,
} ) => {
	const [ isLinkedRadius, setIsLinkedRadius ] = useState( true );

	// Merge with defaults.
	const border = {
		...DEFAULT_BORDER,
		...value,
		radius: { ...DEFAULT_BORDER.radius, ...( value?.radius || {} ) },
	};

	/**
	 * Update border value.
	 *
	 * @param {string} key Property key.
	 * @param {any}    val New value.
	 */
	const updateBorder = ( key, val ) => {
		onChange( { ...border, [ key ]: val } );
	};

	/**
	 * Update border radius.
	 *
	 * @param {string} corner Corner key.
	 * @param {number} val    New value.
	 */
	const updateRadius = ( corner, val ) => {
		const numValue = parseInt( val ) || 0;

		if ( isLinkedRadius ) {
			// Apply to all corners.
			onChange( {
				...border,
				radius: {
					topLeft: numValue,
					topRight: numValue,
					bottomRight: numValue,
					bottomLeft: numValue,
				},
			} );
		} else {
			// Apply to single corner.
			onChange( {
				...border,
				radius: {
					...border.radius,
					[ corner ]: numValue,
				},
			} );
		}
	};

	/**
	 * Handle reset.
	 */
	const handleReset = () => {
		onChange( DEFAULT_BORDER );
	};

	return (
		<div className="gambol-border-control">
			<div className="gambol-border-header">
				<label className="gambol-border-label">{ label }</label>
				<button
					type="button"
					className="gambol-reset-btn"
					onClick={ handleReset }
					aria-label={ __( 'Reset', 'gambol-builder' ) }
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C8.5 3 5.5 5 4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						<path d="M3 3V8H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</button>
			</div>

			<div className="gambol-border-body">
				{/* Border Width */}
				<div className="gambol-border-row">
					<label>{ __( 'Width', 'gambol-builder' ) }</label>
					<div className="gambol-border-width-input">
						<input
							type="number"
							value={ border.width }
							onChange={ ( e ) => updateBorder( 'width', parseInt( e.target.value ) || 0 ) }
							min={ 0 }
							max={ 20 }
						/>
						<span className="gambol-border-unit">px</span>
					</div>
				</div>

				{/* Border Style */}
				<div className="gambol-border-row">
					<label>{ __( 'Style', 'gambol-builder' ) }</label>
					<div className="gambol-border-style-picker">
						{ BORDER_STYLES.map( ( style ) => (
							<button
								key={ style.value }
								type="button"
								className={ `gambol-border-style-btn ${ border.style === style.value ? 'is-active' : '' }` }
								onClick={ () => updateBorder( 'style', style.value ) }
								title={ style.label }
							>
								<span
									className="gambol-border-style-preview"
									style={ { borderBottomStyle: style.value } }
								/>
							</button>
						) ) }
					</div>
				</div>

				{/* Border Color */}
				<ColorControl
					label={ __( 'Color', 'gambol-builder' ) }
					value={ border.color }
					onChange={ ( color ) => updateBorder( 'color', color ) }
					showPalette={ true }
				/>

				{/* Border Radius */}
				{ showRadius && (
					<div className="gambol-border-radius">
						<div className="gambol-border-radius-header">
							<label>{ __( 'Radius', 'gambol-builder' ) }</label>
							<button
								type="button"
								className={ `gambol-link-btn ${ isLinkedRadius ? 'is-linked' : '' }` }
								onClick={ () => setIsLinkedRadius( ! isLinkedRadius ) }
								aria-label={ isLinkedRadius ? __( 'Unlink values', 'gambol-builder' ) : __( 'Link values', 'gambol-builder' ) }
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9404 15.7513 14.6897C16.4231 14.4389 17.0331 14.0463 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.479 3.53087C19.552 2.60383 18.2979 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									<path d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3934 9.60706C11.7642 9.26329 11.0685 9.05886 10.3533 9.00769C9.63816 8.95651 8.92037 9.05964 8.24861 9.31035C7.57685 9.56107 6.96684 9.95372 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.4479 21.3962 5.70197 21.922 7.01295 21.9334C8.32393 21.9448 9.58694 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</button>
						</div>

						<div className="gambol-border-radius-grid">
							<div className="gambol-radius-input gambol-radius-tl">
								<input
									type="number"
									value={ border.radius.topLeft }
									onChange={ ( e ) => updateRadius( 'topLeft', e.target.value ) }
									min={ 0 }
									placeholder="0"
								/>
							</div>
							<div className="gambol-radius-input gambol-radius-tr">
								<input
									type="number"
									value={ border.radius.topRight }
									onChange={ ( e ) => updateRadius( 'topRight', e.target.value ) }
									min={ 0 }
									placeholder="0"
								/>
							</div>
							<div className="gambol-radius-visual">
								<span
									style={ {
										borderRadius: `${ border.radius.topLeft }px ${ border.radius.topRight }px ${ border.radius.bottomRight }px ${ border.radius.bottomLeft }px`,
									} }
								/>
							</div>
							<div className="gambol-radius-input gambol-radius-bl">
								<input
									type="number"
									value={ border.radius.bottomLeft }
									onChange={ ( e ) => updateRadius( 'bottomLeft', e.target.value ) }
									min={ 0 }
									placeholder="0"
								/>
							</div>
							<div className="gambol-radius-input gambol-radius-br">
								<input
									type="number"
									value={ border.radius.bottomRight }
									onChange={ ( e ) => updateRadius( 'bottomRight', e.target.value ) }
									min={ 0 }
									placeholder="0"
								/>
							</div>
						</div>
					</div>
				) }
			</div>
		</div>
	);
};

export default BorderControl;
