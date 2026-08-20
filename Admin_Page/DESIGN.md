---
name: Industrial Precision
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdb'
  on-secondary-container: '#63635f'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#171e00'
  on-tertiary-container: '#7d8952'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e4e2dd'
  secondary-fixed-dim: '#c8c6c2'
  on-secondary-fixed: '#1b1c19'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#dbe9a9'
  tertiary-fixed-dim: '#bfcd8f'
  on-tertiary-fixed: '#171e00'
  on-tertiary-fixed-variant: '#404b1b'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 32px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  section-gap: 48px
---

## Brand & Style

The design system focuses on high-utility warehouse management, where clarity and speed of recognition are paramount. The aesthetic is **High-Contrast Minimalism**, drawing inspiration from industrial labeling and modernist editorial design. It prioritizes information density without sacrificing legibility.

The brand personality is authoritative, organized, and intentional. By utilizing a "Cream on Charcoal" and "Charcoal on Cream" approach, the UI reduces eye strain during long shifts while maintaining a sophisticated, high-fidelity atmosphere. The emotional response should be one of control, reliability, and precision.

## Colors

The palette is anchored by a high-contrast relationship between **Deep Charcoal (#121212)** and **Creamy Off-White (#F9F7F2)**. This inverted approach—using the dark tone for primary UI elements and the light tone for backgrounds—creates a premium, "ink-on-paper" feel.

- **Primary**: Used for text, iconography, and high-emphasis borders.
- **Secondary (Surface)**: The foundational background color to reduce harsh glares.
- **Accents**: 
    - **Olive Green**: Indicates "In Stock" or "Completed" status.
    - **Muted Amber**: Indicates "Low Stock" or "Pending" status.
    - **Slate Grey**: Used for historical data, archived logs, and disabled states.

## Typography

This design system uses **Inter** for its exceptional legibility in data-heavy environments. The hierarchy is strictly enforced to ensure that SKU numbers and stock counts are the most visible elements.

- **Data Legibility**: Use `data-mono` (tabular figures) for all numerical values in tables to ensure columns align perfectly for quick scanning.
- **Information Architecture**: `label-caps` should be used for table headers and section overlines to provide clear categorization without competing with the primary data.
- **Contrast**: Headings should always be the primary charcoal color, while secondary body text can use a 70% opacity variant of the primary color.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** with generous outer margins to frame the content. 

- **Data Tables**: Should span the full width of their containers. Use a "Comfortable" vertical padding (16px) for rows by default, with a "Compact" toggle (8px) for high-density inventory views.
- **Grid Rhythm**: All spacing must be multiples of 4px. Use `stack-md` for spacing between form fields and `section-gap` between distinct logical blocks (e.g., Inventory Chart vs. Stock List).
- **Mobile Adaptation**: On mobile devices, the 12-column grid collapses to a single column. Horizontal padding is reduced to 16px to maximize screen real estate for data tables.

## Elevation & Depth

To maintain the minimalist aesthetic, depth is communicated through **low-contrast outlines** and **tonal layering** rather than traditional shadows.

- **Surfaces**: The base layer is the creamy off-white. Secondary surfaces (like cards or sidebars) use a subtle 1px solid border (#121212 at 10% opacity).
- **Active States**: Elements that are hovered or selected gain a slightly heavier border (2px) or a subtle tonal shift to a slightly lighter cream (#FFFFFF).
- **Modals**: For high-priority interruptions, use a 4px hard "drop shadow" (0% blur) in the primary charcoal color to create a brutalist, physical layering effect.

## Shapes

The shape language is **Soft** and structured. A consistent `0.25rem` (4px) radius is applied to almost all UI components to retain a professional, architectural feel.

- **Standard Elements**: Buttons, Input Fields, and Cards use the `rounded-md` (4px) setting.
- **Badges**: Status chips for stock levels (In Stock, Low Stock) use a more aggressive `rounded-xl` (12px) to differentiate them from functional buttons.
- **Search Bars**: Use a `rounded-lg` (8px) to soften the entry point of the interface.

## Components

### Buttons
- **Primary**: Cream background (#FCFBF7) with Deep Charcoal (#121212) text and a 1px charcoal border. This provides a tactile, high-contrast look.
- **Secondary**: Ghost style with 1px charcoal border and charcoal text. 

### Data Tables
- Header cells use `label-caps` typography with a subtle bottom border.
- Alternate row striping is discouraged; use 1px horizontal dividers instead to maintain a clean "ledger" look.

### Input Fields
- Solid cream background with a 1px charcoal border. 
- Focus state: Border weight increases to 2px; no glow or shadow.

### Status Badges
- Small, uppercase text. Backgrounds use the accent colors (Olive, Amber, Slate) at 15% opacity with 100% opacity text of the same hue to ensure legibility while remaining subtle.

### Cards
- No shadows. Use a 1px border (#121212 at 10% opacity).
- Padding should follow `stack-lg` (24px) to ensure content within the warehouse system doesn't feel cramped.