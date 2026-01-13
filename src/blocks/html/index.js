/**
 * HTML Block
 *
 * Custom HTML code block.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * HTML block icon.
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
		<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
	</svg>
);

/**
 * Register the HTML block.
 */
registerBlockType( 'gambol/html', {
	apiVersion: 3,
	title: __( 'HTML', 'gambol-builder' ),
	description: __( 'Add custom HTML code.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'html', 'gambol-builder' ),
		__( 'code', 'gambol-builder' ),
		__( 'custom', 'gambol-builder' ),
		__( 'embed', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		customClassName: false,
		className: false,
		html: false,
	},
	attributes: {
		content: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
