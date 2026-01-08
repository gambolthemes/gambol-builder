/**
 * Text Block - Edit Component
 *
 * Editor interface for the Text block.
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	RichText,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Text Edit Component.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set attributes.
 * @return {JSX.Element} Edit component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		content,
		textAlign,
	} = attributes;

	// Build class names.
	const classNames = [];
	if ( textAlign ) {
		classNames.push( `has-text-align-${ textAlign }` );
	}

	// Block props.
	const blockProps = useBlockProps( {
		className: classNames.length > 0 ? classNames.join( ' ' ) : undefined,
	} );

	// Alignment options including justify.
	const alignmentOptions = [
		{ icon: 'editor-alignleft', title: __( 'Align left', 'gambol-builder' ), align: 'left' },
		{ icon: 'editor-aligncenter', title: __( 'Align center', 'gambol-builder' ), align: 'center' },
		{ icon: 'editor-alignright', title: __( 'Align right', 'gambol-builder' ), align: 'right' },
		{ icon: 'editor-justify', title: __( 'Justify', 'gambol-builder' ), align: 'justify' },
	];

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ textAlign }
					onChange={ ( value ) => setAttributes( { textAlign: value } ) }
					alignmentControls={ alignmentOptions }
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Text Settings', 'gambol-builder' ) }>
					<SelectControl
						label={ __( 'Text Alignment', 'gambol-builder' ) }
						value={ textAlign }
						options={ [
							{ label: __( 'Default', 'gambol-builder' ), value: '' },
							{ label: __( 'Left', 'gambol-builder' ), value: 'left' },
							{ label: __( 'Center', 'gambol-builder' ), value: 'center' },
							{ label: __( 'Right', 'gambol-builder' ), value: 'right' },
							{ label: __( 'Justify', 'gambol-builder' ), value: 'justify' },
						] }
						onChange={ ( value ) => setAttributes( { textAlign: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<RichText
				{ ...blockProps }
				tagName="p"
				value={ content }
				onChange={ ( value ) => setAttributes( { content: value } ) }
				placeholder={ __( 'Add text...', 'gambol-builder' ) }
				allowedFormats={ [
					'core/bold',
					'core/italic',
					'core/link',
					'core/strikethrough',
					'core/subscript',
					'core/superscript',
				] }
			/>
		</>
	);
}
