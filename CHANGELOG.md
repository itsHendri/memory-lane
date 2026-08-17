# Changelog

All notable changes to this project. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added — 2026-08-17 — all twelve sectors, and the tube (build step 3/6)

- Sectors 02–11 as hand-authored markup (A2): 24 plates across 17 distinct NASA
  pictures, with the dedup thread intact — duplicates in 08–10 carry their
  original's exact dimensions and `file` key, so the readout reports one record
  for both showings (upstream #39). Sector 04's two plates are `corrupt`.
- `src/lib/screen-fx.ts` + `src/components/ScreenFX.astro` — the CRT tube:
  pixel cursor trail, animated static, scanlines, broad vignette and a grunge
  superellipse faceplate baked at 220×150 and stretched, so the browser's
  bilinear upscale is the blur (A14).
- `alt` prop on `Plate`, separate from `label`: the duplicate plates are
  labelled "duplicate of 01·01" for the readout, which is right for the machine
  and useless to a screen reader. They now carry the original's description.

### Changed

- Plates outside the opening sectors are `loading="lazy"`. Upstream loaded all
  24 eagerly on the reasoning that everything lives in one pinned viewport —
  true of the stage, not of the 16,800px strip inside it. First-load imagery
  drops from **3.6MB to 65KB at 1×** (A13).

### Verified

- Structure matches the original exactly: 12 sectors, 24 plates, 17 unique
  sources, 2 corrupt, strip 16,800px, travel 15,520px, track 10,800px.
- The faceplate bakes to a superellipse, not an ellipse: alpha 0 at centre, 97
  at mid-edge, 249 at the corner.
- Sector 04 renders block-corrupted **inside** the clean band — the one place
  the treatment is allowed to invade the read head — while every other sector's
  centre stays an undistorted window.
- Full-page payload: 3.8KB HTML + 2.6KB CSS + 12.6KB JS (all gz) + 45.8KB fonts
  + 65KB first-load imagery.


### Added — 2026-08-17 — scroll rig (build step 2/6)

- `src/lib/contrast.ts` — DOM-free luminance, contrast ratio, `pickDim`, ramp
  sampling and the tint derivation. Extracted from the rig so the colour system
  can be swept and measured in Node rather than only by loading a page. (A7.)
- `src/lib/scroll-rig.ts` — `StripPan` ported to a framework-free module.
  React and Framer's three imports removed; all `--token-<uuid>` writes replaced
  by semantic `--tc-*` properties; the `tc:scroll` / `tc:hover` bus contract
  preserved exactly and now typed via `WindowEventMap`. Compiles to **2.7KB gz**.
- `src/styles/stage.css` — track / stage / strip / sector layout and the
  vertical fallback below 810.
- `src/pages/rig.astro` — permanent rig test surface: 12 numbered blocks, a HUD
  subscribed to the bus, hoverable plates.
- `scripts/sweep-contrast.ts` — 400-sample contrast sweep across the
  interpolated ramp, plus an independent proof of the flip threshold.

### Fixed

- **`__tcPan` published nothing below the mobile cutoff** — a defect inherited
  from upstream. It set `pinned` and left publishing to the mobile rAF loop,
  which is precisely what does not run in the backgrounded tab the hook exists
  to work around, so the phone chrome was never actually verifiable despite a
  comment claiming it was. Now publishes synchronously. (A8.)

### Changed

- The stage's background comes from `background: var(--tc-bg)` in CSS instead of
  an imperative per-frame `style.backgroundColor` write. Upstream needed the
  write because Framer authored the fill on the node; here the variable is the
  mechanism. One fewer style mutation per frame, one writer. (A9.)
- `pickDim` walks integer steps (0.10…0.80) rather than accumulating `+= 0.05`
  in floating point, which drifts and can drop the final step.

### Verified

- Pan accuracy exact to <0.5px at p 0 / .25 / .5 / .719 / .9 / 1 against a
  measured travel of 15,520px; sector under the read head monotonic 00 → 11.
- **Contrast across 400 samples between stops: min 4.60:1 foreground, 4.60:1
  dim**, worst case at p 0.719 inside the ember transit, two foreground flips —
  matching upstream's 4.62 / 4.61 to within 0.02.
- Flip threshold proven independently of the ramp: pure black/white worst case
  4.58:1 across all luminances, the palette's near-black 4.41:1 — which is why
  the derived dark tone is pure `#000`.
- Live DOM contrast over 101 samples: 4.63:1 both.
- Hover tilt symmetric (corner axes mirror, centre 0°, 2.9px counter-drift);
  state machine sets zIndex and parent perspective, carries metadata, and clears.
- Mobile at 375×812: stage static, strip column, no transform, chrome still
  publishing.

### Not verified

- The hover velocity gate — `__tcPan` injects velocity 0 by design, so the
  injection path cannot exercise it.
- Motion feel (lerp glide, hover timing, tint transit under real scroll): rAF
  does not run in the agent tab, so only injected static states were measured.

### Added — 2026-08-17 — repo + type system (build step 1/6)

- Astro 5.18.2 project, TypeScript strict, static output, own git repo. Dev
  server on port 5250; `astro check` clean.
- `src/styles/tokens.css` — authored primitives plus the `--tc-*` derived layer
  the scroll rig will drive each frame, with fallbacks equal to the tint ramp at
  progress 0 so the page is legible before (and without) JS. (DECISIONS A3.)
- `src/styles/type.css` — Archivo 700 (static instance) + JetBrains Mono
  (variable, 400–700), self-hosted from Google's `latin` subset, **48KB total**.
  Five presets: display / eyebrow / label / body / value, plus inverted.
  Inter — seven files the Framer build loaded and never used — dropped. (A4, A6.)
- `src/styles/base.css` — small reset, focus-visible ring, reduced-motion guard.
- `src/layouts/Base.astro` — real document metadata (title, description,
  canonical, OG, Twitter, theme-color) and font preloads. The Framer original
  ships `My Framer Site` / `Made with Framer`.
- `/specimen` — permanent dev surface proving font loading, the variable weight
  axis, and that every preset binds to the derived colour tokens.
- Project dossier: `CLAUDE.md`, `README.md`, `STATUS.md`, `DECISIONS.md`,
  `FUTURE.md`, `CHANGELOG.md`.

### Changed

- Display tracking unified from three per-breakpoint px values
  (`-5.9 / -3.8 / -2.1` at `132 / 84 / 46px`) to a single `-0.045em`; the three
  were the same ratio to within half a percent. Verified: computed −5.94px at
  132px against the original's −5.9px. (A5.)
- Content architecture: hand-authored Astro markup per sector, superseding the
  plan's typed `sectors.ts` — upstream explicitly rejected that indirection, and
  the reason it was allowed in Framer (canvas hand-editing) does not survive the
  port. (A2.)

### Verified

- Both faces load as real webfonts, not system fallbacks.
- JetBrains Mono's variable `wght` axis genuinely varies: ink coverage
  11,995 → 13,809 → 15,497 at 400/500/700 (+29.2%) measured at 64px. A width
  comparison was tried first and is invalid — the face is monospaced, so all
  weights share advance widths.
- Archivo renders identically at 400 and 700, correct for a single-instance file.
- Derived foreground/dim contrast at all six ramp stops: min **8.91:1** fg,
  min **4.72:1** dim, with the foreground correctly flipping to black on ember.
  (Stops only — the between-stop sweep belongs to step 2.)

### Not verified

- Nothing judged visually beyond the top of the specimen: the agent browser tab
  returns blank or stale captures for scrolled content.
