/**
 * Subscribe Block
 *
 * Display a newsletter subscription form.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Subscribe block icon.
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
		<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
	</svg>
);

/**
 * Register the Subscribe block.
 */
registerBlockType( 'gambol/subscribe', {
	apiVersion: 3,
	title: __( 'Subscribe', 'gambol-builder' ),
	description: __( 'Display a newsletter subscription form.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'subscribe', 'gambol-builder' ),
		__( 'newsletter', 'gambol-builder' ),
		__( 'email', 'gambol-builder' ),
		__( 'mailchimp', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		layout: {
			type: 'string',
			default: 'inline',
		},
		showName: {
			type: 'boolean',
			default: false,
		},
		placeholder: {
			type: 'string',
			default: 'Enter your email',
		},
		buttonText: {
			type: 'string',
			default: 'Subscribe',
		},
		successMessage: {
			type: 'string',
			default: 'Thank you for subscribing!',
		},
		gap: {
			type: 'number',
			default: 0,
		},
		inputBgColor: {
			type: 'string',
			default: '',
		},
		inputBorderColor: {
			type: 'string',
			default: '',
		},
		inputTextColor: {
			type: 'string',
			default: '',
		},
		buttonBgColor: {
			type: 'string',
			default: '',
		},
		buttonTextColor: {
			type: 'string',
			default: '',
		},
		borderRadius: {
			type: 'number',
			default: 6,
		},
		inputPadding: {
			type: 'number',
			default: 14,
		},
	},
	edit: Edit,
	save,
} );
