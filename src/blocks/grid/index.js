/**
 * Grid Block
 *
 * A CSS grid-based layout container.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Grid block icon.
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
		<path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
	</svg>
);

/**
 * Register the Grid block.
 */
registerBlockType( 'gambol/grid', {
	apiVersion: 3,
	title: __( 'Grid', 'gambol-builder' ),
	description: __( 'A CSS grid layout container.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'grid', 'gambol-builder' ),
		__( 'layout', 'gambol-builder' ),
		__( 'columns', 'gambol-builder' ),
		__( 'rows', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
		color: {
			background: true,
			text: true,
			gradients: true,
		},
		spacing: {
			padding: true,
			margin: true,
		},
	},
	attributes: {
		columns: {
			type: 'number',
			default: 3,
		},
		columnsTablet: {
			type: 'number',
			default: 2,
		},
		columnsMobile: {
			type: 'number',
			default: 1,
		},
		gap: {
			type: 'number',
			default: 20,
		},
		rowGap: {
			type: 'number',
			default: 20,
		},
		minColumnWidth: {
			type: 'string',
			default: '',
		},
		autoFit: {
			type: 'boolean',
			default: false,
		},
		alignItems: {
			type: 'string',
			default: 'stretch',
		},
		justifyItems: {
			type: 'string',
			default: 'stretch',
		},
	},
	edit: Edit,
	save,
} );
