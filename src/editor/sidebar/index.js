/**
 * Gambol Builder - Sidebar Components Index
 * 
 * Exports all sidebar-related components and the block registry API.
 *
 * @package GambolBuilder
 */

// Components
export { default as GambolSidebar } from './GambolSidebar';
export { default as BlockGroup } from './BlockGroup';
export { default as BlockItem } from './BlockItem';
export { default as BlockIcon } from './BlockIcon';
export { default as SearchBar } from './SearchBar';

// Hooks
export { useDragDropInserter } from './useDragDropInserter';
export { useKeyboardNavigation } from './useKeyboardNavigation';

// Loader
export { mountSidebar, unmountSidebar } from './loader';

// Block Registry - Definitions
export { 
	BLOCK_CATEGORIES, 
	GAMBOL_BLOCKS, 
	BLOCK_ICONS,
	BLOCK_PRESETS,
} from './block-registry';

// Block Registry - Utility Functions
export {
	getAllBlocks,
	getEnabledBlocks,
	getBlockNames,
	searchBlocks,
	getBlockByName,
	getBlocksByCategory,
	getCategoryById,
} from './block-registry';

// Block Registry - Programmatic Insertion API
export {
	isBlockRegistered,
	getInsertionPoint,
	getSelectedBlock,
	insertBlock,
	insertBlockAfterSelected,
	insertBlockAsChild,
	insertBlocks,
	replaceSelectedBlock,
	selectBlockById,
	removeBlock,
	duplicateSelectedBlock,
	insertPreset,
} from './block-registry';
