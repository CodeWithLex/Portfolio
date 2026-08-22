# Portfolio Hero — Build Spec (Lex)

Date: 2026-08-22
Source of truth: `Portfolio-Hero-DESIGN.md` (user-provided) + attached reference image.
The reference image and DESIGN.md tokens govern; where they conflict, the image wins on layout/composition, DESIGN.md wins on tokens.

## Goal

Rebuild the "Avery" portfolio hero template as Lex's own portfolio site. Greenfield project (empty directory). This build delivers the hero section production-ready, structured so more sections can be appended.

## Decisions

1. **Stack: static HTML + CSS + vanilla JS, GSAP via CDN.**
   - No build step — deployable anywhere (GitHub Pages, Netlify drop), trivial to edit by hand.
   - GSAP 3.12 + ScrollTrigger loaded from jsDelivr; all animation code guards on `window.gsap` and `prefers-reduced-motion`, so the page is fully usable if the CDN fails.
   - Rejected: Vite/React — no interactivity beyond animation; YAGNI for a single hero.

2. **Identity personalization.** "Avery Chen" content becomes Lex's:
   - Name: **Lex** (from project folder). Role defaults to `Product Designer` — one editable string in the topbar.
   - Hero lines keep the template's statements (they are generic claims, not Avery-specific), with line 01 personalized ("Hello, I'm Lex — …").
   - The `ua / en` language toggle from the reference is **omitted** — it was author-specific (Ukrainian). Icon links (contact / code / work) kept as the topbar's right cluster with placeholder `href`s.
   - Avatar is a monogram (`L`) rendered in CSS; swap point for a real photo is marked in the HTML.

3. **Tokens (from DESIGN.md, mapped to CSS custom properties):**
   - Colors: primary `#FDE047`, secondary `#9CA3AF`, tertiary `#A0FF4F` (reserved), neutral/bg `#101613`, text-primary `#D1D5DB`, text-secondary `#9CA3AF`.
   - The spec frontmatter lists `background: #FDE047` but its prose says "dark mode with `#101613` as the neutral foundation" and the image shows a dark page. Resolved: page background `#101613`; yellow is accent + primary button only.
   - Type: headlines = system stack; body = JetBrains Mono 14/20/-0.025em; labels = Inter 500 14/20/-0.35px. JetBrains Mono + Inter from Google Fonts.
   - Radii: 8/12/16/9999 (buttons 12, card 16, icon links pill). Spacing base 4; card/section padding 40.
   - Card glass: `rgba(16,22,19,0.6)` bg, blur 20px, border `rgba(255,255,255,0.05)`, shadow `0 25px 50px -12px rgba(0,0,0,0.25)`.
   - Gradient border shell: 1px outer wrapper with radial yellow gradient (hairline frame), inner card radius 1px smaller.

4. **Layout (flex, full bleed, minimal grid):** fixed subtle grid + radial glow background layers; topbar (avatar/name/role ↔ icon links); hero glass card centered, max-width 820px, 6 numbered code-style lines with `< >` chevrons and yellow keyword highlights; line 06 full-yellow with blinking block cursor; CTA row (primary yellow, secondary glass); footer nav (All Works / About / Contact / Latest Shots) as stub anchors for future sections.

5. **Motion (expressive, per DESIGN.md):** 300ms/100ms durations, `ease` + `cubic-bezier(0.4,0,0.2,1)`; GSAP timeline entrance (topbar → card → staggered lines → buttons → footer); CSS-keyframe cursor blink; pointer-fine parallax tilt (±3°) via `gsap.quickTo`; ScrollTrigger drift on scroll. Hovers are text/color/shadow changes only.

6. **Accessibility:** chevrons/numbers/cursor `aria-hidden`; icon links labeled; `:focus-visible` yellow outline; reduced-motion disables blink + GSAP; content visible without JS (animations use `gsap.from`).

## Verification

Open in Playwright: desktop 1440×900 + mobile 390×844 screenshots vs. reference; zero console errors; buttons/footer keyboard-focusable; reduced-motion check.
