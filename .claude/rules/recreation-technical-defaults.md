# Technical defaults for design recreations

Defaults for a new recreation from a reference image. They do not override the
structure of an existing site in this repo unless the user asks.

- Generate a single `index.html` with all content inline; no external files
  unless the user requests them.
- Use Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Use placeholder images from `https://placehold.co/` when source images
  aren't provided.
- Build mobile-first and responsive.
