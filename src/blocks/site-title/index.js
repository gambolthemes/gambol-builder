/**
 * Site Title Block
 *
 * Display the site title dynamically.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Site Title block icon.
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
		<path d="M5 4v3h5.5v12h3V7H19V4H5z" />
	</svg>
);

/**
 * Register the Site Title block.
 */
registerBlockType( 'gambol/site-title', {
	apiVersion: 3,
	title: __( 'Site Title', 'gambol-builder' ),
	description: __( 'Display the site title.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'site', 'gambol-builder' ),
		__( 'title', 'gambol-builder' ),
		__( 'name', 'gambol-builder' ),
		__( 'heading', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'left', 'center', 'right' ],
		color: {
			gradients: true,
			link: true,
		},
		typography: {
			fontSize: true,
			lineHeight: true,
		},
	},
	attributes: {
		level: {
			type: 'number',
			default: 1,
		},
		isLink: {
			type: 'boolean',
			default: true,
		},
		linkTarget: {
			type: 'string',
			default: '_self',
		},
		textColor: {
			type: 'string',
			default: '',
		},
		fontSize: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
