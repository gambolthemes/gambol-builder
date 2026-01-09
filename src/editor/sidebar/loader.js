/**
 * Gambol Builder - Sidebar Loader
 * 
 * Initializes the custom left sidebar and integrates it with the Gutenberg editor.
 * Handles mounting, unmounting, and customizing the editor experience.
 *
 * @package GambolBuilder
 */

import { createRoot, render, unmountComponentAtNode } from '@wordpress/element';
import { subscribe, select, dispatch } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { getBlockTypes, unregisterBlockType } from '@wordpress/blocks';
import domReady from '@wordpress/dom-ready';

import GambolSidebar from './GambolSidebar';
import { getBlockNames } from './block-registry';
import './sidebar.scss';

/**
 * Get list of allowed block names from registry.
 * All Gambol blocks plus essential core blocks.
 */
const getAllowedBlocks = () => {
	const gambolBlocks = getBlockNames( true );
	const essentialCore = [
		'core/paragraph', // Needed for default typing
		'core/list',
		'core/list-item',
	];
	return [ ...gambolBlocks, ...essentialCore ];
};

/**
 * Disable default block categories and keep only Gambol categories.
 */
const filterBlockCategories = ( categories ) => {
	// Define Gambol's custom categories
	const gambolCategories = [
		{ slug: 'gambol-layout', title: 'Layout', icon: null },
		{ slug: 'gambol-basic', title: 'Basic', icon: null },
		{ slug: 'gambol-media', title: 'Media', icon: null },
		{ slug: 'gambol-content', title: 'Content', icon: null },
		{ slug: 'gambol-interactive', title: 'Interactive', icon: null },
		{ slug: 'gambol-social', title: 'Social', icon: null },
		{ slug: 'gambol-theme', title: 'Theme Elements', icon: null },
		{ slug: 'gambol-posts', title: 'Posts & Archive', icon: null },
		{ slug: 'gambol-woocommerce', title: 'WooCommerce', icon: null },
		{ slug: 'gambol-marketing', title: 'Marketing', icon: null },
		{ slug: 'gambol-pro', title: 'Pro', icon: null },
	];

	// Return only Gambol categories, removing all default ones
	return gambolCategories;
};

/**
 * Filter blocks to only show allowed ones.
 */
const filterBlockTypes = ( blockSettings, blockName ) => {
	const allowedBlocks = getAllowedBlocks();
	
	// If block is not in allowed list, hide it from inserter
	if ( ! allowedBlocks.includes( blockName ) ) {
		return {
			...blockSettings,
			supports: {
				...blockSettings.supports,
				inserter: false,
			},
		};
	}
	return blockSettings;
};

/**
 * Unregister unwanted core blocks after they're registered.
 */
const unregisterUnwantedBlocks = () => {
	const allowedBlocks = getAllowedBlocks();
	
	// Wait for blocks to be registered
	setTimeout( () => {
		const allBlocks = getBlockTypes();
		
		allBlocks.forEach( ( block ) => {
			// Keep allowed blocks
			if ( allowedBlocks.includes( block.name ) ) {
				return;
			}
			
			// Unregister everything else
			try {
				unregisterBlockType( block.name );
			} catch ( e ) {
				// Block might already be unregistered or protected
			}
		} );
	}, 100 );
};

/**
 * Apply all block filters.
 */
const applyBlockFilters = () => {
	// Filter block categories
	addFilter(
		'blocks.registerBlockType',
		'gambol-builder/filter-blocks',
		filterBlockTypes
	);

	// Filter categories  
	addFilter(
		'blocks.getBlockTypes',
		'gambol-builder/filter-inserter',
		( blockTypes ) => {
			return blockTypes.filter( ( block ) => ALLOWED_BLOCKS.includes( block.name ) );
		}
	);
};

/**
 * Sidebar container ID.
 */
const SIDEBAR_CONTAINER_ID = 'gambol-sidebar-root';

/**
 * Store reference to root for React 18+ cleanup.
 */
let sidebarRoot = null;

/**
 * Create the sidebar container element.
 *
 * @return {HTMLElement} Container element.
 */
const createSidebarContainer = () => {
	let container = document.getElementById( SIDEBAR_CONTAINER_ID );
	
	if ( ! container ) {
		container = document.createElement( 'div' );
		container.id = SIDEBAR_CONTAINER_ID;
		container.setAttribute( 'data-gambol-sidebar', 'true' );
		document.body.appendChild( container );
	}
	
	return container;
};

/**
 * Mount the sidebar component.
 */
const mountSidebar = () => {
	const container = createSidebarContainer();
	
	// Check if already mounted
	if ( container.hasChildNodes() ) {
		return;
	}

	// Use React 18 createRoot if available, fallback to render
	if ( typeof createRoot === 'function' ) {
		sidebarRoot = createRoot( container );
		sidebarRoot.render( <GambolSidebar /> );
	} else {
		render( <GambolSidebar />, container );
	}

	// Add active class to body for CSS targeting
	document.body.classList.add( 'gambol-editor-active' );
};

/**
 * Unmount the sidebar component.
 */
const unmountSidebar = () => {
	const container = document.getElementById( SIDEBAR_CONTAINER_ID );
	
	if ( ! container ) {
		return;
	}

	// Unmount using appropriate method
	if ( sidebarRoot ) {
		sidebarRoot.unmount();
		sidebarRoot = null;
	} else {
		unmountComponentAtNode( container );
	}

	// Remove container
	container.remove();

	// Remove active class
	document.body.classList.remove( 'gambol-editor-active' );
};

/**
 * Hide the default Gutenberg block inserter and all default UI.
 * Adds comprehensive CSS to suppress all default inserter elements.
 */
const hideDefaultInserter = () => {
	const styleId = 'gambol-hide-inserter';
	
	if ( document.getElementById( styleId ) ) {
		return;
	}

	const style = document.createElement( 'style' );
	style.id = styleId;
	style.textContent = `
		/* =================================================================
		   HIDE DEFAULT GUTENBERG BLOCK INSERTER - COMPLETE SUPPRESSION
		   ================================================================= */
		
		/* -----------------------------------------------------------------
		   HEADER TOOLBAR INSERTER (Main "+" button in top toolbar)
		   ----------------------------------------------------------------- */
		.gambol-editor-active .edit-post-header-toolbar__inserter-toggle,
		.gambol-editor-active .editor-document-tools__inserter-toggle,
		.gambol-editor-active .edit-site-header-edit-mode__inserter-toggle {
			display: none !important;
		}

		/* -----------------------------------------------------------------
		   BLOCK INSERTER PANEL (The full inserter panel/modal)
		   ----------------------------------------------------------------- */
		.gambol-editor-active .block-editor-inserter__menu,
		.gambol-editor-active .editor-inserter-sidebar,
		.gambol-editor-active .block-editor-inserter,
		.gambol-editor-active .interface-interface-skeleton__secondary-sidebar {
			display: none !important;
		}

		/* -----------------------------------------------------------------
		   QUICK INSERTER (Inline inserter popup)
		   ----------------------------------------------------------------- */
		.gambol-editor-active .block-editor-inserter__quick-inserter,
		.gambol-editor-active .block-editor-inserter__quick-inserter-toggle,
		.gambol-editor-active .block-editor-inserter__popover {
			display: none !important;
		}

		/* -----------------------------------------------------------------
		   TAB PANELS & CATEGORIES (Inside inserter)
		   ----------------------------------------------------------------- */
		.gambol-editor-active .block-editor-inserter__tabs,
		.gambol-editor-active .block-editor-inserter__block-list,
		.gambol-editor-active .block-editor-inserter__panel-content,
		.gambol-editor-active .block-editor-inserter__search-input {
			display: none !important;
		}

		/* -----------------------------------------------------------------
		   BETWEEN-BLOCK INSERTER (Blue line + button between blocks)
		   ----------------------------------------------------------------- */
		.gambol-editor-active .block-editor-block-list__insertion-point-inserter {
			display: none !important;
		}

		/* -----------------------------------------------------------------
		   APPENDER BUTTON (The "+" at the end of block lists)
		   Style it to be subtle but functional - opens Gambol sidebar
		   ----------------------------------------------------------------- */
		.gambol-editor-active .block-list-appender .block-editor-button-block-appender,
		.gambol-editor-active .block-editor-default-block-appender {
			opacity: 0.4;
			transition: opacity 0.15s ease;
		}
		
		.gambol-editor-active .block-list-appender:hover .block-editor-button-block-appender,
		.gambol-editor-active .block-editor-default-block-appender:hover {
			opacity: 0.8;
		}

		/* -----------------------------------------------------------------
		   SLASH INSERTER (Hide the "/" command inserter)
		   ----------------------------------------------------------------- */
		.gambol-editor-active .components-autocomplete__popover,
		.gambol-editor-active .block-editor-autocompleters__block {
			display: none !important;
		}

		/* -----------------------------------------------------------------
		   BLOCK PATTERNS TAB (Hide patterns from any remaining UI)
		   ----------------------------------------------------------------- */
		.gambol-editor-active .block-editor-inserter__patterns-tab,
		.gambol-editor-active .block-editor-block-patterns-list {
			display: none !important;
		}

		/* -----------------------------------------------------------------
		   MEDIA & REUSABLE BLOCKS TABS
		   ----------------------------------------------------------------- */
		.gambol-editor-active .block-editor-inserter__media-tab,
		.gambol-editor-active .block-editor-inserter__reusable-blocks-tab {
			display: none !important;
		}

		/* -----------------------------------------------------------------
		   ZOOM OUT INSERTER (WordPress 6.5+)
		   ----------------------------------------------------------------- */
		.gambol-editor-active .block-editor-zoom-out-toolbar,
		.gambol-editor-active .block-editor-block-tools__zoom-out-mode-inserter-button {
			display: none !important;
		}

		/* -----------------------------------------------------------------
		   LIST VIEW INSERTER (Inside list view panel)
		   ----------------------------------------------------------------- */
		.gambol-editor-active .block-editor-list-view-leaf__inserter,
		.gambol-editor-active .block-editor-list-view__inserter {
			display: none !important;
		}

		/* =================================================================
		   EDITOR LAYOUT ADJUSTMENTS
		   ================================================================= */
		
		/* Adjust editor content area for Gambol sidebar */
		.gambol-editor-active .interface-interface-skeleton__content {
			margin-left: 280px;
			transition: margin-left 0.25s ease;
		}
		
		.gambol-editor-active.gambol-sidebar-collapsed .interface-interface-skeleton__content {
			margin-left: 56px;
		}

		/* Adjust the editor header too */
		.gambol-editor-active .interface-interface-skeleton__header {
			left: 280px;
			transition: left 0.25s ease;
		}
		
		.gambol-editor-active.gambol-sidebar-collapsed .interface-interface-skeleton__header {
			left: 56px;
		}

		/* Footer adjustment */
		.gambol-editor-active .interface-interface-skeleton__footer {
			left: 280px;
			transition: left 0.25s ease;
		}
		
		.gambol-editor-active.gambol-sidebar-collapsed .interface-interface-skeleton__footer {
			left: 56px;
		}

		/* =================================================================
		   RESPONSIVE ADJUSTMENTS
		   ================================================================= */
		@media (max-width: 782px) {
			.gambol-editor-active .interface-interface-skeleton__content,
			.gambol-editor-active .interface-interface-skeleton__header,
			.gambol-editor-active .interface-interface-skeleton__footer {
				margin-left: 0;
				left: 0;
			}
			
			/* Mobile: sidebar becomes top overlay */
			.gambol-editor-active .gambol-left-sidebar {
				width: 100%;
				height: auto;
				max-height: 50vh;
				top: 32px;
				bottom: auto;
			}
		}
	`;

	document.head.appendChild( style );
};

/**
 * Check if we're in the block editor context.
 *
 * @return {boolean} True if in block editor.
 */
const isBlockEditor = () => {
	const editorStore = select( 'core/editor' );
	const editPostStore = select( 'core/edit-post' );
	
	// Check if we have editor context
	if ( ! editorStore || ! editPostStore ) {
		return false;
	}

	// Check if editor is ready
	try {
		const postType = editorStore.getCurrentPostType();
		return !! postType;
	} catch ( e ) {
		return false;
	}
};

/**
 * Initialize the Gambol sidebar.
 */
const initSidebar = () => {
	// Apply block filters immediately
	applyBlockFilters();
	
	// Hide default inserter immediately
	hideDefaultInserter();

	// Mount sidebar when editor is ready
	let editorReady = false;
	
	const unsubscribe = subscribe( () => {
		if ( editorReady ) {
			return;
		}

		if ( isBlockEditor() ) {
			editorReady = true;
			
			// Unregister unwanted blocks
			unregisterUnwantedBlocks();
			
			// Small delay to ensure DOM is ready
			requestAnimationFrame( () => {
				mountSidebar();
			} );

			// Unsubscribe after mounting
			// Keep subscribed for potential future needs
		}
	} );

	// Fallback: Try mounting after DOM ready
	setTimeout( () => {
		if ( ! editorReady ) {
			const editorWrapper = document.querySelector( '.edit-post-visual-editor' ) 
				|| document.querySelector( '.editor-styles-wrapper' );
			
			if ( editorWrapper ) {
				editorReady = true;
				mountSidebar();
			}
		}
	}, 1000 );
};

/**
 * Initialize when DOM is ready.
 */
domReady( () => {
	// Only init in block editor context
	if ( document.body.classList.contains( 'block-editor-page' ) 
		|| document.querySelector( '.block-editor' ) 
		|| document.querySelector( '.edit-post-visual-editor' ) ) {
		initSidebar();
	}
} );

// Also try to init immediately if editor is already present
if ( document.querySelector( '.block-editor' ) || document.querySelector( '.edit-post-visual-editor' ) ) {
	initSidebar();
}

export { mountSidebar, unmountSidebar };
