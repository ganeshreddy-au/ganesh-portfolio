Website Design Recreation

2

3 ## Workflow

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

21

22

23

24

25

26

When the user provides a reference image (screenshot) and optionally some CSS classes or style notes:

I for Command, L. for Agent

1. Generate** a single 'index.html file using Tailwind CSS (via CDN). Include all content inline no external files unless requested.

2. **Screenshot** the rendered page using Puppeteer (npx puppeteer screenshot index.html -fullpage` or equivalent). If the page has distinct sections, capture those individually too.

3. **Compare** your screenshot against the reference image.

Check for mismatches in:

Spacing and padding (measure in px)

Font sizes, weights, and line heights

Colors (exact hex values)

Alignment and positioning

Border radii, shadows, and effects

Responsive behavior

Image/icon sizing and placement

4. **Fix** every mismatch found. Edit the HTML/Tailwind code.

5. **Re-screenshot** and compare again.

6. **Repeat** steps 3-5 until the result is within ~2-3px of the reference everywhere.

Do NOT stop after one pass. Always do at least 2 comparison rounds. Only stop when the user says so or when no visible differences remain.

88 Technical Defaults

Use Tailwind CSS via CDN (`<script src="https://cdn. tailwindcss.com"></script>')

- Use placeholder images from 'https://placehold.co/ when source images aren't provided

27 Mobile-first responsive design

28

Single index.html file unless the user requests otherwise
Do not add features, sections, or content not present in the reference image

Match the reference exactly do not "improve" the design

34

If the user provides CSS classes or style tokens, use then verbatim

Keep code clean but don't over-abstract inline Tailwind classes are fine

Then comparing screenshots, be specific about what's wrong (e.g., "heading is 32px but reference shows

Ipx", "gap between cards is 16px but should be 24px")