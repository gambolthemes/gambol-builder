/**
 * Icon Box Block - Edit Component
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
	GambolColorPicker,
	RangeSlider,
	TextInput,
} from '../../components/inspector';

const ICONS = {
	star: '★',
	heart: '♥',
	check: '✓',
	settings: '⚙',
	user: '👤',
	mail: '✉',
	phone: '📞',
	location: '📍',
	clock: '🕐',
	globe: '🌐',
	lock: '🔒',
	rocket: '🚀',
	lightning: '⚡',
	trophy: '🏆',
	diamond: '💎',
};

/**
 * Icon Box Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		icon,
		title,
		description,
		layout,
		titleTag,
		contentAlignment,
		iconSize,
		iconColor,
		iconBackgroundColor,
		iconPadding,
		iconBorderRadius,
		hoverAnimation,
		linkUrl,
		linkTarget,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-icon-box layout-${ layout } align-${ contentAlignment } hover-${ hoverAnimation }`,
	} );

	const TitleTag = titleTag;

	const iconStyle = {
		fontSize: `${ iconSize }px`,
		color: iconColor || undefined,
		backgroundColor: iconBackgroundColor || undefined,
		padding: iconBackgroundColor ? `${ iconPadding }px` : undefined,
		borderRadius: iconBackgroundColor ? `${ iconBorderRadius }%` : undefined,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Icon Box', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Icon Position', 'gambol-builder' ) }
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

							<Section title={ __( 'Icon Settings', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Icon', 'gambol-builder' ) }
									value={ icon }
									onChange={ ( value ) => setAttributes( { icon: value } ) }
									options={ Object.keys( ICONS ).map( ( key ) => ( {
										value: key,
										label: ICONS[ key ],
									} ) ) }
								/>
								<RangeSlider
									label={ __( 'Icon Size (px)', 'gambol-builder' ) }
									value={ iconSize }
									onChange={ ( value ) => setAttributes( { iconSize: value } ) }
									min={ 20 }
									max={ 150 }
								/>
								<RangeSlider
									label={ __( 'Icon Padding (px)', 'gambol-builder' ) }
									value={ iconPadding }
									onChange={ ( value ) => setAttributes( { iconPadding: value } ) }
									min={ 0 }
									max={ 50 }
								/>
								<RangeSlider
									label={ __( 'Border Radius (%)', 'gambol-builder' ) }
									value={ iconBorderRadius }
									onChange={ ( value ) => setAttributes( { iconBorderRadius: value } ) }
									min={ 0 }
									max={ 50 }
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
						<>
							<Section title={ __( 'Icon Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Icon Color', 'gambol-builder' ) }
									value={ iconColor }
									onChange={ ( value ) => setAttributes( { iconColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Icon Background', 'gambol-builder' ) }
									value={ iconBackgroundColor }
									onChange={ ( value ) => setAttributes( { iconBackgroundColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Hover Animation', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Animation', 'gambol-builder' ) }
									value={ hoverAnimation }
									onChange={ ( value ) => setAttributes( { hoverAnimation: value } ) }
									options={ [
										{ value: 'none', label: __( 'None', 'gambol-builder' ) },
										{ value: 'float', label: __( 'Float', 'gambol-builder' ) },
										{ value: 'pulse', label: __( 'Pulse', 'gambol-builder' ) },
										{ value: 'rotate', label: __( 'Rotate', 'gambol-builder' ) },
									] }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-gambol-icon-box__icon" style={ iconStyle }>
					{ ICONS[ icon ] || ICONS.star }
				</div>

				<div className="wp-block-gambol-icon-box__content">
					<RichText
						tagName={ TitleTag }
						className="wp-block-gambol-icon-box__title"
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Add title...', 'gambol-builder' ) }
					/>
					<RichText
						tagName="p"
						className="wp-block-gambol-icon-box__description"
						value={ description }
						onChange={ ( value ) => setAttributes( { description: value } ) }
						placeholder={ __( 'Add description...', 'gambol-builder' ) }
					/>
				</div>
			</div>
		</>
	);
}
