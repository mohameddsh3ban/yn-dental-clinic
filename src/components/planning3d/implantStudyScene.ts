import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { createImplantHardware } from './implantHardware'
import { studioEnvironment, titaniumGrain } from './implantStudio'

export type ImplantPart = 'crown' | 'abutment' | 'fixture'
export type ImplantStudyScene = {
  setAmount: (amount: number) => void
  inspect: (part: ImplantPart | null) => void
  rotate: (degrees: number) => void
  dispose: () => void
}
type Options = { host: HTMLElement; tooth: number; amount: number; signal: AbortSignal; onReady: () => void }

function disposeModel(object: THREE.Object3D) {
  const materials = new Set<THREE.Material>()
  const geometries = new Set<THREE.BufferGeometry>()
  object.traverse(child => {
    const mesh = child as THREE.Mesh
    if (!mesh.isMesh) return
    geometries.add(mesh.geometry)
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) materials.add(material)
  })
  geometries.forEach(geometry => geometry.dispose())
  materials.forEach(material => material.dispose())
}

// A subtle cervical tint gives the polished ceramic a warmer base. The chewing
// surface retains the relief and vertex normals from the anatomical mesh.
function shadeCrown(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox()
  const box = geometry.boundingBox!
  const points = geometry.getAttribute('position')
  const normals = geometry.getAttribute('normal')
  const colors = new Float32Array(points.count * 3)
  const neck = new THREE.Color('#c4a47c')
  const tip = new THREE.Color('#eee6d5')
  const fissure = new THREE.Color('#a89377')
  // Sample the local horizon over the actual chewing surface. Recessed areas
  // receive less studio light than exposed cusps. Deriving this from the mesh
  // keeps the fissures in register as the tooth turns.
  const cells = 36
  const top = new Float32Array(cells * cells).fill(-Infinity)
  const size = box.getSize(new THREE.Vector3())
  const cell = Math.max(size.x, size.z) / (cells - 1)
  const cellX = (i: number) => Math.min(cells - 1, Math.round((points.getX(i) - box.min.x) / cell))
  const cellZ = (i: number) => Math.min(cells - 1, Math.round((points.getZ(i) - box.min.z) / cell))
  for (let i = 0; i < points.count; i++) {
    const idx = cellZ(i) * cells + cellX(i)
    top[idx] = Math.max(top[idx], points.getY(i))
  }
  const shade = new THREE.Color()
  for (let i = 0; i < points.count; i++) {
    const y = (points.getY(i) - box.min.y) / size.y
    shade.copy(neck).lerp(tip, 0.19 + 0.81 * Math.sin(Math.max(0,y) * Math.PI / 2))
    if (y > 0.48 && normals && normals.getY(i) > 0.15) {
      let horizon = 0
      for (const [dx, dz] of [[3,0],[-3,0],[0,3],[0,-3],[3,3],[-3,-3],[3,-3],[-3,3]]) {
        const x = cellX(i) + dx
        const z = cellZ(i) + dz
        if (x < 0 || x >= cells || z < 0 || z >= cells) continue
        const rise = (top[z * cells + x] - points.getY(i)) / (cell * Math.hypot(dx, dz))
        horizon += THREE.MathUtils.clamp(rise, 0, 1)
      }
      shade.lerp(fissure, Math.min(0.77, horizon / 8 * 1.65))
    }
    shade.toArray(colors, i * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}

export async function createImplantStudyScene({ host, tooth, amount, signal, onReady }: Options): Promise<ImplantStudyScene> {
  signal.throwIfAborted()
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.96
  Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block', pointerEvents: 'none' })
  renderer.domElement.setAttribute('aria-hidden','true')
  host.append(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 65)
  const environment = studioEnvironment(renderer)
  scene.environment = environment.texture
  scene.environmentRotation.y = -0.4
  const key = new THREE.DirectionalLight(0xfff3dd, 1.75)
  key.position.set(-4, 8, 4)
  const rim = new THREE.DirectionalLight(0xc6dfff, 0.85)
  rim.position.set(5, 3, -6)
  scene.add(key, rim, new THREE.HemisphereLight(0xf5f7ff, 0x4b3f32, 0.46))

  const grain = titaniumGrain()
  const titanium = new THREE.MeshStandardMaterial({color: 0x999fa4, metalness: 0.95, roughness: 0.53, roughnessMap: grain, bumpMap: grain, bumpScale: 0.007})
  const polished = new THREE.MeshStandardMaterial({color: 0xc4c8cc, metalness: 1, roughness: 0.23})
  const connector = new THREE.MeshStandardMaterial({color: 0xc8ad80, metalness: 0.96, roughness: 0.29, roughnessMap: grain})
  const inner = new THREE.MeshStandardMaterial({color: 0x626268, metalness: 0.86, roughness: 0.42})
  const ceramic = new THREE.MeshPhysicalMaterial({vertexColors: true, roughness: 0.33, clearcoat: 0.40, clearcoatRoughness: 0.20, ior: 1.50, envMapIntensity: 0.55})
  const { fixture, abutment } = createImplantHardware({titanium, polished, abutment: connector, inner})
  const crown = new THREE.Group()
  const parts = { crown, abutment, fixture }
  const root = new THREE.Group()
  root.rotation.set(0.04, -0.27, -0.24)
  root.add(crown, abutment, fixture)
  scene.add(root)

  let separation = amount
  let part: ImplantPart | null = null
  let disposed = false
  let width = 0
  let height = 0

  function render() {
    if (disposed || !host.clientWidth || !host.clientHeight) return
    if (width !== host.clientWidth || height !== host.clientHeight) {
      width = host.clientWidth
      height = host.clientHeight
      renderer.setSize(width, height, false)
    }
    crown.position.y = separation * 4.25
    abutment.position.y = separation * 0.90
    fixture.position.y = -separation * 1.55
    for (const [key, object] of Object.entries(parts)) object.visible = !part || part === key
    root.updateMatrixWorld(true)
    // Frame the whole pose at either slider endpoint. For a detail view the
    // optics move closer and higher, revealing the socket or the molar's cusps.
    const center = part ? new THREE.Box3().setFromObject(parts[part]).getCenter(new THREE.Vector3()) : new THREE.Vector3(0, -0.17 + 0.75 * separation, 0)
    const direction = part === 'crown' ? new THREE.Vector3(0.42, 1.45, 0.72) : part === 'abutment' ? new THREE.Vector3(0.58, 0.9, 1.05) : new THREE.Vector3(0.35, 0.48, 1)
    camera.position.copy(center).addScaledVector(direction.normalize(), 25)
    camera.lookAt(center)
    const aspect = width / height
    const span = part === 'crown' ? Math.max(4.6, 4.35 / aspect)
      : part === 'abutment' ? Math.max(3.7, 3.45 / aspect)
      : part === 'fixture' ? Math.max(5.55, 3.35 / aspect)
      : Math.max(8.85 + 4.15 * separation, 5.45 / aspect)
    camera.top = span / 2
    camera.bottom = -span / 2
    camera.right = span * aspect / 2
    camera.left = -camera.right
    camera.updateProjectionMatrix()
    renderer.render(scene, camera)
  }

  const loader = new GLTFLoader()
  const draco = new DRACOLoader()
  draco.setDecoderPath('/draco/')
  loader.setDRACOLoader(draco)
  const observer = new ResizeObserver(render)
  observer.observe(host)
  function dispose() {
    if (disposed) return
    disposed = true
    signal.removeEventListener('abort', dispose)
    observer.disconnect()
    disposeModel(root)
    ceramic.dispose()
    grain.dispose()
    environment.dispose()
    renderer.domElement.remove()
    renderer.dispose()
    renderer.forceContextLoss()
  }
  signal.addEventListener('abort', dispose, { once: true })
  try {
    const referenceMolar = tooth === 46 || tooth === 36
    const gltf = await loader.loadAsync(referenceMolar ? '/models/implant-molar.glb' : '/models/ozea-skull.glb')
    try {
      signal.throwIfAborted()
      const source = referenceMolar ? gltf.scene : gltf.scene.getObjectByName(`crown_${tooth}`)
      if (!source) throw new Error('Missing crown')
      gltf.scene.updateMatrixWorld(true)
      const surface = new THREE.Group()
      source.traverse(child => {
        const mesh = child as THREE.Mesh
        if (!mesh.isMesh) return
        const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld)
        if (tooth < 31) geometry.rotateX(Math.PI)
        shadeCrown(geometry)
        surface.add(new THREE.Mesh(geometry, ceramic))
      })
      const box = new THREE.Box3().setFromObject(surface)
      const size = box.getSize(new THREE.Vector3())
      const crownWidth = tooth % 10 >= 6 ? 3.45 : 2.65
      surface.scale.setScalar(Math.min(crownWidth / Math.max(size.x,size.z), 3.05 / size.y))
      box.setFromObject(surface)
      const center = box.getCenter(new THREE.Vector3())
      surface.position.set(-center.x, 0.52 - box.min.y, -center.z)
      crown.add(surface)
      if (referenceMolar && tooth === 36) crown.scale.x = -1
    } finally {
      disposeModel(gltf.scene)
    }
    render()
    onReady()
  } catch (error) {
    dispose()
    throw error
  } finally {
    draco.dispose()
  }

  return {
    setAmount(value) { separation = THREE.MathUtils.clamp(value, 0, 1); render() },
    inspect(next) { part = next; render() },
    rotate(degrees) { root.rotation.y = -0.27 + THREE.MathUtils.degToRad(degrees); render() },
    dispose,
  }
}
