/**
 * Mini Cart Block
 *
 * Display the WooCommerce mini cart widget.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Mini Cart block icon.
 */
const icon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		aria-hidden="true"
		focusable="false"
	>
		<path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
	</svg>
);

/**
 * Register the Mini Cart block.
 */
registerBlockType( 'gambol/mini-cart', {
	apiVersion: 3,
	title: __( 'Mini Cart', 'gambol-builder' ),
	description: __( 'Display a mini cart widget.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'mini cart', 'gambol-builder' ),
		__( 'cart', 'gambol-builder' ),
		__( 'shopping', 'gambol-builder' ),
		__( 'woocommerce', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		showIcon: {
			type: 'boolean',
			default: true,
		},
		showCount: {
			type: 'boolean',
			default: true,
		},
		showTotal: {
			type: 'boolean',
			default: true,
		},
		iconSize: {
			type: 'number',
			default: 24,
		},
		iconColor: {
			type: 'string',
			default: '',
		},
		countBgColor: {
			type: 'string',
			default: '',
		},
		countTextColor: {
			type: 'string',
			default: '',
		},
		totalColor: {
			type: 'string',
			default: '',
		},
		dropdownStyle: {
			type: 'string',
			default: 'dropdown',
		},
		textAlign: {
			type: 'string',
			default: 'left',
		},
	},
	edit: Edit,
	save,
} );
