/**
 * Comments Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	Toggle,
	GambolColorPicker,
	RangeSlider,
	TextInput,
} from '../../components/inspector';

/**
 * Comments Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		showTitle,
		titleText,
		showAvatar,
		avatarSize,
		showReplyButton,
		titleColor,
		textColor,
		linkColor,
		backgroundColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-gambol-comments',
	} );

	const wrapperStyle = {
		backgroundColor: backgroundColor || undefined,
	};

	const titleStyle = {
		color: titleColor || undefined,
	};

	const textStyle = {
		color: textColor || undefined,
	};

	const linkStyle = {
		color: linkColor || 'var(--gb-colors-primary)',
	};

	const avatarStyle = {
		width: `${ avatarSize }px`,
		height: `${ avatarSize }px`,
	};

	// Sample comments for preview
	const sampleComments = [
		{
			id: 1,
			author: 'John Doe',
			date: '2 days ago',
			content: 'This is a sample comment. The actual comments will be displayed on the frontend.',
		},
		{
			id: 2,
			author: 'Jane Smith',
			date: '1 week ago',
			content: 'Great article! Thanks for sharing.',
			isReply: true,
		},
	];

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Comments', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Title', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Title', 'gambol-builder' ) }
									checked={ showTitle }
									onChange={ ( value ) => setAttributes( { showTitle: value } ) }
								/>
								{ showTitle && (
									<TextInput
										label={ __( 'Title Text', 'gambol-builder' ) }
										value={ titleText }
										onChange={ ( value ) => setAttributes( { titleText: value } ) }
									/>
								) }
							</Section>

							<Section title={ __( 'Avatar', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Avatar', 'gambol-builder' ) }
									checked={ showAvatar }
									onChange={ ( value ) => setAttributes( { showAvatar: value } ) }
								/>
								{ showAvatar && (
									<RangeSlider
										label={ __( 'Avatar Size', 'gambol-builder' ) }
										value={ avatarSize }
										onChange={ ( value ) => setAttributes( { avatarSize: value } ) }
										min={ 24 }
										max={ 80 }
									/>
								) }
							</Section>

							<Section title={ __( 'Options', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Reply Button', 'gambol-builder' ) }
									checked={ showReplyButton }
									onChange={ ( value ) => setAttributes( { showReplyButton: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Title Color', 'gambol-builder' ) }
									value={ titleColor }
									onChange={ ( value ) => setAttributes( { titleColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ textColor }
									onChange={ ( value ) => setAttributes( { textColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Link Color', 'gambol-builder' ) }
									value={ linkColor }
									onChange={ ( value ) => setAttributes( { linkColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Background Color', 'gambol-builder' ) }
									value={ backgroundColor }
									onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps } style={ wrapperStyle }>
				{ showTitle && (
					<h3 className="wp-block-gambol-comments__title" style={ titleStyle }>
						{ titleText }
					</h3>
				) }
				
				<ol className="wp-block-gambol-comments__list">
					{ sampleComments.map( ( comment ) => (
						<li 
							key={ comment.id } 
							className={ `wp-block-gambol-comments__item ${ comment.isReply ? 'is-reply' : '' }` }
						>
							<article className="wp-block-gambol-comments__comment">
								{ showAvatar && (
									<div className="wp-block-gambol-comments__avatar" style={ avatarStyle }>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
										</svg>
									</div>
								) }
								<div className="wp-block-gambol-comments__content">
									<header className="wp-block-gambol-comments__meta">
										<span className="wp-block-gambol-comments__author" style={ linkStyle }>
											{ comment.author }
										</span>
										<time className="wp-block-gambol-comments__date" style={ textStyle }>
											{ comment.date }
										</time>
									</header>
									<div className="wp-block-gambol-comments__text" style={ textStyle }>
										{ comment.content }
									</div>
									{ showReplyButton && (
										<a href="#" className="wp-block-gambol-comments__reply" style={ linkStyle }>
											{ __( 'Reply', 'gambol-builder' ) }
										</a>
									) }
								</div>
							</article>
						</li>
					) ) }
				</ol>

				<div className="wp-block-gambol-comments__placeholder">
					<p>{ __( 'Comment form will appear here on the frontend.', 'gambol-builder' ) }</p>
				</div>
			</div>
		</>
	);
}
