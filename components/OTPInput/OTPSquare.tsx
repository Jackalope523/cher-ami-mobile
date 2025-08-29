import { Colors } from '@/constants/Colors';
import { globalStyles } from '@/constants/GlobalStyles';
import { Dimensions, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

interface OTPSquareProps {
  value: string;
  focused: boolean;
}

export default function OTPSquare({ value, focused }: OTPSquareProps) {
  const bw = useDerivedValue(() => {
    return withTiming(focused ? 4 : 2, { duration: 200 });
  }, [focused]);

  const focusStyle = useAnimatedStyle(() => {
    return {
      borderWidth: bw.value,
    };
  });

  return (
    <Animated.View style={[styles.inputContainer, focusStyle]}>
      <Text style={[globalStyles.textDark, globalStyles.buttonTextTwo]}>
        {value}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 8,
    backgroundColor: Colors.canarySand,
    alignItems: 'center',
    justifyContent: 'center',
    height: (Dimensions.get('window').width * 0.8) / 6,
    width: (Dimensions.get('window').width * 0.8) / 6,
    borderColor: Colors.brown800,
  },
});
