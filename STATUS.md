# Status — 2026-08-17

**Step 1 of 6 done: repo + type system, verified.** Nothing of the piece itself
is built yet — `/` is a stub. The rig, the sectors, the effect layer, the boot
and the audio are all still upstream-only.

## Done

- **Repo** at `~/memory-lane`, own git repo, Astro 5.18.2 + TypeScript strict,
  static output. `astro check`: **0 errors**. Dev server on **5250**
  (`.claude/launch.json` at `~/.claude/launch.json`, since the harness resolves
  it from the working directory root).
- **Tokens** (`src/styles/tokens.css`) — authored primitives + the `--tc-*`
  derived layer the rig will drive, with fallbacks equal to the ramp at progress
  0 so the page is legible before any JS runs (DECISIONS A3).
- **Type** (`src/styles/type.css`) — Archivo 700 static + JetBrains Mono
  variable, self-hosted, 48KB total, Inter dropped. Five presets: display,
  eyebrow, label, body, value (+ inverted). Tracking unified to `-0.045em`
  (A5).
- **Metadata** — real title, description, canonical, OG/Twitter, theme-color.
  The Framer original still ships `My Framer Site` / `Made with Framer`.
- **Specimen** at `/specimen` — a permanent dev surface that proves the fonts
  load, the weight axis varies, and every preset binds to the derived tokens.

## Verified (measured, not eyeballed)

| Check | Result |
|---|---|
| Both faces load (not a system fallback) | `Archivo 700 loaded`, `JetBrains Mono 400 700 loaded` |
| Mono variable `wght` axis varies | ink 11,995 → 13,809 → 15,497 at 400/500/700 (+29.2%) |
| Archivo is a single instance | identical ink at 400 and 700 — correct for a static file |
| Display tracking matches original | computed −5.94px at 132px vs original −5.9px |
| Derived fg/dim contrast at all 6 ramp stops | min **8.91:1** fg, min **4.72:1** dim; fg flips to black on ember |

⚠️ Those six figures are the ramp's **stops**. Upstream's tighter numbers
(4.62 fg / 4.61 dim) come from 400 samples *between* stops, which is where the
worst case lives. That sweep belongs to step 2, once the rig interpolates.

## Not verified

- **Nothing has been judged visually.** The agent browser tab returns blank or
  stale captures for scrolled content, so only the top of the specimen was seen
  rendered. Type colour, weight and rhythm are Hendri's ⌘P check on 5250.

## Next

Step 2 — port `StripPan` as a standalone `scroll-rig` module: progress, lerp,
`tc:scroll` bus, tint ramp, luminance-derived contrast, vertical fallback below
810, reduced motion. Proof: numbered blocks panning + a 400-sample contrast
sweep matching upstream #33.

Then step 3 — sector 00 fully realised (markup, images, EffectLayer, ScreenFX
and the chrome visible there), which proves the whole system once before the
remaining eleven.
