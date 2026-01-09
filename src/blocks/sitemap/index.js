/**
 * Sitemap Block
 *
 * Display an HTML sitemap.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Sitemap block icon.
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
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
	</svg>
);

/**
 * Register the Sitemap block.
 */
registerBlockType( 'gambol/sitemap', {
	apiVersion: 3,
	title: __( 'Sitemap', 'gambol-builder' ),
	description: __( 'Display an HTML sitemap of your site.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'sitemap', 'gambol-builder' ),
		__( 'pages', 'gambol-builder' ),
		__( 'posts', 'gambol-builder' ),
		__( 'navigation', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		showPages: {
			type: 'boolean',
			default: true,
		},
		showPosts: {
			type: 'boolean',
			default: true,
		},
		showCategories: {
			type: 'boolean',
			default: true,
		},
		showTags: {
			type: 'boolean',
			default: false,
		},
		columns: {
			type: 'number',
			default: 3,
		},
		pagesTitle: {
			type: 'string',
			default: 'Pages',
		},
		postsTitle: {
			type: 'string',
			default: 'Recent Posts',
		},
		categoriesTitle: {
			type: 'string',
			default: 'Categories',
		},
		tagsTitle: {
			type: 'string',
			default: 'Tags',
		},
		postsCount: {
			type: 'number',
			default: 10,
		},
		headingColor: {
			type: 'string',
			default: '',
		},
		linkColor: {
			type: 'string',
			default: '',
		},
		linkHoverColor: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
