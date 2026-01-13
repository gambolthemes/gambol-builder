/**
 * Countdown Block
 *
 * Display a countdown timer.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Countdown block icon.
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
		<path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
	</svg>
);

/**
 * Register the Countdown block.
 */
registerBlockType( 'gambol/countdown', {
	apiVersion: 3,
	title: __( 'Countdown', 'gambol-builder' ),
	description: __( 'Display a countdown timer.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'countdown', 'gambol-builder' ),
		__( 'timer', 'gambol-builder' ),
		__( 'clock', 'gambol-builder' ),
		__( 'date', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
	},
	attributes: {
		targetDate: {
			type: 'string',
			default: '',
		},
		showDays: {
			type: 'boolean',
			default: true,
		},
		showHours: {
			type: 'boolean',
			default: true,
		},
		showMinutes: {
			type: 'boolean',
			default: true,
		},
		showSeconds: {
			type: 'boolean',
			default: true,
		},
		showLabels: {
			type: 'boolean',
			default: true,
		},
		labelPosition: {
			type: 'string',
			default: 'bottom',
		},
		separator: {
			type: 'string',
			default: ':',
		},
		layout: {
			type: 'string',
			default: 'boxes',
		},
		numberColor: {
			type: 'string',
			default: '',
		},
		labelColor: {
			type: 'string',
			default: '',
		},
		boxBgColor: {
			type: 'string',
			default: '',
		},
		borderColor: {
			type: 'string',
			default: '',
		},
		numberSize: {
			type: 'number',
			default: 48,
		},
		labelSize: {
			type: 'number',
			default: 14,
		},
		gap: {
			type: 'number',
			default: 16,
		},
		borderRadius: {
			type: 'number',
			default: 8,
		},
	},
	edit: Edit,
	save,
} );
