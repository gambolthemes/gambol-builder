/**
 * Image Carousel Block
 *
 * A carousel/slider for images.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Image Carousel block icon.
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
		<path d="M2 6h4v12H2V6zm5 0h10v12H7V6zm11 0h4v12h-4V6z" />
	</svg>
);

/**
 * Register the Image Carousel block.
 */
registerBlockType( 'gambol/image-carousel', {
	apiVersion: 3,
	title: __( 'Image Carousel', 'gambol-builder' ),
	description: __( 'A carousel slider for images.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'image', 'gambol-builder' ),
		__( 'carousel', 'gambol-builder' ),
		__( 'slider', 'gambol-builder' ),
		__( 'gallery', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		images: {
			type: 'array',
			default: [],
		},
		slidesToShow: {
			type: 'number',
			default: 3,
		},
		slidesToScroll: {
			type: 'number',
			default: 1,
		},
		autoplay: {
			type: 'boolean',
			default: false,
		},
		autoplaySpeed: {
			type: 'number',
			default: 3000,
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
		pauseOnHover: {
			type: 'boolean',
			default: true,
		},
		imageSize: {
			type: 'string',
			default: 'large',
		},
		gap: {
			type: 'number',
			default: 20,
		},
		aspectRatio: {
			type: 'string',
			default: '16/9',
		},
	},
	edit: Edit,
	save,
} );
