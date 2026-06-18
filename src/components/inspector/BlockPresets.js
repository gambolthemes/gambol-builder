/**
 * Block Presets Component
 *
 * Save current block style as a named preset and apply saved presets
 * to blocks of the same type — like Avada's Element Presets feature.
 *
 * Renders as a collapsible panel at the top of the Advanced inspector tab.
 *
 * @package GambolBuilder
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, TextControl, Popover } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * BlockPresets Component
 *
 * @param {Object}   props
 * @param {string}   props.blockName      The block name (e.g. 'gambol/button').
 * @param {Object}   props.attributes     Current block attributes.
 * @param {Function} props.setAttributes  Block setAttributes callback.
 * @return {JSX.Element}
 */
const BlockPresets = ( { blockName, attributes, setAttributes } ) => {
	const [ presets, setPresets ]           = useState( [] );
	const [ isOpen, setIsOpen ]             = useState( false );
	const [ showSaveInput, setShowSaveInput ] = useState( false );
	const [ presetName, setPresetName ]     = useState( '' );
	const [ isSaving, setIsSaving ]         = useState( false );
	const [ saveAnchor, setSaveAnchor ]     = useState( null );

	// Fetch presets on mount.
	useEffect( () => {
		if ( ! blockName ) return;
		fetchPresets();
	}, [ blockName ] );

	const fetchPresets = async () => {
		try {
			const data = await apiFetch( {
				path: `/gambol-builder/v1/block-presets/${ encodeURIComponent( blockName ) }`,
			} );
			setPresets( Array.isArray( data ) ? data : [] );
		} catch ( err ) {
			setPresets( [] );
		}
	};

	const handleSavePreset = async () => {
		if ( ! presetName.trim() ) return;
		setIsSaving( true );
		try {
			// Only save style-relevant attributes (exclude layout/content ones).
			const styleAttrs = getStyleAttributes( attributes );
			await apiFetch( {
				path:   `/gambol-builder/v1/block-presets/${ encodeURIComponent( blockName ) }`,
				method: 'POST',
				data:   { name: presetName.trim(), attributes: styleAttrs },
			} );
			await fetchPresets();
			setPresetName( '' );
			setShowSaveInput( false );
		} catch ( err ) {
			// noop
		} finally {
			setIsSaving( false );
		}
	};

	const handleApplyPreset = ( preset ) => {
		setAttributes( preset.attributes );
		setIsOpen( false );
	};

	const handleDeletePreset = async ( e, presetId ) => {
		e.stopPropagation();
		try {
			await apiFetch( {
				path:   `/gambol-builder/v1/block-presets/${ encodeURIComponent( blockName ) }/${ presetId }`,
				method: 'DELETE',
			} );
			await fetchPresets();
		} catch ( err ) {
			// noop
		}
	};

	return (
		<div className="gambol-block-presets">
			<div className="gambol-block-presets__header">
				<span className="gambol-block-presets__label">
					{ __( 'Style Presets', 'gambol-builder' ) }
					{ presets.length > 0 && (
						<span className="gambol-block-presets__count">{ presets.length }</span>
					) }
				</span>
				<div className="gambol-block-presets__actions">
					{ /* Save current style as preset */ }
					<button
						type="button"
						className="gambol-block-presets__save-btn"
						onClick={ ( e ) => {
							setSaveAnchor( e.currentTarget );
							setShowSaveInput( ! showSaveInput );
						} }
						title={ __( 'Save current style as preset', 'gambol-builder' ) }
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</button>

					{ /* Show presets dropdown */ }
					{ presets.length > 0 && (
						<button
							type="button"
							className={ `gambol-block-presets__dropdown-btn ${ isOpen ? 'is-open' : '' }` }
							onClick={ () => setIsOpen( ! isOpen ) }
							title={ __( 'Apply a saved preset', 'gambol-builder' ) }
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
								<path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
					) }
				</div>
			</div>

			{ /* Save name input */ }
			{ showSaveInput && (
				<div className="gambol-block-presets__save-form">
					<TextControl
						placeholder={ __( 'Preset name…', 'gambol-builder' ) }
						value={ presetName }
						onChange={ setPresetName }
						onKeyDown={ ( e ) => { if ( e.key === 'Enter' ) handleSavePreset(); } }
						className="gambol-block-presets__name-input"
					/>
					<Button
						variant="primary"
						isSmall
						onClick={ handleSavePreset }
						disabled={ isSaving || ! presetName.trim() }
					>
						{ isSaving ? __( 'Saving…', 'gambol-builder' ) : __( 'Save', 'gambol-builder' ) }
					</Button>
					<Button
						isSmall
						onClick={ () => { setShowSaveInput( false ); setPresetName( '' ); } }
					>
						{ __( 'Cancel', 'gambol-builder' ) }
					</Button>
				</div>
			) }

			{ /* Presets dropdown list */ }
			{ isOpen && presets.length > 0 && (
				<ul className="gambol-block-presets__list">
					{ presets.map( ( preset ) => (
						<li key={ preset.id } className="gambol-block-presets__item">
							<button
								type="button"
								className="gambol-block-presets__apply"
								onClick={ () => handleApplyPreset( preset ) }
							>
								{ preset.name }
							</button>
							<button
								type="button"
								className="gambol-block-presets__delete"
								onClick={ ( e ) => handleDeletePreset( e, preset.id ) }
								title={ __( 'Delete preset', 'gambol-builder' ) }
							>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none">
									<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
								</svg>
							</button>
						</li>
					) ) }
				</ul>
			) }
		</div>
	);
};

/**
 * Extract style-relevant attributes (exclude content, layout anchors, etc.)
 * These are the attributes worth saving as a "style" preset.
 *
 * @param {Object} attributes All block attributes.
 * @return {Object} Filtered style attributes.
 */
function getStyleAttributes( attributes ) {
	const EXCLUDE = new Set( [
		'anchor', 'className', 'content', 'innerBlocks',
		'url', 'linkTarget', 'rel', 'id', 'postId',
		'animationName', 'animationDelay', 'animationDuration',
	] );

	return Object.fromEntries(
		Object.entries( attributes ).filter( ( [ key ] ) => ! EXCLUDE.has( key ) )
	);
}

export default BlockPresets;
