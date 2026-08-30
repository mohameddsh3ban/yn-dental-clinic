import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

/**
 * Folds the built stylesheet into the HTML as a `<style>` block.
 *
 * The stylesheet is render-blocking either way, but inlined it costs no
 * round trip — the browser has it the moment the document arrives instead of
 * one RTT later, which is the whole of the "render-blocking requests" saving
 * Lighthouse reports. It is small enough (~20 KB over the wire) that carrying
 * it in every document beats caching it separately on a one-page site.
 */
function inlineStylesheet(): Plugin {
  return {
    name: 'inline-stylesheet',
    enforce: 'post',
    apply: 'build',
    generateBundle(_options, bundle) {
      const html = bundle['index.html']
      if (!html || html.type !== 'asset') return

      let source = String(html.source)

      for (const [name, asset] of Object.entries(bundle)) {
        if (!name.endsWith('.css') || asset.type !== 'asset') continue

        // Hashed asset names only ever contain word characters, dashes and
        // dots, so neutralising the dots is the whole of the escaping needed.
        const escaped = name.split('.').join('[.]')
        const tag = new RegExp(`<link[^>]*href="/${escaped}"[^>]*>`)
        if (!tag.test(source)) continue

        source = source.replace(tag, `<style>${String(asset.source)}</style>`)
        delete bundle[name]
      }

      html.source = source
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    // Dev only: it stamps every element with a `code-path` attribute, which is
    // an editor affordance and has no business in what visitors download.
    { ...inspectAttr(), apply: 'serve' },
    react(),
    inlineStylesheet(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
