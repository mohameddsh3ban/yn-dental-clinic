"""Fit the licensed Infinite-Realities reference scan to Ozea's teaching skull.

Usage: python fit_face_scan.py <LeePerrySmith source folder> <site public folder>
Requires Node, NumPy and SciPy. References and licences in ASSET_CREDITS.md.
"""

import json
import struct
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from scipy.interpolate import PchipInterpolator
from scipy.spatial import cKDTree


def read_mesh(source):
    data = source.read_bytes()
    length = struct.unpack_from("<I", data, 12)[0]
    spec = json.loads(data[20 : 20 + length])
    buffer = data[28 + length :]
    mesh = spec["meshes"][0]["primitives"][0]

    def read(index, dtype, width):
        a = spec["accessors"][index]
        v = spec["bufferViews"][a["bufferView"]]
        start = v.get("byteOffset", 0) + a.get("byteOffset", 0)
        return np.frombuffer(
            buffer, dtype=dtype, count=a["count"] * width, offset=start
        ).reshape(-1, width)

    attr = mesh["attributes"]
    triangles = read(mesh["indices"], "<u2", 1).reshape(-1, 3)
    positions = read(attr["POSITION"], "<f4", 3)
    if triangles.max() >= len(positions):
        raise ValueError("A scan triangle references a missing vertex")
    return (
        positions,
        read(attr["NORMAL"], "<f4", 3),
        read(attr["TEXCOORD_0"], "<f4", 2),
        triangles,
    )


# Front and profile landmarks measured in both meshes, from neck to vertex.
# The closed lips, eyelids, tip of the nose and menton register independently.
height = PchipInterpolator(
    [-4, -2.5, -1.7, -1.18, -0.70, -0.32, 0.42, 0.83, 1.10, 1.68, 2.00, 2.75, 3.973],
    [
        -16,
        -15.40,
        -13.65,
        -10.8,
        -7.55,
        -6.05,
        -3.15,
        -1.64,
        -0.50,
        2.97,
        4.32,
        7.82,
        13.14,
    ],
)
width = PchipInterpolator(
    [-4, -2.75, -1.65, -0.65, 1.0, 2.0, 3.973],
    [1.82, 2.38, 3.75, 4.66, 4.72, 4.83, 4.64],
)
front_offset = PchipInterpolator(
    [-4, -1.6, -0.65, -0.32, 0.42, 1.10, 1.68, 2.0, 2.75, 3.973],
    [-1.9, -1.8, -0.9, -1.75, -2.05, -1.70, -2.62, -2.2, -2.05, -2.00],
)


def register(vertices):
    x, y, z = vertices.T
    # The scan is slightly off centre. Keep the nose and chin on the reference midline.
    x = (x + 0.083) * width(y)
    # Keep the posterior vault while fitting the nose and lip depth.
    anterior = np.clip((z + 0.6) / 2.2, 0, 1)
    anterior = anterior * anterior * (3 - 2 * anterior)
    z = z * (4.28 + 0.19 * anterior) - 0.27 + anterior * (front_offset(y) + 0.27)
    fitted_y = height(y)
    # Fit the inner canthi and outer orbital rims without flattening either
    # closed eyelid. The source subject's bridge sits deeper than the skull's.
    inner_rim = np.exp(
        -(((np.abs(x) - 1.1) / 1.25) ** 2) - ((fitted_y - 3.03) / 1.52) ** 2
    )
    outer_rim = np.exp(
        -(((np.abs(x) - 5.15) / 1.15) ** 2) - ((fitted_y - 3.8) / 2.15) ** 2
    )
    z += anterior * (1.18 * inner_rim + 0.92 * outer_rim)
    return np.stack((x, fitted_y, z), axis=1)


def transfer_weights(points, reference):
    p = np.asarray(reference["POSITION"]).reshape(-1, 3)
    indices = np.asarray(reference["indices"]).reshape(-1, 3)
    weights = np.asarray(reference["COLOR_0"]).reshape(-1, 4)
    tris = p[indices]
    _, near = cKDTree(tris.mean(axis=1)).query(points, k=24)
    nodes = indices[near]
    a, b, c = (p[nodes[:, :, i]] for i in range(3))
    query = points[:, None, :]
    dot = lambda u, v: np.sum(u * v, axis=-1)
    ab, ac, aq = b - a, c - a, query - a
    d00, d01, d11 = dot(ab, ab), dot(ab, ac), dot(ac, ac)
    d20, d21 = dot(aq, ab), dot(aq, ac)
    den = np.maximum(d00 * d11 - d01 * d01, 1e-15)
    v, w = (d11 * d20 - d01 * d21) / den, (d00 * d21 - d01 * d20) / den
    u = 1 - v - w
    bary = np.stack([u, v, w], axis=-1)
    dist = dot(
        query - (a * u[..., None] + b * v[..., None] + c * w[..., None]),
        query - (a * u[..., None] + b * v[..., None] + c * w[..., None]),
    )
    dist[(bary < 0).any(axis=2)] = np.inf
    for k, (start, stop) in enumerate([(a, b), (b, c), (c, a)]):
        edge = stop - start
        t = np.clip(dot(query - start, edge) / np.maximum(dot(edge, edge), 1e-15), 0, 1)
        delta = query - (start + t[..., None] * edge)
        distance = dot(delta, delta)
        take = distance < dist
        projected = np.zeros_like(bary)
        projected[..., k] = 1 - t
        projected[..., (k + 1) % 3] = t
        bary[take] = projected[take]
        dist[take] = distance[take]
    row = np.arange(len(points))
    best = np.argmin(dist, axis=1)
    return np.einsum("ni,nij->nj", bary[row, best], weights[nodes[row, best]])


def build(source, public):
    v, normals, uv, triangles = read_mesh(source / "LeePerrySmith.glb")
    fit = register(v)
    # Inverse-transpose of the local fit, preserving smooth normals at UV seams.
    step = 0.002
    jac = np.stack(
        [
            (register(v + axis * step) - register(v - axis * step)) / (2 * step)
            for axis in np.eye(3)
        ],
        axis=-1,
    )
    n = np.linalg.solve(jac.transpose(0, 2, 1), normals[..., None])[..., 0]
    n /= np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-8)
    with tempfile.TemporaryDirectory() as tmp:
        reference = Path(tmp) / "weights.json"
        subprocess.run(
            [
                "node",
                str(Path(__file__).with_name("read_face_weights.cjs")),
                str(public),
                str(reference),
            ],
            check=True,
        )
        w = transfer_weights(fit, json.loads(reference.read_text()))
    uv = uv.copy()
    uv[:, 1] = 1 - uv[:, 1]
    buf = bytearray()
    views, accessors, images = [], [], []

    def store(raw, target=None):
        buf.extend(b"\0" * (-len(buf) % 4))
        views.append({"buffer": 0, "byteOffset": len(buf), "byteLength": len(raw)})
        if target:
            views[-1]["target"] = target
        buf.extend(raw)
        return len(views) - 1

    def attribute(array, kind, dtype, component, target=34962):
        array = array.astype(dtype)
        accessors.append(
            {
                "bufferView": store(array.tobytes(), target),
                "componentType": component,
                "count": len(array),
                "type": kind,
            }
        )
        return len(accessors) - 1

    position = attribute(fit, "VEC3", "<f4", 5126)
    accessors[position].update(
        min=fit.astype("<f4").min(axis=0).tolist(),
        max=fit.astype("<f4").max(axis=0).tolist(),
    )
    normal = attribute(n, "VEC3", "<f4", 5126)
    texcoord = attribute(uv, "VEC2", "<f4", 5126)
    color = attribute(np.rint(np.clip(w, 0, 1) * 255), "VEC4", "u1", 5121)
    accessors[color]["normalized"] = True
    indices = attribute(triangles.reshape(-1), "SCALAR", "<u2", 5123, 34963)
    for filename in ["Map-COL.jpg", "Infinite-Level_02_Tangent_SmoothUV.jpg"]:
        images.append(
            {
                "bufferView": store((source / filename).read_bytes()),
                "mimeType": "image/jpeg",
            }
        )
    spec = {
        "asset": {
            "version": "2.0",
            "copyright": "Infinite, 3D Head Scan by Lee Perry-Smith / Infinite-Realities, CC BY 3.0. Registration and soft-tissue weights adapted by Ozea.",
        },
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"name": "face", "mesh": 0}],
        "meshes": [
            {
                "primitives": [
                    {
                        "attributes": {
                            "POSITION": position,
                            "NORMAL": normal,
                            "TEXCOORD_0": texcoord,
                            "COLOR_0": color,
                        },
                        "indices": indices,
                        "material": 0,
                    }
                ]
            }
        ],
        "materials": [
            {
                "name": "Photographic skin",
                "pbrMetallicRoughness": {
                    "baseColorTexture": {"index": 0},
                    "metallicFactor": 0,
                    "roughnessFactor": 0.78,
                },
                "normalTexture": {"index": 1, "scale": 0.46},
            }
        ],
        "textures": [{"source": i} for i in range(2)],
        "images": images,
        "accessors": accessors,
        "bufferViews": views,
        "buffers": [{"byteLength": len(buf)}],
    }
    meta = json.dumps(spec, separators=(",", ":")).encode()
    meta += b" " * (-len(meta) % 4)
    buf.extend(b"\0" * (-len(buf) % 4))
    path = public / "models/ozea-face-textured.glb"
    path.write_bytes(
        struct.pack(
            "<4sIII4s", b"glTF", 2, 28 + len(meta) + len(buf), len(meta), b"JSON"
        )
        + meta
        + struct.pack("<I4s", len(buf), b"BIN\0")
        + buf
    )
    print(path.name, path.stat().st_size, "bytes;", len(v), "registered vertices")


if __name__ == "__main__":
    build(Path(sys.argv[1]), Path(sys.argv[2]))
