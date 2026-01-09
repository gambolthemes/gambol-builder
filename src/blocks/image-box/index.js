/**
 * Image Box Block
 *
 * An image with text content overlay or below.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Image Box block icon.
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
		<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm10 13H5v-1l3-3 1.5 1.5L14 12l5 5v2z" />
	</svg>
);

/**
 * Register the Image Box block.
 */
registerBlockType( 'gambol/image-box', {
	apiVersion: 3,
	title: __( 'Image Box', 'gambol-builder' ),
	description: __( 'An image with title and description.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'image', 'gambol-builder' ),
		__( 'box', 'gambol-builder' ),
		__( 'feature', 'gambol-builder' ),
		__( 'card', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		color: {
			background: true,
			text: true,
		},
		spacing: {
			padding: true,
			margin: [ 'top', 'bottom' ],
		},
		__experimentalBorder: {
			radius: true,
			color: true,
			width: true,
			style: true,
		},
	},
	attributes: {
		imageUrl: {
			type: 'string',
			default: '',
		},
		imageId: {
			type: 'number',
		},
		imageAlt: {
			type: 'string',
			default: '',
		},
		title: {
			type: 'string',
			default: 'Image Box Title',
		},
		description: {
			type: 'string',
			default: 'Add a description for your image box here.',
		},
		layout: {
			type: 'string',
			default: 'top',
		},
		titleTag: {
			type: 'string',
			default: 'h3',
		},
		contentAlignment: {
			type: 'string',
			default: 'center',
		},
		imageSize: {
			type: 'string',
			default: 'medium',
		},
		hoverEffect: {
			type: 'string',
			default: 'none',
		},
		linkUrl: {
			type: 'string',
			default: '',
		},
		linkTarget: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
