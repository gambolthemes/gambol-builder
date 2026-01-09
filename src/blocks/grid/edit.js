/**
 * Grid Block - Edit Component
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
	TextInput,
} from '../../components/inspector';

/**
 * Grid Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		columns,
		columnsTablet,
		columnsMobile,
		gap,
		rowGap,
		minColumnWidth,
		autoFit,
		alignItems,
		justifyItems,
	} = attributes;

	const gridTemplateColumns = autoFit && minColumnWidth
		? `repeat(auto-fit, minmax(${ minColumnWidth }, 1fr))`
		: `repeat(${ columns }, 1fr)`;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-grid',
		style: {
			display: 'grid',
			gridTemplateColumns,
			gap: `${ rowGap }px ${ gap }px`,
			alignItems,
			justifyItems,
			'--grid-columns-tablet': columnsTablet,
			'--grid-columns-mobile': columnsMobile,
		},
	} );

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Grid', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Grid Settings', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Auto Fit', 'gambol-builder' ) }
									checked={ autoFit }
									onChange={ ( value ) => setAttributes( { autoFit: value } ) }
									help={ __( 'Automatically adjust columns based on min width', 'gambol-builder' ) }
								/>
								
								{ autoFit ? (
									<TextInput
										label={ __( 'Minimum Column Width', 'gambol-builder' ) }
										value={ minColumnWidth }
										onChange={ ( value ) => setAttributes( { minColumnWidth: value } ) }
										placeholder="250px"
									/>
								) : (
									<>
										<RangeSlider
											label={ __( 'Columns (Desktop)', 'gambol-builder' ) }
											value={ columns }
											onChange={ ( value ) => setAttributes( { columns: value } ) }
											min={ 1 }
											max={ 12 }
										/>
										<RangeSlider
											label={ __( 'Columns (Tablet)', 'gambol-builder' ) }
											value={ columnsTablet }
											onChange={ ( value ) => setAttributes( { columnsTablet: value } ) }
											min={ 1 }
											max={ 6 }
										/>
										<RangeSlider
											label={ __( 'Columns (Mobile)', 'gambol-builder' ) }
											value={ columnsMobile }
											onChange={ ( value ) => setAttributes( { columnsMobile: value } ) }
											min={ 1 }
											max={ 4 }
										/>
									</>
								) }
							</Section>

							<Section title={ __( 'Gap', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Column Gap (px)', 'gambol-builder' ) }
									value={ gap }
									onChange={ ( value ) => setAttributes( { gap: value } ) }
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
									label={ __( 'Align Items', 'gambol-builder' ) }
									value={ alignItems }
									onChange={ ( value ) => setAttributes( { alignItems: value } ) }
									options={ [
										{ value: 'start', label: __( 'Start', 'gambol-builder' ) },
										{ value: 'center', label: __( 'Center', 'gambol-builder' ) },
										{ value: 'end', label: __( 'End', 'gambol-builder' ) },
										{ value: 'stretch', label: __( 'Stretch', 'gambol-builder' ) },
									] }
								/>
								<ButtonGroup
									label={ __( 'Justify Items', 'gambol-builder' ) }
									value={ justifyItems }
									onChange={ ( value ) => setAttributes( { justifyItems: value } ) }
									options={ [
										{ value: 'start', label: __( 'Start', 'gambol-builder' ) },
										{ value: 'center', label: __( 'Center', 'gambol-builder' ) },
										{ value: 'end', label: __( 'End', 'gambol-builder' ) },
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
					allowedBlocks={ [ 'gambol/column', 'core/column' ] }
					orientation="horizontal"
					renderAppender={ InnerBlocks.ButtonBlockAppender }
				/>
			</div>
		</>
	);
}
