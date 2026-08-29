#!/usr/bin/env bash
# Round A of the v2 hero artwork: the face outline plate on its own.
#
# The reference the client set as the north star is a high-end beauty
# illustration: one continuous hairline-weight stroke, bald head, closed eye
# with a lash, a delicately drawn ear, and nothing else. The interior anatomy is
# generated in a later round against the winning plate, so this round is asked
# for an empty face — a skull drawn now would fix the alignment before there is
# a jawline to align to.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/faceline-v2

BASE='A luxury beauty line illustration of a young woman'"'"'s head in profile facing left, drawn as ONE continuous unbroken hairline-thin ink stroke of perfectly even weight. Elegant editorial fashion-illustration quality, museum-grade draughtsmanship, confident single-pass contour with no sketch marks, no hatching, no shading, no fill, no gradient. The single line travels: crown of a completely bald smooth head, down the forehead, a soft dip at the brow, the straight refined bridge of a small nose, the nose tip, one tiny nostril notch, the philtrum, a full upper lip, the lip line, a full lower lip, a soft indent, the chin, under the chin, along a clean sharp jawline, down the front of a long neck, and out into one bare shoulder and collarbone at the bottom of the frame; the back contour rises from the shoulder up the nape, over the rounded occiput and back to the crown, closing the head. Separate delicate marks, thinner still: one softly arched eyebrow, one closed eye rendered as a single lash line curving up at the outer corner, and one beautifully observed ear with the helix, antihelix and tragus drawn in fine detail. Completely bald — no hair, no headwrap, no eyelashes beyond the lash line, no jewellery. The head is turned only a few degrees toward the viewer, so exactly ONE eye and ONE ear are visible and the profile silhouette stays crisp. Warm off-white paper background, absolutely plain. The ink is a deep warm charcoal, near black. No skull, no bones, no teeth, no anatomy, no annotations, no text, no signature, no watermark, no frame, no border, no colour other than the ink and the paper.'

FRAME_A=' Composition: the head fills the frame, the crown just short of the top edge, the shoulder crossing the bottom edge, generous empty paper to the left of the face.'
FRAME_B=' Composition: full head and neck centred with even breathing room on all sides, the shoulder line entering at the lower right corner, the face reading three quarters of the frame height.'

run () { local name=$1 model=$2 prompt=$3; shift 3
  echo "[start] $name"
  higgsfield generate create "$model" --prompt "$prompt" --aspect_ratio 3:4 "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

run A1-gpt   gpt_image_2     "$BASE$FRAME_A" --resolution 4k --quality high &
run A2-gpt   gpt_image_2     "$BASE$FRAME_B" --resolution 4k --quality high &
run A3-nb    nano_banana_pro "$BASE$FRAME_A" --resolution 4k &
run A4-nb    nano_banana_pro "$BASE$FRAME_B" --resolution 4k &
run A5-seed  seedream_v5_pro "$BASE$FRAME_A" --resolution 2k &
run A6-seed  seedream_v5_pro "$BASE$FRAME_B" --resolution 2k &
wait
echo "ROUND A DONE"
