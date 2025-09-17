import APIProvider from '@/components/APIProvider';
import AuthProvider, { useAuth } from '@/components/AuthProvider';
import BottomSheetModalProvider from '@/components/modals/BottomSheetModalProvider';
import DialogueModalProvider from '@/components/modals/DialogueModalProvider';
import DrawerModalProvider from '@/components/modals/DrawerModalProvider';
import ToastMessageProvider from '@/components/modals/ToastMessageProvider';
import { StripeProvider } from '@stripe/stripe-react-native';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { getToken } = useAuth();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    getToken()
      .then((token) => setLoggedIn(token !== null))
      .finally(() => SplashScreen.hide());
  }, [getToken]);

  if (loggedIn === null) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!loggedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="verify" />
      </Stack.Protected>
      <Stack.Protected guard={loggedIn}>
        <Stack.Screen name="feed" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="circle/create" />
        <Stack.Screen name="post/create" />
        <Stack.Screen name="circle/join" />
        <Stack.Screen name="circle/manage" />
        <StripeProvider
          publishableKey={
            'pk_test_51RxlM1ARYKi6NXMeRhx7XC2Rjjv7tbG84PRxlKpGX8JlRFtQKoTbVpUHXx9JLc784nyVEBu2lePJJdVJ68h2jGtn00jSaBvtFe'
          }>
          <Stack.Screen name="circle/recipients/add" />
        </StripeProvider>
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ToastMessageProvider>
        <BottomSheetModalProvider>
          <DialogueModalProvider>
            <DrawerModalProvider>
              <AuthProvider>
                <APIProvider>
                  <RootNavigator />
                </APIProvider>
              </AuthProvider>
            </DrawerModalProvider>
          </DialogueModalProvider>
        </BottomSheetModalProvider>
      </ToastMessageProvider>
    </GestureHandlerRootView>
  );
}
