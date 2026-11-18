# The Insanity Center - design system

- Theme: dark only. Off-black base (#070b08), forest-green surfaces (#1e3d2b family), single gold accent (#c9a45c).
- Type: Cormorant Garamond (display serif - luxury private-club brief), Outfit (body/UI).
- Radius: cards 14px, media 10px, buttons pill.
- Hero field: raw WebGL2 keyhole light (assets/js/hero-field.js). Gallery keeps the
  Three.js carousel and adds a dark metal floor plus a gold ring. Both stop or freeze
  under prefers-reduced-motion. No copy change.
- Copy: ALL body text is the client's own writing, reproduced VERBATIM at her explicit
  request (same text, same photos). Do not "fix" her voice, grammar, or cadence.
  Aphoristic-cadence findings on body copy are accepted by design.
- Nov 2026 addition: #pricing section (Official Service & Appointment Price Guide,
  9 categories with age chips, Booking & Deposits, Ages & Access Policy, Bring Us Your
  Fantasy). Prices/categories are the client's published guide, reproduced exactly.
  Framing copy for these NEW sections was written fresh in her voice - do not retrofit
  the older sections to match, and do not "polish" the new ones either.
- Nov 2026 typo pass: the owner asked for typos and loose ends to be fixed
  (privet->private, suitations->situations, dose->does, thel->the, aquired->acquired,
  though->through, then->than) plus one bridge line in the Support section explaining
  the $0.10 dime vs the $1 button floor. Everything else in her copy remains verbatim.

## 2026-11 revamp

- Page structure: the old single page is split into three, nothing deleted, only moved.
  `index.html` is the family home (Welcome, `#building`, `#fantasy`, `#family`, `#prices`,
  `#help` with `#dime`). `private/index.html` is the Private Sector 21+ gate page and
  `private/sector.html` holds all adult / private content. Both private pages are `noindex`
  and stay out of `sitemap.xml`; `sector.html` is guarded by `assets/js/gate-check.js`
  (sessionStorage flag set by `gate.js`).
- New components:
  - `.frame` - gold double-rule Victorian frame around feature blocks.
  - `.ornament` - keyhole divider between sections.
  - `.btn-big` - 56px-tall phone-friendly buttons for the main actions.
  - `.wonder-list` - the short word list in What Fantasy Means To Me.
  - Gate card - the centred 21+ confirmation card on `private/index.html`.
  - Donate + wayfinding (2026-11): one motif, the keyhole dime coin (`assets/img/dime-coin.svg`).
    - `.nav-dime` - gold "Drop a Dime" pill in every page header, visible down to 360px.
    - `.hero-dime` - secondary dime link under the home hero doors.
    - `.start-row` - "Start here" row of five big links under the home hero.
    - `.jump-row` - category jump links above the price guide.
    - `.dime-band` - the same donation band before the footer on all four pages.
    - `.footer-nav` - the same footer links on all four pages.
    - The menu marks the section in view with `aria-current="location"` (main.js).
- Rules:
  - The family page shows no previews, images, or excerpts of Private Sector content.
  - Private Sector links on the family page are plain text only (no images or excerpts): top nav,
    hero door, Start here row, and footer.
  - Every donate link uses the same Givebutter URL, `rel="noopener noreferrer"`, same tab.
  - Home hero image is `assets/img/home-keyhole.webp` (photo-01 with the "21+" line covered).
  - Copy is Joy's verbatim wording.
