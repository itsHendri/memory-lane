# memory-lane — project context (auto-loaded)

**SECTOR READ**, rebuilt as owned code. A recovery machine reads a memory card
that never arrived: vertical scroll drives a wide story strip left→right under a
pinned viewport, the centre of the screen is the read head where the card
decodes, and the edges bend through a spherical lens and break into dither.

This is a **rebuild of a finished piece**, not a new build.

**Read `STATUS.md` first, then `DECISIONS.md`.**

## The one rule

**Treat anything that looks arbitrary as deliberate until proved otherwise.**
Most of it encodes a bug that was expensive to find, and the measurement that
settled it is usually in `DECISIONS.md` — which records what is NEW or CHANGED
in the rebuild and cites the original's numbered decisions as `(upstream #N)`.
Those citations no longer resolve to a document in this repo; the reasoning
that survived is quoted in place at each site.

## What the rebuild changes on purpose

- **Content lives in Astro markup, one file per sector.** Upstream's "content is
  never in code" rule existed because a design canvas gave free-form hand
  editing; there is no canvas now, so real HTML per sector is the closest
  equivalent. Do not introduce a `Sector` component that takes a data object —
  that is the indirection upstream explicitly rejected.
- **Tokens are semantic names**, not the original's `--token-<uuid>`.
- **Images are repo assets** through `astro:assets` (AVIF/WebP + srcset), not a
  third-party CDN, and are same-origin — which deletes upstream's duplicate
  `crossOrigin` fetch per picture (upstream #13).
- **Inter is gone.** The original loaded it as an unused fallback.

## What must not break (ported invariants)

Full list with rationale in `DECISIONS.md` §Imported. The short version:

- `vUv = aQuad` — textures upload flip-Y off, so inverting v renders every
  picture upside down and symmetric test art hides it (upstream #25).
- The dither grid is **content-anchored** (`gpx = spx + pan`) — measured 0.00
  drift vs 2.38 screen-anchored (upstream #4).
- Plane geometry comes from the **offset chain**, never `getBoundingClientRect`
  (upstream #6).
- The canvas is **transparent except where a picture is**, premultiplied
  (upstream #7).
- Derived foreground is **pure black/white, flipping at L = 0.179**; the dim
  tone is **measured, never an alpha** (upstream #33).
- Every hue transit in the ramp **routes through the dark anchor** (upstream
  #32, #41).
- **Nothing after the scroll track** — a section below it scrolls the pinned
  stage off the top (upstream #36).
- Hover needs all three guards: velocity gate, larger exit hit area, longer exit
  delay (upstream #17), and the cue is the **dither fade**, not movement
  (upstream #46).
- The chrome may only say **what the read head could know** (upstream #15).

## How to work here

```bash
npm run dev         # localhost:5250
npm run typecheck   # astro check
npm run build
```

- **Verify numerically, not from screenshots.** The agent browser tab throttles
  rAF and returns blank or stale captures for scrolled content — the same trap
  documented upstream. Use DOM queries and canvas pixel reads; motion feel and
  colour are Hendri's ⌘P check.
- Contrast is **measured, never eyeballed**. Both real failures upstream were
  found by measuring (upstream #22, #33).

## Open

- **Title undecided**: *SECTOR READ* vs *Return to Sender*. Building with SECTOR
  READ; it lives in `Base.astro` and the wordmark only, so a swap is two files.
- `story/beats.md` v2 upstream has never been signed off by Hendri.
