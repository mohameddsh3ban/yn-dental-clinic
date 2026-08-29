#!/usr/bin/env bash
# Round 3. Nano Banana copies the camera of whatever reference it is given, so
# it kept reproducing the three-quarter angle of round 1. Seedream follows the
# written camera instead, so it leads here, with reference-free runs alongside
# it to prove the angle is not coming from the reference at all.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/skull-profile
REF_A=$OUT/_ref-skull.jpg

LATERAL='CAMERA — this is the single most important instruction: a true 90-degree lateral view. The skull sagittal midline plane is exactly parallel to the picture plane, zero yaw, zero rotation toward the camera. This is the exact view of a lateral cephalometric radiograph. Only ONE eye socket is visible, read as a shadowed hollow set back from the profile edge. The nasal aperture is edge-on. The tooth rows recede in one straight line away from the viewer. The face points to the LEFT edge of the frame. DO NOT render a three-quarter view. DO NOT show the front of the face. DO NOT show both eye sockets. DO NOT show the dental arch curving toward the viewer.'

SILHOUETTE='The profile silhouette, read from the top and going clockwise: domed frontal bone, slight brow prominence, deep-set nasal root, nasal bone sloping down and forward, anterior nasal spine, the forward face of the maxilla, upper and lower tooth rows meeting, the chin point, then back along the lower border of the mandible to the gonial angle, up the ascending ramus to the condyle, and around the occipital dome to close.'

STYLE='Photorealistic medical 3D render, luxury product-photography lighting. Matte ivory bone material, warm bone-white, subtle natural porosity, fine cortical surface detail, faint cranial sutures. Large soft key light from the upper left, soft ambient fill. Pure clean white seamless background, nothing else in frame. Object centred and complete with generous margin, nothing cropped. Extremely high detail, sharp focus, anatomically accurate. No text, no labels, no annotations, no leader lines, no arrows, no watermark.'

IMPLANT='At the lower first-molar position a polished gold titanium dental implant screw is seated in the mandible, revealed through a clean rectangular cutaway window in the outer bone plate so the gold threads read clearly, supporting one glossy white ceramic molar crown in the tooth row. The gold implant is the only metallic accent in the image.'

MATONLY='Use the reference image ONLY for bone material, colour and lighting. IGNORE the camera angle of the reference — it is a three-quarter view and this new image must not be.'

run () { local name=$1 model=$2 ar=$3 prompt=$4; shift 4
  echo "[start] $name"
  higgsfield generate create "$model" --prompt "$prompt" --aspect_ratio "$ar" "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name"
}

run M-seed-ref seedream_v5_pro 3:4 \
"A complete human skull in perfect side profile. $LATERAL $SILHOUETTE $IMPLANT $MATONLY $STYLE" \
--image "$REF_A" --resolution 2k &

run N-seed-noref seedream_v5_pro 3:4 \
"A complete human skull in perfect side profile. $LATERAL $SILHOUETTE $IMPLANT $STYLE" --resolution 2k &

run O-gpt-noref gpt_image_2 3:4 \
"A complete human skull in perfect side profile. $LATERAL $SILHOUETTE $IMPLANT $STYLE" --resolution 4k --quality high &

run P-nb-matonly nano_banana_pro 3:4 \
"A complete human skull in perfect side profile. $LATERAL $SILHOUETTE $IMPLANT $MATONLY $STYLE" \
--image "$REF_A" --resolution 4k &

run Q-seed-cut seedream_v5_pro 3:4 \
"A complete human skull in perfect side profile. $LATERAL $SILHOUETTE $IMPLANT $MATONLY $STYLE" \
--image "$REF_A" --resolution 2k --remove_bg true &

run R-seed-mandible seedream_v5_pro 3:2 \
"An isolated human lower jawbone, the mandible alone, in perfect side profile facing left. True 90-degree lateral view, zero yaw, the mandible midline parallel to the picture plane. Chin point at the left, body of the mandible running to the right, gonial angle, ascending ramus, coronoid process and condyle at the right, the lower tooth row receding in one straight line. DO NOT render a three-quarter view. $IMPLANT $MATONLY $STYLE" \
--image "$REF_A" --resolution 2k &

wait
echo "ROUND3 DONE"
