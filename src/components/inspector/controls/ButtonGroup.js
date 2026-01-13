/**
 * Button Group Control
 *
 * Segmented control for selecting one option from a set.
 * Uses native button elements with custom styling.
 *
 * @package GambolBuilder
 */

import { __ } from '@wordpress/i18n';

/**
 * ButtonGroup Component.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.label    Control label.
 * @param {string}   props.value    Current value.
 * @param {Function} props.onChange Change handler.
 * @param {Array}    props.options  Options array: { value, label, icon }.
 * @return {JSX.Element} ButtonGroup element.
 */
export default function ButtonGroup( {
	label,
	value,
	onChange,
	options = [],
} ) {
	return (
		<div className="gambol-control">
			{ label && (
				<div className="gambol-control-header">
					<span className="gambol-control-label">{ label }</span>
				</div>
			) }
			<div className="gambol-button-group" role="radiogroup">
				{ options.map( ( option ) => (
					<button
						key={ option.value }
						type="button"
						className={ `gambol-button-group-item ${ value === option.value ? 'is-active' : '' }` }
						onClick={ () => onChange( option.value ) }
						role="radio"
						aria-checked={ value === option.value }
						aria-label={ option.label }
					>
						{ option.icon && option.icon }
						{ ! option.icon && <span>{ option.label }</span> }
					</button>
				) ) }
			</div>
		</div>
	);
}
