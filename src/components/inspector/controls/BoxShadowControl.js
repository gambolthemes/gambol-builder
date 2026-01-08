/**
 * Box Shadow Control Component
 *
 * Control for configuring CSS box-shadow.
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ColorControl from './ColorControl';

/**
 * Box Shadow Presets
 */
const PRESETS = [
	{
		name: __( 'None', 'gambol-builder' ),
		value: { x: 0, y: 0, blur: 0, spread: 0, color: 'transparent', inset: false },
	},
	{
		name: __( 'Small', 'gambol-builder' ),
		value: { x: 0, y: 1, blur: 3, spread: 0, color: 'rgba(0,0,0,0.12)', inset: false },
	},
	{
		name: __( 'Medium', 'gambol-builder' ),
		value: { x: 0, y: 4, blur: 6, spread: -1, color: 'rgba(0,0,0,0.1)', inset: false },
	},
	{
		name: __( 'Large', 'gambol-builder' ),
		value: { x: 0, y: 10, blur: 15, spread: -3, color: 'rgba(0,0,0,0.1)', inset: false },
	},
	{
		name: __( 'Extra Large', 'gambol-builder' ),
		value: { x: 0, y: 20, blur: 25, spread: -5, color: 'rgba(0,0,0,0.1)', inset: false },
	},
];

/**
 * Default shadow values.
 */
const DEFAULT_SHADOW = {
	x: 0,
	y: 4,
	blur: 10,
	spread: 0,
	color: 'rgba(0, 0, 0, 0.1)',
	inset: false,
};

/**
 * Box Shadow Control Component
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.label     Control label.
 * @param {Object}   props.value     Shadow values { x, y, blur, spread, color, inset }.
 * @param {Function} props.onChange  Change callback.
 * @param {boolean}  props.showPresets Show preset buttons.
 * @return {JSX.Element} Box shadow control element.
 */
const BoxShadowControl = ( {
	label = __( 'Box Shadow', 'gambol-builder' ),
	value = DEFAULT_SHADOW,
	onChange,
	showPresets = true,
} ) => {
	const [ isExpanded, setIsExpanded ] = useState( false );

	// Merge with defaults.
	const shadow = { ...DEFAULT_SHADOW, ...value };

	/**
	 * Update shadow value.
	 *
	 * @param {string} key   Property key.
	 * @param {any}    val   New value.
	 */
	const updateShadow = ( key, val ) => {
		onChange( { ...shadow, [ key ]: val } );
	};

	/**
	 * Apply preset.
	 *
	 * @param {Object} preset Preset shadow values.
	 */
	const applyPreset = ( preset ) => {
		onChange( preset.value );
	};

	/**
	 * Generate CSS value.
	 *
	 * @return {string} CSS box-shadow value.
	 */
	const getCSSValue = () => {
		const { x, y, blur, spread, color, inset } = shadow;
		const insetStr = inset ? 'inset ' : '';
		return `${ insetStr }${ x }px ${ y }px ${ blur }px ${ spread }px ${ color }`;
	};

	return (
		<div className="gambol-shadow-control">
			<div className="gambol-shadow-header">
				<label className="gambol-shadow-label">{ label }</label>
				<button
					type="button"
					className="gambol-shadow-toggle"
					onClick={ () => setIsExpanded( ! isExpanded ) }
				>
					{ isExpanded ? __( 'Collapse', 'gambol-builder' ) : __( 'Expand', 'gambol-builder' ) }
				</button>
			</div>

			{ showPresets && (
				<div className="gambol-shadow-presets">
					{ PRESETS.map( ( preset, index ) => (
						<button
							key={ index }
							type="button"
							className="gambol-shadow-preset"
							onClick={ () => applyPreset( preset ) }
							title={ preset.name }
						>
							<span
								className="gambol-shadow-preset-preview"
								style={ {
									boxShadow: preset.value.color === 'transparent'
										? 'none'
										: `${ preset.value.inset ? 'inset ' : '' }${ preset.value.x }px ${ preset.value.y }px ${ preset.value.blur }px ${ preset.value.spread }px ${ preset.value.color }`,
								} }
							/>
						</button>
					) ) }
				</div>
			) }

			{ isExpanded && (
				<div className="gambol-shadow-body">
					<div className="gambol-shadow-row">
						<div className="gambol-shadow-field">
							<label>{ __( 'X', 'gambol-builder' ) }</label>
							<input
								type="number"
								value={ shadow.x }
								onChange={ ( e ) => updateShadow( 'x', parseInt( e.target.value ) || 0 ) }
							/>
						</div>
						<div className="gambol-shadow-field">
							<label>{ __( 'Y', 'gambol-builder' ) }</label>
							<input
								type="number"
								value={ shadow.y }
								onChange={ ( e ) => updateShadow( 'y', parseInt( e.target.value ) || 0 ) }
							/>
						</div>
					</div>

					<div className="gambol-shadow-row">
						<div className="gambol-shadow-field">
							<label>{ __( 'Blur', 'gambol-builder' ) }</label>
							<input
								type="number"
								value={ shadow.blur }
								onChange={ ( e ) => updateShadow( 'blur', parseInt( e.target.value ) || 0 ) }
								min={ 0 }
							/>
						</div>
						<div className="gambol-shadow-field">
							<label>{ __( 'Spread', 'gambol-builder' ) }</label>
							<input
								type="number"
								value={ shadow.spread }
								onChange={ ( e ) => updateShadow( 'spread', parseInt( e.target.value ) || 0 ) }
							/>
						</div>
					</div>

					<ColorControl
						label={ __( 'Color', 'gambol-builder' ) }
						value={ shadow.color }
						onChange={ ( color ) => updateShadow( 'color', color ) }
						enableAlpha={ true }
						showPalette={ false }
					/>

					<div className="gambol-shadow-inset">
						<label>
							<input
								type="checkbox"
								checked={ shadow.inset }
								onChange={ ( e ) => updateShadow( 'inset', e.target.checked ) }
							/>
							{ __( 'Inset', 'gambol-builder' ) }
						</label>
					</div>
				</div>
			) }

			<div className="gambol-shadow-preview">
				<div
					className="gambol-shadow-preview-box"
					style={ { boxShadow: getCSSValue() } }
				/>
			</div>
		</div>
	);
};

export default BoxShadowControl;
