/**
 * Gambol Builder - Visual Editor
 * 
 * Main entry point for the visual page builder interface.
 * Initializes the custom left sidebar, toolbar, and templates panel.
 */

import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { layout } from '@wordpress/icons';
import { useState, useCallback, createRoot, render } from '@wordpress/element';
import { subscribe, select } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';

import EditorPanel from './components/EditorPanel';
import EditorToolbar from './components/EditorToolbar';
import TemplatesPanel from './components/TemplatesPanel';
import './styles/editor.scss';

// Initialize the custom left sidebar (block inserter replacement)
import './sidebar/loader';

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
            { showTemplates && <TemplatesPanel onClose={ closeTemplates } /> }
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

