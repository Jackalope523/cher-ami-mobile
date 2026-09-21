import DownloadIcon from '@/assets/icons/download.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { APP_STORE_URL } from '@/constants/Links';
import { useEffect } from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function Update() {
  const storeUrl = APP_STORE_URL;
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(5, {
        duration: 500,
      }),
      -1,
      true,
    );
  }, [scale]);

  const pulse = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scale.value }],
      alignItems: 'center',
      justifyContent: 'center',
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={pulse}>
        <DownloadIcon width={80} height={80} color={'#83C4F1'} />
      </Animated.View>

      <Text
        style={[
          textStyles.heading2,
          { color: '#83C4F1', textAlign: 'center' },
        ]}>
        Time for an update
      </Text>
      <Text
        style={[
          textStyles.body,
          { textAlign: 'center', paddingHorizontal: Spacings.xl },
        ]}>
        A new version of Cher Ami is ready, and this one can&apos;t talk to us
        any more. One tap and you&apos;re back to your photos.
      </Text>

      {storeUrl && (
        <Button
          label={Platform.OS === 'ios' ? 'Open the App Store' : 'Open Google Play'}
          onPress={() => Linking.openURL(storeUrl)}
          style={{ alignSelf: 'stretch', marginHorizontal: Spacings.xl }}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCFBF8',
    rowGap: Spacings.lg,
  },
});
