/**
 * Button Block
 *
 * A customizable button with full styling controls.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Button block icon.
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
		<path d="M19 6.5H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2zm.5 9c0 .3-.2.5-.5.5H5c-.3 0-.5-.2-.5-.5v-7c0-.3.2-.5.5-.5h14c.3 0 .5.2.5.5v7zM8 12.8h8v-1.5H8v1.5z" />
	</svg>
);

/**
 * Register the Button block.
 */
registerBlockType( 'gambol/button', {
	apiVersion: 3,
	title: __( 'Button', 'gambol-builder' ),
	description: __( 'A customizable button with styling controls.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'button', 'gambol-builder' ),
		__( 'link', 'gambol-builder' ),
		__( 'cta', 'gambol-builder' ),
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
			margin: [ 'top', 'bottom' ],
		},
		__experimentalBorder: {
			radius: true,
			color: true,
			width: true,
			style: true,
		},
	},
	attributes: {
		text: {
			type: 'string',
			source: 'html',
			selector: 'a,button',
			default: '',
		},
		url: {
			type: 'string',
			default: '',
		},
		linkTarget: {
			type: 'string',
			default: '',
		},
		rel: {
			type: 'string',
			default: '',
		},
		textAlign: {
			type: 'string',
			default: 'center',
		},
		hoverBackgroundColor: {
			type: 'string',
			default: '',
		},
		hoverTextColor: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
