/**
 * Compatibility shim for the generator only (never shipped).
 *
 * The npm copies of @wordpress/block-editor and @wordpress/components resolved
 * in the lockfile disagree on a few private APIs. In WordPress itself the core
 * scripts are used instead, so this only patches the Node test runtime.
 */
const { __dangerousOptInToUnstableAPIsOnlyForCoreModules } = require( '@wordpress/private-apis' );
const components = require( '@wordpress/components' );

const { unlock } = __dangerousOptInToUnstableAPIsOnlyForCoreModules(
	'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.',
	'@wordpress/customize-widgets'
);

const priv = unlock( components.privateApis );
if ( ! priv.createPrivateSlotFill ) {
	priv.createPrivateSlotFill = ( name ) => {
		const privateKey = Symbol( name );
		return { privateKey, ...components.createSlotFill( privateKey ) };
	};
}
// Silence noisy dev warnings from editor components that never render here.
global.console.warn = () => {};
