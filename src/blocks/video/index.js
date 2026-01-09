/**
 * Gambol Video Block
 *
 * Professional video embed with controls, overlays, and lightbox support.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Video icon.
 */
const VideoIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
	</svg>
);

/**
 * Block attributes.
 */
const attributes = {
	// Video Source
	videoType: {
		type: 'string',
		default: 'youtube',
	},
	videoUrl: {
		type: 'string',
		default: '',
	},
	videoId: {
		type: 'string',
		default: '',
	},
	selfHostedUrl: {
		type: 'string',
		default: '',
	},

	// Display
	aspectRatio: {
		type: 'string',
		default: '16:9',
	},
	posterImage: {
		type: 'string',
		default: '',
	},
	showPlayIcon: {
		type: 'boolean',
		default: true,
	},
	playIconSize: {
		type: 'number',
		default: 80,
	},
	playIconColor: {
		type: 'string',
		default: '#ffffff',
	},
	playIconBgColor: {
		type: 'string',
		default: 'rgba(0, 212, 170, 0.9)',
	},

	// Playback
	autoplay: {
		type: 'boolean',
		default: false,
	},
	muted: {
		type: 'boolean',
		default: false,
	},
	loop: {
		type: 'boolean',
		default: false,
	},
	controls: {
		type: 'boolean',
		default: true,
	},

	// Lightbox
	openInLightbox: {
		type: 'boolean',
		default: false,
	},

	// Overlay
	showOverlay: {
		type: 'boolean',
		default: false,
	},
	overlayColor: {
		type: 'string',
		default: 'rgba(0, 0, 0, 0.3)',
	},

	// Border
	borderRadius: {
		type: 'string',
		default: '8px',
	},
	boxShadow: {
		type: 'string',
		default: 'none',
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
registerBlockType( 'gambol/video', {
	apiVersion: 3,
	title: __( 'Video', 'gambol-builder' ),
	description: __( 'Embed videos from YouTube, Vimeo, or self-hosted.', 'gambol-builder' ),
	category: 'gambol-media',
	icon: VideoIcon,
	keywords: [
		__( 'video', 'gambol-builder' ),
		__( 'youtube', 'gambol-builder' ),
		__( 'vimeo', 'gambol-builder' ),
		__( 'embed', 'gambol-builder' ),
	],
	attributes,
	supports: {
		align: [ 'wide', 'full' ],
		html: false,
		anchor: true,
	},
	example: {
		attributes: {
			videoType: 'youtube',
			videoId: 'dQw4w9WgXcQ',
		},
	},
	edit: Edit,
	save,
} );
