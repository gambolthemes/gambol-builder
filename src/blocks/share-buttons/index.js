/**
 * Share Buttons Block
 *
 * Display social sharing buttons.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Share Buttons block icon.
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
		<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
	</svg>
);

/**
 * Register the Share Buttons block.
 */
registerBlockType( 'gambol/share-buttons', {
	apiVersion: 3,
	title: __( 'Share Buttons', 'gambol-builder' ),
	description: __( 'Display social sharing buttons.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'share', 'gambol-builder' ),
		__( 'social', 'gambol-builder' ),
		__( 'facebook', 'gambol-builder' ),
		__( 'twitter', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		networks: {
			type: 'array',
			default: [ 'facebook', 'twitter', 'linkedin', 'pinterest', 'whatsapp' ],
		},
		style: {
			type: 'string',
			default: 'icon-only',
		},
		shape: {
			type: 'string',
			default: 'rounded',
		},
		columns: {
			type: 'number',
			default: 5,
		},
		gap: {
			type: 'number',
			default: 10,
		},
		iconSize: {
			type: 'number',
			default: 20,
		},
		buttonSize: {
			type: 'number',
			default: 40,
		},
		showLabel: {
			type: 'boolean',
			default: false,
		},
		customColors: {
			type: 'boolean',
			default: false,
		},
		primaryColor: {
			type: 'string',
			default: '',
		},
		secondaryColor: {
			type: 'string',
			default: '',
		},
		alignment: {
			type: 'string',
			default: 'left',
		},
	},
	edit: Edit,
	save,
} );
