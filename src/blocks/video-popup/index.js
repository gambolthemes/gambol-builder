/**
 * Video Popup Block
 *
 * A video that opens in a popup/lightbox.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Video Popup block icon.
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
		<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM10 8v8l6-4-6-4z" />
	</svg>
);

/**
 * Register the Video Popup block.
 */
registerBlockType( 'gambol/video-popup', {
	apiVersion: 3,
	title: __( 'Video Popup', 'gambol-builder' ),
	description: __( 'A video that opens in a lightbox popup.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'video', 'gambol-builder' ),
		__( 'popup', 'gambol-builder' ),
		__( 'lightbox', 'gambol-builder' ),
		__( 'youtube', 'gambol-builder' ),
		__( 'vimeo', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'left', 'center', 'right', 'wide', 'full' ],
	},
	attributes: {
		videoUrl: {
			type: 'string',
			default: '',
		},
		videoType: {
			type: 'string',
			default: 'youtube',
		},
		thumbnailUrl: {
			type: 'string',
			default: '',
		},
		thumbnailId: {
			type: 'number',
		},
		title: {
			type: 'string',
			default: '',
		},
		playIconSize: {
			type: 'number',
			default: 80,
		},
		playIconColor: {
			type: 'string',
			default: '#ffffff',
		},
		playIconBackground: {
			type: 'string',
			default: 'rgba(0,0,0,0.7)',
		},
		overlayColor: {
			type: 'string',
			default: 'rgba(0,0,0,0.3)',
		},
		aspectRatio: {
			type: 'string',
			default: '16/9',
		},
		autoplay: {
			type: 'boolean',
			default: true,
		},
	},
	edit: Edit,
	save,
} );
