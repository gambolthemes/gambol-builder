/**
 * Countdown Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Countdown Save Component.
 */
export default function save( { attributes } ) {
	const {
		targetDate,
		showDays,
		showHours,
		showMinutes,
		showSeconds,
		showLabels,
		labelPosition,
		separator,
		layout,
		numberColor,
		labelColor,
		boxBgColor,
		borderColor,
		numberSize,
		labelSize,
		gap,
		borderRadius,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-countdown layout-${ layout } label-${ labelPosition }`,
		style: {
			gap: `${ gap }px`,
		},
		'data-target-date': targetDate,
	} );

	const boxStyle = {
		backgroundColor: boxBgColor || undefined,
		borderColor: borderColor || undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
	};

	const numberStyle = {
		color: numberColor || undefined,
		fontSize: `${ numberSize }px`,
	};

	const labelStyle = {
		color: labelColor || undefined,
		fontSize: `${ labelSize }px`,
	};

	const separatorStyle = {
		color: numberColor || undefined,
		fontSize: `${ numberSize }px`,
	};

	const renderUnit = ( dataAttr, label, showUnit ) => {
		if ( ! showUnit ) return null;
		
		return (
			<div className="countdown-unit" style={ layout === 'boxes' ? boxStyle : {} }>
				{ labelPosition === 'top' && showLabels && (
					<span className="countdown-label" style={ labelStyle }>{ label }</span>
				) }
				<span className={ `countdown-number countdown-${ dataAttr }` } style={ numberStyle }>00</span>
				{ labelPosition === 'bottom' && showLabels && (
					<span className="countdown-label" style={ labelStyle }>{ label }</span>
				) }
			</div>
		);
	};

	const renderSeparator = () => {
		if ( layout === 'boxes' || ! separator ) return null;
		return <span className="countdown-separator" style={ separatorStyle }>{ separator }</span>;
	};

	return (
		<div { ...blockProps }>
			{ renderUnit( 'days', 'Days', showDays ) }
			{ showDays && showHours && renderSeparator() }
			{ renderUnit( 'hours', 'Hours', showHours ) }
			{ showHours && showMinutes && renderSeparator() }
			{ renderUnit( 'minutes', 'Minutes', showMinutes ) }
			{ showMinutes && showSeconds && renderSeparator() }
			{ renderUnit( 'seconds', 'Seconds', showSeconds ) }
		</div>
	);
}
