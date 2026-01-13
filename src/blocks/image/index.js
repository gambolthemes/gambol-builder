/**
 * Gambol Image Block
 *
 * Professional image block with advanced styling options.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Image icon.
 */
const ImageIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 2.1c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"/>
	</svg>
);

/**
 * Block attributes.
 */
const attributes = {
	// Image source
	mediaId: {
		type: 'number',
	},
	mediaUrl: {
		type: 'string',
		default: '',
	},
	alt: {
		type: 'string',
		default: '',
	},
	caption: {
		type: 'string',
		default: '',
	},

	// Size
	width: {
		type: 'string',
		default: '100%',
	},
	maxWidth: {
		type: 'string',
		default: '',
	},
	height: {
		type: 'string',
		default: 'auto',
	},
	objectFit: {
		type: 'string',
		default: 'cover',
	},

	// Link
	linkUrl: {
		type: 'string',
		default: '',
	},
	linkTarget: {
		type: 'string',
		default: '_self',
	},

	// Style
	borderRadius: {
		type: 'string',
		default: '0',
	},
	boxShadow: {
		type: 'string',
		default: 'none',
	},
	opacity: {
		type: 'number',
		default: 1,
	},

	// Overlay
	hasOverlay: {
		type: 'boolean',
		default: false,
	},
	overlayColor: {
		type: 'string',
		default: 'rgba(0,0,0,0.3)',
	},

	// Hover effects
	hoverEffect: {
		type: 'string',
		default: 'none',
	},
	hoverScale: {
		type: 'number',
		default: 1.05,
	},

	// Alignment
	alignment: {
		type: 'string',
		default: 'center',
	},

	// Spacing
	margin: {
		type: 'object',
		default: { top: 0, right: 0, bottom: 0, left: 0 },
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
registerBlockType( 'gambol/image', {
	apiVersion: 3,
	title: __( 'Image', 'gambol-builder' ),
	description: __( 'Display images with advanced styling and effects.', 'gambol-builder' ),
	category: 'gambol-content',
	icon: ImageIcon,
	keywords: [
		__( 'image', 'gambol-builder' ),
		__( 'photo', 'gambol-builder' ),
		__( 'picture', 'gambol-builder' ),
		__( 'media', 'gambol-builder' ),
	],
	attributes,
	supports: {
		align: [ 'left', 'center', 'right', 'wide', 'full' ],
		html: false,
		anchor: true,
	},
	example: {
		attributes: {
			mediaUrl: 'https://via.placeholder.com/400x300',
			alt: 'Example image',
		},
	},
	edit: Edit,
	save,
} );
