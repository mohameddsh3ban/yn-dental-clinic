#!/usr/bin/env bash
# Round C. Round B proved the edit path can place the anatomy, but every model
# let the bone cross the drawn contour and painted over the lips. This round
# makes both of those explicit prohibitions and keeps the bone faint.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/faceline-v2
R2=$OUT/_ref-A2-gpt.jpg

P='Take this line drawing and change NOTHING about it: every existing line — the head, the closed eye, the eyebrow, the nose, the LIPS, the chin, the jawline, the ear, the neck, the shoulder — must survive completely untouched, at the same weight, on the same warm off-white paper, and must remain fully visible ON TOP of everything you add. Add one thing only: a faint anatomical jaw seen through the skin, like a soft X-ray at about thirty-five percent strength, warm pale ivory, airbrushed with no outline of its own. Draw ONLY the lower jawbone (mandible) with its condyle at the ear, its ramus, its angle and its body; the full lower row of small even teeth; the upper row of teeth with only the thin ridge of upper jawbone above them; and one small gold titanium implant screw with a white ceramic crown at the lower first molar, sitting in a little window in the bone. Draw NO cranium, NO skull cap, NO eye socket, NO cheekbone, NO zygomatic arch, NO nasal bone, NO spine, NO neck bones. CRITICAL: the bone must stay strictly INSIDE the drawn silhouette — no part of the jawbone, the chin or the teeth may cross or overlap the drawn jawline, the drawn chin or the drawn lip contour; the drawn jawline reads as the skin lying over the bone, so leave a small margin of paper between the bone and that line all the way from the chin to the ear. The bite line sits level with the drawn mouth and the tooth rows recede straight back toward the ear. No text, no labels, no leader lines, no annotations, no watermark, no border.'

run () { local name=$1 model=$2; shift 2
  higgsfield generate create "$model" --prompt "$P" --aspect_ratio 3:4 --image "$R2" "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

run C1-nb   nano_banana_pro --resolution 4k &
run C2-nb2  nano_banana_pro --resolution 2k &
run C3-gpt  gpt_image_2     --resolution 4k --quality high &
run C4-seed seedream_v5_pro --resolution 2k &
wait
echo "ROUND C DONE"
