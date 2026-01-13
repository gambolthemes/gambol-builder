/**
 * Shortcode Block
 *
 * WordPress shortcode wrapper block.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Shortcode block icon.
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
		<path d="M8.5 21.5l1-1-4-4 4-4-1-1-5 5 5 5zm7-14l-1 1 4 4-4 4 1 1 5-5-5-5z" />
	</svg>
);

/**
 * Register the Shortcode block.
 */
registerBlockType( 'gambol/shortcode', {
	apiVersion: 3,
	title: __( 'Shortcode', 'gambol-builder' ),
	description: __( 'Insert WordPress shortcodes.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'shortcode', 'gambol-builder' ),
		__( 'wordpress', 'gambol-builder' ),
		__( 'embed', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		customClassName: true,
		html: false,
	},
	attributes: {
		shortcode: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
