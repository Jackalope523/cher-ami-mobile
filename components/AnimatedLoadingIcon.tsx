import LoadingIcon from '@/assets/icons/loader.svg';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedLoadingIconProps {
  height?: number;
  width?: number;
}

export default function AnimatedLoadingIcon({ height = 48, width = 48 }: AnimatedLoadingIconProps) {
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
    <Animated.View style={rotationAnim}>
      <LoadingIcon height={height} width={width} color="#B05637" />
    </Animated.View>
  );
}
