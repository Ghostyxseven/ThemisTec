---
status: final
colors:
  primary: "#1E293B"
  secondary: "#0F172A"
  accent: "#8B5CF6"
  background: "#F8FAFC"
  surface: "#FFFFFF"
  textPrimary: "#0F172A"
  textSecondary: "#64748B"
  border: "#E2E8F0"
typography:
  fontFamily: "'Inter', sans-serif"
  fontSizes:
    small: "12px"
    body: "14px"
    large: "16px"
    h3: "20px"
    h2: "24px"
    h1: "32px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  buttonPrimary:
    background: "{colors.accent}"
    color: "#FFFFFF"
    borderRadius: "{rounded.lg}"
    padding: "{spacing.sm} {spacing.md}"
    hover: "brightness(1.1)"
    transition: "all 0.2s ease-in-out"
---
# ThemisTec: Design System

## Brand & Style
ThemisTec is a modern legal tech platform. The brand exudes trust, clarity, and modern elegance. We move away from the traditional dusty-book aesthetic of law firms and embrace a "Tech-Forward, Premium" look. 
- **Keywords:** Trustworthy, Modern, Minimalist, Premium, Glassmorphism.
- **Vibe:** Similar to high-end modern SaaS platforms (like Vercel or Linear).

## Colors
We use a refined dark blue/slate palette as the core, accented by a vibrant purple for CTAs and highlights.
- **Primary/Brand:** Slate 800 (`#1E293B`)
- **Accent/Action:** Violet 500 (`#8B5CF6`) - Used for primary buttons and focus states.
- **Backgrounds:** Slate 50 (`#F8FAFC`) for the app background, crisp White (`#FFFFFF`) for cards and elevated surfaces.

## Typography
- **Primary Font:** Inter (Google Fonts)
- Weights: 400 (Regular) for body text, 500 (Medium) for buttons and tabs, 600 (SemiBold) and 700 (Bold) for headings.

## Layout & Spacing
- Use a generous amount of whitespace to create a clean, uncluttered interface.
- Standard container max-width: 1200px.
- Use an 8pt grid system.

## Elevation & Depth
- Rely on subtle, soft shadows for cards (`0 4px 6px -1px rgb(0 0 0 / 0.1)`).
- For prominent elements (like modals or floating menus), use glassmorphism effects (backdrop-blur combined with a semi-transparent white background).

## Shapes
- Soft corners are standard. `rounded-xl` (12px) or `rounded-2xl` (16px) for major cards, inputs, and buttons. No sharp edges.

## Components
- **Buttons:** Vibrant accent color with subtle glow shadows. On hover, apply a slight upward translate (micro-animation).
- **Inputs:** Thick, soft borders (`border-slate-200`) with a subtle inner shadow, focusing into a vibrant ring.
- **Tables:** Clean lines, ample padding, rounded corners for the outer container. No harsh borders between rows, use subtle dividers or zebra striping with ultra-light slate.

## Do's and Don'ts
- **DO** use micro-animations (e.g., scale on active, translate on hover) to make the UI feel alive.
- **DO** use glassmorphism sparingly for overlays.
- **DON'T** use default browser styles for inputs.
- **DON'T** use harsh blacks (`#000000`). Always use rich, dark slates (`#0F172A`).
