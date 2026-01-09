/**
 * Gambol Gallery Block
 *
 * Advanced image gallery with multiple layouts and lightbox support.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Gallery icon.
 */
const GalleryIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
	</svg>
);

/**
 * Block attributes.
 */
const attributes = {
	// Images
	images: {
		type: 'array',
		default: [],
	},

	// Layout
	layout: {
		type: 'string',
		default: 'grid',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	columnsTablet: {
		type: 'number',
		default: 2,
	},
	columnsMobile: {
		type: 'number',
		default: 1,
	},
	gap: {
		type: 'number',
		default: 16,
	},

	// Masonry Settings
	masonryGutter: {
		type: 'number',
		default: 16,
	},

	// Image Settings
	aspectRatio: {
		type: 'string',
		default: 'auto',
	},
	objectFit: {
		type: 'string',
		default: 'cover',
	},
	borderRadius: {
		type: 'string',
		default: '8px',
	},

	// Hover Effects
	hoverEffect: {
		type: 'string',
		default: 'zoom',
	},
	hoverOverlay: {
		type: 'boolean',
		default: true,
	},
	overlayColor: {
		type: 'string',
		default: 'rgba(0, 0, 0, 0.4)',
	},
	showCaption: {
		type: 'boolean',
		default: false,
	},
	captionPosition: {
		type: 'string',
		default: 'overlay',
	},

	// Lightbox
	enableLightbox: {
		type: 'boolean',
		default: true,
	},

	// Advanced
	htmlId: {
		type: 'string',
		default: '',
	},
	cssClasses: {
		type: 'string',
		default: '',
	},
};

/**
 * Register block.
 */
registerBlockType( 'gambol/gallery', {
	apiVersion: 3,
	title: __( 'Gallery', 'gambol-builder' ),
	description: __( 'Create beautiful image galleries with multiple layouts.', 'gambol-builder' ),
	category: 'gambol-media',
	icon: GalleryIcon,
	keywords: [
		__( 'gallery', 'gambol-builder' ),
		__( 'images', 'gambol-builder' ),
		__( 'photos', 'gambol-builder' ),
		__( 'grid', 'gambol-builder' ),
		__( 'masonry', 'gambol-builder' ),
	],
	attributes,
	supports: {
		align: [ 'wide', 'full' ],
		html: false,
		anchor: true,
	},
	example: {
		attributes: {
			images: [
				{ id: 1, url: 'https://via.placeholder.com/400x300', alt: 'Sample 1' },
				{ id: 2, url: 'https://via.placeholder.com/400x400', alt: 'Sample 2' },
				{ id: 3, url: 'https://via.placeholder.com/400x350', alt: 'Sample 3' },
			],
		},
	},
	edit: Edit,
	save,
} );
