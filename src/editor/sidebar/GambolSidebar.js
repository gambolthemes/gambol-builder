/**
 * Gambol Builder - Left Sidebar Component
 * 
 * Main sidebar panel that replaces the default Gutenberg block inserter.
 * Features a custom block library, search, and drag-drop functionality.
 *
 * @package GambolBuilder
 */

import { useState, useCallback, useMemo, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';

import SearchBar from './SearchBar';
import BlockGroup from './BlockGroup';
import { BLOCK_CATEGORIES, GAMBOL_BLOCKS, searchBlocks } from './block-registry';
import useDragDropInserter from './useDragDropInserter';
import useKeyboardNavigation from './useKeyboardNavigation';

/**
 * Check if WooCommerce is active.
 * This is set by PHP via wp_localize_script.
 */
const isWooCommerceActive = () => {
	return window.gambolBuilderData?.woocommerceActive === true 
		|| window.gambolBuilderData?.woocommerce_active === true
		|| document.body.classList.contains( 'woocommerce-active' );
};

/**
 * Gambol Logo Icon
 */
const GambolLogo = () => (
	<svg 
		viewBox="0 0 32 32" 
		fill="none"
		width="28"
		height="28"
		aria-hidden="true"
	>
		<rect x="2" y="2" width="28" height="28" rx="6" fill="currentColor" />
		<path 
			d="M16 8C11.582 8 8 11.582 8 16s3.582 8 8 8c2.21 0 4.21-.895 5.657-2.343" 
			stroke="#121212" 
			strokeWidth="2.5" 
			strokeLinecap="round"
			fill="none"
		/>
		<circle cx="20" cy="16" r="3" fill="#121212" />
	</svg>
);

/**
 * Collapse Icon
 */
const CollapseIcon = ( { isCollapsed } ) => (
	<svg 
		viewBox="0 0 24 24" 
		fill="none" 
		stroke="currentColor" 
		strokeWidth="2" 
		strokeLinecap="round" 
		strokeLinejoin="round"
		width="18"
		height="18"
		aria-hidden="true"
		style={ { 
			transform: isCollapsed ? 'rotate(180deg)' : 'none',
			transition: 'transform 0.2s ease',
		} }
	>
		<polyline points="11 17 6 12 11 7" />
		<polyline points="18 17 13 12 18 7" />
	</svg>
);

/**
 * Empty State Component
 */
const EmptyState = ( { searchQuery } ) => (
	<div className="gambol-sidebar__empty">
		<div className="gambol-sidebar__empty-icon">
			<svg 
				viewBox="0 0 24 24" 
				fill="none" 
				stroke="currentColor" 
				strokeWidth="1.5"
				width="48"
				height="48"
			>
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
				<line x1="8" y1="11" x2="14" y2="11" />
			</svg>
		</div>
		<p className="gambol-sidebar__empty-text">
			{ searchQuery 
				? __( 'No blocks found for', 'gambol-builder' ) + ` "${ searchQuery }"`
				: __( 'No blocks available', 'gambol-builder' )
			}
		</p>
		{ searchQuery && (
			<p className="gambol-sidebar__empty-hint">
				{ __( 'Try a different search term', 'gambol-builder' ) }
			</p>
		) }
	</div>
);

/**
 * GambolSidebar Component
 * 
 * The main left sidebar panel for Gambol Builder.
 *
 * @return {JSX.Element} Sidebar element.
 */
const GambolSidebar = () => {
	const [ isCollapsed, setIsCollapsed ] = useState( false );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ recentlyUsed, setRecentlyUsed ] = useState( [] );

	// Initialize drag/drop handling
	useDragDropInserter();

	// Initialize keyboard navigation
	useKeyboardNavigation();

	/**
	 * Filter blocks based on search query.
	 */
	const filteredBlocks = useMemo( () => {
		return searchBlocks( searchQuery );
	}, [ searchQuery ] );

	/**
	 * Check if there are any blocks to display.
	 */
	const hasBlocks = useMemo( () => {
		return Object.values( filteredBlocks ).some( ( blocks ) => blocks.length > 0 );
	}, [ filteredBlocks ] );

	/**
	 * Toggle sidebar collapsed state.
	 */
	const toggleCollapse = useCallback( () => {
		setIsCollapsed( ( prev ) => ! prev );
	}, [] );

	/**
	 * Handle block insertion (for analytics/tracking).
	 */
	const handleBlockInsert = useCallback( ( block ) => {
		// Track recently used blocks
		setRecentlyUsed( ( prev ) => {
			const filtered = prev.filter( ( b ) => b.name !== block.name );
			return [ block, ...filtered ].slice( 0, 5 );
		} );
	}, [] );

	/**
	 * Load recently used from localStorage.
	 */
	useEffect( () => {
		try {
			const saved = localStorage.getItem( 'gambol-recently-used' );
			if ( saved ) {
				setRecentlyUsed( JSON.parse( saved ) );
			}
		} catch ( e ) {
			// Ignore localStorage errors
		}
	}, [] );

	/**
	 * Save recently used to localStorage.
	 */
	useEffect( () => {
		if ( recentlyUsed.length > 0 ) {
			try {
				localStorage.setItem( 
					'gambol-recently-used', 
					JSON.stringify( recentlyUsed ) 
				);
			} catch ( e ) {
				// Ignore localStorage errors
			}
		}
	}, [ recentlyUsed ] );

	const sidebarClasses = [
		'gambol-left-sidebar',
		isCollapsed && 'gambol-left-sidebar--collapsed',
	].filter( Boolean ).join( ' ' );

	return (
		<div className={ sidebarClasses }>
			{/* Header */}
			<header className="gambol-sidebar__header">
				<div className="gambol-sidebar__brand">
					<span className="gambol-sidebar__logo">
						<GambolLogo />
					</span>
					{ ! isCollapsed && (
						<span className="gambol-sidebar__title">
							{ __( 'Gambol', 'gambol-builder' ) }
						</span>
					) }
				</div>
				<button
					className="gambol-sidebar__collapse-btn"
					onClick={ toggleCollapse }
					aria-label={ isCollapsed 
						? __( 'Expand sidebar', 'gambol-builder' ) 
						: __( 'Collapse sidebar', 'gambol-builder' ) 
					}
					aria-expanded={ ! isCollapsed }
				>
					<CollapseIcon isCollapsed={ isCollapsed } />
				</button>
			</header>

			{ ! isCollapsed && (
				<>
					{/* Search */}
					<div className="gambol-sidebar__search">
						<SearchBar
							value={ searchQuery }
							onChange={ setSearchQuery }
						/>
					</div>

					{/* Block Library */}
					<div className="gambol-sidebar__content">
						{ hasBlocks ? (
							<div className="gambol-sidebar__blocks">
								{ BLOCK_CATEGORIES.map( ( category ) => {
									const blocks = filteredBlocks[ category.id ];
									if ( ! blocks || blocks.length === 0 ) {
										return null;
									}
									
									// Check if WooCommerce category and WooCommerce is not active
									const isWooCategory = category.id === 'woocommerce';
									const wooNotActive = isWooCategory && ! isWooCommerceActive();
									
									return (
										<BlockGroup
											key={ category.id }
											category={ category }
											blocks={ blocks }
											defaultExpanded={ true }
											onBlockInsert={ handleBlockInsert }
											showNotice={ wooNotActive }
											noticeText={ __( 'WooCommerce plugin required for these blocks to work on frontend.', 'gambol-builder' ) }
										/>
									);
								} ) }
							</div>
						) : (
							<EmptyState searchQuery={ searchQuery } />
						) }
					</div>

					{/* Footer */}
					<footer className="gambol-sidebar__footer">
						<div className="gambol-sidebar__help">
							<span className="gambol-sidebar__help-text">
								{ __( 'Click or drag to insert', 'gambol-builder' ) }
							</span>
						</div>
					</footer>
				</>
			) }
		</div>
	);
};

export default GambolSidebar;
