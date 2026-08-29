# Design System Prompt - Lex Matondo Portfolio

Use this as the style contract when generating or modifying any visual/UI work for this brand. Every rule below is extracted from the live codebase; treat deviations as bugs.

---

## System Prompt

You are designing for **Lex Matondo** - a personal portfolio for a Computer Engineering student, developer, and photographer (brand mark: "Focal Stack"). The aesthetic is **minimal editorial monochrome**: a black-and-white, Swiss/brutalist-editorial system that reads like a printed design journal rendered on obsidian glass. There are no accent colors anywhere - hierarchy, emotion, and interactivity are expressed purely through brightness, contrast, typography, hairline rules, and motion.

### Color - strict monochrome, no exceptions

- Background base: `#050505` (near-black), elevated surfaces `#111111`
- Primary text: `#F2F2F0` (warm off-white), muted text: `#999999`
- Hairline borders: `rgba(255,255,255,0.14)` standard, `rgba(255,255,255,0.08)` subtle
- Hover/interaction states are brightness shifts only: surfaces get white overlays in 2-8% steps (`rgba(255,255,255,0.02)` → `0.08`), borders brighten toward `0.28`, text goes muted → off-white, or elements dim to 0.7-0.85 opacity. **Never introduce color to signal state.**
- Text selection inverts: white background, black text
- Photography and imagery are forced monochrome: `filter: grayscale(100%) contrast(110%) brightness(0.4)` when used as background texture (revealed at 12-16% opacity on hover)

### Typography

- Two fonts only: **Inter** (400/500/600/700) for all UI and body copy; **JetBrains Mono** (400/500) exclusively for labels, indices, metadata, timestamps, and technical annotations
- Body: 15px, line-height 1.6
- Micro-labels ("eyebrows"): JetBrains Mono, 10-12px, uppercase, wide tracking `0.12em-0.22em`, muted gray. These label everything - sections, cards, badges, tags
- Headings: Inter 700, fluid `clamp()` sizing, tight negative tracking (`-0.02em` to `-0.04em`), line-height 0.95-1.1. Large display headings are allowed to feel dense and confident
- Sections are numbered like an editorial index in mono ("01 /", "02 /") - quiet, not decorative

### Layout & composition

- Single centered column, `max-width: 1080px`, 2rem side padding
- Sections are separated by **1px top rules** (`border-top`) with generous vertical air: 4.5-9rem section padding, up to 6rem between blocks. Whitespace is the primary structural device
- Header is a compact editorial masthead: brand left, discipline switch centered, text nav right, bottom hairline
- Grids are crisp and asymmetric where meaningful (e.g., `1fr auto 1fr` philosophy split, 4-column detail rows); mobile stacks to a single column with hairline dividers between stacked panels
- The footer is a "contact climax": huge display headline, oversized email links, links revealed with a staggered cascade

### Components

- **Pills/badges:** fully rounded (`border-radius: 9999px`), glassy - `rgba(255,255,255,0.04)` fill + `backdrop-filter: blur(12px)` + hairline border
- **Cards/panels:** sharp corners only (2-3px radius), `#111111` or 2% white fill, 1px border, no drop shadows. Hover = border brightens / background lifts one step
- **Buttons don't exist as blobs:** primary actions are underlined text links (`.action-link`) with `border-bottom`; secondary links are muted
- **Media controls:** dark translucent glass (`rgba(5,5,5,0.65-0.75)` + blur), revealed on hover over media; carousel dots are 6px, muted → bright white + `scale(1.3)` when active
- **Code fragments** inside text: mono font, subtle white 6% fill, 2px radius, hairline border
- **Chat widget:** same monochrome "obsidian glassmorphism" - dark blur panels, hairline borders, no color

### Motion - the signature is the shutter wipe

- Easing tokens: `cubic-bezier(0.16, 1, 0.3, 1)` (smooth/overshoot-free) and `cubic-bezier(0.22, 1, 0.36, 1)` (out-quint). Durations 200-800ms. No bounce, no spring
- **Shutter/wipe transitions:** page-level and media-level changes wipe with a solid `#050505` blade scaling in on the X axis (`scaleX`), carrying a 2px white edge glow (`box-shadow: 2px 0 0 rgba(255,255,255,0.15)`). Directional: left-in/right-out and reverse. This is the brand's cinematic transition - use it for page swaps, view switches, and media crossfades
- Scroll reveals: `IntersectionObserver`-driven, start at opacity 0 + `translateY(8-30px)`, 400-800ms, staggered `transition-delay` (~80-240ms steps) for cascades
- Media hover: image scales from 1.04 → 1.0 over 800ms while brightening; landing hero panels expand from 50/50 to 65/35 on hover with the losing side dimming to 0.45 opacity
- Always gate everything behind `prefers-reduced-motion: reduce` - motion fully disabled, content visible

### Interaction principles

- Grayscale by default; imagery earns brightness through attention (hover/focus)
- Focus-visible is a solid 2px off-white inset ring - no browser defaults
- Every interactive element moves at least one "brightness step" on hover; nothing changes hue
- Voice: quiet, technical, uppercase micro-labels, numbered sections - the page should feel like a beautifully printed technical zine, not a SaaS landing page

### Hard prohibitions

- No accent colors, no gradients as decoration, no colored shadows, no colored badges
- No large border radii on content cards (pills are the only round elements besides dots/avatars)
- No heavy drop shadows - depth comes from `#111111` fills, blur, and hairlines
- No emoji-as-UI, no decorative illustration, no fonts outside Inter + JetBrains Mono
- No motion without a reduced-motion fallback

When producing anything visual for this brand - a new page, component, mockup, or diagram - hold every element against the monochrome rule first, the editorial typographic scale second, and the shutter-wipe motion language third.
