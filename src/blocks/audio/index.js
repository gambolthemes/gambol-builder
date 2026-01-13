/**
 * Audio Block
 *
 * Audio player with SoundCloud integration.
 *
 * @package GambolBuilder
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import './style.scss';

/**
 * Audio block icon.
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
		<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
	</svg>
);

/**
 * Register the Audio block.
 */
registerBlockType( 'gambol/audio', {
	apiVersion: 3,
	title: __( 'Audio', 'gambol-builder' ),
	description: __( 'Audio player with multiple source options.', 'gambol-builder' ),
	category: 'gambol-builder',
	icon,
	keywords: [
		__( 'audio', 'gambol-builder' ),
		__( 'music', 'gambol-builder' ),
		__( 'soundcloud', 'gambol-builder' ),
		__( 'podcast', 'gambol-builder' ),
		__( 'player', 'gambol-builder' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'left', 'center', 'right', 'wide', 'full' ],
	},
	attributes: {
		audioSource: {
			type: 'string',
			default: 'self',
		},
		audioUrl: {
			type: 'string',
			default: '',
		},
		audioId: {
			type: 'number',
		},
		soundCloudUrl: {
			type: 'string',
			default: '',
		},
		soundCloudEmbedCode: {
			type: 'string',
			default: '',
		},
		showVisualPlayer: {
			type: 'boolean',
			default: true,
		},
		showArtwork: {
			type: 'boolean',
			default: true,
		},
		autoplay: {
			type: 'boolean',
			default: false,
		},
		loop: {
			type: 'boolean',
			default: false,
		},
		caption: {
			type: 'string',
			default: '',
		},
		// Style
		playerColor: {
			type: 'string',
			default: '',
		},
		backgroundColor: {
			type: 'string',
			default: '',
		},
		borderRadius: {
			type: 'number',
			default: 8,
		},
	},
	edit: Edit,
	save,
} );
