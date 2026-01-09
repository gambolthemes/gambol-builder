/**
 * Lottie Block - Edit Component
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
	RangeSlider,
	TextInput,
} from '../../components/inspector';

/**
 * Lottie Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		source,
		url,
		json,
		width,
		height,
		autoplay,
		loop,
		speed,
		direction,
		trigger,
		hoverAction,
		renderer,
		alignment,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-lottie align-${ alignment }`,
	} );

	const containerStyle = {
		width: `${ width }px`,
		height: `${ height }px`,
	};

	const hasAnimation = ( source === 'url' && url ) || ( source === 'json' && json );

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Lottie', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 14.67V9.33c0-.79.88-1.27 1.54-.84l4.15 2.67c.61.39.61 1.29 0 1.68l-4.15 2.67c-.66.43-1.54-.05-1.54-.84z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Source', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Source Type', 'gambol-builder' ) }
									value={ source }
									onChange={ ( value ) => setAttributes( { source: value } ) }
									options={ [
										{ value: 'url', label: 'URL' },
										{ value: 'json', label: 'JSON' },
									] }
								/>
								{ source === 'url' && (
									<TextInput
										label={ __( 'Animation URL', 'gambol-builder' ) }
										value={ url }
										onChange={ ( value ) => setAttributes( { url: value } ) }
										placeholder="https://assets.lottiefiles.com/..."
									/>
								) }
								{ source === 'json' && (
									<TextInput
										label={ __( 'JSON Data', 'gambol-builder' ) }
										value={ json }
										onChange={ ( value ) => setAttributes( { json: value } ) }
										placeholder='{"v":"5.7.4","fr":30,...}'
									/>
								) }
							</Section>

							<Section title={ __( 'Size', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Width', 'gambol-builder' ) }
									value={ width }
									onChange={ ( value ) => setAttributes( { width: value } ) }
									min={ 50 }
									max={ 800 }
								/>
								<RangeSlider
									label={ __( 'Height', 'gambol-builder' ) }
									value={ height }
									onChange={ ( value ) => setAttributes( { height: value } ) }
									min={ 50 }
									max={ 800 }
								/>
								<ButtonGroup
									label={ __( 'Alignment', 'gambol-builder' ) }
									value={ alignment }
									onChange={ ( value ) => setAttributes( { alignment: value } ) }
									options={ [
										{ value: 'left', label: 'Left' },
										{ value: 'center', label: 'Center' },
										{ value: 'right', label: 'Right' },
									] }
								/>
							</Section>

							<Section title={ __( 'Playback', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Autoplay', 'gambol-builder' ) }
									checked={ autoplay }
									onChange={ ( value ) => setAttributes( { autoplay: value } ) }
								/>
								<Toggle
									label={ __( 'Loop', 'gambol-builder' ) }
									checked={ loop }
									onChange={ ( value ) => setAttributes( { loop: value } ) }
								/>
								<RangeSlider
									label={ __( 'Speed', 'gambol-builder' ) }
									value={ speed }
									onChange={ ( value ) => setAttributes( { speed: value } ) }
									min={ 0.1 }
									max={ 3 }
									step={ 0.1 }
								/>
								<ButtonGroup
									label={ __( 'Direction', 'gambol-builder' ) }
									value={ direction }
									onChange={ ( value ) => setAttributes( { direction: value } ) }
									options={ [
										{ value: 1, label: 'Forward' },
										{ value: -1, label: 'Reverse' },
									] }
								/>
							</Section>

							<Section title={ __( 'Trigger', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Play On', 'gambol-builder' ) }
									value={ trigger }
									onChange={ ( value ) => setAttributes( { trigger: value } ) }
									options={ [
										{ value: 'none', label: 'Default' },
										{ value: 'viewport', label: 'Viewport' },
										{ value: 'scroll', label: 'Scroll' },
									] }
								/>
								<ButtonGroup
									label={ __( 'Hover Action', 'gambol-builder' ) }
									value={ hoverAction }
									onChange={ ( value ) => setAttributes( { hoverAction: value } ) }
									options={ [
										{ value: 'none', label: 'None' },
										{ value: 'play', label: 'Play' },
										{ value: 'pause', label: 'Pause' },
										{ value: 'reverse', label: 'Reverse' },
									] }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Renderer', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Render Mode', 'gambol-builder' ) }
									value={ renderer }
									onChange={ ( value ) => setAttributes( { renderer: value } ) }
									options={ [
										{ value: 'svg', label: 'SVG' },
										{ value: 'canvas', label: 'Canvas' },
									] }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="lottie-container" style={ containerStyle }>
					{ hasAnimation ? (
						<div
							className="lottie-player"
							data-src={ source === 'url' ? url : undefined }
							data-json={ source === 'json' ? json : undefined }
							data-autoplay={ autoplay }
							data-loop={ loop }
							data-speed={ speed }
							data-direction={ direction }
							data-renderer={ renderer }
						>
							<div className="lottie-preview-placeholder">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 14.67V9.33c0-.79.88-1.27 1.54-.84l4.15 2.67c.61.39.61 1.29 0 1.68l-4.15 2.67c-.66.43-1.54-.05-1.54-.84z"/>
								</svg>
								<span>{ __( 'Lottie Animation', 'gambol-builder' ) }</span>
							</div>
						</div>
					) : (
						<div className="lottie-placeholder">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 14.67V9.33c0-.79.88-1.27 1.54-.84l4.15 2.67c.61.39.61 1.29 0 1.68l-4.15 2.67c-.66.43-1.54-.05-1.54-.84z"/>
							</svg>
							<span>{ __( 'Add a Lottie animation URL or JSON', 'gambol-builder' ) }</span>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
