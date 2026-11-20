"""Fit the sculpted head (the homepage hero figure, reconstructed in 3D) over
Ozea's teaching skull, and export it as the viewer's face layer.

  blender -b --factory-startup --python fit_face_sculpt.py -- \
      <public/models/ozea-skull.glb> <sculpt.glb> <out.glb> [turn=<deg>, else found from the nose] [check=<png prefix>]

The head arrives at an arbitrary size and is scaled to the skull by landmarks —
crown, back of the head, forehead, the point of the chin, the width of the
vault — each with its usual depth of soft tissue. Skin that would still sit
inside bone is pushed out. Every vertex then gets:

  COLOR_0.rgb  how far it follows the upper jaw, the lower jaw and the chin
  COLOR_0.a    the "window": 1 where the skin lies over the jaws and cheekbone
               (drawn see-through, so the anatomy reads through the cheek the
               way it does in the hero artwork), 0 everywhere else

Blender space: +Z up, -Y the front of the face, +X the patient's left, cm.
"""
import bpy, bmesh, math, os, sys
from mathutils import Vector
from mathutils.bvhtree import BVHTree

args = sys.argv[sys.argv.index("--") + 1:]
SKULL, SCULPT, OUT = args[0], args[1], args[2]
opts = dict(a.split("=", 1) for a in args[3:] if "=" in a)
TURN = float(opts.get("turn", 0))
CHECK = opts.get("check")
FACES = int(opts.get("faces", 36000))
TEX = int(opts.get("tex", 1024))

BONE = ["cranium", "zygoma", "maxilla", "mand_prox_L", "mand_prox_R", "mand_distal", "chin"]

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SKULL)
skull_objs = {}
for o in bpy.data.objects:
    if o.type != "MESH":
        continue
    if o.name in BONE or o.name.startswith("tooth_"):
        skull_objs[o.name] = o


def tris_of(names):
    cos, tris = [], []
    for n in names:
        o = skull_objs[n]
        base = len(cos)
        cos += [o.matrix_world @ v.co for v in o.data.vertices]
        for p in o.data.polygons:
            vs = [base + i for i in p.vertices]
            for k in range(1, len(vs) - 1):
                tris.append((vs[0], vs[k], vs[k + 1]))
    return cos, tris


teeth_up = [n for n in skull_objs if n.startswith("tooth_") and int(n[6:]) < 30]
teeth_lo = [n for n in skull_objs if n.startswith("tooth_") and int(n[6:]) >= 30]
all_names = BONE + teeth_up + teeth_lo
SK, SK_TRI = tris_of(all_names)
BVH = BVHTree.FromPolygons(SK, SK_TRI)
bvh_of = lambda names: BVHTree.FromPolygons(*tris_of(names))
B_MAX = bvh_of(["maxilla"] + teeth_up)
B_MAND = bvh_of(["mand_distal", "chin"] + teeth_lo)
B_CHIN = bvh_of(["chin"])
B_WIN = bvh_of(["maxilla", "zygoma", "mand_prox_L", "mand_prox_R", "mand_distal", "chin"] + teeth_up + teeth_lo)
print("SKULL", len(SK), "verts from", len(all_names), "objects")

# ---- the sculpt -------------------------------------------------------------
before = set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=SCULPT)
new = [o for o in bpy.data.objects if o not in before]
meshes = [o for o in new if o.type == "MESH"]
bpy.ops.object.select_all(action="DESELECT")
for o in meshes:
    o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1:
    bpy.ops.object.join()
face = bpy.context.view_layer.objects.active
bpy.ops.object.parent_clear(type="CLEAR_KEEP_TRANSFORM")
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
# Which way is the head facing? The tip of the nose is the point farthest from
# the vertical axis of the vault, in the band of height where a nose is.
turn = TURN
if 'turn' not in opts:
    vs = [v.co for v in face.data.vertices]
    zt = max(v.z for v in vs)
    span = zt - min(v.z for v in vs)
    cap = [v for v in vs if v.z > zt - 0.22 * span]
    ax = sum(v.x for v in cap) / len(cap)
    ay = sum(v.y for v in cap) / len(cap)
    w = max(v.x for v in cap) - min(v.x for v in cap)
    ring = [v for v in vs if zt - 1.15 * w < v.z < zt - 0.7 * w]
    tip = max(ring, key=lambda v: (v.x - ax) ** 2 + (v.y - ay) ** 2)
    turn = -90 - math.degrees(math.atan2(tip.y - ay, tip.x - ax))
    print('FACING', round(math.degrees(math.atan2(tip.y - ay, tip.x - ax)), 1), 'deg -> turn', round(turn, 1))
if abs(turn) > 0.01:
    # about the world's vertical, once the import's own rotation is baked in
    face.rotation_mode = 'XYZ'      # the glTF importer leaves objects in quaternion mode
    face.rotation_euler = (0, 0, math.radians(turn))
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
for o in new:
    if o.type != "MESH":
        bpy.data.objects.remove(o)
face.name = "face"
face.data.name = "face"

if len(face.data.polygons) > FACES:
    dec = face.modifiers.new("dec", "DECIMATE")
    dec.ratio = FACES / len(face.data.polygons)
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    me2 = bpy.data.meshes.new_from_object(face.evaluated_get(dg))
    face.modifiers.clear(); face.data = me2; me2.name = "face"
bm = bmesh.new(); bm.from_mesh(face.data)
bmesh.ops.triangulate(bm, faces=bm.faces[:])
bm.to_mesh(face.data); bm.free()
me = face.data
print("SCULPT", len(me.vertices), "verts", len(me.polygons), "tris", "uv", len(me.uv_layers), "mats", [m.name for m in me.materials])

H0 = [v.co.copy() for v in me.vertices]
TRI = [tuple(p.vertices) for p in me.polygons]
xs = [v.x for v in H0]; ys = [v.y for v in H0]; zs = [v.z for v in H0]
top0 = max(zs)
# the head sits on shoulders, so "width" is taken from the vault, not the bust
crown = [v for v in H0 if v.z > top0 - 0.25 * (top0 - min(zs))]
cx = (min(v.x for v in crown) + max(v.x for v in crown)) / 2
cy = (min(v.y for v in crown) + max(v.y for v in crown)) / 2
c0 = Vector((cx, cy, top0))                                   # crown anchor
band = lambda v, r: abs(v.x - cx) < r
vault_w = max(v.x for v in crown) - min(v.x for v in crown)
front = [v for v in H0 if band(v, 0.04 * vault_w) and v.y < cy]
# nose tip: the most forward point of the midline in the upper part of the figure
upper = [v for v in front if v.z > top0 - 1.25 * vault_w]
nose0 = min(upper, key=lambda v: v.y)
low = [v for v in front if nose0.z - 0.62 * vault_w < v.z < nose0.z - 0.1 * vault_w]
gn0 = min(low, key=lambda v: v.y + v.z)                        # point of the chin
Hh = top0 - gn0.z
fh0 = min((v for v in front if top0 - 0.42 * Hh < v.z < top0 - 0.15 * Hh), key=lambda v: v.y)
back0 = max(v.y for v in H0 if v.z > gn0.z + 0.15 * Hh)
wid0 = max(abs(v.x - cx) for v in H0 if v.z > top0 - 0.3 * Hh)
print("HEAD crown", round(top0, 3), "nose", [round(a, 3) for a in nose0], "chin", [round(a, 3) for a in gn0], "Hh", round(Hh, 3), "wid", round(wid0, 3))

s_top = max(v.z for v in SK)
s_gn = min((v for v in SK if abs(v.x) < 0.6), key=lambda v: v.y + v.z)
s_fh = min((v for v in SK if abs(v.x) < 0.6 and 6.0 < v.z < 10.0), key=lambda v: v.y)
s_back = max(v.y for v in SK)
s_wid = max(abs(v.x) for v in SK if v.z > 6.0)

t_top, t_gnz, t_gny = s_top + 0.55, s_gn.z - 0.6, s_gn.y - 0.75
sz = (t_top - t_gnz) / (top0 - gn0.z)
sy = ((s_back + 0.6) - (s_fh.y - 0.5)) / (back0 - fh0.y)
ty = (s_back + 0.6) - (back0 - cy) * sy
sx = (s_wid + 0.6) / wid0
print("FIT scale", round(sx, 3), round(sy, 3), round(sz, 3))

P = [Vector(((v.x - cx) * sx, (v.y - cy) * sy + ty, (v.z - top0) * sz + t_top)) for v in H0]

# shear the lower face in depth so the chin lands where the bone puts it
zn = (nose0.z - top0) * sz + t_top
zg = (gn0.z - top0) * sz + t_top
chin_y = (gn0.y - cy) * sy + ty
for v in P:
    if v.z < zn and v.y < 2.0:
        k = min(1.0, (zn - v.z) / (zn - zg))
        k = k * k * (3 - 2 * k)
        fade = min(1.0, max(0.0, (2.0 - v.y) / 6.0))
        # below the chin the correction eases off again, so the neck keeps its line
        if v.z < zg:
            k *= max(0.0, 1 - (zg - v.z) / 4.0)
        v.y += (t_gny - chin_y) * k * fade

# keep the skin outside the bone
# Measured along rays from the middle of the head: wherever the outermost bone
# on a ray is not at least NEED inside the skin, the skin is moved out along
# that ray. The amounts are then relaxed over the surface (never below what is
# required), so a prominent brow or cheekbone raises a smooth swell instead of
# tearing the mesh.
NEED = 0.17
C = Vector((0, 0.5, 3.5))
out_dir = [(v - C).normalized() for v in P]
req = [0.0] * len(P)
for i, v in enumerate(P):
    d = out_dir[i]
    hit = BVH.ray_cast(C + d * 40.0, -d, 40.0)
    if hit[0] is None:
        continue
    bone_r = (hit[0] - C).length
    req[i] = max(0.0, bone_r + NEED - (v - C).length)
# The mesh is split along its texture seams: vertices that share a position are
# treated as one, or every seam would open into a crack.
weld = {}
group = []
for v in H0:
    key = (round(v.x, 5), round(v.y, 5), round(v.z, 5))
    group.append(weld.setdefault(key, len(weld)))
G = len(weld)
greq = [0.0] * G
for i, g in enumerate(group):
    greq[g] = max(greq[g], req[i])
nb = [set() for _ in range(G)]
for a, b, c in TRI:
    ga, gb, gc = group[a], group[b], group[c]
    nb[ga] |= {gb, gc}; nb[gb] |= {ga, gc}; nb[gc] |= {ga, gb}
gpush = list(greq)
for _ in range(110):
    avg = [(sum(gpush[j] for j in nb[g]) / len(nb[g])) if nb[g] else gpush[g] for g in range(G)]
    gpush = [max(greq[g], 0.35 * gpush[g] + 0.65 * avg[g]) for g in range(G)]
disp = [out_dir[i] * gpush[group[i]] for i in range(len(P))]
print("WELD", len(P), "vertices in", G, "positions")
print("PUSHED", sum(1 for d in disp if d.length > 0.02), "of", len(P), "max", round(max(d.length for d in disp), 2))
P = [v + d for v, d in zip(P, disp)]
for v, co in zip(me.vertices, P):
    v.co = co
me.update()

# Shade it as one surface: the imported normals belong to the old shape, and
# the seam-split vertices would otherwise each keep a normal of their own.
gn = [Vector() for _ in range(G)]
for i, v in enumerate(me.vertices):
    gn[group[i]] += v.normal
for q in me.polygons:
    q.use_smooth = True
me.normals_split_custom_set_from_vertices([tuple(gn[group[i]].normalized()) for i in range(len(P))])


def sstep(t):
    t = min(1.0, max(0.0, t))
    return t * t * (3 - 2 * t)


col = me.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
for i, v in enumerate(P):
    dM = B_MAX.find_nearest(v)[3]
    dD = B_MAND.find_nearest(v)[3]
    dC = B_CHIN.find_nearest(v)[3]
    wM = sstep(1 - (dM - 1.3) / 1.9) * sstep((1.7 - v.z) / 1.4)
    wD = sstep(1 - (dD - 1.3) / 1.9) * sstep((-1.4 - v.y) / 1.6)
    wC = sstep(1 - (dC - 1.0) / 1.6)
    s = wM + wD
    if s > 1:
        wM /= s; wD /= s
    # The window: the side of the face, over the jaws, the cheekbone arch and
    # the jaw joint — what the hero artwork opens. The eyes, the nose, the lips
    # and the forehead stay solid so the face keeps its features; the chin is
    # half-open so a plate there can still be seen.
    dW = B_WIN.find_nearest(v)[3]
    near = sstep(1 - (dW - 1.0) / 1.5)
    side = sstep((abs(v.x) - 1.5) / 1.6)
    chin_front = 0.6 * sstep((-4.3 - v.z) / 0.8)
    # the ceiling rises behind the eye, to take in the arch and the joint
    ceiling = 1.15 + 1.9 * sstep((v.y + 4.7) / 1.5)
    below_eye = sstep((ceiling - v.z) / 0.9)
    win = near * below_eye * max(side, chin_front)
    col.data[i].color = (0.9 * wM, 0.9 * wD, 0.9 * wC, win)
me.color_attributes.active_color = col
me.color_attributes.render_color_index = 0
for q in me.polygons:
    q.use_smooth = True

# a web-sized texture
for img in bpy.data.images:
    if img.size[0] > TEX:
        print("TEX", img.name, img.size[:], "->", TEX)
        img.scale(TEX, TEX)

for o in list(skull_objs.values()) + [o for o in bpy.data.objects if o is not face]:
    o.select_set(False)
bpy.ops.object.select_all(action="DESELECT")
face.select_set(True)
bpy.context.view_layer.objects.active = face
kw = dict(filepath=OUT, export_format="GLB", use_selection=True, export_apply=True, export_normals=True,
          export_yup=True, export_texcoords=True, export_animations=False, export_materials="EXPORT",
          export_image_format="JPEG", export_draco_mesh_compression_enable=True,
          export_draco_mesh_compression_level=7, export_draco_position_quantization=14,
          export_draco_normal_quantization=10, export_draco_texcoord_quantization=12,
          export_draco_color_quantization=8)
try:
    bpy.ops.export_scene.gltf(**kw, export_vertex_color="ACTIVE", export_all_vertex_colors=False,
                              export_active_vertex_color_when_no_material=True, export_jpeg_quality=86)
except TypeError as e:
    print("gltf fallback", e)
    bpy.ops.export_scene.gltf(**kw)
print("EXPORTED", os.path.getsize(OUT))

if CHECK:
    sys.path.insert(0, os.path.dirname(__file__))
    from common import render_views
    for o in bpy.data.objects:
        o.hide_render = o is not face and o.name not in skull_objs
    for o in skull_objs.values():
        o.color = (0.25, 0.45, 0.9, 1)
    face.color = (0.9, 0.84, 0.78, 1)
    V = {"left": (1, 0, 0), "front": (0, -1, 0), "q": (0.72, -0.7, 0.12)}
    render_views(CHECK + "_solid", V, res=900, ortho=30, target=(0, 0.5, 1.5))
    face.display_type = "WIRE"
    bpy.context.scene.display.shading.show_xray = True
    render_views(CHECK + "_xray", {"left": (1, 0, 0), "front": (0, -1, 0)}, res=900, ortho=30, target=(0, 0.5, 1.5))
print("DONE")
