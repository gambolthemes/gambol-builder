/**
 * Search Form Block
 *
 * Display a search form.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Search Form block icon.
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
		<path d="M13 5c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7l-3.8 3.8 1.1 1.1 3.8-3.8c1 .8 2.3 1.3 3.7 1.3 3.3 0 6-2.7 6-6S16.3 5 13 5zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" />
	</svg>
);

/**
 * Register the Search Form block.
 */
registerBlockType( 'gambol/search-form', {
	apiVersion: 3,
	title: __( 'Search Form', 'gambol-builder' ),
	description: __( 'Display a search form.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'search', 'gambol-builder' ),
		__( 'form', 'gambol-builder' ),
		__( 'find', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'left', 'center', 'right', 'wide' ],
	},
	attributes: {
		placeholder: {
			type: 'string',
			default: 'Search...',
		},
		buttonText: {
			type: 'string',
			default: 'Search',
		},
		showButton: {
			type: 'boolean',
			default: true,
		},
		buttonIcon: {
			type: 'boolean',
			default: false,
		},
		layout: {
			type: 'string',
			default: 'inline',
		},
		inputBackgroundColor: {
			type: 'string',
			default: '#ffffff',
		},
		inputTextColor: {
			type: 'string',
			default: '',
		},
		inputBorderColor: {
			type: 'string',
			default: '#dddddd',
		},
		buttonBackgroundColor: {
			type: 'string',
			default: '',
		},
		buttonTextColor: {
			type: 'string',
			default: '#ffffff',
		},
		borderRadius: {
			type: 'number',
			default: 4,
		},
		inputHeight: {
			type: 'number',
			default: 44,
		},
		width: {
			type: 'string',
			default: '100%',
		},
	},
	edit: Edit,
	save,
} );
