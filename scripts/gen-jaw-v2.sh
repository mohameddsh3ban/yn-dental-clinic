#!/usr/bin/env bash
# Round B of the v2 hero artwork: the jaw that lives inside the face plate.
#
# Two paths run at once because they fail differently. The EDIT path hands a
# winning plate to an edit model and asks it to draw the anatomy in place, which
# makes the alignment exact by construction but risks the model redrawing the
# outline. The ASSET path generates the jaw alone on white, which never touches
# the outline but has to be aligned afterwards in the compositor.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/faceline-v2
R2=$OUT/_ref-A2-gpt.jpg
R3=$OUT/_ref-A3-nb.jpg

EDIT='Keep this line drawing EXACTLY as it is — do not redraw, move, thicken, restyle or re-letter a single line of the face, the ear, the lips, the eye, the neck or the shoulder, and keep the identical warm off-white paper. Your only task is to add, underneath the existing line work, a soft pale anatomical study of the JAW, placed so it fits the drawn face perfectly. Draw ONLY: the complete lower jawbone (mandible) — its condyle sitting exactly at the ear, the ramus rising just in front of the ear, the angle of the jaw, and the body of the jaw running along the INSIDE of the drawn jawline so the drawn jawline reads as the skin over that bone; the full lower tooth row of small even teeth sitting behind the drawn lips; the upper tooth row directly above it with only the thin alveolar ridge of the upper jaw above those teeth; and one gold titanium dental implant screw with a white ceramic crown at the lower first molar, shown in a small window in the bone. Draw NOTHING else: no cranium, no skull cap, no eye socket, no cheekbone, no nasal bones, no spine — the jaw and the teeth only, ending cleanly where the upper tooth row ends. Render the bone as warm ivory, soft and airbrushed with no outline of its own, semi-transparent like a gentle X-ray seen through the skin at about forty percent strength, the gold implant a little brighter than the bone. The teeth must be aligned to the drawn mouth: the bite line level with the line of the drawn lips, the front teeth just inside the drawn lip profile, the tooth rows receding straight back toward the ear. No text, no labels, no leader lines, no annotations, no measurements, no watermark, no signature, no border.'

ASSET='A precise anatomical illustration of a human JAW in an exact 90-degree lateral side view facing left, on a pure white seamless background. Show ONLY the complete lower jawbone (mandible) — condyle, ramus, angle and body — with its full lower row of small even natural teeth, plus the upper row of teeth directly above with only the thin alveolar ridge of the upper jaw above them. Show NOTHING else: no cranium, no skull, no eye socket, no cheekbone, no nasal bones, no skin, no lips, no muscle. One gold titanium dental implant screw with a white ceramic crown sits at the lower first molar inside a small rectangular window cut in the bone. Warm ivory bone with fine natural porosity, soft even studio light, gentle self-shadow, no outline, no ink line, medical-museum quality, photoreal render. The jaw is closed, the bite line perfectly horizontal, the tooth rows receding in one straight line. No text, no labels, no leader lines, no annotations, no measurements, no watermark, no border.'

MATCH=' Match the size, angle and proportion of the jaw to the face in the reference drawing: the same jaw length from chin to condyle, the same jaw angle, the same tooth-row height. Output the jaw alone on pure white — do not draw the face, the outline or the reference drawing itself.'

run () { local name=$1 model=$2 prompt=$3; shift 3
  echo "[start] $name"
  higgsfield generate create "$model" --prompt "$prompt" --aspect_ratio 3:4 "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

# EDIT path — anatomy drawn into the plate.
run B1-edit-nb-A3   nano_banana_pro "$EDIT" --image "$R3" --resolution 4k &
run B2-edit-nb-A2   nano_banana_pro "$EDIT" --image "$R2" --resolution 4k &
run B3-edit-kx-A3   flux_kontext    "$EDIT" --image "$R3" &
run B4-edit-seed-A3 seedream_v5_pro "$EDIT" --image "$R3" --resolution 2k &
run B5-edit-gpt-A3  gpt_image_2     "$EDIT" --image "$R3" --resolution 4k --quality high &
run B6-edit-seed-A2 seedream_v5_pro "$EDIT" --image "$R2" --resolution 2k &

# ASSET path — jaw alone, for the compositor.
run B7-asset-nb    nano_banana_pro "$ASSET$MATCH" --image "$R3" --resolution 4k &
run B8-asset-gpt   gpt_image_2     "$ASSET"       --resolution 4k --quality high &
run B9-asset-seed  seedream_v5_pro "$ASSET$MATCH" --image "$R3" --resolution 2k &
wait
echo "ROUND B DONE"
