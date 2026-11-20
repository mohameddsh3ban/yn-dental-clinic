"""Cut the reference skull into surgical segments, build fixation hardware,
bake ambient occlusion, export GLB + rig.json.

  blender -b --factory-startup --python build.py -- <skull.glb> <out_dir> [fast]

Blender space: +Z up, -Y is the front of the face, +X is the patient's left,
1 unit ~ 1 cm.
"""
import bpy, bmesh, sys, os, json, math, random
from mathutils import Vector, Matrix, noise
from mathutils.bvhtree import BVHTree

sys.path.insert(0, os.path.dirname(__file__))
from common import load_skull, render_views

args = sys.argv[sys.argv.index("--") + 1:]
SRC, OUT = args[0], args[1]
FAST = "fast" in args
os.makedirs(OUT, exist_ok=True)
random.seed(7)
skull = load_skull(SRC)

# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------
def mat(name, color):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color = color
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    if b:
        b.inputs["Base Color"].default_value = color
    return m

M_BONE = mat("bone", (0.86, 0.83, 0.76, 1))
M_CUT = mat("cut", (0.78, 0.62, 0.5, 1))
M_TEETH = mat("teeth", (0.95, 0.94, 0.9, 1))
M_PLATE = {
    "blue": mat("ti_blue", (0.12, 0.25, 0.75, 1)),
    "gold": mat("ti_gold", (0.78, 0.63, 0.3, 1)),
    "green": mat("ti_green", (0.55, 0.62, 0.35, 1)),
    "teal": mat("ti_teal", (0.2, 0.62, 0.68, 1)),
    "grey": mat("ti_grey", (0.6, 0.62, 0.65, 1)),
}
M_SCREW = mat("ti_screw", (0.25, 0.22, 0.7, 1))


def link(ob):
    bpy.context.scene.collection.objects.link(ob)
    return ob


def obj_from_bm(name, bm, mats=()):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = link(bpy.data.objects.new(name, me))
    for m in mats:
        me.materials.append(m)
    return ob


def convex(name, planes, size=90.0):
    """Closed convex cutter: the intersection of half-spaces. Each plane is
    (point, normal) and the cutter keeps the side the normal points AWAY from."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=size)
    for co, no in planes:
        no = Vector(no).normalized()
        res = bmesh.ops.bisect_plane(
            bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:],
            plane_co=Vector(co), plane_no=no, clear_outer=True, clear_inner=False)
        edges = [g for g in res["geom_cut"] if isinstance(g, bmesh.types.BMEdge)]
        if edges:
            bmesh.ops.edgeloop_fill(bm, edges=edges)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    return obj_from_bm(name, bm, [M_CUT])


def jagged(name, point, normal, amp=0.06, freq=2.2, seed=0.0, size=26.0, n=110, depth=45.0):
    """A half-space whose boundary is a rough fracture surface. Keeps the side
    the normal points away from."""
    no = Vector(normal).normalized()
    u = no.orthogonal().normalized()
    v = no.cross(u).normalized()
    p0 = Vector(point)
    bm = bmesh.new()
    grid = []
    for i in range(n + 1):
        row = []
        for j in range(n + 1):
            a = (i / n - 0.5) * size
            b = (j / n - 0.5) * size
            h = amp * (noise.noise(Vector((a * freq, b * freq, seed)))
                       + 0.5 * noise.noise(Vector((a * freq * 3.1, b * freq * 3.1, seed + 9.0))))
            h += amp * 1.3 * noise.noise(Vector((a * 0.55, b * 0.55, seed + 3.0)))
            row.append(bm.verts.new(p0 + u * a + v * b + no * h))
        grid.append(row)
    faces = []
    for i in range(n):
        for j in range(n):
            faces.append(bm.faces.new((grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1])))
    res = bmesh.ops.extrude_face_region(bm, geom=faces)
    new_verts = [g for g in res["geom"] if isinstance(g, bmesh.types.BMVert)]
    for vert in new_verts:
        # flatten the far side so the cutter is a simple slab
        d = (vert.co - p0).dot(no)
        vert.co += no * (-depth - d)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    return obj_from_bm(name, bm, [M_CUT])


def boolean(target, cutter, op, name):
    dup = target.copy()
    dup.data = target.data.copy()
    dup.name = name
    link(dup)
    mod = dup.modifiers.new("b", "BOOLEAN")
    mod.operation = op
    mod.solver = "EXACT"
    mod.object = cutter
    try:
        mod.material_mode = "TRANSFER"
    except Exception:
        pass
    dg = bpy.context.evaluated_depsgraph_get()
    dg.update()
    me = bpy.data.meshes.new_from_object(dup.evaluated_get(dg))
    dup.modifiers.clear()
    dup.data = me
    me.name = name
    return dup


def join(objs, name):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    if len(objs) > 1:
        bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active
    o.name = name
    o.data.name = name
    return o


def separate_loose(o):
    bpy.ops.object.select_all(action="DESELECT")
    o.select_set(True)
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.separate(type="LOOSE")
    bpy.ops.object.mode_set(mode="OBJECT")
    return list(bpy.context.selected_objects)


def centroid(o):
    c = Vector()
    for v in o.data.vertices:
        c += v.co
    return c / max(1, len(o.data.vertices))


def set_material(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)


def remove(*objs):
    for o in objs:
        bpy.data.objects.remove(o, do_unlink=True)


def keep_big(o, min_verts=40):
    """Drop boolean crumbs."""
    parts = separate_loose(o)
    big = [p for p in parts if len(p.data.vertices) >= min_verts]
    for p in parts:
        if p not in big:
            remove(p)
    return join(big, o.name) if big else None


# --------------------------------------------------------------------------
# 1. load, ambient occlusion on the intact skull
# --------------------------------------------------------------------------
set_material(skull, M_BONE)

# triangulated reference copy: source of normals + AO for every segment
ref_bm = bmesh.new()
ref_bm.from_mesh(skull.data)
bmesh.ops.triangulate(ref_bm, faces=ref_bm.faces[:])
ref_bm.verts.ensure_lookup_table()
ref_bm.faces.ensure_lookup_table()
ref_bm.normal_update()
REF_CO = [v.co.copy() for v in ref_bm.verts]
REF_NO = [v.normal.copy() for v in ref_bm.verts]
REF_TRI = [tuple(v.index for v in f.verts) for f in ref_bm.faces]
REF_BVH = BVHTree.FromPolygons(REF_CO, REF_TRI)
ref_bm.free()


def hemi(nrm, k):
    out = []
    t = nrm.orthogonal().normalized()
    b = nrm.cross(t)
    for i in range(k):
        r1 = (i + random.random()) / k
        r2 = random.random()
        r = math.sqrt(r1)
        ph = 2 * math.pi * r2
        out.append((t * (r * math.cos(ph)) + b * (r * math.sin(ph)) + nrm * math.sqrt(1 - r1)).normalized())
    return out


REF_AO = [1.0] * len(REF_CO)
if not FAST:
    K, DIST = 40, 3.2
    for i, (co, no) in enumerate(zip(REF_CO, REF_NO)):
        o = co + no * 0.015
        occ = 0.0
        for d in hemi(no, K):
            hit = REF_BVH.ray_cast(o, d, DIST)
            if hit[0] is not None:
                occ += 1.0 - 0.6 * (hit[3] / DIST)
        REF_AO[i] = 1.0 - occ / K
    # light smoothing over the mesh graph
    nb = [[] for _ in REF_CO]
    for a, b, c in REF_TRI:
        nb[a] += (b, c); nb[b] += (a, c); nb[c] += (a, b)
    for _ in range(2):
        REF_AO = [0.5 * REF_AO[i] + 0.5 * (sum(REF_AO[j] for j in nb[i]) / len(nb[i]) if nb[i] else REF_AO[i])
                  for i in range(len(REF_AO))]
    print("AO done", min(REF_AO), max(REF_AO))


def sample_ref(p):
    loc, nrm, fi, dist = REF_BVH.find_nearest(p)
    a, b, c = REF_TRI[fi]
    pa, pb, pc = REF_CO[a], REF_CO[b], REF_CO[c]
    v0, v1, v2 = pb - pa, pc - pa, loc - pa
    d00, d01, d11, d20, d21 = v0.dot(v0), v0.dot(v1), v1.dot(v1), v2.dot(v0), v2.dot(v1)
    den = d00 * d11 - d01 * d01
    if abs(den) < 1e-14:
        w1 = w2 = 0.0
    else:
        w1 = (d11 * d20 - d01 * d21) / den
        w2 = (d00 * d21 - d01 * d20) / den
    w0 = 1 - w1 - w2
    n = (REF_NO[a] * w0 + REF_NO[b] * w1 + REF_NO[c] * w2).normalized()
    ao = REF_AO[a] * w0 + REF_AO[b] * w1 + REF_AO[c] * w2
    return n, ao


# --------------------------------------------------------------------------
# 2. split into anatomical islands
# --------------------------------------------------------------------------
parts = separate_loose(skull)
parts.sort(key=lambda o: len(o.data.vertices), reverse=True)
cranium, mandible, teeth = parts[0], parts[1], parts[2:]
cranium.name, mandible.name = "cranium_src", "mandible_src"
upper_teeth = [t for t in teeth if centroid(t).z > -2.7]
lower_teeth = [t for t in teeth if centroid(t).z <= -2.7]
for t in teeth:
    set_material(t, M_TEETH)
print("teeth", len(upper_teeth), len(lower_teeth))

# --------------------------------------------------------------------------
# 3. osteotomies
# --------------------------------------------------------------------------
# Le Fort I: a level cut above the tooth roots, from the rim of the nasal
# opening back to the pterygoid plates.
LF_SLOPE = -0.09
C_lf = convex("C_lf", [((0, -7, 0.30), (0, -LF_SLOPE, 1)), ((0, -2.25, 0), (0, 1, 0))])
maxilla = keep_big(boolean(cranium, C_lf, "INTERSECT", "maxilla"))
cran_rest = boolean(cranium, C_lf, "DIFFERENCE", "cran_rest")

# Zygoma (patient's left) for the trauma case: a rough block around the
# cheekbone body, between the frontal process, the arch and the buttress.
ZYG = dict(z_top=3.05, z_bot=0.42, y_arch=-2.75, x_med=2.55)
Jz_top = jagged("Jz_top", (4.6, -4.6, ZYG["z_top"]), (0.15, 0.1, 1), amp=0.035, seed=11)
Jz_arch = jagged("Jz_arch", (5.6, ZYG["y_arch"], 1.0), (0.25, 1, 0.05), amp=0.035, seed=23)
Jz_med = jagged("Jz_med", (ZYG["x_med"], -5.6, 1.2), (-1, 0.55, 0.38), amp=0.04, seed=31)
C_zb = convex("C_zb", [((0, 0, ZYG["z_bot"]), (0, 0, -1)), ((1.5, 0, 0), (-1, 0, 0))])
c = boolean(Jz_top, Jz_arch, "INTERSECT", "c1")
c2 = boolean(c, Jz_med, "INTERSECT", "c2")
C_zyg = boolean(c2, C_zb, "INTERSECT", "C_zyg")
remove(c, c2)
zygoma = keep_big(boolean(cran_rest, C_zyg, "INTERSECT", "zygoma"), 30)
cran_final = boolean(cran_rest, C_zyg, "DIFFERENCE", "cranium")
remove(cran_rest)

# Bilateral sagittal split of the mandible.
YB = -3.4          # buccal vertical cut, at the second molar
ZH = -1.4          # medial horizontal cut, above the lingula


def tongue(sign):
    s = sign
    return convex("tongue", [
        ((3.05 * s, -3.2, 0), (3.4 * s, -1.1, 0)),     # sagittal plane; keep medial
        ((0, 0, ZH), (0, 0, 1)),                        # below the horizontal cut
        ((0, 0.1, -1.6), (0, 3.8, -1.3)),               # in front of the back edge of the split
        ((0.4 * s, 0, 0), (-s, 0, 0)),                  # this side only
        ((0, -3.4, -5.8), (0, 0.4, -1)),                # leave the lower border on the joint segment
    ])


C_front = convex("C_front", [((0, YB, 0), (0, 1, 0))])
tL, tR = tongue(1), tongue(-1)
u1 = boolean(C_front, tL, "UNION", "u1")
C_dist = boolean(u1, tR, "UNION", "C_dist")
remove(u1)
distal_all = keep_big(boolean(mandible, C_dist, "INTERSECT", "distal_all"))
prox = boolean(mandible, C_dist, "DIFFERENCE", "prox")
pp = separate_loose(prox)
prox_L = join([p for p in pp if centroid(p).x > 0], "mand_prox_L")
prox_R = join([p for p in pp if centroid(p).x <= 0], "mand_prox_R")

# Sliding genioplasty: a level cut under the tooth roots and the mental nerves.
GENIO_Z, GENIO_SLOPE = -5.75, -0.22
C_chin = convex("C_chin", [((0, -7, GENIO_Z), (0, -GENIO_SLOPE, 1))])
chin = keep_big(boolean(distal_all, C_chin, "INTERSECT", "chin"))
distal = boolean(distal_all, C_chin, "DIFFERENCE", "mand_distal")
remove(distal_all)

# --------------------------------------------------------------------------
# 4. the fractured mandible for the trauma case
# --------------------------------------------------------------------------
N_PARA = Vector((0.42, -0.91, 0.25)).normalized()
P_PARA = Vector((-1.55, -6.0, -5.0))
N_ANG = Vector((0, -0.91, -0.42)).normalized()
P_ANG = Vector((4.0, -1.7, -4.0))
J_para = jagged("J_para", P_PARA, N_PARA, amp=0.05, seed=41)
J_ang = jagged("J_ang", P_ANG, N_ANG, amp=0.05, seed=53)
C_r = convex("C_r", [((0.3, 0, 0), (1, 0, 0))])
C_l = convex("C_l", [((0.5, 0, 0), (-1, 0, 0))])
cutR = boolean(J_para, C_r, "INTERSECT", "cutR")
cutL = boolean(J_ang, C_l, "INTERSECT", "cutL")
frag_R = keep_big(boolean(mandible, cutR, "INTERSECT", "frag_R"))
frag_L = keep_big(boolean(mandible, cutL, "INTERSECT", "frag_L"))
m1 = boolean(mandible, cutR, "DIFFERENCE", "m1")
frag_M = keep_big(boolean(m1, cutL, "DIFFERENCE", "frag_M"))
remove(m1)

# --------------------------------------------------------------------------
# 5. teeth follow their bone
# --------------------------------------------------------------------------
def dup(o):
    d = o.copy(); d.data = o.data.copy(); link(d); return d


tr_R, tr_M = [], []
for t in lower_teeth:
    c = centroid(t)
    side = (c - P_PARA).dot(N_PARA)
    (tr_R if (side < 0 and c.x < 0.3) else tr_M).append(dup(t))
print("trauma teeth R/M", len(tr_R), len(tr_M))

def fdi_for(group, upper):
    out = {}
    for sign, quad in ((-1, 1 if upper else 4), (1, 2 if upper else 3)):
        side = [t for t in group if centroid(t).x * sign > 0]
        side.sort(key=lambda t: math.atan2(abs(centroid(t).x), -2.0 - centroid(t).y))
        for i, t in enumerate(side):
            out[quad * 10 + i + 1] = t
    return out


TEETH = {}
for num, t in {**fdi_for(upper_teeth, True), **fdi_for(lower_teeth, False)}.items():
    t.name = f"tooth_{num}"; t.data.name = t.name
    TEETH[t.name] = t
print("TEETH", sorted(int(k[6:]) for k in TEETH))
EXTRA = {"maxilla": upper_teeth, "mand_distal": lower_teeth}
frag_R = join([frag_R] + tr_R, "frag_R")
frag_M = join([frag_M] + tr_M, "frag_M")

SEGMENTS = {
    "cranium": cran_final, "zygoma": zygoma, "maxilla": maxilla,
    "mand_prox_L": prox_L, "mand_prox_R": prox_R, "mand_distal": distal, "chin": chin,
    "frag_R": frag_R, "frag_M": frag_M, "frag_L": frag_L,
}
for k, o in SEGMENTS.items():
    o.name = k
    o.data.name = k

remove(cranium, mandible, C_lf, Jz_top, Jz_arch, Jz_med, C_zb, C_zyg, C_front, tL, tR, C_dist,
       C_chin, J_para, J_ang, C_r, C_l, cutR, cutL)

# --------------------------------------------------------------------------
# 6. normals + AO from the intact skull; cut faces stay flat
# --------------------------------------------------------------------------
def slot_index(o, m):
    for i, s in enumerate(o.data.materials):
        if s == m:
            return i
    return -1


CUT_LINES = {}
for name, o in list(SEGMENTS.items()) + list(TEETH.items()):
    me = o.data
    # order slots bone, cut, teeth for stable primitive order
    ci = slot_index(o, M_CUT)
    samples = {}
    for v in me.vertices:
        samples[v.index] = sample_ref(v.co)
    col = me.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
    for v in me.vertices:
        a = samples[v.index][1]
        col.data[v.index].color = (a, a, a, 1.0)
    me.color_attributes.active_color = col
    me.color_attributes.render_color_index = 0
    for p in me.polygons:
        p.use_smooth = True
    normals = [None] * len(me.loops)
    for p in me.polygons:
        is_cut = p.material_index == ci and ci >= 0
        for li in p.loop_indices:
            normals[li] = p.normal.copy() if is_cut else samples[me.loops[li].vertex_index][0]
    me.normals_split_custom_set([tuple(n) for n in normals])

    # outline of the cut on the outer surface (edges between cut and bone faces)
    if ci >= 0:
        bm = bmesh.new(); bm.from_mesh(me); bm.edges.ensure_lookup_table()
        segs = []
        for e in bm.edges:
            fs = e.link_faces
            if len(fs) == 2 and (fs[0].material_index == ci) != (fs[1].material_index == ci):
                segs.append((e.verts[0].index, e.verts[1].index))
        co = [v.co.copy() for v in bm.verts]
        bm.free()
        adj = {}
        for a, b in segs:
            adj.setdefault(a, []).append(b); adj.setdefault(b, []).append(a)
        used = set(); chains = []
        for a, b in segs:
            if (a, b) in used or (b, a) in used:
                continue
            chain = [a, b]; used.add((a, b))
            for end in (1, 0):
                while True:
                    tip = chain[-1] if end else chain[0]
                    prev = chain[-2] if end else chain[1]
                    nxt = [n for n in adj[tip] if n != prev and (tip, n) not in used and (n, tip) not in used]
                    if not nxt:
                        break
                    used.add((tip, nxt[0]))
                    if end: chain.append(nxt[0])
                    else: chain.insert(0, nxt[0])
                    if nxt[0] == (chain[0] if end else chain[-1]):
                        break
            if len(chain) > 6:
                chains.append([co[i] for i in chain])
        CUT_LINES[name] = chains
    if name in SEGMENTS: print("SEG", name, len(me.vertices), len(me.polygons), "cutlines", len(CUT_LINES.get(name, [])))

# --------------------------------------------------------------------------
# 7. poses (cm) — the single source for Blender and the web viewer
# --------------------------------------------------------------------------
ADV = 0.5      # both jaws advance 5 mm
CHIN = 0.4     # the chin a further 4 mm
POSE_BIMAX = {
    "maxilla": Vector((0, -ADV, 0)),
    "mand_distal": Vector((0, -ADV, 0)),
    "chin": Vector((0, -ADV - CHIN, 0.05)),
}
# trauma "before": fragments pulled out of place by the muscles
TRAUMA_BEFORE = {
    "frag_M": dict(t=(0.05, 0.22, -0.34), axis=(1, 0, 0), deg=-5.0, pivot=(0, -3.0, -4.0)),
    "frag_L": dict(t=(-0.10, -0.12, 0.16), axis=(1, 0, 0), deg=5.0, pivot=(4.6, 0.4, 1.6)),
    "zygoma": dict(t=(-0.22, 0.34, -0.26), axis=(0, 0, 1), deg=-7.0, pivot=(4.2, -4.4, 1.6)),
}


def world_tris(names, offsets):
    cos, tris = [], []
    for n in names:
        off = offsets.get(n, Vector())
        for o in [SEGMENTS[n]] + EXTRA.get(n, []):
            base = len(cos)
            cos += [v.co + off for v in o.data.vertices]
            for p in o.data.polygons:
                vs = [base + i for i in p.vertices]
                for k in range(1, len(vs) - 1):
                    tris.append((vs[0], vs[k], vs[k + 1]))
    return BVHTree.FromPolygons(cos, tris)


ORTHO = ["cranium", "zygoma", "maxilla", "mand_prox_L", "mand_prox_R", "mand_distal", "chin"]
TRAUMA = ["cranium", "zygoma", "maxilla", "frag_R", "frag_M", "frag_L"]
BVH_ORTHO = world_tris(ORTHO, POSE_BIMAX)
BVH_TRAUMA = world_tris(TRAUMA, {})


# --------------------------------------------------------------------------
# 7b. teeth: a ceramic crown for each one, one implant, and where they go
# --------------------------------------------------------------------------
import numpy as np

M_CERAMIC = mat("ceramic", (0.98, 0.98, 0.96, 1))
M_IMPLANT = mat("ti_implant", (0.62, 0.64, 0.67, 1))
M_ABUT = mat("ti_abutment", (0.75, 0.74, 0.7, 1))
TOOTH_DATA = []
crown_objs = []
for name, t in sorted(TEETH.items()):
    num = int(name[6:])
    upper = num < 30
    pts = np.array([tuple(v.co) for v in t.data.vertices])
    c = pts.mean(axis=0)
    w, vec = np.linalg.eigh(np.cov((pts - c).T))
    axis = Vector(vec[:, 2]).normalized()
    if (axis.z > 0) == upper:           # point the axis at the biting edge
        axis = -axis
    c = Vector(c)
    proj = [(v.co - c).dot(axis) for v in t.data.vertices]
    s_tip, s_apex = max(proj), min(proj)
    s_cej = s_tip - 0.42 * (s_tip - s_apex)
    cej = c + axis * s_cej
    ring = [((v.co - cej) - axis * (v.co - cej).dot(axis)).length
            for v, pr in zip(t.data.vertices, proj) if abs(pr - s_cej) < 0.12]
    radius = (sum(ring) / len(ring)) if ring else 0.3

    bm = bmesh.new(); bm.from_mesh(t.data)
    res = bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:],
                                 plane_co=cej, plane_no=axis, clear_inner=True, clear_outer=False)
    edges = [g for g in res["geom_cut"] if isinstance(g, bmesh.types.BMEdge)]
    if edges:
        bmesh.ops.edgeloop_fill(bm, edges=edges)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    cr = obj_from_bm(f"crown_{num}", bm, [M_CERAMIC])
    for q in cr.data.polygons:
        q.use_smooth = True
    try:
        cr.data.set_sharp_from_angle(angle=math.radians(50))
    except Exception:
        pass
    crown_objs.append(cr)
    TOOTH_DATA.append(dict(id=num, upper=upper, axis=axis.copy(), cej=cej.copy(),
                           tip=c + axis * s_tip, apex=c + axis * s_apex, r=radius))

# One implant, drawn along +Z with the platform at the origin (the gum line).
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=28, radius1=0.2, radius2=0.215, depth=0.14,
                      matrix=Matrix.Translation((0, 0, -0.07)))                    # polished collar
RINGS, PITCH = 13, 0.075
for k in range(RINGS):                                                              # thread
    core = 0.19 - 0.05 * (k / RINGS)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=28, radius1=core - 0.02, radius2=core + 0.03, depth=PITCH,
                          matrix=Matrix.Translation((0, 0, -0.14 - PITCH / 2 - k * PITCH)))
bmesh.ops.create_cone(bm, cap_ends=True, segments=28, radius1=0.05, radius2=0.12, depth=0.1,
                      matrix=Matrix.Translation((0, 0, -0.14 - RINGS * PITCH - 0.05)))  # rounded tip
implant = obj_from_bm("implant", bm, [M_IMPLANT])
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=28, radius1=0.2, radius2=0.17, depth=0.07,
                      matrix=Matrix.Translation((0, 0, 0.035)))
bmesh.ops.create_cone(bm, cap_ends=True, segments=6, radius1=0.15, radius2=0.1, depth=0.34,
                      matrix=Matrix.Translation((0, 0, 0.07 + 0.17)))
abutment = obj_from_bm("abutment", bm, [M_ABUT])
for o in (implant, abutment):
    bev = o.modifiers.new("bev", "BEVEL"); bev.width = 0.012; bev.segments = 2
    bev.limit_method = "ANGLE"; bev.angle_limit = math.radians(40)
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    me2 = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    o.modifiers.clear(); o.data = me2
    for q in me2.polygons:
        q.use_smooth = True
    try:
        me2.set_sharp_from_angle(angle=math.radians(35))
    except Exception:
        pass
print("TOOTH DATA", len(TOOTH_DATA), "r", round(min(d["r"] for d in TOOTH_DATA), 2), round(max(d["r"] for d in TOOTH_DATA), 2))

# --------------------------------------------------------------------------
# 8. plates
# --------------------------------------------------------------------------
T, R_HOLE, W_BAR, LIFT = 0.085, 0.23, 0.26, 0.012
PLATES, SCREWS = {}, []


def frame(z, x_hint):
    z = z.normalized()
    x = (x_hint - z * x_hint.dot(z))
    if x.length < 1e-6:
        x = z.orthogonal()
    x.normalize()
    y = z.cross(x)
    return Matrix((x, y, z)).transposed().to_4x4()


def build_plate(name, bvh, ray, origin, u_axis, holes, links, color, anchor, anchor_off=Vector(), group=""):
    ray = Vector(ray).normalized()
    u = Vector(u_axis)
    u = (u - ray * u.dot(ray)).normalized()
    v = ray.cross(u).normalized()
    if v.z < 0:
        v = -v
    origin = Vector(origin)
    BACK = 12.0

    def cast(a, b):
        start = origin + u * a + v * b - ray * BACK
        hit = bvh.ray_cast(start, ray, 40)
        if hit[0] is None:
            return None
        n = hit[1].normalized()
        if n.dot(ray) > 0:
            n = -n
        return hit[0].copy(), n, hit[3], start

    pts = []
    for (a, b) in holes:
        h = cast(a, b)
        if h is None:
            raise RuntimeError(f"plate {name}: hole {(a, b)} missed the bone")
        pts.append(h)

    bm = bmesh.new()
    for p, n, _, _ in pts:
        m = Matrix.Translation(p + n * (LIFT + T / 2)) @ frame(n, u)
        bmesh.ops.create_cone(bm, cap_ends=True, segments=32, radius1=R_HOLE, radius2=R_HOLE, depth=T, matrix=m)

    for i, j in links:
        (a1, b1), (a2, b2) = holes[i], holes[j]
        d1, d2 = pts[i][2], pts[j][2]
        n1, n2 = pts[i][1], pts[j][1]
        length = (pts[j][0] - pts[i][0]).length
        K = max(4, int(length / 0.07))
        st = []
        for k in range(K + 1):
            t = k / K
            a, b = a1 + (a2 - a1) * t, b1 + (b2 - b1) * t
            lin = d1 + (d2 - d1) * t
            nl = (n1 * (1 - t) + n2 * t).normalized()
            h = cast(a, b)
            start = origin + u * a + v * b - ray * BACK
            if h is None or h[2] > lin - 0.002 or k in (0, K):
                st.append([start + ray * lin, nl])      # bridge straight across a gap or hollow
            else:
                st.append([h[0], (h[1] * 0.6 + nl * 0.4).normalized()])
        for _ in range(3):                               # relax, ends fixed
            st = [st[0]] + [[(st[k - 1][0] + st[k][0] * 2 + st[k + 1][0]) / 4,
                             (st[k - 1][1] + st[k][1] * 2 + st[k + 1][1]).normalized()] for k in range(1, K)] + [st[K]]
        rings = []
        for k in range(K + 1):
            p, n = st[k]
            tan = (st[min(K, k + 1)][0] - st[max(0, k - 1)][0]).normalized()
            n = (n - tan * n.dot(tan)).normalized()
            side = n.cross(tan).normalized()
            c = p + n * (LIFT + T / 2)
            rings.append([bm.verts.new(c + side * (sx * W_BAR / 2) + n * (sz * T / 2))
                          for sx, sz in ((-1, -1), (1, -1), (1, 1), (-1, 1))])
        for k in range(K):
            for q in range(4):
                bm.faces.new((rings[k][q], rings[k][(q + 1) % 4], rings[k + 1][(q + 1) % 4], rings[k + 1][q]))
        bm.faces.new(rings[0]); bm.faces.new(rings[K])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    ob = obj_from_bm(name, bm, [M_PLATE[color]])
    bev = ob.modifiers.new("bev", "BEVEL")
    bev.width = 0.02; bev.segments = 2; bev.limit_method = "ANGLE"; bev.angle_limit = math.radians(50)
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    ob.modifiers.clear(); ob.data = me
    for p in me.polygons:
        p.use_smooth = True
    try:
        me.set_sharp_from_angle(angle=math.radians(40))
    except Exception as e:
        print("sharp fail", e)
    for vert in me.vertices:
        vert.co -= anchor_off
    mean_n = sum((h[1] for h in pts), Vector()).normalized()
    PLATES[name] = dict(anchor=anchor, color=color, normal=mean_n, group=group,
                        center=sum((h[0] for h in pts), Vector()) / len(pts) - anchor_off)
    for h in pts:
        SCREWS.append(dict(plate=name, p=h[0] + h[1] * (LIFT + T) - anchor_off, n=h[1]))
    return ob


chain4 = [(0, 1), (1, 2), (2, 3)]
plate_objs = []
for s, tag in ((1, "L"), (-1, "R")):
    # Le Fort I — beside the nasal opening
    plate_objs.append(build_plate(
        f"plate_lf_nasal_{tag}", BVH_ORTHO, (-0.35 * s, 1, 0), (1.62 * s, -6.6, 0.3), (s, 0, 0),
        [(0.1, 1.2), (0.02, 0.55), (0.0, -0.42), (0.66, -0.52)], chain4, "blue", "cranium", group="lefort"))
    # Le Fort I — on the cheekbone buttress
    plate_objs.append(build_plate(
        f"plate_lf_buttress_{tag}", BVH_ORTHO, (-0.55 * s, 0.83, 0), (2.95 * s, -5.2, 0.12), (0.83 * s, 0.55, 0),
        [(0.3, 1.05), (0.12, 0.45), (0.0, -0.42), (0.66, -0.52)], chain4, "blue", "cranium", group="lefort"))
    # Sagittal split — one plate bridging each side
    plate_objs.append(build_plate(
        f"plate_bsso_{tag}", BVH_ORTHO, (-s, 0, 0), (4.5 * s, YB - ADV / 2, -4.25), (0, 1, 0),
        [(1.65, 0.12), (0.98, 0.06), (-0.98, -0.04), (-1.65, -0.1)], chain4, "green", f"mand_prox_{tag}", group="bsso"))
# Genioplasty — one stepped plate, stored relative to the tooth-bearing segment
plate_objs.append(build_plate(
    "plate_chin", BVH_ORTHO, (0, 1, 0), (0, -8, GENIO_Z - 0.06), (1, 0, 0),
    [(-0.56, 0.56), (0.56, 0.56), (0.56, -0.54), (-0.56, -0.54)], [(0, 1), (1, 2), (2, 3), (3, 0)],
    "gold", "mand_distal", anchor_off=POSE_BIMAX["mand_distal"], group="genio"))

# Trauma — fractures reduced to the intact anatomy and plated
U_PARA = Vector((-0.86, 0.5, 0))
for tag, vv, col in (("upper", 0.42, "teal"), ("lower", -0.72, "teal")):
    plate_objs.append(build_plate(
        f"plate_para_{tag}", BVH_TRAUMA, (0.5, 0.86, 0), (-1.62, -6.3, -5.35), U_PARA,
        [(-1.12, vv), (-0.45, vv), (0.45, vv), (1.12, vv)], chain4, col, "frag_R", group="trauma"))
plate_objs.append(build_plate(
    "plate_angle", BVH_TRAUMA, (-1, 0, 0), (5.2, -1.75, -3.55), (0, 0.91, 0.42),
    [(-1.2, 0), (-0.5, 0), (0.5, 0), (1.2, 0)], chain4, "teal", "frag_L", group="trauma"))
# Cheekbone: brow suture, rim of the eye socket, buttress
plate_objs.append(build_plate(
    "plate_zyg_fz", BVH_TRAUMA, (-0.8, 0.6, 0), (4.75, -4.3, ZYG["z_top"]), (0, 0, 1),
    [(1.0, 0.0), (0.38, 0.0), (-0.38, 0.0), (-1.0, 0.0)], chain4, "gold", "cranium", group="trauma"))
plate_objs.append(build_plate(
    "plate_zyg_rim", BVH_TRAUMA, (-0.25, 1, 0.15), (2.75, -6.2, 1.45), (1, 0, -0.35),
    [(-1.0, 0.0), (-0.38, 0.0), (0.38, 0.0), (1.0, 0.0)], chain4, "gold", "cranium", group="trauma"))
plate_objs.append(build_plate(
    "plate_zyg_buttress", BVH_TRAUMA, (-0.6, 0.8, 0), (3.35, -5.0, ZYG["z_bot"] + 0.05), (0.8, 0.6, 0.0),
    [(0.42, 1.05), (0.2, 0.45), (0.05, -0.42), (0.68, -0.52)], chain4, "gold", "cranium", group="trauma"))

# one screw mesh, instanced by the viewer: +Z is out of the bone
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=20, radius1=0.148, radius2=0.11, depth=0.05,
                      matrix=Matrix.Translation((0, 0, 0.012)))
for k in range(7):  # threaded shaft, below the head
    z = -0.05 - k * 0.075
    bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=0.045, radius2=0.07, depth=0.075,
                          matrix=Matrix.Translation((0, 0, z)))
bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=0.0, radius2=0.045, depth=0.09,
                      matrix=Matrix.Translation((0, 0, -0.05 - 7 * 0.075 - 0.008)))
screw = obj_from_bm("screw", bm, [M_SCREW])
slot_bm = bmesh.new()
for rot in (0, math.pi / 2):
    bmesh.ops.create_cube(slot_bm, size=1.0, matrix=Matrix.Rotation(rot, 4, "Z") @ Matrix.Translation((0, 0, 0.0385)) @ Matrix.Diagonal((0.17, 0.032, 0.004, 1)))
slot = obj_from_bm("screw_slot", slot_bm, [mat("ti_slot", (0.03, 0.03, 0.06, 1))])
screw = join([screw, slot], "screw")
for p in screw.data.polygons:
    p.use_smooth = False

# --------------------------------------------------------------------------
# 9. landmarks for the labels (snapped to the bone)
# --------------------------------------------------------------------------
LM_SRC = {
    "frontal": ((0, -8.5, 6.2), (0, 1, 0)),
    "orbit": ((3.2, -7.5, 3.4), (0, 1, 0)),
    "nasal": ((0.35, -9, 2.6), (0, 1, 0)),
    "zygoma": ((6.2, -6.2, 1.5), (-0.8, 0.6, 0)),
    "maxilla": ((1.9, -9, -0.25), (-0.2, 1, 0)),
    "tmj": ((7.5, 0.35, 2.15), (-1, 0, 0)),
    "ramus": ((7, -0.4, -2.2), (-1, 0, 0)),
    "angle": ((7, -0.7, -4.6), (-1, 0, 0)),
    "mental": ((2.3, -9, -5.4), (-0.35, 1, 0)),
    "chin": ((0, -9, -6.2), (0, 1, 0)),
}
BVH_REST = world_tris(ORTHO, {})
LANDMARKS = {}
for k, (start, d) in LM_SRC.items():
    hit = BVH_REST.ray_cast(Vector(start), Vector(d).normalized(), 30)
    if hit[0] is None:
        print("LANDMARK MISS", k); continue
    n = hit[1].normalized()
    if n.dot(Vector(d)) > 0: n = -n
    LANDMARKS[k] = (hit[0].copy(), n)

# --------------------------------------------------------------------------
# 9b. soft tissue: a head fitted over the skull, with per-vertex weights that
#     say how far the skin follows each jaw (R upper jaw, G lower jaw, B chin)
# --------------------------------------------------------------------------
HEAD = next((a for a in args[2:] if a.lower().endswith(".glb")), None)
face = None
eyes = None
if HEAD:
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=HEAD)
    new = [o for o in bpy.data.objects if o not in before]
    hm = [o for o in new if o.type == "MESH"]
    bpy.ops.object.select_all(action="DESELECT")
    for o in hm:
        o.select_set(True)
    bpy.context.view_layer.objects.active = hm[0]
    bpy.ops.object.parent_clear(type="CLEAR_KEEP_TRANSFORM")
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    for o in new:
        if o.type != "MESH":
            bpy.data.objects.remove(o)

    def vol(o):
        d = o.dimensions
        return d.x * d.y * d.z

    hm.sort(key=vol, reverse=True)
    face = hm[0]
    if len(hm) > 1:
        eyes = join(hm[1:], "eyes")
    face.name = "face"; face.data.name = "face"
    bm = bmesh.new(); bm.from_mesh(face.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bm.to_mesh(face.data); bm.free()
    me = face.data
    H0 = [v.co.copy() for v in me.vertices]
    TRI = [tuple(p.vertices) for p in me.polygons]
    xs = [v.x for v in H0]; ys = [v.y for v in H0]; zs = [v.z for v in H0]
    c0 = Vector(((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, max(zs)))   # top-centre anchor

    def place(p):
        sx, sy, sz, ty, tz = p
        return [Vector(((v.x - c0.x) * sx, (v.y - c0.y) * sy + ty, (v.z - c0.z) * sz + tz)) for v in H0]

    # Fit by landmarks: crown, back of the head, forehead, the point of the
    # chin and the width of the vault, each with its usual depth of soft tissue.
    SK = [v.co for n in ORTHO for o in [SEGMENTS[n]] + EXTRA.get(n, []) for v in o.data.vertices]
    top0 = max(zs); h0 = top0 - min(zs)
    front = [v for v in H0 if abs(v.x - c0.x) < 0.04 * (max(xs) - min(xs)) and v.y < c0.y]
    nose0 = min(front, key=lambda v: v.y)
    low = [v for v in front if v.z < nose0.z - 0.03 * h0]
    gn0 = min(low, key=lambda v: v.y + v.z)                      # most down-and-forward
    fh0 = min((v for v in front if top0 - 0.33 * h0 < v.z < top0 - 0.12 * h0), key=lambda v: v.y)
    back0 = max(ys)
    wid0 = max(abs(v.x - c0.x) for v in H0 if v.z > top0 - 0.22 * h0)

    s_top = max(v.z for v in SK)
    s_gn = min((v for v in SK if abs(v.x) < 0.6), key=lambda v: v.y + v.z)
    s_fh = min((v for v in SK if abs(v.x) < 0.6 and 6.0 < v.z < 10.0), key=lambda v: v.y)
    s_back = max(v.y for v in SK)
    s_wid = max(abs(v.x) for v in SK if v.z > 6.0)

    t_top, t_gnz, t_gny = s_top + 0.55, s_gn.z - 0.6, s_gn.y - 0.75
    sz = (t_top - t_gnz) / (top0 - gn0.z)
    tz = t_top                                              # anchor is the crown
    # depth: forehead and back of head fix the scale, the chin is the check
    sy = ((s_back + 0.6) - (s_fh.y - 0.5)) / (back0 - fh0.y)
    ty = (s_back + 0.6) - (back0 - c0.y) * sy
    sx = (s_wid + 0.6) / wid0
    p = [sx, sy, sz, ty, tz]
    chin_y = (gn0.y - c0.y) * sy + ty
    print("FACE FIT", [round(x, 3) for x in p], "chin y is", round(chin_y, 2), "wanted", round(t_gny, 2))
    P = place(p)
    zn = (nose0.z - c0.z) * sz + tz
    zg = (gn0.z - c0.z) * sz + tz
    for v in P:
        if v.z < zn and v.y < 2.0:
            k = min(1.0, (zn - v.z) / (zn - zg))
            k = k * k * (3 - 2 * k)
            fade = min(1.0, max(0.0, (2.0 - v.y) / 6.0))
            v.y += (t_gny - chin_y) * k * fade

    # keep the skin outside the bone
    C = Vector((0, 0.5, 3.5))
    NEED = 0.24
    disp = [Vector() for _ in P]
    for i, v in enumerate(P):
        loc, nrm, _, dist = BVH_REST.find_nearest(v)
        inside = (v - loc).dot(nrm) < 0
        if not inside and dist < 6.0:
            # the nearest face can be the inner table of the vault: confirm
            # by looking outward for bone that is still beyond the skin
            out = (v - C).normalized()
            far = BVH_REST.ray_cast(v + out * 0.01, out, 6.0)
            if far[0] is not None:
                loc, nrm, dist, inside = far[0], out, far[3], True
                h2 = BVH_REST.ray_cast(v + out * 8.0, -out, 8.0)
                if h2[0] is not None:
                    loc = h2[0]
        if inside and dist < 6.0:
            disp[i] = (loc + nrm * NEED) - v
        elif dist < NEED:
            disp[i] = nrm * (NEED - dist)
    nb = [set() for _ in P]
    for a, b, c in TRI:
        nb[a] |= {b, c}; nb[b] |= {a, c}; nb[c] |= {a, b}
    for _ in range(6):
        sm = [(disp[i] + sum((disp[j] for j in nb[i]), Vector())) / (1 + len(nb[i])) for i in range(len(P))]
        disp = [sm[i] if sm[i].length > disp[i].length else disp[i] * 0.5 + sm[i] * 0.5 for i in range(len(P))]
    P = [v + d for v, d in zip(P, disp)]
    print("FACE pushed", sum(1 for d in disp if d.length > 0.02))
    for v, co in zip(me.vertices, P):
        v.co = co
    me.update()


    # Eyes: carried by the same fit, then coloured by where each vertex sits
    # on the globe — pupil, iris, white.
    if eyes:
        dec = eyes.modifiers.new("dec", "DECIMATE"); dec.ratio = 0.3
        dg = bpy.context.evaluated_depsgraph_get(); dg.update()
        em = bpy.data.meshes.new_from_object(eyes.evaluated_get(dg))
        eyes.modifiers.clear(); eyes.data = em; em.name = "eyes"
        sx_, sy_, sz_, ty_, tz_ = p
        for v in em.vertices:
            v.co = Vector(((v.co.x - c0.x) * sx_, (v.co.y - c0.y) * sy_ + ty_, (v.co.z - c0.z) * sz_ + tz_))
        ecol = em.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
        for sign in (-1, 1):
            idx = [v.index for v in em.vertices if v.co.x * sign > 0]
            if not idx:
                continue
            cs = [em.vertices[i].co for i in idx]
            lo = Vector((min(c.x for c in cs), min(c.y for c in cs), min(c.z for c in cs)))
            hi = Vector((max(c.x for c in cs), max(c.y for c in cs), max(c.z for c in cs)))
            ec = (lo + hi) / 2
            R = ((hi.x - lo.x) + (hi.z - lo.z)) / 4
            near = [disp[i] for i, v in enumerate(P) if (v - ec).length < 2.2 * R]
            shift = (sum(near, Vector()) / len(near)) if near else Vector()
            for i in idx:
                d = em.vertices[i].co - ec
                rr = math.hypot(d.x, d.z)
                if d.y < -0.5 * (hi.y - lo.y) * 0.5 and rr < 0.2 * R:
                    colr = (0.02, 0.02, 0.025, 1)
                elif d.y < 0 and rr < 0.5 * R:
                    colr = (0.3, 0.2, 0.13, 1)
                else:
                    colr = (0.93, 0.92, 0.9, 1)
                ecol.data[i].color = colr
                em.vertices[i].co += shift
            print("EYE", sign, "centre", [round(x, 2) for x in ec], "R", round(R, 2), "shift", round(shift.length, 2))
        em.color_attributes.active_color = ecol
        em.color_attributes.render_color_index = 0
        for q in em.polygons:
            q.use_smooth = True
        set_material(eyes, mat("eye", (0.9, 0.9, 0.9, 1)))

    def seg_bvh(name):
        return world_tris([name], {})

    def sstep(t):
        t = min(1.0, max(0.0, t)); return t * t * (3 - 2 * t)

    bM, bD, bC = seg_bvh("maxilla"), seg_bvh("mand_distal"), seg_bvh("chin")
    col = me.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
    for i, v in enumerate(P):
        dM = bM.find_nearest(v)[3]; dD = bD.find_nearest(v)[3]; dC = bC.find_nearest(v)[3]
        wM = sstep(1 - (dM - 1.3) / 1.9) * sstep((1.7 - v.z) / 1.4)
        wD = sstep(1 - (min(dD, dC) - 1.3) / 1.9) * sstep((-1.4 - v.y) / 1.6)
        wC = sstep(1 - (dC - 1.0) / 1.6)
        s = wM + wD
        if s > 1: wM /= s; wD /= s
        col.data[i].color = (0.9 * wM, 0.9 * wD, 0.9 * wC, 1.0)
    me.color_attributes.active_color = col
    me.color_attributes.render_color_index = 0
    for q in me.polygons:
        q.use_smooth = True
    set_material(face, mat("skin", (0.85, 0.72, 0.64, 1)))

# --------------------------------------------------------------------------
# 10. export
# --------------------------------------------------------------------------
def gl(v):  # Blender Z-up -> glTF Y-up
    return [round(v.x, 4), round(v.z, 4), round(-v.y, 4)]


def simplify(chain, step=0.06):
    out = [chain[0]]
    for p in chain[1:]:
        if (p - out[-1]).length >= step:
            out.append(p)
    if (out[-1] - chain[-1]).length > 1e-5:
        out.append(chain[-1])
    return out


rig = {
    "units": "cm",
    "advance": ADV, "chinAdvance": CHIN,
    "pose": {k: gl(v) for k, v in POSE_BIMAX.items()},
    "traumaBefore": {k: dict(t=gl(Vector(d["t"])), axis=gl(Vector(d["axis"])), deg=d["deg"], pivot=gl(Vector(d["pivot"])))
                     for k, d in TRAUMA_BEFORE.items()},
    "plates": {k: dict(anchor=d["anchor"], color=d["color"], group=d["group"], normal=gl(d["normal"]), center=gl(d["center"]))
               for k, d in PLATES.items()},
    "screws": [dict(plate=s["plate"], p=gl(s["p"]), n=gl(s["n"])) for s in SCREWS],
    "cutLines": {k: [[gl(p) for p in simplify(c)] for c in chains] for k, chains in CUT_LINES.items()},
    "landmarks": {k: dict(p=gl(p), n=gl(n)) for k, (p, n) in LANDMARKS.items()},
    "teeth": [dict(id=d["id"], upper=d["upper"], axis=gl(d["axis"]), cej=gl(d["cej"]), tip=gl(d["tip"]),
                   apex=gl(d["apex"]), r=round(d["r"], 3)) for d in TOOTH_DATA],
}
with open(os.path.join(OUT, "rig.json"), "w") as f:
    json.dump(rig, f, separators=(",", ":"))

export = list(SEGMENTS.values()) + list(TEETH.values()) + crown_objs + plate_objs + [screw, implant, abutment]
if face: export.append(face)
if eyes: export.append(eyes)
bpy.ops.object.select_all(action="DESELECT")
for o in export:
    o.select_set(True)
bpy.context.view_layer.objects.active = export[0]
kw = dict(filepath=os.path.join(OUT, "skull.glb"), export_format="GLB", use_selection=True,
          export_apply=True, export_normals=True, export_yup=True, export_texcoords=False,
          export_animations=False, export_materials="EXPORT",
          export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7,
          export_draco_position_quantization=14, export_draco_normal_quantization=10,
          export_draco_color_quantization=8, export_draco_generic_quantization=12)
try:
    bpy.ops.export_scene.gltf(**kw, export_vertex_color="ACTIVE", export_all_vertex_colors=False,
                              export_active_vertex_color_when_no_material=True)
except TypeError as e:
    print("gltf fallback", e)
    bpy.ops.export_scene.gltf(**kw)
print("EXPORTED", os.path.getsize(kw["filepath"]))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "build.blend"))

# --------------------------------------------------------------------------
# 11. check renders
# --------------------------------------------------------------------------
COLORS = {"cranium": (0.85, 0.83, 0.78, 1), "zygoma": (0.9, 0.75, 0.75, 1), "maxilla": (0.75, 0.85, 0.95, 1),
          "mand_prox_L": (0.8, 0.9, 0.78, 1), "mand_prox_R": (0.8, 0.9, 0.78, 1), "mand_distal": (0.95, 0.9, 0.7, 1),
          "chin": (0.95, 0.78, 0.6, 1), "frag_R": (0.8, 0.9, 0.78, 1), "frag_M": (0.95, 0.9, 0.7, 1), "frag_L": (0.9, 0.78, 0.9, 1)}
for k, o in SEGMENTS.items():
    o.color = COLORS[k]
for o in plate_objs:
    o.color = bpy.data.materials[o.data.materials[0].name].diffuse_color
screw.hide_render = True
for o in crown_objs + [implant, abutment]: o.hide_render = True
if face: face.hide_render = True
if eyes: eyes.hide_render = True


def show(names, offsets, groups):
    for k, o in SEGMENTS.items():
        o.hide_render = k not in names
        o.location = offsets.get(k, Vector())
    for o in plate_objs:
        d = PLATES[o.name]
        o.hide_render = d["group"] not in groups
        o.location = offsets.get(d["anchor"], Vector())


V = {"front": (0, -1, 0.05), "left": (1, -0.12, 0), "q": (0.72, -0.7, 0.12), "qr": (-0.72, -0.7, 0.05)}
show(ORTHO, POSE_BIMAX, ["lefort", "bsso", "genio"])
render_views(os.path.join(OUT, "chk_bimax"), V, res=1100, ortho=15, target=(0, -2.5, -1.5))
show(TRAUMA, {}, ["trauma"])
render_views(os.path.join(OUT, "chk_trauma"), V, res=1100, ortho=15, target=(0, -2.5, -1.5))
if face:
    for o in bpy.data.objects: o.hide_render = True
    face.hide_render = False
    if eyes: eyes.hide_render = False; eyes.color = (0.2, 0.4, 0.9, 1)
    for o in TEETH.values(): o.hide_render = False
    for k in ("cranium", "zygoma", "maxilla", "mand_distal", "chin", "mand_prox_L", "mand_prox_R"):
        SEGMENTS[k].hide_render = False; SEGMENTS[k].location = Vector()
    face.color = (0.86, 0.72, 0.64, 1)
    render_views(os.path.join(OUT, "chk_face"), {"left": (1, 0, 0), "front": (0, -1, 0), "q": (0.72, -0.7, 0.12)}, res=900, ortho=26, target=(0, -1.5, 2.0))
print("DONE")
