#!/usr/bin/env bash
# Round D. Same task as round C — draw the jaw into the winning face plate —
# but on gpt_image_2 only, which is the model the client wants the artwork made
# with. Round C's gpt attempt was the palest of the four and put a rectangular
# slab of bone above the upper teeth, so both of those are addressed here:
# the alveolar ridge is described as a thin natural curve, and the bone is asked
# for at readable density rather than as a faint wash.
#
# Two of the six also hand gpt_image_2 the jaw it generated itself in round B as
# a second reference, so it is fitting a specimen it already drew rather than
# inventing the anatomy again.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/faceline-v2
PLATE=$OUT/_ref-A2-gpt.jpg
JAW=$OUT/_ref-jaw-gpt.jpg

KEEP='Take this line drawing and change NOTHING about it: every existing line — the head, the closed eye, the eyebrow, the nose, the LIPS, the chin, the jawline, the ear, the neck, the shoulder — must survive completely untouched, at the same weight, on the same warm off-white paper, and must stay fully visible ON TOP of everything you add.'

DRAW=' Add one thing only: the jaw seen through the skin. Draw ONLY the lower jawbone (mandible) with its condyle at the ear, its ramus, its angle and its body; the full lower row of small even teeth; the upper row of teeth above it; and one gold titanium implant screw with a white ceramic crown at the lower first molar, sitting in a small window in the bone. Above the upper teeth draw ONLY a thin natural alveolar ridge that follows the curve of the tooth roots — NO rectangular block, NO slab, NO straight-edged plate of bone. Draw NO cranium, NO skull cap, NO eye socket, NO cheekbone, NO zygomatic arch, NO nasal bone, NO spine.'

QUALITY=' Render the bone as warm ivory with fine natural porosity and the tooth roots faintly readable through it, clearly visible but soft — an anatomical inlay seen through the skin at about forty percent strength, airbrushed, with no outline of its own. The gold implant is a little brighter and warmer than the bone.'

FIT=' CRITICAL: the bone must stay strictly INSIDE the drawn silhouette. No part of the jawbone, the chin or the teeth may cross or overlap the drawn jawline, the drawn chin or the drawn lip contour — leave a small margin of paper between the bone and the drawn jawline all the way from the chin to the ear, so the drawn line reads as the skin lying over the bone. The bite line sits level with the drawn mouth, the front teeth just behind the drawn lip profile, and the tooth rows recede straight back toward the ear.'

NOTEXT=' No text, no labels, no leader lines, no annotations, no measurements, no watermark, no signature, no border.'

XRAY=' It should read like a soft lateral radiograph laid under the drawing: the bone dense enough to read at a glance, the teeth distinct from one another, the trabecular texture suggested rather than detailed.'
INLAY=' It should read like a fine anatomical illustration inlaid into the drawing: crisp tooth crowns, a clearly shaped ramus and condyle, the bone edges soft where they meet the paper.'

TWOREF='The FIRST image is a line drawing of a face. The SECOND image is an anatomical render of a lower jaw with both tooth rows and a gold implant. Place the jaw from the second image inside the face of the first image, scaled and rotated so it fits that face exactly: the condyle at the ear, the body of the jaw following the INSIDE of the drawn jawline with a small margin of paper left between bone and line, the bite line level with the drawn mouth, the front teeth just behind the drawn lip profile. Keep the line drawing itself completely unchanged — every line survives untouched and stays visible on top of the bone. Show only the jaw, the two tooth rows and the implant; no cranium, no cheekbone, no eye socket, no spine. Render the bone as a soft warm ivory inlay at about forty percent strength with no outline of its own, the gold implant slightly brighter. Nothing may cross the drawn silhouette.'

run () { local name=$1 prompt=$2; shift 2
  echo "[start] $name"
  higgsfield generate create gpt_image_2 --prompt "$prompt" --aspect_ratio 3:4 "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

run D1-gpt-4k    "$KEEP$DRAW$QUALITY$FIT$NOTEXT"       --image "$PLATE" --resolution 4k --quality high &
run D2-gpt-2k    "$KEEP$DRAW$QUALITY$FIT$NOTEXT"       --image "$PLATE" --resolution 2k --quality high &
run D3-gpt-xray  "$KEEP$DRAW$QUALITY$XRAY$FIT$NOTEXT"  --image "$PLATE" --resolution 4k --quality high &
run D4-gpt-inlay "$KEEP$DRAW$QUALITY$INLAY$FIT$NOTEXT" --image "$PLATE" --resolution 4k --quality high &
run D5-gpt-two   "$TWOREF$NOTEXT" --image "$PLATE" --image "$JAW" --resolution 4k --quality high &
run D6-gpt-two2  "$TWOREF$NOTEXT" --image "$PLATE" --image "$JAW" --resolution 2k --quality high &
wait
echo "ROUND D DONE"
