/**
 * Product Stock Block
 *
 * Display the WooCommerce product stock status.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Product Stock block icon.
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
		<path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4l16-.01V7z" />
	</svg>
);

/**
 * Register the Product Stock block.
 */
registerBlockType( 'gambol/product-stock', {
	apiVersion: 3,
	title: __( 'Product Stock', 'gambol-builder' ),
	description: __( 'Display the product stock status.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'product', 'gambol-builder' ),
		__( 'stock', 'gambol-builder' ),
		__( 'inventory', 'gambol-builder' ),
		__( 'availability', 'gambol-builder' ),
		__( 'woocommerce', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	usesContext: [ 'postId', 'postType' ],
	attributes: {
		showIcon: {
			type: 'boolean',
			default: true,
		},
		showQuantity: {
			type: 'boolean',
			default: false,
		},
		textAlign: {
			type: 'string',
			default: 'left',
		},
		fontSize: {
			type: 'number',
			default: 14,
		},
		inStockColor: {
			type: 'string',
			default: '#28a745',
		},
		lowStockColor: {
			type: 'string',
			default: '#ffc107',
		},
		outOfStockColor: {
			type: 'string',
			default: '#dc3545',
		},
	},
	edit: Edit,
	save,
} );
