/**
 * Gambol Counter Block
 *
 * Animated number counter with optional icon and suffix/prefix.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Counter icon.
 */
const CounterIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z"/>
	</svg>
);

/**
 * Block attributes.
 */
const attributes = {
	// Counter Value
	startValue: {
		type: 'number',
		default: 0,
	},
	endValue: {
		type: 'number',
		default: 100,
	},
	prefix: {
		type: 'string',
		default: '',
	},
	suffix: {
		type: 'string',
		default: '',
	},
	title: {
		type: 'string',
		default: 'Happy Clients',
	},

	// Animation
	duration: {
		type: 'number',
		default: 2000,
	},
	separator: {
		type: 'boolean',
		default: true,
	},

	// Icon
	showIcon: {
		type: 'boolean',
		default: true,
	},
	iconType: {
		type: 'string',
		default: 'star',
	},
	iconPosition: {
		type: 'string',
		default: 'top',
	},

	// Layout
	alignment: {
		type: 'string',
		default: 'center',
	},

	// Colors
	backgroundColor: {
		type: 'string',
		default: 'transparent',
	},
	numberColor: {
		type: 'string',
		default: '#00d4aa',
	},
	titleColor: {
		type: 'string',
		default: '#333333',
	},
	iconColor: {
		type: 'string',
		default: '#00d4aa',
	},
	iconBgColor: {
		type: 'string',
		default: 'rgba(0, 212, 170, 0.1)',
	},

	// Typography
	numberSize: {
		type: 'number',
		default: 48,
	},
	titleSize: {
		type: 'number',
		default: 16,
	},
	iconSize: {
		type: 'number',
		default: 40,
	},

	// Spacing
	padding: {
		type: 'object',
		default: { top: 30, right: 30, bottom: 30, left: 30 },
	},
	borderRadius: {
		type: 'string',
		default: '8px',
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
registerBlockType( 'gambol/counter', {
	apiVersion: 3,
	title: __( 'Counter', 'gambol-builder' ),
	description: __( 'Display animated number counters and statistics.', 'gambol-builder' ),
	category: 'gambol-content',
	icon: CounterIcon,
	keywords: [
		__( 'counter', 'gambol-builder' ),
		__( 'number', 'gambol-builder' ),
		__( 'stats', 'gambol-builder' ),
		__( 'statistics', 'gambol-builder' ),
	],
	attributes,
	supports: {
		align: [ 'wide', 'full' ],
		html: false,
		anchor: true,
	},
	example: {
		attributes: {
			endValue: 500,
			suffix: '+',
			title: 'Projects Completed',
		},
	},
	edit: Edit,
	save,
} );
