#!/bin/bash

# Create icons directory if it doesn't exist
mkdir -p icons

# Create a simple icon with the text "WT" (Workout Tracker)
convert -size 512x512 xc:white \
  -gravity center \
  -pointsize 200 \
  -fill "#570df8" \
  -draw "text 0,0 'WT'" \
  icons/icon-512x512.png

# Create the 192x192 version
convert icons/icon-512x512.png -resize 192x192 icons/icon-192x192.png

echo "Icons generated successfully!" 