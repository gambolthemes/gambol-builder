/**
 * Popup Block
 *
 * Display content in a popup/modal.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Popup block icon.
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
		<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10l5 7 5-7z" />
	</svg>
);

/**
 * Register the Popup block.
 */
registerBlockType( 'gambol/popup', {
	apiVersion: 3,
	title: __( 'Popup', 'gambol-builder' ),
	description: __( 'Display content in a popup/modal.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'popup', 'gambol-builder' ),
		__( 'modal', 'gambol-builder' ),
		__( 'lightbox', 'gambol-builder' ),
		__( 'dialog', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		popupId: {
			type: 'string',
			default: '',
		},
		triggerType: {
			type: 'string',
			default: 'click',
		},
		triggerText: {
			type: 'string',
			default: 'Open Popup',
		},
		triggerDelay: {
			type: 'number',
			default: 3,
		},
		popupWidth: {
			type: 'number',
			default: 600,
		},
		popupHeight: {
			type: 'string',
			default: 'auto',
		},
		overlayColor: {
			type: 'string',
			default: 'rgba(0,0,0,0.7)',
		},
		bgColor: {
			type: 'string',
			default: '#ffffff',
		},
		borderRadius: {
			type: 'number',
			default: 12,
		},
		padding: {
			type: 'number',
			default: 30,
		},
		showCloseButton: {
			type: 'boolean',
			default: true,
		},
		closeOnOverlay: {
			type: 'boolean',
			default: true,
		},
		closeOnEsc: {
			type: 'boolean',
			default: true,
		},
		animation: {
			type: 'string',
			default: 'fade',
		},
	},
	edit: Edit,
	save,
} );
