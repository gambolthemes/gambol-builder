/**
 * Heading Block
 *
 * A customizable heading element with full typography controls.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Heading block icon.
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
		<path d="M6 5V18.5H7.5V13H16.5V18.5H18V5H16.5V11.5H7.5V5H6Z" />
	</svg>
);

/**
 * Register the Heading block.
 */
registerBlockType( 'gambol/heading', {
	apiVersion: 3,
	title: __( 'Heading', 'gambol-builder' ),
	description: __( 'A customizable heading with typography controls.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'heading', 'gambol-builder' ),
		__( 'title', 'gambol-builder' ),
		__( 'h1', 'gambol-builder' ),
		__( 'h2', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		color: {
			background: false,
			text: true,
			link: false,
		},
		spacing: {
			margin: [ 'top', 'bottom' ],
			padding: false,
		},
		typography: {
			fontSize: true,
			lineHeight: true,
		},
	},
	attributes: {
		content: {
			type: 'string',
			source: 'html',
			selector: 'h1,h2,h3,h4,h5,h6',
			default: '',
		},
		level: {
			type: 'number',
			default: 2,
		},
		textAlign: {
			type: 'string',
			default: '',
		},
		fontWeight: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
