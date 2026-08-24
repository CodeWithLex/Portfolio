# Portfolio — Lex Matondo

**Live:** https://lex-portfolio-swart.vercel.app · **Repo:** https://github.com/CodeWithLex/Portfolio

Two pages:

1. **`index.html` — Hero entry.** Dark glass card, JetBrains Mono + Inter, GSAP motion. **Explore Work** leads to the main portfolio.
2. **`portfolio.html` — Main portfolio.** Monochrome (white on obsidian) system: floating rounded shell, sticky pill nav, Space Grotesk hero with glass app mockup, bento grid, photography gallery with filter + lightbox, light methodology section, watermark footer.

No build step — plain HTML/CSS/JS.

## Run

Open `index.html`, or serve the folder (`npx serve .`).

## Deploy

Deployed on Vercel (static, no build step). To ship updates: commit + push to GitHub, then run `vercel --prod` in the project folder. (For full auto-deploy-on-push: link GitHub under Vercel → Settings → Login Connections, then `vercel git connect`.) GitHub Pages is also enabled on the repo but inherits the `chemlab-system.me` custom domain — Vercel is the canonical host.

## Make it yours

Everything personal is marked with `EDIT` comments in `index.html`; on `portfolio.html` edit directly:

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
