/**
 * Gambol Builder - Keyboard Navigation Hook
 * 
 * Provides keyboard navigation support for the sidebar block library.
 *
 * @package GambolBuilder
 */

import { useCallback, useEffect, useRef } from '@wordpress/element';

/**
 * Custom hook for keyboard navigation within the sidebar.
 *
 * @param {Object} options - Configuration options.
 * @param {string} options.containerSelector - Selector for the container element.
 * @param {string} options.itemSelector - Selector for focusable items.
 * @return {Object} Navigation utilities.
 */
export const useKeyboardNavigation = ( {
	containerSelector = '.gambol-sidebar__content',
	itemSelector = '.gambol-block-item:not([disabled])',
} = {} ) => {
	const containerRef = useRef( null );

	/**
	 * Get all focusable items.
	 */
	const getFocusableItems = useCallback( () => {
		const container = containerRef.current 
			|| document.querySelector( containerSelector );
		
		if ( ! container ) {
			return [];
		}

		return Array.from( container.querySelectorAll( itemSelector ) );
	}, [ containerSelector, itemSelector ] );

	/**
	 * Get the currently focused item index.
	 */
	const getCurrentIndex = useCallback( () => {
		const items = getFocusableItems();
		const activeElement = document.activeElement;
		return items.indexOf( activeElement );
	}, [ getFocusableItems ] );

	/**
	 * Focus an item by index.
	 */
	const focusItem = useCallback( ( index ) => {
		const items = getFocusableItems();
		
		if ( index < 0 ) {
			index = items.length - 1;
		} else if ( index >= items.length ) {
			index = 0;
		}

		items[ index ]?.focus();
	}, [ getFocusableItems ] );

	/**
	 * Handle keyboard navigation.
	 */
	const handleKeyDown = useCallback( ( event ) => {
		const items = getFocusableItems();
		const currentIndex = getCurrentIndex();

		// Only handle if an item is focused
		if ( currentIndex === -1 ) {
			return;
		}

		// Grid navigation (2 columns)
		const columns = 2;

		switch ( event.key ) {
			case 'ArrowDown':
				event.preventDefault();
				focusItem( currentIndex + columns );
				break;

			case 'ArrowUp':
				event.preventDefault();
				focusItem( currentIndex - columns );
				break;

			case 'ArrowRight':
				event.preventDefault();
				focusItem( currentIndex + 1 );
				break;

			case 'ArrowLeft':
				event.preventDefault();
				focusItem( currentIndex - 1 );
				break;

			case 'Home':
				event.preventDefault();
				focusItem( 0 );
				break;

			case 'End':
				event.preventDefault();
				focusItem( items.length - 1 );
				break;

			default:
				break;
		}
	}, [ getFocusableItems, getCurrentIndex, focusItem ] );

	/**
	 * Set up event listeners.
	 */
	useEffect( () => {
		const container = document.querySelector( containerSelector );
		
		if ( ! container ) {
			return;
		}

		containerRef.current = container;
		container.addEventListener( 'keydown', handleKeyDown );

		return () => {
			container.removeEventListener( 'keydown', handleKeyDown );
		};
	}, [ containerSelector, handleKeyDown ] );

	return {
		containerRef,
		getFocusableItems,
		focusItem,
	};
};

export default useKeyboardNavigation;
