/**
 * Button Block - Edit Component
 *
 * Editor interface for the Button block with redesigned dark Inspector UI.
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	RichText,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import {
	ToolbarButton,
	Popover,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { link, linkOff } from '@wordpress/icons';
import { useState } from '@wordpress/element';

// Import Gambol Inspector components (redesigned)
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
 * Button Edit Component.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set attributes.
 * @param {boolean}  props.isSelected    Whether block is selected.
 * @return {JSX.Element} Edit component.
 */
export default function Edit( { attributes, setAttributes, isSelected } ) {
	const {
		text,
		url,
		linkTarget,
		rel,
		textAlign,
		hoverBackgroundColor,
		hoverTextColor,
	} = attributes;

	const [ isEditingURL, setIsEditingURL ] = useState( false );

	// Build wrapper class names for alignment.
	const wrapperClassNames = [ 'wp-block-gambol-button__wrapper' ];
	if ( textAlign ) {
		wrapperClassNames.push( `has-text-align-${ textAlign }` );
	}

	// Block props.
	const blockProps = useBlockProps( {
		className: wrapperClassNames.join( ' ' ),
	} );

	// Handle link change.
	const onChangeLink = ( value ) => {
		const newUrl = value?.url || '';
		const newTarget = value?.opensInNewTab ? '_blank' : '';
		let newRel = rel || '';

		// Handle nofollow.
		if ( value?.nofollow ) {
			if ( ! newRel.includes( 'nofollow' ) ) {
				newRel = newRel ? `${ newRel } nofollow` : 'nofollow';
			}
		} else {
			newRel = newRel.replace( /nofollow\s?/g, '' ).trim();
		}

		// Add noopener for security when opening in new tab.
		if ( newTarget === '_blank' && ! newRel.includes( 'noopener' ) ) {
			newRel = newRel ? `${ newRel } noopener` : 'noopener';
		}

		setAttributes( {
			url: newUrl,
			linkTarget: newTarget,
			rel: newRel || undefined,
		} );
	};

	// Unlink button.
	const unlinkButton = () => {
		setAttributes( {
			url: '',
			linkTarget: '',
			rel: '',
		} );
		setIsEditingURL( false );
	};

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ textAlign }
					onChange={ ( value ) => setAttributes( { textAlign: value } ) }
				/>
				<ToolbarButton
					icon={ url ? linkOff : link }
					label={ url ? __( 'Unlink', 'gambol-builder' ) : __( 'Link', 'gambol-builder' ) }
					onClick={ () => {
						if ( url ) {
							unlinkButton();
						} else {
							setIsEditingURL( true );
						}
					} }
					isPressed={ !! url }
				/>
			</BlockControls>

			{ isEditingURL && (
				<Popover
					position="bottom center"
					onClose={ () => setIsEditingURL( false ) }
					focusOnMount={ true }
				>
					<LinkControl
						value={ {
							url,
							opensInNewTab: linkTarget === '_blank',
							nofollow: rel?.includes( 'nofollow' ),
						} }
						onChange={ onChangeLink }
						settings={ [
							{
								id: 'opensInNewTab',
								title: __( 'Open in new tab', 'gambol-builder' ),
							},
							{
								id: 'nofollow',
								title: __( 'Add nofollow', 'gambol-builder' ),
							},
						] }
					/>
				</Popover>
			) }

			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Button', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M19 6.5H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2zm.5 9c0 .3-.2.5-.5.5H5c-.3 0-.5-.2-.5-.5v-7c0-.3.2-.5.5-.5h14c.3 0 .5.2.5.5v7zM8 12.8h8v-1.5H8v1.5z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Alignment', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Position', 'gambol-builder' ) }
									value={ textAlign || 'center' }
									onChange={ ( value ) => setAttributes( { textAlign: value } ) }
									options={ [
										{
											value: 'left',
											icon: (
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
													<path d="M4 19h16v-2H4v2zM4 15h10v-2H4v2zM4 11h16V9H4v2zM4 5v2h10V5H4z"/>
												</svg>
											),
										},
										{
											value: 'center',
											icon: (
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
													<path d="M4 19h16v-2H4v2zM7 15h10v-2H7v2zM4 11h16V9H4v2zM7 5v2h10V5H7z"/>
												</svg>
											),
										},
										{
											value: 'right',
											icon: (
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
													<path d="M4 19h16v-2H4v2zM10 15h10v-2H10v2zM4 11h16V9H4v2zM10 5v2h10V5H10z"/>
												</svg>
											),
										},
									] }
								/>
							</Section>

							<Section title={ __( 'Link', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Open in new tab', 'gambol-builder' ) }
									checked={ linkTarget === '_blank' }
									onChange={ ( checked ) => {
										let newRel = rel || '';
										if ( checked && ! newRel.includes( 'noopener' ) ) {
											newRel = newRel ? `${ newRel } noopener` : 'noopener';
										}
										setAttributes( {
											linkTarget: checked ? '_blank' : '',
											rel: newRel || undefined,
										} );
									} }
								/>
								<Toggle
									label={ __( 'Add nofollow', 'gambol-builder' ) }
									checked={ rel?.includes( 'nofollow' ) || false }
									onChange={ ( checked ) => {
										let newRel = rel || '';
										if ( checked ) {
											if ( ! newRel.includes( 'nofollow' ) ) {
												newRel = newRel ? `${ newRel } nofollow` : 'nofollow';
											}
										} else {
											newRel = newRel.replace( /nofollow\s?/g, '' ).trim();
										}
										setAttributes( { rel: newRel || undefined } );
									} }
								/>
							</Section>
						</>
					}
					designTab={
						<>
							<Section title={ __( 'Hover Effects', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background on Hover', 'gambol-builder' ) }
									value={ hoverBackgroundColor }
									onChange={ ( value ) => setAttributes( { hoverBackgroundColor: value } ) }
								/>
								<div style={ { marginTop: '16px' } }>
									<GambolColorPicker
										label={ __( 'Text on Hover', 'gambol-builder' ) }
										value={ hoverTextColor }
										onChange={ ( value ) => setAttributes( { hoverTextColor: value } ) }
									/>
								</div>
							</Section>
						</>
					}
					advancedTab={
						<Section title={ __( 'Custom', 'gambol-builder' ) }>
							<TextInput
								label={ __( 'CSS Classes', 'gambol-builder' ) }
								value={ attributes.className || '' }
								onChange={ ( value ) => setAttributes( { className: value } ) }
								placeholder="btn-primary"
								help={ __( 'Additional CSS classes.', 'gambol-builder' ) }
							/>
						</Section>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<RichText
					tagName="span"
					className="wp-block-gambol-button__link"
					value={ text }
					onChange={ ( value ) => setAttributes( { text: value } ) }
					placeholder={ __( 'Add text...', 'gambol-builder' ) }
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
			</div>

			{ isSelected && url && (
				<Popover position="bottom center">
					<div style={ { padding: '8px', fontSize: '12px' } }>
						<a href={ url } target="_blank" rel="noopener noreferrer">
							{ url }
						</a>
					</div>
				</Popover>
			) }
		</>
	);
}
