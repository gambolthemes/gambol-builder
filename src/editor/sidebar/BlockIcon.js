/**
 * Gambol Builder - Block Icon Component
 * 
 * Renders custom SVG icons for each block type.
 *
 * @package GambolBuilder
 */

import { BLOCK_ICONS } from './block-registry';

/**
 * BlockIcon Component
 * 
 * Renders the appropriate icon for a given block type.
 *
 * @param {Object} props - Component props.
 * @param {string} props.type - Icon type identifier.
 * @param {string} props.size - Icon size ('sm' | 'md' | 'lg').
 * @param {string} props.className - Additional CSS class.
 * @return {JSX.Element} Icon element.
 */
const BlockIcon = ( { type, size = 'md', className = '' } ) => {
	const sizeMap = {
		sm: 16,
		md: 20,
		lg: 24,
	};

	const iconSize = sizeMap[ size ] || sizeMap.md;
	const icon = BLOCK_ICONS[ type ] || BLOCK_ICONS.container;

	return (
		<span
			className={ `gambol-block-icon gambol-block-icon--${ size } ${ className }`.trim() }
			style={ {
				width: iconSize,
				height: iconSize,
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
			} }
			aria-hidden="true"
		>
			{ icon }
		</span>
	);
};

export default BlockIcon;
