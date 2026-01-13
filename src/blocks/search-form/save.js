/**
 * Search Form Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Search icon SVG.
 */
const SearchIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		<path d="M13 5c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7l-3.8 3.8 1.1 1.1 3.8-3.8c1 .8 2.3 1.3 3.7 1.3 3.3 0 6-2.7 6-6S16.3 5 13 5zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
	</svg>
);

/**
 * Search Form Save Component.
 */
export default function save( { attributes } ) {
	const {
		placeholder,
		buttonText,
		showButton,
		buttonIcon,
		layout,
		inputBackgroundColor,
		inputTextColor,
		inputBorderColor,
		buttonBackgroundColor,
		buttonTextColor,
		borderRadius,
		inputHeight,
		width,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `wp-block-gambol-search-form wp-block-gambol-search-form--${ layout }`,
	} );

	const formStyle = {
		width: width || undefined,
	};

	const inputStyle = {
		backgroundColor: inputBackgroundColor || undefined,
		color: inputTextColor || undefined,
		borderColor: inputBorderColor || undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
		height: inputHeight ? `${ inputHeight }px` : undefined,
	};

	const buttonStyle = {
		backgroundColor: buttonBackgroundColor || 'var(--gb-colors-primary)',
		color: buttonTextColor || undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
		height: inputHeight ? `${ inputHeight }px` : undefined,
	};

	return (
		<div { ...blockProps }>
			<form 
				className="wp-block-gambol-search-form__form" 
				style={ formStyle } 
				role="search"
				method="get"
				action="/"
			>
				<input
					type="search"
					className="wp-block-gambol-search-form__input"
					placeholder={ placeholder }
					style={ inputStyle }
					name="s"
					aria-label={ placeholder }
				/>
				{ showButton && (
					<button
						type="submit"
						className="wp-block-gambol-search-form__button"
						style={ buttonStyle }
					>
						{ buttonIcon ? <SearchIcon /> : buttonText }
					</button>
				) }
			</form>
		</div>
	);
}
