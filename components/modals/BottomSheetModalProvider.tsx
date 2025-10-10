import { borderRadius } from '@/constants/Borders';
import { createContext, ReactNode, useContext, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

interface BottomSheetModalProviderProps {
  children: ReactNode;
}

interface BottomSheetModalInterface {
  dismissBottomSheet(): void;
  displayBottomSheet(contents: ReactNode): void;
}

const BottomSheetModalContext = createContext<BottomSheetModalInterface | null>(
  null,
);

export const useBottomSheetModal = () => {
  const context = useContext(BottomSheetModalContext);

  if (!context) {
    throw new Error(
      'useBottomSheetModal must be used within a BottomSheetModalProvider',
    );
  }

  return {
    dismissBottomSheetModal: context.dismissBottomSheet,
    displayBottomSheet: context.displayBottomSheet,
  };
};

export default function BottomSheetModalProvider({
  children,
}: BottomSheetModalProviderProps) {
  const [open, setOpen] = useState<ReactNode>();

  function dismissBottomSheet() {
    setOpen(undefined);
  }

  function displayBottomSheet(contents: ReactNode) {
    Keyboard.dismiss();

    setOpen(contents);
  }

  return (
    <BottomSheetModalContext.Provider
      value={{
        dismissBottomSheet,
        displayBottomSheet,
      }}>
      {open && (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 10,
          }}>
          <Pressable
            style={styles.pressableBackdrop}
            onPress={dismissBottomSheet}>
            <Animated.View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
              }}
              entering={FadeIn}
              exiting={FadeOut}
            />
          </Pressable>

          <Animated.View
            style={{
              zIndex: 1,
              position: 'absolute',
              width: Dimensions.get('window').width,
              padding: 20,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              backgroundColor: '#FCFBF8',
              bottom: 0,
            }}
            entering={SlideInDown}
            exiting={SlideOutDown}>
            {open}
          </Animated.View>
        </View>
      )}
      {children}
    </BottomSheetModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  pressableBackdrop: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
