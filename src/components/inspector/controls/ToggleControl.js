/**
 * Toggle Control Component
 *
 * A modern toggle switch with optional description.
 *
 * @package GambolBuilder
 */

/**
 * Toggle Control Component
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.label     Control label.
 * @param {boolean}  props.checked   Current state.
 * @param {Function} props.onChange  Change callback.
 * @param {string}   props.help      Help text.
 * @param {boolean}  props.disabled  Disabled state.
 * @return {JSX.Element} Toggle control element.
 */
const ToggleControl = ( {
	label,
	checked = false,
	onChange,
	help,
	disabled = false,
} ) => {
	/**
	 * Handle toggle change.
	 */
	const handleChange = () => {
		if ( ! disabled ) {
			onChange( ! checked );
		}
	};

	return (
		<div className={ `gambol-toggle-control ${ disabled ? 'is-disabled' : '' }` }>
			<div className="gambol-toggle-row">
				<label className="gambol-toggle-label">{ label }</label>

				<button
					type="button"
					role="switch"
					aria-checked={ checked }
					className={ `gambol-toggle-switch ${ checked ? 'is-on' : '' }` }
					onClick={ handleChange }
					disabled={ disabled }
				>
					<span className="gambol-toggle-track">
						<span className="gambol-toggle-thumb" />
					</span>
				</button>
			</div>

			{ help && (
				<p className="gambol-toggle-help">{ help }</p>
			) }
		</div>
	);
};

export default ToggleControl;
