/**
 * Menu Anchor Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	TextInput,
} from '../../components/inspector';

/**
 * Menu Anchor Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { anchorId } = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-menu-anchor',
	} );

	// Sanitize anchor ID - remove spaces and special characters
	const sanitizeAnchorId = ( value ) => {
		return value
			.toLowerCase()
			.replace( /\s+/g, '-' )
			.replace( /[^a-z0-9-_]/g, '' );
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Menu Anchor', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/>
						</svg>
					}
					layoutTab={
						<Section title={ __( 'Anchor Settings', 'gambol-builder' ) }>
							<TextInput
								label={ __( 'Anchor ID', 'gambol-builder' ) }
								value={ anchorId }
								onChange={ ( value ) => setAttributes( { anchorId: sanitizeAnchorId( value ) } ) }
								placeholder={ __( 'my-anchor', 'gambol-builder' ) }
								help={ __( 'Use this ID in links with # (e.g., #my-anchor)', 'gambol-builder' ) }
							/>
						</Section>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-gambol-menu-anchor__indicator">
					<span className="wp-block-gambol-menu-anchor__icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
							<path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/>
						</svg>
					</span>
					<span className="wp-block-gambol-menu-anchor__text">
						{ anchorId ? `#${ anchorId }` : __( 'Menu Anchor', 'gambol-builder' ) }
					</span>
				</div>
				
				<input
					type="text"
					className="wp-block-gambol-menu-anchor__input"
					value={ anchorId }
					onChange={ ( e ) => setAttributes( { anchorId: sanitizeAnchorId( e.target.value ) } ) }
					placeholder={ __( 'Enter anchor ID...', 'gambol-builder' ) }
				/>
			</div>
		</>
	);
}
