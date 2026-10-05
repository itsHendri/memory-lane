# memory-lane

**SECTOR READ** — a scroll-to-pan narrative piece, rebuilt as owned code.

A recovery machine reads a memory card that never arrived. Vertical scroll
drives a wide story strip left→right beneath a pinned viewport: the centre of
the screen is the read head where the card decodes, and toward the edges the
imagery bends through a spherical lens and breaks down into dither — sectors not
yet read. Twelve sectors, 24 plates, on public-domain NASA photographs.

Live: https://itshendri.github.io/memory-lane/

## Why this repo exists

The piece was designed and built elsewhere first; this is the rebuild as owned
code — static, self-hosted, and free of the ~295KB gz of framework runtime the
original shipped for work that is mostly vanilla DOM and canvas.

It is also the first of roughly ten pieces in this vein, so the scroll rig, the
token layering and the type system are built to be lifted into the next one.

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 5, static output, TypeScript strict |
| Styling | Vanilla CSS + custom properties (`src/styles/`) |
| Motion | Ported in-house scroll rig — native scroll + sticky stage + lerped pan, no library |
| Effects | Raw WebGL 1 (no Three.js) + 2D canvas |
| Audio | Synthesized WebAudio, zero asset bytes |
| Content | Hand-authored Astro markup, one file per sector |
| Hosting | GitHub Pages (live, preview) · Cloudflare Pages (planned, final) |

## Running it

```bash
npm install
npm run dev         # localhost:5250
npm run typecheck
npm run build
```

`/specimen` is a permanent dev surface for the type system.

## The dossier

| File | What it holds |
|---|---|
| `CLAUDE.md` | Auto-loaded context; the invariants that must not break |
| `STATUS.md` | Current state, dated |
| `DECISIONS.md` | Rationale, append-only (`A1…`) |
| `FUTURE.md` | Next-session entry point + backlog |
| `CHANGELOG.md` | Keep-a-Changelog log |

## Credits

Imagery: NASA Image and Video Library, public domain. Type: Archivo · JetBrains
Mono (both OFL). A piece by hendri.design · 2026.
