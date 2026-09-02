/**
 * Packs the built kit into archives that can be handed to someone.
 *
 * Two of them, because they answer different questions. The full kit is what the
 * clinic keeps — every logo variant, every preview, the source HTML. The
 * print-only archive is what gets emailed to a printer: the PDFs, the preflight
 * note and the links, small enough to send without a file-transfer service.
 *
 * Both carry a MANIFEST.txt listing every member with its size, so the person on
 * the other end can tell at a glance whether the transfer arrived whole.
 */
import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { zip } from './zip.mjs'

const ROOT = 'brand-kit'

/** Files that only make sense inside the repository. */
const SKIP = new Set(['.gitignore', 'MANIFEST.txt'])
const isArchive = (name) => name.endsWith('.zip')

/** Every file under `dir`, as archive-relative paths with forward slashes. */
async function walk(dir, prefix = '') {
  const found = []
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(item.name) || isArchive(item.name)) continue
    const path = `${dir}/${item.name}`
    const name = prefix ? `${prefix}/${item.name}` : item.name
    if (item.isDirectory()) found.push(...(await walk(path, name)))
    else found.push({ path, name })
  }
  return found
}

const kb = (bytes) => `${Math.max(1, Math.round(bytes / 1024))} KB`

/**
 * Builds one archive.
 *
 * `include` decides which top-level folders go in; the archive root is a single
 * folder, so extracting never scatters files into whatever directory the person
 * happened to be in.
 */
async function build({ file, folder, include, title, note, stamp }) {
  const all = await walk(ROOT)
  const members = all.filter((m) => include(m.name))

  const manifest = [
    `OZEA DENTAL CLINIC — ${title}`,
    `Packed ${stamp}. ${members.length} files.`,
    '',
    note,
    '',
    'CONTENTS',
  ]
  for (const member of members.sort((a, b) => a.name.localeCompare(b.name))) {
    const size = (await stat(member.path)).size
    manifest.push(`  ${member.name.padEnd(58)} ${kb(size).padStart(9)}`)
  }
  manifest.push('')

  const entries = [
    { name: `${folder}/MANIFEST.txt`, data: manifest.join('\n') },
    ...(await Promise.all(
      members.map(async (member) => ({
        name: `${folder}/${member.name}`,
        data: await readFile(member.path),
      })),
    )),
  ]

  const archive = zip(entries, { date: new Date() })
  await writeFile(`${ROOT}/${file}`, archive)
  return { file, count: entries.length, bytes: archive.length }
}

/** Writes both archives and returns what went into each. */
export async function pack({ stamp }) {
  const full = await build({
    file: 'ozea-brand-kit.zip',
    folder: 'ozea-brand-kit',
    include: () => true,
    title: 'BRAND & PRINT KIT (full)',
    note: [
      'Everything: press-ready PDFs, every logo variant as SVG, PNG and print raster,',
      'previews with trim and safe-area guides, the vCard and links, the typesetting',
      'fonts, and the self-contained HTML each PDF was rendered from.',
      '',
      'Start with README.md. To send a printer just the files they need, use',
      'ozea-brand-kit-print-only.zip instead.',
    ].join('\n'),
    stamp,
  })

  const printOnly = await build({
    file: 'ozea-brand-kit-print-only.zip',
    folder: 'ozea-print-files',
    include: (name) =>
      name.startsWith('print/') ||
      name.startsWith('data/') ||
      name.startsWith('logos/svg/') ||
      name === 'README.md',
    title: 'PRINT FILES',
    note: [
      'The press-ready PDFs, the logo vectors, and the preflight note read back out',
      'of the finished files.',
      '',
      'Cut to the TrimBox, not the page edge. Files are RGB — convert with the house',
      'CMYK profile at output. Send the plain PDF to press, not the -proof-with-marks',
      'version: that one exists to approve the cut.',
      '',
      'Full details, stock recommendations and the reasoning: README.md, and page 3 of',
      'ozea-brand-guide.pdf.',
    ].join('\n'),
    stamp,
  })

  return { full, printOnly }
}
