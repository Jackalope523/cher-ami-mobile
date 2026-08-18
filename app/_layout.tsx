import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import EditIcon from '@/assets/icons/pencil.svg';
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
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  useConfigQuery,
  useGetSelfQuery,
  usePingMutation,
} from '@/lib/hooks';
import { StripeProvider } from '@stripe/stripe-react-native';
import { router, SplashScreen, Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OneSignal } from 'react-native-onesignal';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { loaded, getToken, getOnboarded } = useAuth();
  const showToastMessage = useToastMessage();
  const configQuery = useConfigQuery();
  const selfQuery = useGetSelfQuery(getToken() !== null);
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

  // Started once we have a signed-in user, not merely an open app: the server
  // has already created the matching OneSignal user at sign-in, so we can
  // attach this device to their external id straight away. Initializing any
  // earlier would register a device for every visitor and begin tracking
  // before anyone has an account.
  const oneSignalStarted = useRef(false);
  useEffect(() => {
    if (configQuery.data && selfQuery.data && !oneSignalStarted.current) {
      oneSignalStarted.current = true;
      OneSignal.initialize(configQuery.data.oneSignalAppId);
      OneSignal.login(selfQuery.data.externalId);
    }
  }, [configQuery.data, selfQuery.data]);

  if (!loaded) {
    return null;
  }

  if (pingMutation.isError || configQuery.isError) {
    return <Error />;
  }

  if (pingMutation.isPending || configQuery.isLoading) {
    return <Loading showLogo />;
  }

  // if (nativeApplicationVersion !== configQuery.data?.version) {
  //   return <Update />;
  // }

  return (
    <StripeProvider
      publishableKey={configQuery.data?.stripePublishableKey ?? ''}>
      <Stack
        screenOptions={({ navigation }) => ({
          headerShadowVisible: false,
          headerTitle: ({ children }) => (
            <Text style={textStyles.screenHeader} numberOfLines={1}>
              {children}
            </Text>
          ),
          headerTitleAlign: 'center',
          headerTintColor: '#C15F3C',
          headerLeft: navigation.canGoBack()
            ? () => (
                <PopPressable
                  onPress={() => navigation.goBack()}
                  style={{
                    paddingRight: Spacings.md,
                  }}>
                  <ChevronLeftIcon height={24} width={24} color="#C15F3C" />
                </PopPressable>
              )
            : undefined,
          headerStyle: {
            backgroundColor: '#FCFBF8',
          },
          contentStyle: { backgroundColor: '#FCFBF8' }
        })}>
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
            <Stack.Screen
              name="onboarding/welcome"
              options={{ title: '', headerShown: false }}
            />
            {/* A titled header reads as part of the flow; an empty one looked
                like content had been clipped away above the heading. */}
            <Stack.Screen
              name="onboarding/about"
              options={{ title: 'Getting started' }}
            />
            <Stack.Screen
              name="onboarding/circle"
              options={{ title: 'Getting started' }}
            />
            <Stack.Screen
              name="onboarding/setup"
              options={{ title: 'Getting Started' }}
            />
            <Stack.Screen
              name="onboarding/invite"
              options={{ title: 'Getting started' }}
            />
          </Stack.Protected>

          <Stack.Protected guard={getOnboarded() ?? false}>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen
              name="profile/edit"
              options={{
                title: 'Edit Profile',
              }}
            />
            <Stack.Screen
              name="circle/edit"
              options={{
                title: 'Edit Family Circle',
              }}
            />
            <Stack.Screen
              name="profile/[id]"
              options={{
                title: 'Profile',
                headerRight: () => (
                  <PopPressable
                    onPress={() => router.push('/profile/edit')}
                    style={{ paddingHorizontal: Spacings.sm }}>
                    <EditIcon height={24} width={24} color={'#C15F3C'} />
                  </PopPressable>
                ),
              }}
            />
            <Stack.Screen
              name="post/edit"
              options={{
                title: 'Edit Photo',
              }}
            />
            <Stack.Screen
              name="billing/manage"
              options={{
                title: 'Manage Billing',
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
            <Stack.Screen name="blocked" options={{ title: 'Blocked Users' }} />
          </Stack.Protected>

          {/*
            Shared: reachable both during onboarding and from the feed later.
            These must stay declared last — expo-router anchors to the first
            available screen, so putting them above the group would land signed-in
            users on a circle-setup screen instead of the feed.
          */}
          {/* Titled for the same reason as the onboarding screens, but worded to
              suit both entry points — this one is also reached from the feed. */}
          <Stack.Screen
            name="onboarding/circleSetup"
            options={{ title: 'Your family circle' }}
          />
          <Stack.Screen
            name="circle/recipients/add"
            options={{ title: 'Add a Recipient' }}
          />
          <Stack.Screen
            name="post/size"
            options={{ title: 'Choose a Photo Shape' }}
          />
          <Stack.Screen
            name="post/caption"
            options={{ title: 'Write a Caption' }}
          />
        </Stack.Protected>
      </Stack>
    </StripeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <APIProvider>
            <ImagePickerProvider>
              <ToastMessageProvider>
                <BottomSheetModalProvider>
                  <DialogueModalProvider>
                    <DrawerModalProvider>
                      <RootNavigator />
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
