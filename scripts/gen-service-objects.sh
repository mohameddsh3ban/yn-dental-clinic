#!/usr/bin/env bash
# The crowns card set the theme: an ivory-and-gold object on white paper, keyed
# onto the brand gradient. The three chairside photographs break it, so this
# makes a render for each of them in the same material language.
#
# Same recipe as the endo molar: gpt_image_2, white seamless paper, warm ivory
# and gold only, no instruments, no hands, no text.
set -u
cd "$(dirname "$0")/.."
OUT=brand/hero-concepts/services

MATERIAL=' Warm ivory dentine and glossy white enamel, with warm gold as the only other colour, on a pure white seamless background. Soft even studio light, a gentle contact shadow beneath the object, fine natural surface texture, medical-museum quality, photoreal render. No gums, no jawbone, no lips, no skin, no instruments, no hands, no packaging. No text, no labels, no leader lines, no annotations, no arrows, no measurements, no watermark, no border.'

COSMETIC='A precise dental illustration of a curved row of six upper front human teeth — two central incisors, two lateral incisors and two canines — standing side by side in their natural arch, seen from slightly in front and above, each one polished to a bright even finish, the arch resting on a fine gold arc that traces where the gum line would be.'

VENEER='A precise dental illustration of three ultra-thin ceramic veneer shells floating in the air just in front of the three upper front teeth they belong to, aligned to them and slightly separated as if about to be placed. The shells are translucent white with a fine gold edge catching the light; the teeth behind them are warm ivory.'

COMPOSITE='A precise dental illustration of a single upper central incisor tooth standing upright, shown mid-restoration: the left half is the natural warm ivory tooth, the right half is built up in three stacked layers of composite material, each layer boundary traced by a fine gold line, the outer surface polished to match the natural half.'

run () { local name=$1 prompt=$2; shift 2
  echo "[start] $name"
  higgsfield generate create gpt_image_2 --prompt "$prompt" --aspect_ratio 3:2 "$@" \
    --wait --wait-timeout 20m --json > "$OUT/$name.json" 2> "$OUT/$name.err"
  echo "[done ] $name $(grep -o '"status": *"[a-z]*"' "$OUT/$name.json" | head -1)"
}

run cosmetic-A  "$COSMETIC$MATERIAL" --resolution 4k --quality high &
run cosmetic-B  "$COSMETIC$MATERIAL" --resolution 2k --quality high &
run veneer-A    "$VENEER$MATERIAL"   --resolution 4k --quality high &
run veneer-B    "$VENEER$MATERIAL"   --resolution 2k --quality high &
run composite-A "$COMPOSITE$MATERIAL" --resolution 4k --quality high &
run composite-B "$COMPOSITE$MATERIAL" --resolution 2k --quality high &
wait
echo "SERVICE OBJECTS DONE"
