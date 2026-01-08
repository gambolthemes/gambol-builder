/**
 * Section Block
 *
 * A full-width container block for building page sections.
 * Serves as the primary layout container in the builder.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Section block icon.
 * Simple, clean SVG for performance.
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
		<path d="M19 6H5c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1zm-.5 10.5h-13v-9h13v9z" />
	</svg>
);

/**
 * Register the Section block.
 */
registerBlockType( 'gambol/section', {
	apiVersion: 3,
	title: __( 'Section', 'gambol-builder' ),
	description: __( 'A full-width container for building page sections.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'section', 'gambol-builder' ),
		__( 'container', 'gambol-builder' ),
		__( 'layout', 'gambol-builder' ),
		__( 'row', 'gambol-builder' ),
	],
	supports: {
		align: [ 'wide', 'full' ],
		anchor: true,
		html: false,
		color: {
			background: true,
			gradients: true,
			text: false,
		},
		spacing: {
			margin: true,
			padding: true,
		},
		__experimentalBorder: {
			color: true,
			radius: true,
			style: true,
			width: true,
		},
	},
	attributes: {
		// Layout
		align: {
			type: 'string',
			default: 'full',
		},
		layoutWidth: {
			type: 'string',
			default: 'boxed',
			enum: [ 'auto', 'boxed', 'full' ],
		},
		maxWidth: {
			type: 'number',
			default: 1200,
		},
		maxWidthUnit: {
			type: 'string',
			default: 'px',
		},
		minHeight: {
			type: 'number',
			default: 0,
		},
		minHeightUnit: {
			type: 'string',
			default: 'px',
		},
		verticalAlign: {
			type: 'string',
			default: 'top',
			enum: [ 'top', 'center', 'bottom', 'stretch' ],
		},
		contentGap: {
			type: 'number',
			default: 0,
		},
		tagName: {
			type: 'string',
			default: 'section',
			enum: [ 'section', 'div', 'header', 'main', 'footer' ],
		},

		// Design - Background
		backgroundType: {
			type: 'string',
			default: 'none',
			enum: [ 'none', 'color', 'gradient', 'image' ],
		},
		backgroundColor: {
			type: 'string',
			default: '',
		},
		backgroundGradient: {
			type: 'string',
			default: '',
		},
		backgroundImage: {
			type: 'object',
			default: {},
		},
		backgroundPosition: {
			type: 'string',
			default: 'center center',
		},
		backgroundSize: {
			type: 'string',
			default: 'cover',
		},
		backgroundRepeat: {
			type: 'string',
			default: 'no-repeat',
		},

		// Design - Overlay
		overlayEnabled: {
			type: 'boolean',
			default: false,
		},
		overlayColor: {
			type: 'string',
			default: '#000000',
		},
		overlayOpacity: {
			type: 'number',
			default: 50,
		},

		// Design - Border & Effects
		borderRadius: {
			type: 'number',
			default: 0,
		},
		boxShadow: {
			type: 'string',
			default: 'none',
			enum: [ 'none', 'soft', 'medium', 'strong' ],
		},

		// Advanced - Spacing
		margin: {
			type: 'object',
			default: { top: 0, right: 0, bottom: 0, left: 0 },
		},
		marginLinked: {
			type: 'boolean',
			default: true,
		},
		padding: {
			type: 'object',
			default: { top: 40, right: 20, bottom: 40, left: 20 },
		},
		paddingLinked: {
			type: 'boolean',
			default: false,
		},

		// Advanced - Position
		zIndex: {
			type: 'number',
			default: 0,
		},

		// Advanced - Visibility
		hideOnDesktop: {
			type: 'boolean',
			default: false,
		},
		hideOnTablet: {
			type: 'boolean',
			default: false,
		},
		hideOnMobile: {
			type: 'boolean',
			default: false,
		},

		// Advanced - Custom
		cssClasses: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
