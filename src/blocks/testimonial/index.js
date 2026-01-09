/**
 * Gambol Testimonial Block
 *
 * Professional testimonial/review block with multiple layout options.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Testimonial icon.
 */
const TestimonialIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
	</svg>
);

/**
 * Block attributes.
 */
const attributes = {
	// Content
	content: {
		type: 'string',
		default: 'This is an amazing product! It has completely transformed my workflow.',
	},
	authorName: {
		type: 'string',
		default: 'John Doe',
	},
	authorTitle: {
		type: 'string',
		default: 'CEO, Company Inc.',
	},
	authorImage: {
		type: 'string',
		default: '',
	},

	// Rating
	showRating: {
		type: 'boolean',
		default: true,
	},
	rating: {
		type: 'number',
		default: 5,
	},
	ratingColor: {
		type: 'string',
		default: '#FFB800',
	},

	// Layout
	layout: {
		type: 'string',
		default: 'standard',
	},
	alignment: {
		type: 'string',
		default: 'left',
	},
	imagePosition: {
		type: 'string',
		default: 'left',
	},
	imageSize: {
		type: 'number',
		default: 60,
	},

	// Design
	backgroundColor: {
		type: 'string',
		default: '#ffffff',
	},
	textColor: {
		type: 'string',
		default: '#333333',
	},
	quoteColor: {
		type: 'string',
		default: 'rgba(0, 212, 170, 0.1)',
	},
	showQuoteIcon: {
		type: 'boolean',
		default: true,
	},
	padding: {
		type: 'object',
		default: { top: 30, right: 30, bottom: 30, left: 30 },
	},
	borderRadius: {
		type: 'string',
		default: '8px',
	},
	boxShadow: {
		type: 'string',
		default: '0 2px 10px rgba(0,0,0,0.08)',
	},

	// Typography
	contentFontSize: {
		type: 'number',
		default: 16,
	},
	authorNameSize: {
		type: 'number',
		default: 16,
	},
	authorTitleSize: {
		type: 'number',
		default: 14,
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
registerBlockType( 'gambol/testimonial', {
	apiVersion: 3,
	title: __( 'Testimonial', 'gambol-builder' ),
	description: __( 'Display customer testimonials and reviews.', 'gambol-builder' ),
	category: 'gambol-content',
	icon: TestimonialIcon,
	keywords: [
		__( 'testimonial', 'gambol-builder' ),
		__( 'review', 'gambol-builder' ),
		__( 'quote', 'gambol-builder' ),
		__( 'feedback', 'gambol-builder' ),
	],
	attributes,
	supports: {
		align: [ 'wide', 'full' ],
		html: false,
		anchor: true,
	},
	example: {
		attributes: {
			content: 'This product exceeded all my expectations. Highly recommended!',
			authorName: 'Jane Smith',
			authorTitle: 'Marketing Director',
			rating: 5,
		},
	},
	edit: Edit,
	save,
} );
