/**
 * Product Meta Block
 *
 * Display the WooCommerce product meta (SKU, categories, tags).
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Product Meta block icon.
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
		<path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16zM16 17H5V7h11l3.55 5L16 17z" />
	</svg>
);

/**
 * Register the Product Meta block.
 */
registerBlockType( 'gambol/product-meta', {
	apiVersion: 3,
	title: __( 'Product Meta', 'gambol-builder' ),
	description: __( 'Display the product meta information.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'product', 'gambol-builder' ),
		__( 'meta', 'gambol-builder' ),
		__( 'sku', 'gambol-builder' ),
		__( 'category', 'gambol-builder' ),
		__( 'tags', 'gambol-builder' ),
		__( 'woocommerce', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	usesContext: [ 'postId', 'postType' ],
	attributes: {
		showSku: {
			type: 'boolean',
			default: true,
		},
		showCategories: {
			type: 'boolean',
			default: true,
		},
		showTags: {
			type: 'boolean',
			default: true,
		},
		layout: {
			type: 'string',
			default: 'stacked',
		},
		gap: {
			type: 'number',
			default: 8,
		},
		labelColor: {
			type: 'string',
			default: '',
		},
		valueColor: {
			type: 'string',
			default: '',
		},
		linkColor: {
			type: 'string',
			default: '',
		},
		fontSize: {
			type: 'number',
			default: 14,
		},
	},
	edit: Edit,
	save,
} );
