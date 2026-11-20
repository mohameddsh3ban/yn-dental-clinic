# 3D model credits

- **Human Male Skull** (f1eaaef50e5845c796d6834fd1b702e5) by Ruslan Gadzhiev — CC Attribution 4.0 — https://sketchfab.com/3d-models/human-male-skull-f1eaaef50e5845c796d6834fd1b702e5

Adapted for Ozea: cut into surgical segments, fixation plates and screws added, ambient occlusion baked.
Rebuild: `blender -b --factory-startup --python scripts/planning3d/build.py -- <downloaded skull.glb> <out dir>`, then copy `skull.glb` to `public/models/ozea-skull.glb` and `rig.json` to `public/models/ozea-skull.rig.json`.
- **Male Head Base mesh** (6a480c4603cd4768b615393e93dbd7d0) by DEGUIDER — CC Attribution 4.0 — https://sketchfab.com/3d-models/male-head-base-mesh-6a480c4603cd4768b615393e93dbd7d0 — fitted over the skull as the optional face layer, with its eyes (pass its .glb as the third argument to build.py).
## Photographic face layer

**Infinite, 3D Head Scan** by Lee Perry-Smith / Infinite-Realities is licensed
under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). The model and
texture maps come from the [Three.js r180 distribution](https://github.com/mrdoob/three.js/tree/r180/examples/models/gltf/LeePerrySmith),
which includes the [original licence notice](https://github.com/mrdoob/three.js/blob/r180/examples/models/gltf/LeePerrySmith/LeePerrySmith_License.txt).
Ozea adapted the fit, texture packaging and soft-tissue motion for this
educational viewer.

## Implant molar crown

`public/models/implant-molar.glb` is derived from `D46.stl` (mandibular right
first molar) in **Data of 3D models of human jaw with teeth, ligaments, and
bone structures**, Cristian Diaz, Carlos Andres Ferro Sanchez and Oscar Campo
(2024), Mendeley Data, version 1, DOI: https://doi.org/10.17632/97c3pf8h2h.1.

Source: https://data.mendeley.com/datasets/97c3pf8h2h/1

License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Modifications by Ozea: isolated the D46 crown above a flat cervical trim,
closed the base, reoriented the occlusal surface toward +Y, centered the base
at y=0, converted millimetres to metres, applied a neutral enamel material,
and exported a web-ready GLB. It is an illustrative crown asset, not a patient
scan or a treatment plan. The same geometry may be mirrored for FDI 36 by the
viewer.

## Sculpted face layer (current)

`public/models/ozea-face-sculpt.glb` is Ozea's own figure: the sculpted head
from the homepage hero. Its front, side and back views and the 3D mesh built
from them were generated for Ozea on Higgsfield (GPT Image 2.6, then Tripo H3.1
multiview-to-3D), so there is no third-party licence to credit. It is fitted to
the teaching skull, given its soft-tissue weights and its see-through window by
`scripts/planning3d/fit_face_sculpt.py`:

    blender -b --factory-startup --python scripts/planning3d/fit_face_sculpt.py --         public/models/ozea-skull.glb <sculpt.glb> public/models/ozea-face-sculpt.glb

The earlier photographic scan (`ozea-face-textured.glb`) is no longer loaded.
