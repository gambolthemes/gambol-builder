/**
 * Range Slider Control
 *
 * Native range input with number input and unit selector.
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Reset icon
const ResetIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
		<path d="M12 5V2L8 6l4 4V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/>
	</svg>
);

/**
 * RangeSlider Component.
 *
 * @param {Object}   props              Component props.
 * @param {string}   props.label        Control label.
 * @param {number}   props.value        Current value.
 * @param {Function} props.onChange     Change handler.
 * @param {number}   props.min          Minimum value.
 * @param {number}   props.max          Maximum value.
 * @param {number}   props.step         Step increment.
 * @param {string}   props.unit         Unit display (px, %, etc).
 * @param {Array}    props.units        Available units.
 * @param {Function} props.onUnitChange Unit change handler.
 * @param {number}   props.defaultValue Default for reset.
 * @param {boolean}  props.showReset    Show reset button.
 * @return {JSX.Element} RangeSlider element.
 */
export default function RangeSlider( {
	label,
	value = 0,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	unit = 'px',
	units = [],
	onUnitChange,
	defaultValue,
	showReset = true,
} ) {
	const handleInputChange = ( e ) => {
		const newValue = parseFloat( e.target.value );
		if ( ! isNaN( newValue ) ) {
			onChange( Math.min( max, Math.max( min, newValue ) ) );
		}
	};

	const handleReset = () => {
		if ( defaultValue !== undefined ) {
			onChange( defaultValue );
		}
	};

	const hasChanged = defaultValue !== undefined && value !== defaultValue;

	return (
		<div className="gambol-control">
			<div className="gambol-control-header">
				<span className="gambol-control-label">{ label }</span>
				<div className="gambol-control-actions">
					{ units.length > 0 && (
						<div className="gambol-units">
							{ units.map( ( u ) => (
								<button
									key={ u }
									type="button"
									className={ `gambol-unit ${ unit === u ? 'is-active' : '' }` }
									onClick={ () => onUnitChange?.( u ) }
								>
									{ u }
								</button>
							) ) }
						</div>
					) }
					{ showReset && hasChanged && (
						<button
							type="button"
							className="gambol-icon-btn"
							onClick={ handleReset }
							aria-label={ __( 'Reset', 'gambol-builder' ) }
						>
							<ResetIcon />
						</button>
					) }
				</div>
			</div>
			<div className="gambol-range">
				<div className="gambol-range-track">
					<input
						type="range"
						className="gambol-range-slider"
						value={ value }
						onChange={ ( e ) => onChange( parseFloat( e.target.value ) ) }
						min={ min }
						max={ max }
						step={ step }
					/>
					<input
						type="number"
						className="gambol-range-input"
						value={ value }
						onChange={ handleInputChange }
						min={ min }
						max={ max }
						step={ step }
					/>
					{ ! units.length && unit && (
						<span className="gambol-range-unit">{ unit }</span>
					) }
				</div>
			</div>
		</div>
	);
}
