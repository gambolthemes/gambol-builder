/**
 * Testimonial Carousel Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { Button, TextareaControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

/**
 * Star Rating Component.
 */
const StarRating = ( { rating, color, onChange } ) => {
	return (
		<div className="gambol-star-rating">
			{ [ 1, 2, 3, 4, 5 ].map( ( star ) => (
				<button
					key={ star }
					type="button"
					onClick={ () => onChange && onChange( star ) }
					className={ star <= rating ? 'is-filled' : '' }
					style={ { color: star <= rating ? color : '#ddd' } }
				>
					★
				</button>
			) ) }
		</div>
	);
};

/**
 * Testimonial Carousel Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		testimonials,
		layout,
		slidesToShow,
		autoplay,
		autoplaySpeed,
		showDots,
		showArrows,
		showRating,
		showImage,
		cardBackgroundColor,
		textColor,
		authorColor,
		ratingColor,
		borderRadius,
		padding,
	} = attributes;

	const [ activeSlide, setActiveSlide ] = useState( 0 );
	const [ editingIndex, setEditingIndex ] = useState( null );

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-testimonial-carousel wp-block-gambol-testimonial-carousel--${ layout }`,
	} );

	const updateTestimonial = ( index, updates ) => {
		const newTestimonials = [ ...testimonials ];
		newTestimonials[ index ] = { ...newTestimonials[ index ], ...updates };
		setAttributes( { testimonials: newTestimonials } );
	};

	const addTestimonial = () => {
		setAttributes( {
			testimonials: [
				...testimonials,
				{
					content: 'New testimonial content...',
					author: 'Author Name',
					position: 'Position, Company',
					image: '',
					rating: 5,
				},
			],
		} );
	};

	const removeTestimonial = ( index ) => {
		const newTestimonials = testimonials.filter( ( _, i ) => i !== index );
		setAttributes( { testimonials: newTestimonials } );
		if ( activeSlide >= newTestimonials.length ) {
			setActiveSlide( Math.max( 0, newTestimonials.length - 1 ) );
		}
	};

	const cardStyle = {
		backgroundColor: cardBackgroundColor || undefined,
		color: textColor || undefined,
		borderRadius: `${ borderRadius }px`,
		padding: `${ padding }px`,
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Testimonial Carousel', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'card', label: __( 'Card', 'gambol-builder' ) },
										{ value: 'bubble', label: __( 'Bubble', 'gambol-builder' ) },
										{ value: 'minimal', label: __( 'Minimal', 'gambol-builder' ) },
									] }
								/>
								<RangeSlider
									label={ __( 'Slides to Show', 'gambol-builder' ) }
									value={ slidesToShow }
									onChange={ ( value ) => setAttributes( { slidesToShow: value } ) }
									min={ 1 }
									max={ 4 }
								/>
							</Section>

							<Section title={ __( 'Carousel Settings', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Autoplay', 'gambol-builder' ) }
									checked={ autoplay }
									onChange={ ( value ) => setAttributes( { autoplay: value } ) }
								/>
								{ autoplay && (
									<RangeSlider
										label={ __( 'Autoplay Speed (ms)', 'gambol-builder' ) }
										value={ autoplaySpeed }
										onChange={ ( value ) => setAttributes( { autoplaySpeed: value } ) }
										min={ 1000 }
										max={ 10000 }
										step={ 500 }
									/>
								) }
								<Toggle
									label={ __( 'Show Dots', 'gambol-builder' ) }
									checked={ showDots }
									onChange={ ( value ) => setAttributes( { showDots: value } ) }
								/>
								<Toggle
									label={ __( 'Show Arrows', 'gambol-builder' ) }
									checked={ showArrows }
									onChange={ ( value ) => setAttributes( { showArrows: value } ) }
								/>
							</Section>

							<Section title={ __( 'Display', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Rating', 'gambol-builder' ) }
									checked={ showRating }
									onChange={ ( value ) => setAttributes( { showRating: value } ) }
								/>
								<Toggle
									label={ __( 'Show Image', 'gambol-builder' ) }
									checked={ showImage }
									onChange={ ( value ) => setAttributes( { showImage: value } ) }
								/>
							</Section>

							<Section title={ __( 'Testimonials', 'gambol-builder' ) }>
								{ testimonials.map( ( testimonial, index ) => (
									<div key={ index } className="gambol-testimonial-item-editor">
										<div className="gambol-testimonial-item-editor__header">
											<span>{ testimonial.author || `Testimonial ${ index + 1 }` }</span>
											<div className="gambol-testimonial-item-editor__actions">
												<Button
													isSmall
													onClick={ () => setEditingIndex( editingIndex === index ? null : index ) }
												>
													{ editingIndex === index ? __( 'Done', 'gambol-builder' ) : __( 'Edit', 'gambol-builder' ) }
												</Button>
												<Button
													isSmall
													isDestructive
													onClick={ () => removeTestimonial( index ) }
													disabled={ testimonials.length <= 1 }
												>
													✕
												</Button>
											</div>
										</div>
										{ editingIndex === index && (
											<div className="gambol-testimonial-item-editor__content">
												<TextareaControl
													label={ __( 'Content', 'gambol-builder' ) }
													value={ testimonial.content }
													onChange={ ( value ) => updateTestimonial( index, { content: value } ) }
												/>
												<TextControl
													label={ __( 'Author', 'gambol-builder' ) }
													value={ testimonial.author }
													onChange={ ( value ) => updateTestimonial( index, { author: value } ) }
												/>
												<TextControl
													label={ __( 'Position', 'gambol-builder' ) }
													value={ testimonial.position }
													onChange={ ( value ) => updateTestimonial( index, { position: value } ) }
												/>
												<MediaUploadCheck>
													<MediaUpload
														onSelect={ ( media ) => updateTestimonial( index, { image: media.url } ) }
														allowedTypes={ [ 'image' ] }
														render={ ( { open } ) => (
															<Button onClick={ open } variant="secondary" isSmall>
																{ testimonial.image ? __( 'Change Image', 'gambol-builder' ) : __( 'Select Image', 'gambol-builder' ) }
															</Button>
														) }
													/>
												</MediaUploadCheck>
											</div>
										) }
									</div>
								) ) }
								<Button onClick={ addTestimonial } variant="secondary" isSmall>
									{ __( '+ Add Testimonial', 'gambol-builder' ) }
								</Button>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Card Styles', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ cardBackgroundColor }
									onChange={ ( value ) => setAttributes( { cardBackgroundColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ textColor }
									onChange={ ( value ) => setAttributes( { textColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Author Color', 'gambol-builder' ) }
									value={ authorColor }
									onChange={ ( value ) => setAttributes( { authorColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Rating Color', 'gambol-builder' ) }
									value={ ratingColor }
									onChange={ ( value ) => setAttributes( { ratingColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Spacing', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Border Radius (px)', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 50 }
								/>
								<RangeSlider
									label={ __( 'Padding (px)', 'gambol-builder' ) }
									value={ padding }
									onChange={ ( value ) => setAttributes( { padding: value } ) }
									min={ 0 }
									max={ 80 }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-gambol-testimonial-carousel__track">
					{ testimonials.map( ( testimonial, index ) => (
						<div
							key={ index }
							className={ `wp-block-gambol-testimonial-carousel__slide ${ index === activeSlide ? 'is-active' : '' }` }
							style={ cardStyle }
						>
							{ showRating && (
								<StarRating
									rating={ testimonial.rating }
									color={ ratingColor }
									onChange={ ( value ) => updateTestimonial( index, { rating: value } ) }
								/>
							) }

							<blockquote className="wp-block-gambol-testimonial-carousel__content">
								<p>{ testimonial.content }</p>
							</blockquote>

							<div className="wp-block-gambol-testimonial-carousel__author">
								{ showImage && testimonial.image && (
									<img
										src={ testimonial.image }
										alt={ testimonial.author }
										className="wp-block-gambol-testimonial-carousel__image"
									/>
								) }
								<div className="wp-block-gambol-testimonial-carousel__info">
									<cite style={ { color: authorColor || undefined } }>
										{ testimonial.author }
									</cite>
									{ testimonial.position && (
										<span className="wp-block-gambol-testimonial-carousel__position">
											{ testimonial.position }
										</span>
									) }
								</div>
							</div>
						</div>
					) ) }
				</div>

				{ showDots && testimonials.length > 1 && (
					<div className="wp-block-gambol-testimonial-carousel__dots">
						{ testimonials.map( ( _, index ) => (
							<button
								key={ index }
								className={ `wp-block-gambol-testimonial-carousel__dot ${ index === activeSlide ? 'is-active' : '' }` }
								onClick={ () => setActiveSlide( index ) }
								aria-label={ `Go to slide ${ index + 1 }` }
							/>
						) ) }
					</div>
				) }
			</div>
		</>
	);
}
