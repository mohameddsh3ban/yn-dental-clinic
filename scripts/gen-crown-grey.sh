#!/usr/bin/env bash
# The crown subject is white ceramic on white paper, which no colour key can
# separate — a flank of the neighbouring molar measured closer to the sheet than
# the threshold and the flood ate a wedge out of it. Rendering the same subject
# on a light grey ground gives the key something to work with.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/services

CROWN='A precise dental illustration of a single lower molar being crowned, seen from the side: below is the prepared tooth — a reduced ivory dentine stump with a clean shoulder margin, standing in a small block of ivory bone with one natural molar either side — and floating directly above it, aligned and slightly separated as if about to be seated, is its glossy white ceramic crown with natural cusps. A fine gold line traces the margin where the crown will meet the tooth. Warm ivory dentine and bone, glossy white enamel, warm polished gold as the only other material. Soft even studio light, crisp highlights, medical-museum quality, photoreal render.'

GROUND=' The background is a plain, perfectly even, light warm grey seamless studio backdrop — clearly darker than the white ceramic so the object separates from it — with a soft contact shadow beneath the bone block. No gums, no skin, no instruments, no hands. No text, no labels, no annotations, no watermark, no border.'

run () { local name=$1; shift
  echo "[start] $name"
  higgsfield generate create gpt_image_2 --prompt "$CROWN$GROUND" --aspect_ratio 3:2 "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

run crown-grey-A --resolution 4k --quality high &
run crown-grey-B --resolution 4k --quality high &
wait
echo "DONE"
