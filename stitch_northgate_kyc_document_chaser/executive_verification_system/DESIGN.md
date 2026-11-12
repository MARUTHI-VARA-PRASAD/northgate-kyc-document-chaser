---
name: Executive Verification System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#49607e'
  primary: '#000f22'
  on-primary: '#ffffff'
  primary-container: '#0a2540'
  on-primary-container: '#768dad'
  inverse-primary: '#b0c8eb'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#001210'
  on-tertiary: '#ffffff'
  tertiary-container: '#002a26'
  on-tertiary-container: '#1f9c8f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#b0c8eb'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#314865'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system is tailored for an institutional, executive-ready enterprise fintech environment. It serves compliance directors, MLROs (Money Laundering Reporting Officers), and corporate onboarding analysts who operate high-throughput KYC document verification pipelines.

The aesthetic blends high-precision **Corporate Modernism** with meticulous **Data-Dense Utility**:
- **Demeanor:** Authoritative, unhurried, rigorous, and crystalline.
- **Visual Weight:** Ultra-fine hairline structural outlines, surgical data alignments, and deep contrasting typography over luminous slate-white planes.
- **Emotional Intent:** Instill confidence, procedural integrity, and eliminate friction during high-stakes corporate compliance workflows.

## Colors

The palette relies on institutional banking navies coupled with slate neutrals and deterministic semantic indicators.

- **Primary (`#0A2540` / `#1E3A8A`):** Anchors navigation rails, primary actions, and top-tier metrics. Communicates stability and legal authority.
- **Secondary Slate (`#475569`):** Governs secondary actions, table column headers, and structural UI labels.
- **Tertiary Teal (`#0D9488`):** Applied to secondary success signals, automated ingestion pipelines, and validated metadata badges.
- **Surfaces & Canvases:**
  - Base canvas: `#F8FAFC`
  - Active card & panel surface: `#FFFFFF`
  - Muted structural fills & input troughs: `#F1F5F9`
  - Dividing hairlines: `#E2E8F0`
- **Status Indicators (Non-decorative, semantic only):**
  - Received / Verified: `#059669` (Emerald 600) with `#ECFDF5` wash.
  - In Review / Ingesting: `#0D9488` (Teal 600) with `#F0FDFA` wash.
  - Action Required / Pending: `#D97706` (Amber 600) with `#FFFBEB` wash.
  - Rejected / Expired: `#E11D48` (Rose 600) with `#FFF1F2` wash.

## Typography

The typographic hierarchy pairs **Plus Jakarta Sans** for commanding, balanced executive metrics and structural headers with **Inter** for dense, tabular clarity.

- Numbers and dates in tables must enable tabular lining figures (`font-variant-numeric: tabular-nums`) to maintain strict vertical scanning alignment across transaction and document rows.
- Section overlines, table metadata, and status badges utilize `label-sm` or `label-md` with slight letter spacing and explicit uppercase rendering for instant recognition.

## Layout & Spacing

The system enforces a dense, information-rich 12-column fluid grid tailored to high-resolution desktop terminals, with responsive collapsing for tablet escalations.

- **Grid Architecture:** 12-column layout with 24px (`gutter-desktop`) gutters and 32px (`margin-desktop`) outer padding on desktop screens (1280px+). On smaller tablets and laptop views, gutters scale down to 16px (`gutter`).
- **Data Density Standard:** Compact internal component spacing (`space-xs` to `space-md`) ensures multiple tiers of evidence, document previews, and audit logs fit within the primary operational fold without excessive scrolling.
- **Reflow Rules:** Fixed 260px administrative navigation sidebar on desktop; document verification workspaces utilize a 3-pane model (Navigation, Case Feed, Document Inspection Inspector) collapsing into an overlay drawer pattern below 1024px.

## Elevation & Depth

Visual order is created through **hairline borders and subtle tonal contrast**, deliberately avoiding heavy, imprecise drop shadows.

- **Hairline Division:** Primary elevation tiering is achieved with 1px solid borders (`#E2E8F0`). Cards do not float; they sit seamlessly locked into the structural frame.
- **Ambient Floor Shadows:** For floating elements (modals, dropdown menus, context menus), use sharp, ultra-diffused, cool-tinted elevation:
  - Base Card: `box-shadow: 0 1px 2px 0 rgba(10, 37, 64, 0.04)`
  - Active Dropdown / Flyout: `box-shadow: 0 4px 12px -2px rgba(10, 37, 64, 0.08), 0 2px 4px -1px rgba(10, 37, 64, 0.04)`
  - Modal Tier: `box-shadow: 0 20px 25px -5px rgba(10, 37, 64, 0.12), 0 8px 10px -6px rgba(10, 37, 64, 0.08)`
- **Layering Model:**
  - Layer 0 (Canvas): `#F8FAFC`
  - Layer 1 (Cards, Workspaces): `#FFFFFF`
  - Layer 2 (Inset Wells, Table Row Hovers, Input Backings): `#F1F5F9`

## Shapes

The design uses a **Soft (`1`)** shape language:
- Standard components (buttons, input fields, badges, alerts) use `0.25rem` (4px) corner radii.
- Container elements (cards, modal panels, table wrappers) scale to `rounded-lg` (`0.5rem` / 8px).
- Badges and status pills leverage `rounded-xl` (`0.75rem` / 12px) for clear delineation against square table rows, while never appearing overly rounded or informal.

## Components

### Buttons
- **Primary:** Background `#0A2540`, text `#FFFFFF`, 1px border `#0A2540`. Hover shifts to `#1E3A8A`. Active states scale subtly to 99% scale. Height: 36px (compact) or 40px (default).
- **Secondary:** Background `#FFFFFF`, text `#0A2540`, border 1px solid `#CBD5E1`. Hover shifts background to `#F8FAFC`.
- **Destructive/Expedite:** Specialized alerts use muted fills with dark high-contrast borders rather than neon fills.

### Document Status Chips & Badges
- **Received / Verified:** Fill `#ECFDF5`, text `#059669`, border 1px solid `#A7F3D0`.
- **Missing / Action Required:** Fill `#FFF1F2`, text `#E11D48`, border 1px solid `#FECDD3`.
- **Pending Submission / In Review:** Fill `#FFFBEB`, text `#D97706`, border 1px solid `#FDE68A`.
- **Automated Processing:** Fill `#F0FDFA`, text `#0D9488`, border 1px solid `#99F6E4`.
- Badges feature an optional leading 6px static status dot.

### Tables & Data Lists
- **Header:** Background `#F8FAFC`, uppercase `label-md` text `#475569`, border-bottom 1px solid `#E2E8F0`. Height: 36px.
- **Row:** Background `#FFFFFF`, alternating hover state `#F8FAFC`, border-bottom 1px solid `#F1F5F9`. Height: 44px to maintain dense vertical rhythm.
- **Selection:** Checked state highlights the row with `#F0FDF4` and a 2px left border accent in `#059669`.

### Input Fields & Controls
- **Inputs:** Height: 36px. Background `#FFFFFF`, border 1px solid `#CBD5E1`, text `#0A2540`, placeholder `#94A3B8`. Focus state applies a 1px border `#0A2540` and a 2px outer ring with `#0A2540` at 10% opacity.
- **Checkboxes & Radios:** 16px square/circle with a 1.5px border `#94A3B8`. Checked fill `#0A2540` with an inverted white checkmark icon.

### Segmented Tabs & Cards
- **Tabs:** Underlined editorial style for subviews: active tab has a 2px bottom rule in `#0A2540` and text `#0A2540` (`label-lg`); inactive tabs are `#64748B`. Segmented pill switchers use a `#F1F5F9` tray with a `#FFFFFF` active container.
- **Cards:** Background `#FFFFFF`, border 1px solid `#E2E8F0`, padding 16px or 20px. Card headers feature a distinct bottom border (`#F1F5F9`) separating high-level summary metadata from table content.

### KYC Chaser Specialized Components
- **Chaser SLA Countdown Pill:** Monospace timestamp display showing automated reminder intervals, framed in a `#F8FAFC` pill with an alert amber indicator for approaching deadlines.
- **Document Requirement Checklist:** Multi-tier checklist component pairing file upload drop-targets, instant PDF metadata extraction chips, and override approval triggers for AML officers.