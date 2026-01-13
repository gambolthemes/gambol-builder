/**
 * Image Box Block - Edit Component
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
	GambolColorPicker,
	TextInput,
} from '../../components/inspector';

/**
 * Image Box Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		imageUrl,
		imageId,
		imageAlt,
		title,
		description,
		layout,
		titleTag,
		contentAlignment,
		hoverEffect,
		linkUrl,
		linkTarget,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-image-box layout-${ layout } align-${ contentAlignment } hover-${ hoverEffect }`,
	} );

	const onSelectImage = ( media ) => {
		setAttributes( {
			imageUrl: media.url,
			imageId: media.id,
			imageAlt: media.alt || '',
		} );
	};

	const onRemoveImage = () => {
		setAttributes( {
			imageUrl: '',
			imageId: undefined,
			imageAlt: '',
		} );
	};

	const TitleTag = titleTag;

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Image Box', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm10 13H5v-1l3-3 1.5 1.5L14 12l5 5v2z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Image Position', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'top', label: __( 'Top', 'gambol-builder' ) },
										{ value: 'left', label: __( 'Left', 'gambol-builder' ) },
										{ value: 'right', label: __( 'Right', 'gambol-builder' ) },
									] }
								/>
								<ButtonGroup
									label={ __( 'Content Alignment', 'gambol-builder' ) }
									value={ contentAlignment }
									onChange={ ( value ) => setAttributes( { contentAlignment: value } ) }
									options={ [
										{ value: 'left', label: __( 'Left', 'gambol-builder' ) },
										{ value: 'center', label: __( 'Center', 'gambol-builder' ) },
										{ value: 'right', label: __( 'Right', 'gambol-builder' ) },
									] }
								/>
								<ButtonGroup
									label={ __( 'Title Tag', 'gambol-builder' ) }
									value={ titleTag }
									onChange={ ( value ) => setAttributes( { titleTag: value } ) }
									options={ [
										{ value: 'h2', label: 'H2' },
										{ value: 'h3', label: 'H3' },
										{ value: 'h4', label: 'H4' },
										{ value: 'h5', label: 'H5' },
										{ value: 'h6', label: 'H6' },
									] }
								/>
							</Section>

							<Section title={ __( 'Link', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Link URL', 'gambol-builder' ) }
									value={ linkUrl }
									onChange={ ( value ) => setAttributes( { linkUrl: value } ) }
									placeholder="https://"
								/>
								<ButtonGroup
									label={ __( 'Open In', 'gambol-builder' ) }
									value={ linkTarget }
									onChange={ ( value ) => setAttributes( { linkTarget: value } ) }
									options={ [
										{ value: '', label: __( 'Same Window', 'gambol-builder' ) },
										{ value: '_blank', label: __( 'New Tab', 'gambol-builder' ) },
									] }
								/>
							</Section>
						</>
					}
					styleTab={
						<Section title={ __( 'Hover Effect', 'gambol-builder' ) }>
							<ButtonGroup
								label={ __( 'Effect', 'gambol-builder' ) }
								value={ hoverEffect }
								onChange={ ( value ) => setAttributes( { hoverEffect: value } ) }
								options={ [
									{ value: 'none', label: __( 'None', 'gambol-builder' ) },
									{ value: 'zoom', label: __( 'Zoom', 'gambol-builder' ) },
									{ value: 'grayscale', label: __( 'Grayscale', 'gambol-builder' ) },
									{ value: 'blur', label: __( 'Blur', 'gambol-builder' ) },
								] }
							/>
						</Section>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-gambol-image-box__image-wrapper">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImage }
							allowedTypes={ [ 'image' ] }
							value={ imageId }
							render={ ( { open } ) => (
								<>
									{ imageUrl ? (
										<>
											<img
												src={ imageUrl }
												alt={ imageAlt }
												className="wp-block-gambol-image-box__image"
												onClick={ open }
											/>
											<Button
												onClick={ onRemoveImage }
												isDestructive
												isSmall
												className="wp-block-gambol-image-box__remove"
											>
												{ __( 'Remove', 'gambol-builder' ) }
											</Button>
										</>
									) : (
										<Button
											onClick={ open }
											variant="secondary"
											className="wp-block-gambol-image-box__upload"
										>
											{ __( 'Select Image', 'gambol-builder' ) }
										</Button>
									) }
								</>
							) }
						/>
					</MediaUploadCheck>
				</div>

				<div className="wp-block-gambol-image-box__content">
					<RichText
						tagName={ TitleTag }
						className="wp-block-gambol-image-box__title"
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Add title...', 'gambol-builder' ) }
					/>
					<RichText
						tagName="p"
						className="wp-block-gambol-image-box__description"
						value={ description }
						onChange={ ( value ) => setAttributes( { description: value } ) }
						placeholder={ __( 'Add description...', 'gambol-builder' ) }
					/>
				</div>
			</div>
		</>
	);
}
