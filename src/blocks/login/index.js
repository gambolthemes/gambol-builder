/**
 * Login Block
 *
 * Display a WordPress login form.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Login block icon.
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
		<path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
	</svg>
);

/**
 * Register the Login block.
 */
registerBlockType( 'gambol/login', {
	apiVersion: 3,
	title: __( 'Login', 'gambol-builder' ),
	description: __( 'Display a login form.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'login', 'gambol-builder' ),
		__( 'signin', 'gambol-builder' ),
		__( 'user', 'gambol-builder' ),
		__( 'authentication', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		showLabels: {
			type: 'boolean',
			default: true,
		},
		showRemember: {
			type: 'boolean',
			default: true,
		},
		showForgotPassword: {
			type: 'boolean',
			default: true,
		},
		showRegisterLink: {
			type: 'boolean',
			default: false,
		},
		buttonText: {
			type: 'string',
			default: 'Log In',
		},
		redirectUrl: {
			type: 'string',
			default: '',
		},
		labelColor: {
			type: 'string',
			default: '',
		},
		inputBgColor: {
			type: 'string',
			default: '',
		},
		inputBorderColor: {
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
		linkColor: {
			type: 'string',
			default: '',
		},
		borderRadius: {
			type: 'number',
			default: 6,
		},
	},
	edit: Edit,
	save,
} );
