/**
 * Spacing Control Component
 *
 * Controls for margin and padding with linked/unlinked values.
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Link icon for linked mode.
 */
const LinkIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9404 15.7513 14.6897C16.4231 14.4389 17.0331 14.0463 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.479 3.53087C19.552 2.60383 18.2979 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		<path d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3934 9.60706C11.7642 9.26329 11.0685 9.05886 10.3533 9.00769C9.63816 8.95651 8.92037 9.05964 8.24861 9.31035C7.57685 9.56107 6.96684 9.95372 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.4479 21.3962 5.70197 21.922 7.01295 21.9334C8.32393 21.9448 9.58694 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
);

/**
 * Unlink icon for unlinked mode.
 */
const UnlinkIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M18.84 12.25L21.54 9.54C22.4508 8.59695 22.9548 7.33394 22.9434 6.02296C22.932 4.71198 22.4061 3.45791 21.479 2.53087C20.552 1.60383 19.2979 1.07799 17.987 1.0666C16.676 1.0552 15.413 1.55918 14.47 2.47L11.77 5.16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		<path d="M5.16 11.75L2.46 14.46C1.54917 15.403 1.04519 16.666 1.05659 17.977C1.06798 19.288 1.59382 20.5421 2.52086 21.4691C3.4479 22.3962 4.70197 22.922 6.01295 22.9334C7.32393 22.9448 8.58694 22.4408 9.53 21.53L12.23 18.84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		<path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
);

/**
 * Spacing directions.
 */
const DIRECTIONS = [
	{ key: 'top', label: __( 'Top', 'gambol-builder' ) },
	{ key: 'right', label: __( 'Right', 'gambol-builder' ) },
	{ key: 'bottom', label: __( 'Bottom', 'gambol-builder' ) },
	{ key: 'left', label: __( 'Left', 'gambol-builder' ) },
];

/**
 * Spacing Control Component
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.label     Control label.
 * @param {Object}   props.value     Current spacing values { top, right, bottom, left }.
 * @param {Function} props.onChange  Change callback.
 * @param {number}   props.min       Minimum value.
 * @param {number}   props.max       Maximum value.
 * @param {string}   props.unit      Value unit.
 * @param {Array}    props.units     Available units.
 * @return {JSX.Element} Spacing control element.
 */
const SpacingControl = ( {
	label,
	value = { top: 0, right: 0, bottom: 0, left: 0 },
	onChange,
	min = 0,
	max = 200,
	unit = 'px',
	units = [ 'px', '%', 'em', 'rem' ],
} ) => {
	const [ isLinked, setIsLinked ] = useState( true );
	const [ currentUnit, setCurrentUnit ] = useState( unit );

	/**
	 * Handle single value change.
	 *
	 * @param {string} direction Direction key.
	 * @param {string} newValue  New value.
	 */
	const handleChange = ( direction, newValue ) => {
		const numValue = parseFloat( newValue ) || 0;

		if ( isLinked ) {
			// Apply to all directions.
			onChange( {
				top: numValue,
				right: numValue,
				bottom: numValue,
				left: numValue,
			}, currentUnit );
		} else {
			// Apply to single direction.
			onChange( {
				...value,
				[ direction ]: numValue,
			}, currentUnit );
		}
	};

	/**
	 * Handle unit change.
	 *
	 * @param {string} newUnit New unit.
	 */
	const handleUnitChange = ( newUnit ) => {
		setCurrentUnit( newUnit );
		onChange( value, newUnit );
	};

	/**
	 * Handle reset.
	 */
	const handleReset = () => {
		onChange( { top: 0, right: 0, bottom: 0, left: 0 }, currentUnit );
	};

	return (
		<div className="gambol-spacing-control">
			<div className="gambol-spacing-header">
				<label className="gambol-spacing-label">{ label }</label>

				<div className="gambol-spacing-actions">
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

					<button
						type="button"
						className={ `gambol-link-btn ${ isLinked ? 'is-linked' : '' }` }
						onClick={ () => setIsLinked( ! isLinked ) }
						aria-label={ isLinked ? __( 'Unlink values', 'gambol-builder' ) : __( 'Link values', 'gambol-builder' ) }
					>
						{ isLinked ? <LinkIcon /> : <UnlinkIcon /> }
					</button>

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
			</div>

			<div className="gambol-spacing-body">
				<div className="gambol-spacing-grid">
					{ DIRECTIONS.map( ( dir ) => (
						<div key={ dir.key } className={ `gambol-spacing-input-group gambol-spacing-${ dir.key }` }>
							<label className="gambol-spacing-input-label">{ dir.label.charAt( 0 ) }</label>
							<input
								type="number"
								className="gambol-spacing-input"
								value={ value[ dir.key ] || 0 }
								onChange={ ( e ) => handleChange( dir.key, e.target.value ) }
								min={ min }
								max={ max }
							/>
						</div>
					) ) }

					<div className="gambol-spacing-visual">
						<div className="gambol-spacing-box">
							<span className="gambol-spacing-box-inner" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SpacingControl;
