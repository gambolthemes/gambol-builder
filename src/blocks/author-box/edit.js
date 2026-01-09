/**
 * Author Box Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	RangeSlider,
	TextInput,
} from '../../components/inspector';

/**
 * Author Box Edit Component.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const {
		layout,
		showAvatar,
		avatarSize,
		avatarBorderRadius,
		showName,
		showBio,
		showLink,
		linkText,
		nameColor,
		bioColor,
		linkColor,
		backgroundColor,
		padding,
		borderRadius,
	} = attributes;

	const { postId, postType } = context;

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-author-box wp-block-gambol-author-box--${ layout }`,
	} );

	// Get author info
	const { authorName, authorBio, authorAvatar, authorUrl } = useSelect(
		( select ) => {
			const post = select( 'core' ).getEditedEntityRecord( 'postType', postType || 'post', postId );
			const authorId = post?.author;
			
			if ( authorId ) {
				const author = select( 'core' ).getUser( authorId );
				return {
					authorName: author?.name || __( 'Author Name', 'gambol-builder' ),
					authorBio: author?.description || __( 'Author bio will appear here...', 'gambol-builder' ),
					authorAvatar: author?.avatar_urls?.[ '96' ] || '',
					authorUrl: author?.link || '#',
				};
			}
			
			return {
				authorName: __( 'Author Name', 'gambol-builder' ),
				authorBio: __( 'Author bio will appear here. This is a placeholder for the author description.', 'gambol-builder' ),
				authorAvatar: '',
				authorUrl: '#',
			};
		},
		[ postId, postType ]
	);

	const wrapperStyle = {
		backgroundColor: backgroundColor || undefined,
		padding: padding ? `${ padding }px` : undefined,
		borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
	};

	const avatarStyle = {
		width: `${ avatarSize }px`,
		height: `${ avatarSize }px`,
		borderRadius: `${ avatarBorderRadius }%`,
	};

	const nameStyle = {
		color: nameColor || undefined,
	};

	const bioStyle = {
		color: bioColor || undefined,
	};

	const linkStyle = {
		color: linkColor || 'var(--gb-colors-primary)',
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Author Box', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Layout', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Direction', 'gambol-builder' ) }
									value={ layout }
									onChange={ ( value ) => setAttributes( { layout: value } ) }
									options={ [
										{ value: 'horizontal', label: __( 'Horizontal', 'gambol-builder' ) },
										{ value: 'vertical', label: __( 'Vertical', 'gambol-builder' ) },
									] }
								/>
							</Section>

							<Section title={ __( 'Avatar', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Avatar', 'gambol-builder' ) }
									checked={ showAvatar }
									onChange={ ( value ) => setAttributes( { showAvatar: value } ) }
								/>
								{ showAvatar && (
									<>
										<RangeSlider
											label={ __( 'Avatar Size', 'gambol-builder' ) }
											value={ avatarSize }
											onChange={ ( value ) => setAttributes( { avatarSize: value } ) }
											min={ 40 }
											max={ 150 }
										/>
										<RangeSlider
											label={ __( 'Avatar Roundness', 'gambol-builder' ) }
											value={ avatarBorderRadius }
											onChange={ ( value ) => setAttributes( { avatarBorderRadius: value } ) }
											min={ 0 }
											max={ 50 }
										/>
									</>
								) }
							</Section>

							<Section title={ __( 'Content', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Name', 'gambol-builder' ) }
									checked={ showName }
									onChange={ ( value ) => setAttributes( { showName: value } ) }
								/>
								<Toggle
									label={ __( 'Show Bio', 'gambol-builder' ) }
									checked={ showBio }
									onChange={ ( value ) => setAttributes( { showBio: value } ) }
								/>
								<Toggle
									label={ __( 'Show Posts Link', 'gambol-builder' ) }
									checked={ showLink }
									onChange={ ( value ) => setAttributes( { showLink: value } ) }
								/>
								{ showLink && (
									<TextInput
										label={ __( 'Link Text', 'gambol-builder' ) }
										value={ linkText }
										onChange={ ( value ) => setAttributes( { linkText: value } ) }
									/>
								) }
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Box Style', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Padding', 'gambol-builder' ) }
									value={ padding }
									onChange={ ( value ) => setAttributes( { padding: value } ) }
									min={ 0 }
									max={ 50 }
								/>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 30 }
								/>
								<GambolColorPicker
									label={ __( 'Background Color', 'gambol-builder' ) }
									value={ backgroundColor }
									onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Colors', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Name Color', 'gambol-builder' ) }
									value={ nameColor }
									onChange={ ( value ) => setAttributes( { nameColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Bio Color', 'gambol-builder' ) }
									value={ bioColor }
									onChange={ ( value ) => setAttributes( { bioColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Link Color', 'gambol-builder' ) }
									value={ linkColor }
									onChange={ ( value ) => setAttributes( { linkColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<div { ...blockProps } style={ wrapperStyle }>
				{ showAvatar && (
					<div className="wp-block-gambol-author-box__avatar" style={ avatarStyle }>
						{ authorAvatar ? (
							<img src={ authorAvatar } alt={ authorName } />
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
								<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
							</svg>
						) }
					</div>
				) }
				<div className="wp-block-gambol-author-box__content">
					{ showName && (
						<h3 className="wp-block-gambol-author-box__name" style={ nameStyle }>
							{ authorName }
						</h3>
					) }
					{ showBio && (
						<p className="wp-block-gambol-author-box__bio" style={ bioStyle }>
							{ authorBio }
						</p>
					) }
					{ showLink && (
						<a 
							href={ authorUrl } 
							className="wp-block-gambol-author-box__link"
							style={ linkStyle }
						>
							{ linkText }
						</a>
					) }
				</div>
			</div>
		</>
	);
}
