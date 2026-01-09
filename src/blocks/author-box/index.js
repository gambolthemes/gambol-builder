/**
 * Author Box Block
 *
 * Display author information with avatar.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Author Box block icon.
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
		<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
	</svg>
);

/**
 * Register the Author Box block.
 */
registerBlockType( 'gambol/author-box', {
	apiVersion: 3,
	title: __( 'Author Box', 'gambol-builder' ),
	description: __( 'Display author information with avatar and bio.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'author', 'gambol-builder' ),
		__( 'bio', 'gambol-builder' ),
		__( 'profile', 'gambol-builder' ),
		__( 'avatar', 'gambol-builder' ),
	],
	usesContext: [ 'postId', 'postType' ],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		layout: {
			type: 'string',
			default: 'horizontal',
		},
		showAvatar: {
			type: 'boolean',
			default: true,
		},
		avatarSize: {
			type: 'number',
			default: 80,
		},
		avatarBorderRadius: {
			type: 'number',
			default: 50,
		},
		showName: {
			type: 'boolean',
			default: true,
		},
		showBio: {
			type: 'boolean',
			default: true,
		},
		showLink: {
			type: 'boolean',
			default: true,
		},
		linkText: {
			type: 'string',
			default: 'View all posts',
		},
		nameColor: {
			type: 'string',
			default: '',
		},
		bioColor: {
			type: 'string',
			default: '',
		},
		linkColor: {
			type: 'string',
			default: '',
		},
		backgroundColor: {
			type: 'string',
			default: '',
		},
		padding: {
			type: 'number',
			default: 20,
		},
		borderRadius: {
			type: 'number',
			default: 8,
		},
	},
	edit: Edit,
	save,
} );
