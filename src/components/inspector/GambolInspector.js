/**
 * Gambol Inspector - Main Inspector Component
 *
 * Provides a tabbed inspector panel with General, Style, and Advanced tabs.
 *
 * @package GambolBuilder
 */

import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { settings, brush, cog } from '@wordpress/icons';

/**
 * Tab configuration with icons and labels.
 */
const DEFAULT_TABS = [
	{
		name: 'general',
		title: __( 'General', 'gambol-builder' ),
		icon: settings,
		className: 'gambol-inspector-tab gambol-inspector-tab--general',
	},
	{
		name: 'style',
		title: __( 'Style', 'gambol-builder' ),
		icon: brush,
		className: 'gambol-inspector-tab gambol-inspector-tab--style',
	},
	{
		name: 'advanced',
		title: __( 'Advanced', 'gambol-builder' ),
		icon: cog,
		className: 'gambol-inspector-tab gambol-inspector-tab--advanced',
	},
];

/**
 * Custom Tab Button Component
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Tab button element.
 */
const TabButton = ( { tab, isActive, onClick } ) => {
	const Icon = tab.icon;

	return (
		<button
			type="button"
			className={ `gambol-inspector-tab-button ${ isActive ? 'is-active' : '' }` }
			onClick={ onClick }
			aria-selected={ isActive }
			role="tab"
		>
			<span className="gambol-inspector-tab-icon">
				<Icon />
			</span>
			<span className="gambol-inspector-tab-label">
				{ tab.title }
			</span>
		</button>
	);
};

/**
 * Gambol Inspector Component
 *
 * @param {Object}   props                Component props.
 * @param {Function} props.generalTab     Content for General tab.
 * @param {Function} props.styleTab       Content for Style tab.
 * @param {Function} props.advancedTab    Content for Advanced tab.
 * @param {Array}    props.tabs           Custom tabs configuration.
 * @param {string}   props.initialTabName Initial active tab.
 * @return {JSX.Element} Inspector element.
 */
const GambolInspector = ( {
	generalTab,
	styleTab,
	advancedTab,
	tabs = DEFAULT_TABS,
	initialTabName = 'general',
} ) => {
	/**
	 * Render tab content based on tab name.
	 *
	 * @param {Object} tab Current tab object.
	 * @return {JSX.Element|null} Tab content.
	 */
	const renderTabContent = ( tab ) => {
		switch ( tab.name ) {
			case 'general':
				return generalTab ? generalTab() : null;
			case 'style':
				return styleTab ? styleTab() : null;
			case 'advanced':
				return advancedTab ? advancedTab() : null;
			default:
				return null;
		}
	};

	return (
		<InspectorControls>
			<div className="gambol-inspector">
				<TabPanel
					className="gambol-inspector-tabs"
					activeClass="is-active"
					initialTabName={ initialTabName }
					tabs={ tabs }
				>
					{ ( tab ) => (
						<div className={ `gambol-inspector-panel gambol-inspector-panel--${ tab.name }` }>
							{ renderTabContent( tab ) }
						</div>
					) }
				</TabPanel>
			</div>
		</InspectorControls>
	);
};

export default GambolInspector;
