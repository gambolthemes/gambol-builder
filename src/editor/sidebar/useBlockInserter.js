/**
 * Gambol Builder - Block Inserter Hook
 * 
 * Reusable hook for programmatic block insertion.
 * Provides a clean API for inserting Gambol blocks into the editor.
 *
 * @package GambolBuilder
 */

import { useCallback, useMemo } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock, getBlockType } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';

import { getBlockByName, getEnabledBlocks, BLOCK_PRESETS } from './block-registry';

/**
 * Hook for programmatic block insertion.
 *
 * @return {Object} Insertion utilities and state.
 */
export const useBlockInserter = () => {
	// Dispatchers
	const {
		insertBlock,
		insertBlocks,
		replaceBlock,
		removeBlock,
		selectBlock,
		moveBlockToPosition,
	} = useDispatch( blockEditorStore );

	// Selectors
	const {
		getBlockInsertionPoint,
		getSelectedBlockClientId,
		getBlockIndex,
		getBlockRootClientId,
		getBlocks,
		getBlock,
		getBlockOrder,
		canInsertBlockType,
	} = useSelect( ( select ) => {
		const editor = select( blockEditorStore );
		return {
			getBlockInsertionPoint: editor.getBlockInsertionPoint,
			getSelectedBlockClientId: editor.getSelectedBlockClientId,
			getBlockIndex: editor.getBlockIndex,
			getBlockRootClientId: editor.getBlockRootClientId,
			getBlocks: editor.getBlocks,
			getBlock: editor.getBlock,
			getBlockOrder: editor.getBlockOrder,
			canInsertBlockType: editor.canInsertBlockType,
		};
	}, [] );

	/**
	 * Check if a block can be inserted.
	 *
	 * @param {string} blockName - Block name.
	 * @param {string} rootClientId - Parent block client ID.
	 * @return {boolean} Whether block can be inserted.
	 */
	const canInsert = useCallback( ( blockName, rootClientId = '' ) => {
		// Check if block type exists
		if ( ! getBlockType( blockName ) ) {
			return false;
		}
		// Check if it can be inserted at position
		return canInsertBlockType( blockName, rootClientId );
	}, [ canInsertBlockType ] );

	/**
	 * Insert a single block.
	 *
	 * @param {string} blockName - Block name (e.g., 'gambol/section').
	 * @param {Object} attributes - Block attributes.
	 * @param {Object} options - Insertion options.
	 * @return {Object} Result with success status and clientId.
	 */
	const insert = useCallback( ( blockName, attributes = {}, options = {} ) => {
		const {
			index,
			rootClientId,
			selectAfterInsert = true,
		} = options;

		// Validate block type
		const blockType = getBlockType( blockName );
		if ( ! blockType ) {
			console.error( `[Gambol] Block "${ blockName }" is not registered.` );
			return { success: false, clientId: null, error: 'Block not registered' };
		}

		// Get default attributes from Gambol registry
		const blockDef = getBlockByName( blockName );
		const defaultAttrs = blockDef?.defaultAttributes || {};
		const mergedAttrs = { ...defaultAttrs, ...attributes };

		// Create the block
		const block = createBlock( blockName, mergedAttrs );

		// Determine insertion point
		const insertionPoint = getBlockInsertionPoint();
		const insertIndex = index ?? insertionPoint.index;
		const insertRootId = rootClientId ?? insertionPoint.rootClientId;

		// Insert the block
		try {
			insertBlock( block, insertIndex, insertRootId, selectAfterInsert );
			return { success: true, clientId: block.clientId, error: null };
		} catch ( error ) {
			console.error( '[Gambol] Insert failed:', error );
			return { success: false, clientId: null, error: error.message };
		}
	}, [ insertBlock, getBlockInsertionPoint ] );

	/**
	 * Insert a block after the currently selected block.
	 *
	 * @param {string} blockName - Block name.
	 * @param {Object} attributes - Block attributes.
	 * @return {Object} Result object.
	 */
	const insertAfterSelected = useCallback( ( blockName, attributes = {} ) => {
		const selectedId = getSelectedBlockClientId();
		
		if ( ! selectedId ) {
			// No selection - insert at default position
			return insert( blockName, attributes );
		}

		const rootClientId = getBlockRootClientId( selectedId ) || '';
		const index = getBlockIndex( selectedId, rootClientId ) + 1;

		return insert( blockName, attributes, { index, rootClientId } );
	}, [ insert, getSelectedBlockClientId, getBlockIndex, getBlockRootClientId ] );

	/**
	 * Insert a block as a child of the selected block.
	 *
	 * @param {string} blockName - Block name.
	 * @param {Object} attributes - Block attributes.
	 * @return {Object} Result object.
	 */
	const insertAsChild = useCallback( ( blockName, attributes = {} ) => {
		const selectedId = getSelectedBlockClientId();
		
		if ( ! selectedId ) {
			return { success: false, clientId: null, error: 'No block selected' };
		}

		const childCount = getBlockOrder( selectedId ).length;

		return insert( blockName, attributes, {
			index: childCount,
			rootClientId: selectedId,
		} );
	}, [ insert, getSelectedBlockClientId, getBlockOrder ] );

	/**
	 * Insert multiple blocks at once.
	 *
	 * @param {Array} blockDefs - Array of { name, attributes } objects.
	 * @param {Object} options - Insertion options.
	 * @return {Object} Result with array of clientIds.
	 */
	const insertMultiple = useCallback( ( blockDefs, options = {} ) => {
		const {
			index,
			rootClientId,
			selectAfterInsert = true,
		} = options;

		const blocks = blockDefs.map( ( { name, attributes = {} } ) => {
			const blockDef = getBlockByName( name );
			const defaultAttrs = blockDef?.defaultAttributes || {};
			return createBlock( name, { ...defaultAttrs, ...attributes } );
		} );

		const insertionPoint = getBlockInsertionPoint();
		const insertIndex = index ?? insertionPoint.index;
		const insertRootId = rootClientId ?? insertionPoint.rootClientId;

		try {
			insertBlocks( blocks, insertIndex, insertRootId, selectAfterInsert );
			return {
				success: true,
				clientIds: blocks.map( ( b ) => b.clientId ),
				error: null,
			};
		} catch ( error ) {
			return { success: false, clientIds: [], error: error.message };
		}
	}, [ insertBlocks, getBlockInsertionPoint ] );

	/**
	 * Replace the selected block with a new block.
	 *
	 * @param {string} blockName - Block name.
	 * @param {Object} attributes - Block attributes.
	 * @return {Object} Result object.
	 */
	const replaceSelected = useCallback( ( blockName, attributes = {} ) => {
		const selectedId = getSelectedBlockClientId();
		
		if ( ! selectedId ) {
			return { success: false, clientId: null, error: 'No block selected' };
		}

		const blockDef = getBlockByName( blockName );
		const defaultAttrs = blockDef?.defaultAttributes || {};
		const block = createBlock( blockName, { ...defaultAttrs, ...attributes } );

		try {
			replaceBlock( selectedId, block );
			return { success: true, clientId: block.clientId, error: null };
		} catch ( error ) {
			return { success: false, clientId: null, error: error.message };
		}
	}, [ replaceBlock, getSelectedBlockClientId ] );

	/**
	 * Duplicate the selected block.
	 *
	 * @return {Object} Result object.
	 */
	const duplicateSelected = useCallback( () => {
		const selectedId = getSelectedBlockClientId();
		
		if ( ! selectedId ) {
			return { success: false, clientId: null, error: 'No block selected' };
		}

		const originalBlock = getBlock( selectedId );
		if ( ! originalBlock ) {
			return { success: false, clientId: null, error: 'Block not found' };
		}

		// Deep clone the block with inner blocks
		const cloneBlock = ( block ) => {
			return createBlock(
				block.name,
				{ ...block.attributes },
				block.innerBlocks.map( cloneBlock )
			);
		};

		const duplicate = cloneBlock( originalBlock );
		const rootClientId = getBlockRootClientId( selectedId ) || '';
		const index = getBlockIndex( selectedId, rootClientId ) + 1;

		try {
			insertBlock( duplicate, index, rootClientId, true );
			return { success: true, clientId: duplicate.clientId, error: null };
		} catch ( error ) {
			return { success: false, clientId: null, error: error.message };
		}
	}, [ getSelectedBlockClientId, getBlock, getBlockRootClientId, getBlockIndex, insertBlock ] );

	/**
	 * Remove the selected block.
	 *
	 * @return {Object} Result object.
	 */
	const removeSelected = useCallback( () => {
		const selectedId = getSelectedBlockClientId();
		
		if ( ! selectedId ) {
			return { success: false, error: 'No block selected' };
		}

		try {
			removeBlock( selectedId );
			return { success: true, error: null };
		} catch ( error ) {
			return { success: false, error: error.message };
		}
	}, [ removeBlock, getSelectedBlockClientId ] );

	/**
	 * Insert a preset template.
	 *
	 * @param {string} presetId - Preset template ID.
	 * @return {Object} Result object.
	 */
	const insertPreset = useCallback( ( presetId ) => {
		const preset = BLOCK_PRESETS[ presetId ];
		
		if ( ! preset ) {
			return { success: false, clientId: null, error: `Preset "${ presetId }" not found` };
		}

		// Recursively create blocks from template
		const createFromTemplate = ( template ) => {
			const innerBlocks = ( template.innerBlocks || [] ).map( createFromTemplate );
			return createBlock( template.name, template.attributes || {}, innerBlocks );
		};

		const blocks = preset.blocks.map( createFromTemplate );
		const insertionPoint = getBlockInsertionPoint();

		try {
			insertBlocks( blocks, insertionPoint.index, insertionPoint.rootClientId, true );
			return { success: true, clientId: blocks[ 0 ]?.clientId, error: null };
		} catch ( error ) {
			return { success: false, clientId: null, error: error.message };
		}
	}, [ insertBlocks, getBlockInsertionPoint ] );

	/**
	 * Get available blocks for insertion.
	 */
	const availableBlocks = useMemo( () => {
		return getEnabledBlocks();
	}, [] );

	/**
	 * Get the current insertion point.
	 */
	const insertionPoint = useMemo( () => {
		return getBlockInsertionPoint();
	}, [ getBlockInsertionPoint ] );

	return {
		// Insertion methods
		insert,
		insertAfterSelected,
		insertAsChild,
		insertMultiple,
		insertPreset,
		
		// Modification methods
		replaceSelected,
		duplicateSelected,
		removeSelected,
		
		// Utilities
		canInsert,
		availableBlocks,
		insertionPoint,
		
		// Direct access to low-level functions
		selectBlock,
		moveBlockToPosition,
	};
};

export default useBlockInserter;
