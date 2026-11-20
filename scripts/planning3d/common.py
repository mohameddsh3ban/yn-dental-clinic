import bpy, bmesh, math, mathutils
from mathutils import Vector

def load_skull(src):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=src)
    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    bpy.ops.object.select_all(action='DESELECT')
    for o in meshes: o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active
    bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    for e in [x for x in bpy.data.objects if x.type == 'EMPTY']:
        bpy.data.objects.remove(e)
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
    bm.to_mesh(o.data); bm.free()
    o.name = "skull"
    return o

def islands(o):
    bm = bmesh.new(); bm.from_mesh(o.data); bm.verts.ensure_lookup_table()
    seen = set(); out = []
    for v in bm.verts:
        if v.index in seen: continue
        stack = [v]; seen.add(v.index); comp = []
        while stack:
            a = stack.pop(); comp.append(a.index)
            for e in a.link_edges:
                b = e.other_vert(a)
                if b.index not in seen:
                    seen.add(b.index); stack.append(b)
        out.append(comp)
    co = [v.co.copy() for v in bm.verts]
    bm.free()
    return out, co

def render_views(path_prefix, views, res=900, ortho=14.0, target=(0,0,2.5)):
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_WORKBENCH'
    sc.display.shading.light = 'STUDIO'
    sc.display.shading.color_type = 'OBJECT'
    sc.display.shading.show_cavity = True
    sc.display.shading.cavity_type = 'BOTH'
    sc.display.shading.show_shadows = False
    sc.render.resolution_x = res; sc.render.resolution_y = res
    sc.render.film_transparent = False
    if sc.world is None: sc.world = bpy.data.worlds.new("w")
    cam_d = bpy.data.cameras.new("cam"); cam_d.type = 'ORTHO'; cam_d.ortho_scale = ortho
    cam = bpy.data.objects.new("cam", cam_d); sc.collection.objects.link(cam); sc.camera = cam
    t = Vector(target)
    for name, d in views.items():
        d = Vector(d).normalized()
        cam.location = t + d * 60
        cam.rotation_euler = (t - cam.location).to_track_quat('-Z', 'Y').to_euler()
        sc.render.filepath = f"{path_prefix}_{name}.png"
        bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(cam)
