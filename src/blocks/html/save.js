/**
 * HTML Block - Save Component
 *
 * @package GambolBuilder
 */

import { RawHTML } from '@wordpress/element';

/**
 * HTML Save Component.
 */
export default function save( { attributes } ) {
	const { content } = attributes;

	return content ? <RawHTML>{ content }</RawHTML> : null;
}
