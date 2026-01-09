/**
 * Testimonial Carousel Block
 *
 * Slider for testimonials with multiple layouts.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Testimonial Carousel block icon.
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
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
	</svg>
);

/**
 * Register the Testimonial Carousel block.
 */
registerBlockType( 'gambol/testimonial-carousel', {
	apiVersion: 3,
	title: __( 'Testimonial Carousel', 'gambol-builder' ),
	description: __( 'Display testimonials in a carousel slider.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'testimonial', 'gambol-builder' ),
		__( 'carousel', 'gambol-builder' ),
		__( 'slider', 'gambol-builder' ),
		__( 'review', 'gambol-builder' ),
		__( 'quote', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		testimonials: {
			type: 'array',
			default: [
				{
					content: 'This is an amazing product! Highly recommended.',
					author: 'John Doe',
					position: 'CEO, Company',
					image: '',
					rating: 5,
				},
				{
					content: 'Great service and support. Will definitely use again.',
					author: 'Jane Smith',
					position: 'Manager, Business',
					image: '',
					rating: 5,
				},
				{
					content: 'Exceeded all my expectations. Thank you!',
					author: 'Mike Johnson',
					position: 'Freelancer',
					image: '',
					rating: 4,
				},
			],
		},
		layout: {
			type: 'string',
			default: 'card',
		},
		slidesToShow: {
			type: 'number',
			default: 1,
		},
		autoplay: {
			type: 'boolean',
			default: true,
		},
		autoplaySpeed: {
			type: 'number',
			default: 5000,
		},
		showDots: {
			type: 'boolean',
			default: true,
		},
		showArrows: {
			type: 'boolean',
			default: true,
		},
		showRating: {
			type: 'boolean',
			default: true,
		},
		showImage: {
			type: 'boolean',
			default: true,
		},
		// Styles
		cardBackgroundColor: {
			type: 'string',
			default: '',
		},
		textColor: {
			type: 'string',
			default: '',
		},
		authorColor: {
			type: 'string',
			default: '',
		},
		ratingColor: {
			type: 'string',
			default: '#ffc107',
		},
		borderRadius: {
			type: 'number',
			default: 12,
		},
		padding: {
			type: 'number',
			default: 32,
		},
	},
	edit: Edit,
	save,
} );
