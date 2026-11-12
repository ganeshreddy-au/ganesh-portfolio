# Design recreation workflow

Applies when the user provides a reference image (screenshot) of a website to
recreate, optionally with CSS classes or style notes.

1. **Generate** the page (see `recreation-technical-defaults.md`).
2. **Screenshot** the rendered page with Puppeteer
   (`npx puppeteer screenshot index.html --fullpage` or equivalent). If the page
   has distinct sections, capture those individually too.
3. **Compare** the screenshot against the reference image
   (see `screenshot-comparison.md` for what to check).
4. **Fix** every mismatch found by editing the HTML/Tailwind code.
5. **Re-screenshot** and compare again.
6. **Repeat** steps 3–5 until the result is within ~2–3px of the reference everywhere.

Do not stop after one pass: always do at least two comparison rounds. Stop only
when the user says so or when no visible differences remain.
