import PlusIcon from '@/assets/icons/plus.svg';
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

export default function Error() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.3, {
        duration: 500,
      }),
      -1,
      true,
    );
  }, [scale]);

  const pulse = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      alignItems: 'center',
      justifyContent: 'center',
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={pulse}>
        <PlusIcon
          width={80}
          height={80}
          color={'#F47A70'}
          style={{
            transform: [{ rotate: `45deg` }],
          }}
        />
      </Animated.View>

      <Text
        style={[
          textStyles.heading3,
          { color: '#F47A70', marginBottom: Spacings.sm },
        ]}>
        Something went wrong
      </Text>
      <Text style={[textStyles.body, { textAlign: 'center' }]}>
        Please check your connection and try again.
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
    paddingHorizontal: Spacings.xl,
  },
});
