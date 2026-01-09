# Gambol Builder - Complete Architecture

> **Vision:** A standalone page builder product, powered by WordPress, but not looking like WordPress.

## Overview

Gambol Builder is a 100% custom visual page builder for WordPress that uses Gutenberg ONLY as an internal engine for data persistence and rendering. The end user never sees or interacts with default Gutenberg UI.

---

## Part 1: Editor Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GAMBOL BUILDER EDITOR                             │
├───────────────┬─────────────────────────────────────────┬───────────────────┤
│               │                                         │                   │
│   GAMBOL      │          GUTENBERG IFRAME               │    GAMBOL         │
│   LEFT        │          (Visual Canvas)                │    RIGHT          │
│   SIDEBAR     │                                         │    SIDEBAR        │
│               │    ┌─────────────────────────────┐      │                   │
│  ┌─────────┐  │    │                             │      │  ┌─────────────┐  │
│  │ Search  │  │    │                             │      │  │ Block       │  │
│  └─────────┘  │    │     BLOCKS RENDERED         │      │  │ Inspector   │  │
│               │    │     BY GUTENBERG            │      │  │             │  │
│  ┌─────────┐  │    │                             │      │  │ - Settings  │  │
│  │ Layout  │  │    │     (Section, Container,    │      │  │ - Style     │  │
│  │ Blocks  │  │    │      Heading, Text, etc.)   │      │  │ - Advanced  │  │
│  ├─────────┤  │    │                             │      │  │             │  │
│  │ Content │  │    │                             │      │  └─────────────┘  │
│  │ Blocks  │  │    └─────────────────────────────┘      │                   │
│  ├─────────┤  │                                         │  ┌─────────────┐  │
│  │ Design  │  │                                         │  │ Page        │  │
│  │ Blocks  │  │                                         │  │ Settings    │  │
│  └─────────┘  │                                         │  └─────────────┘  │
│               │                                         │                   │
│  Width: 280px │         Width: Flexible                 │  Width: 320px     │
│  Collapsible  │                                         │                   │
│  to 56px      │                                         │                   │
└───────────────┴─────────────────────────────────────────┴───────────────────┘

Data Flow:
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  User Action          Gambol Sidebar          Gutenberg Engine             │
│  (Click/Drag)    ──>  (useBlockInserter) ──>  (wp.data dispatch)           │
│                                                                            │
│  Block Rendered  <──  Canvas Display     <──  Block registration           │
│  in Canvas            (iframe or div)         (@wordpress/blocks)          │
│                                                                            │
│  Save to DB      <──  serialize()        <──  Post content (HTML comments) │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Gutenberg as Engine Only** - We use `@wordpress/data`, `@wordpress/blocks`, `@wordpress/block-editor` for data management and rendering. All visual UI is custom.

2. **Complete UI Replacement** - Every visible Gutenberg element (inserter buttons, sidebars, headers, patterns) is hidden via CSS, JS, and PHP filters.

3. **Custom Insertion API** - Blocks are inserted programmatically via `useBlockInserter` hook, not through Gutenberg's default inserter.

4. **Iframe Aware** - Supports both iframe mode (WP 6.0+) and non-iframe mode.

---

## Part 2: Folder & File Structure

```
gambol-builder/
├── gambol-builder.php              # Main plugin file (PHP filters, enqueue)
├── webpack.config.js               # Build configuration
├── package.json                    # Dependencies & npm scripts
│
├── src/
│   ├── index.js                    # Main entry - registers all blocks
│   │
│   ├── blocks/                     # Gambol Block definitions
│   │   ├── section/
│   │   │   ├── index.js           # registerBlockType()
│   │   │   ├── edit.js            # Editor component
│   │   │   ├── save.js            # Save output
│   │   │   └── style.scss         # Block styles
│   │   ├── container/
│   │   ├── heading/
│   │   ├── text/
│   │   └── button/
│   │
│   ├── editor/
│   │   ├── index.js               # Editor initialization
│   │   │
│   │   ├── sidebar/               # ★ GAMBOL LEFT SIDEBAR
│   │   │   ├── loader.js          # Mount point, Gutenberg hiding logic
│   │   │   ├── GambolSidebar.js   # Main sidebar container
│   │   │   ├── BlockItem.js       # Draggable block item
│   │   │   ├── BlockGroup.js      # Collapsible category group
│   │   │   ├── SearchBar.js       # Block search
│   │   │   ├── block-registry.js  # Gambol block definitions
│   │   │   ├── useBlockInserter.js # Programmatic insertion hook
│   │   │   ├── useDragDropInserter.js # Drag-and-drop hook
│   │   │   └── sidebar.scss       # Dark theme styles
│   │   │
│   │   ├── components/            # Editor utility components
│   │   │   ├── EditorPanel.js
│   │   │   ├── GlobalSettings.js
│   │   │   └── WidgetLibrary.js
│   │   │
│   │   └── styles/
│   │       └── editor.scss        # Editor override styles
│   │
│   ├── components/
│   │   └── inspector/             # Custom block inspector
│   │       ├── GambolInspector.js
│   │       ├── ControlGroup.js
│   │       └── inspector.scss
│   │
│   ├── styles/
│   │   ├── _variables.scss        # Design system variables
│   │   └── _design-system.scss    # Global design tokens
│   │
│   └── admin/                     # Admin pages
│       ├── index.js
│       └── pages/
│
├── build/                         # Compiled assets (auto-generated)
│
├── includes/                      # PHP classes
│   ├── class-admin-page.php
│   ├── class-global-styles.php
│   ├── header-footer/
│   ├── licensing/
│   ├── performance/
│   └── theme-integration/
│
└── languages/                     # Translations
```

---

## Part 3: Gambol Sidebar (React Components)

### Component Hierarchy

```
<GambolSidebar>                    # Main container (280px fixed left)
  │
  ├── <Header>                     # Logo + collapse toggle
  │     └── <CollapseButton />
  │
  ├── <SearchBar>                  # Filter blocks by search term
  │     └── <input type="search" />
  │
  ├── <BlockGroups>                # Scrollable block list
  │     │
  │     ├── <BlockGroup category="Layout">
  │     │     ├── <BlockItem block="gambol/section" />
  │     │     └── <BlockItem block="gambol/container" />
  │     │
  │     ├── <BlockGroup category="Content">
  │     │     ├── <BlockItem block="gambol/heading" />
  │     │     ├── <BlockItem block="gambol/text" />
  │     │     └── <BlockItem block="gambol/button" />
  │     │
  │     └── <BlockGroup category="Design">
  │           └── ...more blocks
  │
  └── <Footer>                     # Version info, settings link
```

### Key Files

| File | Purpose |
|------|---------|
| `GambolSidebar.js` | Root component, manages sidebar state |
| `BlockGroup.js` | Collapsible category with child blocks |
| `BlockItem.js` | Single draggable/clickable block |
| `SearchBar.js` | Real-time block filtering |
| `loader.js` | React mount point, hides Gutenberg UI |

---

## Part 4: Block Registry

### Location
`src/editor/sidebar/block-registry.js`

### Structure

```javascript
// Block categories
export const BLOCK_CATEGORIES = [
  { id: 'layout', label: 'Layout', icon: 'grid', collapsed: false },
  { id: 'content', label: 'Content', icon: 'edit', collapsed: false },
  { id: 'design', label: 'Design', icon: 'brush', collapsed: true },
];

// Block definitions
export const GAMBOL_BLOCKS = [
  {
    name: 'gambol/section',
    title: 'Section',
    description: 'Full-width section container',
    icon: 'layout',
    category: 'layout',
    keywords: ['container', 'wrapper', 'layout'],
    defaultAttributes: {
      padding: { top: '60px', bottom: '60px' },
      backgroundColor: '#ffffff',
    },
    supports: {
      align: ['full', 'wide'],
      html: false,
    },
  },
  // ...more blocks
];

// Preset templates
export const BLOCK_PRESETS = {
  'hero-section': {
    label: 'Hero Section',
    description: 'Full-width hero with heading',
    blocks: [
      {
        name: 'gambol/section',
        attributes: { backgroundColor: '#0a0a0a' },
        innerBlocks: [
          {
            name: 'gambol/container',
            innerBlocks: [
              { name: 'gambol/heading', attributes: { content: 'Welcome' } },
            ],
          },
        ],
      },
    ],
  },
};
```

### Exported Functions

| Function | Description |
|----------|-------------|
| `getAllBlocks()` | Returns all registered Gambol blocks |
| `getBlocksByCategory(cat)` | Filter blocks by category ID |
| `getBlockByName(name)` | Get single block definition |
| `getEnabledBlocks()` | Returns only enabled/visible blocks |
| `getBlockCategories()` | Returns all categories |

---

## Part 5: Default Gutenberg UI Hiding

### Three-Layer Approach

#### Layer 1: PHP Filters (`gambol-builder.php`)

```php
// Restrict to Gambol blocks only
add_filter( 'allowed_block_types_all', function( $allowed, $context ) {
    if ( $context->post && $context->post->post_type === 'page' ) {
        return [
            'gambol/section',
            'gambol/container',
            'gambol/heading',
            'gambol/text',
            'gambol/button',
            'core/image',
            'core/paragraph', // Fallback
        ];
    }
    return $allowed;
}, 10, 2 );

// Hide default categories
add_filter( 'block_categories_all', function( $categories ) {
    return array_filter( $categories, function( $cat ) {
        return strpos( $cat['slug'], 'gambol' ) === 0;
    });
}, 100 );
```

#### Layer 2: CSS (`loader.js` → injected stylesheet)

```css
/* Hide ALL default Gutenberg inserter elements */
.block-editor-inserter,
.block-editor-default-block-appender,
.block-editor-block-list__insertion-point-inserter,
.editor-document-tools__inserter-toggle,
button.components-button.editor-document-bar__command,
.edit-post-header-toolbar__inserter-toggle,
.block-editor-block-list__empty-block-inserter { 
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
}

/* Hide patterns and template panels */
.editor-inserter-sidebar,
.block-editor-inserter__tabs,
.edit-post-sidebar .components-panel:has([class*="pattern"]) {
    display: none !important;
}
```

#### Layer 3: JavaScript (`loader.js` → runtime)

```javascript
// Unregister unwanted block categories at runtime
import { getCategories, setCategories } from '@wordpress/blocks';

const hideUnwantedCategories = () => {
    const categories = getCategories();
    const gambolOnly = categories.filter( 
        cat => cat.slug.startsWith( 'gambol' ) 
    );
    setCategories( gambolOnly );
};

// Disable inserter shortcuts
document.addEventListener( 'keydown', ( e ) => {
    // Block "/" quick inserter
    if ( e.key === '/' ) {
        e.stopPropagation();
        e.preventDefault();
    }
}, true );
```

---

## Part 6: Programmatic Block Insertion

### Hook: `useBlockInserter`

```javascript
import { useBlockInserter } from './sidebar/useBlockInserter';

const MyComponent = () => {
    const {
        insert,                // Insert at position
        insertAfterSelected,   // Insert after current block
        insertAsChild,         // Insert inside selected block
        insertMultiple,        // Insert array of blocks
        insertPreset,          // Insert a template
        duplicateSelected,     // Clone current block
        removeSelected,        // Delete current block
        canInsert,             // Check if insertion allowed
    } = useBlockInserter();

    // Example: Insert a section
    const handleClick = () => {
        const result = insert( 'gambol/section', {
            padding: { top: '80px', bottom: '80px' },
        });
        
        if ( result.success ) {
            console.log( 'Inserted:', result.clientId );
        }
    };

    // Example: Insert a preset
    const addHero = () => {
        insertPreset( 'hero-section' );
    };

    return (
        <button onClick={ handleClick }>Add Section</button>
    );
};
```

### Hook: `useDragDropInserter`

```javascript
import { useDragDropInserter } from './sidebar/useDragDropInserter';

const BlockItem = ({ block }) => {
    const { dragHandlers, isDragging } = useDragDropInserter( block.name );

    return (
        <div
            className={`block-item ${ isDragging ? 'is-dragging' : '' }`}
            { ...dragHandlers }
        >
            <span className="block-icon">{ block.icon }</span>
            <span className="block-title">{ block.title }</span>
        </div>
    );
};
```

### Insertion Methods Summary

| Method | Use Case |
|--------|----------|
| `insert()` | Insert at specific position |
| `insertAfterSelected()` | Insert below current selection |
| `insertAsChild()` | Insert inside a container block |
| `insertMultiple()` | Insert several blocks at once |
| `insertPreset()` | Insert a predefined template |
| `replaceSelected()` | Swap current block with new one |
| `duplicateSelected()` | Clone the selected block |

---

## Part 7: UX & Design Rules

### Color System

```scss
// Dark theme (Sidebar)
$gambol-bg-dark: #121212;
$gambol-bg-surface: #1e1e1e;
$gambol-bg-elevated: #2a2a2a;

// Accent
$gambol-teal: #00d4aa;
$gambol-teal-hover: #00e6b8;
$gambol-teal-dark: #00a88a;

// Text
$gambol-text-primary: #ffffff;
$gambol-text-secondary: rgba(255, 255, 255, 0.7);
$gambol-text-muted: rgba(255, 255, 255, 0.5);

// Borders
$gambol-border: rgba(255, 255, 255, 0.1);
```

### Spacing System

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
```

### Sidebar Dimensions

| Property | Value |
|----------|-------|
| Width (expanded) | 280px |
| Width (collapsed) | 56px |
| Header height | 60px |
| Footer height | 48px |
| Block item height | 48px |
| Icon size | 20px |
| Border radius | 8px |

### Interaction States

```scss
.block-item {
    // Default
    background: transparent;
    
    // Hover
    &:hover {
        background: $gambol-bg-elevated;
        border-color: $gambol-teal;
    }
    
    // Dragging
    &.is-dragging {
        opacity: 0.6;
        border: 2px dashed $gambol-teal;
    }
    
    // Inserted (feedback)
    &.is-inserted {
        animation: insertPulse 0.5s ease;
    }
}
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Blocked (no default inserter) |
| `Ctrl+K` | Open Gambol search |
| `Escape` | Collapse sidebar / deselect |

---

## Part 8: Output Expectation

### What the User Should See

```
┌────────────────────────────────────────────────────────────────┐
│  GAMBOL LEFT SIDEBAR          │        CANVAS                  │
│  (Dark #121212)               │    (Light / Clean)             │
│                               │                                │
│  🔍 Search blocks...          │   ┌────────────────────────┐   │
│                               │   │  SECTION               │   │
│  ▼ LAYOUT                     │   │  ┌──────────────────┐  │   │
│   ◻ Section                   │   │  │   CONTAINER      │  │   │
│   ◻ Container                 │   │  │                  │  │   │
│                               │   │  │  H1 Welcome      │  │   │
│  ▼ CONTENT                    │   │  │                  │  │   │
│   ◻ Heading ←── Click/Drag    │   │  │  Lorem ipsum... │  │   │
│   ◻ Text                      │   │  │                  │  │   │
│   ◻ Button                    │   │  │  [Button]        │  │   │
│                               │   │  └──────────────────┘  │   │
│  ▶ DESIGN (collapsed)         │   └────────────────────────┘   │
│                               │                                │
│  ─────────────────────        │                                │
│  Gambol Builder v1.0          │                                │
└────────────────────────────────────────────────────────────────┘
```

### What Should NOT Be Visible

- ❌ Gutenberg "+" inserter button (top bar)
- ❌ Blue "+" block inserter between blocks
- ❌ Default block category panels
- ❌ Pattern library sidebar
- ❌ Block directory search
- ❌ "/" slash command inserter
- ❌ Default "Start writing or type /" placeholder
- ❌ Any WordPress/Gutenberg branding

### Verification Checklist

- [ ] Left sidebar appears at page load
- [ ] Sidebar has dark theme (#121212 background)
- [ ] Blocks can be searched in real-time
- [ ] Categories are collapsible
- [ ] Click on block → inserts at cursor
- [ ] Drag block → shows drop indicator → drops at position
- [ ] No default Gutenberg inserter visible
- [ ] Canvas shows only Gambol blocks
- [ ] Block inspector works when block selected

---

## Build & Development

### Commands

```bash
# Development (watch mode)
npm run start

# Production build
npm run build

# Create release ZIP
npm run zip

# Lint JavaScript
npm run lint:js

# Lint CSS
npm run lint:css
```

### Key Dependencies

```json
{
  "@wordpress/blocks": "^12.x",
  "@wordpress/block-editor": "^12.x",
  "@wordpress/data": "^9.x",
  "@wordpress/element": "^5.x",
  "@wordpress/hooks": "^3.x",
  "@wordpress/scripts": "^26.x"
}
```

---

## File Quick Reference

| File | Purpose | Lines |
|------|---------|-------|
| `sidebar/GambolSidebar.js` | Main sidebar component | ~260 |
| `sidebar/block-registry.js` | Block definitions + API | ~350 |
| `sidebar/useBlockInserter.js` | Programmatic insertion | ~280 |
| `sidebar/useDragDropInserter.js` | Drag-and-drop logic | ~450 |
| `sidebar/loader.js` | Mount + hide Gutenberg | ~450 |
| `sidebar/sidebar.scss` | Dark theme styles | ~700 |
| `gambol-builder.php` | PHP plugin + filters | ~500 |

---

**Last Updated:** 2024
**Version:** 1.0.0
**Maintained By:** Gambol Builder Team
