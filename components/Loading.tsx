import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function Loading() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
      }),
      -1,
    );
  }, [rotation]);

  const rotationAnim = useAnimatedStyle(() => {
    return {
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={rotationAnim}>
        <View style={styles.dot} />
        <View style={{ flexDirection: 'row', columnGap: 18 }}>
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <View style={styles.dot} />
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCFBF8',
  },

  dot: {
    height: 18,
    width: 18,
    borderRadius: 9,
    backgroundColor: '#B05637',
  },
});
