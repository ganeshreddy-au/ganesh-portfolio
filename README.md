# ganesh-portfolio

My personal site. Plain HTML, CSS and a little JavaScript, with no build step and no dependencies.

- `index.html`: all the content
- `styles.css`: layout, colours (dark by default, with a light theme) and animations
- `script.js`: interactions: theme toggle, scroll reveals, count-up stats, rotating role,
  class-imbalance chart, card tilt, magnetic buttons, custom cursor, data-point background.
  All motion switches off when the visitor has "reduce motion" turned on.

## Running it

Open `index.html` in a browser. To serve it locally:

```bash
python -m http.server 8080
# http://localhost:8080
```

## Deploying

It's a static folder, so GitHub Pages works: **Settings → Pages → Deploy from branch → `main` / root**.
Netlify or Vercel also work if you point them at the repo with no build command.

## Adding a project

Copy an `<article class="project">` block in `index.html`. I try to cover:

1. the problem and the data
2. what I tried and why
3. results, with the right metric for the problem
4. what I'd do differently

## Images and résumé

- `images/profile.jpg`: hero portrait (900×1200). Initials show if it's missing.
- `resume.html`: web résumé, linked from the nav, hero and contact section. "Save as PDF / Print"
  produces a clean A4 PDF. Keep it in sync with the CV when that changes.

## To do

- [ ] Make the fraud detection repo public and link it directly
- [ ] Add RMIT coursework projects
- [ ] Add a CV PDF and uncomment the link in the intro
