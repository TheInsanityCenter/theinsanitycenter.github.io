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
- Rules:
  - The family page shows no previews, images, or excerpts of Private Sector content.
  - The Private Sector link appears exactly twice on the family page: once in the top nav
    and once in the footer.
  - Home hero image is `assets/img/home-keyhole.webp` (photo-01 with the "21+" line covered).
  - Copy is Joy's verbatim wording.
