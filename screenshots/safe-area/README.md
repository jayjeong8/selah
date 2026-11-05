# iOS safe-area verification

`iphone-before.png` reproduces the status-bar clock overlapping the Bible Scribe header. The final fix uses `viewport-fit=cover` and CSS `env(safe-area-inset-*)` padding inside each page background. Capacitor explicitly uses `ios.contentInset: never`, so UIKit does not add a separate white inset or duplicate the CSS padding. Homepage, Bible Scribe, privacy and support content all respect device insets.

`iphone-after.png` / `ipad-after.png` and `iphone-dark.png` / `ipad-dark.png` are unedited native Simulator screenshots of build 1.0 (5), on iPhone 16 Pro Max and iPad Pro 13-inch (M4), iOS 18.5. They verify header clearance and matching background through the top/bottom safe areas in light and dark modes. Capacitor Status Bar follows Bible Scribe's independent theme or the surrounding page theme, switching the clock/system symbols to a contrasting color. `comparison.jpg` is a reduced before/light/dark preview.

For this focused check, local simulator-only QA copies of the new Debug app opened the real production `/bible-scribe` route directly. Only the start URL was changed; there was no injected UI or fabricated status bar. Release builds keep the production homepage URL. Both Simulators were restored to the normal homepage build after captures. Debug and Release builds passed; the release archive's configuration contains the production URL, `never`, and `StatusBarPlugin`.

The native after captures were resized to App Store-supported dimensions in `screenshots/app-store/native/`: 1206×2622 for iPhone and 2064×2752 for iPad. No UI or status-bar content was altered. Homepage originals are under `screenshots/app-store/iphone/` and `ipad/`.
