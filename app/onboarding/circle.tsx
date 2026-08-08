import JoinOrCreateCircle from '@/components/JoinOrCreateCircle';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function OnboardingCircle() {

  // A joiner skips circle creation, but the rest of the setup still applies —
  // they can invite others, add their own recipient, or post a first photo.
  function handleJoined() {
    router.replace('/onboarding/setup');
  }

  return (
    <View style={styles.container}>
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
