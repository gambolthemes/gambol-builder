/**
 * Text Block
 *
 * A paragraph element with full typography controls.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Text block icon.
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
		<path d="M18.5 5.5H5.5V7H18.5V5.5ZM18.5 11H5.5V12.5H18.5V11ZM5.5 16.5H12V18H5.5V16.5Z" />
	</svg>
);

/**
 * Register the Text block.
 */
registerBlockType( 'gambol/text', {
	apiVersion: 3,
	title: __( 'Text', 'gambol-builder' ),
	description: __( 'A paragraph with typography controls.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'text', 'gambol-builder' ),
		__( 'paragraph', 'gambol-builder' ),
		__( 'content', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		color: {
			background: false,
			text: true,
			link: true,
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
			selector: 'p',
			default: '',
		},
		textAlign: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
