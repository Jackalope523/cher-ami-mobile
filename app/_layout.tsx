import TrashIcon from '@/assets/icons/trash-orange.svg';
import APIProvider from '@/components/APIProvider';
import AuthProvider, { useAuth } from '@/components/AuthProvider';
import BottomSheetModalProvider from '@/components/modals/BottomSheetModalProvider';
import DialogueModalProvider from '@/components/modals/DialogueModalProvider';
import DrawerModalProvider from '@/components/modals/DrawerModalProvider';
import ToastMessageProvider from '@/components/modals/ToastMessageProvider';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { StripeProvider } from '@stripe/stripe-react-native';
import { router, SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import {
  GestureHandlerRootView,
  Pressable,
} from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoaded, getToken, getOnboarded } = useAuth();

  useEffect(() => {
    if (isLoaded()) {
      SplashScreen.hide();
    }
  }, [isLoaded]);

  if (!isLoaded()) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: textStyles.screenHeader,
        headerTitleAlign: 'center',
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: '#C15F3C',
        headerStyle: {
          backgroundColor: '#FCFBF8',
        },
      }}>
      <Stack.Protected guard={getToken() === null}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="verify"
          options={{
            title: '',
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={getToken() !== null}>
        <Stack.Protected guard={getOnboarded() === null}>
          <Stack.Screen name="onboarding/firstName" options={{ title: '' }} />
          <Stack.Screen name="onboarding/lastName" options={{ title: '' }} />
          <Stack.Screen name="onboarding/birthday" options={{ title: '' }} />
          <Stack.Screen name="onboarding/avatar" options={{ title: '' }} />
        </Stack.Protected>
        <Stack.Protected guard={getOnboarded() ?? false}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile/[id]"
            options={{
              title: 'Profile',
            }}
          />
          <Stack.Screen name="circle/create" />
          <Stack.Screen name="circle/join" />
          <Stack.Screen
            name="post/create"
            options={{
              title: 'New Post',
            }}
          />
          <Stack.Screen
            name="billing/manage"
            options={{
              title: 'Manage Billing',
            }}
          />
          <Stack.Screen
            name="circle/recipients/add"
            options={{
              title: 'Add Recipient',
            }}
          />
          <Stack.Screen
            name="circle/recipients/edit"
            options={{
              title: 'Edit Recipient',
              headerRight: () => (
                <Pressable
                  onPress={() => router.push('/circle/recipients/remove')}
                  style={{ paddingHorizontal: Spacings.md }}>
                  <TrashIcon height={24} width={24} />
                </Pressable>
              ),
            }}
          />
          <Stack.Screen
            name="circle/recipients/remove"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="onboarding/circleName" options={{ title: '' }} />
          <Stack.Screen
            name="onboarding/circleHeader"
            options={{ title: '' }}
          />
          <Stack.Screen
            name="onboarding/circleCode"
            options={{ headerShown: false }}
          />
        </Stack.Protected>
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <AuthProvider>
          <APIProvider>
            <ToastMessageProvider>
              <BottomSheetModalProvider>
                <DialogueModalProvider>
                  <DrawerModalProvider>
                    {/* JACKALOPE: Get this from the key store. */}
                    <StripeProvider
                      publishableKey={
                        'pk_test_51RxlM1ARYKi6NXMeRhx7XC2Rjjv7tbG84PRxlKpGX8JlRFtQKoTbVpUHXx9JLc784nyVEBu2lePJJdVJ68h2jGtn00jSaBvtFe'
                      }>
                      <RootNavigator />
                    </StripeProvider>
                  </DrawerModalProvider>
                </DialogueModalProvider>
              </BottomSheetModalProvider>
            </ToastMessageProvider>
          </APIProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
