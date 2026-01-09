/**
 * Column Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	TextInput,
} from '../../components/inspector';

/**
 * Column Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		width,
		verticalAlign,
		horizontalAlign,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-column',
		style: {
			flex: width ? `0 0 ${ width }` : undefined,
			maxWidth: width || undefined,
			alignItems: horizontalAlign,
			justifyContent: verticalAlign,
		},
	} );

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Column', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 16H5V5h7v14z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Column Width', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Width', 'gambol-builder' ) }
									value={ width }
									onChange={ ( value ) => setAttributes( { width: value } ) }
									placeholder={ __( 'e.g., 50%, 300px', 'gambol-builder' ) }
									help={ __( 'Leave empty for equal width', 'gambol-builder' ) }
								/>
							</Section>

							<Section title={ __( 'Content Alignment', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Vertical Align', 'gambol-builder' ) }
									value={ verticalAlign }
									onChange={ ( value ) => setAttributes( { verticalAlign: value } ) }
									options={ [
										{ value: 'flex-start', label: __( 'Top', 'gambol-builder' ) },
										{ value: 'center', label: __( 'Middle', 'gambol-builder' ) },
										{ value: 'flex-end', label: __( 'Bottom', 'gambol-builder' ) },
										{ value: 'space-between', label: __( 'Space Between', 'gambol-builder' ) },
									] }
								/>
								<ButtonGroup
									label={ __( 'Horizontal Align', 'gambol-builder' ) }
									value={ horizontalAlign }
									onChange={ ( value ) => setAttributes( { horizontalAlign: value } ) }
									options={ [
										{ value: 'flex-start', label: __( 'Left', 'gambol-builder' ) },
										{ value: 'center', label: __( 'Center', 'gambol-builder' ) },
										{ value: 'flex-end', label: __( 'Right', 'gambol-builder' ) },
										{ value: 'stretch', label: __( 'Stretch', 'gambol-builder' ) },
									] }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<InnerBlocks
					templateLock={ false }
					renderAppender={ InnerBlocks.ButtonBlockAppender }
				/>
			</div>
		</>
	);
}
