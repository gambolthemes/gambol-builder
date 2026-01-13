/**
 * Nav Menu Block
 *
 * Display a WordPress navigation menu.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Nav Menu block icon.
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
		<path d="M5 5v1.5h14V5H5zm0 7.5h14V11H5v1.5zm0 6h14V17H5v1.5z" />
	</svg>
);

/**
 * Register the Nav Menu block.
 */
registerBlockType( 'gambol/nav-menu', {
	apiVersion: 3,
	title: __( 'Nav Menu', 'gambol-builder' ),
	description: __( 'Display a WordPress navigation menu.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'navigation', 'gambol-builder' ),
		__( 'menu', 'gambol-builder' ),
		__( 'nav', 'gambol-builder' ),
		__( 'links', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'left', 'center', 'right', 'wide', 'full' ],
	},
	attributes: {
		menuId: {
			type: 'number',
			default: 0,
		},
		layout: {
			type: 'string',
			default: 'horizontal',
		},
		showDropdownIcon: {
			type: 'boolean',
			default: true,
		},
		mobileBreakpoint: {
			type: 'number',
			default: 768,
		},
		mobileToggle: {
			type: 'string',
			default: 'hamburger',
		},
		textColor: {
			type: 'string',
			default: '',
		},
		textHoverColor: {
			type: 'string',
			default: '',
		},
		backgroundColor: {
			type: 'string',
			default: '',
		},
		fontSize: {
			type: 'string',
			default: '',
		},
		gap: {
			type: 'number',
			default: 20,
		},
		padding: {
			type: 'number',
			default: 10,
		},
	},
	edit: Edit,
	save,
} );
