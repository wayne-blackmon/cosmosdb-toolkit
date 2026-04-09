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

# Scale the image to 85% of the canvas size while maintaining aspect ratio
scale_factor = 0.85
new_size = int(1024 * scale_factor)
img_scaled = img.resize((new_size, new_size), Image.Resampling.LANCZOS)

# Calculate position to center the scaled image
offset = (1024 - new_size) // 2

# Paste the scaled image onto the result
result.paste(img_scaled, (offset, offset), img_scaled)

# Save back to the original location
result.save(icon_path, 'PNG')
print(f"Icon updated: scaled to {new_size}x{new_size} (85% of canvas)")
print(f"Saved to: {icon_path}")
