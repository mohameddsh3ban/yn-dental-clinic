#!/usr/bin/env bash
# A TMJ card in the house style: gold prosthesis on a translucent mandible,
# white paper, no background. Modelled on the client's own reference photo of a
# total joint replacement, and on jaw-plate, which is already a clear mandible
# carrying a gold plate.
#
# This is a stand-in. If the client saves their photograph to
# brand/hero-concepts/tmj-prosthesis.png it takes this slot instead.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/tmj

BASE='A precise medical illustration of a total temporomandibular joint replacement prosthesis fitted to a human lower jaw, on a pure white seamless background. The mandible is a clear, translucent frosted-acrylic surgical model; fitted along its right ramus is a polished gold titanium prosthesis — a long contoured plate following the ramus, fixed by six small bright screws in countersunk holes, rising at the top into a smooth rounded condylar head that seats where the natural jaw joint sits. The jaw is seen from the side and slightly in front, tilted so the gold component faces the viewer.'

STYLE=' Warm polished gold and clear translucent white are the only materials. Soft even studio light, a gentle contact shadow, crisp reflections on the metal, fine surface detail, medical-museum quality, photoreal render. No gums, no teeth beyond the model, no skin, no instruments, no hands, no operating room, no blurred background. No text, no labels, no leader lines, no annotations, no measurements, no watermark, no border.'

run () { local name=$1; shift
  echo "[start] $name"
  higgsfield generate create gpt_image_2 --prompt "$BASE$STYLE" --aspect_ratio 3:2 "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

run tmj-A --resolution 4k --quality high &
run tmj-B --resolution 2k --quality high &
run tmj-C --resolution 4k --quality high &
wait
echo "TMJ DONE"
