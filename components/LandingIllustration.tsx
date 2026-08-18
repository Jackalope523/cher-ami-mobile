import Hedgehog from '@/assets/images/hedgehog.png';
import MouseGift from '@/assets/images/mouse-gift.png';
import Squirrel from '@/assets/images/squirrel.png';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  EntryExitAnimationFunction,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const ILLUSTRATIONS = [Squirrel, MouseGift, Hedgehog];

const SWAP_EVERY_MS = 4500;
const ROCK_HALF_CYCLE_MS = 1050;
const ROCK_DEGREES = 4;

// High damping: the character rises into place and settles, with only a hint of
// overshoot rather than a visible bounce.
const ARRIVE_SPRING = { damping: 20, stiffness: 180 };

/** Rises up from below into place. */
const popInFromBottom: EntryExitAnimationFunction = () => {
  'worklet';
  return {
    initialValues: {
      opacity: 0,
      transform: [{ translateY: 48 }, { scale: 0.92 }],
    },
    animations: {
      opacity: withTiming(1, { duration: 200 }),
      transform: [
        { translateY: withSpring(0, ARRIVE_SPRING) },
        { scale: withSpring(1, ARRIVE_SPRING) },
      ],
    },
  };
};

/** Drifts up and out, clearing the way for the one coming from below. */
const popOut: EntryExitAnimationFunction = () => {
  'worklet';
  return {
    initialValues: {
      opacity: 1,
      transform: [{ translateY: 0 }, { scale: 1 }],
    },
    animations: {
      opacity: withTiming(0, { duration: 180 }),
      transform: [
        { translateY: withTiming(-16, { duration: 220 }) },
        { scale: withTiming(0.94, { duration: 220 }) },
      ],
    },
  };
};

/**
 * The illustration on the sign-in screen. It rocks back and forth, and every
 * few seconds the character drifts out and the next rises up from below.
 *
 * The characters have quite different proportions (the squirrel is landscape,
 * the hedgehog tall), so each is drawn with `contain` inside one fixed slot
 * rather than given its own aspect ratio — otherwise swapping would resize the
 * screen around it.
 *
 * All of it stands still when the system asks for reduced motion.
 */
export default function LandingIllustration() {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const rock = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(rock);
      rock.value = 0;
      return;
    }

    rock.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: ROCK_HALF_CYCLE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(-1, {
          duration: ROCK_HALF_CYCLE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      true,
    );

    return () => cancelAnimation(rock);
  }, [reduceMotion, rock]);

  useEffect(() => {
    if (reduceMotion) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % ILLUSTRATIONS.length);
    }, SWAP_EVERY_MS);

    return () => clearInterval(timer);
  }, [reduceMotion]);

  // The press bounce is out until the blur it left behind is understood — it
  // wasn't the asset size. Restoring it means a scale on `motionStyle` and a
  // Pressable back around the container.
  const motionStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rock.value * ROCK_DEGREES}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.rocker, motionStyle]}>
        <Animated.View
          key={index}
          style={styles.character}
          entering={reduceMotion ? undefined : popInFromBottom}
          exiting={reduceMotion ? undefined : popOut}>
          <Image
            source={ILLUSTRATIONS[index]}
            style={styles.image}
            contentFit="contain"
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },

  rocker: {
    flex: 1,
  },

  // Absolute so the two characters overlap mid-swap instead of stacking.
  character: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    height: '100%',
    width: '100%',
  },
});
