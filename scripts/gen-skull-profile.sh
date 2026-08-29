#!/usr/bin/env bash
# Generates side-profile skull / jaw assets that match the material language of
# brand/hero-concepts/jaw-solid.png, for the face-line hero composition.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/skull-profile
REF=brand/hero-concepts/jaw-solid.png

STYLE='Photorealistic medical 3D render, luxury product-photography lighting. Matte ivory bone material, warm bone-white, subtle natural porosity and fine cortical surface detail. Large soft key light from upper left, soft ambient fill, delicate contact shadow. Pure clean white seamless background, nothing else in frame. Object centred with generous margin, complete and uncropped. Extremely high detail, sharp focus, anatomically accurate. No text, no labels, no annotations, no leader lines, no arrows, no ruler, no watermark, no background objects.'

IMPLANT='At the lower first-molar position a polished gold titanium dental implant screw is seated in the jawbone, revealed through a clean anatomical cutaway window in the outer bone plate so the gold threads read clearly, supporting a single glossy white ceramic molar crown in the tooth row. The gold implant is the only metallic accent in the image.'

run () { # run <name> <model> <aspect> <prompt> [extra...]
  local name=$1 model=$2 ar=$3 prompt=$4; shift 4
  echo "[start] $name ($model)"
  higgsfield generate create "$model" --prompt "$prompt" --image "$REF" \
    --aspect_ratio "$ar" --resolution 4k "$@" --wait --wait-timeout 20m --json \
    > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name rc=$?"
}

run A-skull-nb nano_banana_pro 3:4 \
"A complete human skull in exact lateral side profile, facing left, jaw closed in natural occlusion. Full cranium dome, brow ridge, eye socket, nasal aperture, zygomatic arch, temporal line, maxilla with upper tooth row and mandible with lower tooth row, ramus and condyle visible. $IMPLANT $STYLE" &

run B-mandible-nb nano_banana_pro 3:2 \
"An isolated human lower jawbone, the mandible alone, in exact lateral side profile facing left. Ramus, coronoid process, condyle, gonial angle, mental protuberance and the complete lower tooth row of natural ivory teeth are all visible. $IMPLANT $STYLE" &

run C-skull-gpt gpt_image_2 3:4 \
"A complete human skull in exact lateral side profile, facing left, jaw closed in natural occlusion. Full cranium dome, brow ridge, eye socket, nasal aperture, zygomatic arch, maxilla with upper tooth row and mandible with lower tooth row, ramus and condyle visible. $IMPLANT $STYLE" &

run D-jaws-nb nano_banana_pro 3:2 \
"Human upper and lower jaws only, maxilla and mandible with complete tooth rows meeting in natural occlusion, no cranium, no skull vault, in exact lateral side profile facing left. $IMPLANT $STYLE" &

run E-skull-tilt-nb nano_banana_pro 3:4 \
"A complete human skull facing left, rotated only five degrees toward the camera so it still reads as a clean lateral side profile but gains subtle dimensional depth. Jaw closed in natural occlusion, cranium, brow, eye socket, nasal aperture, zygomatic arch, maxilla and mandible with full tooth rows. $IMPLANT $STYLE" &

run F-mandible-gpt gpt_image_2 3:2 \
"An isolated human lower jawbone, the mandible alone, in exact lateral side profile facing left. Ramus, coronoid process, condyle, gonial angle and the complete lower tooth row of natural ivory teeth are all visible. $IMPLANT $STYLE" &

wait
echo "ALL DONE"
