/**
 * Gambol Icon Block
 *
 * Scalable icon block with extensive styling options.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Icon block icon.
 */
const IconBlockIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
	</svg>
);

/**
 * Block attributes.
 */
const attributes = {
	// Icon
	iconType: {
		type: 'string',
		default: 'star',
	},
	customSvg: {
		type: 'string',
		default: '',
	},

	// Size
	size: {
		type: 'number',
		default: 48,
	},
	sizeTablet: {
		type: 'number',
		default: 40,
	},
	sizeMobile: {
		type: 'number',
		default: 32,
	},

	// Colors
	iconColor: {
		type: 'string',
		default: '#00d4aa',
	},
	backgroundColor: {
		type: 'string',
		default: '',
	},
	hoverColor: {
		type: 'string',
		default: '',
	},
	hoverBackgroundColor: {
		type: 'string',
		default: '',
	},

	// Style
	padding: {
		type: 'number',
		default: 0,
	},
	borderRadius: {
		type: 'string',
		default: '0',
	},
	rotation: {
		type: 'number',
		default: 0,
	},

	// Link
	linkUrl: {
		type: 'string',
		default: '',
	},
	linkTarget: {
		type: 'string',
		default: '_self',
	},

	// Alignment
	alignment: {
		type: 'string',
		default: 'center',
	},

	// Animation
	hoverAnimation: {
		type: 'string',
		default: 'none',
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
registerBlockType( 'gambol/icon', {
	apiVersion: 3,
	title: __( 'Icon', 'gambol-builder' ),
	description: __( 'Display scalable icons with custom styling.', 'gambol-builder' ),
	category: 'gambol-content',
	icon: IconBlockIcon,
	keywords: [
		__( 'icon', 'gambol-builder' ),
		__( 'symbol', 'gambol-builder' ),
		__( 'svg', 'gambol-builder' ),
	],
	attributes,
	supports: {
		align: [ 'left', 'center', 'right' ],
		html: false,
		anchor: true,
	},
	example: {
		attributes: {
			iconType: 'star',
			size: 48,
			iconColor: '#00d4aa',
		},
	},
	edit: Edit,
	save,
} );
