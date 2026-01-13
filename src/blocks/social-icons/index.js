/**
 * Social Icons Block
 *
 * Display social media icons with links.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Social Icons block icon.
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
 * Register the Social Icons block.
 */
registerBlockType( 'gambol/social-icons', {
	apiVersion: 3,
	title: __( 'Social Icons', 'gambol-builder' ),
	description: __( 'Display social media icons with links.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'social', 'gambol-builder' ),
		__( 'icons', 'gambol-builder' ),
		__( 'facebook', 'gambol-builder' ),
		__( 'twitter', 'gambol-builder' ),
		__( 'instagram', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'left', 'center', 'right' ],
	},
	attributes: {
		icons: {
			type: 'array',
			default: [
				{ platform: 'facebook', url: '#' },
				{ platform: 'twitter', url: '#' },
				{ platform: 'instagram', url: '#' },
				{ platform: 'linkedin', url: '#' },
			],
		},
		shape: {
			type: 'string',
			default: 'rounded',
		},
		size: {
			type: 'number',
			default: 40,
		},
		spacing: {
			type: 'number',
			default: 12,
		},
		iconColor: {
			type: 'string',
			default: '#ffffff',
		},
		backgroundColor: {
			type: 'string',
			default: '',
		},
		useBrandColors: {
			type: 'boolean',
			default: true,
		},
		hoverAnimation: {
			type: 'string',
			default: 'scale',
		},
		openInNewTab: {
			type: 'boolean',
			default: true,
		},
	},
	edit: Edit,
	save,
} );
