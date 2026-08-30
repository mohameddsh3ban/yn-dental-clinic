#!/usr/bin/env bash
# Cuts each service render out of its background with Higgsfield's own matting
# model, instead of the flood fill in prep-service-art.mjs.
#
# The hand-rolled key could not separate pure-white enamel highlights from white
# paper — they touch the silhouette, so every threshold took a bite out of a
# molar, and the crown card had to fall back to a multiply blend, which shows as
# a pale rectangle wherever the card gradient is darker than the paper. A real
# matting model decides the edge from shape, not from colour distance.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/cut

cut () { local name=$1
  echo "[start] $name"
  higgsfield generate create image_background_remover \
    --image "brand/hero-concepts/$name.png" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

for n in "$@"; do cut "$n" & done
wait
echo "CUT DONE"
