/**
 * Product Short Description Block
 *
 * Display the WooCommerce product short description.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Product Short Description block icon.
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
		<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-9-8h6v2h-6v-2zm0 4h4v2h-4v-2zm-4-4h2v6H8v-6z" />
	</svg>
);

/**
 * Register the Product Short Description block.
 */
registerBlockType( 'gambol/product-short-description', {
	apiVersion: 3,
	title: __( 'Product Short Description', 'gambol-builder' ),
	description: __( 'Display the product short description.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'product', 'gambol-builder' ),
		__( 'description', 'gambol-builder' ),
		__( 'excerpt', 'gambol-builder' ),
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
		fontSize: {
			type: 'number',
			default: 16,
		},
		lineHeight: {
			type: 'number',
			default: 1.6,
		},
		textColor: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
