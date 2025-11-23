for file in tmp/vids/output-yellow/*.png; do
    magick "$file" \( +clone -colorspace HSL -channel G -separate -auto-level -white-threshold 15% \) -alpha off -compose copy-opacity -rotate 90 -composite "final/$(basename "$file")"
done