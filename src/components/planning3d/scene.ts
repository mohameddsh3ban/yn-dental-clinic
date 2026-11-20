// The WebGL half of the planning viewer. Nothing in here knows about React:
// `PlanningViewer.tsx` imports this module dynamically, inside an effect, so
// three.js is never part of the server render or of any other page's bundle.
//
// The model (public/models/ozea-skull.glb) and its rig are produced by
// `scripts/planning3d/build.py`: a reference skull cut into the segments each
// operation frees, the plates that hold them, every tooth with a crown of its
// own, one implant, and a head fitted over the bone.
// Model space is centimetres, +Y up, +Z out of the face, +X the patient's left.
//
// Performance notes, because this has to stay smooth on integrated graphics:
//   - nothing renders unless something changed, and never above ~60 fps;
//   - the shadow map is redrawn only when the bone moves, not when the camera
//     does;
//   - while the model is being turned the canvas drops to one device pixel per
//     CSS pixel, and sharpens again the moment it comes to rest.

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import {
  CASES,
  LANDMARK_KEYS,
  phases,
  plateProgress,
  type CaseId,
  type LandmarkKey,
  type LayerId,
  type ToothWork,
  type ViewId,
} from './cases'

import type { CameraPose } from './sharedView'

type V3 = [number, number, number]

type Rig = {
  pose: Record<'maxilla' | 'mand_distal' | 'chin', V3>
  traumaBefore: Record<string, { t: V3; axis: V3; deg: number; pivot: V3 }>
  plates: Record<string, { anchor: string; color: string; group: string; normal: V3; center: V3 }>
  screws: { plate: string; p: V3; n: V3 }[]
  cutLines: Record<string, V3[][]>
  landmarks: Record<string, { p: V3; n: V3 }>
  teeth: { id: number; upper: boolean; axis: V3; cej: V3; tip: V3; apex: V3; r: number }[]
}

export type LabelPoint = { key: LandmarkKey; x: number; y: number; visible: boolean }

export type ViewerOptions = {
  /** The element the canvas is created in and sized to. */
  host: HTMLElement
  label: string
  still: boolean
  onProgress?: (fraction: number) => void
  onLabels?: (points: LabelPoint[]) => void
  onInteract?: () => void
  /** A tooth was clicked (only while the teeth case is showing). */
  onPickTooth?: (id: number) => void
}

export type Viewer = {
  setCase: (id: CaseId, instant?: boolean) => void
  setProgress: (p: number) => void
  zoom: (factor: number) => void
  setView: (view: ViewId) => void
  setXray: (on: boolean) => void
  setLabels: (on: boolean) => void
  setLayer: (layer: LayerId, on: boolean) => void
  setSection: (amount: number) => void
  /** The soft-tissue layer over the bone, and how solid it is (0–1). */
  setFace: (on: boolean) => void
  setFaceOpacity: (amount: number) => void
  /** What is done to one tooth; the change is animated. */
  setTooth: (id: number, work: ToothWork, instant?: boolean) => void
  setSelectedTooth: (id: number | null) => void
  /** Full screen: the canvas takes every gesture instead of sharing them with the page. */
  setImmersive: (on: boolean) => void
  captureCamera: () => CameraPose
  restoreCamera: (pose: CameraPose) => void
  reset: () => void
  dispose: () => void
}

const MODEL_URL = '/models/ozea-skull.glb'
const RIG_URL = '/models/ozea-skull.rig.json'
const TEXTURED_FACE_URL = '/models/ozea-face-textured.glb'
const DRACO_PATH = '/draco/'

const ORTHO = ['cranium', 'zygoma', 'maxilla', 'mand_prox_L', 'mand_prox_R', 'mand_distal', 'chin']
const TRAUMA = ['cranium', 'zygoma', 'maxilla', 'frag_R', 'frag_M', 'frag_L']
const ALL = [...new Set([...ORTHO, ...TRAUMA])]

const LAYER_OF: Record<string, LayerId> = {
  cranium: 'cranium',
  zygoma: 'cranium',
  maxilla: 'maxilla',
  mand_prox_L: 'mandible',
  mand_prox_R: 'mandible',
  mand_distal: 'mandible',
  chin: 'mandible',
  frag_R: 'mandible',
  frag_M: 'mandible',
  frag_L: 'mandible',
}

const VIEW_DIR: Record<ViewId, V3> = {
  front: [0, 0.03, 1],
  left: [1, 0.03, 0.14],
  right: [-1, 0.03, 0.14],
  quarter: [0.62, 0.12, 0.78],
  below: [0.34, -0.6, 0.72],
}

// Anodised titanium: the colour is an oxide layer, so it reads as tinted metal.
const TITANIUM: Record<string, number> = {
  blue: 0x2f55c8,
  gold: 0xc79f55,
  green: 0x8f9a55,
  teal: 0x2f9aa6,
  grey: 0x9aa0a8,
}

/** Seconds each tooth animation takes. */
const TOOTH_SECONDS: Record<ToothWork, number> = { natural: 0.01, implant: 3.6, crown: 2.4 }

const FRAME_MS = 1000 / 62
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const span = (t: number, from: number, to: number) => clamp01((t - from) / (to - from))
const v3 = (a: V3) => new THREE.Vector3(a[0], a[1], a[2])

export async function createViewer(opts: ViewerOptions): Promise<Viewer> {
  const { host } = opts

  // A canvas of its own, so a remount never shares a GL context with the last one.
  const canvas = document.createElement('canvas')
  canvas.setAttribute('role', 'img')
  canvas.setAttribute('aria-label', opts.label)
  canvas.style.cssText = 'display:block;width:100%;height:100%;outline:none;cursor:grab'
  host.appendChild(canvas)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  // Phones have dense screens and a small canvas; desktops the reverse.
  const touch = window.matchMedia('(pointer: coarse)').matches
  const SHARP = Math.min(window.devicePixelRatio || 1, touch ? 2 : 1.5)
  const QUICK = Math.min(SHARP, 1)
  let ratio = SHARP
  renderer.setPixelRatio(ratio)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.9
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  // The light never moves, so shadows only change when the bone does.
  renderer.shadowMap.autoUpdate = false
  renderer.localClippingEnabled = true
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envTarget.texture

  const camera = new THREE.PerspectiveCamera(26, 1, 1, 400)

  const key = new THREE.DirectionalLight(0xfff1df, 2.6)
  key.position.set(-11, 16, 12)
  key.castShadow = true
  key.shadow.mapSize.set(touch ? 1024 : 2048, touch ? 1024 : 2048)
  key.shadow.camera.left = -11
  key.shadow.camera.right = 11
  key.shadow.camera.top = 15
  key.shadow.camera.bottom = -11
  key.shadow.camera.near = 2
  key.shadow.camera.far = 60
  key.shadow.bias = -0.0006
  key.shadow.normalBias = 0.06
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xdfe9ff, 0.7)
  rim.position.set(14, 6, -10)
  scene.add(rim)
  const fill = new THREE.DirectionalLight(0xffffff, 0.22)
  fill.position.set(10, -6, 12)
  scene.add(fill)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.12
  controls.rotateSpeed = 0.8
  controls.zoomSpeed = 0.8
  controls.minDistance = 8
  controls.maxDistance = 95
  controls.screenSpacePanning = true
  // The page keeps vertical swipes and the wheel until the model has been
  // touched, so scrolling past the viewer never gets caught in it.
  let immersive = false
  canvas.style.touchAction = 'pan-y'
  controls.enableZoom = false

  // ---- materials -----------------------------------------------------------

  const ghost = { value: 0 }
  const clip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 100)
  const planes = [clip]

  /** X-ray: bone fades where it faces the eye and holds at its silhouette. */
  function ghostable<T extends THREE.MeshStandardMaterial>(material: T): T {
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uGhost = ghost
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uGhost;')
        .replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
          float rimTerm = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition)));
          gl_FragColor.a *= mix(1.0, 0.07 + 0.78 * pow(rimTerm, 1.7), uGhost);`,
        )
    }
    return material
  }

  const bone = ghostable(
    new THREE.MeshStandardMaterial({
      color: 0xe4d9c2,
      roughness: 0.72,
      metalness: 0,
      vertexColors: true,
      envMapIntensity: 0.26,
      clippingPlanes: planes,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
  )
  const cut = ghostable(
    new THREE.MeshStandardMaterial({
      color: 0xdcb9a0,
      roughness: 0.9,
      metalness: 0,
      envMapIntensity: 0.35,
      clippingPlanes: planes,
    }),
  )
  const enamelProps = {
    color: 0xfbf7ee,
    roughness: 0.24,
    metalness: 0,
    clearcoat: 0.55,
    clearcoatRoughness: 0.25,
    vertexColors: true,
    envMapIntensity: 0.55,
    clippingPlanes: planes,
  }
  const enamel = new THREE.MeshPhysicalMaterial(enamelProps)
  // The tooth under the pointer, in the teeth case.
  const enamelHover = new THREE.MeshPhysicalMaterial({
    ...enamelProps,
    emissive: 0xc0a578,
    emissiveIntensity: 0.32,
  })
  // New porcelain: whiter and glossier than the teeth beside it.
  const ceramic = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 0.95,
    clippingPlanes: planes,
  })
  const implantMetal = new THREE.MeshStandardMaterial({
    color: 0xa9adb3,
    roughness: 0.42,
    metalness: 1,
    envMapIntensity: 1.2,
    clippingPlanes: planes,
  })
  const abutmentMetal = new THREE.MeshStandardMaterial({
    color: 0xcfc6b0,
    roughness: 0.28,
    metalness: 1,
    envMapIntensity: 1.3,
    clippingPlanes: planes,
  })
  const screwMetal = new THREE.MeshStandardMaterial({
    color: 0x5a52c9,
    roughness: 0.3,
    metalness: 1,
    envMapIntensity: 1.25,
    clippingPlanes: planes,
  })
  const slotMetal = new THREE.MeshStandardMaterial({ color: 0x15132b, roughness: 0.6, metalness: 0.8 })
  const markGold = new THREE.MeshBasicMaterial({ color: 0xc0a578, depthTest: false, transparent: true })
  const ink = new THREE.Color(0x14120f)

  // ---- load ----------------------------------------------------------------

  const draco = new DRACOLoader()
  draco.setDecoderPath(DRACO_PATH)
  const loader = new GLTFLoader()
  loader.setDRACOLoader(draco)

  const [gltf, rig] = await Promise.all([
    loader.loadAsync(MODEL_URL, (e) => {
      if (e.total > 0) opts.onProgress?.(e.loaded / e.total)
    }),
    fetch(RIG_URL).then((r) => {
      if (!r.ok) throw new Error(`rig ${r.status}`)
      return r.json() as Promise<Rig>
    }),
  ])
  draco.dispose()

  const root = gltf.scene
  scene.add(root)

  /** Bake the stored occlusion into a warm-shadowed bone tint. */
  function tint(geometry: THREE.BufferGeometry) {
    const src = geometry.getAttribute('color')
    if (!src) return
    const out = new Float32Array(src.count * 3)
    for (let i = 0; i < src.count; i++) {
      const ao = Math.pow(clamp01(src.getX(i)), 1.9)
      const k = 0.08 + 0.92 * ao
      out[i * 3] = k
      out[i * 3 + 1] = k * (0.92 + 0.08 * ao)
      out[i * 3 + 2] = k * (0.82 + 0.18 * ao)
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(out, 3))
  }

  function eachMesh(node: THREE.Object3D, fn: (mesh: THREE.Mesh) => void) {
    node.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh) fn(mesh)
    })
  }

  const segments = new Map<string, THREE.Object3D>()
  /** Teeth that are part of a fracture fragment rather than objects of their own. */
  const fragmentTeeth: THREE.Mesh[] = []
  for (const name of ALL) {
    const node = root.getObjectByName(name)
    if (!node) throw new Error(`model is missing ${name}`)
    segments.set(name, node)
    eachMesh(node, (mesh) => {
      const kind = (mesh.material as THREE.Material).name
      mesh.castShadow = true
      mesh.receiveShadow = true
      if (kind === 'teeth') {
        tint(mesh.geometry)
        mesh.material = enamel
        fragmentTeeth.push(mesh)
      } else if (kind === 'cut') {
        mesh.material = cut
        mesh.castShadow = false
      } else {
        tint(mesh.geometry)
        mesh.material = bone
      }
    })
  }

  // ---- teeth: each one its own object, riding on its jaw ---------------------

  const implantSrc = root.getObjectByName('implant')
  const abutmentSrc = root.getObjectByName('abutment')
  implantSrc?.removeFromParent()
  abutmentSrc?.removeFromParent()
  if (implantSrc) eachMesh(implantSrc, (m) => ((m.material = implantMetal), (m.castShadow = false)))
  if (abutmentSrc) eachMesh(abutmentSrc, (m) => ((m.material = abutmentMetal), (m.castShadow = false)))

  const up = new THREE.Vector3(0, 1, 0)

  type Tooth = {
    id: number
    node: THREE.Object3D
    mesh: THREE.Mesh | null
    crown: THREE.Object3D | null
    axis: THREE.Vector3
    cej: THREE.Vector3
    centre: THREE.Vector3
    radius: number
    rootLength: number
    jaw: THREE.Object3D
    /** Built the first time this tooth gets an implant. */
    fixture: THREE.Object3D | null
    post: THREE.Object3D | null
    work: ToothWork
    t: number
  }
  const teeth = new Map<number, Tooth>()
  const pickables: THREE.Object3D[] = []

  for (const info of rig.teeth ?? []) {
    const node = root.getObjectByName(`tooth_${info.id}`)
    const jaw = segments.get(info.upper ? 'maxilla' : 'mand_distal')
    if (!node || !jaw) continue
    let toothMesh: THREE.Mesh | null = null
    eachMesh(node, (mesh) => {
      tint(mesh.geometry)
      mesh.material = enamel
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData.tooth = info.id
      toothMesh = mesh
    })
    jaw.add(node)
    pickables.push(node)

    const crown = root.getObjectByName(`crown_${info.id}`) ?? null
    if (crown) {
      eachMesh(crown, (mesh) => {
        mesh.geometry.deleteAttribute('color')
        mesh.material = ceramic
        mesh.castShadow = false
        mesh.userData.tooth = info.id
      })
      crown.visible = false
      jaw.add(crown)
      pickables.push(crown)
    }
    const cej = v3(info.cej)
    teeth.set(info.id, {
      id: info.id,
      node,
      mesh: toothMesh,
      crown,
      axis: v3(info.axis).normalize(),
      cej,
      centre: cej.clone().add(v3(info.tip)).multiplyScalar(0.5),
      radius: info.r,
      rootLength: cej.distanceTo(v3(info.apex)),
      jaw,
      fixture: null,
      post: null,
      work: 'natural',
      t: 1,
    })
  }

  // A gold ring at the gum line marks the tooth being worked on.
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.045, 8, 48), markGold)
  ring.visible = false
  ring.renderOrder = 6
  let selected: number | null = null
  let hovered: number | null = null

  function placeRing() {
    const tooth = selected === null ? undefined : teeth.get(selected)
    if (!tooth || !pickTeeth) {
      ring.visible = false
      return
    }
    tooth.jaw.add(ring)
    ring.position.copy(tooth.cej).addScaledVector(tooth.axis, 0.06)
    // the torus lies in XY; turn its normal (Z) onto the tooth's axis
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tooth.axis)
    ring.scale.setScalar(tooth.radius * 1.25 + 0.1)
    ring.visible = true
  }

  const tmpQ = new THREE.Quaternion()
  const tmpV = new THREE.Vector3()

  function ensureImplant(tooth: Tooth) {
    if (tooth.fixture || !implantSrc || !abutmentSrc) return
    const seat = new THREE.Group()
    // the platform sits a little under the gum line
    seat.position.copy(tooth.cej).addScaledVector(tooth.axis, -0.18)
    seat.quaternion.setFromUnitVectors(up, tooth.axis)
    const girth = THREE.MathUtils.clamp(tooth.radius / 0.34, 0.72, 1.2)
    const length = THREE.MathUtils.clamp(tooth.rootLength / 1.35, 0.7, 1.05)
    const fixture = implantSrc.clone()
    fixture.scale.set(girth, length, girth)
    const post = abutmentSrc.clone()
    post.scale.set(girth, 1, girth)
    seat.add(fixture, post)
    tooth.jaw.add(seat)
    tooth.fixture = fixture
    tooth.post = post
  }

  /** Put one tooth where its state and its animation clock say it is. */
  function poseTooth(tooth: Tooth) {
    const { node, crown, axis, cej } = tooth
    const t = tooth.t
    const shown = layers.teeth
    node.position.set(0, 0, 0)
    node.quaternion.identity()
    node.scale.setScalar(1)
    node.visible = shown
    if (crown) {
      crown.visible = false
      crown.position.set(0, 0, 0)
      crown.scale.setScalar(1)
    }
    if (tooth.fixture) tooth.fixture.visible = false
    if (tooth.post) tooth.post.visible = false
    if (tooth.work === 'natural') return

    if (tooth.work === 'implant') {
      // 1. the tooth is lifted out with a quarter turn
      const out = span(t, 0, 0.26)
      if (out < 1) {
        const lift = ease(out)
        const s = 1 - 0.55 * span(out, 0.7, 1)
        tmpQ.setFromAxisAngle(axis, lift * 0.9)
        tmpV.copy(cej).applyQuaternion(tmpQ).multiplyScalar(s)
        node.quaternion.copy(tmpQ)
        node.scale.setScalar(s)
        node.position.copy(cej).sub(tmpV).addScaledVector(axis, lift * 2.4)
      } else node.visible = false
      // 2. the implant is driven into the socket
      const drive = span(t, 0.24, 0.62)
      if (tooth.fixture && drive > 0) {
        const k = easeOut(drive)
        tooth.fixture.visible = shown
        tooth.fixture.position.set(0, (1 - k) * 2.6, 0)
        tooth.fixture.rotation.set(0, (1 - k) * Math.PI * 9, 0)
      }
      // 3. the abutment goes on
      const seat = span(t, 0.58, 0.78)
      if (tooth.post && seat > 0) {
        tooth.post.visible = shown
        tooth.post.position.set(0, (1 - easeOut(seat)) * 1.9, 0)
      }
      // 4. the crown is seated
      const cap = span(t, 0.74, 1)
      if (crown && cap > 0) {
        crown.visible = shown
        crown.position.copy(axis).multiplyScalar((1 - easeOut(cap)) * 1.9)
      }
      return
    }

    // Crown: the tooth is reduced a little, then capped.
    const prep = ease(span(t, 0, 0.36))
    const s = 1 - 0.07 * prep
    node.scale.setScalar(s)
    node.position.copy(cej).multiplyScalar(1 - s)
    const cap = span(t, 0.3, 1)
    if (crown && cap > 0) {
      const grow = 1.05
      crown.visible = shown
      crown.scale.setScalar(grow)
      crown.position
        .copy(tooth.centre)
        .multiplyScalar(1 - grow)
        .addScaledVector(axis, (1 - easeOut(cap)) * 1.8)
    }
  }

  // ---- the face --------------------------------------------------------------
  // A skin drawn in two passes — depth first, then colour — so it reads as one
  // clean translucent surface with a nose, lips and ears, instead of a tangle
  // of its own back faces. Each vertex carries how far it follows the upper
  // jaw, the lower jaw and the chin.

  const faceAmount = { value: 0 }
  const faceBase = { value: 1 }
  const tissue = {
    uMax: { value: new THREE.Vector3() },
    uMand: { value: new THREE.Vector3() },
    uChin: { value: new THREE.Vector3() },
  }
  function skinMaterial(depthOnly: boolean, source?: THREE.MeshStandardMaterial, paintFeatures = true) {
    const material = new THREE.MeshStandardMaterial({
      // Matte warm-neutral skin: deliberately low environment response so the
      // registered face reads as tissue instead of polished wax.
      color: source?.color ?? 0xd4a082,
      map: source?.map ?? null,
      normalMap: source?.normalMap ?? null,
      normalScale: source?.normalScale?.clone(),
      roughnessMap: source?.roughnessMap ?? null,
      roughness: source?.roughness ?? 0.76,
      metalness: 0,
      transparent: true,
      depthWrite: depthOnly,
      colorWrite: !depthOnly,
      envMapIntensity: 0.1,
      clippingPlanes: planes,
    })
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, tissue, { uFace: faceAmount, uBase: faceBase })
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nattribute vec3 aTissue;\nuniform vec3 uMax;\nuniform vec3 uMand;\nuniform vec3 uChin;\nvarying vec3 vSkinPosition;',
        )
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\ntransformed += aTissue.r * uMax + aTissue.g * uMand + aTissue.b * uChin;\nvSkinPosition = transformed;',
        )
      const featurePaint = paintFeatures
        ? `
          // The centres below are measured from the fitted source face (not a
          // generic head): lips Y~-3/Z~8, pupils Y~3/Z~5.4 and brows above.
          float cheek = softFeature(vSkinPosition, vec3(sign(vSkinPosition.x) * 4.0, -0.25, 6.65), vec3(2.15, 1.9, 1.0));
          float lips = softFeature(vSkinPosition, vec3(0.0, -3.15, 7.92), vec3(1.92, 0.62, 1.25));
          float upperLip = softFeature(vSkinPosition, vec3(0.0, -2.80, 8.05), vec3(1.55, 0.25, 0.85));
          float brows = softFeature(vSkinPosition, vec3(sign(vSkinPosition.x) * 3.22, 4.32, 6.98), vec3(1.38, 0.38, 0.95));
          float ears = softFeature(vSkinPosition, vec3(sign(vSkinPosition.x) * 7.15, 2.05, 1.6), vec3(0.72, 1.6, 0.9));
          float nostril = softFeature(vSkinPosition, vec3(sign(vSkinPosition.x) * 0.78, -1.15, 9.05), vec3(0.34, 0.26, 0.25));
          float hairBoundary = 10.0 - 0.05 * vSkinPosition.x * vSkinPosition.x;
          float hairline = smoothstep(hairBoundary - 0.42, hairBoundary + 0.50, vSkinPosition.y) * smoothstep(5.3, 6.9, vSkinPosition.z);
          vec3 complexion = vec3(1.0);
          complexion = mix(complexion, vec3(1.06, 0.88, 0.84), clamp(cheek * 0.34 + ears * 0.22, 0.0, 1.0));
          complexion = mix(complexion, vec3(1.12, 0.67, 0.61), clamp(lips * 0.68 + upperLip * 0.16, 0.0, 1.0));
          complexion = mix(complexion, vec3(0.25, 0.17, 0.12), clamp(brows * 0.64, 0.0, 0.64));
          complexion = mix(complexion, vec3(0.28, 0.18, 0.14), clamp(nostril * 0.88, 0.0, 1.0));
          complexion = mix(complexion, vec3(0.32, 0.23, 0.17), clamp(hairline * 0.48, 0.0, 0.48));
          gl_FragColor.rgb *= complexion;`
        : ''
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uFace;\nuniform float uBase;\nvarying vec3 vSkinPosition;\nfloat softFeature(vec3 p, vec3 centre, vec3 radius) { vec3 d = (p - centre) / radius; return exp(-dot(d, d) * 2.0); }')
        .replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
          ${featurePaint}
          gl_FragColor.a *= uFace * uBase;`,
        )
    }
    return material
  }
  const skin = skinMaterial(false)
  const skinDepth = skinMaterial(true)
  const scleraMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe7e2d8,
    roughness: 0.32,
    metalness: 0,
    clearcoat: 0.22,
    clearcoatRoughness: 0.16,
    transparent: true,
    envMapIntensity: 0.32,
    clippingPlanes: planes,
  })
  const irisMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x5b4531,
    roughness: 0.38,
    metalness: 0,
    clearcoat: 0.38,
    clearcoatRoughness: 0.12,
    transparent: true,
    envMapIntensity: 0.25,
    clippingPlanes: planes,
  })
  const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x16110f, transparent: true, clippingPlanes: planes })
  // This is a very small, registered surround over the source face's orbital
  // cut-out. It is not a replacement face: the opening in the fitted scan is
  // wider than the supplied eye mesh, which otherwise exposes skull white at
  // full tissue opacity. The material is intentionally dry and close to the
  // measured base complexion so it reads as an eyelid rather than a decal.
  const eyelidMaterial = new THREE.MeshStandardMaterial({
    color: 0xd0a085,
    roughness: 0.82,
    metalness: 0,
    transparent: true,
    envMapIntensity: 0.06,
    clippingPlanes: planes,
  })

  function almondPath(path: THREE.Shape | THREE.Path, width: number, height: number) {
    const halfWidth = width * 0.5
    const halfHeight = height * 0.5
    path.moveTo(-halfWidth, 0)
    path.quadraticCurveTo(0, halfHeight, halfWidth, 0)
    path.quadraticCurveTo(0, -halfHeight, -halfWidth, 0)
  }

  function almondGeometry(width: number, height: number) {
    const shape = new THREE.Shape()
    almondPath(shape, width, height)
    return new THREE.ShapeGeometry(shape, 20)
  }

  function eyelidRingGeometry() {
    const shape = new THREE.Shape()
    almondPath(shape, 2.72, 1.34)
    const opening = new THREE.Path()
    // Three.js triangulates the path as a hole when it winds opposite to the
    // exterior. Starting on the opposite point gives us a real eye opening.
    opening.moveTo(-0.99, 0)
    opening.quadraticCurveTo(0, -0.34, 0.99, 0)
    opening.quadraticCurveTo(0, 0.34, -0.99, 0)
    shape.holes.push(opening)
    return new THREE.ShapeGeometry(shape, 20)
  }

  const faceNode = root.getObjectByName('face') ?? null
  const eyesNode = root.getObjectByName('eyes') ?? null
  const faceGroup = new THREE.Group()
  faceGroup.visible = false
  scene.add(faceGroup)
  // The supplied fitted face remains a functional, registered fallback while
  // the textured scan downloads. Keeping the two groups separate makes the
  // swap atomic: an unavailable or slow scan never leaves the skull bare.
  const fallbackFace = new THREE.Group()
  fallbackFace.name = 'fitted-face-fallback'
  faceGroup.add(fallbackFace)
  const texturedFace = new THREE.Group()
  texturedFace.name = 'textured-face-primary'
  texturedFace.visible = false
  faceGroup.add(texturedFace)
  if (faceNode) {
    eachMesh(faceNode, (mesh) => {
      const weights = mesh.geometry.getAttribute('color')
      if (weights) {
        const out = new Float32Array(weights.count * 3)
        for (let i = 0; i < weights.count; i++) {
          out[i * 3] = weights.getX(i)
          out[i * 3 + 1] = weights.getY(i)
          out[i * 3 + 2] = weights.getZ(i)
        }
        mesh.geometry.setAttribute('aTissue', new THREE.BufferAttribute(out, 3))
        mesh.geometry.deleteAttribute('color')
      }
      mesh.material = skin
      mesh.castShadow = false
      mesh.receiveShadow = false
      mesh.renderOrder = 5
      const depth = new THREE.Mesh(mesh.geometry, skinDepth)
      depth.renderOrder = 3
      fallbackFace.add(depth)
    })
    fallbackFace.add(faceNode)
  }
  if (eyesNode) {
    eachMesh(eyesNode, (mesh) => {
      mesh.visible = false
    })
    fallbackFace.add(eyesNode)
    // The fitted source eye centres are measured from its decoded geometry
    // (X ±3.24, Y 2.97, front Z 5.62). The thin eyelid surround closes only
    // the oversized existing orbital opening, while a smaller almond-shaped
    // sclera sits in its centre. This prevents orbital bone from reading as a
    // detached white patch and retains the original skull/face registration.
    const eyeSurfaces = new THREE.Group()
    eyeSurfaces.name = 'registered-eye-opening-surfaces'
    for (const side of [-1, 1]) {
      const x = side * 3.24
      const eyelid = new THREE.Mesh(eyelidRingGeometry(), eyelidMaterial)
      eyelid.name = side < 0 ? 'eyelid-surround-right' : 'eyelid-surround-left'
      eyelid.position.set(x, 2.97, 5.65)
      const sclera = new THREE.Mesh(almondGeometry(1.98, 0.68), scleraMaterial)
      sclera.name = side < 0 ? 'sclera-right' : 'sclera-left'
      sclera.position.set(x, 2.97, 5.665)
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.36, 32), irisMaterial)
      iris.name = side < 0 ? 'iris-right' : 'iris-left'
      iris.position.set(x, 2.97, 5.68)
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.155, 24), pupilMaterial)
      pupil.name = side < 0 ? 'pupil-right' : 'pupil-left'
      pupil.position.set(x, 2.97, 5.695)
      eyeSurfaces.add(eyelid, sclera, iris, pupil)
    }
    fallbackFace.add(eyeSurfaces)
  }

  // The textured scan is deliberately loaded only after somebody asks to see
  // the face. Its node is pre-registered to this skull and carries the same
  // R/G/B soft-tissue weights as the fallback mesh (maxilla/mandible/chin).
  // A failed request is invisible to the user: the fitted face stays active.
  const texturedFaceMaterials: THREE.MeshStandardMaterial[] = []
  const texturedFaceTextures = new Set<THREE.Texture>()
  let texturedFaceLoading = false
  let texturedFaceLoaded = false

  function releaseUnattachedFace(node: THREE.Object3D) {
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    node.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      geometries.add(mesh.geometry)
      const assigned = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      assigned.forEach((material) => materials.add(material))
    })
    geometries.forEach((geometry) => geometry.dispose())
    materials.forEach((material) => material.dispose())
  }

  function loadTexturedFace() {
    if (texturedFaceLoading || texturedFaceLoaded) return
    texturedFaceLoading = true
    const texturedLoader = new GLTFLoader()
    void texturedLoader
      .loadAsync(TEXTURED_FACE_URL)
      .then((gltf) => {
        if (disposed) {
          releaseUnattachedFace(gltf.scene)
          return
        }
        const scan = gltf.scene
        const sourceMaterials = new Set<THREE.Material>()
        const source = ((): THREE.MeshStandardMaterial | null => {
          let found: THREE.MeshStandardMaterial | null = null
          eachMesh(scan, (mesh) => {
            const assigned = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            assigned.forEach((material) => sourceMaterials.add(material))
            const candidate = assigned.find((material): material is THREE.MeshStandardMaterial => material instanceof THREE.MeshStandardMaterial)
            if (!found && candidate) found = candidate
          })
          return found
        })()
        if (!source) throw new Error('textured face has no standard material')

        const texturedSkin = skinMaterial(false, source, false)
        const texturedSkinDepth = skinMaterial(true, undefined, false)
        texturedFaceMaterials.push(texturedSkin, texturedSkinDepth)
        for (const texture of [source.map, source.normalMap, source.roughnessMap]) if (texture) texturedFaceTextures.add(texture)

        eachMesh(scan, (mesh) => {
          const weights = mesh.geometry.getAttribute('color')
          if (!weights || weights.itemSize < 3) throw new Error('textured face has no tissue weights')
          const tissueWeights = new Float32Array(weights.count * 3)
          for (let i = 0; i < weights.count; i++) {
            tissueWeights[i * 3] = weights.getX(i)
            tissueWeights[i * 3 + 1] = weights.getY(i)
            tissueWeights[i * 3 + 2] = weights.getZ(i)
          }
          mesh.geometry.setAttribute('aTissue', new THREE.BufferAttribute(tissueWeights, 3))
          mesh.geometry.deleteAttribute('color')
          mesh.material = texturedSkin
          mesh.castShadow = false
          mesh.receiveShadow = false
          mesh.renderOrder = 5
          const depth = new THREE.Mesh(mesh.geometry, texturedSkinDepth)
          depth.renderOrder = 3
          texturedFace.add(depth)
        })
        sourceMaterials.forEach((material) => material.dispose())
        scan.name = 'licensed-textured-face'
        texturedFace.add(scan)
        texturedFaceLoaded = true
        texturedFaceLoading = false
        // The textured source includes naturally closed eyelids; keeping the
        // fallback eye panels visible would create a second, unregistered eye.
        fallbackFace.visible = false
        texturedFace.visible = true
        invalidate()
      })
      .catch(() => {
        // This is an enhancement, not a dependency. Preserve the already
        // displayed registered fallback if the optional asset is unavailable.
        texturedFaceLoading = false
      })
  }

  // ---- plates and screws -----------------------------------------------------

  const screwSrc = root.getObjectByName('screw')
  if (!screwSrc) throw new Error('model is missing the screw')
  screwSrc.removeFromParent()
  eachMesh(screwSrc, (mesh) => {
    mesh.material = (mesh.material as THREE.Material).name === 'ti_slot' ? slotMetal : screwMetal
    mesh.castShadow = false
  })

  type Plate = {
    name: string
    group: string
    holder: THREE.Group
    body: THREE.Object3D
    material: THREE.MeshStandardMaterial
    normal: THREE.Vector3
    screws: THREE.Object3D[]
  }
  const plates: Plate[] = []

  for (const [name, info] of Object.entries(rig.plates)) {
    const body = root.getObjectByName(name)
    const anchor = segments.get(info.anchor)
    if (!body || !anchor) continue
    const material = new THREE.MeshStandardMaterial({
      color: TITANIUM[info.color] ?? TITANIUM.grey,
      roughness: 0.34,
      metalness: 1,
      envMapIntensity: 1.2,
      transparent: true,
      clippingPlanes: planes,
    })
    eachMesh(body, (mesh) => {
      mesh.material = material
      mesh.castShadow = true
      mesh.receiveShadow = true
    })
    const holder = new THREE.Group()
    holder.name = `${name}_holder`
    anchor.add(holder)
    holder.add(body)

    const screws: THREE.Object3D[] = []
    for (const s of rig.screws) {
      if (s.plate !== name) continue
      const seat = new THREE.Group()
      seat.position.copy(v3(s.p))
      seat.quaternion.setFromUnitVectors(up, v3(s.n).normalize())
      const spin = screwSrc.clone()
      seat.add(spin)
      holder.add(seat)
      screws.push(spin)
    }
    plates.push({ name, group: info.group, holder, body, material, normal: v3(info.normal).normalize(), screws })
  }
  // Seat them front to back, top to bottom, so the eye can follow.
  plates.sort((a, b) => {
    const ca = rig.plates[a.name].center
    const cb = rig.plates[b.name].center
    return cb[1] - ca[1] || cb[2] - ca[2]
  })

  // Osteotomy and fracture lines, drawn on the bone they belong to.
  type CutLine = { line: Line2; segment: string; count: number }
  const lineMaterial = new LineMaterial({
    color: ink.getHex(),
    linewidth: 2.2,
    transparent: true,
    opacity: 0.9,
    depthTest: true,
  })
  const cutLines: CutLine[] = []
  for (const [segment, chains] of Object.entries(rig.cutLines)) {
    const parent = segments.get(segment)
    if (!parent) continue
    for (const chain of chains) {
      if (chain.length < 30) continue
      const geometry = new LineGeometry()
      geometry.setPositions(chain.flat())
      const line = new Line2(geometry, lineMaterial)
      line.visible = false
      line.renderOrder = 2
      parent.add(line)
      cutLines.push({ line, segment, count: chain.length - 1 })
    }
  }

  const landmarks = LANDMARK_KEYS.filter((k) => rig.landmarks[k]).map((key) => ({
    key,
    p: v3(rig.landmarks[key].p),
    n: v3(rig.landmarks[key].n),
  }))

  // ---- state ---------------------------------------------------------------

  let caseId: CaseId = 'explore'
  let progress = 0
  let labelsOn = false
  let labelsDirty = true
  let pickTeeth = false
  let sectionAmount = 0
  let disposed = false
  let ghostTarget = 0
  let faceTarget = 0
  const layers: Record<LayerId, boolean> = {
    cranium: true,
    maxilla: true,
    mandible: true,
    teeth: true,
    hardware: true,
  }

  const pose = {
    maxilla: v3(rig.pose.maxilla),
    distal: v3(rig.pose.mand_distal),
    chin: v3(rig.pose.chin),
  }
  const chinOnly = pose.chin.clone().sub(pose.distal)
  const trauma = Object.entries(rig.traumaBefore).map(([name, d]) => ({
    node: segments.get(name),
    t: v3(d.t),
    axis: v3(d.axis).normalize(),
    rad: THREE.MathUtils.degToRad(d.deg),
    pivot: v3(d.pivot),
  }))

  function applyPose() {
    const spec = CASES[caseId]
    const { cut: cutT, move: moveT, fix: fixT } = phases(caseId, progress)
    const m = ease(moveT)
    const active = spec.set === 'trauma' ? TRAUMA : ORTHO

    for (const [name, node] of segments) {
      node.visible = active.includes(name) && layers[LAYER_OF[name]]
      node.position.set(0, 0, 0)
      node.quaternion.identity()
    }
    for (const mesh of fragmentTeeth) mesh.visible = layers.teeth
    for (const tooth of teeth.values()) poseTooth(tooth)
    placeRing()

    if (spec.set === 'ortho') {
      const moves = spec.moves
      if (moves.includes('maxilla')) segments.get('maxilla')!.position.copy(pose.maxilla).multiplyScalar(m)
      if (moves.includes('mandible')) {
        segments.get('mand_distal')!.position.copy(pose.distal).multiplyScalar(m)
        segments.get('chin')!.position.copy(pose.distal).multiplyScalar(m)
      }
      if (moves.includes('chin')) segments.get('chin')!.position.addScaledVector(chinOnly, m)
      tissue.uMax.value.copy(segments.get('maxilla')!.position)
      tissue.uMand.value.copy(segments.get('mand_distal')!.position)
      tissue.uChin.value.copy(segments.get('chin')!.position).sub(tissue.uMand.value)
    } else {
      // Fragments start where the injury left them and are brought back.
      const away = 1 - m
      for (const d of trauma) {
        if (!d.node) continue
        tmpQ.setFromAxisAngle(d.axis, d.rad * away)
        tmpV.copy(d.pivot).applyQuaternion(tmpQ)
        d.node.quaternion.copy(tmpQ)
        d.node.position.copy(d.t).multiplyScalar(away).add(d.pivot).sub(tmpV)
      }
      tissue.uMax.value.set(0, 0, 0)
      tissue.uMand.value.set(0, 0, 0)
      tissue.uChin.value.set(0, 0, 0)
    }

    // Lines: drawn during the first phase, then left as a faint record.
    for (const c of cutLines) {
      const on = spec.lines.includes(c.segment) && progress > 0 && layers[LAYER_OF[c.segment]]
      c.line.visible = on
      if (on) c.line.geometry.instanceCount = Math.max(1, Math.round(c.count * easeOut(cutT)))
    }
    lineMaterial.opacity = 0.9 - 0.5 * clamp01(moveT * 1.5)

    // Hardware: each plate lowers onto the bone, then its screws are driven.
    const mine = plates.filter((p) => spec.plates.includes(p.group))
    for (const plate of plates) {
      const index = mine.indexOf(plate)
      const t = index === -1 ? 0 : plateProgress(fixT, index, mine.length)
      const seat = easeOut(clamp01(t / 0.45))
      plate.holder.visible = index !== -1 && t > 0 && layers.hardware
      plate.body.position.copy(plate.normal).multiplyScalar((1 - seat) * 1.4)
      plate.material.opacity = clamp01(t * 5)
      plate.screws.forEach((spin, j) => {
        const s = clamp01((t - 0.36 - j * 0.09) / 0.34)
        const drive = easeOut(s)
        spin.visible = s > 0
        spin.position.set(0, (1 - drive) * 0.85, 0)
        spin.rotation.set(0, (1 - drive) * Math.PI * 7, 0)
      })
    }
    renderer.shadowMap.needsUpdate = true
    labelsDirty = true
    invalidate()
  }

  // ---- camera --------------------------------------------------------------

  type Shot = { target: THREE.Vector3; dir: THREE.Vector3; dist: number }
  let tween: { from: Shot; to: Shot; start: number; ms: number } | null = null

  function fit(dist: number) {
    const aspect = camera.aspect
    return aspect >= 1.15 ? dist : dist * Math.min(2.1, Math.pow(1.15 / aspect, 0.92))
  }

  function shotFor(id: CaseId): Shot {
    const spec = CASES[id]
    const wide = faceTarget > 0 ? 1.45 : 1
    return { target: v3(spec.target), dir: v3(spec.dir).normalize(), dist: fit(spec.dist * wide) }
  }

  function currentShot(): Shot {
    const offset = camera.position.clone().sub(controls.target)
    return { target: controls.target.clone(), dir: offset.clone().normalize(), dist: offset.length() }
  }

  function place(shot: Shot) {
    controls.target.copy(shot.target)
    camera.position.copy(shot.target).addScaledVector(shot.dir, shot.dist)
    camera.lookAt(shot.target)
  }

  function flyTo(shot: Shot, instant = false) {
    if (instant || opts.still) {
      tween = null
      place(shot)
      controls.update()
      invalidate()
      return
    }
    tween = { from: currentShot(), to: shot, start: performance.now(), ms: 1000 }
    invalidate()
  }

  // ---- pointer: turning, and picking a tooth --------------------------------

  let dragging = false
  let down: { x: number; y: number; at: number } | null = null
  let lastHover = 0
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  function toothAt(event: PointerEvent): number | null {
    const rect = canvas.getBoundingClientRect()
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(pointer, camera)
    const hits = raycaster.intersectObjects(pickables, true)
    for (const hit of hits) {
      let visible = true
      for (let o: THREE.Object3D | null = hit.object; o; o = o.parent) if (!o.visible) visible = false
      if (visible && typeof hit.object.userData.tooth === 'number') return hit.object.userData.tooth
    }
    return null
  }

  function setHover(id: number | null) {
    if (hovered === id) return
    const before = hovered === null ? undefined : teeth.get(hovered)
    if (before?.mesh) before.mesh.material = enamel
    hovered = id
    const now = id === null ? undefined : teeth.get(id)
    if (now?.mesh) now.mesh.material = enamelHover
    canvas.style.cursor = id === null ? 'grab' : 'pointer'
    invalidate()
  }

  const onPointerDown = (event: PointerEvent) => {
    down = { x: event.clientX, y: event.clientY, at: performance.now() }
  }
  const onPointerUp = (event: PointerEvent) => {
    const start = down
    down = null
    if (!start || !pickTeeth) return
    const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y)
    if (moved > 6 || performance.now() - start.at > 600) return
    const id = toothAt(event)
    if (id !== null) opts.onPickTooth?.(id)
  }
  const onPointerMove = (event: PointerEvent) => {
    if (!pickTeeth || dragging || event.pointerType !== 'mouse') return
    const now = performance.now()
    if (now - lastHover < 70) return
    lastHover = now
    setHover(toothAt(event))
  }
  const onLeave = () => {
    controls.enableZoom = immersive
    setHover(null)
  }
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerleave', onLeave)

  controls.addEventListener('start', () => {
    tween = null
    dragging = true
    controls.enableZoom = true
    canvas.style.cursor = 'grabbing'
    opts.onInteract?.()
  })
  controls.addEventListener('end', () => {
    dragging = false
    canvas.style.cursor = hovered === null ? 'grab' : 'pointer'
  })
  controls.addEventListener('change', () => {
    moving = 14
    labelsDirty = true
    invalidate()
  })

  // ---- render on demand ----------------------------------------------------

  let frame = 0
  let settle = 0
  /** Frames left in which the camera counts as moving (lower resolution). */
  let moving = 0
  let lastRender = 0
  let lastTick = 0
  const projected = new THREE.Vector3()
  const toEye = new THREE.Vector3()

  function invalidate() {
    settle = Math.max(settle, 2)
    if (!frame && !disposed) frame = requestAnimationFrame(tick)
  }

  function setRatio(next: number) {
    if (next === ratio) return
    ratio = next
    renderer.setPixelRatio(ratio)
    renderer.setSize(Math.max(1, host.clientWidth), Math.max(1, host.clientHeight), false)
  }

  function tick(now: number) {
    frame = 0
    if (disposed) return
    // High-refresh screens fire this far more often than the scene needs.
    if (now - lastRender < FRAME_MS - 1) {
      frame = requestAnimationFrame(tick)
      return
    }
    // Clamped so a tab that was in the background does not jump, but loosely
    // enough that a slow device still finishes its animations on time.
    const dt = Math.min(0.3, lastTick ? (now - lastTick) / 1000 : 0.016)
    lastTick = now
    lastRender = now
    let busy = false

    if (tween) {
      const t = clamp01((now - tween.start) / tween.ms)
      const k = ease(t)
      place({
        target: tween.from.target.clone().lerp(tween.to.target, k),
        dir: tween.from.dir.clone().lerp(tween.to.dir, k).normalize(),
        dist: THREE.MathUtils.lerp(tween.from.dist, tween.to.dist, k),
      })
      if (t >= 1) tween = null
      moving = 6
      labelsDirty = true
      busy = true
    }
    controls.update()

    // Teeth being worked on run on their own clocks.
    let teethMoved = false
    for (const tooth of teeth.values()) {
      if (tooth.t >= 1) continue
      tooth.t = opts.still ? 1 : Math.min(1, tooth.t + dt / TOOTH_SECONDS[tooth.work])
      poseTooth(tooth)
      teethMoved = true
    }
    if (teethMoved) {
      renderer.shadowMap.needsUpdate = true
      busy = true
    }

    // X-ray and the face ease in rather than snapping.
    const dg = ghostTarget - ghost.value
    if (Math.abs(dg) > 0.002) {
      ghost.value += dg * (opts.still ? 1 : 1 - Math.exp(-dt * 10))
      busy = true
    } else ghost.value = ghostTarget
    const ghosted = ghost.value > 0.01
    if (bone.transparent !== ghosted) {
      for (const m of [bone, cut]) {
        m.transparent = ghosted
        m.needsUpdate = true
      }
    }
    bone.depthWrite = cut.depthWrite = ghost.value < 0.5

    // Lips would hide the teeth being worked on, so the face steps aside there.
    const df = (pickTeeth ? 0 : faceTarget) - faceAmount.value
    if (Math.abs(df) > 0.002) {
      faceAmount.value += df * (opts.still ? 1 : 1 - Math.exp(-dt * 9))
      busy = true
    } else faceAmount.value = pickTeeth ? 0 : faceTarget
    faceGroup.visible = faceAmount.value > 0.004
    // At full opacity skin should behave as ordinary, occluding tissue. During
    // the fade and at any lower UI value, disable the depth prepass so the user
    // gets a genuinely translucent teaching layer rather than milky wax.
    const faceOpaque = faceBase.value >= 0.985 && faceAmount.value >= 0.985 && !pickTeeth
    // The registered skull intentionally projects very close to the fitted
    // skin at the orbital rim. At a fully opaque teaching-free view it must
    // be entirely occluded (as it would be in a real face), not leak through
    // a closed eyelid or thin ear. It is restored for every transparent state
    // and while choosing a tooth, so the surgical model remains inspectable.
    if (root.visible === faceOpaque) {
      root.visible = !faceOpaque
      labelsDirty = true
    }
    for (const material of [eyelidMaterial, scleraMaterial, irisMaterial, pupilMaterial]) {
      material.opacity = faceAmount.value * faceBase.value
      if (material.depthWrite !== faceOpaque) {
        material.depthWrite = faceOpaque
        material.needsUpdate = true
      }
    }
    if (skin.transparent === faceOpaque) {
      skin.transparent = !faceOpaque
      skin.depthWrite = faceOpaque
      skinDepth.depthWrite = faceOpaque
      skin.needsUpdate = true
      skinDepth.needsUpdate = true
    }
    for (const material of texturedFaceMaterials) {
      if (material.transparent === faceOpaque) {
        material.transparent = !faceOpaque
        material.depthWrite = faceOpaque
        material.needsUpdate = true
      }
    }

    if (moving > 0) moving--
    setRatio(moving > 0 || dragging ? QUICK : SHARP)

    renderer.render(scene, camera)

    if (opts.onLabels && labelsDirty) {
      labelsDirty = false
      const w = host.clientWidth
      const h = host.clientHeight
      // Anatomical labels belong to the transparent teaching view, not on top
      // of an otherwise ordinary opaque facial surface.
      const show = labelsOn && caseId === 'explore' && root.visible
      opts.onLabels(
        landmarks.map((l) => {
          projected.copy(l.p).project(camera)
          toEye.copy(camera.position).sub(l.p).normalize()
          const facing = toEye.dot(l.n) > 0.22
          const inside = projected.z < 1 && Math.abs(projected.x) < 0.96 && Math.abs(projected.y) < 0.94
          return {
            key: l.key,
            x: (projected.x * 0.5 + 0.5) * w,
            y: (-projected.y * 0.5 + 0.5) * h,
            visible: show && facing && inside,
          }
        }),
      )
    }

    if (settle > 0) settle--
    if (busy || moving > 0 || dragging || settle > 0 || ratio !== SHARP) frame = requestAnimationFrame(tick)
  }

  function resize() {
    const w = Math.max(1, host.clientWidth)
    const h = Math.max(1, host.clientHeight)
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    lineMaterial.resolution.set(w, h)
    labelsDirty = true
    invalidate()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(host)
  resize()

  // ---- first frame ---------------------------------------------------------

  place(shotFor(caseId))
  controls.update()
  applyPose()

  return {
    setCase(id, instant) {
      caseId = id
      pickTeeth = id === 'teeth'
      if (!pickTeeth) setHover(null)
      applyPose()
      flyTo(shotFor(id), instant)
    },
    setProgress(p) {
      progress = clamp01(p)
      applyPose()
    },
    zoom(factor) {
      const shot = currentShot()
      shot.dist = THREE.MathUtils.clamp(shot.dist * factor, controls.minDistance, controls.maxDistance)
      flyTo(shot, true)
    },
    setView(view) {
      const now = currentShot()
      flyTo({ target: now.target, dir: v3(VIEW_DIR[view]).normalize(), dist: now.dist })
    },
    setXray(on) {
      ghostTarget = on ? 1 : 0
      invalidate()
    },
    setLabels(on) {
      labelsOn = on
      labelsDirty = true
      invalidate()
    },
    setLayer(layer, on) {
      layers[layer] = on
      applyPose()
    },
    setSection(amount) {
      sectionAmount = clamp01(amount)
      // 0 leaves the skull whole; 1 opens it at the midline.
      clip.constant = sectionAmount === 0 ? 100 : THREE.MathUtils.lerp(7.2, 0, sectionAmount)
      const side = sectionAmount > 0 ? THREE.DoubleSide : THREE.FrontSide
      for (const m of [bone, cut, enamel, enamelHover, ceramic]) {
        if (m.side !== side) {
          m.side = side
          m.needsUpdate = true
        }
      }
      invalidate()
    },
    setFace(on) {
      faceTarget = on ? 1 : 0
      if (on) loadTexturedFace()
      // Step back far enough to take in the registered face in every mode,
      // including the tooth case where a close skull crop is otherwise jarring.
      if (on) {
        const now = currentShot()
        const wide = fit(CASES[caseId].dist * 1.45)
        if (now.dist < wide) flyTo({ ...now, dist: wide })
      }
      invalidate()
    },
    setFaceOpacity(amount) {
      faceBase.value = clamp01(amount)
      invalidate()
    },
    setTooth(id, work, instant = false) {
      const tooth = teeth.get(id)
      if (!tooth || tooth.work === work) return
      if (work === 'implant') ensureImplant(tooth)
      tooth.work = work
      tooth.t = work === 'natural' || instant ? 1 : 0
      poseTooth(tooth)
      renderer.shadowMap.needsUpdate = true
      invalidate()
    },
    setSelectedTooth(id) {
      selected = id
      placeRing()
      invalidate()
    },
    setImmersive(on) {
      immersive = on
      controls.enableZoom = on
      canvas.style.touchAction = on ? 'none' : 'pan-y'
    },
    captureCamera() {
      return { eye: camera.position.toArray(), target: controls.target.toArray() }
    },
    restoreCamera(pose) {
      const target = v3(pose.target)
      const offset = v3(pose.eye).sub(target)
      const dist = THREE.MathUtils.clamp(offset.length(), controls.minDistance, controls.maxDistance)
      flyTo({ target, dir: offset.normalize(), dist }, true)
    },
    reset() {
      flyTo(shotFor(caseId))
    },
    dispose() {
      disposed = true
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onLeave)
      controls.dispose()
      scene.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
      })
      for (const m of [
        bone,
        cut,
        enamel,
        enamelHover,
        ceramic,
        implantMetal,
        abutmentMetal,
        skin,
        skinDepth,
        eyelidMaterial,
        scleraMaterial,
        irisMaterial,
        pupilMaterial,
        screwMetal,
        slotMetal,
        markGold,
        lineMaterial,
      ])
        m.dispose()
      texturedFaceMaterials.forEach((material) => material.dispose())
      texturedFaceTextures.forEach((texture) => texture.dispose())
      for (const p of plates) p.material.dispose()
      ring.geometry.dispose()
      envTarget.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    },
  }
}
