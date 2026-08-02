# 开心羊圈 Android

Capacitor Android wrapper for the live game at:

`https://henry345683904.github.io/farm/`

## Build

1. Install dependencies with `pnpm install`.
2. Run `pnpm sync` after changing Capacitor settings.
3. Build with `android\gradlew.bat assembleDebug`.

The debug APK is generated at:

`android/app/build/outputs/apk/debug/app-debug.apk`

The remote game requires an internet connection. Email login, Supabase cloud saves,
rewarded video assets, clipboard vouchers, vibration, and GO GO SHOP navigation use
the same web implementation as the GitHub Pages version.
