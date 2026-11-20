import * as THREE from 'three'

// A small studio built from light cards. Titanium needs dark areas between
// the reflections to make its recesses and machined edges visible.
export function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene()
  studio.background = new THREE.Color(0x22282f)
  const materials: THREE.Material[] = []
  const panel = new THREE.PlaneGeometry(1, 1)
  function lightCard(x: number, y: number, z: number, w: number, h: number, color: number, power: number) {
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power), side: THREE.DoubleSide })
    materials.push(material)
    const light = new THREE.Mesh(panel, material)
    light.position.set(x, y, z)
    light.lookAt(0, 0, 0)
    light.scale.set(w, h, 1)
    studio.add(light)
  }
  lightCard(-5, 4, 5, 5, 10, 0xffefda, 6)
  lightCard(5, 1, 3, 1.3, 11, 0xd8eaff, 8)
  lightCard(1, 7, -4, 6, 3, 0xf3f6ff, 5)
  lightCard(-2, -4, 5, 5, 2, 0xf1dec7, 1.6)
  const generator = new THREE.PMREMGenerator(renderer)
  const target = generator.fromScene(studio, 0.025)
  generator.dispose()
  panel.dispose()
  materials.forEach(material => material.dispose())
  return target
}

export function titaniumGrain() {
  const size = 128
  const data = new Uint8Array(size * size * 4)
  let seed = 624
  for (let i = 0; i < data.length; i += 4) {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0
    const grain = Math.round(150 + 95 * (seed / 4294967296))
    data.set([grain, grain, grain, 255], i)
  }
  const texture = new THREE.DataTexture(data, size, size)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 5)
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}
