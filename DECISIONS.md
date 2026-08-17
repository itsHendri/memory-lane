# Decisions

Numbered and append-only. Supersede an entry with a new one; don't rewrite
history. Rebuild decisions are `A1, A2, …` so they never collide with the
upstream numbering they cite.

Upstream is `~/Framer/timeline-carousel/DECISIONS.md` (#1–#52). Anything there
still applies unless an entry here supersedes it.

---

## Imported invariants

Carried over unchanged, listed so a future session does not "simplify" one of
them. Each cost real debugging upstream.

| # | Invariant | Why it bites |
|---|---|---|
| #25 | `vUv = aQuad` in the plane vertex shader | Textures upload with flip-Y off, so `v=0` is the top row. Inverting it is the reflex and renders every picture upside down; near-symmetric test art hides it. |
| #4 | Dither grid anchored in content space | Screen-anchored crawls across moving content (measured 2.38 vs 0.00). Obra Dinn hit this and solved it the same way. |
| #6 | Plane geometry from the offset chain | The strip carries a live transform, and a rotated element's rect is its axis-aligned bounding box — 433px for a 420px piece. |
| #7 | Canvas transparent except where a picture is, premultiplied | An opaque canvas paints over all the DOM type. Straight alpha leaves a dark fringe at picture edges. |
| #33 | Derived fg is pure black/white, flip at L 0.179; dim is measured | White clears 4.6:1 to L 0.178, `#05060F` only from 0.194 — the windows don't overlap, so a threshold between them gives ~2.6:1 twice per read. An alpha composites against channels, not luminance. |
| #32, #41 | Every hue transit routes through the dark anchor | RGB interpolation between distant hues passes through their duller average — that was the "dirty grey", and it was the space between stops, not a stop. |
| #36 | Nothing after the scroll track | A section below it keeps scrolling and takes the pinned stage — memory card included — off the top. |
| #17, #46 | Hover: velocity gate + exit slop + asymmetric delay; cue is the dither fade | A stationary pointer over a moving strip fires enter/leave on every boundary. A plate that jumps toward the viewer competes with the pan. |
| #15 | The chrome may only say what the read head could know | The moment the machine addresses the visitor, the fiction dies. |
| #2, #20 | Native scroll + sticky stage; only horizontal wheel is intercepted | A wheel hijack breaks Page Up/Down, momentum, the scrollbar, find-in-page and pull-to-refresh. |
| #48, #49, #52 | Audio: `BED_PEAK` 0.010, velocity divisor 20, silence watchdog | `tc:scroll` stops firing when the strip settles, so without the watchdog a quiet hiss runs forever — no ceiling change can fix that. |

---

### A1. Astro, static output, no backend — and no CMS

**2026-08-17.** The piece is one page of hand-authored content by a single
author. Astro is chosen over a Vite+React SPA because static HTML on first paint
is what the Framer original already achieves and an SPA would need a prerender
step bolted on to match it; and over a no-framework Vite build because the image
pipeline and page shell are the parts that compound across the next nine
projects.

React is available as islands but is expected to go unused: the ported runtime
is vanilla DOM + canvas, and its state lives in a `tc:scroll` event bus rather
than in a component tree.

---

### A2. Content is Astro markup, one file per sector

**2026-08-17, Hendri's call.** Upstream's rule was *"content is never in code —
every scene is a plain Framer node so Hendri can move a plate by hand"*, and
`FUTURE.md` explicitly cut *"reusable design components wrapping the artifacts —
they would put an indirection between Hendri and the content"*.

That rule's justification was Framer's canvas, which the rebuild deletes. The
underlying want — move a plate, retype a line, no ceremony — survives, and plain
HTML per sector serves it better than a data schema would: an art-directed
collage of absolutely-positioned plates has little in common from sector to
sector, so a uniform `sectors.ts` would be mostly escape hatches.

Rejected: typed `sectors.ts` (the indirection upstream named), and a
data+slot hybrid (buys DRY-ness for the parts that were never the problem).

Consequence: twelve files with real repetition in them. That is the intended
trade — the repetition is editable, the abstraction would not be.

---

### A3. Tokens are two layers, and type binds only to the derived one

**2026-08-17.** `tokens.css` separates authored primitives from the `--tc-*`
values the rig rewrites each frame. Type binds to `--tc-fg` / `--tc-fg-dim`;
anything inverted binds to `--tc-field` (upstream #34).

The derived tokens carry **static fallbacks equal to the ramp at progress 0**,
so the page is correct and legible before the rig's first frame and stays
correct if JS never runs. Upstream could not do this — in Framer the same values
were runtime-only overrides, which is exactly why the Framer canvas showed the
piece as flat and "dull" (upstream #51). That whole class of problem does not
exist here, and `ScreenFX`'s static-renderer branch, which existed only to stop
fogging the Framer canvas, should be deleted during the port.

Brand Forge's conventions are borrowed (header discipline; a value appears once;
semantic names alias primitives) but not its scaffolding — this piece has ~11
colours, not 11-step oklch ramps, and its foreground is computed at runtime,
which no static export can produce. A later swap to Brand Forge output is a
matter of repointing the primitives.

---

### A4. Archivo ships as a static 700 instance; JetBrains Mono as a variable file

**2026-08-17.** Google's css2 API serves a *static instance* for a single weight
request and the *variable font* for a range — and the two have different URLs.
Requesting `Archivo:wght@700` returned a static file; declaring a
`font-weight: 400 700` range against it would have made the browser treat one
static face as the whole spectrum and synthesize the rest.

Display type only ever uses 700, so the static instance is both correct and
smaller (14KB). Mono needs 400/500/700, so it takes the variable file (31KB) and
a real range. 48KB for both, against the Framer build's Archivo + JetBrains Mono
+ **seven Inter files that were never used**.

Verified by ink coverage rather than by width — JetBrains Mono is monospaced, so
every weight has identical advance widths and a width comparison proves nothing.
Measured at 64px: 400 → 11,995 dark px, 500 → 13,809, 700 → 15,497 (+29.2%).
Archivo measured identical at 400 and 700, which is the correct behaviour for a
single-instance file.

Note the consequence: asking for Archivo at any weight gets 700. If a lighter
display weight is ever wanted, the variable file must be fetched instead.

---

### A5. Tracking is one em value, not three px values per breakpoint

**2026-08-17.** The original hardcoded `-5.9px / -3.8px / -2.1px` at
`132 / 84 / 46px`. Those are the same ratio to within half a percent
(−0.0447 / −0.0452 / −0.0457 em), so `-0.045em` replaces all three and a
breakpoint changes only `font-size`. Verified in the browser: at 132px the
computed tracking is −5.94px against the original's −5.9px.

---

### A6. Fonts are self-hosted from Google's `latin` subset, not precisely subset

**2026-08-17.** No subsetter (`fonttools`/`pyftsubset`) is available on this
machine, and installing one into the system Python for a first pass is not worth
it. Google's `latin` subset already excludes cyrillic/greek/vietnamese and gets
both faces to 48KB total.

Precise glyph subsetting is deliberately deferred rather than skipped, and is
**not** free here: the boot sequence types arbitrary characters and the scramble
effect resolves headings out of noise, so the used-glyph set is wider than the
visible copy suggests. Any subsetting pass must include the scramble alphabet
and the `" .:-=+*#%@"` ASCII ramp. Logged in `FUTURE.md`.

---

### A7. The colour maths is a separate, DOM-free module

**2026-08-17.** Upstream's luminance / contrast / `pickDim` / ramp code lived
inside the rig's `useEffect`, where it could only ever be exercised by loading a
page. It is now `src/lib/contrast.ts` — pure functions, no DOM — which is what
makes `scripts/sweep-contrast.ts` possible.

That sweep is the point. The ramp's **stops** are easy: they were chosen. The
failures live *between* stops, at colours nobody designed for, which is exactly
where upstream #33 found type at ~2.6:1. Checking the six authored colours would
have passed while the real problem sat at p 0.719.

Measured, 400 samples across the interpolated ramp: **min 4.60:1 foreground,
4.60:1 dim**, worst case at p 0.719 (inside the ember transit), two foreground
flips. Upstream reported 4.62 / 4.61 — the 0.02 difference is `pickDim`'s
integer stepping versus upstream's accumulating float, and both clear AA.

The script additionally proves the FLIP threshold independently of this ramp, by
sweeping all luminances: pure black/white worst case **4.58:1**, the palette's
near-black **4.41:1**. That is #33 demonstrated rather than trusted, and it will
keep being true if the ramp is ever re-authored.

---

### A8. `__tcPan` publishes synchronously on mobile too

**2026-08-17.** A real defect inherited from upstream, found by testing the
phone layout rather than assuming it.

Upstream's injection hook, below the mobile cutoff, set `pinned` and returned —
leaving the publishing to the mobile rAF loop, with the comment *"the mobile
publisher reads it, so the phone layout's chrome is verifiable the same way as
the desktop's."* It is not: rAF is precisely what does **not** run in the
backgrounded tab the hook exists to work around. Injecting progress on a narrow
viewport updated nothing — no CSS variables, no `tc:scroll` — so the phone
chrome could never actually be verified.

It now publishes synchronously in the same call. Verified at 375×812: injecting
p updates `--tc-p` / `--tc-bg` / `--tc-fg` and fires the bus, while correctly
writing no transform.

---

### A9. The stage takes its colour from CSS, not from a per-frame write

**2026-08-17.** Upstream wrote `stage.style.backgroundColor` imperatively every
frame *in addition to* setting `--tc-bg`, because in Framer the stage's fill was
authored on the node and a variable could never reach it.

The stage now declares `background: var(--tc-bg)` in `stage.css` and the
imperative write is deleted — one less style mutation per frame, and the colour
system has a single writer. Verified: the stage's computed background tracks the
ramp across the full sweep.
