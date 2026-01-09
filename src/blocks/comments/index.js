/**
 * Comments Block
 *
 * Display the post comments section.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Comments block icon.
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
		<path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
	</svg>
);

/**
 * Register the Comments block.
 */
registerBlockType( 'gambol/comments', {
	apiVersion: 3,
	title: __( 'Comments', 'gambol-builder' ),
	description: __( 'Display the post comments section.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'comments', 'gambol-builder' ),
		__( 'discussion', 'gambol-builder' ),
		__( 'replies', 'gambol-builder' ),
	],
	usesContext: [ 'postId', 'postType' ],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		showTitle: {
			type: 'boolean',
			default: true,
		},
		titleText: {
			type: 'string',
			default: 'Comments',
		},
		showAvatar: {
			type: 'boolean',
			default: true,
		},
		avatarSize: {
			type: 'number',
			default: 48,
		},
		showReplyButton: {
			type: 'boolean',
			default: true,
		},
		titleColor: {
			type: 'string',
			default: '',
		},
		textColor: {
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
	},
	edit: Edit,
	save,
} );
