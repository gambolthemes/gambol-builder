/**
 * Stub for WordPress script packages that are WP-provided externals and are
 * only used by edit()/editor UI, never by save(). Generator-only.
 */
const noop = () => null;
module.exports = new Proxy( { __esModule: true, default: noop }, {
	get: ( target, key ) => ( key in target ? target[ key ] : noop ),
} );
