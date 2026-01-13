/**
 * Shortcode Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Disabled } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

import {
	InspectorSidebar,
	Section,
	TextInput,
} from '../../components/inspector';

/**
 * Shortcode Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { shortcode } = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-shortcode',
	} );

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Shortcode', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M8.5 21.5l1-1-4-4 4-4-1-1-5 5 5 5zm7-14l-1 1 4 4-4 4 1 1 5-5-5-5z"/>
						</svg>
					}
					layoutTab={
						<Section title={ __( 'Shortcode Settings', 'gambol-builder' ) }>
							<p className="components-base-control__help">
								{ __( 'Enter your WordPress shortcode below. Include the brackets.', 'gambol-builder' ) }
							</p>
						</Section>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-gambol-shortcode__header">
					<span className="wp-block-gambol-shortcode__icon">[/]</span>
					<span className="wp-block-gambol-shortcode__label">
						{ __( 'Shortcode', 'gambol-builder' ) }
					</span>
				</div>
				
				<textarea
					className="wp-block-gambol-shortcode__input"
					value={ shortcode }
					onChange={ ( e ) => setAttributes( { shortcode: e.target.value } ) }
					placeholder={ __( '[your-shortcode]', 'gambol-builder' ) }
					rows={ 3 }
				/>

				{ shortcode && (
					<div className="wp-block-gambol-shortcode__preview">
						<div className="wp-block-gambol-shortcode__preview-label">
							{ __( 'Preview', 'gambol-builder' ) }
						</div>
						<Disabled>
							<ServerSideRender
								block="gambol/shortcode"
								attributes={ attributes }
							/>
						</Disabled>
					</div>
				) }
			</div>
		</>
	);
}
