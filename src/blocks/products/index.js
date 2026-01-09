/**
 * Products Block
 *
 * Display WooCommerce products in a grid layout.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Products block icon.
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
		<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
	</svg>
);

/**
 * Register the Products block.
 */
registerBlockType( 'gambol/products', {
	apiVersion: 3,
	title: __( 'Products', 'gambol-builder' ),
	description: __( 'Display WooCommerce products.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'products', 'gambol-builder' ),
		__( 'woocommerce', 'gambol-builder' ),
		__( 'shop', 'gambol-builder' ),
		__( 'ecommerce', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		productsPerPage: {
			type: 'number',
			default: 8,
		},
		columns: {
			type: 'number',
			default: 4,
		},
		orderBy: {
			type: 'string',
			default: 'date',
		},
		order: {
			type: 'string',
			default: 'desc',
		},
		showOnSale: {
			type: 'boolean',
			default: false,
		},
		showFeatured: {
			type: 'boolean',
			default: false,
		},
		showImage: {
			type: 'boolean',
			default: true,
		},
		showTitle: {
			type: 'boolean',
			default: true,
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
		showBadge: {
			type: 'boolean',
			default: true,
		},
		imageRatio: {
			type: 'string',
			default: '1/1',
		},
		gap: {
			type: 'number',
			default: 24,
		},
		cardBackgroundColor: {
			type: 'string',
			default: '#ffffff',
		},
		titleColor: {
			type: 'string',
			default: '',
		},
		priceColor: {
			type: 'string',
			default: '',
		},
		salePriceColor: {
			type: 'string',
			default: '',
		},
		buttonColor: {
			type: 'string',
			default: '',
		},
		buttonBgColor: {
			type: 'string',
			default: '',
		},
		badgeColor: {
			type: 'string',
			default: '#ffffff',
		},
		badgeBgColor: {
			type: 'string',
			default: '#ff4757',
		},
		borderRadius: {
			type: 'number',
			default: 8,
		},
		showShadow: {
			type: 'boolean',
			default: true,
		},
	},
	edit: Edit,
	save,
} );
