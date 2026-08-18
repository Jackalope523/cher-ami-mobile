import XIcon from '@/assets/icons/circle-x.svg';
import { Spacings } from '@/constants/Spacings';
import { Image } from 'expo-image';
import { Modal, StyleSheet, useWindowDimensions, View } from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import PopPressable from './PopPressable';

const MAX_SCALE = 4;
const RETURN_MS = 200;

interface PhotoViewerProps {
  uri: string;
  token: string | null;
  /** Width over height, so the photo fills the screen at the shape it was cropped to. */
  aspectRatio: number;
  onClose: () => void;
}

/**
 * Full-screen photo you can pinch to look closer at, which springs back when
 * you let go. Tap to close.
 *
 * Zoom is a look, not a state: it lives only while fingers are down. That is
 * what removes the need to pan, to bound the pan, and to remember a scale
 * between gestures — and with it the class of bug where two gestures wrote the
 * same value and the photo stuck off-centre.
 *
 * Separate from the feed on purpose: the feed is a SectionList, so an in-place
 * pinch fights the scroll and anything larger than the row gets clipped.
 */
export default function PhotoViewer({
  uri,
  token,
  aspectRatio,
  onClose,
}: PhotoViewerProps) {
  const { width, height } = useWindowDimensions();

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const startFocalX = useSharedValue(0);
  const startFocalY = useSharedValue(0);
  /** True from the first touch of a pinch until it has finished springing back. */
  const pinching = useSharedValue(false);

  const displayWidth = Math.min(width, height * aspectRatio);
  const displayHeight = displayWidth / aspectRatio;

  const pinch = Gesture.Pinch()
    .onStart((event) => {
      pinching.value = true;
      startFocalX.value = event.focalX;
      startFocalY.value = event.focalY;
    })
    .onUpdate((event) => {
      scale.value = Math.min(Math.max(event.scale, 1), MAX_SCALE);
      translateX.value = event.focalX - startFocalX.value;
      translateY.value = event.focalY - startFocalY.value;
    })
    .onEnd(() => {
      translateX.value = withTiming(0, { duration: RETURN_MS });
      translateY.value = withTiming(0, { duration: RETURN_MS });
      scale.value = withTiming(1, { duration: RETURN_MS }, (finished) => {
        if (finished) pinching.value = false;
      });
    });

  // Lifting the last finger of a pinch looks like a tap, so closing waits until
  // the photo has settled back.
  const tapToClose = Gesture.Tap()
    .numberOfTaps(1)
    .maxDistance(24)
    .onEnd(() => {
      if (!pinching.value) scheduleOnRN(onClose);
    });

  const gesture = Gesture.Simultaneous(pinch, tapToClose);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    // animationType is deliberately "none". A fading Modal keeps its native
    // view on screen for the length of the dismissal and goes on swallowing
    // touches, so the feed underneath could not be scrolled until it finished —
    // which is why shortening the spring-back made no difference. The open is
    // faded by Reanimated instead, and the close is now immediate.
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      {/* Gestures inside a React Native Modal need their own root view. */}
      <GestureHandlerRootView style={styles.root}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={styles.root} entering={FadeIn.duration(150)}>
            <Animated.View style={imageStyle}>
              <Image
                style={{ width: displayWidth, height: displayHeight }}
                contentFit="contain"
                source={{
                  headers: { Authorization: `Bearer ${token}` },
                  uri,
                }}
              />
            </Animated.View>
          </Animated.View>
        </GestureDetector>

        {/* PopPressable spreads `style` onto its inner Pressable, so the
            positioning has to sit on a wrapper or it resolves against the
            centred flow instead of the screen. */}
        <View style={styles.closeSlot} pointerEvents="box-none">
          <PopPressable onPress={onClose} hitSlop={Spacings.md}>
            <XIcon height={32} width={32} color="#FCFBF8" />
          </PopPressable>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeSlot: {
    position: 'absolute',
    top: 64,
    right: 20,
  },
});
