/**
 * Post Navigation Block
 *
 * Display previous/next post links.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Post Navigation block icon.
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
		<path d="M8 12l6-6v4h6v4h-6v4L8 12zm-2 0L1 7v10l5-5z" />
	</svg>
);

/**
 * Register the Post Navigation block.
 */
registerBlockType( 'gambol/post-navigation', {
	apiVersion: 3,
	title: __( 'Post Navigation', 'gambol-builder' ),
	description: __( 'Display previous and next post links.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'post', 'gambol-builder' ),
		__( 'navigation', 'gambol-builder' ),
		__( 'previous', 'gambol-builder' ),
		__( 'next', 'gambol-builder' ),
	],
	usesContext: [ 'postId', 'postType' ],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		showThumbnail: {
			type: 'boolean',
			default: false,
		},
		thumbnailSize: {
			type: 'number',
			default: 60,
		},
		showLabel: {
			type: 'boolean',
			default: true,
		},
		prevLabel: {
			type: 'string',
			default: 'Previous Post',
		},
		nextLabel: {
			type: 'string',
			default: 'Next Post',
		},
		showArrow: {
			type: 'boolean',
			default: true,
		},
		inSameTerm: {
			type: 'boolean',
			default: false,
		},
		labelColor: {
			type: 'string',
			default: '',
		},
		titleColor: {
			type: 'string',
			default: '',
		},
		titleHoverColor: {
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
