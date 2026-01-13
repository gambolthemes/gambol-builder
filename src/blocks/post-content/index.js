/**
 * Post Content Block
 *
 * Display the post content dynamically.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Post Content block icon.
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
		<path d="M4 6h16V5H4v1zm0 3h16V8H4v1zm0 3h16v-1H4v1zm0 3h16v-1H4v1zm0 3h10v-1H4v1z" />
	</svg>
);

/**
 * Register the Post Content block.
 */
registerBlockType( 'gambol/post-content', {
	apiVersion: 3,
	title: __( 'Post Content', 'gambol-builder' ),
	description: __( 'Display the post content.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'post', 'gambol-builder' ),
		__( 'content', 'gambol-builder' ),
		__( 'body', 'gambol-builder' ),
		__( 'dynamic', 'gambol-builder' ),
	],
	usesContext: [ 'postId', 'postType' ],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
		typography: {
			fontSize: true,
			lineHeight: true,
		},
	},
	attributes: {
		textColor: {
			type: 'string',
			default: '',
		},
		fontSize: {
			type: 'string',
			default: '',
		},
		lineHeight: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
