/**
 * Popup Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	RichText,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

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
 * Popup Edit Component.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		popupId,
		triggerType,
		triggerText,
		triggerDelay,
		popupWidth,
		overlayColor,
		bgColor,
		borderRadius,
		padding,
		showCloseButton,
		closeOnOverlay,
		closeOnEsc,
		animation,
	} = attributes;

	const [ isPreviewOpen, setIsPreviewOpen ] = useState( false );

	// Generate unique popup ID if not set
	useEffect( () => {
		if ( ! popupId ) {
			setAttributes( { popupId: `popup-${ clientId.slice( 0, 8 ) }` } );
		}
	}, [ popupId, clientId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-popup',
	} );

	const popupContentStyle = {
		maxWidth: `${ popupWidth }px`,
		backgroundColor: bgColor,
		borderRadius: `${ borderRadius }px`,
		padding: `${ padding }px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Popup', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10l5 7 5-7z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Trigger', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Trigger Type', 'gambol-builder' ) }
									value={ triggerType }
									onChange={ ( value ) => setAttributes( { triggerType: value } ) }
									options={ [
										{ value: 'click', label: 'Click' },
										{ value: 'load', label: 'On Load' },
										{ value: 'scroll', label: 'On Scroll' },
										{ value: 'exit', label: 'Exit Intent' },
									] }
								/>
								{ triggerType === 'click' && (
									<TextInput
										label={ __( 'Button Text', 'gambol-builder' ) }
										value={ triggerText }
										onChange={ ( value ) => setAttributes( { triggerText: value } ) }
									/>
								) }
								{ ( triggerType === 'load' || triggerType === 'scroll' ) && (
									<RangeSlider
										label={ __( 'Delay (seconds)', 'gambol-builder' ) }
										value={ triggerDelay }
										onChange={ ( value ) => setAttributes( { triggerDelay: value } ) }
										min={ 0 }
										max={ 30 }
									/>
								) }
							</Section>

							<Section title={ __( 'Popup Settings', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Width (px)', 'gambol-builder' ) }
									value={ popupWidth }
									onChange={ ( value ) => setAttributes( { popupWidth: value } ) }
									min={ 300 }
									max={ 1200 }
								/>
								<RangeSlider
									label={ __( 'Padding', 'gambol-builder' ) }
									value={ padding }
									onChange={ ( value ) => setAttributes( { padding: value } ) }
									min={ 0 }
									max={ 60 }
								/>
								<ButtonGroup
									label={ __( 'Animation', 'gambol-builder' ) }
									value={ animation }
									onChange={ ( value ) => setAttributes( { animation: value } ) }
									options={ [
										{ value: 'fade', label: 'Fade' },
										{ value: 'zoom', label: 'Zoom' },
										{ value: 'slide', label: 'Slide' },
									] }
								/>
							</Section>

							<Section title={ __( 'Close Behavior', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Close Button', 'gambol-builder' ) }
									checked={ showCloseButton }
									onChange={ ( value ) => setAttributes( { showCloseButton: value } ) }
								/>
								<Toggle
									label={ __( 'Close on Overlay Click', 'gambol-builder' ) }
									checked={ closeOnOverlay }
									onChange={ ( value ) => setAttributes( { closeOnOverlay: value } ) }
								/>
								<Toggle
									label={ __( 'Close on Escape Key', 'gambol-builder' ) }
									checked={ closeOnEsc }
									onChange={ ( value ) => setAttributes( { closeOnEsc: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Popup Style', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ bgColor }
									onChange={ ( value ) => setAttributes( { bgColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Overlay', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Overlay Color', 'gambol-builder' ) }
									value={ overlayColor }
									onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ triggerType === 'click' && (
					<button
						className="popup-trigger-button"
						onClick={ () => setIsPreviewOpen( true ) }
					>
						<RichText
							value={ triggerText }
							onChange={ ( value ) => setAttributes( { triggerText: value } ) }
							placeholder={ __( 'Open Popup', 'gambol-builder' ) }
							allowedFormats={ [] }
						/>
					</button>
				) }

				{ triggerType !== 'click' && (
					<div className="popup-trigger-info">
						<span>
							{ triggerType === 'load' && __( 'Popup opens on page load', 'gambol-builder' ) }
							{ triggerType === 'scroll' && __( 'Popup opens on scroll', 'gambol-builder' ) }
							{ triggerType === 'exit' && __( 'Popup opens on exit intent', 'gambol-builder' ) }
						</span>
						<button
							className="popup-preview-btn"
							onClick={ () => setIsPreviewOpen( true ) }
						>
							{ __( 'Preview', 'gambol-builder' ) }
						</button>
					</div>
				) }

				{ isPreviewOpen && (
					<div
						className="popup-preview-overlay"
						style={ { backgroundColor: overlayColor } }
						onClick={ () => setIsPreviewOpen( false ) }
					>
						<div
							className="popup-content"
							style={ popupContentStyle }
							onClick={ ( e ) => e.stopPropagation() }
						>
							{ showCloseButton && (
								<button
									className="popup-close"
									onClick={ () => setIsPreviewOpen( false ) }
								>
									×
								</button>
							) }
							<InnerBlocks
								templateLock={ false }
								template={ [
									[ 'core/heading', { placeholder: __( 'Popup Title', 'gambol-builder' ) } ],
									[ 'core/paragraph', { placeholder: __( 'Add your popup content here...', 'gambol-builder' ) } ],
								] }
							/>
						</div>
					</div>
				) }

				{ ! isPreviewOpen && (
					<div className="popup-content-editor" style={ popupContentStyle }>
						<div className="popup-content-label">{ __( 'Popup Content:', 'gambol-builder' ) }</div>
						<InnerBlocks
							templateLock={ false }
							template={ [
								[ 'core/heading', { placeholder: __( 'Popup Title', 'gambol-builder' ) } ],
								[ 'core/paragraph', { placeholder: __( 'Add your popup content here...', 'gambol-builder' ) } ],
							] }
						/>
					</div>
				) }
			</div>
		</>
	);
}
