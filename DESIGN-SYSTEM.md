# Gambol Builder Design System

A premium, calm, developer-friendly visual identity for Gambol Builder.

## Design Principles

- **Fast, not flashy** - UI should feel responsive and snappy
- **Familiar but original** - Intuitive patterns with unique visual identity
- **Developer-friendly** - Clear, readable, accessible
- **Commercial SaaS quality** - Premium feel suitable for paid product

---

## Color System

### Brand Accent: Teal (#00d4aa)

Unique accent that's NOT blue - calm, professional, stands out without being aggressive.

| Token | Value | Usage |
|-------|-------|-------|
| `$gambol-accent` | `#00d4aa` | Primary accent, CTAs, active states |
| `$gambol-accent-hover` | `#00b894` | Hover states |
| `$gambol-accent-active` | `#009977` | Active/pressed states |
| `$gambol-accent-muted` | `rgba(0, 212, 170, 0.15)` | Backgrounds, badges |
| `$gambol-accent-subtle` | `rgba(0, 212, 170, 0.08)` | Subtle highlights |

### Dark UI Base (#121212 – #1c1c1c)

Premium dark theme optimized for long editing sessions.

| Token | Value | Usage |
|-------|-------|-------|
| `$gambol-sidebar-bg` | `#121212` | Primary background |
| `$gambol-sidebar-secondary` | `#1c1c1c` | Cards, panels, elevated surfaces |
| `$gambol-sidebar-tertiary` | `#2d2d2d` | Modals, dropdowns |
| `$gambol-sidebar-elevated` | `#363636` | Highly elevated elements |

### Text Hierarchy

Clear hierarchy with accessible contrast ratios (WCAG AA/AAA).

| Token | Value | Contrast | Usage |
|-------|-------|----------|-------|
| `$gambol-text-primary` | `#ffffff` | AAA | Primary text, headings |
| `$gambol-text-secondary` | `#b0b0b0` | AA | Secondary text, descriptions |
| `$gambol-text-muted` | `#707070` | Decorative | Labels, placeholders |
| `$gambol-text-disabled` | `#4a4a4a` | - | Disabled states |

### Muted Borders

Subtle separation without harsh lines.

| Token | Value | Usage |
|-------|-------|-------|
| `$gambol-border-subtle` | `rgba(255, 255, 255, 0.06)` | Barely visible |
| `$gambol-border` | `rgba(255, 255, 255, 0.10)` | Standard separators |
| `$gambol-border-strong` | `rgba(255, 255, 255, 0.16)` | Emphasized borders |
| `$gambol-border-light` | `#383838` | Solid light border |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `$gambol-success` | `#22c55e` | Success states |
| `$gambol-warning` | `#eab308` | Warning states |
| `$gambol-error` | `#ef4444` | Error states |
| `$gambol-info` | `#3b82f6` | Info states |

---

## Spacing System

Base unit: **4px**

| Token | Value | Usage |
|-------|-------|-------|
| `$space-xs` | `4px` | Tight spacing |
| `$space-sm` | `8px` | Default gap |
| `$space-md` | `12px` | Comfortable padding |
| `$space-lg` | `16px` | Section padding |
| `$space-xl` | `20px` | Intermediate |
| `$space-2xl` | `24px` | Large sections |
| `$space-3xl` | `32px` | Major sections |

---

## Typography

### Font Stacks

System fonts for maximum performance and native feel.

```scss
$font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
              Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;

$font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, 
            Consolas, "Liberation Mono", monospace;
```

**No decorative fonts** - keep it professional.

### Font Sizes

Clear hierarchy for UI elements.

| Token | Value | Usage |
|-------|-------|-------|
| `$font-size-2xs` | `10px` | Labels, badges |
| `$font-size-xs` | `11px` | Secondary labels |
| `$font-size-sm` | `12px` | Default UI text |
| `$font-size-base` | `13px` | Body text |
| `$font-size-md` | `14px` | Emphasized text |
| `$font-size-lg` | `16px` | Subheadings |
| `$font-size-xl` | `18px` | Section titles |
| `$font-size-2xl` | `20px` | Page titles |

### Font Weights

| Token | Value |
|-------|-------|
| `$font-weight-normal` | `400` |
| `$font-weight-medium` | `500` |
| `$font-weight-semibold` | `600` |
| `$font-weight-bold` | `700` |

---

## Component Styles

### Border Radius (6-10px sweet spot)

Soft, modern corners without being overly round.

| Token | Value | Usage |
|-------|-------|-------|
| `$radius-sm` | `4px` | Small elements, badges |
| `$radius-md` | `6px` | Buttons, inputs |
| `$radius-lg` | `8px` | Cards, panels |
| `$radius-xl` | `10px` | Modals, large cards |
| `$radius-full` | `9999px` | Pills, avatars |

### Shadows (Subtle Only)

Avoid heavy drop shadows.

| Token | Value | Usage |
|-------|-------|-------|
| `$shadow-sm` | `0 2px 4px rgba(0, 0, 0, 0.3)` | Subtle elevation |
| `$shadow-md` | `0 4px 12px rgba(0, 0, 0, 0.4)` | Cards, panels |
| `$shadow-lg` | `0 8px 24px rgba(0, 0, 0, 0.5)` | Modals, popovers |
| `$shadow-focus` | `0 0 0 3px rgba(0, 212, 170, 0.4)` | Focus rings |

### Transitions (Smooth, Not Flashy)

| Token | Value | Usage |
|-------|-------|-------|
| `$transition-instant` | `50ms ease-out` | Immediate feedback |
| `$transition-fast` | `100ms ease-out` | Hover states |
| `$transition-base` | `150ms ease-out` | Default animations |
| `$transition-slow` | `300ms ease-in-out` | Complex animations |

---

## Icon Strategy

### Lucide-Style Icons

- **Base size**: 24px
- **Stroke width**: 1.5px
- **Style**: Outline, consistent stroke width

| Token | Value | Usage |
|-------|-------|-------|
| `$icon-size-xs` | `14px` | Inline icons |
| `$icon-size-sm` | `16px` | Small icons |
| `$icon-size-md` | `20px` | Default icons |
| `$icon-size-lg` | `24px` | Large icons |
| `$icon-stroke` | `1.5px` | Consistent stroke |

### Rules

- ✅ Custom SVG or Lucide-style icons
- ❌ No Elementor icons
- ✅ Consistent stroke width across all icons
- ✅ Monochrome, using `currentColor`

---

## Layout

### Component Sizes

| Token | Value | Usage |
|-------|-------|-------|
| `$control-height-sm` | `28px` | Compact controls |
| `$control-height` | `32px` | Default controls |
| `$control-height-lg` | `36px` | Large controls |
| `$input-height` | `36px` | Text inputs |
| `$sidebar-width` | `320px` | Inspector sidebar |

### Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `$z-base` | `0` | Base layer |
| `$z-dropdown` | `100` | Dropdowns |
| `$z-sticky` | `200` | Sticky elements |
| `$z-overlay` | `300` | Overlays |
| `$z-modal` | `400` | Modals |
| `$z-popover` | `500` | Popovers |
| `$z-tooltip` | `600` | Tooltips |

---

## File Structure

```
src/
├── styles/
│   ├── _design-system.scss      # Master design system tokens
│   └── _variables.scss          # CSS custom property mappings
├── components/
│   └── inspector/
│       └── styles/
│           ├── _variables.scss  # Inspector-specific tokens
│           └── sidebar.scss     # Inspector styles
└── admin/
    └── styles/
        └── admin.scss           # Admin page styles
```

---

## Usage

### In SCSS Files

```scss
@use './variables' as *;

.my-component {
  background: $gambol-sidebar-secondary;
  color: $gambol-text-primary;
  padding: $space-lg;
  border-radius: $radius-md;
  transition: $transition-base;
}
```

### Mixins

```scss
// Focus ring
@include focus-ring;

// Input base styles
@include input-base;

// Button base styles
@include button-base;

// Card container
@include card;

// Smooth transition
@include smooth-transition(background-color);
```

---

## Accessibility

- All text colors meet WCAG AA contrast ratios
- Primary text (#ffffff on #121212) meets AAA
- Focus states use visible ring (3px accent shadow)
- Interactive elements have clear hover states
- Disabled states maintain legibility

---

## Version

**Design System v2.0.0**

Last updated: January 2026
