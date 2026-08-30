#!/usr/bin/env bash
# Two corrections in the house style — warm ivory bone and white enamel, gold as
# the only accent, on white paper. The first TMJ attempt used a clear acrylic
# model, which read as a second copy of the Restoration card; and the crowns card
# was showing an implant render, so a crown of its own is needed.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/services

STYLE=' Warm ivory dentine and bone with fine natural porosity, glossy white enamel, and warm polished gold as the only other material, on a pure white seamless background. Soft even studio light, a gentle contact shadow, crisp highlights on the gold, medical-museum quality, photoreal render. No gums, no skin, no instruments, no hands, no blurred background, no clear or translucent plastic. No text, no labels, no leader lines, no annotations, no measurements, no watermark, no border.'

CROWN='A precise dental illustration of a single lower molar being crowned, seen from the side: below is the prepared tooth — a reduced ivory dentine stump with a clean shoulder margin — and floating directly above it, aligned and slightly separated as if about to be seated, is its glossy white ceramic crown, the crown shaped with natural cusps. A fine gold line traces the margin where the crown will meet the tooth.'

TMJ='A precise medical illustration of a total temporomandibular joint replacement fitted to a human lower jawbone. The mandible is solid warm ivory bone; along its right ramus is fixed a polished gold titanium prosthesis — a long contoured plate held by six small screws, rising at the top into a smooth rounded condylar head that seats where the natural jaw joint sits. The jaw is seen from the side and slightly in front, tilted so the gold component faces the viewer, its lower teeth in place.'

run () { local name=$1 prompt=$2; shift 2
  echo "[start] $name"
  higgsfield generate create gpt_image_2 --prompt "$prompt$STYLE" --aspect_ratio 3:2 "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

run crown-A "$CROWN" --resolution 4k --quality high &
run crown-B "$CROWN" --resolution 2k --quality high &
run tmjbone-A "$TMJ" --resolution 4k --quality high &
run tmjbone-B "$TMJ" --resolution 2k --quality high &
wait
echo "DONE"
