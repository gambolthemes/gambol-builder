/**
 * Gambol Builder - Editor Panel
 * 
 * Main sidebar panel component with tabs and widget library.
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { TextControl } from '@wordpress/components';
import { search } from '@wordpress/icons';

import WidgetLibrary from './WidgetLibrary';
import GlobalSettings from './GlobalSettings';

const EditorPanel = () => {
    const [activeTab, setActiveTab] = useState('elements');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="gambol-editor-panel">
            {/* Tab Navigation */}
            <div className="gambol-panel-tabs">
                <button
                    className={`gambol-tab ${activeTab === 'elements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('elements')}
                >
                    {__('Elements', 'gambol-builder')}
                </button>
                <button
                    className={`gambol-tab ${activeTab === 'global' ? 'active' : ''}`}
                    onClick={() => setActiveTab('global')}
                >
                    {__('Global', 'gambol-builder')}
                </button>
            </div>

            {/* Search Bar */}
            {activeTab === 'elements' && (
                <div className="gambol-panel-search">
                    <TextControl
                        placeholder={__('Search Widget...', 'gambol-builder')}
                        value={searchQuery}
                        onChange={setSearchQuery}
                        className="gambol-search-input"
                    />
                </div>
            )}

            {/* Panel Content */}
            <div className="gambol-panel-content">
                {activeTab === 'elements' ? (
                    <WidgetLibrary searchQuery={searchQuery} />
                ) : (
                    <GlobalSettings />
                )}
            </div>
        </div>
    );
};

export default EditorPanel;
