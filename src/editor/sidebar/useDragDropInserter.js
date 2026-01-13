/**
 * Gambol Builder - Drag Drop Inserter Hook
 * 
 * Comprehensive drag and drop functionality for block insertion
 * into the Gutenberg canvas. Handles both iframe and non-iframe editors.
 *
 * @package GambolBuilder
 */

import { useEffect, useCallback, useRef, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock, getBlockType } from '@wordpress/blocks';

/**
 * CSS for drag/drop visual feedback.
 */
const DRAG_DROP_STYLES = `
	@keyframes gambol-pulse {
		0%, 100% { opacity: 1; transform: scaleX(1); }
		50% { opacity: 0.7; transform: scaleX(0.98); }
	}
	
	@keyframes gambol-slide-in {
		from { opacity: 0; transform: translateY(-4px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.gambol-drop-indicator {
		position: absolute;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, #00d4aa 0%, #00eabb 50%, #00d4aa 100%);
		background-size: 200% 100%;
		border-radius: 2px;
		pointer-events: none;
		z-index: 999999;
		box-shadow: 0 0 12px rgba(0, 212, 170, 0.6), 0 0 4px rgba(0, 212, 170, 0.8);
		animation: gambol-pulse 1.2s ease-in-out infinite;
	}

	.gambol-drop-indicator::before,
	.gambol-drop-indicator::after {
		content: '';
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 8px;
		height: 8px;
		background: #00d4aa;
		border-radius: 50%;
		box-shadow: 0 0 8px rgba(0, 212, 170, 0.8);
	}

	.gambol-drop-indicator::before { left: -4px; }
	.gambol-drop-indicator::after { right: -4px; }

	.gambol-canvas-drag-active {
		outline: 2px dashed rgba(0, 212, 170, 0.4) !important;
		outline-offset: -2px;
	}

	.gambol-block-drop-target {
		outline: 2px solid rgba(0, 212, 170, 0.3) !important;
		outline-offset: 2px;
		border-radius: 4px;
	}

	.gambol-drag-ghost {
		position: fixed;
		padding: 10px 16px;
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		color: #1a1a1a;
		border-radius: 8px;
		font-size: 13px;
		font-weight: 500;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 212, 170, 0.5);
		pointer-events: none;
		z-index: 999999;
		display: flex;
		align-items: center;
		gap: 8px;
		animation: gambol-slide-in 0.15s ease-out;
		white-space: nowrap;
	}

	.gambol-drag-ghost::before {
		content: '+';
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		background: #00d4aa;
		color: #121212;
		border-radius: 4px;
		font-weight: 700;
		font-size: 14px;
	}
`;

/**
 * Get the editor canvas element (handles both iframe and non-iframe).
 *
 * @return {Object} Canvas element and document reference.
 */
const getEditorCanvas = () => {
	// Try iframe first (WordPress 6.0+)
	const iframe = document.querySelector( 'iframe[name="editor-canvas"]' );
	if ( iframe?.contentDocument?.body ) {
		return {
			canvas: iframe.contentDocument.querySelector( '.block-editor-block-list__layout' )
				|| iframe.contentDocument.body,
			doc: iframe.contentDocument,
			isIframe: true,
		};
	}

	// Fallback to non-iframe editor
	const canvas = document.querySelector( '.editor-styles-wrapper' )
		|| document.querySelector( '.block-editor-block-list__layout' );

	return {
		canvas,
		doc: document,
		isIframe: false,
	};
};

/**
 * Custom hook for handling drag and drop block insertion.
 *
 * @return {Object} Drag drop state and utilities.
 */
export const useDragDropInserter = () => {
	const [ isDragging, setIsDragging ] = useState( false );
	const [ draggedBlock, setDraggedBlock ] = useState( null );
	
	const dragGhostRef = useRef( null );
	const dropIndicatorRef = useRef( null );
	const dragOverTimeoutRef = useRef( null );
	const currentTargetRef = useRef( null );
	
	const { insertBlock } = useDispatch( 'core/block-editor' );
	
	const { 
		getBlockInsertionPoint, 
		getBlocks, 
		getBlockIndex,
		getBlockRootClientId,
		getBlockOrder,
	} = useSelect( ( select ) => ( {
		getBlockInsertionPoint: select( 'core/block-editor' ).getBlockInsertionPoint,
		getBlocks: select( 'core/block-editor' ).getBlocks,
		getBlockIndex: select( 'core/block-editor' ).getBlockIndex,
		getBlockRootClientId: select( 'core/block-editor' ).getBlockRootClientId,
		getBlockOrder: select( 'core/block-editor' ).getBlockOrder,
	} ), [] );

	/**
	 * Inject drag/drop styles.
	 */
	const injectStyles = useCallback( ( doc = document ) => {
		const styleId = 'gambol-drag-drop-styles';
		if ( ! doc.getElementById( styleId ) ) {
			const style = doc.createElement( 'style' );
			style.id = styleId;
			style.textContent = DRAG_DROP_STYLES;
			doc.head.appendChild( style );
		}
	}, [] );

	/**
	 * Create and show the drag ghost element.
	 */
	const showDragGhost = useCallback( ( blockTitle, x, y ) => {
		removeDragGhost();

		const ghost = document.createElement( 'div' );
		ghost.className = 'gambol-drag-ghost';
		ghost.textContent = blockTitle;
		ghost.style.left = `${ x + 16 }px`;
		ghost.style.top = `${ y + 16 }px`;
		
		document.body.appendChild( ghost );
		dragGhostRef.current = ghost;
	}, [] );

	/**
	 * Update drag ghost position.
	 */
	const updateDragGhost = useCallback( ( x, y ) => {
		if ( dragGhostRef.current ) {
			dragGhostRef.current.style.left = `${ x + 16 }px`;
			dragGhostRef.current.style.top = `${ y + 16 }px`;
		}
	}, [] );

	/**
	 * Remove the drag ghost element.
	 */
	const removeDragGhost = useCallback( () => {
		if ( dragGhostRef.current ) {
			dragGhostRef.current.remove();
			dragGhostRef.current = null;
		}
	}, [] );

	/**
	 * Find the closest block element and determine insertion position.
	 */
	const findDropTarget = useCallback( ( event, canvas, doc ) => {
		if ( ! canvas ) return null;

		const blocks = canvas.querySelectorAll( '[data-block]' );
		if ( blocks.length === 0 ) {
			// Empty canvas - insert at beginning
			return {
				element: canvas,
				insertBefore: true,
				clientId: null,
				index: 0,
				rootClientId: '',
				isEmpty: true,
			};
		}

		let closestBlock = null;
		let closestDistance = Infinity;
		let insertBefore = false;

		blocks.forEach( ( blockEl ) => {
			const rect = blockEl.getBoundingClientRect();
			
			// Calculate distance to block edges
			const topDistance = Math.abs( event.clientY - rect.top );
			const bottomDistance = Math.abs( event.clientY - rect.bottom );
			const minDistance = Math.min( topDistance, bottomDistance );

			if ( minDistance < closestDistance ) {
				closestDistance = minDistance;
				closestBlock = blockEl;
				insertBefore = topDistance < bottomDistance;
			}
		} );

		if ( ! closestBlock ) return null;

		const clientId = closestBlock.dataset.block;
		const rootClientId = getBlockRootClientId( clientId ) || '';
		const blockIndex = getBlockIndex( clientId, rootClientId );

		return {
			element: closestBlock,
			insertBefore,
			clientId,
			index: insertBefore ? blockIndex : blockIndex + 1,
			rootClientId,
			isEmpty: false,
		};
	}, [ getBlockIndex, getBlockRootClientId ] );

	/**
	 * Show drop indicator at the target position.
	 */
	const showDropIndicator = useCallback( ( dropTarget, canvas, doc ) => {
		removeDropIndicator();

		if ( ! dropTarget || ! canvas ) return;

		const indicator = doc.createElement( 'div' );
		indicator.className = 'gambol-drop-indicator';
		indicator.setAttribute( 'data-gambol-drop-indicator', 'true' );

		if ( dropTarget.isEmpty ) {
			// Empty canvas - show indicator at top
			const canvasRect = canvas.getBoundingClientRect();
			indicator.style.cssText = `
				position: absolute;
				top: 20px;
				left: 20px;
				right: 20px;
				width: auto;
			`;
		} else {
			const rect = dropTarget.element.getBoundingClientRect();
			const canvasRect = canvas.getBoundingClientRect();
			
			// Position relative to canvas
			const scrollTop = canvas.scrollTop || 0;
			const scrollLeft = canvas.scrollLeft || 0;
			
			const top = dropTarget.insertBefore 
				? rect.top - canvasRect.top + scrollTop - 2
				: rect.bottom - canvasRect.top + scrollTop - 2;

			indicator.style.cssText = `
				position: absolute;
				top: ${ top }px;
				left: ${ rect.left - canvasRect.left + scrollLeft }px;
				width: ${ rect.width }px;
			`;

			// Highlight target block
			dropTarget.element.classList.add( 'gambol-block-drop-target' );
			currentTargetRef.current = dropTarget.element;
		}

		// Ensure canvas has relative positioning
		if ( getComputedStyle( canvas ).position === 'static' ) {
			canvas.style.position = 'relative';
		}

		canvas.appendChild( indicator );
		dropIndicatorRef.current = indicator;
	}, [] );

	/**
	 * Remove drop indicator and target highlighting.
	 */
	const removeDropIndicator = useCallback( () => {
		// Remove indicator from both main doc and iframe
		const indicators = [
			...document.querySelectorAll( '[data-gambol-drop-indicator]' ),
		];
		
		const { doc } = getEditorCanvas();
		if ( doc !== document ) {
			indicators.push( ...doc.querySelectorAll( '[data-gambol-drop-indicator]' ) );
		}

		indicators.forEach( ( el ) => el.remove() );
		dropIndicatorRef.current = null;

		// Remove target highlighting
		if ( currentTargetRef.current ) {
			currentTargetRef.current.classList.remove( 'gambol-block-drop-target' );
			currentTargetRef.current = null;
		}

		// Remove from all documents
		document.querySelectorAll( '.gambol-block-drop-target' ).forEach( ( el ) => {
			el.classList.remove( 'gambol-block-drop-target' );
		} );
	}, [] );

	/**
	 * Handle the drop event.
	 */
	const handleDrop = useCallback( ( event ) => {
		event.preventDefault();
		event.stopPropagation();

		// Get block name from drag data
		let blockName = event.dataTransfer.getData( 'text/plain' );
		
		// Try structured data first
		try {
			const gambolData = event.dataTransfer.getData( 'application/gambol-block' );
			if ( gambolData ) {
				const parsed = JSON.parse( gambolData );
				blockName = parsed.name;
			}
		} catch ( e ) {
			// Use plain text fallback
		}

		if ( ! blockName ) {
			cleanup();
			return;
		}

		// Verify block type exists
		const blockType = getBlockType( blockName );
		if ( ! blockType ) {
			console.warn( `[Gambol] Cannot insert: block "${ blockName }" not registered.` );
			cleanup();
			return;
		}

		// Find drop position
		const { canvas, doc } = getEditorCanvas();
		const dropTarget = findDropTarget( event, canvas, doc );

		// Create and insert block
		const newBlock = createBlock( blockName );
		
		const insertIndex = dropTarget?.index ?? getBlockInsertionPoint().index;
		const rootClientId = dropTarget?.rootClientId ?? getBlockInsertionPoint().rootClientId;

		insertBlock( newBlock, insertIndex, rootClientId, true );

		// Cleanup
		cleanup();

		// Log for debugging
		console.log( `[Gambol] Inserted ${ blockName } at index ${ insertIndex }` );
	}, [ findDropTarget, getBlockInsertionPoint, insertBlock ] );

	/**
	 * Handle drag over event.
	 */
	const handleDragOver = useCallback( ( event ) => {
		event.preventDefault();
		event.stopPropagation();
		event.dataTransfer.dropEffect = 'copy';

		// Update ghost position
		updateDragGhost( event.clientX, event.clientY );

		// Throttle indicator updates
		if ( dragOverTimeoutRef.current ) return;

		dragOverTimeoutRef.current = requestAnimationFrame( () => {
			dragOverTimeoutRef.current = null;
			
			const { canvas, doc } = getEditorCanvas();
			const dropTarget = findDropTarget( event, canvas, doc );
			showDropIndicator( dropTarget, canvas, doc );
		} );
	}, [ findDropTarget, showDropIndicator, updateDragGhost ] );

	/**
	 * Handle drag enter event.
	 */
	const handleDragEnter = useCallback( ( event ) => {
		event.preventDefault();
		const { canvas } = getEditorCanvas();
		if ( canvas ) {
			canvas.classList.add( 'gambol-canvas-drag-active' );
		}
	}, [] );

	/**
	 * Handle drag leave event.
	 */
	const handleDragLeave = useCallback( ( event ) => {
		const { canvas } = getEditorCanvas();
		
		// Only cleanup if leaving the canvas entirely
		if ( canvas && ! canvas.contains( event.relatedTarget ) ) {
			canvas.classList.remove( 'gambol-canvas-drag-active' );
			removeDropIndicator();
		}
	}, [ removeDropIndicator ] );

	/**
	 * Cleanup all drag state.
	 */
	const cleanup = useCallback( () => {
		setIsDragging( false );
		setDraggedBlock( null );
		removeDragGhost();
		removeDropIndicator();

		const { canvas } = getEditorCanvas();
		if ( canvas ) {
			canvas.classList.remove( 'gambol-canvas-drag-active' );
		}

		if ( dragOverTimeoutRef.current ) {
			cancelAnimationFrame( dragOverTimeoutRef.current );
			dragOverTimeoutRef.current = null;
		}
	}, [ removeDragGhost, removeDropIndicator ] );

	/**
	 * Initialize event listeners.
	 */
	useEffect( () => {
		// Inject styles into main document
		injectStyles( document );

		// Set up listeners with a delay to ensure editor is ready
		const setupListeners = () => {
			const { canvas, doc, isIframe } = getEditorCanvas();
			
			if ( ! canvas ) {
				// Retry if canvas not ready
				setTimeout( setupListeners, 500 );
				return;
			}

			// Inject styles into iframe if needed
			if ( isIframe ) {
				injectStyles( doc );
			}

			// Add event listeners to canvas
			canvas.addEventListener( 'drop', handleDrop, true );
			canvas.addEventListener( 'dragover', handleDragOver, true );
			canvas.addEventListener( 'dragenter', handleDragEnter, true );
			canvas.addEventListener( 'dragleave', handleDragLeave, true );

			// Also listen on document for drag end cleanup
			document.addEventListener( 'dragend', cleanup );

			return () => {
				canvas.removeEventListener( 'drop', handleDrop, true );
				canvas.removeEventListener( 'dragover', handleDragOver, true );
				canvas.removeEventListener( 'dragenter', handleDragEnter, true );
				canvas.removeEventListener( 'dragleave', handleDragLeave, true );
				document.removeEventListener( 'dragend', cleanup );
				cleanup();
			};
		};

		const cleanupFn = setupListeners();

		// Re-setup on editor changes
		const observer = new MutationObserver( () => {
			const { canvas } = getEditorCanvas();
			if ( canvas && ! canvas.hasAttribute( 'data-gambol-listeners' ) ) {
				canvas.setAttribute( 'data-gambol-listeners', 'true' );
				setupListeners();
			}
		} );

		observer.observe( document.body, { childList: true, subtree: true } );

		return () => {
			observer.disconnect();
			if ( typeof cleanupFn === 'function' ) {
				cleanupFn();
			}
			cleanup();
		};
	}, [ handleDrop, handleDragOver, handleDragEnter, handleDragLeave, cleanup, injectStyles ] );

	return {
		isDragging,
		draggedBlock,
		showDragGhost,
		removeDragGhost,
		cleanup,
	};
};

export default useDragDropInserter;
