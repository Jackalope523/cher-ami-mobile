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
  useExchangeGoogleTokenMutation,
} from '@/lib/hooks';
import {
  AuthRequestConfig,
  DiscoveryDocument,
  makeRedirectUri,
  useAuthRequest,
} from 'expo-auth-session';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

maybeCompleteAuthSession();

// Endpoint
const discovery: DiscoveryDocument = {
  authorizationEndpoint:
    'https://app-cherami-prod.azurewebsites.net/auth/google',
  tokenEndpoint: 'https://app-cherami-prod.azurewebsites.net/auth/google/token',
};

// JACKALOPE: Set up auth.
const config: AuthRequestConfig = {
  clientId: 'google',
  redirectUri: makeRedirectUri({
    scheme: 'cherami',
  }),
};

export default function Index() {
  const { updateToken, updateOnboarded } = useAuth();
  const [email, setEmail] = useState('');
  const [request, response, promptAsync] = useAuthRequest(config, discovery);
  const showToast = useToastMessage();
  const exchangeGoogleTokenMutation = useExchangeGoogleTokenMutation(
    (response) => {
      showToast('Successfully logged in!');
      updateToken(response.token);
      updateOnboarded(response.onboarded);
    },
    () => {
      showToast('Failed to log in. Try again.', ToastMessageType.Error);
    },
  );
  const emailAuthMutation = useEmailAuthMutation(
    () => {
      router.push('/verify');
    },
    (error) => {
      console.log(error);
    },
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeGoogleTokenMutation.mutate({ authorizationCode: code });
    }
  }, [response]);

  function handleGoogle() {
    promptAsync();
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: '#FCFBF8',
      }}>
      <View
        style={{
          flexDirection: 'row',
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

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 62,
          marginBottom: Spacings.lgmd,
        }}>
        <Image
          source={Squirrel}
          style={{
            width: '100%',
            aspectRatio: 288 / 228,
          }}
        />
      </View>

      <PopPressable
        onPress={handleGoogle}
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

      <Pressable
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
      </Pressable>

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

      <TextInput
        placeholder="Your email"
        maxLength={255}
        value={email}
        onChangeText={setEmail}
      />

      <PopPressable
        onPress={() => {}}
        style={[
          styles.button,
          email === '' && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            email === '' && { color: '#A8ABB3' },
          ]}>
          Continue
        </Text>
      </PopPressable>

      <Text
        style={[
          textStyles.buttonTextBlack,
          { textAlign: 'center', paddingHorizontal: Spacings.xl },
        ]}>
        By continuing, you agree to the Terms of Service and Privacy Policy.
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
