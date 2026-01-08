/**
 * Color Control Component
 *
 * Color picker with palette support and custom color input.
 *
 * @package GambolBuilder
 */

import { useState, useRef, useEffect } from '@wordpress/element';
import { ColorPicker, Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Default color palette.
 */
const DEFAULT_PALETTE = [
	{ name: 'Primary', color: '#0073aa' },
	{ name: 'Secondary', color: '#23282d' },
	{ name: 'Success', color: '#00a32a' },
	{ name: 'Warning', color: '#dba617' },
	{ name: 'Error', color: '#d63638' },
	{ name: 'White', color: '#ffffff' },
	{ name: 'Light Gray', color: '#f5f5f5' },
	{ name: 'Dark Gray', color: '#757575' },
	{ name: 'Black', color: '#1e1e1e' },
];

/**
 * Color Control Component
 *
 * @param {Object}   props                Component props.
 * @param {string}   props.label          Control label.
 * @param {string}   props.value          Current color value.
 * @param {Function} props.onChange       Change callback.
 * @param {Array}    props.palette        Color palette.
 * @param {boolean}  props.enableAlpha    Enable alpha channel.
 * @param {boolean}  props.showPalette    Show color palette.
 * @param {boolean}  props.showReset      Show reset button.
 * @param {string}   props.defaultValue   Default color for reset.
 * @return {JSX.Element} Color control element.
 */
const ColorControl = ( {
	label,
	value = '',
	onChange,
	palette = DEFAULT_PALETTE,
	enableAlpha = true,
	showPalette = true,
	showReset = true,
	defaultValue = '',
} ) => {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ inputValue, setInputValue ] = useState( value );
	const buttonRef = useRef( null );

	useEffect( () => {
		setInputValue( value );
	}, [ value ] );

	/**
	 * Handle color selection from palette.
	 *
	 * @param {string} color Selected color.
	 */
	const handlePaletteSelect = ( color ) => {
		onChange( color );
		setInputValue( color );
	};

	/**
	 * Handle custom color change.
	 *
	 * @param {string} color New color value.
	 */
	const handleColorChange = ( color ) => {
		onChange( color );
		setInputValue( color );
	};

	/**
	 * Handle hex input change.
	 *
	 * @param {Event} e Change event.
	 */
	const handleInputChange = ( e ) => {
		const newValue = e.target.value;
		setInputValue( newValue );

		// Validate and apply.
		if ( /^#([0-9A-Fa-f]{3}){1,2}$/.test( newValue ) || /^rgba?\(/.test( newValue ) ) {
			onChange( newValue );
		}
	};

	/**
	 * Handle reset.
	 */
	const handleReset = () => {
		onChange( defaultValue );
		setInputValue( defaultValue );
	};

	return (
		<div className="gambol-color-control">
			<div className="gambol-color-header">
				<label className="gambol-color-label">{ label }</label>

				{ showReset && value && (
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

			<div className="gambol-color-body">
				<button
					ref={ buttonRef }
					type="button"
					className="gambol-color-preview"
					onClick={ () => setIsOpen( ! isOpen ) }
					aria-expanded={ isOpen }
					style={ { backgroundColor: value || 'transparent' } }
				>
					{ ! value && (
						<span className="gambol-color-empty">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
								<line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2"/>
							</svg>
						</span>
					) }
				</button>

				<input
					type="text"
					className="gambol-color-input"
					value={ inputValue }
					onChange={ handleInputChange }
					placeholder="#000000"
				/>
			</div>

			{ showPalette && (
				<div className="gambol-color-palette">
					{ palette.map( ( item, index ) => (
						<button
							key={ index }
							type="button"
							className={ `gambol-color-swatch ${ value === item.color ? 'is-active' : '' }` }
							style={ { backgroundColor: item.color } }
							onClick={ () => handlePaletteSelect( item.color ) }
							aria-label={ item.name }
							title={ item.name }
						/>
					) ) }
				</div>
			) }

			{ isOpen && (
				<Popover
					anchor={ buttonRef.current }
					onClose={ () => setIsOpen( false ) }
					className="gambol-color-popover"
					placement="left-start"
				>
					<ColorPicker
						color={ value }
						onChange={ handleColorChange }
						enableAlpha={ enableAlpha }
					/>
				</Popover>
			) }
		</div>
	);
};

export default ColorControl;
