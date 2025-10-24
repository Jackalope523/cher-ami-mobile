import { StyleSheet } from 'react-native';
import { Pressable, PressableProps } from 'react-native-gesture-handler';
import { PressableEvent } from 'react-native-gesture-handler/lib/typescript/components/Pressable/PressableProps';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function PopPressable({
  children,
  onPress,
  ...props
}: PressableProps) {
  const scale = useSharedValue(1);

  const pop = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress(event: PressableEvent | null | undefined) {
    scale.value = withTiming(1.03, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 }, () => {
        if (onPress && event) runOnJS(onPress)(event);
      });
    });
  }

  return (
    <Animated.View style={pop}>
      <Pressable onPress={handlePress} {...props}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
