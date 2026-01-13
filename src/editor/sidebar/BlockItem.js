/**
 * Gambol Builder - Block Item Component
 * 
 * Individual draggable block item in the sidebar.
 * Supports click-to-insert and drag-to-drop functionality.
 *
 * @package GambolBuilder
 */

import { useState, useRef, useCallback, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock, getBlockType } from '@wordpress/blocks';
import { Tooltip } from '@wordpress/components';

import BlockIcon from './BlockIcon';
import { getBlockByName } from './block-registry';

/**
 * BlockItem Component
 * 
 * Renders a single block that can be clicked or dragged to insert.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.block - Block definition object.
 * @param {Function} props.onInsert - Callback after insertion.
 * @return {JSX.Element} Block item element.
 */
const BlockItem = ( { block, onInsert } ) => {
	const [ isDragging, setIsDragging ] = useState( false );
	const [ isHovered, setIsHovered ] = useState( false );
	const [ isInserting, setIsInserting ] = useState( false );
	const buttonRef = useRef( null );
	const dragGhostRef = useRef( null );

	const { insertBlock } = useDispatch( 'core/block-editor' );
	
	const { getBlockInsertionPoint } = useSelect( ( select ) => ( {
		getBlockInsertionPoint: select( 'core/block-editor' ).getBlockInsertionPoint,
	} ), [] );

	/**
	 * Handle block insertion on click.
	 */
	const handleClick = useCallback( () => {
		if ( block.disabled || isInserting ) {
			return;
		}

		// Check if block type is registered
		const blockType = getBlockType( block.name );
		if ( ! blockType ) {
			console.warn( `[Gambol] Block type "${ block.name }" is not registered.` );
			return;
		}

		setIsInserting( true );

		// Get default attributes from registry
		const blockDef = getBlockByName( block.name );
		const defaultAttrs = blockDef?.defaultAttributes || {};

		// Create and insert the block
		const newBlock = createBlock( block.name, defaultAttrs );
		const insertionPoint = getBlockInsertionPoint();
		
		insertBlock(
			newBlock,
			insertionPoint.index,
			insertionPoint.rootClientId,
			true // Select block after insertion
		);

		// Visual feedback
		setTimeout( () => setIsInserting( false ), 300 );

		// Callback for analytics or UI feedback
		if ( onInsert ) {
			onInsert( block );
		}

		console.log( `[Gambol] Inserted ${ block.name } via click` );
	}, [ block, insertBlock, getBlockInsertionPoint, onInsert, isInserting ] );

	/**
	 * Create custom drag ghost element.
	 */
	const createDragGhost = useCallback( ( blockTitle ) => {
		const ghost = document.createElement( 'div' );
		ghost.className = 'gambol-sidebar-drag-ghost';
		ghost.innerHTML = `
			<span class="gambol-sidebar-drag-ghost__icon">+</span>
			<span class="gambol-sidebar-drag-ghost__text">${ blockTitle }</span>
		`;
		ghost.style.cssText = `
			position: fixed;
			top: -1000px;
			left: -1000px;
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 10px 16px;
			background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
			color: #1a1a1a;
			border-radius: 8px;
			font-size: 13px;
			font-weight: 500;
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 212, 170, 0.5);
			pointer-events: none;
			z-index: 999999;
			white-space: nowrap;
		`;
		
		const iconEl = ghost.querySelector( '.gambol-sidebar-drag-ghost__icon' );
		if ( iconEl ) {
			iconEl.style.cssText = `
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
			`;
		}

		return ghost;
	}, [] );

	/**
	 * Handle drag start.
	 */
	const handleDragStart = useCallback( ( event ) => {
		if ( block.disabled ) {
			event.preventDefault();
			return;
		}

		setIsDragging( true );

		// Set drag data in multiple formats for compatibility
		event.dataTransfer.setData( 'text/plain', block.name );
		event.dataTransfer.setData( 'text', block.name ); // Legacy fallback
		event.dataTransfer.setData( 'application/gambol-block', JSON.stringify( {
			name: block.name,
			title: block.title,
			type: 'gambol-block',
			timestamp: Date.now(),
		} ) );

		// Create custom drag image
		const ghost = createDragGhost( block.title );
		document.body.appendChild( ghost );
		dragGhostRef.current = ghost;

		// Position ghost off-screen initially, then use as drag image
		// Use a small offset so cursor isn't hidden
		event.dataTransfer.setDragImage( ghost, 0, 0 );

		// Set drag effect
		event.dataTransfer.effectAllowed = 'copy';

		// Add dragging class to body for global styling
		document.body.classList.add( 'gambol-is-dragging-block' );

		// Clean up ghost after a frame (it's been captured as drag image)
		requestAnimationFrame( () => {
			requestAnimationFrame( () => {
				if ( dragGhostRef.current && dragGhostRef.current.parentNode ) {
					dragGhostRef.current.remove();
					dragGhostRef.current = null;
				}
			} );
		} );

		console.log( `[Gambol] Started dragging ${ block.name }` );
	}, [ block, createDragGhost ] );

	/**
	 * Handle drag end.
	 */
	const handleDragEnd = useCallback( () => {
		setIsDragging( false );
		
		// Remove global dragging class
		document.body.classList.remove( 'gambol-is-dragging-block' );

		// Cleanup any remaining ghost elements
		if ( dragGhostRef.current ) {
			dragGhostRef.current.remove();
			dragGhostRef.current = null;
		}

		// Remove any orphaned ghost elements
		document.querySelectorAll( '.gambol-sidebar-drag-ghost' ).forEach( ( el ) => el.remove() );
	}, [] );

	/**
	 * Handle keyboard interaction.
	 */
	const handleKeyDown = useCallback( ( event ) => {
		if ( event.key === 'Enter' || event.key === ' ' ) {
			event.preventDefault();
			handleClick();
		}
	}, [ handleClick ] );

	/**
	 * Cleanup on unmount.
	 */
	useEffect( () => {
		return () => {
			if ( dragGhostRef.current ) {
				dragGhostRef.current.remove();
			}
		};
	}, [] );

	const isDisabled = block.disabled;
	const blockClasses = [
		'gambol-block-item',
		isDragging && 'gambol-block-item--dragging',
		isHovered && 'gambol-block-item--hover',
		isDisabled && 'gambol-block-item--disabled',
		isInserting && 'gambol-block-item--inserting',
	].filter( Boolean ).join( ' ' );

	const tooltipContent = isDisabled
		? __( 'Coming soon', 'gambol-builder' )
		: block.description;

	return (
		<Tooltip text={ tooltipContent } placement="right">
			<button
				ref={ buttonRef }
				className={ blockClasses }
				onClick={ handleClick }
				onKeyDown={ handleKeyDown }
				onMouseEnter={ () => setIsHovered( true ) }
				onMouseLeave={ () => setIsHovered( false ) }
				draggable={ ! isDisabled }
				onDragStart={ handleDragStart }
				onDragEnd={ handleDragEnd }
				disabled={ isDisabled }
				aria-label={ `${ __( 'Insert', 'gambol-builder' ) } ${ block.title }` }
				aria-disabled={ isDisabled }
				tabIndex={ isDisabled ? -1 : 0 }
				data-block-name={ block.name }
			>
				<span className="gambol-block-item__icon">
					<BlockIcon type={ block.icon } size="md" />
				</span>
				<span className="gambol-block-item__title">
					{ block.title }
				</span>
				{ isDisabled && (
					<span className="gambol-block-item__badge">
						{ __( 'Soon', 'gambol-builder' ) }
					</span>
				) }
				{ isInserting && (
					<span className="gambol-block-item__inserting">
						<span className="gambol-block-item__check">✓</span>
					</span>
				) }
			</button>
		</Tooltip>
	);
};

export default BlockItem;
