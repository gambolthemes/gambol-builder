/**
 * Loop Carousel Block
 *
 * Display posts in a carousel/slider layout.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Loop Carousel block icon.
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
 * Register the Loop Carousel block.
 */
registerBlockType( 'gambol/loop-carousel', {
	apiVersion: 3,
	title: __( 'Loop Carousel', 'gambol-builder' ),
	description: __( 'Display posts in a carousel slider.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'loop', 'gambol-builder' ),
		__( 'carousel', 'gambol-builder' ),
		__( 'slider', 'gambol-builder' ),
		__( 'posts', 'gambol-builder' ),
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
			default: 8,
		},
		slidesToShow: {
			type: 'number',
			default: 3,
		},
		slidesToShowTablet: {
			type: 'number',
			default: 2,
		},
		slidesToShowMobile: {
			type: 'number',
			default: 1,
		},
		slidesToScroll: {
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
		autoplay: {
			type: 'boolean',
			default: true,
		},
		autoplaySpeed: {
			type: 'number',
			default: 3000,
		},
		loop: {
			type: 'boolean',
			default: true,
		},
		pauseOnHover: {
			type: 'boolean',
			default: true,
		},
		showArrows: {
			type: 'boolean',
			default: true,
		},
		showDots: {
			type: 'boolean',
			default: true,
		},
		arrowStyle: {
			type: 'string',
			default: 'circle',
		},
		spacing: {
			type: 'number',
			default: 24,
		},
		showImage: {
			type: 'boolean',
			default: true,
		},
		imageRatio: {
			type: 'string',
			default: '4/3',
		},
		showTitle: {
			type: 'boolean',
			default: true,
		},
		showExcerpt: {
			type: 'boolean',
			default: true,
		},
		excerptLength: {
			type: 'number',
			default: 12,
		},
		showMeta: {
			type: 'boolean',
			default: true,
		},
		showCategory: {
			type: 'boolean',
			default: true,
		},
		showReadMore: {
			type: 'boolean',
			default: true,
		},
		readMoreText: {
			type: 'string',
			default: 'Read More',
		},
		cardBackgroundColor: {
			type: 'string',
			default: '#ffffff',
		},
		cardPadding: {
			type: 'number',
			default: 20,
		},
		borderRadius: {
			type: 'number',
			default: 12,
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
		arrowColor: {
			type: 'string',
			default: '',
		},
		arrowBgColor: {
			type: 'string',
			default: '',
		},
		dotColor: {
			type: 'string',
			default: '',
		},
		dotActiveColor: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
