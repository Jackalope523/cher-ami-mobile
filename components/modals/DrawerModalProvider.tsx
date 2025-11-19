import { createContext, ReactNode, useContext, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInLeft,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface DrawerModalProviderProps {
  children: ReactNode;
}

interface DrawerModalInterface {
  openDrawer(contents: ReactNode): void;
  closeDrawer(): void;
}

const DrawerModalContext = createContext<DrawerModalInterface | null>(null);

export default function DrawerProvider({ children }: DrawerModalProviderProps) {
  const [open, setOpen] = useState(false);
  const [contents, setContents] = useState<ReactNode>();

  ///////
  // Swipeable Modal
  //////////////////

  const offset = useSharedValue<number>(0);
  const minOffset = -Dimensions.get('window').width;
  const dismissThreshold = -Dimensions.get('window').width * 0.25;
  const pan = Gesture.Pan()
    .onBegin(() => {})
    .onChange((event) => {
      offset.value = clamp(event.translationX, minOffset, 0);
    })
    .onFinalize(() => {
      if (offset.value < dismissThreshold) {
        runOnJS(closeDrawer)();
      } else {
        offset.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  function openDrawer(contents: React.ReactNode) {
    Keyboard.dismiss();
    offset.value = 0;
    setContents(contents);
    setOpen(true);
  }

  function closeDrawer() {
    setOpen(false);
  }

  return (
    <DrawerModalContext.Provider value={{ openDrawer, closeDrawer }}>
      {open && (
        <View style={styles.container}>
          <Animated.View
            style={styles.background}
            entering={FadeIn}
            exiting={FadeOut}
          />

          <GestureDetector gesture={pan}>
            <Animated.View
              style={[styles.drawer, animatedStyle]}
              entering={SlideInLeft}
              exiting={SlideOutLeft}>
              {contents}
            </Animated.View>
          </GestureDetector>

          <Pressable onPress={closeDrawer} style={styles.pressable} />
        </View>
      )}
      {children}
    </DrawerModalContext.Provider>
  );
}

export function useDrawerModal() {
  const context = useContext(DrawerModalContext);

  if (!context) {
    throw new Error('useDrawerModal must be used within a DrawerModalProvider');
  }

  return {
    openDrawer: context.openDrawer,
    closeDrawer: context.closeDrawer,
  };
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: Dimensions.get('window').width / 4,
    backgroundColor: '#FCFBF8',
  },

  pressable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: Dimensions.get('window').width * 0.75,
    right: 0,
  },

  pullIndicatorContainer: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },

  pullIndicator: {
    height: Dimensions.get('window').height / 4,
    width: 4,
    borderRadius: 100,
    backgroundColor: '#372E2E',
  },
});
