/**
 * Toggle Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Icon components for toggle.
 */
const icons = {
	chevron: (
		<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
			<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
		</svg>
	),
	plus: (
		<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
			<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
		</svg>
	),
	arrow: (
		<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
			<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
		</svg>
	),
};

/**
 * Toggle Save Component.
 */
export default function save( { attributes } ) {
	const {
		title,
		content,
		isOpen,
		iconPosition,
		iconType,
		headerBackgroundColor,
		headerTextColor,
		headerPadding,
		contentBackgroundColor,
		contentTextColor,
		contentPadding,
		borderWidth,
		borderColor,
		borderRadius,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-toggle ${ isOpen ? 'is-open' : '' }`,
	} );

	const containerStyle = {
		borderWidth: `${ borderWidth }px`,
		borderColor: borderColor || undefined,
		borderRadius: `${ borderRadius }px`,
	};

	const headerStyle = {
		backgroundColor: headerBackgroundColor || undefined,
		color: headerTextColor || undefined,
		padding: `${ headerPadding }px`,
	};

	const contentStyle = {
		backgroundColor: contentBackgroundColor || undefined,
		color: contentTextColor || undefined,
		padding: `${ contentPadding }px`,
	};

	return (
		<div { ...blockProps } style={ containerStyle }>
			<button
				className={ `wp-block-gambol-toggle__header wp-block-gambol-toggle__header--icon-${ iconPosition }` }
				style={ headerStyle }
				aria-expanded={ isOpen }
			>
				{ iconPosition === 'left' && (
					<span className="wp-block-gambol-toggle__icon">
						{ icons[ iconType ] }
					</span>
				) }
				
				<RichText.Content
					tagName="span"
					className="wp-block-gambol-toggle__title"
					value={ title }
				/>
				
				{ iconPosition === 'right' && (
					<span className="wp-block-gambol-toggle__icon">
						{ icons[ iconType ] }
					</span>
				) }
			</button>

			<div 
				className="wp-block-gambol-toggle__content"
				style={ contentStyle }
				aria-hidden={ ! isOpen }
			>
				<RichText.Content
					tagName="div"
					value={ content }
				/>
			</div>
		</div>
	);
}
