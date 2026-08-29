#!/usr/bin/env bash
# Round 2: round 1 nailed the material and the implant cutaway but drifted to a
# three-quarter camera. These prompts describe the lateral SILHOUETTE explicitly
# and feed the round-1 winner back in as the material reference.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/skull-profile
REF_A=$OUT/_ref-skull.jpg
REF_J=$OUT/_ref-jaw.jpg

LATERAL='STRICT ORTHOGRAPHIC LATERAL VIEW: the camera sits exactly perpendicular to the sagittal plane, a true 90-degree side view. Only the left side of the skull is visible. Exactly ONE eye socket is in frame. The nasal aperture is seen edge-on as a notch in the profile edge, never as a front-facing opening. The tooth row recedes in a single straight line away from the camera. The silhouette reads like a lateral cephalometric radiograph: sloping forehead, nasal bone, anterior nasal spine, upper and lower tooth rows, chin point, gonial angle, ascending ramus, condyle, occipital dome at the back. No front-facing surface of the face is visible.'

STYLE='Photorealistic medical 3D render, luxury product-photography lighting. Matte ivory bone material, warm bone-white, subtle natural porosity and fine cortical surface detail, faint cranial sutures. Large soft key light from upper left, soft ambient fill. Pure clean white seamless background, nothing else in frame. Object centred and complete with generous margin. Extremely high detail, sharp focus, anatomically accurate. No text, no labels, no annotations, no leader lines, no arrows, no watermark.'

IMPLANT='At the lower first-molar position a polished gold titanium dental implant screw is seated in the mandible, revealed through a clean rectangular cutaway window in the outer bone plate so the gold threads read clearly, supporting one glossy white ceramic molar crown in the tooth row. The gold implant is the only metallic accent in the image.'

run () { local name=$1 model=$2 ar=$3 prompt=$4; shift 4
  echo "[start] $name"
  higgsfield generate create "$model" --prompt "$prompt" --aspect_ratio "$ar" "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name"
}

run G-lateral-nb nano_banana_pro 3:4 \
"Take the photorealistic skull in the reference image and re-render the exact same skull, same bone material, same lighting, same gold implant, viewed in perfect side profile facing left. $LATERAL $IMPLANT $STYLE" \
--image "$REF_A" --image "$REF_J" --resolution 4k &

run H-lateral-rot-nb nano_banana_pro 3:4 \
"Rotate the skull from the reference image forty-five degrees about its vertical axis so it is seen in pure left-facing profile, keeping the identical bone material, lighting and gold molar implant. $LATERAL $STYLE" \
--image "$REF_A" --resolution 4k &

run I-lateral-gpt gpt_image_2 3:4 \
"A complete human skull rendered in perfect side profile facing left. $LATERAL $IMPLANT $STYLE" \
--image "$REF_A" --resolution 4k --quality high &

run J-lateral-seed seedream_v5_pro 3:4 \
"A complete human skull rendered in perfect side profile facing left. $LATERAL $IMPLANT $STYLE" \
--image "$REF_A" --resolution 2k &

run K-mandible-lateral nano_banana_pro 3:2 \
"An isolated human lower jawbone, the mandible alone, seen in perfect side profile facing left, with the same bone material and lighting as the reference. STRICT ORTHOGRAPHIC LATERAL VIEW at exactly 90 degrees: chin point at the left, body of the mandible running right, gonial angle, ascending ramus, coronoid process and condyle at the right, the lower tooth row receding in a straight line. $IMPLANT $STYLE" \
--image "$REF_A" --image "$REF_J" --resolution 4k &

run L-lateral-tight-nb nano_banana_pro 2:3 \
"A complete human skull in perfect side profile facing left, framed tall and tight so the skull nearly fills the frame from crown to chin. $LATERAL $IMPLANT $STYLE" \
--image "$REF_A" --resolution 4k &

wait
echo "ROUND2 DONE"
