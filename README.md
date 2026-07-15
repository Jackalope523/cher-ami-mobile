# Cher Ami Mobile App

> A production iOS & Android app that turns a family's shared photos into a printed magazine mailed to loved ones. Built end-to-end with React Native, TypeScript, and Expo.

**Cher Ami** is a private family photo-sharing app. Members of a family *circle* post photos and captions throughout the month; those posts are automatically compiled into a printed magazine and mailed to the circle's *recipients* such as grandparents and relatives who'd rather find something in the mailbox than get another app notification.

This repository is the mobile client (published to the App Store and Google Play), built with [Expo](https://expo.dev) and React Native.

---

## What this project demonstrates

- **Ships to real users on two platforms** — one TypeScript/React Native codebase, released to the App Store and Google Play via automated EAS cloud builds.
- **Payments in production** — subscription billing and payment-method management integrated with **Stripe**, including native payment sheets and setup intents.
- **Real authentication, three ways** — passwordless email (one-time code), **Sign in with Apple**, and **Google** OAuth, with tokens persisted securely in the device keychain.
- **A non-trivial media pipeline** — pick or capture a photo → crop to print dimensions → client-side resize/compress → upload, tuned to respect print aspect ratios.
- **Performant, paginated feed** — infinite scroll backed by TanStack Query's `useInfiniteQuery`, with caching, retries, and optimistic UI updates.
- **Push notifications at scale** via OneSignal, wired through an Expo config plugin.
- **Thoughtful product surface** — onboarding flow, circle/member management, invite codes, recipient address book, account deletion, user blocking/reporting, and moderation flows.

The codebase is ~9,200 lines of TypeScript spanning 21 screens and ~30 reusable components, with a dedicated data layer of ~45 typed API hooks.

---

## Tech stack

| Area | Tooling |
| --- | --- |
| Framework | Expo SDK 54, React Native 0.81, React 19 (New Architecture enabled) |
| Language | TypeScript (strict, fully typed request/response DTOs) |
| Navigation | [expo-router](https://docs.expo.dev/router/introduction/) — file-based, typed routes, drawer navigation |
| Data layer | [TanStack Query](https://tanstack.com/query) + Axios (with automatic retry) |
| Payments | `@stripe/stripe-react-native` |
| Auth | `expo-auth-session`, `expo-apple-authentication`, `expo-secure-store` |
| Media | `expo-image`, `expo-image-manipulator`, `react-native-image-crop-picker` |
| Push | OneSignal (`react-native-onesignal` + config plugin) |
| Animation | `react-native-reanimated` |
| CI/CD | [EAS Build](https://docs.expo.dev/build/introduction/) — cloud builds, auto-incrementing versions, Play Store submission |
| Backend | Consumes a REST API hosted on Azure |

---

## Architecture at a glance

```
app/           Screens (file-based routes)
  (drawer)/    Main tabs: feed, manage circle, settings
  billing/     Add & manage payment methods (Stripe)
  circle/      Edit circle, manage recipients
  onboarding/  First-run setup (name, circle)
  post/        Create-post flow: pick → size/crop → caption
  profile/     View & edit profiles
  index.tsx    Sign-in screen
components/     Reusable UI — providers, modals, feed, OTP input
lib/           Typed API hooks, request/response models, utilities
constants/     Design tokens (spacing, borders, typography)
```

A few decisions worth calling out:

- **Provider-based composition** — cross-cutting concerns (auth, API client, image picking, toasts, bottom sheets, dialogs) are isolated in dedicated React context providers rather than scattered through screens.
- **A single typed data layer** — every network call lives in `lib/hooks.ts` as a `useQuery`/`useMutation` hook with typed inputs and outputs, so screens stay declarative and caching/retry logic stays centralized.
- **Design tokens** — spacing, borders, and text styles are defined once in `constants/` and reused, keeping the UI consistent.

---

## Running it locally

The app uses native modules (Stripe, OneSignal, image crop picker), so it **won't run in Expo Go** it needs a development build.

**Prerequisites:** Node.js (LTS) + npm, and a native toolchain (Android Studio for Android, Xcode for iOS on macOS).

```bash
npm install
npm run android   # or: npm run ios
```

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run android` / `npm run ios` | Build and run on a device/emulator |
| `npm run lint` | Run ESLint (`eslint-config-expo`) |

## Builds & releases

Store builds are produced with EAS. Production builds auto-increment the build number, and the app version is sourced remotely.

```bash
eas build  --profile production --platform all
eas submit --profile production --platform android   # Google Play internal track
```

---

*Built by a solo developer, from first commit to store release.*
