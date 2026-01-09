/**
 * Product Price Block
 *
 * Display the WooCommerce product price.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Product Price block icon.
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
		<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
	</svg>
);

/**
 * Register the Product Price block.
 */
registerBlockType( 'gambol/product-price', {
	apiVersion: 3,
	title: __( 'Product Price', 'gambol-builder' ),
	description: __( 'Display the product price.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'product', 'gambol-builder' ),
		__( 'price', 'gambol-builder' ),
		__( 'woocommerce', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	usesContext: [ 'postId', 'postType' ],
	attributes: {
		textAlign: {
			type: 'string',
			default: 'left',
		},
		priceColor: {
			type: 'string',
			default: '',
		},
		salePriceColor: {
			type: 'string',
			default: '',
		},
		regularPriceColor: {
			type: 'string',
			default: '',
		},
		fontSize: {
			type: 'number',
			default: 24,
		},
		fontWeight: {
			type: 'string',
			default: '700',
		},
	},
	edit: Edit,
	save,
} );
