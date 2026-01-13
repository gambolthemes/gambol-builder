/**
 * Portfolio Block
 *
 * Display portfolio items with filterable grid layout.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Portfolio block icon.
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
		<path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z" />
	</svg>
);

/**
 * Register the Portfolio block.
 */
registerBlockType( 'gambol/portfolio', {
	apiVersion: 3,
	title: __( 'Portfolio', 'gambol-builder' ),
	description: __( 'Display portfolio items with filterable grid.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'portfolio', 'gambol-builder' ),
		__( 'gallery', 'gambol-builder' ),
		__( 'projects', 'gambol-builder' ),
		__( 'work', 'gambol-builder' ),
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
			default: 9,
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
		layout: {
			type: 'string',
			default: 'grid',
		},
		showFilter: {
			type: 'boolean',
			default: true,
		},
		filterStyle: {
			type: 'string',
			default: 'pills',
		},
		showTitle: {
			type: 'boolean',
			default: true,
		},
		showCategory: {
			type: 'boolean',
			default: true,
		},
		showOverlay: {
			type: 'boolean',
			default: true,
		},
		overlayType: {
			type: 'string',
			default: 'hover',
		},
		showLightbox: {
			type: 'boolean',
			default: true,
		},
		showLink: {
			type: 'boolean',
			default: true,
		},
		imageRatio: {
			type: 'string',
			default: '1/1',
		},
		gap: {
			type: 'number',
			default: 16,
		},
		overlayColor: {
			type: 'string',
			default: 'rgba(0, 0, 0, 0.7)',
		},
		titleColor: {
			type: 'string',
			default: '#ffffff',
		},
		categoryColor: {
			type: 'string',
			default: 'rgba(255, 255, 255, 0.8)',
		},
		filterTextColor: {
			type: 'string',
			default: '',
		},
		filterActiveColor: {
			type: 'string',
			default: '',
		},
		filterActiveBgColor: {
			type: 'string',
			default: '',
		},
		borderRadius: {
			type: 'number',
			default: 8,
		},
		iconColor: {
			type: 'string',
			default: '#ffffff',
		},
		iconBgColor: {
			type: 'string',
			default: 'var(--gb-colors-primary)',
		},
	},
	edit: Edit,
	save,
} );
