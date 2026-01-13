/**
 * Form Block
 *
 * Create contact and other forms.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Form block icon.
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
		<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
	</svg>
);

/**
 * Register the Form block.
 */
registerBlockType( 'gambol/form', {
	apiVersion: 3,
	title: __( 'Form', 'gambol-builder' ),
	description: __( 'Create contact and other forms.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'form', 'gambol-builder' ),
		__( 'contact', 'gambol-builder' ),
		__( 'email', 'gambol-builder' ),
		__( 'submit', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		formType: {
			type: 'string',
			default: 'contact',
		},
		showName: {
			type: 'boolean',
			default: true,
		},
		showEmail: {
			type: 'boolean',
			default: true,
		},
		showPhone: {
			type: 'boolean',
			default: false,
		},
		showSubject: {
			type: 'boolean',
			default: true,
		},
		showMessage: {
			type: 'boolean',
			default: true,
		},
		submitText: {
			type: 'string',
			default: 'Send Message',
		},
		successMessage: {
			type: 'string',
			default: 'Thank you for your message!',
		},
		emailTo: {
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
		gap: {
			type: 'number',
			default: 16,
		},
	},
	edit: Edit,
	save,
} );
