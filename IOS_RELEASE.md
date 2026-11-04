# iOS release

- App Store name: Selah Bible Scribe
- Bundle ID: `com.jayjeong8.selah`
- Apple team: `8557B7859X`
- App Store Connect app: `6828453076`
- Production: https://selah-alpha.vercel.app
- Privacy: https://selah-alpha.vercel.app/privacy
- Support: https://selah-alpha.vercel.app/support

The Capacitor shell loads the production website over HTTPS. It requires a network connection at launch. Bible chapters are cached in IndexedDB, but the shell does not bundle the full website or Scripture library. Never use a Vercel preview URL that requires authentication for an App Store build.

## Archive and upload

Open `my-app/ios/App/App.xcworkspace` in Xcode. Keep automatic signing and the configured team. When no development device is registered, archive without signing, then let the export step sign for distribution:

```sh
xcodebuild -workspace my-app/ios/App/App.xcworkspace \
  -scheme App -configuration Release -destination 'generic/platform=iOS' \
  -archivePath build/Selah-production.xcarchive archive CODE_SIGNING_ALLOWED=NO

xcodebuild -exportArchive -archivePath build/Selah-production.xcarchive \
  -exportOptionsPlist build/UploadOptions.plist \
  -exportPath build/production-export -allowProvisioningUpdates
```

`UploadOptions.plist` must specify `method=app-store-connect`, `destination=upload`, `signingStyle=automatic`, `teamID=8557B7859X`, `uploadSymbols=true`, and `manageAppVersionAndBuildNumber=false`. Increment the build number for each new accepted upload. Build files and credentials are not committed.

App Store icons must be RGB with no alpha channel. Capture screenshots from the running iOS app; the original `screen1.png`–`screen3.png` mockups are not release screenshots.

## Submission checks

- Verify the production homepage, support page, privacy page, and a Bible passage without a Vercel login.
- Verify translation publisher permissions and required notices before making the App Store content-rights declaration.
- Declare provider request logs and other off-device collection accurately. Local progress storage alone is not cloud collection, but hosted interface and API request logs must be assessed separately.
- Set the app price to zero and add actual iPhone and iPad screenshots.
- Confirm review contact information privately in App Store Connect.
- Build 1.0 (1) was successfully uploaded and processed on November 5, 2026, and selected for the App Store version. Actual iPhone/iPad screenshots, free pricing, and App Store privacy details are saved.
- Build 1.0 (2) replaced build 1 on November 5, 2026. It was uploaded, processed, selected, and saved in the App Store version. Its icon preserves the homepage SELAH wordmark and the gold rules/diamond below it. The same brand asset is deployed as the web favicon and Apple touch icon.
- Three promotional screenshot drafts are in `screenshots/app-store/iphone/` (1206×2622). They use real responsive production web UI captures of KJV Genesis 1:1, book selection, and a saved bookmark. They are **not native iOS captures**, have not replaced the existing App Store screenshots, and must be recaptured in the running iOS app before submission. Native Simulator automation was unavailable during design preparation. See `screenshots/app-store/README.md` for provenance.
- A request to verify iOS distribution permissions for the existing translations was submitted to YouVersion support on November 5, 2026. Keep the full translation list while awaiting the response. Apple content-rights confirmation and final review submission remain pending; do not represent the app as approved or published.
