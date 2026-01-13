/**
 * Progress Bar Block
 *
 * Animated progress bar indicator.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Progress Bar block icon.
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
		<path d="M4 11h16v2H4zm0-4h10v2H4zm0 8h14v2H4z" />
	</svg>
);

/**
 * Register the Progress Bar block.
 */
registerBlockType( 'gambol/progress-bar', {
	apiVersion: 3,
	title: __( 'Progress Bar', 'gambol-builder' ),
	description: __( 'Display an animated progress bar.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'progress', 'gambol-builder' ),
		__( 'bar', 'gambol-builder' ),
		__( 'skill', 'gambol-builder' ),
		__( 'percentage', 'gambol-builder' ),
		__( 'loading', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		title: {
			type: 'string',
			default: 'Progress',
		},
		percentage: {
			type: 'number',
			default: 75,
		},
		showPercentage: {
			type: 'boolean',
			default: true,
		},
		percentagePosition: {
			type: 'string',
			default: 'inside',
		},
		height: {
			type: 'number',
			default: 24,
		},
		barColor: {
			type: 'string',
			default: '',
		},
		backgroundColor: {
			type: 'string',
			default: '',
		},
		textColor: {
			type: 'string',
			default: '',
		},
		borderRadius: {
			type: 'number',
			default: 50,
		},
		style: {
			type: 'string',
			default: 'default',
		},
		animate: {
			type: 'boolean',
			default: true,
		},
		animationDuration: {
			type: 'number',
			default: 1500,
		},
	},
	edit: Edit,
	save,
} );
