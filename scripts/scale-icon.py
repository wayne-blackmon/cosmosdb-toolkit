#!/usr/bin/env python3
"""Scale the icon to fill more of the canvas, making it more visible in marketplace."""

from PIL import Image
import os

# Load the icon
icon_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'icon', 'space-tools-1024.png')
img = Image.open(icon_path)

# Get current dimensions
width, height = img.size
print(f"Original dimensions: {width}x{height}")

# Convert to RGBA if needed to handle transparency
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Create a new image with white background
result = Image.new('RGBA', (1024, 1024), (255, 255, 255, 0))

# Remove transparent padding first so scale applies to visible artwork
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# Scale artwork to 90% of canvas while preserving original aspect ratio
scale_factor = 0.90
target_max = int(1024 * scale_factor)
source_width, source_height = img.size
scale = target_max / max(source_width, source_height)
new_width = max(1, round(source_width * scale))
new_height = max(1, round(source_height * scale))
img_scaled = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

# Center the scaled image on the canvas
x_offset = (1024 - new_width) // 2
y_offset = (1024 - new_height) // 2

# Paste the scaled image onto the result
result.paste(img_scaled, (x_offset, y_offset), img_scaled)

# Save back to the original location
result.save(icon_path, 'PNG')
print(f"Icon updated: scaled to {new_width}x{new_height} (90% max canvas, aspect preserved)")
print(f"Saved to: {icon_path}")
