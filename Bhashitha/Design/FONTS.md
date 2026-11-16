# Brand font setup (owner: Bhashitha)

These files stay at framework-required paths under `mobile/`:

- `mobile/assets/fonts/PlusJakartaSans.ttf` is the variable font (weights 200–800). Web and iOS load it at runtime through `useFonts` in `mobile/src/app/_layout.tsx`.
- `mobile/assets/fonts/static/PlusJakartaSans-{Regular,Medium,SemiBold,Bold,ExtraBold}.ttf` are static 400/500/600/700/800 copies generated from the variable font with fontTools:
  `python -m fontTools.varLib.instancer PlusJakartaSans.ttf wght=700 --static --update-name-table -o static/PlusJakartaSans-Bold.ttf`
- The `expo-font` plugin in `mobile/app.json` builds these into a native Android font family named `Plus Jakarta Sans`.

Why: Android cannot apply `fontWeight` to a variable font that is loaded at runtime, so bold text lost its weight in installed APKs. Android therefore skips runtime loading and uses the native family. If a screen needs a new weight, generate a static file for it and add it to `app.json`. The change only takes effect after a new native build.

The app is light-only (`userInterfaceStyle: "light"`, navigation always uses `DefaultTheme`), because all screens use hard-coded light colours.

## Rule for new text styles

Every text style must set `fontFamily: 'Plus Jakarta Sans'`. Text without a fontFamily falls back to the phone maker's system font. On some Android brands (Xiaomi, Oppo, Realme, OnePlus, Vivo) bold system text is measured too narrow, so the last letters get cut off (for example "Colomb" or "Sign").
