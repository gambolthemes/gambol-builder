/**
 * Icon List Block
 *
 * A list with customizable icons.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Icon List block icon.
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
		<path d="M4 4h4v4H4V4zm6 1v2h10V5H10zm-6 5h4v4H4v-4zm6 1v2h10v-2H10zm-6 5h4v4H4v-4zm6 1v2h10v-2H10z" />
	</svg>
);

/**
 * Register the Icon List block.
 */
registerBlockType( 'gambol/icon-list', {
	apiVersion: 3,
	title: __( 'Icon List', 'gambol-builder' ),
	description: __( 'A list with customizable icons for each item.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'icon', 'gambol-builder' ),
		__( 'list', 'gambol-builder' ),
		__( 'bullet', 'gambol-builder' ),
		__( 'features', 'gambol-builder' ),
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
	},
	attributes: {
		items: {
			type: 'array',
			default: [
				{ text: 'List item 1', icon: 'check' },
				{ text: 'List item 2', icon: 'check' },
				{ text: 'List item 3', icon: 'check' },
			],
		},
		iconColor: {
			type: 'string',
			default: '',
		},
		iconSize: {
			type: 'number',
			default: 16,
		},
		textColor: {
			type: 'string',
			default: '',
		},
		spacing: {
			type: 'number',
			default: 10,
		},
		layout: {
			type: 'string',
			default: 'vertical',
		},
		divider: {
			type: 'boolean',
			default: false,
		},
		dividerColor: {
			type: 'string',
			default: '',
		},
		iconPosition: {
			type: 'string',
			default: 'left',
		},
	},
	edit: Edit,
	save,
} );
