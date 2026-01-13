/**
 * Table of Contents Block
 *
 * Display an auto-generated table of contents.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Table of Contents block icon.
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
		<path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h12v2H3v-2zm0 4h12v2H3v-2zm16-4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
	</svg>
);

/**
 * Register the Table of Contents block.
 */
registerBlockType( 'gambol/table-of-contents', {
	apiVersion: 3,
	title: __( 'Table of Contents', 'gambol-builder' ),
	description: __( 'Display an auto-generated table of contents.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'toc', 'gambol-builder' ),
		__( 'table of contents', 'gambol-builder' ),
		__( 'headings', 'gambol-builder' ),
		__( 'navigation', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		title: {
			type: 'string',
			default: 'Table of Contents',
		},
		showTitle: {
			type: 'boolean',
			default: true,
		},
		headingLevels: {
			type: 'array',
			default: [ 2, 3, 4 ],
		},
		listStyle: {
			type: 'string',
			default: 'numbered',
		},
		collapsible: {
			type: 'boolean',
			default: false,
		},
		collapsed: {
			type: 'boolean',
			default: false,
		},
		showToggle: {
			type: 'boolean',
			default: true,
		},
		smoothScroll: {
			type: 'boolean',
			default: true,
		},
		highlightActive: {
			type: 'boolean',
			default: true,
		},
		bgColor: {
			type: 'string',
			default: '',
		},
		textColor: {
			type: 'string',
			default: '',
		},
		linkColor: {
			type: 'string',
			default: '',
		},
		linkHoverColor: {
			type: 'string',
			default: '',
		},
		borderColor: {
			type: 'string',
			default: '',
		},
		borderRadius: {
			type: 'number',
			default: 8,
		},
		padding: {
			type: 'number',
			default: 20,
		},
	},
	edit: Edit,
	save,
} );
