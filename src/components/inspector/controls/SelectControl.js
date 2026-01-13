/**
 * Select Control Component
 *
 * A styled select dropdown with optional icons.
 *
 * @package GambolBuilder
 */

import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Chevron icon.
 */
const ChevronIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
);

/**
 * Select Control Component
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.label     Control label.
 * @param {string}   props.value     Current value.
 * @param {Function} props.onChange  Change callback.
 * @param {Array}    props.options   Options array [{ value, label, icon? }].
 * @param {string}   props.help      Help text.
 * @return {JSX.Element} Select control element.
 */
const SelectControl = ( {
	label,
	value,
	onChange,
	options = [],
	help,
} ) => {
	const [ isOpen, setIsOpen ] = useState( false );
	const wrapperRef = useRef( null );

	// Get current option label.
	const currentOption = options.find( ( opt ) => opt.value === value );

	/**
	 * Handle click outside.
	 */
	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( wrapperRef.current && ! wrapperRef.current.contains( event.target ) ) {
				setIsOpen( false );
			}
		};

		document.addEventListener( 'mousedown', handleClickOutside );
		return () => document.removeEventListener( 'mousedown', handleClickOutside );
	}, [] );

	/**
	 * Handle option select.
	 *
	 * @param {string} optionValue Selected value.
	 */
	const handleSelect = ( optionValue ) => {
		onChange( optionValue );
		setIsOpen( false );
	};

	/**
	 * Handle keyboard navigation.
	 *
	 * @param {KeyboardEvent} e Keyboard event.
	 */
	const handleKeyDown = ( e ) => {
		if ( e.key === 'Escape' ) {
			setIsOpen( false );
		} else if ( e.key === 'Enter' || e.key === ' ' ) {
			e.preventDefault();
			setIsOpen( ! isOpen );
		} else if ( e.key === 'ArrowDown' && isOpen ) {
			e.preventDefault();
			const currentIndex = options.findIndex( ( opt ) => opt.value === value );
			const nextIndex = ( currentIndex + 1 ) % options.length;
			onChange( options[ nextIndex ].value );
		} else if ( e.key === 'ArrowUp' && isOpen ) {
			e.preventDefault();
			const currentIndex = options.findIndex( ( opt ) => opt.value === value );
			const prevIndex = ( currentIndex - 1 + options.length ) % options.length;
			onChange( options[ prevIndex ].value );
		}
	};

	return (
		<div className="gambol-select-control" ref={ wrapperRef }>
			{ label && (
				<label className="gambol-select-label">{ label }</label>
			) }

			<div className="gambol-select-wrapper">
				<button
					type="button"
					className={ `gambol-select-trigger ${ isOpen ? 'is-open' : '' }` }
					onClick={ () => setIsOpen( ! isOpen ) }
					onKeyDown={ handleKeyDown }
					aria-haspopup="listbox"
					aria-expanded={ isOpen }
				>
					<span className="gambol-select-value">
						{ currentOption?.icon && (
							<span className="gambol-select-icon">{ currentOption.icon }</span>
						) }
						<span>{ currentOption?.label || __( 'Select…', 'gambol-builder' ) }</span>
					</span>
					<span className="gambol-select-arrow">
						<ChevronIcon />
					</span>
				</button>

				{ isOpen && (
					<ul className="gambol-select-dropdown" role="listbox">
						{ options.map( ( option ) => (
							<li
								key={ option.value }
								role="option"
								aria-selected={ option.value === value }
								className={ `gambol-select-option ${ option.value === value ? 'is-selected' : '' }` }
								onClick={ () => handleSelect( option.value ) }
							>
								{ option.icon && (
									<span className="gambol-select-option-icon">{ option.icon }</span>
								) }
								<span>{ option.label }</span>
							</li>
						) ) }
					</ul>
				) }
			</div>

			{ help && (
				<p className="gambol-select-help">{ help }</p>
			) }
		</div>
	);
};

export default SelectControl;
