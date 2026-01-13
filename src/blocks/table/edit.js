/**
 * Table Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

/**
 * Table Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		columns,
		rows,
		hasHeader,
		hasFooter,
		tableData,
		headerBgColor,
		headerTextColor,
		bodyBgColor,
		bodyTextColor,
		borderColor,
		stripedRows,
		stripedColor,
		hoverEffect,
		borderRadius,
		cellPadding,
		alignment,
	} = attributes;

	// Initialize table data
	useEffect( () => {
		if ( tableData.length === 0 || tableData.length !== rows || ( tableData[ 0 ] && tableData[ 0 ].length !== columns ) ) {
			const newData = [];
			for ( let i = 0; i < rows; i++ ) {
				const row = [];
				for ( let j = 0; j < columns; j++ ) {
					// Preserve existing data if available
					const existingValue = tableData[ i ] && tableData[ i ][ j ] ? tableData[ i ][ j ] : '';
					if ( existingValue ) {
						row.push( existingValue );
					} else if ( i === 0 && hasHeader ) {
						row.push( `Header ${ j + 1 }` );
					} else {
						row.push( `Cell ${ i },${ j + 1 }` );
					}
				}
				newData.push( row );
			}
			setAttributes( { tableData: newData } );
		}
	}, [ columns, rows, hasHeader ] );

	const updateCell = ( rowIndex, colIndex, value ) => {
		const newData = tableData.map( ( row, ri ) =>
			row.map( ( cell, ci ) =>
				ri === rowIndex && ci === colIndex ? value : cell
			)
		);
		setAttributes( { tableData: newData } );
	};

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-table ${ stripedRows ? 'has-striped-rows' : '' } ${ hoverEffect ? 'has-hover-effect' : '' } align-${ alignment }`,
	} );

	const tableStyle = {
		borderColor: borderColor || undefined,
		borderRadius: `${ borderRadius }px`,
	};

	const headerStyle = {
		backgroundColor: headerBgColor || undefined,
		color: headerTextColor || undefined,
	};

	const bodyStyle = {
		backgroundColor: bodyBgColor || undefined,
		color: bodyTextColor || undefined,
	};

	const cellStyle = {
		padding: `${ cellPadding }px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Table', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Table Structure', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Columns', 'gambol-builder' ) }
									value={ columns }
									onChange={ ( value ) => setAttributes( { columns: value } ) }
									min={ 1 }
									max={ 10 }
								/>
								<RangeSlider
									label={ __( 'Rows', 'gambol-builder' ) }
									value={ rows }
									onChange={ ( value ) => setAttributes( { rows: value } ) }
									min={ 1 }
									max={ 20 }
								/>
								<Toggle
									label={ __( 'Header Row', 'gambol-builder' ) }
									checked={ hasHeader }
									onChange={ ( value ) => setAttributes( { hasHeader: value } ) }
								/>
								<Toggle
									label={ __( 'Footer Row', 'gambol-builder' ) }
									checked={ hasFooter }
									onChange={ ( value ) => setAttributes( { hasFooter: value } ) }
								/>
							</Section>

							<Section title={ __( 'Cell Options', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Cell Padding', 'gambol-builder' ) }
									value={ cellPadding }
									onChange={ ( value ) => setAttributes( { cellPadding: value } ) }
									min={ 4 }
									max={ 24 }
								/>
								<ButtonGroup
									label={ __( 'Text Alignment', 'gambol-builder' ) }
									value={ alignment }
									onChange={ ( value ) => setAttributes( { alignment: value } ) }
									options={ [
										{ value: 'left', label: 'Left' },
										{ value: 'center', label: 'Center' },
										{ value: 'right', label: 'Right' },
									] }
								/>
							</Section>

							<Section title={ __( 'Row Options', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Striped Rows', 'gambol-builder' ) }
									checked={ stripedRows }
									onChange={ ( value ) => setAttributes( { stripedRows: value } ) }
								/>
								<Toggle
									label={ __( 'Hover Effect', 'gambol-builder' ) }
									checked={ hoverEffect }
									onChange={ ( value ) => setAttributes( { hoverEffect: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Table Style', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 20 }
								/>
								<GambolColorPicker
									label={ __( 'Border Color', 'gambol-builder' ) }
									value={ borderColor }
									onChange={ ( value ) => setAttributes( { borderColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Header', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ headerBgColor }
									onChange={ ( value ) => setAttributes( { headerBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ headerTextColor }
									onChange={ ( value ) => setAttributes( { headerTextColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Body', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ bodyBgColor }
									onChange={ ( value ) => setAttributes( { bodyBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ bodyTextColor }
									onChange={ ( value ) => setAttributes( { bodyTextColor: value } ) }
								/>
								{ stripedRows && (
									<GambolColorPicker
										label={ __( 'Striped Row Color', 'gambol-builder' ) }
										value={ stripedColor }
										onChange={ ( value ) => setAttributes( { stripedColor: value } ) }
									/>
								) }
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<table style={ tableStyle }>
					{ hasHeader && tableData.length > 0 && (
						<thead style={ headerStyle }>
							<tr>
								{ tableData[ 0 ].map( ( cell, colIndex ) => (
									<th key={ colIndex } style={ cellStyle }>
										<RichText
											value={ cell }
											onChange={ ( value ) => updateCell( 0, colIndex, value ) }
											placeholder={ __( 'Header', 'gambol-builder' ) }
										/>
									</th>
								) ) }
							</tr>
						</thead>
					) }
					
					<tbody style={ bodyStyle }>
						{ tableData.slice( hasHeader ? 1 : 0, hasFooter ? -1 : undefined ).map( ( row, rowIndex ) => {
							const actualRowIndex = hasHeader ? rowIndex + 1 : rowIndex;
							const rowStyle = stripedRows && rowIndex % 2 === 1 ? { backgroundColor: stripedColor || undefined } : {};
							
							return (
								<tr key={ actualRowIndex } style={ rowStyle }>
									{ row.map( ( cell, colIndex ) => (
										<td key={ colIndex } style={ cellStyle }>
											<RichText
												value={ cell }
												onChange={ ( value ) => updateCell( actualRowIndex, colIndex, value ) }
												placeholder={ __( 'Cell', 'gambol-builder' ) }
											/>
										</td>
									) ) }
								</tr>
							);
						} ) }
					</tbody>
					
					{ hasFooter && tableData.length > 0 && (
						<tfoot style={ headerStyle }>
							<tr>
								{ tableData[ tableData.length - 1 ].map( ( cell, colIndex ) => (
									<td key={ colIndex } style={ cellStyle }>
										<RichText
											value={ cell }
											onChange={ ( value ) => updateCell( tableData.length - 1, colIndex, value ) }
											placeholder={ __( 'Footer', 'gambol-builder' ) }
										/>
									</td>
								) ) }
							</tr>
						</tfoot>
					) }
				</table>
			</div>
		</>
	);
}
