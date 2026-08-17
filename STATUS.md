# Status — 2026-08-17

**Steps 1–4 of 6 done.** `/` is the piece: twelve sectors, 24 plates on 17
distinct pictures, the WebGL read head, the CRT tube and the full machine
chrome. What remains is the boot sequence and the procedural audio, then the
Lighthouse/deploy pass.

## Done

### Step 1 — repo + type system

- Astro 5.18.2, TypeScript strict, static output, own git repo. `astro check`:
  **0 errors**. Dev server on **5250** (config in `~/.claude/launch.json`, since
  the harness resolves launch.json from the working-directory root).
- Tokens split into authored primitives and the `--tc-*` derived layer, with
  fallbacks equal to the ramp at progress 0 so the page is legible before and
  without JS (A3).
- Archivo 700 static + JetBrains Mono variable, self-hosted, **48KB total**,
  Inter dropped (A4, A6). Five presets; tracking unified to `-0.045em` (A5).
- Real document metadata for the first time.
- `/specimen` — permanent type dev surface.

### Step 2 — the scroll rig

- `src/lib/contrast.ts` — DOM-free luminance / contrast / `pickDim` / ramp
  sampling, extracted so it can be swept in Node (A7).
- `src/lib/scroll-rig.ts` — the ported engine. Framework-free, ~2.7KB gz
  compiled. Framer's three imports and all `--token-<uuid>` writes are gone;
  the `tc:scroll` / `tc:hover` bus contract is preserved exactly, and typed.
- `src/styles/stage.css` — track / stage / strip / sector layout, including the
  vertical fallback below 810.
- `/rig` — permanent test surface: 12 numbered blocks, a live HUD reading the
  bus, and hoverable plates.
- `scripts/sweep-contrast.ts` — the 400-sample sweep.

## Verified (measured, not eyeballed)

| Check | Result |
|---|---|
| Both faces load; mono `wght` axis varies | ink 11,995 → 13,809 → 15,497 at 400/500/700 |
| Display tracking vs original | −5.94px at 132px vs original −5.9px |
| Layout geometry | track 10800 = 12×900 · strip 16800 = 12×1400 · travel 15520 |
| Pan accuracy at p 0/.25/.5/.719/.9/1 | exact to <0.5px at every point |
| Sector under the read head | p0 → sector 00 … p1 → sector 11, monotonic |
| Bus publishes | `tc:scroll` fires per injection; all six `--tc-*` vars update |
| Stage colour tracks the ramp | computed background follows across the sweep |
| **Contrast, 400 samples between stops** | **min 4.60:1 fg, 4.60:1 dim** (worst at p 0.719) |
| Flip threshold proof, all luminances | pure #000/#fff 4.58:1 · palette near-black 4.41:1 |
| Live DOM contrast, 101 samples | min 4.63:1 fg, 4.63:1 dim |
| Hover tilt | corner axes mirror exactly, centre 0°, 2.9px counter-drift |
| Hover state machine | zIndex 5, parent perspective 900px, metadata carried, clears |
| Mobile fallback at 375×812 | stage static, strip column, no transform, chrome still publishes |

## Fixed during the port

- **`__tcPan` did nothing on mobile** (inherited from upstream) — it set
  `pinned` and left publishing to rAF, which is exactly what does not run in the
  tab the hook exists for. Now publishes synchronously. (A8.)

## Not verified

- **The hover velocity gate.** `__tcPan` injects velocity 0 by design, so the
  injection path cannot exercise it. Ported unchanged from a shipped build;
  Hendri's ⌘P check.
- **Motion feel** — lerp glide, hover timing, the tint transit in real scroll.
  rAF does not run in the agent tab; only injected static states were measured.
- Reduced-motion and the horizontal-wheel gesture are ported but unexercised.

### Step 3 — content, the read head, and the tube

- `src/lib/effect-layer.ts` — the WebGL port. Two-pass: sharp planes into an
  offscreen buffer, then the spherical lens + Bayer dither through the edge
  mask. **The second fetch per picture is deleted** (A11).
- `src/lib/ascii-mark.ts`, `src/lib/scramble.ts` — the canvas wordmark and the
  decoding headings.
- `src/styles/sector.css`, `src/components/Plate.astro` (A10),
  `src/sectors/Sector00.astro` (title card + colophon),
  `src/sectors/Sector01.astro` (first two plates).
- All twelve sectors as hand-authored markup (A2), 24 plates on 17 distinct
  NASA pictures, AVIF via `astro:assets` (pcb 283kB → 28kB, rover 503kB → 72kB).
- `src/lib/screen-fx.ts` + `src/components/ScreenFX.astro` — the tube: pixel
  trail, static, scanlines, vignette, grunge faceplate (A14).
- Plates outside the opening sectors load lazily: first-load imagery drops from
  3.6MB to **65KB at 1×** (A13).

### Step 4 — the machine chrome

- `src/lib/chrome.ts` + `src/components/MachineChrome.astro` — sector map,
  file readout, recovery log and the turning memory card, all subscribing to
  the bus (A15). Positions taken from the shipped CSS, not guessed.
- The rail's twelve cells are real `<button>`s with `aria-label`s inside a
  `role="navigation"` landmark — the piece's only keyboard navigation.

## Payload (full page, production build)

| | gz |
|---|---|
| HTML | 5.1 KB |
| CSS | 3.5 KB |
| JS (rig, effect layer, tube, chrome, wordmark, scramble) | 15.8 KB |
| Fonts | 45.8 KB |
| Images, first load @1× | 65 KB |

The Framer original ships **~295KB gz of JS alone**, plus JPG-only imagery with
no lazy loading and seven unused Inter files. A real Lighthouse comparison still
belongs to step 6 — these are byte counts, not scores.

## Next

Step 5 — the boot sequence (a typed terminal that is also the real preloader,
counting font and image readiness) and `RigAudio` (fully synthesized, zero asset
bytes: television static swelling with head velocity, decode bloops, the s04
stutter, and a set switching off at end of media).

Then step 6 — Lighthouse against the Framer baseline, then Cloudflare Pages.
