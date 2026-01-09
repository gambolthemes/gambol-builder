/**
 * Progress Bar Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

/**
 * Progress Bar Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		percentage,
		showPercentage,
		percentagePosition,
		height,
		barColor,
		backgroundColor,
		textColor,
		borderRadius,
		style,
		animate,
		animationDuration,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-progress-bar wp-block-gambol-progress-bar--${ style }`,
	} );

	const trackStyle = {
		height: `${ height }px`,
		backgroundColor: backgroundColor || undefined,
		borderRadius: `${ borderRadius }px`,
	};

	const barStyle = {
		width: `${ percentage }%`,
		backgroundColor: barColor || undefined,
		borderRadius: `${ borderRadius }px`,
		color: textColor || undefined,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Progress Bar', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M4 11h16v2H4zm0-4h10v2H4zm0 8h14v2H4z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Progress', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Percentage', 'gambol-builder' ) }
									value={ percentage }
									onChange={ ( value ) => setAttributes( { percentage: value } ) }
									min={ 0 }
									max={ 100 }
								/>
							</Section>

							<Section title={ __( 'Display', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Percentage', 'gambol-builder' ) }
									checked={ showPercentage }
									onChange={ ( value ) => setAttributes( { showPercentage: value } ) }
								/>
								{ showPercentage && (
									<ButtonGroup
										label={ __( 'Percentage Position', 'gambol-builder' ) }
										value={ percentagePosition }
										onChange={ ( value ) => setAttributes( { percentagePosition: value } ) }
										options={ [
											{ value: 'inside', label: __( 'Inside', 'gambol-builder' ) },
											{ value: 'outside', label: __( 'Outside', 'gambol-builder' ) },
											{ value: 'title', label: __( 'With Title', 'gambol-builder' ) },
										] }
									/>
								) }
							</Section>

							<Section title={ __( 'Animation', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Animate on Scroll', 'gambol-builder' ) }
									checked={ animate }
									onChange={ ( value ) => setAttributes( { animate: value } ) }
								/>
								{ animate && (
									<RangeSlider
										label={ __( 'Duration (ms)', 'gambol-builder' ) }
										value={ animationDuration }
										onChange={ ( value ) => setAttributes( { animationDuration: value } ) }
										min={ 500 }
										max={ 3000 }
										step={ 100 }
									/>
								) }
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Style', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ style }
									onChange={ ( value ) => setAttributes( { style: value } ) }
									options={ [
										{ value: 'default', label: __( 'Default', 'gambol-builder' ) },
										{ value: 'striped', label: __( 'Striped', 'gambol-builder' ) },
										{ value: 'gradient', label: __( 'Gradient', 'gambol-builder' ) },
									] }
								/>
							</Section>

							<Section title={ __( 'Size', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Height (px)', 'gambol-builder' ) }
									value={ height }
									onChange={ ( value ) => setAttributes( { height: value } ) }
									min={ 8 }
									max={ 60 }
								/>
								<RangeSlider
									label={ __( 'Border Radius (px)', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 50 }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Bar Color', 'gambol-builder' ) }
									value={ barColor }
									onChange={ ( value ) => setAttributes( { barColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Background Color', 'gambol-builder' ) }
									value={ backgroundColor }
									onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ textColor }
									onChange={ ( value ) => setAttributes( { textColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-gambol-progress-bar__header">
					<RichText
						tagName="span"
						className="wp-block-gambol-progress-bar__title"
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Progress title...', 'gambol-builder' ) }
					/>
					{ showPercentage && percentagePosition === 'title' && (
						<span className="wp-block-gambol-progress-bar__percentage">{ percentage }%</span>
					) }
				</div>

				<div className="wp-block-gambol-progress-bar__track" style={ trackStyle }>
					<div className="wp-block-gambol-progress-bar__bar" style={ barStyle }>
						{ showPercentage && percentagePosition === 'inside' && height >= 20 && (
							<span className="wp-block-gambol-progress-bar__percentage">{ percentage }%</span>
						) }
					</div>
				</div>

				{ showPercentage && percentagePosition === 'outside' && (
					<span className="wp-block-gambol-progress-bar__percentage wp-block-gambol-progress-bar__percentage--outside">
						{ percentage }%
					</span>
				) }
			</div>
		</>
	);
}
