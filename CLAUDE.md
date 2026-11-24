# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"智能发花监控平台" — a cross-platform mobile app for remotely monitoring and controlling tea-fermentation ("发花") machines. Built with React Native + Expo (SDK ~52, RN 0.76, new architecture enabled) and TypeScript. It is a **front-end-only demo**: all data comes from in-memory mock data, there is no backend/API, no persistence, and no test suite.

## Commands

```bash
npm install            # installs deps, then runs `postinstall: patch-package`
npm start              # Expo dev server (Metro)
npm run android        # build & run on Android (expo run:android)
npm run ios            # build & run on iOS (expo run:ios)
npm run web            # start web target
npx eas build --profile development|preview|production   # EAS cloud build (eas-cli is a devDependency)
```

- There are **no** `lint` or `test` scripts, and no Jest/ESLint config. TypeScript errors surface via Expo/Metro, not a standalone `tsc` script.
- `npm install` runs `patch-package` automatically. Do not remove the `patches/` directory — `expo-modules-core+2.2.3.patch` fixes both the Android Gradle file (Kotlin/Compose compiler version-check suppression) and the native C++ code (a `shared_ptr<T[]>` / missing-`<unordered_map>` compatibility issue). Both are required for the Android build to compile.
- `babel.config.js` and `tsconfig.json` are intentionally absent and listed in `.gitignore`; the project relies on Expo's default Babel preset and TypeScript config.
- `build.bat` is stale — it points to a hardcoded path on another machine (`C:\Users\Lenovo\...`). Do not rely on it.

## Building the APK (local Android build)

This is an Expo/React Native app, so producing an APK requires a local Android native build (Gradle + JDK + NDK). The project is pre-configured for a China-network environment (domestic mirrors) with the correct toolchain versions. Key facts learned from the first successful build:

- **JDK 17 is required** — RN 0.76 hard-requires JDK 17; JDK 21 fails toolchain validation. On this machine it lives at `C:\Users\22773\.jdks\jdk-17.0.20+8` (Temurin).
- **Android SDK** is at `D:\App\develop\AndroidStudio\sdk`, pointed to by `android/local.properties` (`sdk.dir=...`).
- **NDK version must be `26.1.10909125`** (r26b). The original `android/build.gradle` said `25.2.9519653` — that libc++ is too old and breaks `expo-modules-core`'s C++ (`shared_ptr<T[]>` array support is incomplete), while NDK 28 is too new (folly/libc++ `std::format` incompatibility). `26.1.10909125` is RN 0.76's default and works. `android/build.gradle` is already set to it.

### Domestic mirrors (already configured)

- **Gradle distribution**: `android/gradle/wrapper/gradle-wrapper.properties` → Tencent mirror `https://mirrors.cloud.tencent.com/gradle/`.
- **Maven dependencies**: `android/build.gradle` (`buildscript` + `allprojects` repositories) prepend Aliyun mirrors `https://maven.aliyun.com/repository/{google,central,gradle-plugin,public}` before `google()`/`mavenCentral()`.
- **Disable JDK toolchain auto-download**: `android/gradle.properties` has `org.gradle.java.installations.auto-download=false` (prevents foojay/github downloads).

### Build command

```bash
cd android
JAVA_HOME="C:/Users/22773/.jdks/jdk-17.0.20+8" ./gradlew assembleRelease --no-daemon
```

Output: `android/app/build/outputs/apk/release/app-release.apk` (debug-signed — installable for testing, not for store submission).

## Architecture

### Navigation (in `App.tsx`)

`App` wraps everything in `AuthProvider` → `NavigationContainer` → `AppNavigator`. Navigation is split by auth state:

- **Root stack** (`RootStackParamList` in `src/types/navigation.ts`): `Login`, `Main`, `DeviceDetail` (`{ deviceId }`), `ParameterAdjust` (`{ deviceId }`).
- **Main** is a bottom-tab navigator (`MainTabParamList`) with four tabs: `首页` (Dashboard), `设备` (DeviceList), `报警` (AlertCenter), `我的` (Settings). Tab icons are emoji, hardcoded in `App.tsx`'s `TabIcon`.
- `AppNavigator` shows the login screen when unauthenticated, the tab layout when authenticated. Route params are typed via the global `ReactNavigation.RootParamList` declaration in `src/types/navigation.ts`.

### Data flow

- `src/data/mockData.ts` exports `mockDevices` (6 devices) and `mockAlerts`, typed by `src/types/index.ts` (`Device`, `Alert`, `FermentationParameters`, `FermentationPhase`, `DeviceStats`, `ControlCommand`).
- **Screens read `mockData` directly** and hold their own local `useState`, so each screen is independent — there is no shared device/alert store. Changing data in one screen does not propagate to others.
- `src/hooks/useDevices.ts` exports `useDevices` and `useAlerts` hooks (search/filter/update/read-state logic), but **no screen actually uses them** — they are dead code. The screens re-implement this logic inline (e.g. `DeviceListScreen` re-implements search/filter, `AlertCenterScreen` re-implements read/unread counts).
- `src/context/AuthContext.tsx` is the one real shared store (React Context). Login is hardcoded (`admin`/`admin123` → 管理员, `user`/`user123` → 操作员). `AsyncStorage` persistence was commented out (`暂时移除AsyncStorage的使用`); there is no real auth or session persistence.

### Config & styling

- `src/config/constants.ts` is the source of truth for shared lookups: `STATUS_CONFIG` (device status → color/label/icon), `ALERT_CONFIG`, `TYPE_CONFIG`, `COLORS`, `SPACING`, `FONT_SIZE`, and `getStatusConfig`/`getAlertConfig`/`getTypeConfig` helpers.
- Inconsistency to be aware of: `AlertCenterScreen.tsx` redefines its **own local copies** of `ALERT_CONFIG` and `TYPE_CONFIG` instead of importing them from `constants.ts`. Some screens use the shared config/`COLORS` tokens; others (e.g. `DeviceDetailScreen`) hardcode hex colors and have their own `getStatusColor`. Screens mostly use inline `StyleSheet.create` at the bottom of each file.
- UI text is Simplified Chinese; icons are emoji rather than an icon library. There is no component library or navigation icons package.

## Layout note

Screen components live at the **repository root** (e.g. `DeviceListScreen.tsx`, `DashboardScreen.tsx`), *not* under `src/screens/`. `src/` holds shared code only: `components/`, `config/`, `context/`, `data/`, `hooks/`, `types/`. The `README.md` project-structure diagram is out of date on this point (it shows a `src/screens/` directory that does not exist, and says "Expo SDK 50" while `package.json` uses `~52.0.0`).
