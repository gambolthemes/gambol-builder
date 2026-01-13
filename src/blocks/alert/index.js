/**
 * Alert Block
 *
 * A notification/alert message box.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Alert block icon.
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
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
	</svg>
);

/**
 * Register the Alert block.
 */
registerBlockType( 'gambol/alert', {
	apiVersion: 3,
	title: __( 'Alert', 'gambol-builder' ),
	description: __( 'A notification or alert message box.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'alert', 'gambol-builder' ),
		__( 'notice', 'gambol-builder' ),
		__( 'warning', 'gambol-builder' ),
		__( 'info', 'gambol-builder' ),
		__( 'message', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		spacing: {
			padding: true,
			margin: [ 'top', 'bottom' ],
		},
		__experimentalBorder: {
			radius: true,
		},
	},
	attributes: {
		type: {
			type: 'string',
			default: 'info',
		},
		title: {
			type: 'string',
			default: '',
		},
		content: {
			type: 'string',
			default: 'This is an alert message.',
		},
		showIcon: {
			type: 'boolean',
			default: true,
		},
		dismissible: {
			type: 'boolean',
			default: false,
		},
		customIconColor: {
			type: 'string',
			default: '',
		},
		customBackgroundColor: {
			type: 'string',
			default: '',
		},
		customBorderColor: {
			type: 'string',
			default: '',
		},
		customTextColor: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
