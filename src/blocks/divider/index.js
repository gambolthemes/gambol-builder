/**
 * Divider Block
 *
 * A customizable horizontal divider/separator.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Divider block icon.
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
		<path d="M4 11h16v2H4z" />
	</svg>
);

/**
 * Register the Divider block.
 */
registerBlockType( 'gambol/divider', {
	apiVersion: 3,
	title: __( 'Divider', 'gambol-builder' ),
	description: __( 'A horizontal divider to separate content.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'divider', 'gambol-builder' ),
		__( 'separator', 'gambol-builder' ),
		__( 'line', 'gambol-builder' ),
		__( 'hr', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		spacing: {
			margin: [ 'top', 'bottom' ],
		},
	},
	attributes: {
		style: {
			type: 'string',
			default: 'solid',
		},
		width: {
			type: 'number',
			default: 100,
		},
		weight: {
			type: 'number',
			default: 2,
		},
		color: {
			type: 'string',
			default: '',
		},
		alignment: {
			type: 'string',
			default: 'center',
		},
		addElement: {
			type: 'boolean',
			default: false,
		},
		elementType: {
			type: 'string',
			default: 'icon',
		},
		icon: {
			type: 'string',
			default: 'star',
		},
		elementText: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
