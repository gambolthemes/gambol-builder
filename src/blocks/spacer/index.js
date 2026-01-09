/**
 * Gambol Spacer Block
 *
 * Responsive spacing block with visual controls.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Spacer icon.
 */
const SpacerIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M3 7h18v2H3V7zm0 8h18v2H3v-2z"/>
	</svg>
);

/**
 * Block attributes.
 */
const attributes = {
	// Height (responsive)
	height: {
		type: 'number',
		default: 50,
	},
	heightTablet: {
		type: 'number',
		default: 40,
	},
	heightMobile: {
		type: 'number',
		default: 30,
	},
	unit: {
		type: 'string',
		default: 'px',
	},

	// Visual style
	showDivider: {
		type: 'boolean',
		default: false,
	},
	dividerStyle: {
		type: 'string',
		default: 'solid',
	},
	dividerWidth: {
		type: 'number',
		default: 1,
	},
	dividerColor: {
		type: 'string',
		default: '#e0e0e0',
	},
	dividerAlignment: {
		type: 'string',
		default: 'center',
	},
	dividerLength: {
		type: 'number',
		default: 100,
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
registerBlockType( 'gambol/spacer', {
	apiVersion: 3,
	title: __( 'Spacer', 'gambol-builder' ),
	description: __( 'Add responsive vertical spacing between blocks.', 'gambol-builder' ),
	category: 'gambol-layout',
	icon: SpacerIcon,
	keywords: [
		__( 'spacer', 'gambol-builder' ),
		__( 'spacing', 'gambol-builder' ),
		__( 'divider', 'gambol-builder' ),
		__( 'gap', 'gambol-builder' ),
	],
	attributes,
	supports: {
		align: [ 'full', 'wide' ],
		html: false,
		anchor: true,
	},
	example: {
		attributes: {
			height: 50,
		},
	},
	edit: Edit,
	save,
} );
