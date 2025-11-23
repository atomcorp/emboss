# Readme Emboss

```
magick -define jpeg:size=814x1000 Downloads/apple.png -thumbnail '248x248>' -background white -gravity center -extent 248x248 apple_pad.png
```

````
magick -define jpeg:size=814x1000 images/apple.png -thumbnail '256x256>' -background none -gravity center -extent 256x256 images/apple_pad.png
```

Format image
````

Turn video and series of images (10 images per second)

```
ffmpeg -i vids/hand.mp4 -r 10 -s 1080x1920 -f image2 vids/output/foo-%03d.jpeg

// used png for better saturated colors
ffmpeg -i tmp/vids/yellow.mp4 -r 5 -s 512x512 -f image2 tmp/vids/output-yellow/foo-%03d.png

```

Mask the image :/

```
magick vids/output/foo-021.jpeg  -color-threshold 'sRGB(132,120,116)-sRGB(192,160,176)' foo.jpg
```

Crop all the images

```
mogrify -path resized -resize 512x512^ -extent 512x512 -gravity north vids/output/*.jpeg
```

```
// this worked and it was Google Gemini
magick tmp/vids/output-yellow/foo-061.png \( +clone -colorspace HSL -channel G -separate -auto-level -white-threshold 15% \) -alpha off -compose copy-opacity -composite output_image.png

```

```
convert input.jpg -rotate 90 out.jpg
```

gbp sign
ᛗ

Draw a bunch of shapes that slowly move around the screen, and rotate
Should i try and animate the hand? Just need a video of it opening and closing, then would need to trace the edge for every frame. Either rotoscope (manual) or Motion Tracker (auto?)
