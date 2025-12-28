# MDD Color Palette Documentation

This document describes the custom color palette for the MDD (Monde de Dév) application, based on the Figma design analysis.

## Color System Overview

The MDD color system is built around a purple primary color with supporting secondary grays, accent colors, and semantic colors for different UI states.

## Primary Colors (Purple Theme)

The primary purple color is the main brand color used for buttons, links, and active states.

```css
/* Primary Purple Scale */
primary-50   #f3f0ff  /* Very light purple for backgrounds */
primary-100  #e9e2ff  /* Light purple for hover states */
primary-200  #d6ccff  /* Lighter purple */
primary-300  #b8a5ff  /* Light purple */
primary-400  #9575ff  /* Medium light purple */
primary-500  #7c3aed  /* Base purple (Figma: #7C3AED) */
primary-600  #6b46c1  /* Main brand purple (Figma: #6B46C1) */
primary-700  #5b21b6  /* Dark purple for hover states */
primary-800  #4c1d95  /* Darker purple */
primary-900  #3c1361  /* Very dark purple */
primary-950  #2e1065  /* Darkest purple */
```

## Secondary Colors (Gray Scale)

Used for text, borders, backgrounds, and neutral UI elements.

```css
/* Secondary Gray Scale */
secondary-50   #fafafa  /* Almost white */
secondary-100  #f5f5f5  /* Card backgrounds (Figma: #F5F5F5) */
secondary-200  #e5e5e5  /* Light borders */
secondary-300  #d4d4d4  /* Input borders */
secondary-400  #a3a3a3  /* Disabled text */
secondary-500  #737373  /* Secondary text */
secondary-600  #525252  /* Body text */
secondary-700  #404040  /* Dark text */
secondary-800  #262626  /* Heading text */
secondary-900  #171717  /* Very dark text */
secondary-950  #0a0a0a  /* Black text */
```

## Accent Colors

Additional purple variations for special UI elements.

```css
/* Accent Purple Scale */
accent-500  #a855f7  /* Bright accent purple */
accent-600  #9333ea  /* Main accent purple */
accent-700  #7e22ce  /* Dark accent purple */
```

## Semantic Colors

### Danger/Error Colors
Used for error states, delete actions, and warnings.

```css
danger-500  #ef4444  /* Base danger color */
danger-600  #dc2626  /* Main danger color (logout, delete) */
danger-700  #b91c1c  /* Dark danger color */
```

### Success Colors
Used for success states and positive feedback.

```css
success-500  #22c55e  /* Base success color */
success-600  #16a34a  /* Main success color */
success-700  #15803d  /* Dark success color */
```

## MDD Brand Colors (Quick Reference)

For easy reference, specific brand colors are available:

```css
--color-mdd-purple: #6b46c1         /* Main brand purple */
--color-mdd-purple-light: #7c3aed   /* Light brand purple */
--color-mdd-purple-dark: #5b21b6    /* Dark brand purple */
--color-mdd-gray: #f5f5f5           /* Card background gray */
--color-mdd-gray-dark: #e5e5e5      /* Border gray */
--color-mdd-text: #000000           /* Primary text */
--color-mdd-text-secondary: #737373 /* Secondary text */
--color-mdd-danger: #dc2626         /* Danger/logout color */
```

## Usage Examples

### TailwindCSS Classes

```html
<!-- Primary button -->
<button class="bg-primary-600 hover:bg-primary-700 text-white">Subscribe</button>

<!-- Secondary button -->
<button class="bg-secondary-100 hover:bg-secondary-200 text-secondary-800">Cancel</button>

<!-- Danger button (logout) -->
<button class="bg-danger-600 hover:bg-danger-700 text-white">Se déconnecter</button>

<!-- Card component -->
<div class="bg-white border border-secondary-200 rounded-lg p-6">
  <h3 class="text-secondary-900 font-bold">Article Title</h3>
  <p class="text-secondary-600">Article description...</p>
</div>

<!-- Input field -->
<input class="border border-secondary-300 focus:ring-2 focus:ring-primary-500" />
```

### Utility Classes

Pre-defined utility classes are available for common patterns:

```html
<!-- Buttons -->
<button class="btn-primary">Primary Action</button>
<button class="btn-secondary">Secondary Action</button>
<button class="btn-danger">Delete</button>

<!-- Cards -->
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <p>Card content...</p>
</div>

<!-- Input fields -->
<input class="input-field" placeholder="Enter text..." />

<!-- Text colors -->
<h1 class="text-primary">Primary heading</h1>
<p class="text-secondary">Secondary text</p>

<!-- Background -->
<div class="bg-mdd-surface">Surface background</div>
```

## Design Principles

1. **Primary Purple**: Use for main actions, active states, and brand elements
2. **Secondary Gray**: Use for text hierarchy, borders, and neutral elements
3. **Danger Red**: Reserve for destructive actions and error states
4. **Success Green**: Use for positive feedback and success states
5. **Consistent Spacing**: Use 8px grid system for consistent spacing
6. **Accessibility**: Ensure sufficient contrast ratios for text readability

## Figma Design Mapping

- **Navigation active state**: `primary-600` (#6B46C1)
- **Subscribe buttons**: `primary-600` (#6B46C1)
- **Card backgrounds**: `secondary-100` (#F5F5F5)
- **Text primary**: `secondary-900` (#171717)
- **Text secondary**: `secondary-500` (#737373)
- **Logout text**: `danger-600` (#DC2626)
- **Input focus**: `primary-500` (#7C3AED)

## Browser Support

This color system uses CSS custom properties and is supported in all modern browsers. For older browser support, consider using PostCSS plugins to generate fallback values.
