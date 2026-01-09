/**
 * Site Logo Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { Button, Placeholder, Spinner } from '@wordpress/components';
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	RangeSlider,
} from '../../components/inspector';

/**
 * Site Logo Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		width,
		isLink,
		linkTarget,
		customLogo,
		customLogoId,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-site-logo',
	} );

	// Get site logo from WordPress settings
	const [ siteLogoId ] = useEntityProp( 'root', 'site', 'site_logo' );
	
	const { logoUrl, isLoading, siteUrl } = useSelect( ( select ) => {
		const { getMedia, getSite } = select( coreStore );
		const site = getSite();
		const logoId = customLogoId || siteLogoId;
		
		let url = customLogo || '';
		let loading = false;
		
		if ( logoId && ! customLogo ) {
			const media = getMedia( logoId );
			if ( media ) {
				url = media.source_url;
			} else {
				loading = true;
			}
		}
		
		return {
			logoUrl: url,
			isLoading: loading,
			siteUrl: site?.url || '#',
		};
	}, [ siteLogoId, customLogoId, customLogo ] );

	const onSelectLogo = ( media ) => {
		setAttributes( {
			customLogo: media.url,
			customLogoId: media.id,
		} );
	};

	const onRemoveLogo = () => {
		setAttributes( {
			customLogo: '',
			customLogoId: undefined,
		} );
	};

	const LogoImage = () => (
		<img
			src={ logoUrl }
			alt={ __( 'Site Logo', 'gambol-builder' ) }
			className="wp-block-gambol-site-logo__image"
			style={ { width: `${ width }px`, height: 'auto' } }
		/>
	);

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Site Logo', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Logo', 'gambol-builder' ) }>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ onSelectLogo }
										allowedTypes={ [ 'image' ] }
										value={ customLogoId }
										render={ ( { open } ) => (
											<>
												<Button onClick={ open } variant="secondary" isSmall>
													{ customLogo ? __( 'Change Logo', 'gambol-builder' ) : __( 'Custom Logo', 'gambol-builder' ) }
												</Button>
												{ customLogo && (
													<Button onClick={ onRemoveLogo } variant="link" isSmall isDestructive>
														{ __( 'Use Site Logo', 'gambol-builder' ) }
													</Button>
												) }
											</>
										) }
									/>
								</MediaUploadCheck>
								<p className="gambol-help-text">
									{ __( 'Leave empty to use the site logo from WordPress settings.', 'gambol-builder' ) }
								</p>
							</Section>

							<Section title={ __( 'Link', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Link to Home', 'gambol-builder' ) }
									checked={ isLink }
									onChange={ ( value ) => setAttributes( { isLink: value } ) }
								/>
								{ isLink && (
									<ButtonGroup
										label={ __( 'Open In', 'gambol-builder' ) }
										value={ linkTarget }
										onChange={ ( value ) => setAttributes( { linkTarget: value } ) }
										options={ [
											{ value: '_self', label: __( 'Same Tab', 'gambol-builder' ) },
											{ value: '_blank', label: __( 'New Tab', 'gambol-builder' ) },
										] }
									/>
								) }
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Size', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Width (px)', 'gambol-builder' ) }
									value={ width }
									onChange={ ( value ) => setAttributes( { width: value } ) }
									min={ 50 }
									max={ 500 }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ isLoading && <Spinner /> }
				
				{ ! isLoading && ! logoUrl && (
					<Placeholder
						icon="format-image"
						label={ __( 'Site Logo', 'gambol-builder' ) }
						instructions={ __( 'No site logo set. Upload one in Customizer or select a custom logo.', 'gambol-builder' ) }
					>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectLogo }
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Button onClick={ open } variant="primary">
										{ __( 'Select Logo', 'gambol-builder' ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
					</Placeholder>
				) }

				{ ! isLoading && logoUrl && (
					isLink ? (
						<a href={ siteUrl } className="wp-block-gambol-site-logo__link" aria-label={ __( 'Home', 'gambol-builder' ) }>
							<LogoImage />
						</a>
					) : (
						<LogoImage />
					)
				) }
			</div>
		</>
	);
}
