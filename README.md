# Cher Ami Mobile App

## Get started

### To run the emulator
https://docs.expo.dev/more/expo-cli/

```
npx expo run:ios
npx expo run:android
```

_Don't use Expo Go_

### Publishing with EAS (Expo Application Services)
https://expo.dev/accounts/hollow-inc/projects/cherami

```eas build --platform all --auto-submit
```

Without `--auto-submit`, you must download the latest bundle from the dashboard and manually upload them to the app stores. 

#### Versioning
You must manually increment `app.json` before building a publish bundle.