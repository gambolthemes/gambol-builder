/**
 * Toggle Block
 *
 * Collapsible content toggle/FAQ item.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Toggle block icon.
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
		<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
	</svg>
);

/**
 * Register the Toggle block.
 */
registerBlockType( 'gambol/toggle', {
	apiVersion: 3,
	title: __( 'Toggle', 'gambol-builder' ),
	description: __( 'Collapsible content toggle or FAQ item.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'toggle', 'gambol-builder' ),
		__( 'faq', 'gambol-builder' ),
		__( 'collapse', 'gambol-builder' ),
		__( 'accordion', 'gambol-builder' ),
		__( 'expand', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		title: {
			type: 'string',
			default: 'Toggle Title',
		},
		content: {
			type: 'string',
			default: 'Toggle content goes here. Click to expand or collapse.',
		},
		isOpen: {
			type: 'boolean',
			default: false,
		},
		iconPosition: {
			type: 'string',
			default: 'right',
		},
		iconType: {
			type: 'string',
			default: 'chevron',
		},
		// Header Styles
		headerBackgroundColor: {
			type: 'string',
			default: '',
		},
		headerTextColor: {
			type: 'string',
			default: '',
		},
		headerPadding: {
			type: 'number',
			default: 16,
		},
		// Content Styles
		contentBackgroundColor: {
			type: 'string',
			default: '',
		},
		contentTextColor: {
			type: 'string',
			default: '',
		},
		contentPadding: {
			type: 'number',
			default: 16,
		},
		// General Styles
		borderWidth: {
			type: 'number',
			default: 1,
		},
		borderColor: {
			type: 'string',
			default: '',
		},
		borderRadius: {
			type: 'number',
			default: 8,
		},
	},
	edit: Edit,
	save,
} );
