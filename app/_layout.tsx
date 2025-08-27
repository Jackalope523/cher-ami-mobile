import BottomSheetModalProvider from '@/components/modals/BottomSheetModalProvider';
import DialogueModalProvider from '@/components/modals/DialogueModalProvider';
import DrawerModalProvider from '@/components/modals/DrawerModalProvider';
import ToastMessageProvider from '@/components/modals/ToastMessageProvider';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ToastMessageProvider>
      <BottomSheetModalProvider>
        <DialogueModalProvider>
          <DrawerModalProvider>
            <Stack>
              <Stack.Screen name="index" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="login" />
              <Stack.Screen name="verify" />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </DrawerModalProvider>
        </DialogueModalProvider>
      </BottomSheetModalProvider>
    </ToastMessageProvider>
  );
}

