/**
 * Slider Control Component
 *
 * A custom range slider with live preview and numeric input.
 *
 * @package GambolBuilder
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Slider Control Component
 *
 * @param {Object}   props             Component props.
 * @param {string}   props.label       Control label.
 * @param {number}   props.value       Current value.
 * @param {Function} props.onChange    Change callback.
 * @param {number}   props.min         Minimum value.
 * @param {number}   props.max         Maximum value.
 * @param {number}   props.step        Step increment.
 * @param {string}   props.unit        Value unit (px, %, em, etc.).
 * @param {Array}    props.units       Available units.
 * @param {boolean}  props.showInput   Show numeric input.
 * @param {boolean}  props.showReset   Show reset button.
 * @param {number}   props.defaultValue Default value for reset.
 * @param {string}   props.help        Help text.
 * @return {JSX.Element} Slider control element.
 */
const SliderControl = ( {
	label,
	value = 0,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	unit = 'px',
	units = [ 'px', '%', 'em', 'rem', 'vw', 'vh' ],
	showInput = true,
	showReset = true,
	defaultValue,
	help,
} ) => {
	const [ localValue, setLocalValue ] = useState( value );
	const [ currentUnit, setCurrentUnit ] = useState( unit );

	useEffect( () => {
		setLocalValue( value );
	}, [ value ] );

	/**
	 * Handle slider change.
	 *
	 * @param {Event} e Change event.
	 */
	const handleSliderChange = ( e ) => {
		const newValue = parseFloat( e.target.value );
		setLocalValue( newValue );
		onChange( newValue, currentUnit );
	};

	/**
	 * Handle input change.
	 *
	 * @param {Event} e Change event.
	 */
	const handleInputChange = ( e ) => {
		const newValue = parseFloat( e.target.value ) || 0;
		setLocalValue( newValue );
		onChange( newValue, currentUnit );
	};

	/**
	 * Handle unit change.
	 *
	 * @param {string} newUnit New unit value.
	 */
	const handleUnitChange = ( newUnit ) => {
		setCurrentUnit( newUnit );
		onChange( localValue, newUnit );
	};

	/**
	 * Handle reset.
	 */
	const handleReset = () => {
		const resetValue = defaultValue !== undefined ? defaultValue : min;
		setLocalValue( resetValue );
		onChange( resetValue, currentUnit );
	};

	// Calculate progress percentage for gradient.
	const progress = ( ( localValue - min ) / ( max - min ) ) * 100;

	return (
		<div className="gambol-slider-control">
			<div className="gambol-slider-header">
				<label className="gambol-slider-label">{ label }</label>

				<div className="gambol-slider-actions">
					{ units.length > 1 && (
						<div className="gambol-unit-picker">
							{ units.map( ( u ) => (
								<button
									key={ u }
									type="button"
									className={ `gambol-unit-btn ${ currentUnit === u ? 'is-active' : '' }` }
									onClick={ () => handleUnitChange( u ) }
								>
									{ u }
								</button>
							) ) }
						</div>
					) }

					{ showReset && (
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
					) }
				</div>
			</div>

			<div className="gambol-slider-body">
				<div className="gambol-slider-track-wrapper">
					<input
						type="range"
						className="gambol-slider-range"
						value={ localValue }
						onChange={ handleSliderChange }
						min={ min }
						max={ max }
						step={ step }
						style={ {
							background: `linear-gradient(to right, var(--gambol-primary) 0%, var(--gambol-primary) ${ progress }%, var(--gambol-border) ${ progress }%, var(--gambol-border) 100%)`,
						} }
					/>
				</div>

				{ showInput && (
					<div className="gambol-slider-input-wrapper">
						<input
							type="number"
							className="gambol-slider-input"
							value={ localValue }
							onChange={ handleInputChange }
							min={ min }
							max={ max }
							step={ step }
						/>
						{ units.length === 1 && (
							<span className="gambol-slider-unit">{ currentUnit }</span>
						) }
					</div>
				) }
			</div>

			{ help && (
				<p className="gambol-slider-help">{ help }</p>
			) }
		</div>
	);
};

export default SliderControl;
