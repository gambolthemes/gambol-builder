/**
 * Visibility Control
 *
 * Device visibility toggles (Desktop/Tablet/Mobile).
 *
 * @package GambolBuilder
 */

import { __ } from '@wordpress/i18n';

// Device icons
const DesktopIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M20.5 16h-.7V7c0-1.1-.9-2-2-2H6.2c-1.1 0-2 .9-2 2v9h-.7c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5h17c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5zm-14.8-9h12.6v9H5.7V7z"/>
	</svg>
);

const TabletIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 19c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm5.5-3h-11V5h11v13z"/>
	</svg>
);

const MobileIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M16 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4 20c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4.5-3h-9V5h9v14z"/>
	</svg>
);

/**
 * VisibilityControl Component.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.label    Control label.
 * @param {Object}   props.value    Visibility state { desktop, tablet, mobile }.
 * @param {Function} props.onChange Change handler.
 * @return {JSX.Element} VisibilityControl element.
 */
export default function VisibilityControl( {
	label,
	value = { desktop: true, tablet: true, mobile: true },
	onChange,
} ) {
	const devices = [
		{ id: 'desktop', label: __( 'Desktop', 'gambol-builder' ), icon: <DesktopIcon /> },
		{ id: 'tablet', label: __( 'Tablet', 'gambol-builder' ), icon: <TabletIcon /> },
		{ id: 'mobile', label: __( 'Mobile', 'gambol-builder' ), icon: <MobileIcon /> },
	];

	const toggleDevice = ( device ) => {
		onChange( {
			...value,
			[ device ]: ! value[ device ],
		} );
	};

	return (
		<div className="gambol-control">
			{ label && (
				<div className="gambol-control-header">
					<span className="gambol-control-label">{ label }</span>
				</div>
			) }
			<div className="gambol-visibility">
				{ devices.map( ( device ) => (
					<button
						key={ device.id }
						type="button"
						className={ `gambol-visibility-btn ${ value[ device.id ] ? 'is-visible' : 'is-hidden' }` }
						onClick={ () => toggleDevice( device.id ) }
						aria-label={ `${ device.label }: ${ value[ device.id ] ? __( 'Visible', 'gambol-builder' ) : __( 'Hidden', 'gambol-builder' ) }` }
					>
						{ device.icon }
						<span>{ device.label }</span>
					</button>
				) ) }
			</div>
		</div>
	);
}
