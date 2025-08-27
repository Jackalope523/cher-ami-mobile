import React, { FC, useCallback, useEffect, useMemo } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface WickedCreamyPressableProps extends PressableProps {
  action?: () => void;
  disabled?: boolean;
  shadowStyle?: ViewStyle | ViewStyle[];
  size?: ShadowSize;
}

const WickedCreamyPressable: FC<WickedCreamyPressableProps> = ({
  action = () => {},
  disabled = false,
  shadowStyle,
  size,
  children,
  ...props
}) => {
  const topSV = useSharedValue(0);
  const disabledDV = useDerivedValue(() => {
    return disabled;
  });

  let shadowSizeStyle;
  let shiftDistance: number;
  // Size
  switch (size) {
    case ShadowSize.Large:
      shadowSizeStyle = [styles.shadowLarge];
      shiftDistance = 6;
      break;

    case ShadowSize.Medium:
      shadowSizeStyle = [styles.shadowMedium];
      shiftDistance = 4;
      break;

    case ShadowSize.Small:
      shadowSizeStyle = [styles.shadowSmall];
      shiftDistance = 2;
      break;

    case ShadowSize.ExtraSmall:
      shadowSizeStyle = [styles.shadowExtraSmall];
      shiftDistance = 2;
      break;
  }

  useEffect(() => {
    topSV.value = disabled ? shiftDistance : 0;
  }, [disabled, topSV]);

  const hoverConfig = useMemo(
    () => ({
      duration: 100,
      dampingRatio: 0.3,
      stiffness: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
      reduceMotion: ReduceMotion.System,
    }),
    [],
  );

  const hover = useAnimatedStyle(() => {
    return {
      top: topSV.value,
    };
  });

  const handlePressIn = useCallback(() => {
    if (!disabled) {
      topSV.value = withTiming(shiftDistance, hoverConfig);
    }
  }, [disabled, hoverConfig, topSV]);

  const handlePressOut = useCallback(() => {
    if (!disabled) {
      topSV.value = withTiming(
        disabledDV.value ? shiftDistance : 0,
        hoverConfig,
      );
    }
  }, [disabled, hoverConfig, topSV]);

  return (
    <View>
      <Animated.View style={hover}>
        <Pressable
          onPress={action}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          {...props}>
          {children}
        </Pressable>
      </Animated.View>

      <View style={[styles.shadow, shadowStyle, shadowSizeStyle]} />
    </View>
  );
};

export default WickedCreamyPressable;

export enum ShadowSize {
  Large,
  Medium,
  Small,
  ExtraSmall,
}

const styles = StyleSheet.create({
  shadow: {
    height: 34,
    bottom: 28,
    marginBottom: -28,
    backgroundColor: Colors.canaryDark,
    zIndex: -1,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,

    // since the biggest value we have is 32, this should be 32 in case we round it with borderRadius BUT it seems to mess up the UI since it's hardcoded with these numbers in mind; change sometime later
    // height: 38,
  },

  // xs - 2px
  // sm - 2px
  // md - 4px
  // lg - 6px
  shadowLarge: {
    // height: 38,
    bottom: 28,
    marginBottom: -28,
  },

  shadowMedium: {
    // height: 36,
    bottom: 30,
    marginBottom: -30,
  },

  shadowSmall: {
    // height: 34,
    bottom: 32,
    marginBottom: -32,
  },

  shadowExtraSmall: {
    // height: 34,
    bottom: 32,
    marginBottom: -32,
  },
});
