/**
 * Table Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Table Save Component.
 */
export default function save( { attributes } ) {
	const {
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

	const blockProps = useBlockProps.save( {
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

	if ( ! tableData || tableData.length === 0 ) {
		return null;
	}

	return (
		<div { ...blockProps }>
			<table style={ tableStyle }>
				{ hasHeader && (
					<thead style={ headerStyle }>
						<tr>
							{ tableData[ 0 ].map( ( cell ) => (
								<th style={ cellStyle }>
									<RichText.Content value={ cell } />
								</th>
							) ) }
						</tr>
					</thead>
				) }
				
				<tbody style={ bodyStyle }>
					{ tableData.slice( hasHeader ? 1 : 0, hasFooter ? -1 : undefined ).map( ( row, rowIndex ) => {
						const rowStyle = stripedRows && rowIndex % 2 === 1 ? { backgroundColor: stripedColor || undefined } : {};
						
						return (
							<tr style={ rowStyle }>
								{ row.map( ( cell ) => (
									<td style={ cellStyle }>
										<RichText.Content value={ cell } />
									</td>
								) ) }
							</tr>
						);
					} ) }
				</tbody>
				
				{ hasFooter && (
					<tfoot style={ headerStyle }>
						<tr>
							{ tableData[ tableData.length - 1 ].map( ( cell ) => (
								<td style={ cellStyle }>
									<RichText.Content value={ cell } />
								</td>
							) ) }
						</tr>
					</tfoot>
				) }
			</table>
		</div>
	);
}
