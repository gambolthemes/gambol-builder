/**
 * Posts Block
 *
 * Display a list of posts with various layouts.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Posts block icon.
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
		<path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z" />
	</svg>
);

/**
 * Register the Posts block.
 */
registerBlockType( 'gambol/posts', {
	apiVersion: 3,
	title: __( 'Posts', 'gambol-builder' ),
	description: __( 'Display a list of posts.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'posts', 'gambol-builder' ),
		__( 'blog', 'gambol-builder' ),
		__( 'articles', 'gambol-builder' ),
		__( 'query', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		postType: {
			type: 'string',
			default: 'post',
		},
		postsPerPage: {
			type: 'number',
			default: 6,
		},
		columns: {
			type: 'number',
			default: 3,
		},
		orderBy: {
			type: 'string',
			default: 'date',
		},
		order: {
			type: 'string',
			default: 'desc',
		},
		categories: {
			type: 'array',
			default: [],
		},
		showFeaturedImage: {
			type: 'boolean',
			default: true,
		},
		showTitle: {
			type: 'boolean',
			default: true,
		},
		showExcerpt: {
			type: 'boolean',
			default: true,
		},
		excerptLength: {
			type: 'number',
			default: 20,
		},
		showMeta: {
			type: 'boolean',
			default: true,
		},
		showDate: {
			type: 'boolean',
			default: true,
		},
		showAuthor: {
			type: 'boolean',
			default: true,
		},
		showReadMore: {
			type: 'boolean',
			default: true,
		},
		readMoreText: {
			type: 'string',
			default: 'Read More',
		},
		showPagination: {
			type: 'boolean',
			default: false,
		},
		imageRatio: {
			type: 'string',
			default: '16/9',
		},
		gap: {
			type: 'number',
			default: 30,
		},
		cardBackgroundColor: {
			type: 'string',
			default: '',
		},
		titleColor: {
			type: 'string',
			default: '',
		},
		metaColor: {
			type: 'string',
			default: '',
		},
		excerptColor: {
			type: 'string',
			default: '',
		},
		borderRadius: {
			type: 'number',
			default: 8,
		},
	},
	edit: Edit,
	save,
} );
