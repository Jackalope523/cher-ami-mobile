import AppleIcon from '@/assets/icons/apple-logo.svg';
import GoogleIcon from '@/assets/icons/google-logo.svg';
import Squirrel from '@/assets/images/squirrel.png';
import Title from '@/assets/images/title.png';
import { useAuth } from '@/components/AuthProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  useEmailAuthMutation,
  useExchangeAppleTokenMutation,
  useExchangeGoogleTokenMutation,
} from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import {
  AuthRequestConfig,
  DiscoveryDocument,
  makeRedirectUri,
  useAuthRequest,
} from 'expo-auth-session';
import { Image } from 'expo-image';
import { openURL } from 'expo-linking';
import { router } from 'expo-router';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

maybeCompleteAuthSession();

const googleDiscovery: DiscoveryDocument = {
  authorizationEndpoint:
    'https://app-cherami-prod.azurewebsites.net/auth/google',
  tokenEndpoint: 'https://app-cherami-prod.azurewebsites.net/auth/google/token',
};

const appleDiscovery: DiscoveryDocument = {
  authorizationEndpoint:
    'https://app-cherami-prod.azurewebsites.net/auth/apple',
  tokenEndpoint: 'https://app-cherami-prod.azurewebsites.net/auth/apple/token',
};

// JACKALOPE: Set up auth.
const googleConfig: AuthRequestConfig = {
  clientId: 'google',
  redirectUri: makeRedirectUri({
    scheme: 'cherami',
  }),
};

const appleConfig: AuthRequestConfig = {
  clientId: 'apple',
  redirectUri: makeRedirectUri({
    scheme: 'cherami',
  }),
};

export default function Index() {
  const queryClient = useQueryClient();
  const { updateToken, updateOnboarded, getToken } = useAuth();
  const [email, setEmail] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [googleRequest, googleResponse, promptGoogleAsync] = useAuthRequest(
    googleConfig,
    googleDiscovery,
  );
  const [appleRequest, appleResponse, promptAppleAsync] = useAuthRequest(
    appleConfig,
    appleDiscovery,
  );
  const showToast = useToastMessage();
  const exchangeGoogleTokenMutation = useExchangeGoogleTokenMutation(
    (response) => {
      updateToken(response.token);
      updateOnboarded(response.onboarded);
    },
    () => {
      showToast('Failed to log in. Try again.', ToastMessageType.Error);
    },
  );
  const exchangeAppleTokenMutation = useExchangeAppleTokenMutation(
    (response) => {
      updateToken(response.token);
      updateOnboarded(response.onboarded);
    },
    () => {
      showToast('Failed to log in. Try again.', ToastMessageType.Error);
    },
  );

  const emailAuthMutation = useEmailAuthMutation(
    () => {
      showToast('Check your email!', ToastMessageType.Success);
      router.push({
        pathname: '/verify',
        params: {
          email,
        },
      });
    },
    (error) => {
      console.log(error);
      showToast('Failed to log in. Try again.', ToastMessageType.Error);
    },
  );

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { code } = googleResponse.params;
      exchangeGoogleTokenMutation.mutate({ authorizationCode: code });
    }
  }, [googleResponse]);

  useEffect(() => {
    if (appleResponse?.type === 'success') {
      const { code } = appleResponse.params;
      exchangeAppleTokenMutation.mutate({ authorizationCode: code });
    }
  }, [appleResponse]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function continueDisabled() {
    return emailAuthMutation.isPending || email === '';
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: '#FCFBF8',
      }}>
      {!keyboardVisible && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 72,
            marginBottom: Spacings.lgmd,
          }}>
          <Image
            source={Title}
            style={{
              width: '100%',
              aspectRatio: 268 / 60,
            }}
          />
        </View>
      )}

      {!keyboardVisible && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacings.lgmd,
          }}>
          <Image
            source={Squirrel}
            style={{
              width: '90%',
              height: '90%',
              aspectRatio: 288 / 228,
            }}
          />
        </View>
      )}

      <PopPressable
        onPress={() => {
          promptGoogleAsync();
        }}
        style={{
          flexDirection: 'row',
          columnGap: 15,
          paddingVertical: 15,
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
          marginBottom: Spacings.md,
          justifyContent: 'center',

          // iOS shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,

          // Android shadow
          elevation: 8,
        }}>
        <GoogleIcon />
        <Text style={{ fontWeight: 500, color: '#0000008A', fontSize: 20 }}>
          Continue with Google
        </Text>
      </PopPressable>

      <PopPressable
        onPress={() => {
          promptAppleAsync();
        }}
        style={{
          flexDirection: 'row',
          columnGap: 15,
          paddingVertical: 15,
          borderRadius: 10,
          backgroundColor: '#000000',
          justifyContent: 'center',

          // iOS shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,

          // Android shadow
          elevation: 8,
        }}>
        <AppleIcon />
        <Text style={{ fontWeight: 500, color: '#FFFFFF', fontSize: 20 }}>
          Continue with Apple
        </Text>
      </PopPressable>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: Spacings.mdsm,
          marginVertical: Spacings.xl,
        }}>
        <View style={{ borderWidth: 1.5, borderColor: '#DEDBD5', flex: 1 }} />
        <Text style={[textStyles.labelLargeBlack, { color: '#868581' }]}>
          OR
        </Text>
        <View style={{ borderWidth: 1.5, borderColor: '#DEDBD5', flex: 1 }} />
      </View>

      <View
        style={{
          flexDirection: 'row',
        }}>
        <TextInput
          placeholder="Your email"
          maxLength={255}
          value={email}
          onChangeText={setEmail}
          containerStyle={{ width: '100%' }}
        />
      </View>

      <PopPressable
        disabled={continueDisabled()}
        onPress={() => {
          emailAuthMutation.mutate({ email });
        }}
        style={[
          styles.button,
          continueDisabled() && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            continueDisabled() && { color: '#A8ABB3' },
          ]}>
          Continue
        </Text>
      </PopPressable>

      <Text
        style={[
          textStyles.buttonTextBlack,
          { textAlign: 'center', paddingHorizontal: Spacings.xl },
        ]}>
        By continuing, you agree to the{' '}
        <Text
          onPress={() => {
            openURL('https://thecherami.com/legal/terms');
          }}
          style={[
            textStyles.buttonTextBlack,
            { textDecorationLine: 'underline' },
          ]}>
          Terms of Service
        </Text>{' '}
        and{' '}
        <Text
          onPress={() => {
            openURL('https://thecherami.com/legal/privacy');
          }}
          style={[
            textStyles.buttonTextBlack,
            { textDecorationLine: 'underline' },
          ]}>
          Privacy Policy
        </Text>
        .
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    marginVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
  },
});
