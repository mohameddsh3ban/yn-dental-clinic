#!/usr/bin/env bash
# The veneer shells and the sectioned molar are white-on-white subjects, so the
# paper key has to stay gentle around them — which leaves their soft contact
# shadow behind as a smudge on the card. Cheaper to remove the shadow at the
# source than to cut it out afterwards.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/services

MATERIAL=' Warm ivory dentine and glossy white enamel, with warm gold as the only other colour, on a pure white seamless background. Soft even studio light, fine natural surface texture, medical-museum quality, photoreal render. The object floats on pure white with NO cast shadow, NO contact shadow, NO reflection and no gradient behind it — the background is one flat pure white. No gums, no jawbone, no lips, no skin, no instruments, no hands. No text, no labels, no annotations, no watermark, no border.'

VENEER='A precise dental illustration of three ultra-thin ceramic veneer shells floating in the air just in front of the three upper front teeth they belong to, aligned to them and slightly separated as if about to be placed. The shells are translucent white with a fine gold edge catching the light; the teeth behind them are warm ivory.'

ENDO='A precise anatomical illustration of a single human lower molar tooth, sectioned vertically so the inside is visible. The outer enamel crown is white and glossy, the dentine beneath it warm ivory, and the pulp chamber and the two root canals running down through the roots are filled with warm gold that reads as metal. The tooth stands upright, seen from the side, its roots pointing down.'

run () { local name=$1 prompt=$2
  echo "[start] $name"
  higgsfield generate create gpt_image_2 --prompt "$prompt" --aspect_ratio 3:2 \
    --resolution 4k --quality high --wait --wait-timeout 20m --json \
    > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

run veneer-noshadow "$VENEER$MATERIAL" &
run endo-noshadow   "$ENDO$MATERIAL" &
wait
