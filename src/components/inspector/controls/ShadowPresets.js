/**
 * Shadow Presets Control
 *
 * Quick shadow selection with predefined presets.
 *
 * @package GambolBuilder
 */

import { __ } from '@wordpress/i18n';

// Shadow presets
const SHADOW_PRESETS = [
	{
		value: 'none',
		label: __( 'None', 'gambol-builder' ),
		css: 'none',
	},
	{
		value: 'simple',
		label: __( 'Simple', 'gambol-builder' ),
		css: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
	},
	{
		value: 'soft',
		label: __( 'Soft', 'gambol-builder' ),
		css: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.06)',
	},
	{
		value: 'strong',
		label: __( 'Strong', 'gambol-builder' ),
		css: '0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
	},
];

/**
 * ShadowPresets Component.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.label    Control label.
 * @param {string}   props.value    Current preset value.
 * @param {Function} props.onChange Change handler (returns CSS value).
 * @return {JSX.Element} ShadowPresets element.
 */
export default function ShadowPresets( {
	label,
	value = 'none',
	onChange,
} ) {
	// Find current preset by CSS value or preset key
	const getCurrentPreset = () => {
		const preset = SHADOW_PRESETS.find( ( p ) => p.value === value || p.css === value );
		return preset?.value || 'none';
	};

	const currentValue = getCurrentPreset();

	const handleSelect = ( preset ) => {
		onChange( preset.css );
	};

	return (
		<div className="gambol-control">
			{ label && (
				<div className="gambol-control-header">
					<span className="gambol-control-label">{ label }</span>
				</div>
			) }
			<div className="gambol-shadow-presets">
				{ SHADOW_PRESETS.map( ( preset ) => (
					<button
						key={ preset.value }
						type="button"
						className={ `gambol-shadow-preset ${ currentValue === preset.value ? 'is-active' : '' }` }
						onClick={ () => handleSelect( preset ) }
						aria-label={ preset.label }
					>
						<div
							className={ `gambol-shadow-preview shadow-${ preset.value }` }
							style={ { boxShadow: preset.css } }
						/>
						<span className="gambol-shadow-label">{ preset.label }</span>
					</button>
				) ) }
			</div>
		</div>
	);
}
