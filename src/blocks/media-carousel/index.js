/**
 * Media Carousel Block
 *
 * A carousel for mixed media (images and videos).
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Media Carousel block icon.
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
		<path d="M4 6h4v12H4V6zm6 0h4v12h-4V6zm6 0h4v12h-4V6zM10 10l4 2-4 2v-4z" />
	</svg>
);

/**
 * Register the Media Carousel block.
 */
registerBlockType( 'gambol/media-carousel', {
	apiVersion: 3,
	title: __( 'Media Carousel', 'gambol-builder' ),
	description: __( 'A carousel for images and videos.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'media', 'gambol-builder' ),
		__( 'carousel', 'gambol-builder' ),
		__( 'slider', 'gambol-builder' ),
		__( 'video', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		items: {
			type: 'array',
			default: [],
		},
		slidesToShow: {
			type: 'number',
			default: 1,
		},
		autoplay: {
			type: 'boolean',
			default: false,
		},
		autoplaySpeed: {
			type: 'number',
			default: 5000,
		},
		infinite: {
			type: 'boolean',
			default: true,
		},
		dots: {
			type: 'boolean',
			default: true,
		},
		arrows: {
			type: 'boolean',
			default: true,
		},
		thumbnails: {
			type: 'boolean',
			default: false,
		},
		aspectRatio: {
			type: 'string',
			default: '16/9',
		},
	},
	edit: Edit,
	save,
} );
