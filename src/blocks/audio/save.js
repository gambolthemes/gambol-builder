/**
 * Audio Block - Save Component
 *
 * @package GambolBuilder
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Audio Save Component.
 */
export default function save( { attributes } ) {
	const {
		audioSource,
		audioUrl,
		soundCloudEmbedCode,
		autoplay,
		loop,
		caption,
		backgroundColor,
		borderRadius,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: 'wp-block-gambol-audio',
	} );

	const containerStyle = {
		backgroundColor: backgroundColor || undefined,
		borderRadius: `${ borderRadius }px`,
	};

	// Don't save if no audio
	if ( audioSource === 'self' && ! audioUrl ) {
		return null;
	}
	if ( audioSource === 'soundcloud' && ! soundCloudEmbedCode ) {
		return null;
	}

	return (
		<figure { ...blockProps }>
			<div className="wp-block-gambol-audio__wrapper" style={ containerStyle }>
				{ audioSource === 'self' && audioUrl && (
					<audio
						controls
						src={ audioUrl }
						autoPlay={ autoplay }
						loop={ loop }
						preload="metadata"
					/>
				) }

				{ audioSource === 'soundcloud' && soundCloudEmbedCode && (
					<div
						className="wp-block-gambol-audio__soundcloud"
						dangerouslySetInnerHTML={ { __html: soundCloudEmbedCode } }
					/>
				) }
			</div>

			{ caption && (
				<RichText.Content
					tagName="figcaption"
					value={ caption }
					className="wp-block-gambol-audio__caption"
				/>
			) }
		</figure>
	);
}
