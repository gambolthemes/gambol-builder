/**
 * Table Block
 *
 * Display a customizable table.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Table block icon.
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
		<path d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z" />
	</svg>
);

/**
 * Register the Table block.
 */
registerBlockType( 'gambol/table', {
	apiVersion: 3,
	title: __( 'Table', 'gambol-builder' ),
	description: __( 'Display a customizable table.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'table', 'gambol-builder' ),
		__( 'grid', 'gambol-builder' ),
		__( 'data', 'gambol-builder' ),
		__( 'spreadsheet', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		columns: {
			type: 'number',
			default: 3,
		},
		rows: {
			type: 'number',
			default: 4,
		},
		hasHeader: {
			type: 'boolean',
			default: true,
		},
		hasFooter: {
			type: 'boolean',
			default: false,
		},
		tableData: {
			type: 'array',
			default: [],
		},
		headerBgColor: {
			type: 'string',
			default: '',
		},
		headerTextColor: {
			type: 'string',
			default: '',
		},
		bodyBgColor: {
			type: 'string',
			default: '',
		},
		bodyTextColor: {
			type: 'string',
			default: '',
		},
		borderColor: {
			type: 'string',
			default: '',
		},
		stripedRows: {
			type: 'boolean',
			default: true,
		},
		stripedColor: {
			type: 'string',
			default: '',
		},
		hoverEffect: {
			type: 'boolean',
			default: true,
		},
		borderRadius: {
			type: 'number',
			default: 8,
		},
		cellPadding: {
			type: 'number',
			default: 12,
		},
		alignment: {
			type: 'string',
			default: 'left',
		},
	},
	edit: Edit,
	save,
} );
