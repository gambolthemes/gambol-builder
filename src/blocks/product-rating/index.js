/**
 * Product Rating Block
 *
 * Display the WooCommerce product rating.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Product Rating block icon.
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
		<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
	</svg>
);

/**
 * Register the Product Rating block.
 */
registerBlockType( 'gambol/product-rating', {
	apiVersion: 3,
	title: __( 'Product Rating', 'gambol-builder' ),
	description: __( 'Display the product rating stars.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'product', 'gambol-builder' ),
		__( 'rating', 'gambol-builder' ),
		__( 'stars', 'gambol-builder' ),
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
		showCount: {
			type: 'boolean',
			default: true,
		},
		starSize: {
			type: 'number',
			default: 18,
		},
		starColor: {
			type: 'string',
			default: '#ffc107',
		},
		starEmptyColor: {
			type: 'string',
			default: '#e0e0e0',
		},
		countColor: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
