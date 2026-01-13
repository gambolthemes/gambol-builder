/**
 * Dropdown Select Control
 *
 * Custom dropdown with native accessibility.
 *
 * @package GambolBuilder
 */

import { useState, useRef, useEffect } from '@wordpress/element';

// Chevron icon
const ChevronIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
		<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
	</svg>
);

/**
 * Dropdown Component.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.label    Control label.
 * @param {string}   props.value    Current value.
 * @param {Function} props.onChange Change handler.
 * @param {Array}    props.options  Options array: { value, label, icon }.
 * @param {string}   props.help     Help text.
 * @return {JSX.Element} Dropdown element.
 */
export default function Dropdown( {
	label,
	value,
	onChange,
	options = [],
	help,
} ) {
	const [ isOpen, setIsOpen ] = useState( false );
	const wrapperRef = useRef( null );

	// Close on outside click
	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( wrapperRef.current && ! wrapperRef.current.contains( event.target ) ) {
				setIsOpen( false );
			}
		};

		document.addEventListener( 'mousedown', handleClickOutside );
		return () => document.removeEventListener( 'mousedown', handleClickOutside );
	}, [] );

	// Get current option
	const currentOption = options.find( ( opt ) => opt.value === value );

	const handleSelect = ( optionValue ) => {
		onChange( optionValue );
		setIsOpen( false );
	};

	const handleKeyDown = ( e ) => {
		if ( e.key === 'Escape' ) {
			setIsOpen( false );
		}
		if ( e.key === 'Enter' || e.key === ' ' ) {
			e.preventDefault();
			setIsOpen( ! isOpen );
		}
	};

	return (
		<div className="gambol-control" ref={ wrapperRef }>
			{ label && (
				<div className="gambol-control-header">
					<span className="gambol-control-label">{ label }</span>
				</div>
			) }
			<div className="gambol-select">
				<button
					type="button"
					className={ `gambol-select-trigger ${ isOpen ? 'is-open' : '' }` }
					onClick={ () => setIsOpen( ! isOpen ) }
					onKeyDown={ handleKeyDown }
					aria-haspopup="listbox"
					aria-expanded={ isOpen }
				>
					<span>{ currentOption?.label || value }</span>
					<ChevronIcon />
				</button>

				{ isOpen && (
					<ul className="gambol-select-dropdown" role="listbox">
						{ options.map( ( option ) => (
							<li
								key={ option.value }
								className={ `gambol-select-option ${ value === option.value ? 'is-selected' : '' }` }
								onClick={ () => handleSelect( option.value ) }
								role="option"
								aria-selected={ value === option.value }
							>
								{ option.icon && option.icon }
								<span>{ option.label }</span>
							</li>
						) ) }
					</ul>
				) }
			</div>
			{ help && <p className="gambol-help">{ help }</p> }
		</div>
	);
}
