import APIProvider from '@/components/APIProvider';
import BottomSheetModalProvider from '@/components/modals/BottomSheetModalProvider';
import DialogueModalProvider from '@/components/modals/DialogueModalProvider';
import DrawerModalProvider from '@/components/modals/DrawerModalProvider';
import ToastMessageProvider from '@/components/modals/ToastMessageProvider';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ToastMessageProvider>
        <BottomSheetModalProvider>
          <DialogueModalProvider>
            <DrawerModalProvider>
              <APIProvider>
                <Stack>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="signup" />
                  <Stack.Screen name="login" />
                  <Stack.Screen name="verify" />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </APIProvider>
            </DrawerModalProvider>
          </DialogueModalProvider>
        </BottomSheetModalProvider>
      </ToastMessageProvider>
    </GestureHandlerRootView>
  );
}
