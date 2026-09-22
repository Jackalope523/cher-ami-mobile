import JoinOrCreateCircle from '@/components/JoinOrCreateCircle';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useLayout } from '@/lib/layout';

export default function OnboardingCircle() {
  const { column } = useLayout();

  function handleJoined() {
    router.replace({
      pathname: '/onboarding/setup',
      params: { joined: '1' },
    });
  }

  return (
    <View style={[styles.container, column]}>
      <JoinOrCreateCircle onboarding onJoined={handleJoined} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
  },
});
