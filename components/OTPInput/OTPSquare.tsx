import { textStyles } from '@/constants/TextStyles';
import { Dimensions, StyleSheet, Text } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

interface OTPSquareProps {
  value: string;
  focused: boolean;
}

export default function OTPSquare({ value, focused }: OTPSquareProps) {
  const progress = useDerivedValue(() => {
    return withTiming(focused ? 1 : 0, { duration: 150 });
  }, [focused]);

  // The square being typed into is called out in the brand orange, with a
  // faint fill, so it reads as "you are here" rather than merely thicker.
  const focusStyle = useAnimatedStyle(() => {
    return {
      borderWidth: 2 + 2 * progress.value,
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#DEDBD5', '#C15F3C'],
      ),
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#FCFBF8', '#F4F1EA'],
      ),
    };
  });

  return (
    <Animated.View style={[styles.inputContainer, focusStyle]}>
      <Text style={textStyles.labelLargeBlack}>{value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 8,
    backgroundColor: '#FCFBF8',
    alignItems: 'center',
    justifyContent: 'center',
    height: (Dimensions.get('window').width * 0.8) / 6,
    width: (Dimensions.get('window').width * 0.8) / 6,
    borderColor: '#DEDBD5',
  },
});
