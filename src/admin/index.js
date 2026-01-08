/**
 * Gambol Builder Admin App Entry Point
 *
 * React application for admin settings pages.
 *
 * @package GambolBuilder
 */

import { createRoot } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Import admin styles
import './styles/admin.scss';

// Import page components
import Dashboard from './pages/Dashboard';
import GlobalStyles from './pages/GlobalStyles';

/**
 * Get the current page from the root element.
 */
function getCurrentPage() {
	const root = document.getElementById( 'gambol-admin-root' );
	return root?.dataset?.page || 'dashboard';
}

/**
 * Render the appropriate page component.
 */
function App() {
	const page = getCurrentPage();

	switch ( page ) {
		case 'global-styles':
			return <GlobalStyles />;
		case 'dashboard':
		default:
			return <Dashboard />;
	}
}

/**
 * Initialize the admin app.
 */
function initApp() {
	const container = document.getElementById( 'gambol-admin-root' );

	if ( ! container ) {
		return;
	}

	const root = createRoot( container );
	root.render( <App /> );
}

// Wait for DOM ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initApp );
} else {
	initApp();
}
