# Gambol Builder - Left Sidebar Architecture

This document outlines the React component skeleton for the custom left sidebar panel that replaces the Gutenberg block inserter.

## Component Hierarchy

```
GambolSidebar (Main Container)
├── Header
│   ├── GambolLogo
│   └── CollapseButton
├── SearchBar
│   ├── SearchIcon
│   ├── Input
│   └── ClearButton
├── BlockLibrary (Content Area)
│   └── BlockGroup (for each category)
│       ├── GroupHeader (collapsible)
│       └── BlockGrid
│           └── BlockItem (for each block)
│               ├── BlockIcon
│               └── BlockLabel
└── Footer
    └── HelpText
```

## Component Skeleton

### 1. GambolSidebar (Main Container)

```jsx
/**
 * Main left sidebar panel.
 * Mounts outside React tree, positioned fixed on left.
 */
const GambolSidebar = () => {
    // State
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [recentlyUsed, setRecentlyUsed] = useState([]);
    
    // Hooks
    useDragDropInserter();      // Enable drag-to-insert
    useKeyboardNavigation();     // Keyboard shortcuts
    
    // Computed
    const filteredBlocks = useMemo(() => searchBlocks(searchQuery), [searchQuery]);
    const hasBlocks = Object.values(filteredBlocks).some(b => b.length > 0);
    
    return (
        <div className="gambol-left-sidebar">
            <Header isCollapsed={isCollapsed} onToggle={setIsCollapsed} />
            {!isCollapsed && (
                <>
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <BlockLibrary blocks={filteredBlocks} />
                    <Footer />
                </>
            )}
        </div>
    );
};
```

### 2. SearchBar

```jsx
/**
 * Search input for filtering blocks.
 */
const SearchBar = ({ value, onChange }) => {
    const inputRef = useRef(null);
    
    // Keyboard shortcut: Cmd/Ctrl + K to focus
    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);
    
    return (
        <div className="gambol-search-bar">
            <SearchIcon />
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search Gambol blocks…"
            />
            {value && <ClearButton onClick={() => onChange('')} />}
        </div>
    );
};
```

### 3. BlockGroup

```jsx
/**
 * Collapsible category group containing blocks.
 */
const BlockGroup = ({ category, blocks, onBlockInsert }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const contentId = useId();
    
    return (
        <div className="gambol-block-group">
            <button
                className="gambol-block-group__header"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls={contentId}
            >
                <BlockIcon type={category.icon} />
                <span>{category.label}</span>
                <span className="count">{blocks.length}</span>
                <ChevronIcon expanded={isExpanded} />
            </button>
            
            {isExpanded && (
                <div id={contentId} className="gambol-block-group__grid">
                    {blocks.map(block => (
                        <BlockItem 
                            key={block.name}
                            block={block}
                            onInsert={onBlockInsert}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
```

### 4. BlockItem

```jsx
/**
 * Individual block that can be clicked or dragged.
 */
const BlockItem = ({ block, onInsert }) => {
    const { insertBlock } = useDispatch('core/block-editor');
    const { getBlockInsertionPoint } = useSelect(select => ({
        getBlockInsertionPoint: select('core/block-editor').getBlockInsertionPoint
    }));
    
    // Handle click to insert
    const handleClick = () => {
        if (block.disabled) return;
        
        const newBlock = createBlock(block.name);
        const point = getBlockInsertionPoint();
        insertBlock(newBlock, point.index, point.rootClientId, true);
        onInsert?.(block);
    };
    
    // Handle drag start (for drag-to-insert)
    const handleDragStart = (e) => {
        e.dataTransfer.setData('gambol-block', block.name);
        e.dataTransfer.effectAllowed = 'copy';
    };
    
    return (
        <button
            className="gambol-block-item"
            onClick={handleClick}
            draggable={!block.disabled}
            onDragStart={handleDragStart}
            disabled={block.disabled}
        >
            <BlockIcon type={block.icon} />
            <span className="gambol-block-item__label">{block.title}</span>
            {block.disabled && <span className="soon-badge">Soon</span>}
        </button>
    );
};
```

### 5. Loader (Mounts Sidebar to DOM)

```jsx
/**
 * Mounts the sidebar outside the React tree.
 * Hides the default Gutenberg block inserter.
 */
const mountSidebar = () => {
    // Create container
    const container = document.createElement('div');
    container.id = 'gambol-sidebar-root';
    document.body.appendChild(container);
    
    // Mount React component
    const root = createRoot(container);
    root.render(<GambolSidebar />);
    
    // Hide default Gutenberg inserter
    hideDefaultInserter();
    
    // Add body class for CSS
    document.body.classList.add('gambol-editor-active');
};

// Initialize when DOM is ready and editor loads
domReady(() => {
    const unsubscribe = subscribe(() => {
        if (select('core/editor')?.getCurrentPostType()) {
            unsubscribe();
            mountSidebar();
        }
    });
});
```

## Block Registry Structure

```javascript
// Categories
const BLOCK_CATEGORIES = [
    { id: 'layout', label: 'Layout', icon: 'layout' },
    { id: 'content', label: 'Content', icon: 'content' },
    { id: 'media', label: 'Media', icon: 'media' },
    { id: 'utilities', label: 'Utilities', icon: 'utilities' },
];

// Blocks organized by category
const GAMBOL_BLOCKS = {
    layout: [
        { name: 'gambol/section', title: 'Section', icon: 'section', ... },
        { name: 'gambol/container', title: 'Container', icon: 'container', ... },
    ],
    content: [
        { name: 'gambol/heading', title: 'Heading', icon: 'heading', ... },
        { name: 'gambol/text', title: 'Text', icon: 'text', ... },
        { name: 'gambol/button', title: 'Button', icon: 'button', ... },
    ],
    media: [
        { name: 'core/image', title: 'Image', icon: 'image', ... },
        { name: 'gambol/icon', title: 'Icon', icon: 'icon', disabled: true },
    ],
    utilities: [
        { name: 'core/spacer', title: 'Spacer', icon: 'spacer', ... },
        { name: 'core/separator', title: 'Divider', icon: 'divider', ... },
    ],
};
```

## Key Files

| File | Purpose |
|------|---------|
| `GambolSidebar.js` | Main sidebar container component |
| `SearchBar.js` | Search input with keyboard shortcuts |
| `BlockGroup.js` | Collapsible category group |
| `BlockItem.js` | Individual draggable block |
| `BlockIcon.js` | SVG icon renderer |
| `block-registry.js` | Block definitions and categories |
| `loader.js` | DOM mounting and initialization |
| `useDragDropInserter.js` | Drag-and-drop hook |
| `useKeyboardNavigation.js` | Keyboard navigation hook |
| `sidebar.scss` | Complete styling |

## CSS Class Naming Convention

```
.gambol-left-sidebar          (container)
.gambol-left-sidebar--collapsed (modifier)
.gambol-sidebar__header       (child element)
.gambol-sidebar__search       (child element)
.gambol-sidebar__content      (child element)
.gambol-block-group           (component)
.gambol-block-group__header   (child element)
.gambol-block-item            (component)
.gambol-block-item--disabled  (modifier)
```
