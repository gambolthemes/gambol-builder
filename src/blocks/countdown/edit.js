/**
 * Countdown Block - Edit Component
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
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	RangeSlider,
	TextInput,
} from '../../components/inspector';

/**
 * Countdown Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
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

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-countdown layout-${ layout } label-${ labelPosition }`,
		style: {
			gap: `${ gap }px`,
		},
	} );

	// Sample countdown values
	const countdown = {
		days: 12,
		hours: 5,
		minutes: 32,
		seconds: 45,
	};

	const boxStyle = {
		backgroundColor: boxBgColor || 'var(--gb-colors-gray-100)',
		borderColor: borderColor || 'transparent',
		borderRadius: `${ borderRadius }px`,
	};

	const numberStyle = {
		color: numberColor || 'inherit',
		fontSize: `${ numberSize }px`,
	};

	const labelStyle = {
		color: labelColor || 'var(--gb-colors-gray-600)',
		fontSize: `${ labelSize }px`,
	};

	const separatorStyle = {
		color: numberColor || 'inherit',
		fontSize: `${ numberSize }px`,
	};

	const renderUnit = ( value, label, showUnit ) => {
		if ( ! showUnit ) return null;
		
		return (
			<div className="countdown-unit" style={ layout === 'boxes' ? boxStyle : {} }>
				{ labelPosition === 'top' && showLabels && (
					<span className="countdown-label" style={ labelStyle }>{ label }</span>
				) }
				<span className="countdown-number" style={ numberStyle }>
					{ String( value ).padStart( 2, '0' ) }
				</span>
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
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Countdown', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Target Date', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Date & Time', 'gambol-builder' ) }
									value={ targetDate }
									onChange={ ( value ) => setAttributes( { targetDate: value } ) }
									placeholder="2024-12-31 23:59:59"
								/>
							</Section>

							<Section title={ __( 'Display', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Days', 'gambol-builder' ) }
									checked={ showDays }
									onChange={ ( value ) => setAttributes( { showDays: value } ) }
								/>
								<Toggle
									label={ __( 'Hours', 'gambol-builder' ) }
									checked={ showHours }
									onChange={ ( value ) => setAttributes( { showHours: value } ) }
								/>
								<Toggle
									label={ __( 'Minutes', 'gambol-builder' ) }
									checked={ showMinutes }
									onChange={ ( value ) => setAttributes( { showMinutes: value } ) }
								/>
								<Toggle
									label={ __( 'Seconds', 'gambol-builder' ) }
									checked={ showSeconds }
									onChange={ ( value ) => setAttributes( { showSeconds: value } ) }
								/>
							</Section>

							<Section title={ __( 'Labels', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Labels', 'gambol-builder' ) }
									checked={ showLabels }
									onChange={ ( value ) => setAttributes( { showLabels: value } ) }
								/>
								{ showLabels && (
									<ButtonGroup
										label={ __( 'Position', 'gambol-builder' ) }
										value={ labelPosition }
										onChange={ ( value ) => setAttributes( { labelPosition: value } ) }
										options={ [
											{ value: 'top', label: 'Top' },
											{ value: 'bottom', label: 'Bottom' },
										] }
									/>
								) }
							</Section>

							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'boxes', label: 'Boxes' },
										{ value: 'inline', label: 'Inline' },
									] }
								/>
								<RangeSlider
									label={ __( 'Gap', 'gambol-builder' ) }
									value={ gap }
									onChange={ ( value ) => setAttributes( { gap: value } ) }
									min={ 0 }
									max={ 60 }
								/>
								{ layout === 'inline' && (
									<TextInput
										label={ __( 'Separator', 'gambol-builder' ) }
										value={ separator }
										onChange={ ( value ) => setAttributes( { separator: value } ) }
									/>
								) }
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Numbers', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Font Size', 'gambol-builder' ) }
									value={ numberSize }
									onChange={ ( value ) => setAttributes( { numberSize: value } ) }
									min={ 24 }
									max={ 120 }
								/>
								<GambolColorPicker
									label={ __( 'Color', 'gambol-builder' ) }
									value={ numberColor }
									onChange={ ( value ) => setAttributes( { numberColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Labels', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Font Size', 'gambol-builder' ) }
									value={ labelSize }
									onChange={ ( value ) => setAttributes( { labelSize: value } ) }
									min={ 10 }
									max={ 24 }
								/>
								<GambolColorPicker
									label={ __( 'Color', 'gambol-builder' ) }
									value={ labelColor }
									onChange={ ( value ) => setAttributes( { labelColor: value } ) }
								/>
							</Section>

							{ layout === 'boxes' && (
								<Section title={ __( 'Boxes', 'gambol-builder' ) }>
									<RangeSlider
										label={ __( 'Border Radius', 'gambol-builder' ) }
										value={ borderRadius }
										onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
										min={ 0 }
										max={ 30 }
									/>
									<GambolColorPicker
										label={ __( 'Background', 'gambol-builder' ) }
										value={ boxBgColor }
										onChange={ ( value ) => setAttributes( { boxBgColor: value } ) }
									/>
									<GambolColorPicker
										label={ __( 'Border Color', 'gambol-builder' ) }
										value={ borderColor }
										onChange={ ( value ) => setAttributes( { borderColor: value } ) }
									/>
								</Section>
							) }
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ renderUnit( countdown.days, 'Days', showDays ) }
				{ showDays && showHours && renderSeparator() }
				{ renderUnit( countdown.hours, 'Hours', showHours ) }
				{ showHours && showMinutes && renderSeparator() }
				{ renderUnit( countdown.minutes, 'Minutes', showMinutes ) }
				{ showMinutes && showSeconds && renderSeparator() }
				{ renderUnit( countdown.seconds, 'Seconds', showSeconds ) }
			</div>
		</>
	);
}
