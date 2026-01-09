/**
 * Gambol Builder - Search Bar Component
 * 
 * Search input for filtering blocks in the sidebar.
 *
 * @package GambolBuilder
 */

import { useState, useRef, useCallback, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Search Icon
 */
const SearchIcon = () => (
	<svg 
		viewBox="0 0 24 24" 
		fill="none" 
		stroke="currentColor" 
		strokeWidth="1.5" 
		strokeLinecap="round" 
		strokeLinejoin="round"
		width="18"
		height="18"
		aria-hidden="true"
	>
		<circle cx="11" cy="11" r="8" />
		<line x1="21" y1="21" x2="16.65" y2="16.65" />
	</svg>
);

/**
 * Clear Icon
 */
const ClearIcon = () => (
	<svg 
		viewBox="0 0 24 24" 
		fill="none" 
		stroke="currentColor" 
		strokeWidth="2" 
		strokeLinecap="round" 
		strokeLinejoin="round"
		width="14"
		height="14"
		aria-hidden="true"
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
);

/**
 * SearchBar Component
 * 
 * Renders a search input with clear button.
 *
 * @param {Object} props - Component props.
 * @param {string} props.value - Current search value.
 * @param {Function} props.onChange - Callback when value changes.
 * @param {string} props.placeholder - Input placeholder text.
 * @return {JSX.Element} Search bar element.
 */
const SearchBar = ( { 
	value = '', 
	onChange, 
	placeholder = __( 'Search Gambol blocks…', 'gambol-builder' ),
} ) => {
	const inputRef = useRef( null );
	const [ isFocused, setIsFocused ] = useState( false );

	/**
	 * Handle input change.
	 */
	const handleChange = useCallback( ( event ) => {
		onChange?.( event.target.value );
	}, [ onChange ] );

	/**
	 * Clear the search input.
	 */
	const handleClear = useCallback( () => {
		onChange?.( '' );
		inputRef.current?.focus();
	}, [ onChange ] );

	/**
	 * Handle keyboard shortcuts.
	 */
	const handleKeyDown = useCallback( ( event ) => {
		// Clear on Escape
		if ( event.key === 'Escape' && value ) {
			event.preventDefault();
			handleClear();
		}
	}, [ value, handleClear ] );

	/**
	 * Global keyboard shortcut to focus search.
	 */
	useEffect( () => {
		const handleGlobalKeyDown = ( event ) => {
			// Focus search on Ctrl/Cmd + F when sidebar is active
			if ( ( event.ctrlKey || event.metaKey ) && event.key === 'f' ) {
				const sidebar = document.querySelector( '.gambol-left-sidebar' );
				if ( sidebar && document.body.contains( sidebar ) ) {
					event.preventDefault();
					inputRef.current?.focus();
				}
			}
		};

		document.addEventListener( 'keydown', handleGlobalKeyDown );
		return () => document.removeEventListener( 'keydown', handleGlobalKeyDown );
	}, [] );

	const containerClasses = [
		'gambol-search-bar',
		isFocused && 'gambol-search-bar--focused',
		value && 'gambol-search-bar--has-value',
	].filter( Boolean ).join( ' ' );

	return (
		<div className={ containerClasses }>
			<span className="gambol-search-bar__icon" aria-hidden="true">
				<SearchIcon />
			</span>
			<input
				ref={ inputRef }
				type="text"
				className="gambol-search-bar__input"
				value={ value }
				onChange={ handleChange }
				onKeyDown={ handleKeyDown }
				onFocus={ () => setIsFocused( true ) }
				onBlur={ () => setIsFocused( false ) }
				placeholder={ placeholder }
				aria-label={ __( 'Search blocks', 'gambol-builder' ) }
				autoComplete="off"
				spellCheck="false"
			/>
			{ value && (
				<button
					type="button"
					className="gambol-search-bar__clear"
					onClick={ handleClear }
					aria-label={ __( 'Clear search', 'gambol-builder' ) }
				>
					<ClearIcon />
				</button>
			) }
		</div>
	);
};

export default SearchBar;
