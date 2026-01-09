/**
 * Alert Block - Edit Component
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
} from '../../components/inspector';

const ALERT_ICONS = {
	info: 'ℹ',
	success: '✓',
	warning: '⚠',
	danger: '✕',
};

/**
 * Alert Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		type,
		title,
		content,
		showIcon,
		dismissible,
		customIconColor,
		customBackgroundColor,
		customBorderColor,
		customTextColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-alert alert-${ type }`,
		style: {
			'--alert-bg': customBackgroundColor || undefined,
			'--alert-border': customBorderColor || undefined,
			'--alert-text': customTextColor || undefined,
			'--alert-icon': customIconColor || undefined,
		},
	} );

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Alert', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Alert Type', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Type', 'gambol-builder' ) }
									value={ type }
									onChange={ ( value ) => setAttributes( { type: value } ) }
									options={ [
										{ value: 'info', label: __( 'Info', 'gambol-builder' ) },
										{ value: 'success', label: __( 'Success', 'gambol-builder' ) },
										{ value: 'warning', label: __( 'Warning', 'gambol-builder' ) },
										{ value: 'danger', label: __( 'Danger', 'gambol-builder' ) },
									] }
								/>
							</Section>

							<Section title={ __( 'Options', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Icon', 'gambol-builder' ) }
									checked={ showIcon }
									onChange={ ( value ) => setAttributes( { showIcon: value } ) }
								/>
								<Toggle
									label={ __( 'Dismissible', 'gambol-builder' ) }
									checked={ dismissible }
									onChange={ ( value ) => setAttributes( { dismissible: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<Section title={ __( 'Custom Colors', 'gambol-builder' ) }>
							<GambolColorPicker
								label={ __( 'Background Color', 'gambol-builder' ) }
								value={ customBackgroundColor }
								onChange={ ( value ) => setAttributes( { customBackgroundColor: value } ) }
							/>
							<GambolColorPicker
								label={ __( 'Border Color', 'gambol-builder' ) }
								value={ customBorderColor }
								onChange={ ( value ) => setAttributes( { customBorderColor: value } ) }
							/>
							<GambolColorPicker
								label={ __( 'Text Color', 'gambol-builder' ) }
								value={ customTextColor }
								onChange={ ( value ) => setAttributes( { customTextColor: value } ) }
							/>
							<GambolColorPicker
								label={ __( 'Icon Color', 'gambol-builder' ) }
								value={ customIconColor }
								onChange={ ( value ) => setAttributes( { customIconColor: value } ) }
							/>
						</Section>
					}
				/>
			</InspectorControls>

			<div { ...blockProps } role="alert">
				{ showIcon && (
					<span className="wp-block-gambol-alert__icon">
						{ ALERT_ICONS[ type ] }
					</span>
				) }
				
				<div className="wp-block-gambol-alert__content">
					<RichText
						tagName="strong"
						className="wp-block-gambol-alert__title"
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Alert title (optional)...', 'gambol-builder' ) }
					/>
					<RichText
						tagName="p"
						className="wp-block-gambol-alert__message"
						value={ content }
						onChange={ ( value ) => setAttributes( { content: value } ) }
						placeholder={ __( 'Alert message...', 'gambol-builder' ) }
					/>
				</div>

				{ dismissible && (
					<button type="button" className="wp-block-gambol-alert__dismiss" aria-label={ __( 'Dismiss', 'gambol-builder' ) }>
						✕
					</button>
				) }
			</div>
		</>
	);
}
