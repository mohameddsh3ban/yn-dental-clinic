"""Make the web crown from the licensed D46 mandibular molar source.

Usage (from the repository root):
  D:/Apps/Blender/blender.exe --background --factory-startup --python \
    scripts/planning3d/make_implant_molar.py -- --source C:/path/D46.stl

The dataset uses millimetres. The source long axis is inferred from the mesh;
its broad crown end is aligned to delivered +Y and the GLB uses metres.
The trim plane is deliberately above the root furcation so the exported asset
is an illustrative crown only.
"""

import argparse
import os
import sys

import bmesh
import bpy
import numpy as np
from mathutils import Vector


# Signed-axis QA identifies the broad one-piece crown at the positive end of
# this source's principal long axis. The median plane is its cervical trim.
CROWN_AXIS_QUANTILE = 0.5
OUTPUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'models', 'implant-molar.glb')


def args_after_double_dash():
    argv = sys.argv
    return argv[argv.index('--') + 1:] if '--' in argv else []


def bounds(mesh):
    coords = [vertex.co.copy() for vertex in mesh.vertices]
    return tuple((min(point[i] for point in coords), max(point[i] for point in coords)) for i in range(3))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', required=True, help='Licensed D46 STL downloaded from the cited Mendeley dataset')
    parser.add_argument('--output', default=OUTPUT)
    options = parser.parse_args(args_after_double_dash())

    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    bpy.ops.wm.stl_import(filepath=os.path.abspath(options.source))
    crown = bpy.context.selected_objects[0]
    crown.name = 'implant-molar-crown-fdi46'
    crown.data.name = 'implant-molar-crown-fdi46-mesh'

    source_points = np.array([tuple(vertex.co) for vertex in crown.data.vertices])
    source_mean = source_points.mean(axis=0)
    _, source_vectors = np.linalg.eigh(np.cov(source_points.T))
    crown_axis = source_vectors[:, -1]
    # Eigenvectors have two valid signs. In the cited D46 STL its broad
    # chewing surface lies toward positive source Z and its roots toward -Z.
    if crown_axis[2] < 0:
        crown_axis = -crown_axis
    projection = (source_points - source_mean) @ crown_axis
    cervical_projection = float(np.quantile(projection, CROWN_AXIS_QUANTILE))
    cervical_point = Vector((source_mean + crown_axis * cervical_projection).tolist())
    axis = Vector(crown_axis.tolist())

    # The negative-axis side has the two separated root tips. Keep the broad,
    # connected positive-axis crown and close a flat cervical base.
    mesh_bm = bmesh.new()
    mesh_bm.from_mesh(crown.data)
    bmesh.ops.bisect_plane(
        mesh_bm,
        geom=list(mesh_bm.verts) + list(mesh_bm.edges) + list(mesh_bm.faces),
        plane_co=cervical_point,
        plane_no=axis,
        clear_inner=True,
        clear_outer=False,
    )
    bmesh.ops.holes_fill(mesh_bm, edges=[edge for edge in mesh_bm.edges if edge.is_boundary], sides=0)
    mesh_bm.to_mesh(crown.data)
    mesh_bm.free()
    crown.data.update()

    # Align signed crown axis to +Y, convert millimetres to metres, then bake
    # the cervical plane at y=0 and centre the horizontal footprint.
    crown.rotation_mode = 'QUATERNION'
    crown.rotation_quaternion = axis.rotation_difference(Vector((0, 1, 0)))
    crown.scale = (0.001, 0.001, 0.001)
    bpy.context.view_layer.objects.active = crown
    crown.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    local_bounds = bounds(crown.data)
    shift_x = (local_bounds[0][0] + local_bounds[0][1]) * 0.5
    shift_y = local_bounds[1][0]
    shift_z = (local_bounds[2][0] + local_bounds[2][1]) * 0.5
    for vertex in crown.data.vertices:
        vertex.co.x -= shift_x
        vertex.co.y -= shift_y
        vertex.co.z -= shift_z
    crown.data.update()

    material = bpy.data.materials.new('Natural enamel')
    material.diffuse_color = (0.91, 0.84, 0.68, 1.0)
    material.use_nodes = True
    principled = material.node_tree.nodes.get('Principled BSDF')
    principled.inputs['Base Color'].default_value = (0.91, 0.84, 0.68, 1.0)
    principled.inputs['Roughness'].default_value = 0.28
    crown.data.materials.append(material)

    # Smooth normals preserve scan detail without making the cut edge faceted.
    for polygon in crown.data.polygons:
        polygon.use_smooth = True

    os.makedirs(os.path.dirname(os.path.abspath(options.output)), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=os.path.abspath(options.output),
        export_format='GLB',
        use_selection=True,
        # Geometry is already authored for the viewer's +Y-up contract.
        # Do not apply Blender's usual Z-up -> glTF Y-up remapping here.
        export_yup=False,
        export_materials='EXPORT',
        export_normals=True,
        export_tangents=False,
        export_apply=True,
    )

    final_bounds = bounds(crown.data)
    print('CROWN_VERTICES', len(crown.data.vertices))
    print('CROWN_TRIANGLES', len(crown.data.polygons))
    print('CROWN_BOUNDS_METRES', final_bounds)
    print('CROWN_OCCLUSAL_AXIS', '+Y')
    print('CROWN_BASE_Y_METRES', min(point.co.y for point in crown.data.vertices))
    print('CROWN_SOURCE_AXIS', crown_axis.tolist())
    print('CROWN_SOURCE_TRIM_PROJECTION', cervical_projection)


if __name__ == '__main__':
    main()
