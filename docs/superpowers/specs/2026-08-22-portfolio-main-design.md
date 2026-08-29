# Main Portfolio Page - Build Spec (Lex)

Date: 2026-08-22
Source of truth: user-provided style spec (dark-mode-first / neon lime / floating shell / bento). The hero entry page (`index.html`, yellow #FDE047 system) stays untouched; "Explore Work" now navigates to this page.

## Goal

A main portfolio page (`portfolio.html`) that appears when the user clicks **Explore Work** on the hero entry. Distinct visual system per the new spec: obsidian + neon lime, not the entry page's yellow.

## Decisions

1. **Separate page, not a SPA toggle.** `portfolio.html` with its own stylesheet/script. Robust, shareable URL (`portfolio.html#work`), keeps the entry hero intact. Navigation back via the logo (links to `index.html`).
2. **Tokens:** base black `#000000` viewport, shell `#0c0c0c`, primary `#ccff00`, secondary emerald `#10b981`, text `#ebebeb` / 60% / 30%. Fonts: Space Grotesk (300-700, headings −0.06em tracking, body 400) + JetBrains Mono (uppercase, tracked technical labels). No system-font styling.
3. **Floating shell:** `max-width 1600px`, radius `2.5rem`, `ring 1px white/10`, shadow, `#0c0c0c` bg, inside a pure-black body with visible margin. `overflow: clip` (not `hidden`) so the header can be `position: sticky` inside the shell.
4. **Decorative system:** 60×60px linear-gradient grid (hero, masked fade), fixed SVG `feTurbulence` noise overlay at 15% element opacity, glow spheres with 120px blur (lime + emerald, slow GSAP drift).
5. **Glass recipe (spec-exact):** `rgba(255,255,255,0.03)` bg, `blur(16px)`, `1px solid rgba(255,255,255,0.1)`, radius `1.5rem` - mockup, floating cards, testimonial (dark variant on the light section for contrast). Nav pill: `rgba(255,255,255,0.05)` + blur + `rounded-full`.
6. **Sections per spec:** sticky 3-part nav (lime logo box / pill links / mono status with pulsing 6px dot + white pill button); 12-col hero (7-col giant type `clamp(3.2rem, 7.2vw, 7.5rem)` / 0.85 line-height, italic lime→white gradient span, mono AI label; 5-col glass app mockup with CSS `float` 6s ease-in-out cards and a lime "AI CURSOR" label, pointer tilt); bento `grid-cols-4` (2×2 bar-viz card, 1×2 token/swatch card, solid-lime accent card with noise, 3 feature cards, 1 availability card; hover border `#ccff00/40`); methodology section `#e5e5e5` with 4rem rounded top, 01/02/03 mono circles, grayscale circular portrait with overlapping dark-glass testimonial; `#000` footer with `LEX` watermark (10rem, 5% opacity), oversized lime CTA with slide-up white hover, 3-column bottom (policies / hollow-circle socials / mono copyright).
7. **Buttons:** spec-exact lime pill (700 weight, `1rem 2rem`, glow `0 0 30px rgba(204,255,0,.3)`, hover `scale 1.05`); footer mega CTA uses the slide-up white variant instead of scale.
8. **Motion:** GSAP entrance (nav → label → headline lines → sub → CTAs → visual), ScrollTrigger reveals (bento batch, method steps, bars scaleY from 0), CSS `float` 6s ease-in-out + `pulse` 2s on status dot. Float cards never get GSAP transforms (CSS animation owns them; entrance uses opacity only). `prefers-reduced-motion` disables all of it; page fully static without JS.
9. **Content personalization:** all copy is Lex's; footer watermark says `LEX` (the spec's `SUPER` is the template's brand). Numbers (24 projects, 98 Lighthouse, 40+ shipped) are believable placeholders, marked editable in README.

## Verification

Playwright: desktop 1440×900 + mobile 390×844; click "Explore Work" on `index.html` lands on portfolio; fonts, glass blur ≥16px, grid/noise presence, float/pulse animations, sticky nav after scroll, CTA hover states, no console errors, no horizontal overflow.

## Reference-image alignment pass (same day)

The user later supplied three reference screenshots of the source design (a "Superdesign"-style AI studio). Alignment changes, verified in-browser after:

1. **Hero copy**: headline now sentence-case "Design at the *Speed* of thought." (italic gradient on one word, `text-transform` removed; size rebalanced to `clamp(2.8rem, 5.6vw, 6rem)`/0.95). Label → "AI-POWERED DESIGN STUDIO". Status → "SYSTEM V2.4 - LIVE". Secondary CTA is now a dark pill ("Watch reel", play icon) per the reference's "Watch Demo". Stats row replaced by a mono gray client-name row (editable placeholders).
2. **Mockup**: rebuilt as the reference's minimal browser window - red/yellow/green traffic dots, lime avatar + gray line row, skeleton lines, full-width lime button; KPI/chart dashboard removed. Lime "GENERATING…" floating pill replaces "AI Cursor"; one floating glass card kept (spec-mandated float-anim).
3. **Bento**: section label is now a lime-bordered badge "SYSTEM ARCHITECTURE"; heading "Built for the *unconventional.*". Cards re-labeled "Neural engine" (2×2, bars kept per text spec), "Atomic tokens" (swatches), new dark "10× FASTER DEPLOYMENT" stat card; lime accent card and availability card retained. All section labels are badges now.
4. **Methodology**: heading "Simplicity is the *ultimate* sophistication."; numbered steps are the reference's manifesto - 01 Subtract until it breaks / 02 Motion adds meaning / 03 Content is interface. Light-bg contrast structure (spec) kept.
5. All headings de-uppercased to match the reference typography.
