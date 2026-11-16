/**
 * Jest config for the Gambol library generator and block validation tests.
 *
 * The tests run the real block registrations + save() functions in jsdom so
 * every template and demo page is serialized exactly like the editor would.
 *
 * Built from @wordpress/jest-preset-default without its console guard
 * (@wordpress/jest-console): the tests assert block validity explicitly, and
 * the guard would fail them on Gutenberg's own validation logs.
 *
 * Run: npm run build:library
 */
const path = require( 'path' );

const presetDir = path.dirname( require.resolve( '@wordpress/jest-preset-default/jest-preset.js' ) );

module.exports = {
	rootDir: '../..',
	testEnvironment: 'jsdom',
	testMatch: [ '<rootDir>/tools/library/test/**/*.test.js' ],
	testPathIgnorePatterns: [ '/node_modules/' ],
	modulePaths: [ '<rootDir>' ],
	transform: {
		'\\.[jt]sx?$': require.resolve( '@wordpress/scripts/config/babel-transform' ),
	},
	moduleNameMapper: {
		'\\.(scss|css)$': path.join( presetDir, 'scripts/style-mock.js' ),
		'^@wordpress/(core-data|editor|plugins|server-side-render)$': '<rootDir>/tools/library/stub.js',
	},
	setupFiles: [ path.join( presetDir, 'scripts/setup-globals.js' ), '<rootDir>/tools/library/shim.js' ],
	reporters: [ 'default' ],
};
