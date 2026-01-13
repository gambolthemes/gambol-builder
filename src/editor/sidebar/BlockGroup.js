/**
 * Gambol Builder - Block Group Component
 * 
 * Collapsible category group containing related blocks.
 *
 * @package GambolBuilder
 */

import { useState, useCallback, useId } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import BlockIcon from './BlockIcon';
import BlockItem from './BlockItem';

/**
 * Chevron Down Icon
 */
const ChevronDown = () => (
	<svg 
		viewBox="0 0 24 24" 
		fill="none" 
		stroke="currentColor" 
		strokeWidth="2" 
		strokeLinecap="round" 
		strokeLinejoin="round"
		width="16"
		height="16"
		aria-hidden="true"
	>
		<polyline points="6 9 12 15 18 9" />
	</svg>
);

/**
 * BlockGroup Component
 * 
 * Renders a collapsible group of blocks with a header.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.category - Category definition.
 * @param {Array} props.blocks - Array of block definitions.
 * @param {boolean} props.defaultExpanded - Initial expanded state.
 * @param {Function} props.onBlockInsert - Callback when block is inserted.
 * @param {boolean} props.showNotice - Whether to show a notice message.
 * @param {string} props.noticeText - Notice text to display.
 * @return {JSX.Element} Block group element.
 */
const BlockGroup = ( { 
	category, 
	blocks, 
	defaultExpanded = true,
	onBlockInsert,
	showNotice = false,
	noticeText = '',
} ) => {
	const [ isExpanded, setIsExpanded ] = useState( defaultExpanded );
	const contentId = useId();

	/**
	 * Toggle expanded state.
	 */
	const toggleExpanded = useCallback( () => {
		setIsExpanded( ( prev ) => ! prev );
	}, [] );

	/**
	 * Handle keyboard navigation.
	 */
	const handleKeyDown = useCallback( ( event ) => {
		if ( event.key === 'Enter' || event.key === ' ' ) {
			event.preventDefault();
			toggleExpanded();
		}
	}, [ toggleExpanded ] );

	// Don't render empty groups
	if ( ! blocks || blocks.length === 0 ) {
		return null;
	}

	const groupClasses = [
		'gambol-block-group',
		isExpanded && 'gambol-block-group--expanded',
	].filter( Boolean ).join( ' ' );

	return (
		<div className={ groupClasses }>
			<button
				className="gambol-block-group__header"
				onClick={ toggleExpanded }
				onKeyDown={ handleKeyDown }
				aria-expanded={ isExpanded }
				aria-controls={ contentId }
			>
				<span className="gambol-block-group__icon">
					<BlockIcon type={ category.icon } size="sm" />
				</span>
				<span className="gambol-block-group__label">
					{ category.label }
				</span>
				<span className="gambol-block-group__count">
					{ blocks.length }
				</span>
				<span 
					className="gambol-block-group__chevron"
					aria-hidden="true"
				>
					<ChevronDown />
				</span>
			</button>

			<div
				id={ contentId }
				className="gambol-block-group__content"
				role="region"
				aria-label={ category.label }
				hidden={ ! isExpanded }
			>
				{ showNotice && noticeText && (
					<div className="gambol-block-group__notice">
						<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
						</svg>
						<span>{ noticeText }</span>
					</div>
				) }
				<div className="gambol-block-group__grid">
					{ blocks.map( ( block ) => (
						<BlockItem
							key={ block.name }
							block={ block }
							onInsert={ onBlockInsert }
						/>
					) ) }
				</div>
			</div>
		</div>
	);
};

export default BlockGroup;
