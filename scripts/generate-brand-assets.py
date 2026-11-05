"""Outline the app icon's Cormorant Garamond 500 wordmark; requires fonttools[woff].
Usage: python generate-brand-assets.py path/to/CormorantGaramond.woff2
Rasterize the resulting SVG at 1024 px for the iOS universal icon.
"""
from pathlib import Path
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

root = Path(__file__).resolve().parents[1]
(root / 'build').mkdir(exist_ok=True)
(root / 'assets/brand').mkdir(parents=True, exist_ok=True)
font = TTFont(sys.argv[1])
if 'fvar' in font:
    caption_font = instantiateVariableFont(font, {'wght': 300}, inplace=False)
    caption_font.flavor = None
    caption_font.save(root / 'build/CormorantGaramond-Light.ttf')
    font = instantiateVariableFont(font, {'wght': 500}, inplace=False)
units = font['head'].unitsPerEm
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
pen = SVGPathPen(glyphs)
bounds = BoundsPen(glyphs)
x = 0
for ch in 'SELAH':
    name = cmap[ord(ch)]
    transform = (1, 0, 0, 1, x, 0)
    glyphs[name].draw(TransformPen(pen, transform))
    glyphs[name].draw(TransformPen(bounds, transform))
    x += font['hmtx'].metrics[name][0] + units * .35
x0, y0, x1, y1 = bounds.bounds
scale = 744 / (x1 - x0)
# Preserve the homepage's 0.35em spacing and composition, with a medium
# weight and thicker gold ornament for legibility at app-icon sizes.
left = (1024 - 744) / 2 - x0 * scale
baseline = 478 + y0 * scale
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" role="img" aria-label="Selah">
  <!-- Cormorant Garamond Medium (500), uppercase, tracking 0.35em. -->
  <defs><linearGradient id="background" x1="0" y1="0" x2="0.087" y2="1"><stop stop-color="#17140f"/><stop offset=".5" stop-color="#13110f"/><stop offset="1" stop-color="#0f0d0b"/></linearGradient></defs>
  <rect width="1024" height="1024" fill="url(#background)"/>
  <path fill="#e8e0d4" transform="translate({left:.5f} {baseline:.5f}) scale({scale:.7f} {-scale:.7f})" d="{pen.getCommands()}"/>
  <g fill="#c9a96e">
    <path d="M492 606 512 586 532 606 512 626Z"/>
    <path d="M314 602H442V610H314ZM582 602H710V610H582Z" opacity=".9"/>
  </g>
</svg>
'''
(root / 'my-app/public/selah-icon.svg').write_text(svg)
(root / 'assets/brand/selah-app-icon.svg').write_text(svg)
print('Outlined wordmark:', round(x1-x0), 'units; cap height', round((y1-y0)*scale,1),'px')
