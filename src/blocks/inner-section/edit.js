/**
 * Inner Section Block - Edit Component
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
	Toggle,
	RangeSlider,
} from '../../components/inspector';

const ALLOWED_BLOCKS = [ 'gambol/column', 'core/column' ];

/**
 * Inner Section Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		columns,
		columnGap,
		rowGap,
		verticalAlign,
		horizontalAlign,
		reverseColumns,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-inner-section',
		style: {
			'--columns': columns,
			'--column-gap': `${ columnGap }px`,
			'--row-gap': `${ rowGap }px`,
			alignItems: verticalAlign,
			justifyContent: horizontalAlign,
			flexDirection: reverseColumns ? 'row-reverse' : 'row',
		},
	} );

	// Create template based on columns count
	const getColumnsTemplate = () => {
		const template = [];
		for ( let i = 0; i < columns; i++ ) {
			template.push( [ 'gambol/column', {} ] );
		}
		return template;
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Inner Section', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm.5 16c0 .3-.2.5-.5.5H5c-.3 0-.5-.2-.5-.5V5c0-.3.2-.5.5-.5h14c.3 0 .5.2.5.5v14z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Columns', 'gambol-builder' ) }
									value={ columns }
									onChange={ ( value ) => setAttributes( { columns: value } ) }
									min={ 1 }
									max={ 6 }
								/>
								<RangeSlider
									label={ __( 'Column Gap (px)', 'gambol-builder' ) }
									value={ columnGap }
									onChange={ ( value ) => setAttributes( { columnGap: value } ) }
									min={ 0 }
									max={ 100 }
								/>
								<RangeSlider
									label={ __( 'Row Gap (px)', 'gambol-builder' ) }
									value={ rowGap }
									onChange={ ( value ) => setAttributes( { rowGap: value } ) }
									min={ 0 }
									max={ 100 }
								/>
							</Section>

							<Section title={ __( 'Alignment', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Vertical Align', 'gambol-builder' ) }
									value={ verticalAlign }
									onChange={ ( value ) => setAttributes( { verticalAlign: value } ) }
									options={ [
										{ value: 'flex-start', label: __( 'Top', 'gambol-builder' ) },
										{ value: 'center', label: __( 'Middle', 'gambol-builder' ) },
										{ value: 'flex-end', label: __( 'Bottom', 'gambol-builder' ) },
										{ value: 'stretch', label: __( 'Stretch', 'gambol-builder' ) },
									] }
								/>
								<ButtonGroup
									label={ __( 'Horizontal Align', 'gambol-builder' ) }
									value={ horizontalAlign }
									onChange={ ( value ) => setAttributes( { horizontalAlign: value } ) }
									options={ [
										{ value: 'flex-start', label: __( 'Start', 'gambol-builder' ) },
										{ value: 'center', label: __( 'Center', 'gambol-builder' ) },
										{ value: 'flex-end', label: __( 'End', 'gambol-builder' ) },
										{ value: 'space-between', label: __( 'Space Between', 'gambol-builder' ) },
									] }
								/>
								<Toggle
									label={ __( 'Reverse Columns', 'gambol-builder' ) }
									checked={ reverseColumns }
									onChange={ ( value ) => setAttributes( { reverseColumns: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<InnerBlocks
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ getColumnsTemplate() }
					orientation="horizontal"
				/>
			</div>
		</>
	);
}
