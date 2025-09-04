import APIProvider from '@/components/APIProvider';
import BottomSheetModalProvider from '@/components/modals/BottomSheetModalProvider';
import DialogueModalProvider from '@/components/modals/DialogueModalProvider';
import DrawerModalProvider from '@/components/modals/DrawerModalProvider';
import ToastMessageProvider from '@/components/modals/ToastMessageProvider';
import { Stack } from 'expo-router';
import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    getItemAsync('token').then((token) => setLoggedIn(token !== null));
  }, []);

  if (loggedIn === null) {
    return <View></View>;
  }

  return (
    <GestureHandlerRootView>
      <ToastMessageProvider>
        <BottomSheetModalProvider>
          <DialogueModalProvider>
            <DrawerModalProvider>
              <APIProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Protected guard={!loggedIn}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="signup" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="verify" />
                  </Stack.Protected>
                  <Stack.Protected guard={loggedIn}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="circle/create" />
                    <Stack.Screen name="circle/join" />
                    <Stack.Screen name="circle/manage" />
                  </Stack.Protected>
                </Stack>
              </APIProvider>
            </DrawerModalProvider>
          </DialogueModalProvider>
        </BottomSheetModalProvider>
      </ToastMessageProvider>
    </GestureHandlerRootView>
  );
}
