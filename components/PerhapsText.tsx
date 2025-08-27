import { Spacings } from '@/constants/Spacings';
import React, { FC, ReactNode, useEffect } from 'react';
import { Text, TextProps, TextStyle, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface PerhapsTextProps extends TextProps {
  children?: ReactNode;
  style?: TextStyle | TextStyle[];
  estimatedLength?: number;
  estimatedLineNumber?: number;
  forceLoading?: boolean;
  onPress?: () => void;
}

// TextWrapper Component
const PerhapsText: FC<PerhapsTextProps> = ({
  children,
  style,
  estimatedLength = 20,
  estimatedLineNumber = 1,
  forceLoading = false,
  ...props
}) => {
  const lines: number[] = new Array(estimatedLineNumber).fill(-1);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, []);

  const loadingStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['rgb(245, 245, 245)', 'rgb(218, 218, 218)'],
    );

    return {
      backgroundColor: backgroundColor,
      color: 'transparent',
      alignSelf: 'flex-start',
    };
  });

  return !forceLoading && children ? (
    <Text style={style} {...props}>
      {children}
    </Text>
  ) : (
    <View style={{ rowGap: Spacings.xs }}>
      {lines.map((val, index) => (
        <Animated.Text key={index} style={[style, loadingStyle]} {...props}>
          {'x'.repeat(estimatedLength / estimatedLineNumber)}
        </Animated.Text>
      ))}
    </View>
  );
};

export default PerhapsText;
