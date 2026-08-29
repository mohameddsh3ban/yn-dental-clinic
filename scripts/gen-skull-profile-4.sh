#!/usr/bin/env bash
# Round 4. M and O landed near-lateral; this round tries to rotate out the last
# ~12 degrees of yaw. Nano Banana copies its reference camera, which was the
# problem in rounds 1-2 but is now the point: given a near-lateral reference it
# reproduces near-lateral with better bone material.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/skull-profile
REF_M=$OUT/_ref-M-seed-ref.jpg
REF_O=$OUT/_ref-O-gpt-noref.jpg

ROT='Rotate the skull in the reference image slightly further away from the camera, about fifteen degrees, until it is seen in an exact 90-degree lateral side profile facing left — zero yaw, the sagittal midline plane perfectly parallel to the picture plane, only ONE eye socket visible, the nasal aperture edge-on, the tooth rows receding in one straight line. Keep absolutely everything else identical: the same skull, the same warm ivory bone material and porosity, the same soft studio lighting, the same cranial sutures, the same gold titanium implant screw in its rectangular bone cutaway at the lower first molar with its white ceramic crown. Pure white seamless background. No text, no labels, no annotations, no watermark.'

run () { local name=$1 model=$2 ar=$3 prompt=$4; shift 4
  echo "[start] $name"
  higgsfield generate create "$model" --prompt "$prompt" --aspect_ratio "$ar" "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name"
}

run S-kontext-rot flux_kontext 3:4 "$ROT" --image "$REF_M" &
run T-omni-rot     kling_omni_image 3:4 "$ROT" --image "$REF_M" --resolution 2k &
run U-seed-rot     seedream_v5_pro  3:4 "$ROT" --image "$REF_M" --resolution 2k &
run V-seed-rot-O   seedream_v5_pro  3:4 "$ROT" --image "$REF_O" --resolution 2k &
run W-gpt-rot      gpt_image_2      3:4 "$ROT" --image "$REF_M" --resolution 4k --quality high &
run X-nb-copy      nano_banana_pro  3:4 "$ROT" --image "$REF_M" --resolution 4k &

wait
echo "ROUND4 DONE"
