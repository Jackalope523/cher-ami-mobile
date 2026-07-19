import DownloadIcon from '@/assets/icons/download.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function Update() {
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
        A new version of Cher Ami is ready. Please update the app from the App
        Store to keep going.
      </Text>
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
