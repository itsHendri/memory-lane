// @ts-check
import { defineConfig } from "astro/config"

// Static output. There is no backend and there will never be one — see
// DECISIONS #A1. `site` is set so astro:assets and the sitemap emit absolute
// URLs; update it when the real domain is pointed at Cloudflare Pages.
export default defineConfig({
    site: "https://memory-lane.pages.dev",
    output: "static",
    build: {
        // One stylesheet rather than per-page <style> blocks. The piece is a
        // single page and the type system is shared by every sector.
        inlineStylesheets: "never",
    },
    devToolbar: { enabled: false },
})
