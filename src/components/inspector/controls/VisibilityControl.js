/**
 * Visibility Control
 *
 * Handles three visibility dimensions:
 *   1. Device (Desktop / Tablet / Mobile)
 *   2. User Status (Everyone / Logged In / Logged Out)
 *   3. Schedule (show after / hide after date-time)
 *
 * Props shape:
 *   value           = { desktop, tablet, mobile }
 *   userStatus      = 'everyone' | 'logged_in' | 'logged_out'
 *   showAfter       = '' | ISO date string
 *   hideAfter       = '' | ISO date string
 *   onChange        = (value) => void   — device object update
 *   onUserStatus    = (status) => void  — optional
 *   onShowAfter     = (date)   => void  — optional
 *   onHideAfter     = (date)   => void  — optional
 *
 * @package GambolBuilder
 */

import { __ } from '@wordpress/i18n';
import { SelectControl, TextControl } from '@wordpress/components';

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
 * @param {Object}   props               Component props.
 * @param {string}   props.label         Control label.
 * @param {Object}   props.value         Device visibility { desktop, tablet, mobile }.
 * @param {Function} props.onChange      Device change handler.
 * @param {string}   props.userStatus    User status visibility.
 * @param {Function} props.onUserStatus  User status change handler.
 * @param {string}   props.showAfter     Show after date (ISO).
 * @param {Function} props.onShowAfter   Show after change handler.
 * @param {string}   props.hideAfter     Hide after date (ISO).
 * @param {Function} props.onHideAfter   Hide after change handler.
 * @return {JSX.Element} VisibilityControl element.
 */
export default function VisibilityControl( {
	label,
	value = { desktop: true, tablet: true, mobile: true },
	onChange,
	userStatus,
	onUserStatus,
	showAfter,
	onShowAfter,
	hideAfter,
	onHideAfter,
} ) {
	const devices = [
		{ id: 'desktop', label: __( 'Desktop', 'gambol-builder' ), icon: <DesktopIcon /> },
		{ id: 'tablet',  label: __( 'Tablet',  'gambol-builder' ), icon: <TabletIcon /> },
		{ id: 'mobile',  label: __( 'Mobile',  'gambol-builder' ), icon: <MobileIcon /> },
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

			{ /* Device visibility */ }
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

			{ /* User Status */ }
			{ onUserStatus && (
				<div className="gambol-visibility-section" style={ { marginTop: '16px' } }>
					<SelectControl
						label={ __( 'Show to', 'gambol-builder' ) }
						value={ userStatus || 'everyone' }
						options={ [
							{ label: __( 'Everyone',    'gambol-builder' ), value: 'everyone'    },
							{ label: __( 'Logged In',   'gambol-builder' ), value: 'logged_in'   },
							{ label: __( 'Logged Out',  'gambol-builder' ), value: 'logged_out'  },
						] }
						onChange={ onUserStatus }
					/>
				</div>
			) }

			{ /* Schedule */ }
			{ ( onShowAfter || onHideAfter ) && (
				<div className="gambol-visibility-section" style={ { marginTop: '16px' } }>
					<p style={ { margin: '0 0 8px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: '#757575' } }>
						{ __( 'Schedule', 'gambol-builder' ) }
					</p>
					{ onShowAfter && (
						<TextControl
							label={ __( 'Show After', 'gambol-builder' ) }
							type="datetime-local"
							value={ showAfter || '' }
							onChange={ onShowAfter }
						/>
					) }
					{ onHideAfter && (
						<TextControl
							label={ __( 'Hide After', 'gambol-builder' ) }
							type="datetime-local"
							value={ hideAfter || '' }
							onChange={ onHideAfter }
						/>
					) }
				</div>
			) }
		</div>
	);
}
