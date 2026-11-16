/**
 * Gambol Accordion Block
 *
 * Accessible accordion/toggle component with customizable styling.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import getDeprecated from './deprecated';
import './item';
import './style.scss';

/**
 * Accordion icon.
 */
const AccordionIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
	</svg>
);

/**
 * Block attributes.
 */
const attributes = {
	// Items
	items: {
		type: 'array',
		default: [
			{ id: 'item-1', title: 'Accordion Item 1', isOpen: true },
			{ id: 'item-2', title: 'Accordion Item 2', isOpen: false },
			{ id: 'item-3', title: 'Accordion Item 3', isOpen: false },
		],
	},

	// Behavior
	allowMultiple: {
		type: 'boolean',
		default: false,
	},
	defaultOpen: {
		type: 'string',
		default: 'first',
	},

	// Header Style
	headerBackgroundColor: {
		type: 'string',
		default: '#f5f5f5',
	},
	headerActiveBackgroundColor: {
		type: 'string',
		default: '#e8e8e8',
	},
	headerTextColor: {
		type: 'string',
		default: '#333333',
	},
	headerPadding: {
		type: 'object',
		default: { top: 16, right: 20, bottom: 16, left: 20 },
	},
	headerFontSize: {
		type: 'number',
		default: 16,
	},
	headerFontWeight: {
		type: 'string',
		default: '600',
	},

	// Icon
	iconType: {
		type: 'string',
		default: 'chevron',
	},
	iconPosition: {
		type: 'string',
		default: 'right',
	},
	iconColor: {
		type: 'string',
		default: '#666666',
	},

	// Content Style
	contentBackgroundColor: {
		type: 'string',
		default: '#ffffff',
	},
	contentPadding: {
		type: 'object',
		default: { top: 20, right: 20, bottom: 20, left: 20 },
	},

	// Border
	borderColor: {
		type: 'string',
		default: '#e0e0e0',
	},
	borderWidth: {
		type: 'number',
		default: 1,
	},
	borderRadius: {
		type: 'string',
		default: '4px',
	},
	itemGap: {
		type: 'number',
		default: 8,
	},

	// Animation
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
 * Register main accordion block.
 */
const settings = {
	apiVersion: 3,
	title: __( 'Accordion', 'gambol-builder' ),
	description: __( 'Create collapsible content sections.', 'gambol-builder' ),
	category: 'gambol-content',
	icon: AccordionIcon,
	keywords: [
		__( 'accordion', 'gambol-builder' ),
		__( 'toggle', 'gambol-builder' ),
		__( 'collapse', 'gambol-builder' ),
		__( 'faq', 'gambol-builder' ),
	],
	attributes,
	supports: {
		align: [ 'wide', 'full' ],
		html: false,
		anchor: true,
	},
	example: {
		attributes: {
			items: [
				{ id: 'item-1', title: 'What is Gambol Builder?', isOpen: true },
				{ id: 'item-2', title: 'How do I get started?', isOpen: false },
			],
		},
	},
	edit: Edit,
	save,
};

settings.deprecated = getDeprecated( settings );

registerBlockType( 'gambol/accordion', settings );
