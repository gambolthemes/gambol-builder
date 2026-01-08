/**
 * Spacing Control (Margin/Padding)
 *
 * Four-value spacing control with linked/unlinked mode.
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Link icons
const LinkIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
		<path d="M15.6 7.2H14v1.5h1.6c2 0 3.7 1.7 3.7 3.7s-1.7 3.7-3.7 3.7H14v1.5h1.6c2.8 0 5.2-2.3 5.2-5.2 0-2.9-2.3-5.2-5.2-5.2zM4.7 12.4c0-2 1.7-3.7 3.7-3.7H10V7.2H8.4c-2.9 0-5.2 2.3-5.2 5.2 0 2.9 2.3 5.2 5.2 5.2H10v-1.5H8.4c-2 0-3.7-1.7-3.7-3.7zm4.6.5h5.3v-1.5H9.3v1.5z"/>
	</svg>
);

const UnlinkIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
		<path d="M15.6 7.2H14v1.5h1.6c2 0 3.7 1.7 3.7 3.7 0 .8-.3 1.6-.7 2.2l1.1 1.1c.7-.9 1.1-2.1 1.1-3.3 0-2.9-2.3-5.2-5.2-5.2zM2.5 4.7l1.4-1.4 15.8 15.8-1.4 1.4-3.2-3.2c-.3 0-.7.1-1 .1H14v-1.5h.5l-3.5-3.5v3.5h-1.5v-5l-3.8-3.8c-.5.8-.8 1.8-.8 2.9 0 2 1.7 3.7 3.7 3.7H10v1.5H8.4c-2.9 0-5.2-2.3-5.2-5.2 0-1.4.6-2.7 1.5-3.7L2.5 4.7z"/>
	</svg>
);

/**
 * SpacingBox Component.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.label    Control label.
 * @param {Object}   props.value    Current values { top, right, bottom, left }.
 * @param {Function} props.onChange Change handler.
 * @param {string}   props.unit     Unit display.
 * @return {JSX.Element} SpacingBox element.
 */
export default function SpacingBox( {
	label,
	value = { top: 0, right: 0, bottom: 0, left: 0 },
	onChange,
	unit = 'px',
} ) {
	const [ isLinked, setIsLinked ] = useState( true );

	// Handle individual value change
	const handleChange = ( side, newValue ) => {
		const numValue = parseInt( newValue ) || 0;

		if ( isLinked ) {
			// Update all values when linked
			onChange( {
				top: numValue,
				right: numValue,
				bottom: numValue,
				left: numValue,
			} );
		} else {
			// Update single value
			onChange( {
				...value,
				[ side ]: numValue,
			} );
		}
	};

	return (
		<div className="gambol-control">
			<div className="gambol-spacing">
				<div className="gambol-spacing-header">
					<span className="gambol-control-label">{ label }</span>
					<button
						type="button"
						className={ `gambol-spacing-link ${ isLinked ? 'is-linked' : '' }` }
						onClick={ () => setIsLinked( ! isLinked ) }
						aria-label={ isLinked ? __( 'Unlink values', 'gambol-builder' ) : __( 'Link values', 'gambol-builder' ) }
					>
						{ isLinked ? <LinkIcon /> : <UnlinkIcon /> }
					</button>
				</div>

				<div className="gambol-spacing-grid">
					<div className="gambol-spacing-input is-top">
						<label>{ __( 'Top', 'gambol-builder' ) }</label>
						<input
							type="number"
							value={ value.top }
							onChange={ ( e ) => handleChange( 'top', e.target.value ) }
						/>
					</div>

					<div className="gambol-spacing-input is-right">
						<label>{ __( 'Right', 'gambol-builder' ) }</label>
						<input
							type="number"
							value={ value.right }
							onChange={ ( e ) => handleChange( 'right', e.target.value ) }
						/>
					</div>

					<div className="gambol-spacing-input is-bottom">
						<label>{ __( 'Bottom', 'gambol-builder' ) }</label>
						<input
							type="number"
							value={ value.bottom }
							onChange={ ( e ) => handleChange( 'bottom', e.target.value ) }
						/>
					</div>

					<div className="gambol-spacing-input is-left">
						<label>{ __( 'Left', 'gambol-builder' ) }</label>
						<input
							type="number"
							value={ value.left }
							onChange={ ( e ) => handleChange( 'left', e.target.value ) }
						/>
					</div>

					<div className="gambol-spacing-center">
						<span />
					</div>
				</div>
			</div>
		</div>
	);
}
