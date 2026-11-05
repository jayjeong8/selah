# Screenshot drafts

The three `iphone/01-*.png` through `iphone/03-*.png` files are 1206×2622 RGB promotional compositions. `contact-sheet.jpg` previews them together.

Their `raw-*.jpg` source images were captured from the actual production Bible Scribe interface at https://selah-alpha.vercel.app/bible-scribe in a 402×874 responsive browser viewport on November 5, 2026. They show actual typing completion, book selection, and a saved bookmark, using the app's KJV public-domain notice. No device frame, iOS status bar, or keyboard was fabricated.

These are **web UI design drafts**, not native iOS screenshots. They have not been uploaded to replace the existing App Store screenshots. Before submitting for review, replace the raw captures with equivalent captures from the running iOS app, recompose, and verify the layouts. The existing `iphone-home*` and `ipad-home*` files one level above this directory are native Simulator captures.

To regenerate the compositions, install Pillow, generate `build/CormorantGaramond-Light.ttf` with `scripts/generate-brand-assets.py`, and run `python scripts/compose-store-screenshots.py` from the repository root. The script preserves the captured UI and adds headings outside its frame.

`icon-in-app-store-connect.jpg` records the new icon shown by App Store Connect after build 1.0 (2) was selected and saved. It is proof of registration, not an App Store marketing screenshot.

`icon-bold-in-app-store-connect.jpg` records the more legible revision shown after build 1.0 (3) was selected and saved. It uses weight 500 lettering, thicker gold rules and a larger diamond.
