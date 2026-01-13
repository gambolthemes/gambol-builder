/**
 * Gambol Builder - Widget Library
 * 
 * Displays available widgets/blocks in a categorized grid.
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { 
    Icon,
    chevronDown,
    chevronUp
} from '@wordpress/icons';

// Widget definitions with categories
const WIDGET_CATEGORIES = [
    {
        slug: 'favorites',
        title: __('Favorites', 'gambol-builder'),
        widgets: [],
        collapsible: true,
    },
    {
        slug: 'basic',
        title: __('Basic', 'gambol-builder'),
        widgets: [
            {
                name: 'gambol/section',
                title: __('Section', 'gambol-builder'),
                icon: 'section',
            },
            {
                name: 'gambol/container',
                title: __('Container', 'gambol-builder'),
                icon: 'container',
            },
            {
                name: 'gambol/heading',
                title: __('Heading', 'gambol-builder'),
                icon: 'heading',
            },
            {
                name: 'gambol/text',
                title: __('Text Editor', 'gambol-builder'),
                icon: 'text',
            },
            {
                name: 'gambol/button',
                title: __('Button', 'gambol-builder'),
                icon: 'button',
            },
            {
                name: 'core/image',
                title: __('Image', 'gambol-builder'),
                icon: 'image',
            },
            {
                name: 'core/video',
                title: __('Video', 'gambol-builder'),
                icon: 'video',
            },
            {
                name: 'core/spacer',
                title: __('Spacer', 'gambol-builder'),
                icon: 'spacer',
            },
            {
                name: 'core/separator',
                title: __('Divider', 'gambol-builder'),
                icon: 'divider',
            },
        ],
    },
    {
        slug: 'layout',
        title: __('Layout', 'gambol-builder'),
        widgets: [
            {
                name: 'core/columns',
                title: __('Columns', 'gambol-builder'),
                icon: 'columns',
            },
            {
                name: 'core/group',
                title: __('Group', 'gambol-builder'),
                icon: 'group',
            },
            {
                name: 'core/cover',
                title: __('Cover', 'gambol-builder'),
                icon: 'cover',
            },
        ],
    },
    {
        slug: 'content',
        title: __('Content', 'gambol-builder'),
        widgets: [
            {
                name: 'core/list',
                title: __('List', 'gambol-builder'),
                icon: 'list',
            },
            {
                name: 'core/quote',
                title: __('Quote', 'gambol-builder'),
                icon: 'quote',
            },
            {
                name: 'core/table',
                title: __('Table', 'gambol-builder'),
                icon: 'table',
            },
            {
                name: 'core/code',
                title: __('Code', 'gambol-builder'),
                icon: 'code',
            },
            {
                name: 'core/html',
                title: __('HTML', 'gambol-builder'),
                icon: 'html',
            },
        ],
    },
    {
        slug: 'media',
        title: __('Media', 'gambol-builder'),
        widgets: [
            {
                name: 'core/gallery',
                title: __('Gallery', 'gambol-builder'),
                icon: 'gallery',
            },
            {
                name: 'core/audio',
                title: __('Audio', 'gambol-builder'),
                icon: 'audio',
            },
            {
                name: 'core/file',
                title: __('File', 'gambol-builder'),
                icon: 'file',
            },
            {
                name: 'core/embed',
                title: __('Embed', 'gambol-builder'),
                icon: 'embed',
            },
        ],
    },
];

// SVG Icons for widgets
const WidgetIcon = ({ type }) => {
    const icons = {
        section: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <path d="M7 7h10v2H7zM7 11h10v2H7zM7 15h7v2H7z"/>
            </svg>
        ),
        container: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            </svg>
        ),
        heading: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 4v3h5.5v12h3V7H19V4H5z"/>
            </svg>
        ),
        text: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/>
            </svg>
        ),
        button: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>
                <path d="M8 11h8v2H8z"/>
            </svg>
        ),
        image: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
        ),
        video: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
        ),
        spacer: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 19h3v4h2v-4h3l-4-4-4 4zm8-14h-3V1h-2v4H8l4 4 4-4zM4 11v2h16v-2H4z"/>
            </svg>
        ),
        divider: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 11h16v2H4z"/>
            </svg>
        ),
        columns: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 18h5V5h-5v13zm-6 0h5V5H4v13zM16 5v13h5V5h-5z"/>
            </svg>
        ),
        group: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
        ),
        cover: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h16v12H4z"/>
                <path d="M4 18h16v2H4z"/>
            </svg>
        ),
        list: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
        ),
        quote: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
        ),
        table: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM10 17H5v-2h5v2zm0-4H5v-2h5v2zm0-4H5V7h5v2zm10 8h-5v-2h5v2zm0-4h-5v-2h5v2zm0-4h-5V7h5v2z"/>
            </svg>
        ),
        code: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
        ),
        html: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.5 9H5v6H3.5v-2.5h-2V15H0V9h1.5v2h2V9zm4.5 0v6h3.5v-1.5H9.5v-1h1.5v-1.5h-1.5v-1H11V9H8zm7.5 0v6h3.5v-1.5H14v-1h1.5v-1.5H14v-1h2.5V9H12zM20 9v4.5h1.5V11h1V9.5h-1V9h-1.5z"/>
            </svg>
        ),
        gallery: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
            </svg>
        ),
        audio: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/>
            </svg>
        ),
        file: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
        ),
        embed: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
            </svg>
        ),
    };

    return (
        <span className="gambol-widget-icon">
            {icons[type] || icons.container}
        </span>
    );
};

const WidgetLibrary = ({ searchQuery }) => {
    const [collapsedCategories, setCollapsedCategories] = useState(['favorites']);
    const { insertBlock } = useDispatch('core/block-editor');
    const { getBlockInsertionPoint } = useSelect((select) => ({
        getBlockInsertionPoint: select('core/block-editor').getBlockInsertionPoint,
    }), []);

    // Filter widgets based on search
    const filterWidgets = (widgets) => {
        if (!searchQuery) return widgets;
        return widgets.filter(widget => 
            widget.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Toggle category collapse
    const toggleCategory = (slug) => {
        setCollapsedCategories(prev => 
            prev.includes(slug) 
                ? prev.filter(s => s !== slug)
                : [...prev, slug]
        );
    };

    // Handle widget click - insert block
    const handleWidgetClick = (blockName) => {
        const block = createBlock(blockName);
        const insertionPoint = getBlockInsertionPoint();
        insertBlock(block, insertionPoint.index, insertionPoint.rootClientId);
    };

    return (
        <div className="gambol-widget-library">
            {WIDGET_CATEGORIES.map((category) => {
                const filteredWidgets = filterWidgets(category.widgets);
                
                // Hide empty categories when searching
                if (searchQuery && filteredWidgets.length === 0) {
                    return null;
                }

                const isCollapsed = collapsedCategories.includes(category.slug);

                return (
                    <div key={category.slug} className="gambol-widget-category">
                        <button
                            className="gambol-category-header"
                            onClick={() => toggleCategory(category.slug)}
                        >
                            <span className="gambol-category-title">
                                {category.title}
                            </span>
                            <Icon icon={isCollapsed ? chevronDown : chevronUp} />
                        </button>
                        
                        {!isCollapsed && (
                            <div className="gambol-widget-grid">
                                {filteredWidgets.map((widget) => (
                                    <button
                                        key={widget.name}
                                        className="gambol-widget-item"
                                        onClick={() => handleWidgetClick(widget.name)}
                                        draggable="true"
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('text/plain', widget.name);
                                        }}
                                    >
                                        <WidgetIcon type={widget.icon} />
                                        <span className="gambol-widget-title">
                                            {widget.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default WidgetLibrary;
