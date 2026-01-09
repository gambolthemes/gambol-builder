/**
 * Icon Box Block
 *
 * An icon with title and description.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Icon Box block icon.
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
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
	</svg>
);

/**
 * Register the Icon Box block.
 */
registerBlockType( 'gambol/icon-box', {
	apiVersion: 3,
	title: __( 'Icon Box', 'gambol-builder' ),
	description: __( 'An icon with title and description for features.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'icon', 'gambol-builder' ),
		__( 'box', 'gambol-builder' ),
		__( 'feature', 'gambol-builder' ),
		__( 'service', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		color: {
			background: true,
			text: true,
		},
		spacing: {
			padding: true,
			margin: [ 'top', 'bottom' ],
		},
		__experimentalBorder: {
			radius: true,
			color: true,
			width: true,
			style: true,
		},
	},
	attributes: {
		icon: {
			type: 'string',
			default: 'star',
		},
		title: {
			type: 'string',
			default: 'Icon Box Title',
		},
		description: {
			type: 'string',
			default: 'Add a description for your icon box here.',
		},
		layout: {
			type: 'string',
			default: 'top',
		},
		titleTag: {
			type: 'string',
			default: 'h3',
		},
		contentAlignment: {
			type: 'string',
			default: 'center',
		},
		iconSize: {
			type: 'number',
			default: 50,
		},
		iconColor: {
			type: 'string',
			default: '',
		},
		iconBackgroundColor: {
			type: 'string',
			default: '',
		},
		iconPadding: {
			type: 'number',
			default: 15,
		},
		iconBorderRadius: {
			type: 'number',
			default: 50,
		},
		hoverAnimation: {
			type: 'string',
			default: 'none',
		},
		linkUrl: {
			type: 'string',
			default: '',
		},
		linkTarget: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save,
} );
