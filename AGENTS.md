# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **vanilla HTML/CSS/JS static site** ("Recife Flats Temporada") — no framework, no build step, no package manager, no lockfile, and no automated tests/lint config. See `README.md` for architecture.

### Running the site (dev)
- Must be served over **HTTP**, not opened via `file://` (uses ES module `import` and `type="module"`).
- Any static server works. Recommended from repo root:
  - `python3 -m http.server 8000` → then open `http://localhost:8000/index.html`
  - alternatives: `npx serve .` or `npx http-server`
- Entry pages: `index.html` (home with video hero) and `apartamentos.html`.

### Build / lint / test
- **Build:** none (by design).
- **Lint / test:** none configured. There is nothing to run.

### Non-obvious caveats
- Runtime dependencies (GSAP + ScrollTrigger via cdnjs, Google Fonts) load from **CDN**, so animations and custom fonts require **outbound internet**. Offline, the page still renders but loses animations/fonts.
- The booking form (`<rf-booking-search>`) is a plain GET form: submitting "Consultar" navigates to `apartamentos.html?checkin=...&checkout=...&guests=...`. There is no backend; Supabase is only mentioned as a future idea in the README.
- The hero video is served from `assets/videos/`; if a referenced video/poster is missing the hero still loads with the poster/background.
