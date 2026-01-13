/**
 * Webpack Configuration
 *
 * Custom webpack config to handle multiple entry points.
 *
 * @package GambolBuilder
 */

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		// Main blocks entry
		index: path.resolve( process.cwd(), 'src', 'index.js' ),
		// Admin pages entry
		admin: path.resolve( process.cwd(), 'src', 'admin', 'index.js' ),
		// Editor sidebar/panel entry
		editor: path.resolve( process.cwd(), 'src', 'editor', 'index.js' ),
		// Frontend interactivity (no React, vanilla JS)
		frontend: path.resolve( process.cwd(), 'src', 'frontend', 'index.js' ),
	},
};
