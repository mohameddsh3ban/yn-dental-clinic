// Decode the reference mesh with the same Draco build the site serves.
const fs = require('node:fs')
const path = require('node:path')
const { runInNewContext } = require('node:vm')

async function main() {
  const [publicDirectory, outputFile] = process.argv.slice(2)
  const file = fs.readFileSync(path.join(publicDirectory, 'models/ozea-skull.glb'))
  const jsonEnd = 20 + file.readUInt32LE(12)
  const gltf = JSON.parse(file.subarray(20, jsonEnd))
  const binary = file.subarray(jsonEnd + 8)
  const face = gltf.nodes.find((node) => node.name === 'face')
  const compression = gltf.meshes[face.mesh].primitives[0].extensions.KHR_draco_mesh_compression
  const view = gltf.bufferViews[compression.bufferView]
  const compressed = binary.subarray(view.byteOffset, view.byteOffset + view.byteLength)

  const decoderDirectory = path.join(publicDirectory, 'draco')
  const wrapper = fs.readFileSync(path.join(decoderDirectory, 'draco_wasm_wrapper.js'), 'utf8')
  const factory = runInNewContext(wrapper + '\nDracoDecoderModule', { require, process, __dirname: decoderDirectory, console, WebAssembly, setTimeout, clearTimeout })
  const module = await factory({ wasmBinary: fs.readFileSync(path.join(decoderDirectory, 'draco_decoder.wasm')) })
  const decoder = new module.Decoder()
  const buffer = new module.DecoderBuffer()
  const mesh = new module.Mesh()
  buffer.Init(new Int8Array(compressed), compressed.length)
  if (!decoder.DecodeBufferToMesh(buffer, mesh).ok()) throw new Error('Failed to decode the registered face')

  const reference = {}
  for (const key of ['POSITION', 'COLOR_0']) {
    const attribute = decoder.GetAttributeByUniqueId(mesh, compression.attributes[key])
    const values = new module.DracoFloat32Array()
    decoder.GetAttributeFloatForAllPoints(mesh, attribute, values)
    reference[key] = Array.from({ length: values.size() }, (_, i) => values.GetValue(i))
    module.destroy(values)
  }
  const triangle = new module.DracoInt32Array()
  reference.indices = []
  for (let i = 0; i < mesh.num_faces(); i++) {
    decoder.GetFaceFromMesh(mesh, i, triangle)
    reference.indices.push(triangle.GetValue(0), triangle.GetValue(1), triangle.GetValue(2))
  }
  for (const object of [triangle, mesh, buffer, decoder]) module.destroy(object)
  fs.writeFileSync(outputFile, JSON.stringify(reference))
}

main().catch((err) => {
  console.error(err.message)
  process.exitCode = 1
})
