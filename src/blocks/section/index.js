/**
 * Section Block
 *
 * A full-width container block for building page sections.
 * Serves as the primary layout container in the builder.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Section block icon.
 * Simple, clean SVG for performance.
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
		<path d="M19 6H5c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1zm-.5 10.5h-13v-9h13v9z" />
	</svg>
);

/**
 * Register the Section block.
 */
registerBlockType( 'gambol/section', {
	apiVersion: 3,
	title: __( 'Section', 'gambol-builder' ),
	description: __( 'A full-width container for building page sections.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'section', 'gambol-builder' ),
		__( 'container', 'gambol-builder' ),
		__( 'layout', 'gambol-builder' ),
		__( 'row', 'gambol-builder' ),
	],
	supports: {
		align: [ 'wide', 'full' ],
		anchor: true,
		html: false,
		color: {
			background: true,
			gradients: true,
			text: false,
		},
		spacing: {
			margin: true,
			padding: true,
		},
		__experimentalBorder: {
			color: true,
			radius: true,
			style: true,
			width: true,
		},
	},
	attributes: {
		align: {
			type: 'string',
			default: 'full',
		},
		contentWidth: {
			type: 'string',
			default: 'boxed',
			enum: [ 'boxed', 'full' ],
		},
		maxWidth: {
			type: 'string',
			default: '1200px',
		},
		minHeight: {
			type: 'string',
			default: '',
		},
		verticalAlign: {
			type: 'string',
			default: 'top',
			enum: [ 'top', 'center', 'bottom', 'stretch' ],
		},
		tagName: {
			type: 'string',
			default: 'section',
			enum: [ 'section', 'div', 'article', 'header', 'footer' ],
		},
	},
	edit: Edit,
	save,
} );
