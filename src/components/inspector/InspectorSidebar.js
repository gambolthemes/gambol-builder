/**
 * Gambol Inspector Sidebar
 *
 * Main inspector component with tabbed navigation.
 * Uses native WordPress components with custom styling.
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Tab icons
const LayoutIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
		<path d="M18 5.5H6a.5.5 0 00-.5.5v12c0 .28.22.5.5.5h12a.5.5 0 00.5-.5V6a.5.5 0 00-.5-.5zM7 7h4v4H7V7zm0 5.5h4V17H7v-4.5zM17 17h-5v-4.5h5V17zm0-6h-5V7h5v4z"/>
	</svg>
);

const DesignIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
		<path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.5c-3.6 0-6.5-2.9-6.5-6.5S8.4 5.5 12 5.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5z"/>
		<circle cx="12" cy="12" r="3"/>
	</svg>
);

const AdvancedIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
		<path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
		<path d="M19.4 13c0-.3.1-.6.1-1s0-.7-.1-1l2.1-1.6c.2-.1.2-.4.1-.6l-2-3.5c-.1-.2-.4-.3-.6-.2l-2.5 1c-.5-.4-1.1-.7-1.7-1l-.4-2.6c0-.2-.3-.4-.5-.4h-4c-.2 0-.5.2-.5.4l-.4 2.6c-.6.2-1.2.6-1.7 1l-2.5-1c-.2-.1-.5 0-.6.2l-2 3.5c-.1.2-.1.5.1.6L4.6 11c0 .3-.1.6-.1 1s0 .7.1 1l-2.1 1.6c-.2.1-.2.4-.1.6l2 3.5c.1.2.4.3.6.2l2.5-1c.5.4 1.1.7 1.7 1l.4 2.6c0 .2.3.4.5.4h4c.2 0 .5-.2.5-.4l.4-2.6c.6-.2 1.2-.6 1.7-1l2.5 1c.2.1.5 0 .6-.2l2-3.5c.1-.2.1-.5-.1-.6L19.4 13z"/>
	</svg>
);

/**
 * Inspector Sidebar Component.
 *
 * @param {Object} props Component props.
 * @param {string} props.blockTitle Block display name.
 * @param {JSX.Element} props.blockIcon Block icon element.
 * @param {JSX.Element} props.layoutTab Layout tab content.
 * @param {JSX.Element} props.designTab Design tab content.
 * @param {JSX.Element} props.advancedTab Advanced tab content.
 * @return {JSX.Element} Inspector sidebar.
 */
export default function InspectorSidebar( {
	blockTitle = __( 'Block', 'gambol-builder' ),
	blockIcon = null,
	layoutTab = null,
	designTab = null,
	advancedTab = null,
} ) {
	const [ activeTab, setActiveTab ] = useState( 'layout' );

	const tabs = [
		{
			id: 'layout',
			label: __( 'Layout', 'gambol-builder' ),
			icon: <LayoutIcon />,
			content: layoutTab,
		},
		{
			id: 'design',
			label: __( 'Design', 'gambol-builder' ),
			icon: <DesignIcon />,
			content: designTab,
		},
		{
			id: 'advanced',
			label: __( 'Advanced', 'gambol-builder' ),
			icon: <AdvancedIcon />,
			content: advancedTab,
		},
	];

	const currentTab = tabs.find( ( tab ) => tab.id === activeTab );

	return (
		<div className="gambol-inspector-sidebar">
			{ /* Block Header */ }
			<div className="gambol-block-header">
				{ blockIcon && (
					<div className="gambol-block-icon">
						{ blockIcon }
					</div>
				) }
				<div className="gambol-block-title">
					<h2>{ blockTitle }</h2>
					<span>{ __( 'Gambol Builder', 'gambol-builder' ) }</span>
				</div>
			</div>

			{ /* Tab Navigation */ }
			<div className="gambol-tabs" role="tablist">
				{ tabs.map( ( tab ) => (
					<button
						key={ tab.id }
						className={ `gambol-tab ${ activeTab === tab.id ? 'is-active' : '' }` }
						onClick={ () => setActiveTab( tab.id ) }
						role="tab"
						aria-selected={ activeTab === tab.id }
						aria-controls={ `gambol-panel-${ tab.id }` }
					>
						{ tab.icon }
						<span>{ tab.label }</span>
					</button>
				) ) }
			</div>

			{ /* Tab Content */ }
			<div
				className="gambol-tab-content"
				role="tabpanel"
				id={ `gambol-panel-${ activeTab }` }
			>
				{ currentTab?.content || (
					<p style={ { color: '#666', fontSize: '12px' } }>
						{ __( 'No settings available.', 'gambol-builder' ) }
					</p>
				) }
			</div>
		</div>
	);
}
