/**
 * Post Title Block
 *
 * Display the post title dynamically in loops.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Post Title block icon.
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
		<path d="M4 6h12V5H4v1zm0 5h16V9H4v2zm0 5h16v-1.5H4V16z" />
	</svg>
);

/**
 * Register the Post Title block.
 */
registerBlockType( 'gambol/post-title', {
	apiVersion: 3,
	title: __( 'Post Title', 'gambol-builder' ),
	description: __( 'Display the post title dynamically.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'post', 'gambol-builder' ),
		__( 'title', 'gambol-builder' ),
		__( 'heading', 'gambol-builder' ),
		__( 'dynamic', 'gambol-builder' ),
	],
	usesContext: [ 'postId', 'postType', 'queryId' ],
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
			default: 2,
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
		hoverColor: {
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
