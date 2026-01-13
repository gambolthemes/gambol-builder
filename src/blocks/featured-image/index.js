/**
 * Featured Image Block
 *
 * Display the post featured image dynamically.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Featured Image block icon.
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
		<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z" />
	</svg>
);

/**
 * Register the Featured Image block.
 */
registerBlockType( 'gambol/featured-image', {
	apiVersion: 3,
	title: __( 'Featured Image', 'gambol-builder' ),
	description: __( 'Display the post featured image.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'featured', 'gambol-builder' ),
		__( 'image', 'gambol-builder' ),
		__( 'thumbnail', 'gambol-builder' ),
		__( 'post', 'gambol-builder' ),
	],
	usesContext: [ 'postId', 'postType' ],
	supports: {
		anchor: true,
		html: false,
		align: [ 'left', 'center', 'right', 'wide', 'full' ],
	},
	attributes: {
		isLink: {
			type: 'boolean',
			default: true,
		},
		linkTarget: {
			type: 'string',
			default: '_self',
		},
		imageSize: {
			type: 'string',
			default: 'large',
		},
		aspectRatio: {
			type: 'string',
			default: '',
		},
		objectFit: {
			type: 'string',
			default: 'cover',
		},
		borderRadius: {
			type: 'number',
			default: 0,
		},
		width: {
			type: 'string',
			default: '100%',
		},
		height: {
			type: 'string',
			default: 'auto',
		},
		showOverlay: {
			type: 'boolean',
			default: false,
		},
		overlayColor: {
			type: 'string',
			default: 'rgba(0,0,0,0.3)',
		},
	},
	edit: Edit,
	save,
} );
