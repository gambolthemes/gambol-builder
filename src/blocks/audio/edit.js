/**
 * Audio Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} from '@wordpress/block-editor';
import { Button, Disabled } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

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
 * Audio Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		audioSource,
		audioUrl,
		audioId,
		soundCloudUrl,
		soundCloudEmbedCode,
		showVisualPlayer,
		showArtwork,
		autoplay,
		loop,
		caption,
		playerColor,
		backgroundColor,
		borderRadius,
	} = attributes;

	const [ isFetchingEmbed, setIsFetchingEmbed ] = useState( false );

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-audio',
	} );

	const onSelectAudio = ( media ) => {
		setAttributes( {
			audioUrl: media.url,
			audioId: media.id,
		} );
	};

	const onRemoveAudio = () => {
		setAttributes( {
			audioUrl: '',
			audioId: undefined,
		} );
	};

	const fetchSoundCloudEmbed = async () => {
		if ( ! soundCloudUrl ) return;
		
		setIsFetchingEmbed( true );
		
		try {
			const response = await fetch(
				`https://soundcloud.com/oembed?format=json&url=${ encodeURIComponent( soundCloudUrl ) }`
			);
			const data = await response.json();
			
			if ( data.html ) {
				setAttributes( { soundCloudEmbedCode: data.html } );
			}
		} catch ( error ) {
			console.error( 'Failed to fetch SoundCloud embed:', error );
		}
		
		setIsFetchingEmbed( false );
	};

	const containerStyle = {
		backgroundColor: backgroundColor || undefined,
		borderRadius: `${ borderRadius }px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Audio', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Audio Source', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Source', 'gambol-builder' ) }
									value={ audioSource }
									onChange={ ( value ) => setAttributes( { audioSource: value } ) }
									options={ [
										{ value: 'self', label: __( 'Self Hosted', 'gambol-builder' ) },
										{ value: 'soundcloud', label: 'SoundCloud' },
									] }
								/>

								{ audioSource === 'self' && (
									<div className="gambol-audio-upload">
										<MediaUploadCheck>
											<MediaUpload
												onSelect={ onSelectAudio }
												allowedTypes={ [ 'audio' ] }
												value={ audioId }
												render={ ( { open } ) => (
													<>
														{ audioUrl ? (
															<div className="gambol-audio-upload__file">
																<span>{ audioUrl.split( '/' ).pop() }</span>
																<Button onClick={ onRemoveAudio } isDestructive isSmall>
																	{ __( 'Remove', 'gambol-builder' ) }
																</Button>
															</div>
														) : (
															<Button onClick={ open } variant="secondary" isSmall>
																{ __( 'Select Audio', 'gambol-builder' ) }
															</Button>
														) }
														{ audioUrl && (
															<Button onClick={ open } variant="link" isSmall>
																{ __( 'Replace', 'gambol-builder' ) }
															</Button>
														) }
													</>
												) }
											/>
										</MediaUploadCheck>
									</div>
								) }

								{ audioSource === 'soundcloud' && (
									<>
										<TextInput
											label={ __( 'SoundCloud URL', 'gambol-builder' ) }
											value={ soundCloudUrl }
											onChange={ ( value ) => setAttributes( { soundCloudUrl: value } ) }
											placeholder="https://soundcloud.com/..."
										/>
										<Button
											onClick={ fetchSoundCloudEmbed }
											variant="secondary"
											isSmall
											isBusy={ isFetchingEmbed }
											disabled={ isFetchingEmbed || ! soundCloudUrl }
										>
											{ __( 'Load Embed', 'gambol-builder' ) }
										</Button>
									</>
								) }
							</Section>

							<Section title={ __( 'Playback Settings', 'gambol-builder' ) }>
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
								{ audioSource === 'soundcloud' && (
									<>
										<Toggle
											label={ __( 'Visual Player', 'gambol-builder' ) }
											checked={ showVisualPlayer }
											onChange={ ( value ) => setAttributes( { showVisualPlayer: value } ) }
										/>
										<Toggle
											label={ __( 'Show Artwork', 'gambol-builder' ) }
											checked={ showArtwork }
											onChange={ ( value ) => setAttributes( { showArtwork: value } ) }
										/>
									</>
								) }
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Player Color', 'gambol-builder' ) }
									value={ playerColor }
									onChange={ ( value ) => setAttributes( { playerColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Background Color', 'gambol-builder' ) }
									value={ backgroundColor }
									onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Border', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Radius (px)', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 50 }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<figure { ...blockProps }>
				<div className="wp-block-gambol-audio__wrapper" style={ containerStyle }>
					{ audioSource === 'self' && (
						<>
							{ audioUrl ? (
								<Disabled>
									<audio
										controls
										src={ audioUrl }
										loop={ loop }
									/>
								</Disabled>
							) : (
								<div className="wp-block-gambol-audio__placeholder">
									<MediaUploadCheck>
										<MediaUpload
											onSelect={ onSelectAudio }
											allowedTypes={ [ 'audio' ] }
											value={ audioId }
											render={ ( { open } ) => (
												<Button onClick={ open } variant="primary">
													{ __( 'Upload Audio', 'gambol-builder' ) }
												</Button>
											) }
										/>
									</MediaUploadCheck>
								</div>
							) }
						</>
					) }

					{ audioSource === 'soundcloud' && (
						<>
							{ soundCloudEmbedCode ? (
								<Disabled>
									<div
										className="wp-block-gambol-audio__soundcloud"
										dangerouslySetInnerHTML={ { __html: soundCloudEmbedCode } }
									/>
								</Disabled>
							) : (
								<div className="wp-block-gambol-audio__placeholder">
									<p>{ __( 'Enter a SoundCloud URL and click "Load Embed"', 'gambol-builder' ) }</p>
								</div>
							) }
						</>
					) }
				</div>

				<RichText
					tagName="figcaption"
					placeholder={ __( 'Add caption...', 'gambol-builder' ) }
					value={ caption }
					onChange={ ( value ) => setAttributes( { caption: value } ) }
					className="wp-block-gambol-audio__caption"
				/>
			</figure>
		</>
	);
}
