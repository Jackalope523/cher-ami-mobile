import Button, {
  ButtonDisplay,
  ButtonSize,
  ButtonType,
} from '@/components/Button';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  function handleLogin() {
    router.push('/login');
  }

  function handleSignup() {
    router.push('/signup');
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Button
        type={ButtonType.Success}
        size={ButtonSize.Medium}
        display={ButtonDisplay.Full}
        text={'Sign Up'}
        onPress={handleSignup}
        disabled={false}
      />
      <Button
        type={ButtonType.Function}
        size={ButtonSize.Medium}
        display={ButtonDisplay.Full}
        text={'Login'}
        onPress={handleLogin}
        disabled={false}
      />
    </View>
  );
}

