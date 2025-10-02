import Button, { ButtonType } from '@/components/Button';
import { Spacings } from '@/constants/Spacings';
import {
  AuthRequestConfig,
  DiscoveryDocument,
  makeRedirectUri,
  useAuthRequest,
} from 'expo-auth-session';
import { router } from 'expo-router';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import { useEffect } from 'react';
import { View } from 'react-native';

maybeCompleteAuthSession();

// Endpoint
const discovery: DiscoveryDocument = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
};

const config: AuthRequestConfig = {
  clientId: 'CLIENT_ID',
  redirectUri: makeRedirectUri({
    scheme: 'cherami',
  }),
};

export default function Index() {
  const [request, response, promptAsync] = useAuthRequest(config, discovery);

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);

  function handleLogin() {
    router.push('/login');
  }

  function handleSignup() {
    router.push('/signup');
  }

  function handleGoogle() {
    promptAsync();
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacings.lg,
        rowGap: Spacings.xs,
      }}>
      <Button
        text={'Sign Up'}
        onPress={handleSignup}
        type={ButtonType.Success}
      />
      <Button text={'Login'} onPress={handleLogin} type={ButtonType.Function} />
      <Button
        text={'Google'}
        onPress={handleGoogle}
        type={ButtonType.Warning}
        disabled={!request}
      />
    </View>
  );
}
