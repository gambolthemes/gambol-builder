/**
 * Menu Anchor Block - Save Component
 *
 * @package GambolBuilder
 */

/**
 * Menu Anchor Save Component.
 */
export default function save( { attributes } ) {
	const { anchorId } = attributes;

	if ( ! anchorId ) {
		return null;
	}

	return (
		<div id={ anchorId } className="wp-block-gambol-menu-anchor" aria-hidden="true"></div>
	);
}
