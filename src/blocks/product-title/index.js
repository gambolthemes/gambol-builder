/**
 * Product Title Block
 *
 * Display the WooCommerce product title.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Product Title block icon.
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
		<path d="M5 4v3h5.5v12h3V7H19V4H5z" />
	</svg>
);

/**
 * Register the Product Title block.
 */
registerBlockType( 'gambol/product-title', {
	apiVersion: 3,
	title: __( 'Product Title', 'gambol-builder' ),
	description: __( 'Display the product title.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'product', 'gambol-builder' ),
		__( 'title', 'gambol-builder' ),
		__( 'woocommerce', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	usesContext: [ 'postId', 'postType' ],
	attributes: {
		tag: {
			type: 'string',
			default: 'h1',
		},
		textAlign: {
			type: 'string',
			default: 'left',
		},
		titleColor: {
			type: 'string',
			default: '',
		},
		fontSize: {
			type: 'number',
			default: 32,
		},
		fontWeight: {
			type: 'string',
			default: '700',
		},
		lineHeight: {
			type: 'number',
			default: 1.2,
		},
	},
	edit: Edit,
	save,
} );
