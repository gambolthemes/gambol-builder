/**
 * Product Image Block
 *
 * Display the WooCommerce product image.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Product Image block icon.
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
		<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
	</svg>
);

/**
 * Register the Product Image block.
 */
registerBlockType( 'gambol/product-image', {
	apiVersion: 3,
	title: __( 'Product Image', 'gambol-builder' ),
	description: __( 'Display the product featured image.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'product', 'gambol-builder' ),
		__( 'image', 'gambol-builder' ),
		__( 'woocommerce', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	usesContext: [ 'postId', 'postType' ],
	attributes: {
		showSaleBadge: {
			type: 'boolean',
			default: true,
		},
		showGallery: {
			type: 'boolean',
			default: true,
		},
		showZoom: {
			type: 'boolean',
			default: true,
		},
		showLightbox: {
			type: 'boolean',
			default: true,
		},
		imageSize: {
			type: 'string',
			default: 'woocommerce_single',
		},
		borderRadius: {
			type: 'number',
			default: 8,
		},
		badgeColor: {
			type: 'string',
			default: '#ffffff',
		},
		badgeBgColor: {
			type: 'string',
			default: '#ff4757',
		},
	},
	edit: Edit,
	save,
} );
