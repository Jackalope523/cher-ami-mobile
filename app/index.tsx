import Button, { ButtonType } from '@/components/Button';
import { Spacings } from '@/constants/Spacings';
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
        paddingHorizontal: Spacings.lg,
        rowGap: Spacings.xs,
      }}>
      <Button
        text={'Sign Up'}
        onPress={handleSignup}
        type={ButtonType.Success}
      />
      <Button text={'Login'} onPress={handleLogin} type={ButtonType.Function} />
    </View>
  );
}
