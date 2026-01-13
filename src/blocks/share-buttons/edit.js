/**
 * Share Buttons Block - Edit Component
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
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

// Social network icons
const socialIcons = {
	facebook: (
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.02 3.66 9.17 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
		</svg>
	),
	twitter: (
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
		</svg>
	),
	linkedin: (
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
		</svg>
	),
	pinterest: (
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path d="M9.04 21.54c.96.29 1.93.46 2.96.46a10 10 0 0 0 10-10A10 10 0 0 0 12 2 10 10 0 0 0 2 12c0 4.25 2.67 7.9 6.44 9.34-.09-.78-.18-2.07 0-2.96l1.15-4.94s-.29-.58-.29-1.5c0-1.38.86-2.41 1.84-2.41.86 0 1.26.63 1.26 1.44 0 .86-.57 2.09-.86 3.27-.17.98.52 1.84 1.52 1.84 1.78 0 3.16-1.9 3.16-4.58 0-2.4-1.72-4.04-4.19-4.04-2.82 0-4.48 2.1-4.48 4.31 0 .86.28 1.73.74 2.3.09.06.09.14.06.29l-.29 1.09c0 .17-.11.23-.28.11-1.28-.56-2.02-2.38-2.02-3.85 0-3.16 2.24-6.03 6.56-6.03 3.44 0 6.12 2.47 6.12 5.75 0 3.44-2.13 6.2-5.18 6.2-.97 0-1.92-.52-2.26-1.13l-.67 2.37c-.23.86-.86 2.01-1.29 2.7z"/>
		</svg>
	),
	whatsapp: (
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
		</svg>
	),
	email: (
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
		</svg>
	),
	reddit: (
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
		</svg>
	),
	telegram: (
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
		</svg>
	),
};

const networkColors = {
	facebook: '#1877F2',
	twitter: '#000000',
	linkedin: '#0A66C2',
	pinterest: '#E60023',
	whatsapp: '#25D366',
	email: '#757575',
	reddit: '#FF4500',
	telegram: '#0088CC',
};

const networkLabels = {
	facebook: 'Facebook',
	twitter: 'X (Twitter)',
	linkedin: 'LinkedIn',
	pinterest: 'Pinterest',
	whatsapp: 'WhatsApp',
	email: 'Email',
	reddit: 'Reddit',
	telegram: 'Telegram',
};

const allNetworks = [ 'facebook', 'twitter', 'linkedin', 'pinterest', 'whatsapp', 'email', 'reddit', 'telegram' ];

/**
 * Share Buttons Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		networks,
		style,
		shape,
		columns,
		gap,
		iconSize,
		buttonSize,
		showLabel,
		customColors,
		primaryColor,
		secondaryColor,
		alignment,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-share-buttons style-${ style } shape-${ shape } align-${ alignment }`,
		style: {
			gap: `${ gap }px`,
		},
	} );

	const toggleNetwork = ( network ) => {
		if ( networks.includes( network ) ) {
			setAttributes( { networks: networks.filter( ( n ) => n !== network ) } );
		} else {
			setAttributes( { networks: [ ...networks, network ] } );
		}
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Share Buttons', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Networks', 'gambol-builder' ) }>
								{ allNetworks.map( ( network ) => (
									<Toggle
										key={ network }
										label={ networkLabels[ network ] }
										checked={ networks.includes( network ) }
										onChange={ () => toggleNetwork( network ) }
									/>
								) ) }
							</Section>

							<Section title={ __( 'Display', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ style }
									onChange={ ( value ) => setAttributes( { style: value } ) }
									options={ [
										{ value: 'icon-only', label: 'Icon Only' },
										{ value: 'icon-text', label: 'Icon + Text' },
									] }
								/>
								<ButtonGroup
									label={ __( 'Shape', 'gambol-builder' ) }
									value={ shape }
									onChange={ ( value ) => setAttributes( { shape: value } ) }
									options={ [
										{ value: 'square', label: 'Square' },
										{ value: 'rounded', label: 'Rounded' },
										{ value: 'circle', label: 'Circle' },
									] }
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
								<RangeSlider
									label={ __( 'Gap', 'gambol-builder' ) }
									value={ gap }
									onChange={ ( value ) => setAttributes( { gap: value } ) }
									min={ 0 }
									max={ 40 }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Size', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Icon Size', 'gambol-builder' ) }
									value={ iconSize }
									onChange={ ( value ) => setAttributes( { iconSize: value } ) }
									min={ 12 }
									max={ 48 }
								/>
								<RangeSlider
									label={ __( 'Button Size', 'gambol-builder' ) }
									value={ buttonSize }
									onChange={ ( value ) => setAttributes( { buttonSize: value } ) }
									min={ 24 }
									max={ 80 }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Custom Colors', 'gambol-builder' ) }
									checked={ customColors }
									onChange={ ( value ) => setAttributes( { customColors: value } ) }
								/>
								{ customColors && (
									<>
										<GambolColorPicker
											label={ __( 'Background', 'gambol-builder' ) }
											value={ primaryColor }
											onChange={ ( value ) => setAttributes( { primaryColor: value } ) }
										/>
										<GambolColorPicker
											label={ __( 'Icon Color', 'gambol-builder' ) }
											value={ secondaryColor }
											onChange={ ( value ) => setAttributes( { secondaryColor: value } ) }
										/>
									</>
								) }
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ networks.map( ( network ) => {
					const buttonStyle = {
						width: `${ buttonSize }px`,
						height: `${ buttonSize }px`,
						backgroundColor: customColors ? ( primaryColor || networkColors[ network ] ) : networkColors[ network ],
						color: customColors ? ( secondaryColor || '#ffffff' ) : '#ffffff',
					};

					if ( style === 'icon-text' ) {
						buttonStyle.width = 'auto';
						buttonStyle.paddingLeft = '12px';
						buttonStyle.paddingRight = '16px';
					}

					return (
						<a
							key={ network }
							className={ `share-button share-${ network }` }
							style={ buttonStyle }
							href="#"
							onClick={ ( e ) => e.preventDefault() }
						>
							<span
								className="share-icon"
								style={ { width: iconSize, height: iconSize } }
							>
								{ socialIcons[ network ] }
							</span>
							{ style === 'icon-text' && (
								<span className="share-label">{ networkLabels[ network ] }</span>
							) }
						</a>
					);
				} ) }
			</div>
		</>
	);
}
