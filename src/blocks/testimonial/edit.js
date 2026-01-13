/**
 * Testimonial Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	RangeSlider,
	Dropdown,
	Toggle,
	TextInput,
	GambolColorPicker,
	SpacingBox,
} from '../../components/inspector';

/**
 * Testimonial header icon.
 */
const TestimonialHeaderIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
	</svg>
);

/**
 * Quote icon.
 */
const QuoteIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
		<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
	</svg>
);

/**
 * Star icon.
 */
const StarIcon = ( { filled } ) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
		{ filled ? (
			<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
		) : (
			<path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
		) }
	</svg>
);

/**
 * Testimonial Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		content,
		authorName,
		authorTitle,
		authorImage,
		showRating,
		rating,
		ratingColor,
		layout,
		alignment,
		imagePosition,
		imageSize,
		backgroundColor,
		textColor,
		quoteColor,
		showQuoteIcon,
		padding,
		borderRadius,
		boxShadow,
		contentFontSize,
		authorNameSize,
		authorTitleSize,
		htmlId,
		cssClasses,
	} = attributes;

	// Build CSS custom properties
	const cssVars = {
		'--gambol-testimonial-bg': backgroundColor,
		'--gambol-testimonial-color': textColor,
		'--gambol-testimonial-quote-color': quoteColor,
		'--gambol-testimonial-rating-color': ratingColor,
		'--gambol-testimonial-padding': `${ padding.top }px ${ padding.right }px ${ padding.bottom }px ${ padding.left }px`,
		'--gambol-testimonial-radius': borderRadius,
		'--gambol-testimonial-shadow': boxShadow,
		'--gambol-testimonial-content-size': `${ contentFontSize }px`,
		'--gambol-testimonial-name-size': `${ authorNameSize }px`,
		'--gambol-testimonial-title-size': `${ authorTitleSize }px`,
		'--gambol-testimonial-image-size': `${ imageSize }px`,
	};

	// Build class names
	const className = [
		'gambol-testimonial',
		`gambol-testimonial--${ layout }`,
		`gambol-testimonial--align-${ alignment }`,
		`gambol-testimonial--image-${ imagePosition }`,
		cssClasses,
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps( {
		className,
		style: cssVars,
		id: htmlId || undefined,
	} );

	// Render stars
	const renderStars = () => {
		return [ ...Array( 5 ) ].map( ( _, index ) => (
			<button
				key={ index }
				type="button"
				className="gambol-testimonial__star"
				onClick={ () => setAttributes( { rating: index + 1 } ) }
			>
				<StarIcon filled={ index < rating } />
			</button>
		) );
	};

	// Layout tab content
	const layoutTab = (
		<>
			<Section title={ __( 'Layout', 'gambol-builder' ) }>
				<Dropdown
					label={ __( 'Style', 'gambol-builder' ) }
					value={ layout }
					options={ [
						{ value: 'standard', label: __( 'Standard', 'gambol-builder' ) },
						{ value: 'card', label: __( 'Card', 'gambol-builder' ) },
						{ value: 'bubble', label: __( 'Speech Bubble', 'gambol-builder' ) },
						{ value: 'minimal', label: __( 'Minimal', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { layout: value } ) }
				/>
				<ButtonGroup
					label={ __( 'Alignment', 'gambol-builder' ) }
					value={ alignment }
					options={ [
						{ value: 'left', label: __( 'Left', 'gambol-builder' ) },
						{ value: 'center', label: __( 'Center', 'gambol-builder' ) },
						{ value: 'right', label: __( 'Right', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { alignment: value } ) }
				/>
			</Section>

			<Section title={ __( 'Author Image', 'gambol-builder' ) }>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) => setAttributes( { authorImage: media.url } ) }
						allowedTypes={ [ 'image' ] }
						render={ ( { open } ) => (
							<div className="gambol-media-upload">
								{ authorImage ? (
									<div className="gambol-media-preview">
										<img src={ authorImage } alt="" />
										<button type="button" onClick={ () => setAttributes( { authorImage: '' } ) }>
											×
										</button>
									</div>
								) : (
									<Button variant="secondary" onClick={ open } className="gambol-btn--full">
										{ __( 'Select Image', 'gambol-builder' ) }
									</Button>
								) }
							</div>
						) }
					/>
				</MediaUploadCheck>
				{ authorImage && (
					<>
						<ButtonGroup
							label={ __( 'Image Position', 'gambol-builder' ) }
							value={ imagePosition }
							options={ [
								{ value: 'left', label: __( 'Left', 'gambol-builder' ) },
								{ value: 'top', label: __( 'Top', 'gambol-builder' ) },
								{ value: 'right', label: __( 'Right', 'gambol-builder' ) },
							] }
							onChange={ ( value ) => setAttributes( { imagePosition: value } ) }
						/>
						<RangeSlider
							label={ __( 'Image Size', 'gambol-builder' ) }
							value={ imageSize }
							min={ 40 }
							max={ 120 }
							step={ 5 }
							onChange={ ( value ) => setAttributes( { imageSize: value } ) }
						/>
					</>
				) }
			</Section>

			<Section title={ __( 'Rating', 'gambol-builder' ) }>
				<Toggle
					label={ __( 'Show Rating', 'gambol-builder' ) }
					checked={ showRating }
					onChange={ ( value ) => setAttributes( { showRating: value } ) }
				/>
				{ showRating && (
					<>
						<RangeSlider
							label={ __( 'Stars', 'gambol-builder' ) }
							value={ rating }
							min={ 1 }
							max={ 5 }
							step={ 1 }
							onChange={ ( value ) => setAttributes( { rating: value } ) }
						/>
						<GambolColorPicker
							label={ __( 'Star Color', 'gambol-builder' ) }
							value={ ratingColor }
							onChange={ ( value ) => setAttributes( { ratingColor: value } ) }
						/>
					</>
				) }
			</Section>
		</>
	);

	// Design tab content
	const designTab = (
		<>
			<Section title={ __( 'Colors', 'gambol-builder' ) }>
				<GambolColorPicker
					label={ __( 'Background', 'gambol-builder' ) }
					value={ backgroundColor }
					onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
				/>
				<GambolColorPicker
					label={ __( 'Text Color', 'gambol-builder' ) }
					value={ textColor }
					onChange={ ( value ) => setAttributes( { textColor: value } ) }
				/>
				<Toggle
					label={ __( 'Show Quote Icon', 'gambol-builder' ) }
					checked={ showQuoteIcon }
					onChange={ ( value ) => setAttributes( { showQuoteIcon: value } ) }
				/>
				{ showQuoteIcon && (
					<GambolColorPicker
						label={ __( 'Quote Color', 'gambol-builder' ) }
						value={ quoteColor }
						onChange={ ( value ) => setAttributes( { quoteColor: value } ) }
					/>
				) }
			</Section>

			<Section title={ __( 'Spacing', 'gambol-builder' ) }>
				<SpacingBox
					label={ __( 'Padding', 'gambol-builder' ) }
					value={ padding }
					onChange={ ( value ) => setAttributes( { padding: value } ) }
				/>
			</Section>

			<Section title={ __( 'Border', 'gambol-builder' ) }>
				<TextInput
					label={ __( 'Border Radius', 'gambol-builder' ) }
					value={ borderRadius }
					onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
				/>
				<Dropdown
					label={ __( 'Box Shadow', 'gambol-builder' ) }
					value={ boxShadow }
					options={ [
						{ value: 'none', label: __( 'None', 'gambol-builder' ) },
						{ value: '0 2px 10px rgba(0,0,0,0.08)', label: __( 'Small', 'gambol-builder' ) },
						{ value: '0 4px 20px rgba(0,0,0,0.1)', label: __( 'Medium', 'gambol-builder' ) },
						{ value: '0 8px 30px rgba(0,0,0,0.12)', label: __( 'Large', 'gambol-builder' ) },
					] }
					onChange={ ( value ) => setAttributes( { boxShadow: value } ) }
				/>
			</Section>

			<Section title={ __( 'Typography', 'gambol-builder' ) }>
				<RangeSlider
					label={ __( 'Content Font Size', 'gambol-builder' ) }
					value={ contentFontSize }
					min={ 12 }
					max={ 24 }
					step={ 1 }
					onChange={ ( value ) => setAttributes( { contentFontSize: value } ) }
				/>
				<RangeSlider
					label={ __( 'Author Name Size', 'gambol-builder' ) }
					value={ authorNameSize }
					min={ 12 }
					max={ 24 }
					step={ 1 }
					onChange={ ( value ) => setAttributes( { authorNameSize: value } ) }
				/>
				<RangeSlider
					label={ __( 'Author Title Size', 'gambol-builder' ) }
					value={ authorTitleSize }
					min={ 10 }
					max={ 18 }
					step={ 1 }
					onChange={ ( value ) => setAttributes( { authorTitleSize: value } ) }
				/>
			</Section>
		</>
	);

	// Advanced tab content
	const advancedTab = (
		<Section title={ __( 'Attributes', 'gambol-builder' ) }>
			<TextInput
				label={ __( 'HTML ID', 'gambol-builder' ) }
				value={ htmlId }
				onChange={ ( value ) => setAttributes( { htmlId: value } ) }
				placeholder="my-testimonial"
			/>
			<TextInput
				label={ __( 'CSS Classes', 'gambol-builder' ) }
				value={ cssClasses }
				onChange={ ( value ) => setAttributes( { cssClasses: value } ) }
				placeholder="class-1 class-2"
			/>
		</Section>
	);

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Testimonial', 'gambol-builder' ) }
					blockIcon={ <TestimonialHeaderIcon /> }
					layoutTab={ layoutTab }
					designTab={ designTab }
					advancedTab={ advancedTab }
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ showQuoteIcon && (
					<div className="gambol-testimonial__quote-icon">
						<QuoteIcon />
					</div>
				) }

				{ showRating && (
					<div className="gambol-testimonial__rating">
						{ renderStars() }
					</div>
				) }

				<RichText
					tagName="blockquote"
					className="gambol-testimonial__content"
					value={ content }
					onChange={ ( value ) => setAttributes( { content: value } ) }
					placeholder={ __( 'Enter testimonial...', 'gambol-builder' ) }
				/>

				<div className="gambol-testimonial__author">
					{ authorImage && (
						<img
							src={ authorImage }
							alt={ authorName }
							className="gambol-testimonial__author-image"
						/>
					) }
					<div className="gambol-testimonial__author-info">
						<RichText
							tagName="cite"
							className="gambol-testimonial__author-name"
							value={ authorName }
							onChange={ ( value ) => setAttributes( { authorName: value } ) }
							placeholder={ __( 'Author name', 'gambol-builder' ) }
						/>
						<RichText
							tagName="span"
							className="gambol-testimonial__author-title"
							value={ authorTitle }
							onChange={ ( value ) => setAttributes( { authorTitle: value } ) }
							placeholder={ __( 'Author title', 'gambol-builder' ) }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
