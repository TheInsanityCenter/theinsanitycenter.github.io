# The Insanity Center - design system

- Theme: dark only. Near-black base (#08090a), deep green surfaces (#0e1110 / #141a16),
  one gold accent (#c9a45c, soft #8a7444, bright #e6cd8f), warm ink text (#ede6d6).
- Type: Cormorant Garamond (display serif), Outfit (body/UI). Self-hosted woff2.
- Feel: black and gold, keyhole, candlelight, one Victorian border. Calm and skimmable.
- Copy: ALL body text is Joy's own writing, moved, not rewritten. Do not "fix" her voice,
  grammar, or cadence. Anything new that is not hers carries a visible
  `<span class="draft">[Draft — Joy to approve]</span>` badge until she approves it.
  Never invent dates or prices: write "details coming soon" (`.soon`).
- Older passes (kept): Nov 2026 price guide added verbatim; Nov 2026 typo pass
  (privet->private, suitations->situations, dose->does, thel->the, aquired->acquired,
  though->through, then->than).

## Phase 1 (2026-11-18)

- Pages (family side, all in `sitemap.xml`):
  - `index.html` - welcome, "Phase 1 — Building Now!", What Fantasy Means To Me (front and
    center, with the Bring Us Your Fantasy form), Phase 1 summary, mascot welcome, Start here.
  - `building.html` - What I'm Building, Phase 1 front door comic, Community Compound,
    the look of the place, creative help (dreaming / taking new customers).
  - `mascots.html` - the Unicorn Goblin, the Unsolicited Duck (Sir Quacks-A-Lot),
    Future Trademark Mascots note. Mascots are family-only, never in the Private Sector.
  - `events.html` - Penny Rally, Mother's Day Penny Picnic poster, Saturday baskets,
    volunteer sign-up, Let's Play a Game.
  - `crafts.html` - Gremlin Crafts, the craft room, stickers and snap bracelets.
  - `family.html` - Family Area plus the full price guide (`#prices`).
  - `help.html` - help / volunteer / vendors, contact cards, Every dime counts, pirate ship.
- Private side: `private/index.html` gate ("Private Sector — Adults Only 21+. Not part of
  the family experience.") and `private/sector.html`. Both `noindex, nofollow`, out of the
  sitemap, not disallowed in robots. `sector.html` is guarded by `gate-check.js`
  (sessionStorage flag set by `gate.js`). Adult images and the adult posters live only here.
- Family pages link to the private side once: the small footer link. No adult words,
  images, alt text or social cards on family pages.
- Build: page bodies are hand-written; header, footer and head are shared. Restamp SRI and
  `?v=` after any CSS/JS edit: `openssl dgst -sha384 -binary FILE | base64`.
- Components (`assets/css/style.css`):
  - `.frame` - the one ornament: gold double rule, used for What Fantasy Means To Me and the gate.
  - `.pic` / `.pics` / `.split` - figures. Every picture is a plain link to its full-size file
    (tap to enlarge, no JS).
  - `.phase` - the Phase 1 badge. `.draft` - draft badge. `.soon` - details coming soon.
  - `.mascot` - bio card (Look / Personality / Where it appears). `.note` - side note box.
  - `.page-list` - home "Start here" links. `.connect-grid` - contact cards.
  - `.nav-dime` - the gold "Drop a Dime" pill, once per page in the header.
  - `.gallery-grid` - private gallery, plain grid (the old Three.js wall and WebGL hero
    field were removed; `hero-field.js`, `gallery3d.js` and the Three.js vendor file are gone).
  - `.egg` - pirate-ship GIF on the help page, links to Buccaneer Salvage.
- Rules: one column on phones, 44px targets, visible focus, no animations
  (smooth scroll only when motion is allowed), CSP `'self'` with no inline style or script,
  SHA-384 SRI on every local CSS/JS, html-validate 0 errors.
