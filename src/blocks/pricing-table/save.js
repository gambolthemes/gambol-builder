/**
 * Pricing Table Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Pricing Table Save Component.
 */
export default function save( { attributes } ) {
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

	const blockProps = useBlockProps.save( {
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

	return (
		<div { ...blockProps }>
			{ featured && (
				<div className="pricing-badge">{ featuredLabel }</div>
			) }
			
			<div className="pricing-header" style={ headerStyle }>
				<RichText.Content
					tagName="h3"
					className="pricing-plan-name"
					value={ planName }
				/>
				<RichText.Content
					tagName="p"
					className="pricing-description"
					value={ description }
				/>
			</div>
			
			<div className="pricing-price" style={ priceStyle }>
				<span className="pricing-currency">{ currency }</span>
				<span className="pricing-amount">{ price }</span>
				<span className="pricing-period">{ period }</span>
			</div>
			
			<ul className="pricing-features">
				{ features.map( ( feature ) => (
					<li className={ feature.included ? 'is-included' : 'is-excluded' }>
						<span className="feature-icon">
							{ feature.included ? '✓' : '✗' }
						</span>
						<span className="feature-text">{ feature.text }</span>
					</li>
				) ) }
			</ul>
			
			<div className="pricing-button-wrapper">
				<a
					href={ buttonUrl }
					className="pricing-button"
					style={ buttonStyle }
				>
					{ buttonText }
				</a>
			</div>
		</div>
	);
}
