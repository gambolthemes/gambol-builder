/**
 * Toggle Switch Control
 *
 * Custom toggle switch with native accessibility.
 *
 * @package GambolBuilder
 */

/**
 * Toggle Component.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.label    Control label.
 * @param {boolean}  props.checked  Current state.
 * @param {Function} props.onChange Change handler.
 * @param {string}   props.help     Help text.
 * @param {boolean}  props.disabled Disabled state.
 * @return {JSX.Element} Toggle element.
 */
export default function Toggle( {
	label,
	checked = false,
	onChange,
	help,
	disabled = false,
} ) {
	const handleClick = () => {
		if ( ! disabled ) {
			onChange( ! checked );
		}
	};

	const handleKeyDown = ( e ) => {
		if ( e.key === 'Enter' || e.key === ' ' ) {
			e.preventDefault();
			handleClick();
		}
	};

	return (
		<div className="gambol-control">
			<div className="gambol-toggle">
				<span className="gambol-toggle-label">{ label }</span>
				<button
					type="button"
					className={ `gambol-toggle-switch ${ checked ? 'is-on' : '' }` }
					onClick={ handleClick }
					onKeyDown={ handleKeyDown }
					role="switch"
					aria-checked={ checked }
					aria-label={ label }
					disabled={ disabled }
				>
					<span className="gambol-toggle-thumb" />
				</button>
			</div>
			{ help && <p className="gambol-help">{ help }</p> }
		</div>
	);
}
