/**
 * Loop Grid Block
 *
 * Display posts in a grid layout with advanced filtering.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Loop Grid block icon.
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
		<path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
	</svg>
);

/**
 * Register the Loop Grid block.
 */
registerBlockType( 'gambol/loop-grid', {
	apiVersion: 3,
	title: __( 'Loop Grid', 'gambol-builder' ),
	description: __( 'Display posts in a customizable grid layout.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'loop', 'gambol-builder' ),
		__( 'grid', 'gambol-builder' ),
		__( 'posts', 'gambol-builder' ),
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
			default: 9,
		},
		columns: {
			type: 'number',
			default: 3,
		},
		tabletColumns: {
			type: 'number',
			default: 2,
		},
		mobileColumns: {
			type: 'number',
			default: 1,
		},
		orderBy: {
			type: 'string',
			default: 'date',
		},
		order: {
			type: 'string',
			default: 'desc',
		},
		showFilter: {
			type: 'boolean',
			default: false,
		},
		filterTaxonomy: {
			type: 'string',
			default: 'category',
		},
		layout: {
			type: 'string',
			default: 'default',
		},
		showImage: {
			type: 'boolean',
			default: true,
		},
		imagePosition: {
			type: 'string',
			default: 'top',
		},
		imageSize: {
			type: 'string',
			default: 'medium_large',
		},
		imageRatio: {
			type: 'string',
			default: '4/3',
		},
		showTitle: {
			type: 'boolean',
			default: true,
		},
		titleTag: {
			type: 'string',
			default: 'h3',
		},
		showMeta: {
			type: 'boolean',
			default: true,
		},
		metaPosition: {
			type: 'string',
			default: 'below-title',
		},
		showExcerpt: {
			type: 'boolean',
			default: true,
		},
		excerptLength: {
			type: 'number',
			default: 15,
		},
		showReadMore: {
			type: 'boolean',
			default: true,
		},
		readMoreText: {
			type: 'string',
			default: 'Read More →',
		},
		showCategory: {
			type: 'boolean',
			default: true,
		},
		gap: {
			type: 'number',
			default: 24,
		},
		rowGap: {
			type: 'number',
			default: 24,
		},
		cardPadding: {
			type: 'number',
			default: 20,
		},
		backgroundColor: {
			type: 'string',
			default: '#ffffff',
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
		categoryColor: {
			type: 'string',
			default: '',
		},
		categoryBgColor: {
			type: 'string',
			default: '',
		},
		readMoreColor: {
			type: 'string',
			default: '',
		},
		borderRadius: {
			type: 'number',
			default: 12,
		},
		imageRadius: {
			type: 'number',
			default: 8,
		},
		showShadow: {
			type: 'boolean',
			default: true,
		},
	},
	edit: Edit,
	save,
} );
