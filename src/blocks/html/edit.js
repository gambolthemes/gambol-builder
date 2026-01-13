/**
 * HTML Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
} from '../../components/inspector';

/**
 * HTML Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { content } = attributes;
	const [ isPreview, setIsPreview ] = useState( false );

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-html',
	} );

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'HTML', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
						</svg>
					}
					layoutTab={
						<Section title={ __( 'HTML Settings', 'gambol-builder' ) }>
							<p className="components-base-control__help">
								{ __( 'Write your custom HTML code below. Use the Preview button to see how it will appear.', 'gambol-builder' ) }
							</p>
						</Section>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-gambol-html__header">
					<span className="wp-block-gambol-html__label">
						{ __( 'HTML', 'gambol-builder' ) }
					</span>
					<Button
						variant={ isPreview ? 'primary' : 'secondary' }
						isSmall
						onClick={ () => setIsPreview( ! isPreview ) }
					>
						{ isPreview ? __( 'Edit', 'gambol-builder' ) : __( 'Preview', 'gambol-builder' ) }
					</Button>
				</div>

				{ isPreview ? (
					<div 
						className="wp-block-gambol-html__preview"
						dangerouslySetInnerHTML={ { __html: content } }
					/>
				) : (
					<textarea
						className="wp-block-gambol-html__textarea"
						value={ content }
						onChange={ ( e ) => setAttributes( { content: e.target.value } ) }
						placeholder={ __( 'Write HTML...', 'gambol-builder' ) }
						rows={ 10 }
					/>
				) }
			</div>
		</>
	);
}
