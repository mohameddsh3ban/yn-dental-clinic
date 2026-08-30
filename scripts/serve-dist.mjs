/**
 * Serves `dist/` the way Cloudflare Pages does — gzip on the wire, immutable
 * caching on hashed assets, SPA fallback — so a local Lighthouse run measures
 * something close to production instead of `vite preview`'s uncompressed,
 * no-cache defaults.
 *
 * Run: node scripts/serve-dist.mjs [port]
 */
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve('dist')
const PORT = Number(process.argv[2] ?? 4174)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

/** Text types are worth compressing; woff2 and webp are already compressed. */
const COMPRESS = new Set(['.html', '.js', '.css', '.json', '.svg', '.xml', '.txt'])
const IMMUTABLE = /^\/(assets|fonts|hero)\//

const cache = new Map()

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost').pathname
  let file = path.join(ROOT, decodeURIComponent(url))

  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
  } catch {
    file = path.join(ROOT, 'index.html') // SPA fallback
  }

  const ext = path.extname(file).toLowerCase()
  const type = TYPES[ext] ?? 'application/octet-stream'
  const cacheControl = IMMUTABLE.test(url)
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=0, must-revalidate'

  const accepts = (req.headers['accept-encoding'] ?? '').includes('gzip')
  if (COMPRESS.has(ext) && accepts) {
    // Key on mtime as well as path, or a rebuild keeps serving the previous
    // index.html and its now-deleted bundle URL.
    const key = `${file}:${(await stat(file)).mtimeMs}`
    let body = cache.get(key)
    if (!body) {
      body = gzipSync(await readFile(file), { level: 9 })
      cache.set(key, body)
    }
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Encoding': 'gzip',
      'Content-Length': body.length,
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
    })
    res.end(body)
    return
  }

  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': cacheControl,
    'X-Content-Type-Options': 'nosniff',
  })
  createReadStream(file).pipe(res)
}).listen(PORT, () => console.log(`dist served on http://localhost:${PORT}`))
