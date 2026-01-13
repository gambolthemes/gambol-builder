/**
 * Post Excerpt Block
 *
 * Display the post excerpt dynamically.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Post Excerpt block icon.
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
		<path d="M4 6h16V5H4v1zm0 3h10V8H4v1zm0 3h16v-1H4v1zm0 3h10v-1H4v1z" />
	</svg>
);

/**
 * Register the Post Excerpt block.
 */
registerBlockType( 'gambol/post-excerpt', {
	apiVersion: 3,
	title: __( 'Post Excerpt', 'gambol-builder' ),
	description: __( 'Display the post excerpt.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'post', 'gambol-builder' ),
		__( 'excerpt', 'gambol-builder' ),
		__( 'summary', 'gambol-builder' ),
		__( 'dynamic', 'gambol-builder' ),
	],
	usesContext: [ 'postId', 'postType' ],
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
		excerptLength: {
			type: 'number',
			default: 55,
		},
		showReadMore: {
			type: 'boolean',
			default: true,
		},
		readMoreText: {
			type: 'string',
			default: 'Read More',
		},
		textColor: {
			type: 'string',
			default: '',
		},
		linkColor: {
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
