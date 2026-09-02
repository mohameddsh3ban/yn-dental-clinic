/**
 * A minimal ZIP writer, so the kit can be handed over as one file.
 *
 * Written out rather than pulled in: `zip` and `7z` are not on this machine,
 * PowerShell's `Compress-Archive` would tie the build to Windows, and an archive
 * library is a dependency tree for ninety lines of a format that has not changed
 * since 1993. Everything here is the classic 32-bit ZIP — local headers, a
 * central directory, an end-of-central-directory record — which is what every
 * unzipper on a printer's desk expects.
 *
 * Deliberately not implemented: Zip64 (no file here is near 4 GB and no archive
 * is near 65 535 entries), encryption, and data descriptors. If a kit ever grows
 * past those limits this writer must be replaced, not stretched.
 */
import { deflateRawSync } from 'node:zlib'

/** CRC-32, the polynomial ZIP has always used. Table built once per process. */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buffer) {
  let crc = 0xffffffff
  for (let i = 0; i < buffer.length; i++) crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

/** MS-DOS packed date and time. Two-second resolution, and 1980 is year zero. */
function dosStamp(date) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1)
  const day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  return { time, day }
}

/**
 * Builds the archive in memory and returns it as one Buffer.
 *
 * `entries` is `[{ name, data }]`, where `name` is the path inside the archive
 * using forward slashes. Directory entries are not written: every unzipper
 * creates the folders from the paths, and an archive that lists them twice is
 * only more to get wrong.
 *
 * Each member is stored uncompressed when deflate fails to beat it, which is the
 * usual case for the PNGs and the woff2 files — spending CPU to make a file
 * bigger is the one thing a packer should never do.
 */
export function zip(entries, { date = new Date() } = {}) {
  const { time, day } = dosStamp(date)
  const locals = []
  const central = []
  let offset = 0

  for (const { name, data } of entries) {
    const raw = Buffer.isBuffer(data) ? data : Buffer.from(data)
    const nameBytes = Buffer.from(name, 'utf8')
    const deflated = deflateRawSync(raw, { level: 9 })
    const useDeflate = deflated.length < raw.length
    const body = useDeflate ? deflated : raw
    const method = useDeflate ? 8 : 0
    const crc = crc32(raw)

    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4) // version needed
    local.writeUInt16LE(0x0800, 6) // UTF-8 names
    local.writeUInt16LE(method, 8)
    local.writeUInt16LE(time, 10)
    local.writeUInt16LE(day, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(body.length, 18)
    local.writeUInt32LE(raw.length, 22)
    local.writeUInt16LE(nameBytes.length, 26)
    local.writeUInt16LE(0, 28) // no extra field
    locals.push(local, nameBytes, body)

    const entry = Buffer.alloc(46)
    entry.writeUInt32LE(0x02014b50, 0)
    entry.writeUInt16LE(20, 4) // version made by
    entry.writeUInt16LE(20, 6) // version needed
    entry.writeUInt16LE(0x0800, 8)
    entry.writeUInt16LE(method, 10)
    entry.writeUInt16LE(time, 12)
    entry.writeUInt16LE(day, 14)
    entry.writeUInt32LE(crc, 16)
    entry.writeUInt32LE(body.length, 20)
    entry.writeUInt32LE(raw.length, 24)
    entry.writeUInt16LE(nameBytes.length, 28)
    entry.writeUInt16LE(0, 30) // extra
    entry.writeUInt16LE(0, 32) // comment
    entry.writeUInt16LE(0, 34) // disk number
    entry.writeUInt16LE(0, 36) // internal attributes
    entry.writeUInt32LE(0o644 << 16, 38) // external attributes: a regular file
    entry.writeUInt32LE(offset, 42)
    central.push(entry, nameBytes)

    offset += local.length + nameBytes.length + body.length
  }

  if (entries.length > 0xffff) {
    throw new Error(`${entries.length} entries needs Zip64, which zip.mjs does not write`)
  }

  const directory = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(0, 4) // this disk
  end.writeUInt16LE(0, 6) // disk with the directory
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(directory.length, 12)
  end.writeUInt32LE(offset, 16)
  end.writeUInt16LE(0, 20) // no archive comment

  return Buffer.concat([...locals, directory, end])
}
