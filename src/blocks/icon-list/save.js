/**
 * Icon List Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

const ICONS = {
	check: '✓',
	arrow: '→',
	star: '★',
	circle: '●',
	square: '■',
	diamond: '◆',
	heart: '♥',
	plus: '+',
};

/**
 * Icon List Save Component.
 */
export default function save( { attributes } ) {
	const {
		items,
		iconColor,
		iconSize,
		textColor,
		spacing,
		layout,
		divider,
		dividerColor,
		iconPosition,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-icon-list layout-${ layout } icon-${ iconPosition }`,
		style: {
			'--icon-color': iconColor || undefined,
			'--icon-size': `${ iconSize }px`,
			'--text-color': textColor || undefined,
			'--item-spacing': `${ spacing }px`,
			'--divider-color': dividerColor || undefined,
		},
	} );

	return (
		<ul { ...blockProps }>
			{ items.map( ( item, index ) => (
				<li 
					key={ index } 
					className={ `wp-block-gambol-icon-list__item${ divider ? ' has-divider' : '' }` }
				>
					<span className="wp-block-gambol-icon-list__icon">
						{ ICONS[ item.icon ] || ICONS.check }
					</span>
					<span className="wp-block-gambol-icon-list__text">
						{ item.text }
					</span>
				</li>
			) ) }
		</ul>
	);
}
