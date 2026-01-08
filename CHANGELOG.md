# Changelog

All notable changes to Gambol Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release of Gambol Builder
- **Core Blocks**
  - Section block with advanced layout controls
  - Container block with width variants
  - Heading block with typography controls
  - Text/Paragraph block with rich formatting
  - Button block with multiple styles and variants
- **Global Styles System**
  - Centralized design token management
  - CSS custom properties output
  - Color palette management
  - Typography scale controls
  - Spacing and container settings
- **Header & Footer Builder**
  - Custom post type for headers/footers
  - Conditional display logic (entire site, specific pages, singular, archives)
  - Template override system
  - Support for transparent headers
  - Sticky header functionality
- **Demo Importer**
  - One-click demo content import
  - Supports posts, pages, and custom post types
  - Media import with proper attribution
  - Template import support
  - Progress indicator during import
- **Performance Optimization**
  - Conditional CSS loading (only load styles for used blocks)
  - Critical CSS extraction and inlining
  - Lazy loading for images and iframes
  - Asset concatenation and minification
  - Preloading for critical resources
  - Local font hosting support
- **Theme Integration**
  - Automatic theme detection
  - Compatible with most WordPress themes
  - Layout configuration per theme
  - Template override system (Canvas, Full-Width, Boxed)
  - Custom hook locations for developers
  - Editor color palette sync

### Developer Features
- Clean, well-documented PHP code following WordPress coding standards
- No jQuery dependency - pure vanilla JavaScript
- Proper namespace (`GambolBuilder`)
- Singleton pattern for all major classes
- Extensive action and filter hooks for customization
- REST API endpoints for headless usage
- Full compatibility with WordPress 6.0+
- PHP 7.4+ support with modern language features

### Security
- All inputs sanitized with appropriate functions
- All outputs properly escaped
- Nonce verification on all forms and AJAX requests
- Capability checks on all sensitive operations
- Secure REST API endpoints with permission callbacks

### Internationalization
- Full translation-ready with text domain `gambol-builder`
- POT file included in `/languages` directory
- RTL stylesheet support

---

## Upgrade Notice

### 1.0.0
Initial release. Welcome to Gambol Builder!
