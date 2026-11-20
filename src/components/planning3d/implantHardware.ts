import * as THREE from 'three'

export type ImplantHardwareMaterials = {
  titanium: THREE.MeshStandardMaterial
  polished: THREE.MeshStandardMaterial
  abutment: THREE.MeshStandardMaterial
  inner: THREE.MeshStandardMaterial
}

type ThreadSurfaceOptions = {
  top: number
  bottom: number
  topRadius: number
  bottomRadius: number
  turns: number
  height: number
  radialSegments?: number
  axialSegments?: number
  apicalFlutes?: boolean
}

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1)
  return x * x * (3 - 2 * x)
}

/**
 * Builds a continuous machined screw surface rather than wrapping a decorative
 * tube around a cylinder. The asymmetric radial profile gives every helical
 * revolution a steep load flank, crest land and longer relief flank.
 */
function createButtressSurface(options: ThreadSurfaceOptions) {
  const radialSegments = options.radialSegments ?? 112
  const axialSegments = options.axialSegments ?? Math.max(180, Math.ceil(options.turns * 24))
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  for (let row = 0; row <= axialSegments; row++) {
    const axial = row / axialSegments
    const y = THREE.MathUtils.lerp(options.top, options.bottom, axial)
    const bodyRadius = THREE.MathUtils.lerp(options.topRadius, options.bottomRadius, axial)
    for (let column = 0; column <= radialSegments; column++) {
      const theta = (column / radialSegments) * Math.PI * 2
      const cycle = THREE.MathUtils.euclideanModulo(axial * options.turns - theta / (Math.PI * 2), 1)
      // Buttress cross-section: short steep load flank, narrow rounded crest,
      // then a deliberately longer pressure-relief flank down to the root.
      const rise = smoothstep(0.03, 0.17, cycle)
      const fall = 1 - smoothstep(0.43, 0.93, cycle)
      const crestRound = 0.94 + 0.06 * Math.sin(THREE.MathUtils.clamp((cycle - 0.17) / 0.26, 0, 1) * Math.PI)
      const ridge = Math.min(rise, fall) * crestRound * options.height
      // Three flute reliefs are cut into the apical turns themselves. This is
      // a local reduction in the manifold surface, not a dark mesh laid over it.
      let fluteRelief = 0
      if (options.apicalFlutes && axial > 0.66) {
        const lowerThird = smoothstep(0.66, 0.79, axial) * (1 - smoothstep(0.96, 1, axial))
        for (let flute = 0; flute < 3; flute++) {
          const centre = flute * Math.PI * 2 / 3
          const delta = Math.abs(Math.atan2(Math.sin(theta - centre), Math.cos(theta - centre)))
          fluteRelief = Math.max(fluteRelief, (1 - smoothstep(0.08, 0.31, delta)) * lowerThird * 0.105)
        }
      }
      const radius = bodyRadius + ridge - fluteRelief
      positions.push(Math.cos(theta) * radius, y, Math.sin(theta) * radius)
      uvs.push(column / radialSegments, 1 - axial)
    }
  }

  for (let row = 0; row < axialSegments; row++) {
    for (let column = 0; column < radialSegments; column++) {
      const a = row * (radialSegments + 1) + column
      const b = a + radialSegments + 1
      // Rows run from coronal to apical (-Y); this order keeps the normals
      // facing outward from the implant at theta zero and around the seam.
      indices.push(a, a + 1, b, b, a + 1, b + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function lathe(profile: Array<[number, number]>, material: THREE.Material, segments = 96) {
  const geometry = new THREE.LatheGeometry(profile.map(([radius, y]) => new THREE.Vector2(radius, y)), segments)
  // LatheGeometry's native winding is correct for ascending exterior profiles
  // (the shoulder and abutment). Only the coronal-to-apical descending apex
  // needs a flip; flipping every lathe turns the shoulder inside-out.
  const index = geometry.getIndex()
  const descending = profile.at(-1)![1] < profile[0][1]
  if (index && descending) {
    for (let triangle = 0; triangle < index.count; triangle += 3) {
      const second = index.getX(triangle + 1)
      index.setX(triangle + 1, index.getX(triangle + 2))
      index.setX(triangle + 2, second)
    }
    index.needsUpdate = true
  }
  geometry.computeVertexNormals()
  return new THREE.Mesh(geometry, material)
}

/** A circular countersink that resolves into a genuinely recessed female hex. */
function createHexCavity({
  outerRadius,
  innerApothem,
  top,
  bottom,
  rim,
  inner,
}: {
  outerRadius: number
  innerApothem: number
  top: number
  bottom: number
  rim: THREE.Material
  inner: THREE.Material
}) {
  const segments = 72
  const topPositions: number[] = []
  const topUvs: number[] = []
  const topIndices: number[] = []
  const wallPositions: number[] = []
  const wallUvs: number[] = []
  const wallIndices: number[] = []
  const hexRadiusAt = (theta: number) => {
    const local = THREE.MathUtils.euclideanModulo(theta + Math.PI / 6, Math.PI / 3) - Math.PI / 6
    return innerApothem / Math.cos(local)
  }

  for (let index = 0; index <= segments; index++) {
    const theta = index / segments * Math.PI * 2
    const outerX = Math.cos(theta) * outerRadius
    const outerZ = Math.sin(theta) * outerRadius
    const innerRadius = hexRadiusAt(theta)
    const innerX = Math.cos(theta) * innerRadius
    const innerZ = Math.sin(theta) * innerRadius
    topPositions.push(outerX, top, outerZ, innerX, top, innerZ)
    topUvs.push(index / segments, 0, index / segments, 1)
    wallPositions.push(innerX, top, innerZ, innerX, bottom, innerZ)
    wallUvs.push(index / segments, 0, index / segments, 1)
  }
  for (let index = 0; index < segments; index++) {
    const a = index * 2
    const next = a + 2
    // Upward-facing countersink surface.
    topIndices.push(a, a + 1, next, next, a + 1, next + 1)
    // The cavity's front faces point into the hole, so they remain visible
    // when the camera looks down through the socket.
    wallIndices.push(a, a + 1, next, a + 1, next + 1, next)
  }

  const rimGeometry = new THREE.BufferGeometry()
  rimGeometry.setAttribute('position', new THREE.Float32BufferAttribute(topPositions, 3))
  rimGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(topUvs, 2))
  rimGeometry.setIndex(topIndices)
  rimGeometry.computeVertexNormals()
  const wallGeometry = new THREE.BufferGeometry()
  wallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(wallPositions, 3))
  wallGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(wallUvs, 2))
  wallGeometry.setIndex(wallIndices)
  wallGeometry.computeVertexNormals()

  const cavity = new THREE.Group()
  const countersink = new THREE.Mesh(rimGeometry, rim)
  countersink.name = 'circular-to-female-hex-countersink'
  const walls = new THREE.Mesh(wallGeometry, inner)
  walls.name = 'female-hex-inside-walls'
  const floor = new THREE.Mesh(new THREE.CircleGeometry(innerApothem * 0.98, 6), inner)
  floor.name = 'recessed-hex-cavity-floor'
  floor.rotation.x = -Math.PI / 2
  floor.position.y = bottom - 0.001
  cavity.add(countersink, walls, floor)
  return cavity
}

/**
 * A generic educational implant based on tapered bone-level implant anatomy.
 * It is intentionally not a model of, or marked as, any manufacturer product.
 */
export function createImplantHardware(materials: ImplantHardwareMaterials): {
  fixture: THREE.Group
  abutment: THREE.Group
} {
  const fixture = new THREE.Group()
  fixture.name = 'implant-fixture-hardware'

  // Main threaded body: widest at the crestal platform, tapering toward apex.
  const body = new THREE.Mesh(createButtressSurface({
    top: -0.56,
    bottom: -3.82,
    topRadius: 0.84,
    bottomRadius: 0.62,
    turns: 8.9,
    height: 0.15,
    radialSegments: 80,
    axialSegments: 144,
    apicalFlutes: true,
  }), materials.titanium)
  body.name = 'buttress-threaded-body'

  // Fine microthreads reduce abruptly at the neck, offering a visibly distinct
  // crestal interface while sharing the same tapered axis as the body.
  const microthreads = new THREE.Mesh(createButtressSurface({
    top: 0.03,
    bottom: -0.68,
    topRadius: 0.9,
    bottomRadius: 0.82,
    turns: 5.9,
    height: 0.06,
    radialSegments: 64,
    axialSegments: 84,
  }), materials.polished)
  microthreads.name = 'neck-microthreads'

  // The crest ring terminates at an open countersink; the female hex itself is
  // built below as a cavity, never as a solid hex head.
  const neckBevel = lathe([
    [0.84, -0.04], [0.91, 0.015], [0.95, 0.10], [0.93, 0.17], [0.84, 0.22], [0.68, 0.22], [0.61, 0.19],
  ], materials.polished)
  neckBevel.name = 'annular-crestal-bevel'
  const socket = createHexCavity({
    outerRadius: 0.61,
    innerApothem: 0.285,
    top: 0.19,
    bottom: -0.04,
    rim: materials.polished,
    inner: materials.inner,
  })
  socket.name = 'recessed-indexing-socket'

  // Rounded apex continues the surfaced flute area without turning it into a
  // sharp decorative cone.
  const apex = lathe([
    [0.66, -3.62], [0.63, -3.82], [0.56, -4.06], [0.44, -4.28], [0.27, -4.43], [0.10, -4.50], [0, -4.52],
  ], materials.titanium)
  apex.name = 'rounded-apical-tip'
  fixture.add(body, microthreads, neckBevel, socket, apex)

  const abutment = new THREE.Group()
  abutment.name = 'implant-abutment-hardware'

  // Hex indexing stem is deliberately carried below the fixture platform.
  const indexStem = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.26, 0.86, 6), materials.polished)
  indexStem.name = 'hex-indexing-stem'
  indexStem.position.y = -0.32
  const emergenceShoulder = lathe([
    [0.31, -0.02], [0.50, 0.00], [0.72, 0.09], [0.79, 0.18], [0.73, 0.29], [0.61, 0.42], [0.52, 0.54],
  ], materials.abutment)
  emergenceShoulder.name = 'emergence-shoulder'
  const taperedCore = lathe([
    [0.52, 0.46], [0.48, 0.76], [0.43, 1.08], [0.42, 1.31], [0.51, 1.44], [0.57, 1.52],
  ], materials.abutment)
  taperedCore.name = 'tapered-abutment-core'
  const occlusalBevel = lathe([
    [0.57, 1.50], [0.60, 1.57], [0.56, 1.65], [0.38, 1.65], [0.32, 1.61],
  ], materials.polished)
  occlusalBevel.name = 'occlusal-bevel'
  const screwChannel = createHexCavity({
    outerRadius: 0.32,
    innerApothem: 0.145,
    top: 1.61,
    bottom: 1.45,
    rim: materials.polished,
    inner: materials.inner,
  })
  screwChannel.name = 'recessed-occlusal-screw-channel'
  abutment.add(indexStem, emergenceShoulder, taperedCore, occlusalBevel, screwChannel)

  return { fixture, abutment }
}
