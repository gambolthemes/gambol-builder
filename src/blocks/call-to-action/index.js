/**
 * Call to Action Block
 *
 * Display a call to action section.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Call to Action block icon.
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
		<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 8h6v2H9V8zm0 3h6v2H9v-2zm0 3h4v2H9v-2z" />
	</svg>
);

/**
 * Register the Call to Action block.
 */
registerBlockType( 'gambol/call-to-action', {
	apiVersion: 3,
	title: __( 'Call to Action', 'gambol-builder' ),
	description: __( 'Display a call to action section.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'cta', 'gambol-builder' ),
		__( 'call to action', 'gambol-builder' ),
		__( 'banner', 'gambol-builder' ),
		__( 'promotion', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		title: {
			type: 'string',
			default: 'Ready to Get Started?',
		},
		description: {
			type: 'string',
			default: 'Join thousands of satisfied customers and start your journey today.',
		},
		buttonText: {
			type: 'string',
			default: 'Get Started',
		},
		buttonUrl: {
			type: 'string',
			default: '#',
		},
		buttonTarget: {
			type: 'boolean',
			default: false,
		},
		layout: {
			type: 'string',
			default: 'horizontal',
		},
		contentAlignment: {
			type: 'string',
			default: 'left',
		},
		bgColor: {
			type: 'string',
			default: '',
		},
		bgImage: {
			type: 'string',
			default: '',
		},
		overlayColor: {
			type: 'string',
			default: '',
		},
		overlayOpacity: {
			type: 'number',
			default: 50,
		},
		titleColor: {
			type: 'string',
			default: '',
		},
		descriptionColor: {
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
		padding: {
			type: 'number',
			default: 40,
		},
		borderRadius: {
			type: 'number',
			default: 12,
		},
		titleSize: {
			type: 'number',
			default: 28,
		},
		descriptionSize: {
			type: 'number',
			default: 16,
		},
	},
	edit: Edit,
	save,
} );
