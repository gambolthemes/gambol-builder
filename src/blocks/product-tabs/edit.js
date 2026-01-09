/**
 * Product Tabs Block - Edit Component
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
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

/**
 * Product Tabs Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showDescription,
		showReviews,
		showAdditionalInfo,
		layout,
		tabBgColor,
		tabActiveColor,
		tabTextColor,
		tabActiveTextColor,
		borderRadius,
		contentPadding,
	} = attributes;

	const [ activeTab, setActiveTab ] = useState( 'description' );

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-product-tabs layout-${ layout }`,
	} );

	const tabs = [];
	if ( showDescription ) {
		tabs.push( { id: 'description', label: 'Description' } );
	}
	if ( showAdditionalInfo ) {
		tabs.push( { id: 'additional', label: 'Additional Information' } );
	}
	if ( showReviews ) {
		tabs.push( { id: 'reviews', label: 'Reviews (24)' } );
	}

	const tabStyle = ( isActive ) => ( {
		backgroundColor: isActive ? ( tabActiveColor || 'var(--gb-colors-primary)' ) : ( tabBgColor || 'var(--gb-colors-gray-100)' ),
		color: isActive ? ( tabActiveTextColor || '#fff' ) : ( tabTextColor || 'inherit' ),
		borderRadius: `${ borderRadius }px`,
	} );

	const contentStyle = {
		padding: `${ contentPadding }px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Product Tabs', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Tabs', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Description', 'gambol-builder' ) }
									checked={ showDescription }
									onChange={ ( value ) => setAttributes( { showDescription: value } ) }
								/>
								<Toggle
									label={ __( 'Additional Information', 'gambol-builder' ) }
									checked={ showAdditionalInfo }
									onChange={ ( value ) => setAttributes( { showAdditionalInfo: value } ) }
								/>
								<Toggle
									label={ __( 'Reviews', 'gambol-builder' ) }
									checked={ showReviews }
									onChange={ ( value ) => setAttributes( { showReviews: value } ) }
								/>
							</Section>

							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'horizontal', label: 'Horizontal' },
										{ value: 'vertical', label: 'Vertical' },
									] }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Tabs', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 20 }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ tabBgColor }
									onChange={ ( value ) => setAttributes( { tabBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Active Background', 'gambol-builder' ) }
									value={ tabActiveColor }
									onChange={ ( value ) => setAttributes( { tabActiveColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ tabTextColor }
									onChange={ ( value ) => setAttributes( { tabTextColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Active Text', 'gambol-builder' ) }
									value={ tabActiveTextColor }
									onChange={ ( value ) => setAttributes( { tabActiveTextColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Content', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Padding', 'gambol-builder' ) }
									value={ contentPadding }
									onChange={ ( value ) => setAttributes( { contentPadding: value } ) }
									min={ 0 }
									max={ 60 }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="product-tabs__nav">
					{ tabs.map( ( tab ) => (
						<button
							key={ tab.id }
							className={ `product-tabs__tab ${ activeTab === tab.id ? 'is-active' : '' }` }
							style={ tabStyle( activeTab === tab.id ) }
							onClick={ () => setActiveTab( tab.id ) }
						>
							{ tab.label }
						</button>
					) ) }
				</div>

				<div className="product-tabs__content" style={ contentStyle }>
					{ activeTab === 'description' && (
						<div className="product-tabs__panel">
							<h2>Description</h2>
							<p>This is a sample product description. It provides detailed information about the product features, specifications, and benefits.</p>
							<ul>
								<li>High-quality materials</li>
								<li>Modern design</li>
								<li>Easy to use</li>
							</ul>
						</div>
					) }

					{ activeTab === 'additional' && (
						<div className="product-tabs__panel">
							<h2>Additional Information</h2>
							<table>
								<tbody>
									<tr>
										<th>Weight</th>
										<td>0.5 kg</td>
									</tr>
									<tr>
										<th>Dimensions</th>
										<td>10 × 10 × 5 cm</td>
									</tr>
									<tr>
										<th>Color</th>
										<td>Black, White, Blue</td>
									</tr>
								</tbody>
							</table>
						</div>
					) }

					{ activeTab === 'reviews' && (
						<div className="product-tabs__panel">
							<h2>Reviews</h2>
							<p>Customer reviews will be displayed here.</p>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
