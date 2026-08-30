/** Prints the failing nodes of one audit from a Lighthouse JSON run. */
import { readFile } from 'node:fs/promises'
const r = JSON.parse(await readFile(process.argv[2], 'utf8'))
const a = r.audits[process.argv[3]]
if (!a) { console.log('no such audit'); process.exit(0) }
console.log(a.title, '|', a.displayValue ?? '')
const seen = new Set()
for (const item of a.details?.items ?? []) {
  const n = item.node ?? item
  const key = (n.snippet ?? JSON.stringify(item)).slice(0, 200)
  if (seen.has(key)) continue
  seen.add(key)
  console.log('-', (n.nodeLabel ?? '').slice(0, 50), '||', key.replace(/\s+/g, ' '))
  if (n.explanation) console.log('   ', n.explanation.replace(/\s+/g, ' ').slice(0, 200))
}
