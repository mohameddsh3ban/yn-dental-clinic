#!/usr/bin/env bash
# The endo card had no honest picture: of the five jaw renders, one shows a CT
# wireframe and the rest show implants or measurements — none of them show what
# endodontics actually is. This makes one, in the material language the other
# service renders already use: ivory tooth, gold detail, white paper.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/endo

BASE='A precise anatomical illustration of a single human lower molar tooth, sectioned vertically so the inside is visible, on a pure white seamless background. The outer enamel crown is white and glossy, the dentine beneath it warm ivory, and the pulp chamber and the two root canals running down through the roots are filled with warm gold that reads as metal — the canals cleaned, shaped and sealed. The tooth stands upright, seen from the side, its roots pointing down, softly lit by even studio light with a gentle contact shadow, fine natural surface texture, medical-museum quality, photoreal render. No gums, no jawbone, no other teeth, no instruments, no hands. No text, no labels, no leader lines, no annotations, no arrows, no measurements, no watermark, no border.'

WIDE=' Composition: the tooth centred with generous white space around it, occupying about two thirds of the frame height.'
PAIR=' Composition: the tooth centred, shown slightly larger, filling about three quarters of the frame height.'

run () { local name=$1 prompt=$2; shift 2
  echo "[start] $name"
  higgsfield generate create gpt_image_2 --prompt "$prompt" --aspect_ratio 3:2 "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

run E1 "$BASE$WIDE" --resolution 4k --quality high &
run E2 "$BASE$PAIR" --resolution 4k --quality high &
run E3 "$BASE$WIDE" --resolution 2k --quality high &
wait
echo "ENDO DONE"
