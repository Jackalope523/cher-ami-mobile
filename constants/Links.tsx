import { Platform } from 'react-native';

export const APP_STORE_ID = '6753635033';

export const ANDROID_PACKAGE = 'com.hollowinc.cherami';

export const APP_STORE_URL = Platform.select({
  ios: APP_STORE_ID ? `itms-apps://apps.apple.com/app/id${APP_STORE_ID}` : null,
  android: `market://details?id=${ANDROID_PACKAGE}`,
  default: null,
});
