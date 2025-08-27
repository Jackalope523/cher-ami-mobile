import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { Spacings } from '@/constants/Spacings';
import { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';

/*

TODO test and fix being able to press outside of the bottom sheet and still being able to control it (press the buttons, interact with bottom sheet)
TODO add the ability to close the BottomSheetModal with a Gesture (swipe down) (react-native-reanimated).
TODO add shadow (differs from the shadow we use in the Button components - instead of being top to bottom, it's bottom to top)

*/

type BottomSheetModalGenericProps = {
  onHide: () => any;
  index: number;
  children?: React.ReactNode;
};

function BottomSheetModalGeneric({
  onHide,
  index,
  children,
}: BottomSheetModalGenericProps) {
  ///////
  // Swipeable Modal
  //////////////////
  const offset = useSharedValue(0);
  const pullBack = useSharedValue(true);

  useEffect(() => {
    offset.value = 0;
    pullBack.value = true;
  }, [offset, pullBack]);

  const maximumModalHeight = styles.container.height * 0.8;

  const pan = Gesture.Pan()
    .onChange((event) => {
      const translationY = event.translationY;
      const floor = -100;

      if (translationY > 0) {
        offset.value = translationY;
      } else if (translationY > floor) {
        const dampenedY =
          -translationY + (1 / (4 * floor)) * Math.pow(translationY, 2);

        offset.value = -dampenedY;
      }

      pullBack.value = event.velocityY <= 1000;
    })
    .onFinalize(() => {
      offset.value = withTiming(pullBack.value ? 0 : 1000);
      !pullBack.value && runOnJS(onHide)();
    });

  const swipeable = useAnimatedStyle(() => {
    const translateY = offset.value;
    const excess = Math.max(0, translateY - Spacings.xl);
    const overshoot = Math.min(0, translateY);
    return {
      paddingBottom: Spacings.xl - translateY,
      marginBottom: -excess,
      maxHeight: maximumModalHeight - overshoot,
    };
  });

  return (
    <View style={[styles.container, { zIndex: 10 + index }]}>
      <Pressable style={styles.pressableBackdrop} onPress={onHide}>
        {index === 0 && (
          <Animated.View
            style={styles.backdrop}
            entering={FadeIn}
            exiting={FadeOut}
          />
        )}
      </Pressable>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.bottomSheetModal, swipeable]}
          entering={SlideInDown}
          exiting={SlideOutDown}>
          <View style={styles.pullIndicatorContainer}>
            <View style={styles.pullIndicator} />
          </View>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    position: 'absolute',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    bottom: 0,
    left: 0,
  },

  pressableBackdrop: {
    flex: 1,
    zIndex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  bottomSheetModal: {
    zIndex: 1,
    position: 'absolute',
    width: Dimensions.get('window').width,
    paddingHorizontal: Spacings.lg,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.brown800,
    backgroundColor: Colors.canarySand,
    bottom: 0,
  },

  pullIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: Spacings.lg,
  },

  pullIndicator: {
    width: Dimensions.get('window').width / 4,
    height: 4,
    borderRadius: 100,
    backgroundColor: Colors.brown800,
  },

  close: {
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 75)',
  },
});

export default BottomSheetModalGeneric;
