/**
 * Column Block
 *
 * A single column for use within inner sections and grids.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Column block icon.
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
		<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 16H5V5h7v14z" />
	</svg>
);

/**
 * Register the Column block.
 */
registerBlockType( 'gambol/column', {
	apiVersion: 3,
	title: __( 'Column', 'gambol-builder' ),
	description: __( 'A single column container.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'column', 'gambol-builder' ),
		__( 'layout', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		color: {
			background: true,
			text: true,
			gradients: true,
		},
		spacing: {
			padding: true,
			margin: true,
		},
		__experimentalBorder: {
			radius: true,
			color: true,
			width: true,
			style: true,
		},
	},
	attributes: {
		width: {
			type: 'string',
			default: '',
		},
		verticalAlign: {
			type: 'string',
			default: 'flex-start',
		},
		horizontalAlign: {
			type: 'string',
			default: 'flex-start',
		},
	},
	edit: Edit,
	save,
} );
