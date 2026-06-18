/**
 * Dynamic Tags Picker Component
 *
 * A small popover button ({{ }}) that shows available dynamic tags.
 * Clicking a tag copies "{{tag_name}}" to clipboard and shows a notice.
 * Used in heading and text block inspectors.
 *
 * @package GambolBuilder
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Popover } from '@wordpress/components';

/**
 * Human-readable label for each tag.
 */
const TAG_LABELS = {
	post_title:         __( 'Post Title',           'gambol-builder' ),
	post_excerpt:       __( 'Post Excerpt',         'gambol-builder' ),
	post_url:           __( 'Post URL',             'gambol-builder' ),
	post_date:          __( 'Post Date',            'gambol-builder' ),
	post_modified_date: __( 'Post Modified Date',   'gambol-builder' ),
	post_id:            __( 'Post ID',              'gambol-builder' ),
	post_category:      __( 'Post Category',        'gambol-builder' ),
	author_name:        __( 'Author Name',          'gambol-builder' ),
	author_bio:         __( 'Author Bio',           'gambol-builder' ),
	author_url:         __( 'Author URL',           'gambol-builder' ),
	site_name:          __( 'Site Name',            'gambol-builder' ),
	site_tagline:       __( 'Site Tagline',         'gambol-builder' ),
	site_url:           __( 'Site URL',             'gambol-builder' ),
	current_date:       __( 'Current Date',         'gambol-builder' ),
	current_time:       __( 'Current Time',         'gambol-builder' ),
	current_year:       __( 'Current Year',         'gambol-builder' ),
	current_month:      __( 'Current Month',        'gambol-builder' ),
	current_user_name:  __( 'Current User Name',    'gambol-builder' ),
	current_user_email: __( 'Current User Email',   'gambol-builder' ),
};

/**
 * DynamicTagsPicker Component
 *
 * @param {Object}   props
 * @param {Function} props.onSelectTag Called with the tag string e.g. "{{post_title}}" when a tag is selected.
 * @return {JSX.Element}
 */
const DynamicTagsPicker = ( { onSelectTag } ) => {
	const [ isOpen, setIsOpen ]       = useState( false );
	const [ copied, setCopied ]       = useState( null );
	const [ anchor, setAnchor ]       = useState( null );

	const tags = window.gambolBuilderData?.dynamicTags || Object.keys( TAG_LABELS );

	const handleSelect = ( tag ) => {
		const tagStr = `{{${ tag }}}`;
		if ( onSelectTag ) {
			onSelectTag( tagStr );
		} else {
			// Fallback: copy to clipboard.
			navigator.clipboard?.writeText( tagStr ).catch( () => {} );
		}
		setCopied( tag );
		setTimeout( () => {
			setCopied( null );
			setIsOpen( false );
		}, 800 );
	};

	return (
		<div className="gambol-dynamic-tags-picker">
			<button
				type="button"
				ref={ ( el ) => setAnchor( el ) }
				className={ `gambol-dynamic-tags-btn ${ isOpen ? 'is-open' : '' }` }
				onClick={ () => setIsOpen( ! isOpen ) }
				title={ __( 'Insert dynamic tag', 'gambol-builder' ) }
			>
				<span>{ '{{' }</span>
				<span className="gambol-dynamic-tags-btn__label">
					{ __( 'Dynamic', 'gambol-builder' ) }
				</span>
				<span>{ '}}' }</span>
			</button>

			{ isOpen && anchor && (
				<Popover
					anchor={ anchor }
					onClose={ () => setIsOpen( false ) }
					className="gambol-dynamic-tags-popover"
					placement="bottom-start"
				>
					<div className="gambol-dynamic-tags-list">
						<div className="gambol-dynamic-tags-list__header">
							{ __( 'Dynamic Tags', 'gambol-builder' ) }
						</div>
						<ul>
							{ tags.map( ( tag ) => (
								<li key={ tag }>
									<button
										type="button"
										className={ `gambol-dynamic-tags-list__item ${ copied === tag ? 'is-copied' : '' }` }
										onClick={ () => handleSelect( tag ) }
									>
										<code className="gambol-dynamic-tags-list__tag">
											{ `{{${ tag }}}` }
										</code>
										<span className="gambol-dynamic-tags-list__label">
											{ TAG_LABELS[ tag ] || tag }
										</span>
										{ copied === tag && (
											<span className="gambol-dynamic-tags-list__done">✓</span>
										) }
									</button>
								</li>
							) ) }
						</ul>
					</div>
				</Popover>
			) }
		</div>
	);
};

export default DynamicTagsPicker;
