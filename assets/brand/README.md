# Selah app icon

The icon follows the homepage wordmark: uppercase SELAH in Cormorant Garamond, 0.35em tracking, ivory lettering, and gold rules and a diamond beneath it. For small-size visibility, the icon uses Medium (500), 8px rules at 90% opacity, and a 40px diamond on its 1024px canvas. The homepage typography is unchanged. The full-bleed dark background has no pre-rendered corner mask.

`selah-app-icon.svg` contains glyph outlines, so rendering does not depend on installed fonts. `selah-app-icon-1024.png` is the opaque RGB App Store source. The corresponding Xcode asset, website favicon, Bible Scribe route icon, and 180px Apple touch icon use the same design.

To regenerate the vector, install `fonttools[woff]` and run `python scripts/generate-brand-assets.py /path/to/CormorantGaramond.woff2`. Use the Cormorant Garamond normal variable font from the homepage's Next.js font output. Rasterize the SVG to 1024px RGB PNG and 180px RGB PNG with Sharp. Use `flatten()` and `removeAlpha()` for Apple assets.
