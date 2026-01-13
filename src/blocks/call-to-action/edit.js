/**
 * Call to Action Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
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
 * Call to Action Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		description,
		buttonText,
		buttonUrl,
		buttonTarget,
		layout,
		contentAlignment,
		bgColor,
		bgImage,
		overlayColor,
		overlayOpacity,
		titleColor,
		descriptionColor,
		buttonBgColor,
		buttonTextColor,
		padding,
		borderRadius,
		titleSize,
		descriptionSize,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-call-to-action layout-${ layout } align-${ contentAlignment }`,
		style: {
			backgroundColor: bgColor || 'var(--gb-colors-primary)',
			backgroundImage: bgImage ? `url(${ bgImage })` : undefined,
			borderRadius: `${ borderRadius }px`,
			padding: `${ padding }px`,
		},
	} );

	const titleStyle = {
		color: titleColor || '#ffffff',
		fontSize: `${ titleSize }px`,
	};

	const descriptionStyle = {
		color: descriptionColor || 'rgba(255,255,255,0.9)',
		fontSize: `${ descriptionSize }px`,
	};

	const buttonStyle = {
		backgroundColor: buttonBgColor || '#ffffff',
		color: buttonTextColor || 'var(--gb-colors-primary)',
	};

	const overlayStyle = overlayColor ? {
		backgroundColor: overlayColor,
		opacity: overlayOpacity / 100,
	} : {};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Call to Action', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 8h6v2H9V8zm0 3h6v2H9v-2zm0 3h4v2H9v-2z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Layout', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'horizontal', label: 'Horizontal' },
										{ value: 'vertical', label: 'Vertical' },
									] }
								/>
								<ButtonGroup
									label={ __( 'Content Alignment', 'gambol-builder' ) }
									value={ contentAlignment }
									onChange={ ( value ) => setAttributes( { contentAlignment: value } ) }
									options={ [
										{ value: 'left', label: 'Left' },
										{ value: 'center', label: 'Center' },
										{ value: 'right', label: 'Right' },
									] }
								/>
								<RangeSlider
									label={ __( 'Padding', 'gambol-builder' ) }
									value={ padding }
									onChange={ ( value ) => setAttributes( { padding: value } ) }
									min={ 20 }
									max={ 100 }
								/>
							</Section>

							<Section title={ __( 'Button', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Button URL', 'gambol-builder' ) }
									value={ buttonUrl }
									onChange={ ( value ) => setAttributes( { buttonUrl: value } ) }
								/>
								<Toggle
									label={ __( 'Open in New Tab', 'gambol-builder' ) }
									checked={ buttonTarget }
									onChange={ ( value ) => setAttributes( { buttonTarget: value } ) }
								/>
							</Section>

							<Section title={ __( 'Background Image', 'gambol-builder' ) }>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) => setAttributes( { bgImage: media.url } ) }
										allowedTypes={ [ 'image' ] }
										render={ ( { open } ) => (
											<Button
												onClick={ open }
												variant="secondary"
												style={ { width: '100%', justifyContent: 'center' } }
											>
												{ bgImage ? __( 'Change Image', 'gambol-builder' ) : __( 'Select Image', 'gambol-builder' ) }
											</Button>
										) }
									/>
								</MediaUploadCheck>
								{ bgImage && (
									<Button
										onClick={ () => setAttributes( { bgImage: '' } ) }
										variant="link"
										isDestructive
									>
										{ __( 'Remove Image', 'gambol-builder' ) }
									</Button>
								) }
								{ bgImage && (
									<>
										<GambolColorPicker
											label={ __( 'Overlay Color', 'gambol-builder' ) }
											value={ overlayColor }
											onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
										/>
										<RangeSlider
											label={ __( 'Overlay Opacity', 'gambol-builder' ) }
											value={ overlayOpacity }
											onChange={ ( value ) => setAttributes( { overlayOpacity: value } ) }
											min={ 0 }
											max={ 100 }
										/>
									</>
								) }
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Box', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 50 }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ bgColor }
									onChange={ ( value ) => setAttributes( { bgColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Typography', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Title Size', 'gambol-builder' ) }
									value={ titleSize }
									onChange={ ( value ) => setAttributes( { titleSize: value } ) }
									min={ 18 }
									max={ 48 }
								/>
								<GambolColorPicker
									label={ __( 'Title Color', 'gambol-builder' ) }
									value={ titleColor }
									onChange={ ( value ) => setAttributes( { titleColor: value } ) }
								/>
								<RangeSlider
									label={ __( 'Description Size', 'gambol-builder' ) }
									value={ descriptionSize }
									onChange={ ( value ) => setAttributes( { descriptionSize: value } ) }
									min={ 12 }
									max={ 24 }
								/>
								<GambolColorPicker
									label={ __( 'Description Color', 'gambol-builder' ) }
									value={ descriptionColor }
									onChange={ ( value ) => setAttributes( { descriptionColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Button Style', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ buttonBgColor }
									onChange={ ( value ) => setAttributes( { buttonBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ buttonTextColor }
									onChange={ ( value ) => setAttributes( { buttonTextColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ bgImage && overlayColor && (
					<div className="cta-overlay" style={ overlayStyle }></div>
				) }
				
				<div className="cta-content">
					<div className="cta-text">
						<RichText
							tagName="h3"
							className="cta-title"
							style={ titleStyle }
							value={ title }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Enter title...', 'gambol-builder' ) }
						/>
						<RichText
							tagName="p"
							className="cta-description"
							style={ descriptionStyle }
							value={ description }
							onChange={ ( value ) => setAttributes( { description: value } ) }
							placeholder={ __( 'Enter description...', 'gambol-builder' ) }
						/>
					</div>
					
					<div className="cta-button-wrapper">
						<RichText
							tagName="span"
							className="cta-button"
							style={ buttonStyle }
							value={ buttonText }
							onChange={ ( value ) => setAttributes( { buttonText: value } ) }
							placeholder={ __( 'Button Text', 'gambol-builder' ) }
							allowedFormats={ [] }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
