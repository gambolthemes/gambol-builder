/**
 * Container Block
 *
 * A centered container for constraining content width.
 * Must be used inside a Section block.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Container block icon.
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
		<path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h12c.3 0 .5.2.5.5v12zM7 16.5h10v-1.5H7v1.5zm0-4h10V11H7v1.5zm0-4h10V7H7v1.5z" />
	</svg>
);

/**
 * Register the Container block.
 */
registerBlockType( 'gambol/container', {
	apiVersion: 3,
	title: __( 'Container', 'gambol-builder' ),
	description: __( 'A centered container for constraining content width.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	parent: [ 'gambol/section' ],
	keywords: [
		__( 'container', 'gambol-builder' ),
		__( 'wrapper', 'gambol-builder' ),
		__( 'box', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		color: {
			background: true,
			gradients: true,
			text: false,
		},
		spacing: {
			margin: [ 'top', 'bottom' ],
			padding: true,
		},
	},
	attributes: {
		// Layout - Width
		contentWidth: {
			type: 'string',
			default: 'custom',
			enum: [ 'auto', 'custom' ],
		},
		maxWidth: {
			type: 'number',
			default: 1200,
		},
		maxWidthUnit: {
			type: 'string',
			default: 'px',
		},

		// Layout - Spacing
		horizontalPadding: {
			type: 'number',
			default: 16,
		},

		// Layout - Alignment
		contentAlign: {
			type: 'string',
			default: 'left',
			enum: [ 'left', 'center', 'right' ],
		},
		verticalAlign: {
			type: 'string',
			default: 'top',
			enum: [ 'top', 'center', 'bottom' ],
		},

		// Layout - Flex
		flexDirection: {
			type: 'string',
			default: 'column',
			enum: [ 'row', 'column' ],
		},
		gap: {
			type: 'number',
			default: 0,
		},

		// Design - Background
		backgroundColor: {
			type: 'string',
			default: '',
		},

		// Design - Border
		borderRadius: {
			type: 'number',
			default: 0,
		},
		borderColor: {
			type: 'string',
			default: '',
		},
		borderWidth: {
			type: 'number',
			default: 0,
		},

		// Design - Shadow
		shadowEnabled: {
			type: 'boolean',
			default: false,
		},

		// Advanced - Margin
		margin: {
			type: 'object',
			default: { top: 0, right: 0, bottom: 0, left: 0 },
		},
		marginLinked: {
			type: 'boolean',
			default: true,
		},

		// Advanced - Padding (fine-tuning)
		padding: {
			type: 'object',
			default: { top: 0, right: 16, bottom: 0, left: 16 },
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
