/**
 * Pricing Table Block - Edit Component
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

import {
	InspectorSidebar,
	Section,
	Toggle,
	GambolColorPicker,
	RangeSlider,
	TextInput,
} from '../../components/inspector';

/**
 * Pricing Table Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		planName,
		price,
		currency,
		period,
		description,
		features,
		buttonText,
		buttonUrl,
		featured,
		featuredLabel,
		headerBgColor,
		headerTextColor,
		priceColor,
		buttonBgColor,
		buttonTextColor,
		borderColor,
		borderRadius,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-pricing-table ${ featured ? 'is-featured' : '' }`,
		style: {
			borderColor: borderColor || undefined,
			borderRadius: `${ borderRadius }px`,
		},
	} );

	const headerStyle = {
		backgroundColor: headerBgColor || undefined,
		color: headerTextColor || undefined,
	};

	const priceStyle = {
		color: priceColor || undefined,
	};

	const buttonStyle = {
		backgroundColor: buttonBgColor || undefined,
		color: buttonTextColor || undefined,
	};

	const updateFeature = ( index, key, value ) => {
		const newFeatures = [ ...features ];
		newFeatures[ index ] = { ...newFeatures[ index ], [ key ]: value };
		setAttributes( { features: newFeatures } );
	};

	const addFeature = () => {
		setAttributes( {
			features: [ ...features, { text: 'New Feature', included: true } ],
		} );
	};

	const removeFeature = ( index ) => {
		const newFeatures = features.filter( ( _, i ) => i !== index );
		setAttributes( { features: newFeatures } );
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Pricing Table', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Plan Details', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Currency Symbol', 'gambol-builder' ) }
									value={ currency }
									onChange={ ( value ) => setAttributes( { currency: value } ) }
								/>
								<TextInput
									label={ __( 'Period', 'gambol-builder' ) }
									value={ period }
									onChange={ ( value ) => setAttributes( { period: value } ) }
								/>
							</Section>

							<Section title={ __( 'Button', 'gambol-builder' ) }>
								<TextInput
									label={ __( 'Button URL', 'gambol-builder' ) }
									value={ buttonUrl }
									onChange={ ( value ) => setAttributes( { buttonUrl: value } ) }
								/>
							</Section>

							<Section title={ __( 'Featured', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Mark as Featured', 'gambol-builder' ) }
									checked={ featured }
									onChange={ ( value ) => setAttributes( { featured: value } ) }
								/>
								{ featured && (
									<TextInput
										label={ __( 'Featured Label', 'gambol-builder' ) }
										value={ featuredLabel }
										onChange={ ( value ) => setAttributes( { featuredLabel: value } ) }
									/>
								) }
							</Section>

							<Section title={ __( 'Features', 'gambol-builder' ) }>
								{ features.map( ( feature, index ) => (
									<div key={ index } style={ { display: 'flex', gap: '8px', marginBottom: '8px' } }>
										<Toggle
											checked={ feature.included }
											onChange={ ( value ) => updateFeature( index, 'included', value ) }
										/>
										<TextInput
											value={ feature.text }
											onChange={ ( value ) => updateFeature( index, 'text', value ) }
											style={ { flex: 1 } }
										/>
										<Button
											isDestructive
											isSmall
											onClick={ () => removeFeature( index ) }
										>
											×
										</Button>
									</div>
								) ) }
								<Button
									variant="secondary"
									onClick={ addFeature }
									style={ { width: '100%' } }
								>
									{ __( 'Add Feature', 'gambol-builder' ) }
								</Button>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Box', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
								<GambolColorPicker
									label={ __( 'Border Color', 'gambol-builder' ) }
									value={ borderColor }
									onChange={ ( value ) => setAttributes( { borderColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Header', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ headerBgColor }
									onChange={ ( value ) => setAttributes( { headerBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ headerTextColor }
									onChange={ ( value ) => setAttributes( { headerTextColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Price', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Color', 'gambol-builder' ) }
									value={ priceColor }
									onChange={ ( value ) => setAttributes( { priceColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Button', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ buttonBgColor }
									onChange={ ( value ) => setAttributes( { buttonBgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ buttonTextColor }
									onChange={ ( value ) => setAttributes( { buttonTextColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ featured && (
					<div className="pricing-badge">{ featuredLabel }</div>
				) }
				
				<div className="pricing-header" style={ headerStyle }>
					<RichText
						tagName="h3"
						className="pricing-plan-name"
						value={ planName }
						onChange={ ( value ) => setAttributes( { planName: value } ) }
						placeholder={ __( 'Plan Name', 'gambol-builder' ) }
					/>
					<RichText
						tagName="p"
						className="pricing-description"
						value={ description }
						onChange={ ( value ) => setAttributes( { description: value } ) }
						placeholder={ __( 'Plan description...', 'gambol-builder' ) }
					/>
				</div>
				
				<div className="pricing-price" style={ priceStyle }>
					<span className="pricing-currency">{ currency }</span>
					<RichText
						tagName="span"
						className="pricing-amount"
						value={ price }
						onChange={ ( value ) => setAttributes( { price: value } ) }
						placeholder="49"
						allowedFormats={ [] }
					/>
					<span className="pricing-period">{ period }</span>
				</div>
				
				<ul className="pricing-features">
					{ features.map( ( feature, index ) => (
						<li key={ index } className={ feature.included ? 'is-included' : 'is-excluded' }>
							<span className="feature-icon">
								{ feature.included ? '✓' : '✗' }
							</span>
							<span className="feature-text">{ feature.text }</span>
						</li>
					) ) }
				</ul>
				
				<div className="pricing-button-wrapper">
					<RichText
						tagName="span"
						className="pricing-button"
						style={ buttonStyle }
						value={ buttonText }
						onChange={ ( value ) => setAttributes( { buttonText: value } ) }
						placeholder={ __( 'Button Text', 'gambol-builder' ) }
						allowedFormats={ [] }
					/>
				</div>
			</div>
		</>
	);
}
