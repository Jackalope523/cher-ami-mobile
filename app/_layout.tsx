import APIProvider from '@/components/APIProvider';
import AuthProvider, { useAuth } from '@/components/AuthProvider';
import Error from '@/components/Error';
import ImagePickerProvider from '@/components/ImagePickerProvider';
import Loading from '@/components/Loading';
import BottomSheetModalProvider from '@/components/modals/BottomSheetModalProvider';
import DialogueModalProvider from '@/components/modals/DialogueModalProvider';
import DrawerModalProvider from '@/components/modals/DrawerModalProvider';
import ToastMessageProvider, {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import { textStyles } from '@/constants/TextStyles';
import { usePingMutation } from '@/lib/hooks';
import { StripeProvider } from '@stripe/stripe-react-native';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { loaded, getToken, getOnboarded } = useAuth();
  const showToastMessage = useToastMessage();
  const pingMutation = usePingMutation(
    () => {},
    (error) => {
      console.log(error);
      showToastMessage('Unable to connect to server.', ToastMessageType.Error);
    },
  );

  useEffect(() => {
    pingMutation.mutate();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (pingMutation.isError) {
    return <Error />;
  }

  if (pingMutation.isPending) {
    return <Loading />;
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
        <Stack.Screen
          name="verify"
          options={{
            title: '',
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={getToken() !== null}>
        <Stack.Protected guard={!getOnboarded()}>
          <Stack.Screen name="onboarding/firstName" options={{ title: '' }} />
          <Stack.Screen name="onboarding/lastName" options={{ title: '' }} />
        </Stack.Protected>
        <Stack.Protected guard={getOnboarded() ?? false}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile/[id]"
            options={{
              title: 'Profile',
            }}
          />
          <Stack.Screen
            name="post/create"
            options={{
              title: 'New Post',
            }}
          />
          <Stack.Screen
            name="billing/add"
            options={{
              headerShown: false,
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
            name="circle/recipients/[id]/edit"
            options={{
              title: 'Edit Recipient',
            }}
          />
          <Stack.Screen
            name="circle/recipients/[id]/delete"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="onboarding/circleName" options={{ title: '' }} />
          <Stack.Screen
            name="onboarding/circleHeader"
            options={{ title: '' }}
          />
          <Stack.Screen name="blocked" options={{ title: 'Blocked Users' }} />
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
            <ImagePickerProvider>
              <ToastMessageProvider>
                <BottomSheetModalProvider>
                  <DialogueModalProvider>
                    <DrawerModalProvider>
                      {/* JACKALOPE: Get this from the key store. */}
                      <StripeProvider
                        publishableKey={
                          'pk_live_51RxlLoAAKZ0DCoddiYjT5r0l7YCbBd4dLkf1FejYMAKLQeCU3ghSreuwAKdMBJFdxt9V3bMd1cvy1EwTsXWu0ZTy00wwQab38P'
                        }>
                        <RootNavigator />
                      </StripeProvider>
                    </DrawerModalProvider>
                  </DialogueModalProvider>
                </BottomSheetModalProvider>
              </ToastMessageProvider>
            </ImagePickerProvider>
          </APIProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
