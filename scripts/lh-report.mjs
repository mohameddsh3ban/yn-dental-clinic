/** Prints the category scores and metric values from one Lighthouse JSON run. */
import { readFile } from 'node:fs/promises'

const r = JSON.parse(await readFile(process.argv[2], 'utf8'))
if (r.runtimeError) {
  console.log(process.argv[3] ?? '', 'RUNTIME', r.runtimeError.code)
  process.exit(0)
}
const scores = Object.fromEntries(
  Object.entries(r.categories).map(([k, c]) => [k, Math.round(c.score * 100)]),
)
const m = r.audits.metrics.details.items[0]
console.log(
  process.argv[3] ?? '',
  JSON.stringify(scores),
  `fcp=${Math.round(m.firstContentfulPaint)}`,
  `lcp=${Math.round(m.largestContentfulPaint)}`,
  `si=${Math.round(m.speedIndex)}`,
  `tbt=${Math.round(m.totalBlockingTime)}`,
  `cls=${m.cumulativeLayoutShift.toFixed(3)}`,
)
if (process.argv[4] === '--fails') {
  for (const [k, c] of Object.entries(r.categories))
    for (const a of c.auditRefs) {
      const au = r.audits[a.id]
      if (au && au.score !== null && au.score < 1)
        console.log('   ', k, au.score, a.id, '|', au.displayValue ?? '')
    }
}
