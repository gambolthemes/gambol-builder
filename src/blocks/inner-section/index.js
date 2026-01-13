/**
 * Inner Section Block
 *
 * A nested section container for complex layouts.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Inner Section block icon.
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
		<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm.5 16c0 .3-.2.5-.5.5H5c-.3 0-.5-.2-.5-.5V5c0-.3.2-.5.5-.5h14c.3 0 .5.2.5.5v14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
	</svg>
);

/**
 * Register the Inner Section block.
 */
registerBlockType( 'gambol/inner-section', {
	apiVersion: 3,
	title: __( 'Inner Section', 'gambol-builder' ),
	description: __( 'A nested section for complex layouts within sections.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'inner', 'gambol-builder' ),
		__( 'section', 'gambol-builder' ),
		__( 'nested', 'gambol-builder' ),
		__( 'column', 'gambol-builder' ),
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
		columns: {
			type: 'number',
			default: 2,
		},
		columnGap: {
			type: 'number',
			default: 20,
		},
		rowGap: {
			type: 'number',
			default: 20,
		},
		verticalAlign: {
			type: 'string',
			default: 'stretch',
		},
		horizontalAlign: {
			type: 'string',
			default: 'flex-start',
		},
		reverseColumns: {
			type: 'boolean',
			default: false,
		},
	},
	edit: Edit,
	save,
} );
