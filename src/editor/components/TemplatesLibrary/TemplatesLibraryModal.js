/**
 * Templates Library Modal — Avada Studio equivalent
 *
 * Full-screen modal with sidebar category filters, search,
 * and a 4-column grid of template cards.
 *
 * @package GambolBuilder
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { TextControl, Button } from '@wordpress/components';
import { dispatch } from '@wordpress/data';
import { parse } from '@wordpress/blocks';
import apiFetch from '@wordpress/api-fetch';
import TemplatesGrid from './TemplatesGrid';

/**
 * Category definitions for the left sidebar.
 */
const CATEGORIES = [
	{ slug: '',              label: __( 'All Templates', 'gambol-builder' ) },
	{ slug: 'hero',          label: __( 'Hero',          'gambol-builder' ) },
	{ slug: 'features',      label: __( 'Features',      'gambol-builder' ) },
	{ slug: 'testimonials',  label: __( 'Testimonials',  'gambol-builder' ) },
	{ slug: 'pricing',       label: __( 'Pricing',       'gambol-builder' ) },
	{ slug: 'cta',           label: __( 'Call to Action','gambol-builder' ) },
	{ slug: 'contact',       label: __( 'Contact',       'gambol-builder' ) },
	{ slug: 'about',         label: __( 'About',         'gambol-builder' ) },
	{ slug: 'blog',          label: __( 'Blog',          'gambol-builder' ) },
	{ slug: 'portfolio',     label: __( 'Portfolio',     'gambol-builder' ) },
	{ slug: 'header',        label: __( 'Header',        'gambol-builder' ) },
	{ slug: 'footer',        label: __( 'Footer',        'gambol-builder' ) },
];

const TYPE_FILTERS = [
	{ slug: '',        label: __( 'All Types', 'gambol-builder' ) },
	{ slug: 'section', label: __( 'Sections',  'gambol-builder' ) },
	{ slug: 'page',    label: __( 'Pages',     'gambol-builder' ) },
];

/**
 * TemplatesLibraryModal
 *
 * @param {Object}   props
 * @param {Function} props.onClose Called when the modal is closed.
 */
const TemplatesLibraryModal = ( { onClose } ) => {
	const [ templates, setTemplates ]   = useState( [] );
	const [ isLoading, setIsLoading ]   = useState( true );
	const [ search, setSearch ]         = useState( '' );
	const [ activeCategory, setActiveCategory ] = useState( '' );
	const [ activeType, setActiveType ] = useState( '' );
	const [ importingId, setImportingId ] = useState( null );
	const [ previewTemplate, setPreviewTemplate ] = useState( null );
	const [ debouncedSearch, setDebouncedSearch ] = useState( '' );

	// Debounce search input.
	useEffect( () => {
		const timer = setTimeout( () => setDebouncedSearch( search ), 300 );
		return () => clearTimeout( timer );
	}, [ search ] );

	// Fetch templates when filters change.
	useEffect( () => {
		fetchTemplates();
	}, [ activeCategory, activeType, debouncedSearch ] );

	const fetchTemplates = useCallback( async () => {
		setIsLoading( true );
		try {
			const params = new URLSearchParams();
			if ( activeCategory ) params.set( 'category', activeCategory );
			if ( activeType )     params.set( 'type',     activeType );
			if ( debouncedSearch ) params.set( 'search',  debouncedSearch );

			const data = await apiFetch( {
				path: `/gambol-builder/v1/templates?${ params.toString() }`,
			} );
			setTemplates( Array.isArray( data ) ? data : [] );
		} catch ( err ) {
			setTemplates( [] );
		} finally {
			setIsLoading( false );
		}
	}, [ activeCategory, activeType, debouncedSearch ] );

	/**
	 * Insert template blocks into the current editor.
	 */
	const handleInsert = useCallback( async ( template ) => {
		setImportingId( template.id );
		try {
			const data = await apiFetch( {
				path:   '/gambol-builder/v1/templates/import',
				method: 'POST',
				data:   { id: template.id },
			} );

			if ( data?.content ) {
				const blocks = parse( data.content );
				dispatch( 'core/block-editor' ).insertBlocks( blocks );
				onClose();
			}
		} catch ( err ) {
			// Silently fail; user sees no change.
		} finally {
			setImportingId( null );
		}
	}, [ onClose ] );

	return (
		<div className="gambol-templates-modal" role="dialog" aria-modal="true" aria-label={ __( 'Template Library', 'gambol-builder' ) }>
			{/* Backdrop */}
			<div className="gambol-templates-modal__backdrop" onClick={ onClose } aria-hidden="true" />

			{/* Modal container */}
			<div className="gambol-templates-modal__container">
				{/* Header */}
				<div className="gambol-templates-modal__header">
					<div className="gambol-templates-modal__header-left">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect x="3" y="3" width="8" height="8" rx="1" fill="#00d4aa"/>
							<rect x="13" y="3" width="8" height="8" rx="1" fill="#6366f1"/>
							<rect x="3" y="13" width="8" height="8" rx="1" fill="#6366f1"/>
							<rect x="13" y="13" width="8" height="8" rx="1" fill="#00d4aa"/>
						</svg>
						<h2 className="gambol-templates-modal__title">
							{ __( 'Template Library', 'gambol-builder' ) }
						</h2>
					</div>
					<div className="gambol-templates-modal__header-right">
						{/* Type filter tabs */}
						<div className="gambol-templates-type-tabs">
							{ TYPE_FILTERS.map( ( f ) => (
								<button
									key={ f.slug }
									type="button"
									className={ `gambol-type-tab ${ activeType === f.slug ? 'is-active' : '' }` }
									onClick={ () => setActiveType( f.slug ) }
								>
									{ f.label }
								</button>
							) ) }
						</div>
						{/* Search */}
						<div className="gambol-templates-search">
							<TextControl
								placeholder={ __( 'Search templates…', 'gambol-builder' ) }
								value={ search }
								onChange={ setSearch }
								className="gambol-templates-search__input"
							/>
						</div>
						{/* Close */}
						<button
							type="button"
							className="gambol-templates-modal__close"
							onClick={ onClose }
							aria-label={ __( 'Close', 'gambol-builder' ) }
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
							</svg>
						</button>
					</div>
				</div>

				{/* Body: sidebar + grid */}
				<div className="gambol-templates-modal__body">
					{/* Category Sidebar */}
					<nav className="gambol-templates-sidebar" aria-label={ __( 'Template categories', 'gambol-builder' ) }>
						{ CATEGORIES.map( ( cat ) => (
							<button
								key={ cat.slug }
								type="button"
								className={ `gambol-templates-sidebar__item ${ activeCategory === cat.slug ? 'is-active' : '' }` }
								onClick={ () => setActiveCategory( cat.slug ) }
							>
								{ cat.label }
							</button>
						) ) }
					</nav>

					{/* Templates Grid */}
					<div className="gambol-templates-modal__content">
						<TemplatesGrid
							templates={ templates }
							isLoading={ isLoading }
							onInsert={ handleInsert }
							onPreview={ setPreviewTemplate }
							importingId={ importingId }
						/>
					</div>
				</div>
			</div>

			{/* Preview lightbox */}
			{ previewTemplate && (
				<div className="gambol-templates-preview" role="dialog">
					<div
						className="gambol-templates-preview__backdrop"
						onClick={ () => setPreviewTemplate( null ) }
						aria-hidden="true"
					/>
					<div className="gambol-templates-preview__container">
						<div className="gambol-templates-preview__header">
							<h3>{ previewTemplate.title }</h3>
							<div className="gambol-templates-preview__actions">
								<Button
									variant="primary"
									onClick={ () => {
										handleInsert( previewTemplate );
										setPreviewTemplate( null );
									} }
								>
									{ __( 'Insert Template', 'gambol-builder' ) }
								</Button>
								<button
									type="button"
									className="gambol-templates-preview__close"
									onClick={ () => setPreviewTemplate( null ) }
									aria-label={ __( 'Close preview', 'gambol-builder' ) }
								>
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
										<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
									</svg>
								</button>
							</div>
						</div>
						<div className="gambol-templates-preview__body">
							{ previewTemplate.thumbnail ? (
								<img src={ previewTemplate.thumbnail } alt={ previewTemplate.title } />
							) : (
								<div className="gambol-templates-preview__no-thumb">
									<p>{ __( 'No preview available.', 'gambol-builder' ) }</p>
								</div>
							) }
						</div>
					</div>
				</div>
			) }
		</div>
	);
};

export default TemplatesLibraryModal;
