/**
 * Toggle Block - Edit Component
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
	Toggle as ToggleControl,
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

/**
 * Icon components for toggle.
 */
const icons = {
	chevron: (
		<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
			<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
		</svg>
	),
	plus: (
		<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
			<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
		</svg>
	),
	arrow: (
		<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
			<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
		</svg>
	),
};

/**
 * Toggle Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		content,
		isOpen,
		iconPosition,
		iconType,
		headerBackgroundColor,
		headerTextColor,
		headerPadding,
		contentBackgroundColor,
		contentTextColor,
		contentPadding,
		borderWidth,
		borderColor,
		borderRadius,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-toggle ${ isOpen ? 'is-open' : '' }`,
	} );

	const containerStyle = {
		borderWidth: `${ borderWidth }px`,
		borderColor: borderColor || undefined,
		borderRadius: `${ borderRadius }px`,
	};

	const headerStyle = {
		backgroundColor: headerBackgroundColor || undefined,
		color: headerTextColor || undefined,
		padding: `${ headerPadding }px`,
	};

	const contentStyle = {
		backgroundColor: contentBackgroundColor || undefined,
		color: contentTextColor || undefined,
		padding: `${ contentPadding }px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Toggle', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Toggle Settings', 'gambol-builder' ) }>
								<ToggleControl
									label={ __( 'Default Open', 'gambol-builder' ) }
									checked={ isOpen }
									onChange={ ( value ) => setAttributes( { isOpen: value } ) }
								/>
								<ButtonGroup
									label={ __( 'Icon Position', 'gambol-builder' ) }
									value={ iconPosition }
									onChange={ ( value ) => setAttributes( { iconPosition: value } ) }
									options={ [
										{ value: 'left', label: __( 'Left', 'gambol-builder' ) },
										{ value: 'right', label: __( 'Right', 'gambol-builder' ) },
									] }
								/>
								<ButtonGroup
									label={ __( 'Icon Type', 'gambol-builder' ) }
									value={ iconType }
									onChange={ ( value ) => setAttributes( { iconType: value } ) }
									options={ [
										{ value: 'chevron', label: __( 'Chevron', 'gambol-builder' ) },
										{ value: 'plus', label: __( 'Plus', 'gambol-builder' ) },
										{ value: 'arrow', label: __( 'Arrow', 'gambol-builder' ) },
									] }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Header', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ headerBackgroundColor }
									onChange={ ( value ) => setAttributes( { headerBackgroundColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ headerTextColor }
									onChange={ ( value ) => setAttributes( { headerTextColor: value } ) }
								/>
								<RangeSlider
									label={ __( 'Padding (px)', 'gambol-builder' ) }
									value={ headerPadding }
									onChange={ ( value ) => setAttributes( { headerPadding: value } ) }
									min={ 0 }
									max={ 50 }
								/>
							</Section>

							<Section title={ __( 'Content', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ contentBackgroundColor }
									onChange={ ( value ) => setAttributes( { contentBackgroundColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ contentTextColor }
									onChange={ ( value ) => setAttributes( { contentTextColor: value } ) }
								/>
								<RangeSlider
									label={ __( 'Padding (px)', 'gambol-builder' ) }
									value={ contentPadding }
									onChange={ ( value ) => setAttributes( { contentPadding: value } ) }
									min={ 0 }
									max={ 50 }
								/>
							</Section>

							<Section title={ __( 'Border', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Width (px)', 'gambol-builder' ) }
									value={ borderWidth }
									onChange={ ( value ) => setAttributes( { borderWidth: value } ) }
									min={ 0 }
									max={ 10 }
								/>
								<GambolColorPicker
									label={ __( 'Border Color', 'gambol-builder' ) }
									value={ borderColor }
									onChange={ ( value ) => setAttributes( { borderColor: value } ) }
								/>
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

			<div { ...blockProps } style={ containerStyle }>
				<button
					className={ `wp-block-gambol-toggle__header wp-block-gambol-toggle__header--icon-${ iconPosition }` }
					style={ headerStyle }
					onClick={ () => setAttributes( { isOpen: ! isOpen } ) }
					aria-expanded={ isOpen }
				>
					{ iconPosition === 'left' && (
						<span className="wp-block-gambol-toggle__icon">
							{ icons[ iconType ] }
						</span>
					) }
					
					<RichText
						tagName="span"
						className="wp-block-gambol-toggle__title"
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Toggle title...', 'gambol-builder' ) }
					/>
					
					{ iconPosition === 'right' && (
						<span className="wp-block-gambol-toggle__icon">
							{ icons[ iconType ] }
						</span>
					) }
				</button>

				<div 
					className="wp-block-gambol-toggle__content"
					style={ contentStyle }
					aria-hidden={ ! isOpen }
				>
					<RichText
						tagName="div"
						value={ content }
						onChange={ ( value ) => setAttributes( { content: value } ) }
						placeholder={ __( 'Toggle content...', 'gambol-builder' ) }
					/>
				</div>
			</div>
		</>
	);
}
