---
name: Aureate Editorial
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#585f6c'
  on-secondary: '#ffffff'
  secondary-container: '#dce2f3'
  on-secondary-container: '#5e6572'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838483'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#dce2f3'
  secondary-fixed-dim: '#c0c7d6'
  on-secondary-fixed: '#151c27'
  on-secondary-fixed-variant: '#404754'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c7c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: ebGaramond
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: ebGaramond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: ebGaramond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
  headline-md:
    fontFamily: ebGaramond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  body-lg:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 32px
  margin-mobile: 24px
  margin-desktop: 64px
  section-gap: 128px
---

## Brand & Style
The design system embodies a "High-End Editorial Apple" aesthetic, merging the meticulous layout of premium print journalism with the sleek, functional minimalism of modern hardware interfaces. It targets a mature audience that values clarity, intentionality, and quiet luxury.

The style is a hybrid of **Minimalism** and **Glassmorphism**, leaning heavily into "negative space as a feature." The UI should feel like a digital gallery: curated, expensive, and calm. Emotional responses should range from focused serenity to intellectual confidence. Avoid all unnecessary ornamentation, gradients, or heavy drop shadows in favor of structural integrity and typographic excellence.

## Colors
This design system utilizes a near-monochrome palette to maintain an editorial focus. 

- **Primary & Text:** Use Deep Slate (`#1A1A1A`) for all primary headings and body text to ensure maximum legibility against soft backgrounds.
- **Backgrounds:** The interface relies on "Off-White" (`#F9F9F8`) and pure White (`#FFFFFF`) to create subtle layering without harsh transitions.
- **Accents:** A single, muted Sage-Slate (`#4A5D50`) is reserved strictly for critical call-to-actions or active states. It should be used sparingly to maintain its significance.
- **Overlays:** Use semi-transparent whites (60-80% opacity) for glassmorphic surfaces to allow background content to ghost through subtly.

## Typography
The typographic hierarchy is the backbone of the editorial feel. It relies on the high-contrast pairing of a classical Serif and a utilitarian Sans.

- **Headlines:** Use **EB Garamond** for all display and headline roles. This introduces a literary, sophisticated tone. Use tighter letter-spacing for large display sizes to maintain a "locked-in" editorial look.
- **Body & UI:** Use **Inter** for all functional text, body copy, and UI labels. It provides the "Apple-esque" precision and modern contrast required for high legibility.
- **Labels:** Small labels should use Inter with a medium or semi-bold weight and slight letter spacing to differentiate them from prose.

## Layout & Spacing
The layout philosophy is defined by "The Luxury of Space." Every element must be granted significant margins to prevent visual clutter.

- **Grid:** A 12-column fixed grid for desktop (centered) with a generous 1200px max-width.
- **Whitespace:** Use `section-gap` (128px) to separate major content blocks. Vertical rhythm should feel loose and airy.
- **Alignment:** Lean toward asymmetrical layouts for editorial sections, but maintain strict baseline alignment for functional UI components.
- **Mobile:** Transition to a single-column flow with 24px side margins, ensuring Serif headlines scale down significantly to avoid awkward line breaks.

## Elevation & Depth
Depth is communicated through material properties rather than traditional shadows.

- **Glassmorphism:** Use high backdrop-blur values (20px to 40px) on navigation bars and floating modals. Add a 0.5px white inner border to simulate a "specular edge" reflection.
- **Tonal Layering:** Surfaces are differentiated by slight shifts in saturation or brightness (e.g., a white card on an off-white background).
- **Shadows:** If used, shadows must be "ambient" and nearly invisible—low opacity (4-8%), large blur radius, and no offset, creating a soft lift rather than a directional light source.

## Shapes
The shape language is "Soft" yet disciplined. While Apple often uses high squircles, this design system uses more conservative radii to maintain a professional, editorial structure.

- **Base Radius:** 4px (0.25rem) for small components like inputs and checkboxes.
- **Large Radius:** 8px (0.5rem) for cards and main containers.
- **Pills:** Only used for tags or status indicators to provide a soft counterpoint to the rigid grid.

## Components
- **Buttons:** Primary buttons use the accent color with white text. Secondary buttons are transparent with a 1px slate border at 10% opacity. Label text should be Inter Semi-bold.
- **Input Fields:** Minimalist design with only a bottom border (1px, 20% opacity) or a very light gray filled background. Focus states use a subtle 1px slate border.
- **Cards:** No heavy shadows. Use 1px borders at 5%–10% black opacity. The background should be a glassmorphic blur or a flat white.
- **Chips/Tags:** Small, rectangular with a 2px radius. Use the off-white background with primary slate text.
- **Lists:** High row heights (minimum 64px) with thin horizontal separators. 
- **Modals:** Floating centered containers with high backdrop blur on the page content below, creating a sense of focused immersion.