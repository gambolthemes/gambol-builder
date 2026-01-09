/**
 * Icon List Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { plus, trash } from '@wordpress/icons';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

const ICONS = {
	check: '✓',
	arrow: '→',
	star: '★',
	circle: '●',
	square: '■',
	diamond: '◆',
	heart: '♥',
	plus: '+',
};

/**
 * Icon List Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		items,
		iconColor,
		iconSize,
		textColor,
		spacing,
		layout,
		divider,
		dividerColor,
		iconPosition,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-icon-list layout-${ layout } icon-${ iconPosition }`,
		style: {
			'--icon-color': iconColor || undefined,
			'--icon-size': `${ iconSize }px`,
			'--text-color': textColor || undefined,
			'--item-spacing': `${ spacing }px`,
			'--divider-color': dividerColor || undefined,
		},
	} );

	const updateItem = ( index, key, value ) => {
		const newItems = [ ...items ];
		newItems[ index ] = { ...newItems[ index ], [ key ]: value };
		setAttributes( { items: newItems } );
	};

	const addItem = () => {
		setAttributes( {
			items: [ ...items, { text: 'New item', icon: 'check' } ],
		} );
	};

	const removeItem = ( index ) => {
		const newItems = items.filter( ( _, i ) => i !== index );
		setAttributes( { items: newItems } );
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Icon List', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M4 4h4v4H4V4zm6 1v2h10V5H10zm-6 5h4v4H4v-4zm6 1v2h10v-2H10zm-6 5h4v4H4v-4zm6 1v2h10v-2H10z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Direction', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'vertical', label: __( 'Vertical', 'gambol-builder' ) },
										{ value: 'horizontal', label: __( 'Horizontal', 'gambol-builder' ) },
									] }
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
								<RangeSlider
									label={ __( 'Item Spacing (px)', 'gambol-builder' ) }
									value={ spacing }
									onChange={ ( value ) => setAttributes( { spacing: value } ) }
									min={ 0 }
									max={ 50 }
								/>
							</Section>

							<Section title={ __( 'Icon Settings', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Icon Size (px)', 'gambol-builder' ) }
									value={ iconSize }
									onChange={ ( value ) => setAttributes( { iconSize: value } ) }
									min={ 10 }
									max={ 50 }
								/>
							</Section>

							<Section title={ __( 'Divider', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Divider', 'gambol-builder' ) }
									checked={ divider }
									onChange={ ( value ) => setAttributes( { divider: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Icon Color', 'gambol-builder' ) }
									value={ iconColor }
									onChange={ ( value ) => setAttributes( { iconColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ textColor }
									onChange={ ( value ) => setAttributes( { textColor: value } ) }
								/>
								{ divider && (
									<GambolColorPicker
										label={ __( 'Divider Color', 'gambol-builder' ) }
										value={ dividerColor }
										onChange={ ( value ) => setAttributes( { dividerColor: value } ) }
									/>
								) }
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<ul { ...blockProps }>
				{ items.map( ( item, index ) => (
					<li 
						key={ index } 
						className={ `wp-block-gambol-icon-list__item${ divider ? ' has-divider' : '' }` }
					>
						<span className="wp-block-gambol-icon-list__icon">
							{ ICONS[ item.icon ] || ICONS.check }
						</span>
						<RichText
							tagName="span"
							className="wp-block-gambol-icon-list__text"
							value={ item.text }
							onChange={ ( value ) => updateItem( index, 'text', value ) }
							placeholder={ __( 'List item...', 'gambol-builder' ) }
						/>
						<Button
							icon={ trash }
							label={ __( 'Remove item', 'gambol-builder' ) }
							onClick={ () => removeItem( index ) }
							className="wp-block-gambol-icon-list__remove"
							isDestructive
							isSmall
						/>
					</li>
				) ) }
				<li className="wp-block-gambol-icon-list__add">
					<Button
						icon={ plus }
						label={ __( 'Add item', 'gambol-builder' ) }
						onClick={ addItem }
						variant="secondary"
						isSmall
					>
						{ __( 'Add Item', 'gambol-builder' ) }
					</Button>
				</li>
			</ul>
		</>
	);
}
