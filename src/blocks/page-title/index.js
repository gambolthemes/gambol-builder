/**
 * Page Title Block
 *
 * Display the current page/post title dynamically.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Page Title block icon.
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
		<path d="M4 5.5v2h16v-2H4zm0 5v2h16v-2H4zm0 5v2h8v-2H4z" />
	</svg>
);

/**
 * Register the Page Title block.
 */
registerBlockType( 'gambol/page-title', {
	apiVersion: 3,
	title: __( 'Page Title', 'gambol-builder' ),
	description: __( 'Display the current page or post title.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'page', 'gambol-builder' ),
		__( 'title', 'gambol-builder' ),
		__( 'post', 'gambol-builder' ),
		__( 'heading', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'left', 'center', 'right' ],
		color: {
			gradients: true,
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
			default: false,
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
