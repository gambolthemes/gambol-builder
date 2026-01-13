/**
 * Image Box Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Image Box Save Component.
 */
export default function save( { attributes } ) {
	const {
		imageUrl,
		imageAlt,
		title,
		description,
		layout,
		titleTag,
		contentAlignment,
		hoverEffect,
		linkUrl,
		linkTarget,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-image-box layout-${ layout } align-${ contentAlignment } hover-${ hoverEffect }`,
	} );

	const TitleTag = titleTag;

	const ImageContent = () => (
		<>
			<div className="wp-block-gambol-image-box__image-wrapper">
				{ imageUrl && (
					<img
						src={ imageUrl }
						alt={ imageAlt }
						className="wp-block-gambol-image-box__image"
					/>
				) }
			</div>
			<div className="wp-block-gambol-image-box__content">
				{ title && (
					<RichText.Content
						tagName={ TitleTag }
						className="wp-block-gambol-image-box__title"
						value={ title }
					/>
				) }
				{ description && (
					<RichText.Content
						tagName="p"
						className="wp-block-gambol-image-box__description"
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
					className="wp-block-gambol-image-box__link"
				>
					<ImageContent />
				</a>
			) : (
				<ImageContent />
			) }
		</div>
	);
}
