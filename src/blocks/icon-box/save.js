/**
 * Icon Box Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

const ICONS = {
	star: '★',
	heart: '♥',
	check: '✓',
	settings: '⚙',
	user: '👤',
	mail: '✉',
	phone: '📞',
	location: '📍',
	clock: '🕐',
	globe: '🌐',
	lock: '🔒',
	rocket: '🚀',
	lightning: '⚡',
	trophy: '🏆',
	diamond: '💎',
};

/**
 * Icon Box Save Component.
 */
export default function save( { attributes } ) {
	const {
		icon,
		title,
		description,
		layout,
		titleTag,
		contentAlignment,
		iconSize,
		iconColor,
		iconBackgroundColor,
		iconPadding,
		iconBorderRadius,
		hoverAnimation,
		linkUrl,
		linkTarget,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-icon-box layout-${ layout } align-${ contentAlignment } hover-${ hoverAnimation }`,
	} );

	const TitleTag = titleTag;

	const iconStyle = {
		fontSize: `${ iconSize }px`,
		color: iconColor || undefined,
		backgroundColor: iconBackgroundColor || undefined,
		padding: iconBackgroundColor ? `${ iconPadding }px` : undefined,
		borderRadius: iconBackgroundColor ? `${ iconBorderRadius }%` : undefined,
	};

	const IconBoxContent = () => (
		<>
			<div className="wp-block-gambol-icon-box__icon" style={ iconStyle }>
				{ ICONS[ icon ] || ICONS.star }
			</div>
			<div className="wp-block-gambol-icon-box__content">
				{ title && (
					<RichText.Content
						tagName={ TitleTag }
						className="wp-block-gambol-icon-box__title"
						value={ title }
					/>
				) }
				{ description && (
					<RichText.Content
						tagName="p"
						className="wp-block-gambol-icon-box__description"
						value={ description }
					/>
				) }
			</div>
		</>
	);

	return (
		<div { ...blockProps }>
			{ linkUrl ? (
				<a
					href={ linkUrl }
					target={ linkTarget || undefined }
					rel={ linkTarget === '_blank' ? 'noopener noreferrer' : undefined }
					className="wp-block-gambol-icon-box__link"
				>
					<IconBoxContent />
				</a>
			) : (
				<IconBoxContent />
			) }
		</div>
	);
}
