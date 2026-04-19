import { StyleSheet } from 'react-native';
import { Pressable, PressableProps } from 'react-native-gesture-handler';
import { PressableEvent } from 'react-native-gesture-handler/lib/typescript/components/Pressable/PressableProps';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

export default function PopPressable({
  children,
  onPress,
  disabled,
  ...props
}: PressableProps) {
  const scale = useSharedValue(1);

  const pop = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress(event: PressableEvent | null | undefined) {
    if (disabled) return;

    scale.value = withTiming(1.03, { duration: 100 }, () => {
      if (onPress && event) scheduleOnRN(onPress, event);
      scale.value = withTiming(1, { duration: 100 });
    });
  }

  return (
    <Animated.View style={pop}>
      <Pressable onPress={handlePress} disabled={disabled} {...props}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
