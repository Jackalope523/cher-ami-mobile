import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { Spacings } from '@/constants/Spacings';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInRight,
  SlideOutRight,
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

  const offset = useSharedValue(0);
  const pullBack = useSharedValue(true);

  useEffect(() => {
    offset.value = 0;
    pullBack.value = true;
  }, [offset, pullBack]);

  const maximumModalWidth = styles.container.width * 0.8;

  const pan = Gesture.Pan()
    .onChange((event) => {
      const translationX = event.translationX;
      const floor = -100;

      if (translationX > 0) {
        offset.value = translationX;
      } else if (translationX > floor) {
        const dampenedX =
          -translationX + (1 / (4 * floor)) * Math.pow(translationX, 2);

        offset.value = -dampenedX;
      }

      pullBack.value = event.velocityX <= 1000;
    })
    .onFinalize(() => {
      offset.value = withTiming(pullBack.value ? 0 : 1000);
      !pullBack.value && runOnJS(closeDrawer)();
    });

  const swipeable = useAnimatedStyle(() => {
    const translateX = offset.value;
    const excess = Math.max(0, translateX - Spacings.lg);
    return {
      paddingRight: Spacings.lg,
      marginRight: -excess,
      maxWidth: maximumModalWidth,
    };
  });

  function openDrawer(contents: React.ReactNode) {
    Keyboard.dismiss();
    offset.value = 0;
    pullBack.value = true;
    setContents(contents);
    setOpen(true);
  }

  function closeDrawer() {
    setOpen(false);
  }

  return (
    <DrawerModalContext.Provider value={{ openDrawer, closeDrawer }}>
      {open && (
        <View style={[styles.container, { zIndex: 5 }]}>
          <Pressable style={styles.pressableBackdrop} onPress={closeDrawer}>
            <Animated.View
              style={styles.backdrop}
              entering={FadeIn}
              exiting={FadeOut}
            />
          </Pressable>

          <GestureDetector gesture={pan}>
            <Animated.View
              style={[styles.drawer, swipeable]}
              entering={SlideInRight}
              exiting={SlideOutRight}>
              {contents}
            </Animated.View>
          </GestureDetector>
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
    zIndex: 10,
    position: 'absolute',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    bottom: 0,
    right: 0,
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

  drawer: {
    zIndex: 1,
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingHorizontal: Spacings.lg,
    borderLeftWidth: 2,
    borderColor: Colors.brown800,
    backgroundColor: Colors.canarySand,
    bottom: 0,
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
    backgroundColor: Colors.brown800,
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
