/**
 * Gambol Builder - Visual Editor
 * 
 * Main entry point for the visual page builder interface.
 * Initializes the custom left sidebar, toolbar, and templates panel.
 */

import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { layout } from '@wordpress/icons';
import { useState, useCallback, createRoot, render } from '@wordpress/element';
import { subscribe, select } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import domReady from '@wordpress/dom-ready';

import EditorPanel from './components/EditorPanel';
import EditorToolbar from './components/EditorToolbar';
import TemplatesLibraryModal from './components/TemplatesLibrary/TemplatesLibraryModal';
import AnimationControl from '../components/inspector/controls/AnimationControl';
import VisibilityControl from '../components/inspector/controls/VisibilityControl';
import StickyControl from '../components/inspector/controls/StickyControl';
import './styles/editor.scss';

// Initialize the custom left sidebar (block inserter replacement)
import './sidebar/loader';

// =============================================
// ANIMATION SYSTEM — Block Attribute Filter
// Adds animationName, animationDelay, animationDuration to ALL gambol/* blocks
// without modifying individual block files.
// =============================================

addFilter(
	'blocks.registerBlockType',
	'gambol/add-animation-attributes',
	( settings, name ) => {
		if ( ! name.startsWith( 'gambol/' ) ) {
			return settings;
		}
		return {
			...settings,
			attributes: {
				...( settings.attributes || {} ),
				// Animation
				animationName: {
					type: 'string',
					default: '',
				},
				animationDelay: {
					type: 'number',
					default: 0,
				},
				animationDuration: {
					type: 'number',
					default: 600,
				},
				// Conditional Visibility
				visibilityDevices: {
					type: 'object',
					default: { desktop: true, tablet: true, mobile: true },
				},
				visibilityUserStatus: {
					type: 'string',
					default: 'everyone',
				},
				visibilityShowAfter: {
					type: 'string',
					default: '',
				},
				visibilityHideAfter: {
					type: 'string',
					default: '',
				},
				// Sticky
				stickyEnabled: {
					type: 'boolean',
					default: false,
				},
				stickyOffset: {
					type: 'number',
					default: 0,
				},
				stickyBehavior: {
					type: 'string',
					default: 'always',
				},
			},
		};
	}
);

// Adds AnimationControl panel to the inspector for ALL gambol/* blocks
const withAnimationControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! props.name.startsWith( 'gambol/' ) ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes } = props;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<AnimationControl
						animationName={ attributes.animationName || '' }
						animationDelay={ attributes.animationDelay || 0 }
						animationDuration={ attributes.animationDuration || 600 }
						onChange={ ( values ) => setAttributes( values ) }
					/>
				</InspectorControls>
			</>
		);
	};
}, 'withAnimationControls' );

addFilter(
	'editor.BlockEdit',
	'gambol/animation-controls',
	withAnimationControls
);

// Adds Visibility + Sticky panels to ALL gambol/* block inspectors.
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! props.name.startsWith( 'gambol/' ) ) {
			return <BlockEdit { ...props } />;
		}
		const { attributes, setAttributes } = props;
		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<VisibilityControl
						label="Visibility"
						value={ attributes.visibilityDevices || { desktop: true, tablet: true, mobile: true } }
						onChange={ ( val ) => setAttributes( { visibilityDevices: val } ) }
						userStatus={ attributes.visibilityUserStatus || 'everyone' }
						onUserStatus={ ( val ) => setAttributes( { visibilityUserStatus: val } ) }
						showAfter={ attributes.visibilityShowAfter || '' }
						onShowAfter={ ( val ) => setAttributes( { visibilityShowAfter: val } ) }
						hideAfter={ attributes.visibilityHideAfter || '' }
						onHideAfter={ ( val ) => setAttributes( { visibilityHideAfter: val } ) }
					/>
					<StickyControl
						enabled={ attributes.stickyEnabled || false }
						offset={ attributes.stickyOffset || 0 }
						behavior={ attributes.stickyBehavior || 'always' }
						onChange={ ( vals ) => setAttributes( vals ) }
					/>
				</InspectorControls>
			</>
		);
	};
}, 'withAdvancedControls' );

addFilter(
	'editor.BlockEdit',
	'gambol/advanced-controls',
	withAdvancedControls
);

/**
 * Register the Gambol Builder settings sidebar plugin.
 * This appears on the RIGHT side for settings/global options.
 */
registerPlugin('gambol-builder-panel', {
    icon: layout,
    render: () => (
        <>
            <PluginSidebarMoreMenuItem target="gambol-builder-panel">
                {__('Gambol Builder Settings', 'gambol-builder')}
            </PluginSidebarMoreMenuItem>
            <PluginSidebar
                name="gambol-builder-panel"
                title={__('Gambol Settings', 'gambol-builder')}
                className="gambol-builder-sidebar"
            >
                <EditorPanel />
            </PluginSidebar>
        </>
    ),
});

/**
 * Toolbar Root Component with Templates Toggle
 */
const GambolToolbarRoot = () => {
    const [ showTemplates, setShowTemplates ] = useState( false );

    const toggleTemplates = useCallback( () => {
        setShowTemplates( ( prev ) => ! prev );
    }, [] );

    const closeTemplates = useCallback( () => {
        setShowTemplates( false );
    }, [] );

    return (
        <>
            <EditorToolbar onTemplatesClick={ toggleTemplates } />
            { showTemplates && <TemplatesLibraryModal onClose={ closeTemplates } /> }
        </>
    );
};

/**
 * Mount the custom toolbar
 */
const mountToolbar = () => {
    const TOOLBAR_CONTAINER_ID = 'gambol-toolbar-root';
    
    let container = document.getElementById( TOOLBAR_CONTAINER_ID );
    if ( ! container ) {
        container = document.createElement( 'div' );
        container.id = TOOLBAR_CONTAINER_ID;
        document.body.appendChild( container );
    }

    if ( container.hasChildNodes() ) {
        return;
    }

    // Use React 18 createRoot if available
    if ( typeof createRoot === 'function' ) {
        const root = createRoot( container );
        root.render( <GambolToolbarRoot /> );
    } else {
        render( <GambolToolbarRoot />, container );
    }
};

/**
 * Initialize when editor is ready
 */
const initEditor = () => {
    let initialized = false;

    const unsubscribe = subscribe( () => {
        if ( initialized ) return;

        const editorStore = select( 'core/editor' );
        if ( ! editorStore ) return;

        try {
            const postType = editorStore.getCurrentPostType();
            if ( postType ) {
                initialized = true;
                
                // Mount toolbar after a short delay
                requestAnimationFrame( () => {
                    mountToolbar();
                } );
            }
        } catch ( e ) {
            // Editor not ready yet
        }
    } );
};

// Initialize on DOM ready
domReady( () => {
    if ( document.body.classList.contains( 'block-editor-page' ) 
        || document.querySelector( '.block-editor' ) 
        || document.querySelector( '.edit-post-visual-editor' ) ) {
        initEditor();
    }
});

