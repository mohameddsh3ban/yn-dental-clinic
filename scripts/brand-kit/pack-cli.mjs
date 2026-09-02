/**
 * Re-packs the archives without re-rendering anything.
 *
 * `npm run build:brand-kit` already packs at the end of a run; this exists for
 * the case where only a hand-edited file changed — a README correction, say —
 * and re-rendering five PDFs to pick it up would be wasteful.
 *
 * Run: node scripts/brand-kit/pack-cli.mjs
 */
import { pack } from './pack.mjs'

const { full, printOnly } = await pack({ stamp: new Date().toISOString().slice(0, 10) })
const mb = (b) => `${(b / 1024 / 1024).toFixed(1)} MB`
console.log(`✓ ${full.file}: ${full.count} files, ${mb(full.bytes)}`)
console.log(`✓ ${printOnly.file}: ${printOnly.count} files, ${mb(printOnly.bytes)}`)
