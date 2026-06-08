---
name: Library Administration Logic
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#00524b'
  on-tertiary: '#ffffff'
  tertiary-container: '#006c63'
  on-tertiary-container: '#81eddf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
---

## Brand & Style

This design system is built for administrative precision and effortless information retrieval. The brand personality is professional, authoritative, yet inviting—balancing the quiet focus of a library with the modern efficiency of a high-performance enterprise tool.

The visual style is **Corporate / Modern**, characterized by generous whitespace, a structured information hierarchy, and a sophisticated color palette that supports long-duration usage. The interface prioritizes clarity and density, ensuring that librarians and administrators can manage complex catalogs and member data without cognitive fatigue. The aesthetic is "Invisible UI"—where the interface recedes to let the data and content take center stage.

## Colors

The color strategy uses a refined palette to denote hierarchy and system status. The **Primary Indigo** serves as the main interactive signal, used for primary actions and brand presence. **Secondary Blue** is utilized for informational accents and secondary navigation, while **Community Teal** is reserved for success states, member-related growth metrics, or positive inventory status. **Alert Red** is used sparingly for critical errors and overdue notifications.

This design system supports a native adaptive color mode. In **Light Mode**, the interface uses a cool gray canvas to reduce glare. In **Dark Mode**, deep zinc tones provide high contrast for text while maintaining a professional, non-stark appearance. Neutral tokens are mapped to ensure consistent legibility across both modes, with borders providing subtle structural definition rather than heavy visual weight.

## Typography

The typography system pairs **Plus Jakarta Sans** for headings with **Inter** for body and UI elements. Plus Jakarta Sans provides a friendly, modern character for page titles and section headers, while Inter offers maximum legibility for data-dense tables and administrative forms.

A strict vertical rhythm is maintained through standardized line heights. Labels and small body text utilize a slightly tighter line height for compact UI components, whereas longer-form descriptions use a more generous 1.6 ratio to improve readability. Letter spacing is slightly decreased for large headlines to maintain visual tension and increased for uppercase labels to ensure clarity at small sizes.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop to ensure content remains readable on ultra-wide monitors, transitioning to a fluid model for tablet and mobile devices. 

The 12-column grid provides the flexibility needed for complex dashboards where sidebars, main content areas, and auxiliary information panels coexist. Spacing is based on a 4px baseline grid, encouraging consistent alignment. Standardized gutters of 24px provide enough breathing room for data-heavy layouts. On mobile devices, the margins reduce to 16px and the grid collapses to a single-column stack, ensuring that touch targets remain accessible and text remains legible.

## Elevation & Depth

Hierarchy in this design system is established through **Tonal Layers** and **Ambient Shadows**. The canvas provides the lowest level of the environment, with surfaces (cards and modals) appearing to "float" slightly above it.

Shadows are minimalist and soft, using a multi-layered approach with very low opacity (typically 4-8%) to avoid a muddy appearance. In Dark Mode, elevation is communicated primarily through lighter surface fills rather than shadows, as shadows are physically less visible on dark backgrounds. Interactive elements like buttons utilize a subtle "lift" effect on hover, increasing the shadow spread slightly to provide tactile feedback.

## Shapes

The shape language reflects the modern, approachable nature of the brand. This design system utilizes a tiered corner radius system to differentiate between structural containers and interactive elements. 

Large-scale containers, such as dashboard cards and main content blocks, use a pronounced **24px radius** to soften the overall layout. Interactive components require a tighter, more precise look: primary buttons use a **12px radius**, while text inputs and smaller controls use an **8px radius**. This variation creates a clear visual distinction between "frames" (the layout) and "tools" (the interactions).

## Components

### Buttons
Buttons are the primary drivers of action. Primary buttons use the Indigo fill with white text. Secondary buttons use a subtle Border token with Primary Text. The "12px" radius is strictly applied here.

### Inputs & Selects
Form fields use the **8px radius** and a 1px border. In focus states, the border shifts to the Primary Indigo with a soft outer glow (2px spread) to ensure accessibility. Labels are always positioned above the input for clarity in enterprise workflows.

### Cards
Cards are the foundational building blocks of the dashboard. They must use the **24px radius**, the Surface color, and the defined minimalist drop shadow. Padding within cards should be a minimum of 24px (lg) to maintain the "clean" visual direction.

### Chips & Tags
Used for book categories or status (e.g., "Available", "Overdue"). These utilize a pill-shape (fully rounded) and high-contrast background tints from the Secondary or Community palettes.

### Lists & Data Tables
Tables should feature a subtle border-bottom between rows using the Border token. Header rows should use the `label-md` typography style for clear distinction. Row height should be generous (min-height 56px) to maintain the organized feel.