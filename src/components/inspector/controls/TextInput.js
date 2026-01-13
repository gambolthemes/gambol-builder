/**
 * Text Input Control
 *
 * Simple text input with label.
 *
 * @package GambolBuilder
 */

/**
 * TextInput Component.
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.label     Control label.
 * @param {string}   props.value     Current value.
 * @param {Function} props.onChange  Change handler.
 * @param {string}   props.placeholder Placeholder text.
 * @param {string}   props.help      Help text.
 * @return {JSX.Element} TextInput element.
 */
export default function TextInput( {
	label,
	value = '',
	onChange,
	placeholder = '',
	help,
} ) {
	return (
		<div className="gambol-control">
			{ label && (
				<div className="gambol-control-header">
					<span className="gambol-control-label">{ label }</span>
				</div>
			) }
			<input
				type="text"
				className="gambol-text-input"
				value={ value }
				onChange={ ( e ) => onChange( e.target.value ) }
				placeholder={ placeholder }
			/>
			{ help && <p className="gambol-help">{ help }</p> }
		</div>
	);
}
