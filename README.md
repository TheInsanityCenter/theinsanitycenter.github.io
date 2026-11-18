# The Insanity Center

A family-first community compound forming in Carbondale, PA: picnics, penny carnivals, games,
workshops, nature and the farm, vendors, and community events for family and friends.

Static site (HTML + CSS + vanilla JS), no build step. Published via GitHub Pages at
https://theinsanitycenter.github.io/.

- Content: (c) Joy Petroski / The Insanity Center. All copy is Joy's own wording, kept verbatim.
- Theme: forest green, gold, black
- Contact: theinsanitycenter@gmail.com

## Structure

- `index.html` - the family home page: Welcome, What I'm Building (`#building`),
  What Fantasy Means To Me (`#fantasy`), Family Area (`#family`), price guide (`#prices`),
  Visit / Help / Contact (`#help`, including the `#dime` donation block).
- `private/index.html` - small separate Private Sector landing page with the 21+ gate (`noindex`).
- `private/sector.html` - all adult / private content (`noindex`). Guarded by
  `assets/js/gate-check.js`, which checks the sessionStorage flag set by `assets/js/gate.js`
  on the landing page.
- `404.html`, `robots.txt`, `sitemap.xml` (lists only the indexable home page).

## Maintenance rules

- Nothing in Joy's copy is deleted, only moved. Wording stays verbatim.
- Images: every original JPG in `assets/img/` has a WebP derivative next to it. Add both when
  adding a photo.
- CSS/JS are referenced with a `?v=` cache stamp and an SRI `integrity` hash. After ANY edit
  to a CSS or JS file, re-stamp the `?v=` value and the `integrity` hash in all four HTML
  files (`index.html`, `404.html`, `private/index.html`, `private/sector.html`).
- A strict Content-Security-Policy meta tag is in every page: no inline styles, no inline
  scripts, no `style=""` attributes. Styles go in `assets/css/style.css`, code in `assets/js/`.
