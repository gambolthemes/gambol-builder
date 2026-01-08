/**
 * Responsive Control Wrapper
 *
 * Adds device-specific controls with viewport switching.
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Device icons.
 */
const DesktopIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
		<path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
		<path d="M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
	</svg>
);

const TabletIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
		<circle cx="12" cy="18" r="1" fill="currentColor"/>
	</svg>
);

const MobileIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
		<circle cx="12" cy="18" r="1" fill="currentColor"/>
	</svg>
);

/**
 * Device definitions.
 */
const DEVICES = [
	{ name: 'desktop', label: __( 'Desktop', 'gambol-builder' ), icon: DesktopIcon },
	{ name: 'tablet', label: __( 'Tablet', 'gambol-builder' ), icon: TabletIcon },
	{ name: 'mobile', label: __( 'Mobile', 'gambol-builder' ), icon: MobileIcon },
];

/**
 * Responsive Control Component
 *
 * @param {Object}   props            Component props.
 * @param {string}   props.label      Control label.
 * @param {Object}   props.values     Device-specific values { desktop, tablet, mobile }.
 * @param {Function} props.onChange   Change callback.
 * @param {Function} props.children   Render function for control.
 * @param {Array}    props.devices    Custom device definitions.
 * @return {JSX.Element} Responsive control element.
 */
const ResponsiveControl = ( {
	label,
	values = {},
	onChange,
	children,
	devices = DEVICES,
} ) => {
	const [ currentDevice, setCurrentDevice ] = useState( 'desktop' );

	/**
	 * Handle value change for current device.
	 *
	 * @param {any} newValue New value.
	 */
	const handleChange = ( newValue ) => {
		onChange( {
			...values,
			[ currentDevice ]: newValue,
		} );
	};

	/**
	 * Get current value.
	 *
	 * @return {any} Current device value or desktop fallback.
	 */
	const getCurrentValue = () => {
		// Return device-specific value or fall back to desktop.
		if ( values[ currentDevice ] !== undefined ) {
			return values[ currentDevice ];
		}
		return values.desktop;
	};

	return (
		<div className="gambol-responsive-control">
			<div className="gambol-responsive-header">
				{ label && (
					<label className="gambol-responsive-label">{ label }</label>
				) }

				<div className="gambol-device-switcher">
					{ devices.map( ( device ) => {
						const DeviceIcon = device.icon;
						const hasValue = values[ device.name ] !== undefined;

						return (
							<button
								key={ device.name }
								type="button"
								className={ `gambol-device-btn ${ currentDevice === device.name ? 'is-active' : '' } ${ hasValue ? 'has-value' : '' }` }
								onClick={ () => setCurrentDevice( device.name ) }
								aria-label={ device.label }
								title={ device.label }
							>
								<DeviceIcon />
							</button>
						);
					} ) }
				</div>
			</div>

			<div className="gambol-responsive-body">
				{ typeof children === 'function'
					? children( {
						value: getCurrentValue(),
						onChange: handleChange,
						device: currentDevice,
					} )
					: children
				}
			</div>
		</div>
	);
};

export default ResponsiveControl;
