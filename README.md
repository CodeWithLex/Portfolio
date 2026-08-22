# Portfolio — Lex

Two pages:

1. **`index.html` — Hero entry.** Dark glass card, JetBrains Mono + Inter, GSAP motion. **Explore Work** leads to the main portfolio.
2. **`portfolio.html` — Main portfolio.** Monochrome (white on obsidian) system: floating rounded shell, sticky pill nav, Space Grotesk hero with glass app mockup, bento grid, photography gallery with filter + lightbox, light methodology section, watermark footer.

No build step — plain HTML/CSS/JS.

## Run

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Make it yours

Everything personal is marked with `✏️` comments in `index.html`; on `portfolio.html` edit directly:

| What | Where |
|---|---|
| Name / role / avatar | `index.html` topbar; `portfolio.html` logo + portrait |
| Profile links (email, code, work) | `index.html` topbar-actions; `portfolio.html` footer socials + CTA `mailto:` |
| Hero pitch lines | `index.html` `.code-lines` |
| Portfolio stats & bento copy | `portfolio.html` hero-stats + bento cards (24 projects, 40+ shipped etc. are placeholders) |
| Testimonial / method copy | `portfolio.html` method section |

Design tokens live as CSS custom properties at the top of `styles.css` (entry) and `portfolio.css` (main page).

## Files

- `index.html` / `styles.css` / `script.js` — hero entry page
- `portfolio.html` / `portfolio.css` / `portfolio.js` — main portfolio page
- `docs/superpowers/specs/` — build specs mapping decisions to the design docs
