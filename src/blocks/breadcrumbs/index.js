/**
 * Breadcrumbs Block
 *
 * Display navigation breadcrumbs.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Breadcrumbs block icon.
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
		<path d="M4 11h6V9H4v2zm8 0h6V9h-6v2zm8 0h2V9h-2v2zM4 15h2v-2H4v2zm4 0h6v-2H8v2zm8 0h6v-2h-6v2z" />
	</svg>
);

/**
 * Register the Breadcrumbs block.
 */
registerBlockType( 'gambol/breadcrumbs', {
	apiVersion: 3,
	title: __( 'Breadcrumbs', 'gambol-builder' ),
	description: __( 'Display navigation breadcrumbs.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'breadcrumbs', 'gambol-builder' ),
		__( 'navigation', 'gambol-builder' ),
		__( 'path', 'gambol-builder' ),
		__( 'trail', 'gambol-builder' ),
	],
	usesContext: [ 'postId', 'postType' ],
	supports: {
		anchor: true,
		html: false,
		align: [ 'left', 'center', 'right' ],
	},
	attributes: {
		showHome: {
			type: 'boolean',
			default: true,
		},
		homeText: {
			type: 'string',
			default: 'Home',
		},
		separator: {
			type: 'string',
			default: '/',
		},
		showCurrentPage: {
			type: 'boolean',
			default: true,
		},
		linkCurrentPage: {
			type: 'boolean',
			default: false,
		},
		textColor: {
			type: 'string',
			default: '',
		},
		linkColor: {
			type: 'string',
			default: '',
		},
		separatorColor: {
			type: 'string',
			default: '',
		},
		fontSize: {
			type: 'string',
			default: '14px',
		},
	},
	edit: Edit,
	save,
} );
