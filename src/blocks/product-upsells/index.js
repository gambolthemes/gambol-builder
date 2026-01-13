/**
 * Product Upsells Block
 *
 * Display WooCommerce upsell products.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Product Upsells block icon.
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
		<path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
	</svg>
);

/**
 * Register the Product Upsells block.
 */
registerBlockType( 'gambol/product-upsells', {
	apiVersion: 3,
	title: __( 'Product Upsells', 'gambol-builder' ),
	description: __( 'Display upsell products.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'product', 'gambol-builder' ),
		__( 'upsells', 'gambol-builder' ),
		__( 'upsell', 'gambol-builder' ),
		__( 'woocommerce', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	usesContext: [ 'postId', 'postType' ],
	attributes: {
		columns: {
			type: 'number',
			default: 4,
		},
		productsPerPage: {
			type: 'number',
			default: 4,
		},
		showTitle: {
			type: 'boolean',
			default: true,
		},
		title: {
			type: 'string',
			default: 'You may also like…',
		},
		gap: {
			type: 'number',
			default: 24,
		},
		showPrice: {
			type: 'boolean',
			default: true,
		},
		showRating: {
			type: 'boolean',
			default: true,
		},
		showAddToCart: {
			type: 'boolean',
			default: true,
		},
		titleColor: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
