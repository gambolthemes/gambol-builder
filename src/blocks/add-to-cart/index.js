/**
 * Add to Cart Block
 *
 * Display the WooCommerce add to cart button.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Add to Cart block icon.
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
		<path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25z" />
	</svg>
);

/**
 * Register the Add to Cart block.
 */
registerBlockType( 'gambol/add-to-cart', {
	apiVersion: 3,
	title: __( 'Add to Cart', 'gambol-builder' ),
	description: __( 'Display the add to cart button.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'add to cart', 'gambol-builder' ),
		__( 'cart', 'gambol-builder' ),
		__( 'woocommerce', 'gambol-builder' ),
		__( 'buy', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	usesContext: [ 'postId', 'postType' ],
	attributes: {
		showQuantity: {
			type: 'boolean',
			default: true,
		},
		buttonText: {
			type: 'string',
			default: 'Add to Cart',
		},
		buttonWidth: {
			type: 'string',
			default: 'auto',
		},
		buttonAlign: {
			type: 'string',
			default: 'left',
		},
		buttonColor: {
			type: 'string',
			default: '#ffffff',
		},
		buttonBgColor: {
			type: 'string',
			default: '',
		},
		buttonHoverBgColor: {
			type: 'string',
			default: '',
		},
		borderRadius: {
			type: 'number',
			default: 6,
		},
		fontSize: {
			type: 'number',
			default: 16,
		},
		paddingX: {
			type: 'number',
			default: 24,
		},
		paddingY: {
			type: 'number',
			default: 14,
		},
		quantityBorderColor: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
