# Ganesh Kumar Reddy — Portfolio

A self-contained, no-build-step portfolio site. Plain HTML, CSS, and JavaScript,
no React, no npm install required to run it.

## What's inside

- `index.html` — page content and structure
- `styles.css` — the whole design system (colors, type, layout, animations)
- `script.js` — all the interactive bits, listed below
- No build tools, no `node_modules`, no bundler. Open the file and it works.

## Run it locally

**Easiest:** double-click `index.html` and it opens in your browser. Everything
works straight off disk (no local server needed), because the site doesn't use
`fetch` or ES modules.

**If you want it to behave exactly like a real deployed site** (recommended
before you push it live, mainly so relative paths and caching behave the same
way), serve it with any static server:

```bash
# option A — Python (already on most machines)
cd ganesh-portfolio-project
python3 -m http.server 8080
# then open http://localhost:8080

# option B — Node, if you have it
npx serve .
```

## What's animated, and where to look in the code

| Feature | File | Notes |
|---|---|---|
| Transaction-network background (nodes, connecting lines, occasional traveling pulse) | `script.js` → `initBackgroundCanvas()` | Plain `<canvas>`, no library |
| Custom cursor ring that grows over links/cards | `script.js` → `initCursorRing()` | Desktop pointer only, off on touch |
| Command palette (press `Cmd+K` / `Ctrl+K`) | `script.js` → `initCommandPalette()` | Jump to any section, email, or LinkedIn |
| Typewriter role rotator in the hero | `script.js` → `initTypewriter()` | Cycles Data Engineer / Data Analyst / ML Engineer / Data Scientist |
| Animated count-up stats (7,000+ TPS etc.) | `script.js` → `initCounters()` | Runs once, when scrolled into view |
| "Build activity" heatmap | `script.js` → `initHeatmap()` | Live GitHub chart, falls back to placeholder data automatically if it can't load |
| Scrolling tech-stack ticker | `styles.css` → `.marquee` | Pure CSS animation, pauses on hover |
| Scroll-triggered fade-ins | `script.js` → `initReveal()` | Uses `IntersectionObserver` |
| Top scroll-progress bar | `script.js` → `initScrollProgress()` | |
| Light/dark theme toggle | `script.js` → `initThemeToggle()` | Also respects OS theme by default |
| Case-study role filter chips | `script.js` → `initRoleFilters()` | Click a role to highlight matching case studies |

Everything respects `prefers-reduced-motion`: if that's on in your OS, the
typewriter, marquee, canvas animation, and scroll reveals all switch to their
static equivalents instead of animating.

## GitHub is wired in

Your GitHub (`github.com/ganeshreddy-au`) is now live in three places:

1. **Contact section** (`index.html`) — a GitHub link with its own icon, next to email, phone, and LinkedIn.
2. **Command palette** (`script.js` → the `commands` array inside `initCommandPalette()`) — "Open GitHub" shows up when you press `Cmd+K` / `Ctrl+K`.
3. **"Build activity" card** (`index.html`, `#heatmapImg`) — pulls your real contribution graph live from `https://ghchart.rshah.org/E8A33D/ganeshreddy-au`, a free, no-auth chart generator, no backend needed. If that image ever fails to load (service down, or no public activity yet), the card automatically falls back to the old placeholder grid instead of showing a broken image (`script.js` → `initHeatmap()`).

**If your GitHub username ever changes**, update it in two spots: the `src` on `#heatmapImg` and the `href` on the GitHub link, both in `index.html`, plus the `Open GitHub` action in `script.js`. Ctrl+F for `ganeshreddy-au` in both files and you'll catch every instance.

**More control later:** the live chart above is a third-party image, not raw data, so you can't restyle its individual squares. If you eventually want the heatmap to match the site's exact colors pixel-for-pixel, that means pulling real numbers from GitHub's GraphQL API into the existing grid markup, which needs a small serverless function or build step (GitHub's API requires an auth token that can't sit in plain client-side JS). Not necessary now, just an option if you want to go further later.

## Deploying for free

Any of these work with zero cost. All three deploy the folder as-is, no build
step needed.

### GitHub Pages
1. Create a new repo on GitHub and push this folder to it.
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, choose the `main` branch and `/ (root)`, then save.
4. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

### Vercel
1. Push this folder to a GitHub repo.
2. Go to vercel.com, sign in with GitHub, and import the repo.
3. Leave the build settings blank (it's a static site) and deploy.
4. You get a free `*.vercel.app` URL immediately, with the option to attach a custom domain later.

### Netlify
1. Go to netlify.com and sign in.
2. Drag the whole `ganesh-portfolio-project` folder onto the Netlify dashboard (no GitHub needed for this option), or connect the GitHub repo the same way as Vercel.
3. It deploys instantly to a free `*.netlify.app` URL.

## Before you share the link

A few things worth doing before sending this to recruiters:

- [x] GitHub is linked (contact section, command palette, and the live activity chart) — done.
- Push your fraud detection notebook and payment-switch code to `github.com/ganeshreddy-au` so that "Build activity" card actually has contributions to show.
- Consider deploying the fraud detection model as a small live demo (Streamlit Community Cloud or Hugging Face Spaces are both free) and linking it from the `FRAUD-ML-01` case study card in `index.html`.
- Double check the `mailto:` and `tel:` links in the contact section still match your current details.

## Customizing colors and type

Everything is driven by CSS custom properties at the top of `styles.css`
(look for `:root`). Change `--accent`, `--teal`, or the font stack there and
it updates the whole site consistently, nothing else in the file needs
touching.
