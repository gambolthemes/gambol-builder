/**
 * Gambol Tabs Block
 *
 * Accessible tabbed content with customizable styling.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Tabs icon.
 */
const TabsIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z"/>
	</svg>
);

/**
 * Block attributes.
 */
const attributes = {
	// Tabs data
	tabs: {
		type: 'array',
		default: [
			{ id: 'tab-1', title: 'Tab 1' },
			{ id: 'tab-2', title: 'Tab 2' },
			{ id: 'tab-3', title: 'Tab 3' },
		],
	},
	activeTab: {
		type: 'string',
		default: 'tab-1',
	},

	// Layout
	tabPosition: {
		type: 'string',
		default: 'top',
	},
	tabAlignment: {
		type: 'string',
		default: 'left',
	},
	tabWidth: {
		type: 'string',
		default: 'auto',
	},

	// Tab Style
	tabBackgroundColor: {
		type: 'string',
		default: 'transparent',
	},
	tabActiveBackgroundColor: {
		type: 'string',
		default: '#00d4aa',
	},
	tabTextColor: {
		type: 'string',
		default: '#666666',
	},
	tabActiveTextColor: {
		type: 'string',
		default: '#ffffff',
	},
	tabBorderRadius: {
		type: 'string',
		default: '4px 4px 0 0',
	},
	tabPadding: {
		type: 'object',
		default: { top: 12, right: 24, bottom: 12, left: 24 },
	},
	tabGap: {
		type: 'number',
		default: 4,
	},

	// Content Style
	contentBackgroundColor: {
		type: 'string',
		default: '#ffffff',
	},
	contentBorderColor: {
		type: 'string',
		default: '#e0e0e0',
	},
	contentBorderWidth: {
		type: 'number',
		default: 1,
	},
	contentBorderRadius: {
		type: 'string',
		default: '0 4px 4px 4px',
	},
	contentPadding: {
		type: 'object',
		default: { top: 24, right: 24, bottom: 24, left: 24 },
	},

	// Animation
	animationType: {
		type: 'string',
		default: 'fade',
	},
	animationDuration: {
		type: 'number',
		default: 300,
	},

	// Advanced
	htmlId: {
		type: 'string',
		default: '',
	},
	cssClasses: {
		type: 'string',
		default: '',
	},
};

/**
 * Register block.
 */
registerBlockType( 'gambol/tabs', {
	apiVersion: 3,
	title: __( 'Tabs', 'gambol-builder' ),
	description: __( 'Create tabbed content sections with accessible navigation.', 'gambol-builder' ),
	category: 'gambol-content',
	icon: TabsIcon,
	keywords: [
		__( 'tabs', 'gambol-builder' ),
		__( 'tabbed', 'gambol-builder' ),
		__( 'navigation', 'gambol-builder' ),
		__( 'content', 'gambol-builder' ),
	],
	attributes,
	supports: {
		align: [ 'wide', 'full' ],
		html: false,
		anchor: true,
	},
	example: {
		attributes: {
			tabs: [
				{ id: 'tab-1', title: 'Features' },
				{ id: 'tab-2', title: 'Pricing' },
				{ id: 'tab-3', title: 'FAQ' },
			],
		},
	},
	edit: Edit,
	save,
} );

/**
 * Also register the Tab Panel inner block.
 */
registerBlockType( 'gambol/tab-panel', {
	apiVersion: 3,
	title: __( 'Tab Panel', 'gambol-builder' ),
	description: __( 'Content panel for a tab.', 'gambol-builder' ),
	category: 'gambol-content',
	icon: 'text',
	parent: [ 'gambol/tabs' ],
	attributes: {
		tabId: {
			type: 'string',
			default: '',
		},
	},
	supports: {
		html: false,
		inserter: false,
	},
	edit: ( { attributes } ) => {
		const { useBlockProps, useInnerBlocksProps } = require( '@wordpress/block-editor' );
		const blockProps = useBlockProps( { className: 'gambol-tab-panel' } );
		const innerBlocksProps = useInnerBlocksProps( blockProps, {
			template: [ [ 'core/paragraph', { placeholder: __( 'Add tab content...', 'gambol-builder' ) } ] ],
			templateLock: false,
		} );
		return <div { ...innerBlocksProps } />;
	},
	save: ( { attributes } ) => {
		const { useBlockProps, useInnerBlocksProps } = require( '@wordpress/block-editor' );
		const blockProps = useBlockProps.save( {
			className: 'gambol-tab-panel',
			role: 'tabpanel',
			id: `panel-${ attributes.tabId }`,
			'aria-labelledby': attributes.tabId,
		} );
		const innerBlocksProps = useInnerBlocksProps.save( blockProps );
		return <div { ...innerBlocksProps } />;
	},
} );
