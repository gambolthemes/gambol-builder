/**
 * Star Rating Block
 *
 * Display star ratings.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Star Rating block icon.
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
 * Register the Star Rating block.
 */
registerBlockType( 'gambol/star-rating', {
	apiVersion: 3,
	title: __( 'Star Rating', 'gambol-builder' ),
	description: __( 'Display star ratings.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'star', 'gambol-builder' ),
		__( 'rating', 'gambol-builder' ),
		__( 'review', 'gambol-builder' ),
		__( 'score', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'left', 'center', 'right' ],
	},
	attributes: {
		rating: {
			type: 'number',
			default: 4.5,
		},
		scale: {
			type: 'number',
			default: 5,
		},
		size: {
			type: 'number',
			default: 24,
		},
		spacing: {
			type: 'number',
			default: 4,
		},
		filledColor: {
			type: 'string',
			default: '#ffc107',
		},
		emptyColor: {
			type: 'string',
			default: '#e0e0e0',
		},
		showLabel: {
			type: 'boolean',
			default: true,
		},
		labelPosition: {
			type: 'string',
			default: 'right',
		},
		labelFormat: {
			type: 'string',
			default: 'rating',
		},
	},
	edit: Edit,
	save,
} );
