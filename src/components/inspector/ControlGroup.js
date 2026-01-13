/**
 * Control Group Component
 *
 * Groups related controls with a collapsible header.
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import { Icon, chevronDown, chevronUp } from '@wordpress/icons';

/**
 * Control Group Component
 *
 * @param {Object}      props               Component props.
 * @param {string}      props.label         Group label.
 * @param {JSX.Element} props.icon          Optional icon.
 * @param {boolean}     props.initialOpen   Initial open state.
 * @param {JSX.Element} props.children      Group content.
 * @param {string}      props.className     Additional CSS classes.
 * @return {JSX.Element} Control group element.
 */
const ControlGroup = ( {
	label,
	icon,
	initialOpen = true,
	children,
	className = '',
} ) => {
	const [ isOpen, setIsOpen ] = useState( initialOpen );

	return (
		<div className={ `gambol-control-group ${ isOpen ? 'is-open' : '' } ${ className }` }>
			<button
				type="button"
				className="gambol-control-group-header"
				onClick={ () => setIsOpen( ! isOpen ) }
				aria-expanded={ isOpen }
			>
				<span className="gambol-control-group-title">
					{ icon && (
						<span className="gambol-control-group-icon">
							{ typeof icon === 'function' ? <Icon icon={ icon } /> : icon }
						</span>
					) }
					<span className="gambol-control-group-label">{ label }</span>
				</span>
				<span className="gambol-control-group-toggle">
					<Icon icon={ isOpen ? chevronUp : chevronDown } />
				</span>
			</button>

			{ isOpen && (
				<div className="gambol-control-group-content">
					{ children }
				</div>
			) }
		</div>
	);
};

export default ControlGroup;
