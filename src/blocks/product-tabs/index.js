/**
 * Product Tabs Block
 *
 * Display the WooCommerce product tabs (description, reviews, additional info).
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Product Tabs block icon.
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
		<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z" />
	</svg>
);

/**
 * Register the Product Tabs block.
 */
registerBlockType( 'gambol/product-tabs', {
	apiVersion: 3,
	title: __( 'Product Tabs', 'gambol-builder' ),
	description: __( 'Display the product tabs.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'product', 'gambol-builder' ),
		__( 'tabs', 'gambol-builder' ),
		__( 'description', 'gambol-builder' ),
		__( 'reviews', 'gambol-builder' ),
		__( 'woocommerce', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	usesContext: [ 'postId', 'postType' ],
	attributes: {
		showDescription: {
			type: 'boolean',
			default: true,
		},
		showReviews: {
			type: 'boolean',
			default: true,
		},
		showAdditionalInfo: {
			type: 'boolean',
			default: true,
		},
		layout: {
			type: 'string',
			default: 'horizontal',
		},
		tabBgColor: {
			type: 'string',
			default: '',
		},
		tabActiveColor: {
			type: 'string',
			default: '',
		},
		tabTextColor: {
			type: 'string',
			default: '',
		},
		tabActiveTextColor: {
			type: 'string',
			default: '',
		},
		borderRadius: {
			type: 'number',
			default: 0,
		},
		contentPadding: {
			type: 'number',
			default: 24,
		},
	},
	edit: Edit,
	save,
} );
