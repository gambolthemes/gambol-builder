/**
 * Color Picker Control (Redesigned)
 *
 * Color palette with custom color picker using WordPress ColorPalette.
 * Dark theme optimized.
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import { ColorPicker, Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Default color palette (Gambol brand + common colors)
const DEFAULT_PALETTE = [
	{ name: __( 'Accent', 'gambol-builder' ), color: '#00d4aa' },
	{ name: __( 'Primary', 'gambol-builder' ), color: '#1e1e1e' },
	{ name: __( 'Secondary', 'gambol-builder' ), color: '#3b82f6' },
	{ name: __( 'Success', 'gambol-builder' ), color: '#22c55e' },
	{ name: __( 'Warning', 'gambol-builder' ), color: '#f59e0b' },
	{ name: __( 'Error', 'gambol-builder' ), color: '#ef4444' },
	{ name: __( 'White', 'gambol-builder' ), color: '#ffffff' },
	{ name: __( 'Light', 'gambol-builder' ), color: '#f5f5f5' },
	{ name: __( 'Gray', 'gambol-builder' ), color: '#9ca3af' },
	{ name: __( 'Dark', 'gambol-builder' ), color: '#374151' },
];

/**
 * ColorPicker Component.
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.label     Control label.
 * @param {string}   props.value     Current color value.
 * @param {Function} props.onChange  Change handler.
 * @param {Array}    props.palette   Custom color palette.
 * @param {boolean}  props.allowCustom Allow custom color picker.
 * @return {JSX.Element} ColorPicker element.
 */
export default function GambolColorPicker( {
	label,
	value,
	onChange,
	palette = DEFAULT_PALETTE,
	allowCustom = true,
} ) {
	const [ showPicker, setShowPicker ] = useState( false );

	// Handle swatch click
	const handleSwatchClick = ( color ) => {
		onChange( color );
	};

	// Handle clear
	const handleClear = () => {
		onChange( undefined );
	};

	return (
		<div className="gambol-control">
			{ label && (
				<div className="gambol-control-header">
					<span className="gambol-control-label">{ label }</span>
				</div>
			) }
			
			<div className="gambol-color-picker">
				{ /* Color Swatches */ }
				<div className="gambol-color-swatches">
					{ palette.map( ( colorItem ) => (
						<button
							key={ colorItem.color }
							type="button"
							className={ `gambol-color-swatch ${ value === colorItem.color ? 'is-selected' : '' }` }
							style={ { backgroundColor: colorItem.color } }
							onClick={ () => handleSwatchClick( colorItem.color ) }
							aria-label={ colorItem.name }
							title={ colorItem.name }
						/>
					) ) }
					{ /* Transparent/Clear button */ }
					<button
						type="button"
						className={ `gambol-color-swatch is-transparent ${ ! value ? 'is-selected' : '' }` }
						onClick={ handleClear }
						aria-label={ __( 'Clear', 'gambol-builder' ) }
						title={ __( 'Clear color', 'gambol-builder' ) }
					/>
				</div>

				{ /* Custom Color Input */ }
				{ allowCustom && (
					<div className="gambol-color-custom">
						<button
							type="button"
							className="gambol-color-preview"
							style={ { backgroundColor: value || 'transparent' } }
							onClick={ () => setShowPicker( ! showPicker ) }
							aria-label={ __( 'Pick custom color', 'gambol-builder' ) }
						/>
						<input
							type="text"
							className="gambol-color-input"
							value={ value || '' }
							onChange={ ( e ) => onChange( e.target.value ) }
							placeholder="#000000"
						/>
					</div>
				) }

				{ /* Color Picker Popover */ }
				{ showPicker && (
					<Popover
						position="bottom left"
						onClose={ () => setShowPicker( false ) }
						focusOnMount={ true }
					>
						<div style={ { padding: '12px' } }>
							<ColorPicker
								color={ value }
								onChange={ onChange }
								enableAlpha
							/>
						</div>
					</Popover>
				) }
			</div>
		</div>
	);
}
