/**
 * Lottie Block
 *
 * Display Lottie animations.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Lottie block icon.
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
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 14.67V9.33c0-.79.88-1.27 1.54-.84l4.15 2.67c.61.39.61 1.29 0 1.68l-4.15 2.67c-.66.43-1.54-.05-1.54-.84z" />
	</svg>
);

/**
 * Register the Lottie block.
 */
registerBlockType( 'gambol/lottie', {
	apiVersion: 3,
	title: __( 'Lottie', 'gambol-builder' ),
	description: __( 'Display Lottie animations.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'lottie', 'gambol-builder' ),
		__( 'animation', 'gambol-builder' ),
		__( 'motion', 'gambol-builder' ),
		__( 'svg', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		source: {
			type: 'string',
			default: 'url',
		},
		url: {
			type: 'string',
			default: '',
		},
		json: {
			type: 'string',
			default: '',
		},
		width: {
			type: 'number',
			default: 300,
		},
		height: {
			type: 'number',
			default: 300,
		},
		autoplay: {
			type: 'boolean',
			default: true,
		},
		loop: {
			type: 'boolean',
			default: true,
		},
		speed: {
			type: 'number',
			default: 1,
		},
		direction: {
			type: 'number',
			default: 1,
		},
		trigger: {
			type: 'string',
			default: 'none',
		},
		hoverAction: {
			type: 'string',
			default: 'play',
		},
		renderer: {
			type: 'string',
			default: 'svg',
		},
		alignment: {
			type: 'string',
			default: 'center',
		},
	},
	edit: Edit,
	save,
} );
