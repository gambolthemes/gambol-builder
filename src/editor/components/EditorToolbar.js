/**
 * Gambol Builder - Editor Toolbar Component
 * 
 * Enhanced editor header with responsive preview, undo/redo, and settings.
 *
 * @package GambolBuilder
 */

import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { Button, Dropdown, ToolbarButton, Tooltip } from '@wordpress/components';

/**
 * Device Preview Icons
 */
const DeviceIcons = {
	desktop: (
		<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
			<rect x="2" y="3" width="20" height="14" rx="2" />
			<line x1="8" y1="21" x2="16" y2="21" />
			<line x1="12" y1="17" x2="12" y2="21" />
		</svg>
	),
	tablet: (
		<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
			<rect x="4" y="2" width="16" height="20" rx="2" />
			<line x1="12" y1="18" x2="12" y2="18.01" />
		</svg>
	),
	mobile: (
		<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
			<rect x="5" y="2" width="14" height="20" rx="2" />
			<line x1="12" y1="18" x2="12" y2="18.01" />
		</svg>
	),
};

/**
 * Action Icons
 */
const ActionIcons = {
	undo: (
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M3 10h10a5 5 0 0 1 5 5v2" />
			<polyline points="7 14 3 10 7 6" />
		</svg>
	),
	redo: (
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M21 10H11a5 5 0 0 0-5 5v2" />
			<polyline points="17 14 21 10 17 6" />
		</svg>
	),
	settings: (
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</svg>
	),
	structure: (
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="6" y1="10" x2="21" y2="10" />
			<line x1="6" y1="14" x2="21" y2="14" />
			<line x1="3" y1="18" x2="21" y2="18" />
		</svg>
	),
	preview: (
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
			<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	),
	exit: (
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line x1="21" y1="12" x2="9" y2="12" />
		</svg>
	),
	save: (
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
			<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
			<polyline points="17 21 17 13 7 13 7 21" />
			<polyline points="7 3 7 8 15 8" />
		</svg>
	),
};

/**
 * Gambol Logo
 */
const GambolLogo = () => (
	<svg viewBox="0 0 32 32" width="24" height="24" fill="none">
		<rect x="2" y="2" width="28" height="28" rx="6" fill="#00d4aa" />
		<path 
			d="M16 8C11.582 8 8 11.582 8 16s3.582 8 8 8c2.21 0 4.21-.895 5.657-2.343" 
			stroke="#121212" 
			strokeWidth="2.5" 
			strokeLinecap="round"
			fill="none"
		/>
		<circle cx="20" cy="16" r="3" fill="#121212" />
	</svg>
);

/**
 * EditorToolbar Component
 */
const EditorToolbar = ( { onTemplatesClick } ) => {
	const [ devicePreview, setDevicePreview ] = useState( 'desktop' );

	const { undo, redo } = useDispatch( 'core/editor' );
	
	const { hasUndo, hasRedo, isSaving, isPublishing, postTitle, previewLink, postId } = useSelect( ( select ) => {
		const editor = select( 'core/editor' );
		return {
			hasUndo: editor.hasEditorUndo(),
			hasRedo: editor.hasEditorRedo(),
			isSaving: editor.isSavingPost(),
			isPublishing: editor.isPublishingPost(),
			postTitle: editor.getEditedPostAttribute( 'title' ) || __( 'Untitled', 'gambol-builder' ),
			previewLink: editor.getEditedPostPreviewLink(),
			postId: editor.getCurrentPostId(),
		};
	}, [] );

	/**
	 * Open preview in new tab
	 */
	const openPreview = useCallback( () => {
		if ( previewLink ) {
			window.open( previewLink, '_blank' );
		}
	}, [ previewLink ] );

	/**
	 * Go back to admin dashboard
	 */
	const goToAdmin = useCallback( () => {
		const adminUrl = window.gambolBuilder?.adminUrl || '/wp-admin/';
		window.location.href = adminUrl;
	}, [] );

	const { openGeneralSidebar } = useDispatch( 'core/edit-post' );

	/**
	 * Handle device preview change
	 */
	const handleDeviceChange = useCallback( ( device ) => {
		setDevicePreview( device );
		
		// Responsive widths
		const widths = {
			desktop: '100%',
			tablet: '768px',
			mobile: '375px',
		};

		// Try iframe-based editor first (WordPress 6.x+)
		const iframe = document.querySelector( 'iframe[name="editor-canvas"]' );
		if ( iframe ) {
			// Style the iframe itself
			iframe.style.maxWidth = widths[ device ];
			iframe.style.margin = device !== 'desktop' ? '0 auto' : '';
			iframe.style.transition = 'max-width 0.3s ease, margin 0.3s ease';
			iframe.style.display = 'block';
			
			// Also style content inside iframe
			try {
				const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
				if ( iframeDoc ) {
					const body = iframeDoc.body;
					if ( body ) {
						body.setAttribute( 'data-device-preview', device );
					}
				}
			} catch ( e ) {
				// Cross-origin iframe, can't access content
			}
		}

		// Also try traditional editor wrapper (fallback)
		const editorWrapper = document.querySelector( '.edit-post-visual-editor, .editor-visual-editor' );
		if ( editorWrapper ) {
			editorWrapper.setAttribute( 'data-device-preview', device );
			
			const canvas = editorWrapper.querySelector( '.editor-styles-wrapper' );
			if ( canvas ) {
				canvas.style.maxWidth = widths[ device ];
				canvas.style.margin = device !== 'desktop' ? '0 auto' : '';
				canvas.style.transition = 'max-width 0.3s ease';
			}
		}

		// Try the editor content area directly
		const editorContent = document.querySelector( '.interface-interface-skeleton__content' );
		if ( editorContent ) {
			editorContent.setAttribute( 'data-device-preview', device );
		}
	}, [] );

	/**
	 * Open settings sidebar
	 */
	const openSettings = useCallback( () => {
		openGeneralSidebar( 'gambol-builder-panel/gambol-builder-panel' );
	}, [ openGeneralSidebar ] );

	return (
		<div className="gambol-editor-toolbar">
			{/* Left Section: Logo & Title */}
			<div className="gambol-toolbar__left">
				<div className="gambol-toolbar__logo">
					<GambolLogo />
				</div>
				<div className="gambol-toolbar__title">
					<span className="gambol-toolbar__post-title">{ postTitle }</span>
				</div>
			</div>

			{/* Center Section: Device Preview */}
			<div className="gambol-toolbar__center">
				<div className="gambol-toolbar__devices">
					{ Object.entries( DeviceIcons ).map( ( [ device, icon ] ) => (
						<Tooltip key={ device } text={ device.charAt( 0 ).toUpperCase() + device.slice( 1 ) }>
							<button
								className={ `gambol-toolbar__device-btn ${ devicePreview === device ? 'is-active' : '' }` }
								onClick={ () => handleDeviceChange( device ) }
								aria-pressed={ devicePreview === device }
							>
								{ icon }
							</button>
						</Tooltip>
					) ) }
				</div>
			</div>

			{/* Right Section: Actions */}
			<div className="gambol-toolbar__right">
				{/* Templates Button */}
				{ onTemplatesClick && (
					<Tooltip text={ __( 'Templates', 'gambol-builder' ) }>
						<button
							className="gambol-toolbar__templates-btn"
							onClick={ onTemplatesClick }
						>
							<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
								<rect x="3" y="3" width="18" height="18" rx="2" />
								<line x1="3" y1="9" x2="21" y2="9" />
								<line x1="9" y1="21" x2="9" y2="9" />
							</svg>
							<span>{ __( 'Templates', 'gambol-builder' ) }</span>
						</button>
					</Tooltip>
				) }

				{/* Undo/Redo */}
				<div className="gambol-toolbar__history">
					<Tooltip text={ __( 'Undo', 'gambol-builder' ) }>
						<button
							className="gambol-toolbar__action-btn"
							onClick={ undo }
							disabled={ ! hasUndo }
							aria-label={ __( 'Undo', 'gambol-builder' ) }
						>
							{ ActionIcons.undo }
						</button>
					</Tooltip>
					<Tooltip text={ __( 'Redo', 'gambol-builder' ) }>
						<button
							className="gambol-toolbar__action-btn"
							onClick={ redo }
							disabled={ ! hasRedo }
							aria-label={ __( 'Redo', 'gambol-builder' ) }
						>
							{ ActionIcons.redo }
						</button>
					</Tooltip>
				</div>

				{/* Structure View Toggle */}
				<Tooltip text={ __( 'Document Overview', 'gambol-builder' ) }>
					<button
						className="gambol-toolbar__action-btn"
						onClick={ () => openGeneralSidebar( 'edit-post/document' ) }
					>
						{ ActionIcons.structure }
					</button>
				</Tooltip>

				{/* Settings */}
				<Tooltip text={ __( 'Gambol Settings', 'gambol-builder' ) }>
					<button
						className="gambol-toolbar__action-btn"
						onClick={ openSettings }
					>
						{ ActionIcons.settings }
					</button>
				</Tooltip>

				{/* Preview Button */}
				<Tooltip text={ __( 'Preview', 'gambol-builder' ) }>
					<button
						className="gambol-toolbar__action-btn gambol-toolbar__preview-btn"
						onClick={ openPreview }
						disabled={ ! previewLink }
						aria-label={ __( 'Preview', 'gambol-builder' ) }
					>
						{ ActionIcons.preview }
					</button>
				</Tooltip>

				{/* Back to Admin Button */}
				<Tooltip text={ __( 'Exit to Dashboard', 'gambol-builder' ) }>
					<button
						className="gambol-toolbar__action-btn gambol-toolbar__exit-btn"
						onClick={ goToAdmin }
						aria-label={ __( 'Exit to Dashboard', 'gambol-builder' ) }
					>
						{ ActionIcons.exit }
					</button>
				</Tooltip>

				{/* Status Indicator */}
				<div className="gambol-toolbar__status">
					{ ( isSaving || isPublishing ) && (
						<span className="gambol-toolbar__saving">
							{ __( 'Saving...', 'gambol-builder' ) }
						</span>
					) }
				</div>
			</div>
		</div>
	);
};

export default EditorToolbar;
