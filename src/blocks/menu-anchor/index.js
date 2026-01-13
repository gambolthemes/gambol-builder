/**
 * Menu Anchor Block
 *
 * An invisible anchor for navigation.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Menu Anchor block icon.
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
		<path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z" />
	</svg>
);

/**
 * Register the Menu Anchor block.
 */
registerBlockType( 'gambol/menu-anchor', {
	apiVersion: 3,
	title: __( 'Menu Anchor', 'gambol-builder' ),
	description: __( 'An invisible anchor for navigation links.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'anchor', 'gambol-builder' ),
		__( 'menu', 'gambol-builder' ),
		__( 'link', 'gambol-builder' ),
		__( 'navigation', 'gambol-builder' ),
		__( 'id', 'gambol-builder' ),
	],
	supports: {
		html: false,
		customClassName: false,
	},
	attributes: {
		anchorId: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
