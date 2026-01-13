/**
 * Site Title Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	TextInput,
} from '../../components/inspector';

/**
 * Site Title Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		level,
		isLink,
		linkTarget,
		textColor,
		fontSize,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-site-title',
	} );

	// Get site title and URL from WordPress
	const [ siteTitle ] = useEntityProp( 'root', 'site', 'title' );
	const { siteUrl } = useSelect( ( select ) => {
		const site = select( coreStore ).getSite();
		return {
			siteUrl: site?.url || '#',
		};
	}, [] );

	const TagName = `h${ level }`;

	const titleStyle = {
		color: textColor || undefined,
		fontSize: fontSize || undefined,
	};

	const TitleContent = () => (
		<TagName className="wp-block-gambol-site-title__heading" style={ titleStyle }>
			{ siteTitle || __( 'Site Title', 'gambol-builder' ) }
		</TagName>
	);

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Site Title', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M5 4v3h5.5v12h3V7H19V4H5z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'HTML Tag', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Heading Level', 'gambol-builder' ) }
									value={ level }
									onChange={ ( value ) => setAttributes( { level: value } ) }
									options={ [
										{ value: 1, label: 'H1' },
										{ value: 2, label: 'H2' },
										{ value: 3, label: 'H3' },
										{ value: 4, label: 'H4' },
										{ value: 5, label: 'H5' },
										{ value: 6, label: 'H6' },
									] }
								/>
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
							<Section title={ __( 'Typography', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Font Size', 'gambol-builder' ) }
									value={ fontSize }
									onChange={ ( value ) => setAttributes( { fontSize: value } ) }
									placeholder="32px, 2rem, etc."
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
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
				{ isLink ? (
					<a href={ siteUrl } className="wp-block-gambol-site-title__link">
						<TitleContent />
					</a>
				) : (
					<TitleContent />
				) }
			</div>
		</>
	);
}
