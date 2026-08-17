# Changelog

All notable changes to this project. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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
