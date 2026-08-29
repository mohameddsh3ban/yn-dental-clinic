#!/usr/bin/env bash
# One small change to the shipped hero artwork: the lower first molar becomes a
# gold implant. Everything else in the drawing has to survive untouched, so the
# prompts spend most of their words on what must NOT change, and half the runs
# also get a second reference with the target tooth ringed — the same way the
# client pointed at it.
#
# gpt_image_2 only, on the client's instruction.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/faceline-v2
NS=$OUT/_ref-northstar.jpg
MARK=$OUT/_ref-mark.jpg

KEEP='This is a finished illustration and it is already correct. Keep it exactly as it is: the same continuous line drawing of the face, the same closed eye, eyebrow, lashes, nose, lips, chin, jawline, ear, neck and shoulder, at the same weight; the same pale warm skull and jaw seen through the skin; the same tooth rows; the same warm off-white paper; the same colours, the same crop and the same composition. Do not redraw, restyle, sharpen, recolour or reposition anything.'

CHANGE=' Make exactly ONE change. Replace a single tooth — the lower first molar, the sixth tooth from the front in the LOWER row — with a dental implant: a gold titanium implant screw with a visible thread, standing vertically in the jawbone exactly where that tooth roots were, carrying a white ceramic crown that meets the bite line and is the same size and shape as the tooth it replaces. The screw reads through the bone the way the rest of the anatomy does — a soft pale inlay seen through the skin — with the gold a little warmer and brighter than the bone so it registers as metal. Every other tooth in both rows stays exactly as it is.'

NOTEXT=' No text, no labels, no leader lines, no arrows, no annotations, no measurements, no watermark, no signature, no border, and no change to the paper.'
MARKED=' The SECOND image is the same illustration with the target tooth ringed in green. Use the ring only to identify which tooth to replace — do NOT draw the ring, or any circle, marker or highlight, in your output.'
SINGLE=' Treat this as a retouch of one tooth, not a redraw of the picture: the output should be indistinguishable from the input everywhere except at that single molar.'

run () { local name=$1 prompt=$2; shift 2
  echo "[start] $name"
  higgsfield generate create gpt_image_2 --prompt "$prompt" --aspect_ratio 2:3 "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

run E1-mark-4k  "$KEEP$CHANGE$MARKED$NOTEXT"         --image "$NS" --image "$MARK" --resolution 4k --quality high &
run E2-mark-2k  "$KEEP$CHANGE$MARKED$NOTEXT"         --image "$NS" --image "$MARK" --resolution 2k --quality high &
run E3-plain-4k "$KEEP$CHANGE$NOTEXT"                --image "$NS" --resolution 4k --quality high &
run E4-plain-2k "$KEEP$CHANGE$SINGLE$NOTEXT"         --image "$NS" --resolution 2k --quality high &
run E5-mark-str "$KEEP$CHANGE$MARKED$SINGLE$NOTEXT"  --image "$NS" --image "$MARK" --resolution 4k --quality high &
run E6-markonly "$KEEP$CHANGE$MARKED$SINGLE$NOTEXT"  --image "$MARK" --resolution 4k --quality high &
wait
echo "ROUND E DONE"
