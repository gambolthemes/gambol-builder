/**
 * Heading Block - Edit Component
 *
 * Editor interface for the Heading block.
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	RichText,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToolbarGroup,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	heading,
} from '@wordpress/icons';

/**
 * Heading level options for toolbar.
 */
const HEADING_LEVELS = [ 1, 2, 3, 4, 5, 6 ];

/**
 * Heading Edit Component.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set attributes.
 * @return {JSX.Element} Edit component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		content,
		level,
		textAlign,
		fontWeight,
	} = attributes;

	// Tag name from level.
	const TagName = `h${ level }`;

	// Build styles.
	const headingStyle = {};
	if ( fontWeight ) {
		headingStyle.fontWeight = fontWeight;
	}

	// Build class names.
	const classNames = [];
	if ( textAlign ) {
		classNames.push( `has-text-align-${ textAlign }` );
	}
	if ( fontWeight ) {
		classNames.push( `has-font-weight-${ fontWeight }` );
	}

	// Block props.
	const blockProps = useBlockProps( {
		className: classNames.length > 0 ? classNames.join( ' ' ) : undefined,
		style: headingStyle,
	} );

	// Font weight options.
	const fontWeightOptions = [
		{ label: __( 'Default', 'gambol-builder' ), value: '' },
		{ label: __( 'Light (300)', 'gambol-builder' ), value: '300' },
		{ label: __( 'Normal (400)', 'gambol-builder' ), value: '400' },
		{ label: __( 'Medium (500)', 'gambol-builder' ), value: '500' },
		{ label: __( 'Semi-Bold (600)', 'gambol-builder' ), value: '600' },
		{ label: __( 'Bold (700)', 'gambol-builder' ), value: '700' },
		{ label: __( 'Extra-Bold (800)', 'gambol-builder' ), value: '800' },
	];

	// Heading level controls for toolbar.
	const headingLevelControls = HEADING_LEVELS.map( ( levelOption ) => ( {
		title: `H${ levelOption }`,
		icon: heading,
		isActive: level === levelOption,
		onClick: () => setAttributes( { level: levelOption } ),
	} ) );

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon={ heading }
						label={ __( 'Change heading level', 'gambol-builder' ) }
						controls={ headingLevelControls }
					/>
				</ToolbarGroup>
				<AlignmentToolbar
					value={ textAlign }
					onChange={ ( value ) => setAttributes( { textAlign: value } ) }
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'gambol-builder' ) }>
					<SelectControl
						label={ __( 'Heading Level', 'gambol-builder' ) }
						value={ level }
						options={ HEADING_LEVELS.map( ( l ) => ( {
							label: `H${ l }`,
							value: l,
						} ) ) }
						onChange={ ( value ) => setAttributes( { level: parseInt( value, 10 ) } ) }
					/>

					<SelectControl
						label={ __( 'Font Weight', 'gambol-builder' ) }
						value={ fontWeight }
						options={ fontWeightOptions }
						onChange={ ( value ) => setAttributes( { fontWeight: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<RichText
				{ ...blockProps }
				tagName={ TagName }
				value={ content }
				onChange={ ( value ) => setAttributes( { content: value } ) }
				placeholder={ __( 'Add heading...', 'gambol-builder' ) }
				allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
			/>
		</>
	);
}
